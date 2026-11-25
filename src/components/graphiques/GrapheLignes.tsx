'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Aide } from '@/components/outil/Aide'
import { IcoTelecharger } from '@/components/outil/Icones'
import { useT } from '@/lib/i18n/client'

/*
 * Le graphique en courbes de l'outil, le même sur tous les écrans : un point
 * visible par relevé, des segments droits (jamais lissés), une bulle au
 * survol (date, valeur, nombre de relevés, marge d'erreur), un trait vertical
 * qui suit le pointeur, une légende cliquable, le choix de la mesure et du
 * pas, la période précédente en pointillé, les concurrents suivis, des repères
 * verticaux datés et le téléchargement des données.
 *
 * Règles d'honnêteté tenues ici : une série sans relevé un jour donné laisse
 * un trou (jamais un zéro) ; avec un seul relevé on montre le point et on dit
 * que c'est un échantillon ; l'axe des parts part de zéro ; Claude, mesuré par
 * l'API, a toujours son propre graphique (c'est l'écran qui en décide).
 */

/** Couleurs des séries, vérifiées sur le papier. La première est toujours notre marque, à l'encre. */
export const SERIES = ['#14201b', '#1f5fa8', '#c07a00', '#c0508f', '#2a93a6', '#6b4f3a']

export type SerieG = {
  cle: string
  nom: string
  couleur?: string
  pointille?: boolean
  /** Numérateur par jour (réponses avec la marque, somme des rangs, nombre de citations) ; null : pas de relevé ce jour-là. */
  k: (number | null)[]
  /** Dénominateur par jour : la taille de l'échantillon. */
  n: (number | null)[]
  /** Série d'un concurrent suivi : montrée seulement si l'option est cochée. */
  concurrent?: boolean
  /** Trace la marge d'erreur autour de cette série (mesure en part). */
  bande?: boolean
}

export type MesureG = {
  cle: string
  libelle: string
  /** Comment la mesure est calculée (bulle d'aide). */
  aide?: string
  /** « part » : k/n en % ; « rang » : k/n, le 1er en haut ; « nombre » : k. */
  unite: 'part' | 'rang' | 'nombre'
  /** Jours de relevé (« 2026-11-14 »), dans l'ordre. */
  jours: string[]
  series: SerieG[]
  /** La série principale sur la période d'avant, recalée sur les dates de la période affichée. */
  precedente?: { jours: string[]; k: number[]; n: number[] }
  /** Ce que compte n, au pluriel : « réponses ». */
  echantillon: string
  /** Ce qu'on écrit à la place du graphique quand la mesure n'a aucune valeur. */
  vide?: string
}

export type Repere = {
  /** Jour du repère (« 2026-11-14 »), à l'heure de Paris. */
  jour: string
  /** « modele » : une IA a changé de modèle. « action » : une action de la liste de travail a été faite. « approfondi » : une mesure approfondie. */
  genre: 'modele' | 'action' | 'approfondi'
  texte: string
  lien?: string
}

const dernierConnu = (v: (number | null)[]) => [...v].reverse().find((x) => x !== null) ?? null
const temps = (cle: string) => Date.parse(`${cle}T12:00:00Z`)
const lundi = (cle: string) => {
  const d = new Date(temps(cle))
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7))
  return d.toISOString().slice(0, 10)
}

/** Intervalle de confiance à 95 % d'une part (méthode de Wilson), en %. La même formule que src/lib/mesures.ts. */
function marge(k: number, n: number) {
  if (n <= 0) return null
  const z = 1.96
  const p = k / n
  const d = 1 + (z * z) / n
  const centre = (p + (z * z) / (2 * n)) / d
  const demi = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d
  return { bas: Math.max(0, centre - demi) * 100, haut: Math.min(1, centre + demi) * 100 }
}

const valeur = (unite: MesureG['unite'], k: number | null, n: number | null) => (k === null || n === null || (unite !== 'nombre' && n === 0) ? null : unite === 'part' ? (k / n) * 100 : unite === 'rang' ? k / n : k)

/** Regroupe les jours par semaine (du lundi) : les numérateurs et les échantillons s'additionnent. */
function parSemaine(jours: string[], ks: (number | null)[], ns: (number | null)[]) {
  const semaines = [...new Set(jours.map(lundi))]
  const k: (number | null)[] = semaines.map(() => null)
  const n: (number | null)[] = semaines.map(() => null)
  jours.forEach((j, i) => {
    if (ks[i] === null || ns[i] === null) return
    const s = semaines.indexOf(lundi(j))
    k[s] = (k[s] ?? 0) + ks[i]!
    n[s] = (n[s] ?? 0) + ns[i]!
  })
  return { jours: semaines, k, n }
}

const plafondRond = (max: number, unite: MesureG['unite']) => {
  if (unite === 'part') return [10, 20, 40, 60, 80, 100].find((x) => x >= max) ?? 100
  const pas = [4, 8, 12, 20, 40, 60, 100, 200, 400, 1000].find((x) => x >= max)
  return pas ?? Math.ceil(max / 500) * 500
}

export function GrapheLignes({ titre, mesures, reperes = [], hauteur = 300, csv, vide, optionPas = true, optionPrecedente = false, optionConcurrents = false, lienConcurrents }: {
  /** Nom du graphique pour les lecteurs d'écran. */
  titre: string
  mesures: MesureG[]
  reperes?: Repere[]
  hauteur?: number
  /** Nom du fichier CSV téléchargé (sans extension). Sans lui, pas de bouton. */
  csv?: string
  vide?: string
  optionPas?: boolean
  optionPrecedente?: boolean
  optionConcurrents?: boolean
  /** Où suivre des concurrents, quand il n'y en a aucun. */
  lienConcurrents?: string
}) {
  const { t, f } = useT()
  const id = useId()
  const cadre = useRef<HTMLDivElement>(null)
  const [largeur, setLargeur] = useState(880)
  const [cleMesure, setCleMesure] = useState(mesures[0]?.cle)
  const [pas, setPas] = useState<'releve' | 'semaine'>('releve')
  const [avecPrecedente, setAvecPrecedente] = useState(false)
  const [avecConcurrents, setAvecConcurrents] = useState(false)
  const [masquees, setMasquees] = useState<string[]>([])
  const [survol, setSurvol] = useState<number | null>(null)

  useEffect(() => {
    const el = cadre.current
    if (!el) return
    const veille = new ResizeObserver(() => setLargeur(Math.max(280, Math.round(el.clientWidth))))
    veille.observe(el)
    return () => veille.disconnect()
  }, [])

  const mesure = mesures.find((m) => m.cle === cleMesure) ?? mesures[0]

  const donnees = useMemo(() => {
    if (!mesure) return null
    const semaine = pas === 'semaine'
    const base = semaine ? parSemaine(mesure.jours, mesure.jours.map(() => 0), mesure.jours.map(() => 0)).jours : mesure.jours
    const series = mesure.series.map((s, i) => {
      const { k, n } = semaine ? parSemaine(mesure.jours, s.k, s.n) : { k: s.k, n: s.n }
      return { ...s, k, n, couleur: s.couleur ?? SERIES[Math.min(i, SERIES.length - 1)], v: k.map((x, j) => valeur(mesure.unite, x, n[j])) }
    })
    let precedente: { t: number[]; k: number[]; n: number[]; v: (number | null)[] } | null = null
    if (mesure.precedente && mesure.precedente.jours.length > 0) {
      const p = semaine ? parSemaine(mesure.precedente.jours, mesure.precedente.k, mesure.precedente.n) : mesure.precedente
      const k = p.k.map((x) => x ?? 0)
      const n = p.n.map((x) => x ?? 0)
      precedente = { t: p.jours.map(temps), k, n, v: k.map((x, j) => valeur(mesure.unite, x, n[j])) }
    }
    return { jours: base, t: base.map(temps), series, precedente }
  }, [mesure, pas])

  if (!mesure || !donnees || donnees.jours.length === 0 || mesure.series.length === 0) {
    return <p className="second p-4">{vide ?? t('Aucun relevé sur cette période.')}</p>
  }

  const aConcurrents = mesure.series.some((s) => s.concurrent)
  const visibles = donnees.series.filter((s) => !masquees.includes(s.cle) && (!s.concurrent || avecConcurrents))
  const montrerPrecedente = avecPrecedente && !!donnees.precedente
  const sansDonnee = visibles.every((s) => s.v.every((v) => v === null))
  const seul = donnees.jours.length === 1
  const etroit = largeur < 560
  // Un seul relevé : un point suffit, pas besoin de toute la hauteur.
  const H = seul ? Math.min(hauteur, 180) : etroit ? Math.min(hauteur, 240) : hauteur
  const G = { haut: reperes.length > 0 ? 24 : 12, droite: 14, bas: 26, gauche: mesure.unite === 'part' ? 44 : 34 }
  const L = largeur - G.gauche - G.droite
  const Ht = H - G.haut - G.bas

  // Axe du temps : proportionnel aux dates. Un seul jour : au milieu.
  const tousTemps = [...donnees.t, ...(montrerPrecedente ? donnees.precedente!.t : [])]
  const t0 = Math.min(...tousTemps)
  const t1 = Math.max(...tousTemps)
  const x = (ms: number) => G.gauche + (t1 === t0 ? L / 2 : ((ms - t0) / (t1 - t0)) * L)

  // Axe des valeurs : les parts et les nombres partent de zéro ; pour un rang, le 1er est en haut.
  const principale = visibles.find((s) => s.bande && mesure.unite === 'part')
  const bande = principale ? principale.k.map((k, j) => (k === null || principale.n[j] === null ? null : marge(k, principale.n[j]!))) : null
  const toutes = [...visibles.flatMap((s) => s.v), ...(montrerPrecedente ? donnees.precedente!.v : []), ...(bande ?? []).map((b) => b?.haut ?? null)].filter((v): v is number => v !== null)
  const maxV = toutes.length ? Math.max(...toutes) : 0
  const rang = mesure.unite === 'rang'
  const plafond = rang ? Math.max(3, Math.ceil(maxV)) : plafondRond(Math.max(maxV, mesure.unite === 'part' ? 10 : 4), mesure.unite)
  const plancher = rang ? 1 : 0
  const y = (v: number) => (rang ? G.haut + ((v - plancher) / (plafond - plancher)) * Ht : G.haut + Ht - ((v - plancher) / (plafond - plancher)) * Ht)
  const graduations = rang
    ? Array.from({ length: plafond }, (_, i) => i + 1).filter((v) => plafond <= 6 || v === 1 || v % Math.ceil(plafond / 5) === 0)
    : Array.from({ length: 5 }, (_, i) => (plafond / 4) * i)

  const ecrire = (v: number | null) => (v === null ? '—' : mesure.unite === 'part' ? f.pc(v) : mesure.unite === 'rang' ? f.nombre(v, 1) : f.nombre(v))
  const ecrireAxe = (v: number) => (mesure.unite === 'part' ? f.pc(v) : f.nombre(v))
  const jourEcrit = (cle: string, long = false) => {
    const d = new Date(temps(cle))
    const texte = long ? f.jourLong(d) : f.jourCourt(d)
    return pas === 'semaine' ? t('sem. du {date}', { date: texte }) : texte
  }
  const detail = (k: number | null, n: number | null) => {
    if (k === null || n === null) return t('pas de relevé')
    if (mesure.unite === 'part') {
      const m = marge(k, n)
      return `${t('{k} sur {n}', { k, n })} ${mesure.echantillon}${m && n >= 5 ? ` · ${t('marge {bas} à {haut}', { bas: f.pc(m.bas), haut: f.pc(m.haut) })}` : ''}`
    }
    if (mesure.unite === 'rang') return t('rang connu dans {n} [n:réponse|réponses]', { n })
    return t('dans {n} [n:réponse|réponses]', { n })
  }

  // Dates de l'axe : on saute celles qui se chevaucheraient.
  const etiquettes: number[] = []
  donnees.t.forEach((ms, i) => {
    const dernier = etiquettes.at(-1)
    if (dernier === undefined || x(ms) - x(donnees.t[dernier]) >= (pas === 'semaine' ? 96 : 58)) etiquettes.push(i)
  })

  // Repères : un code (M1, A1, P1) et une place sur l'axe du temps.
  const comptes = { modele: 0, action: 0, approfondi: 0 }
  const lettres = { modele: 'M', action: 'A', approfondi: 'P' }
  const places = [...reperes]
    .sort((a, b) => a.jour.localeCompare(b.jour))
    .map((r) => {
      const ms = temps(r.jour)
      return { ...r, code: `${lettres[r.genre]}${++comptes[r.genre]}`, ms, dedans: !seul && ms >= t0 && ms <= t1 }
    })

  const chemin = (v: (number | null)[], ts: number[]) => {
    let d = ''
    let leve = true
    v.forEach((val, i) => {
      if (val === null) { leve = true; return }
      d += `${leve ? 'M' : 'L'}${x(ts[i]).toFixed(1)},${y(val).toFixed(1)} `
      leve = false
    })
    return d.trim()
  }

  const viser = (clientX: number) => {
    const boite = cadre.current?.getBoundingClientRect()
    if (!boite) return
    const px = clientX - boite.left
    let proche = 0
    donnees.t.forEach((ms, i) => {
      if (Math.abs(x(ms) - px) < Math.abs(x(donnees.t[proche]) - px)) proche = i
    })
    setSurvol(proche)
  }
  const actif = survol !== null && survol < donnees.jours.length ? survol : null
  const xActif = actif !== null ? x(donnees.t[actif]) : 0

  const telecharger = () => {
    const sep = f.langue === 'fr' ? ';' : ','
    const nombre = (v: number | null) => (v === null ? '' : f.langue === 'fr' ? String(Math.round(v * 100) / 100).replace('.', ',') : String(Math.round(v * 100) / 100))
    const cellule = (v: string) => (/[";,\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
    const tete = [pas === 'semaine' ? t('Semaine du') : t('Date du relevé'), ...visibles.flatMap((s) => [`${s.nom} (${mesure.libelle})`, `${s.nom} (${mesure.unite === 'rang' ? t('somme des rangs') : mesure.unite === 'part' ? t('réponses avec la marque') : t('nombre')})`, `${s.nom} (${t('taille de l’échantillon')})`])]
    const lignes = donnees.jours.map((j, i) => [j, ...visibles.flatMap((s) => [nombre(s.v[i]), s.k[i] === null ? '' : String(s.k[i]), s.n[i] === null ? '' : String(s.n[i])])])
    const texte = '﻿' + [tete, ...lignes].map((l) => l.map(cellule).join(sep)).join('\r\n') + '\r\n'
    const lien = document.createElement('a')
    lien.href = URL.createObjectURL(new Blob([texte], { type: 'text/csv;charset=utf-8' }))
    lien.download = `${csv}-${mesure.cle}.csv`
    lien.click()
    URL.revokeObjectURL(lien.href)
  }

  const outils = mesures.length > 1 || optionPas || optionPrecedente || optionConcurrents || csv
  return (
    <div>
      {outils && (
        <div className="graphe-outils">
          {mesures.length > 1 && (
            <div className="segments" role="group" aria-label={t('Mesure affichée')}>
              {mesures.map((m) => (
                <button key={m.cle} type="button" className="segment" aria-pressed={m.cle === mesure.cle} onClick={() => { setCleMesure(m.cle); setSurvol(null) }}>{m.libelle}</button>
              ))}
            </div>
          )}
          {mesure.aide && <Aide>{mesure.aide}</Aide>}
          {optionPas && (
            <div className="segments" role="group" aria-label={t('Pas du graphique')}>
              <button type="button" className="segment" aria-pressed={pas === 'releve'} onClick={() => { setPas('releve'); setSurvol(null) }}>{t('Par relevé')}</button>
              <button type="button" className="segment" aria-pressed={pas === 'semaine'} onClick={() => { setPas('semaine'); setSurvol(null) }}>{t('Par semaine')}</button>
            </div>
          )}
          {optionPrecedente && (
            <label className="case-option" title={donnees.precedente ? t('La même mesure sur la période d’avant, en pointillé') : t('Aucun relevé sur la période d’avant : rien à comparer pour l’instant')}>
              <input type="checkbox" checked={montrerPrecedente} disabled={!donnees.precedente} onChange={(e) => setAvecPrecedente(e.target.checked)} />
              {t('Période précédente')}
            </label>
          )}
          {optionConcurrents && (
            aConcurrents ? (
              <label className="case-option">
                <input type="checkbox" checked={avecConcurrents} onChange={(e) => setAvecConcurrents(e.target.checked)} />
                {t('Concurrents suivis')}
              </label>
            ) : (
              <span className="case-option !cursor-default text-[var(--encre-pale)]" title={mesure.unite === 'part' && mesure.cle === 'visibilite' ? t('Suivez un concurrent pour tracer sa courbe à côté de la vôtre') : t('Les concurrents se comparent sur la visibilité et la part de voix')}>
                <input type="checkbox" disabled />
                {t('Concurrents suivis')}
                {lienConcurrents && mesure.series.length > 0 && !mesures.some((m) => m.series.some((s) => s.concurrent)) && <a href={lienConcurrents} className="lien text-[var(--encre-douce)]">{t('en suivre')}</a>}
              </span>
            )
          )}
          {csv && (
            <button type="button" className="bouton bouton-creux bouton-petit pousse" onClick={telecharger} title={t('Télécharger les données de ce graphique (CSV)')}>
              <IcoTelecharger taille={14} />
              CSV
            </button>
          )}
        </div>
      )}

      <div
        ref={cadre}
        className="graphe-corps"
        tabIndex={0}
        role="group"
        aria-label={`${titre}. ${t('Flèches gauche et droite pour lire chaque relevé.')}`}
        onPointerMove={(e) => viser(e.clientX)}
        onPointerDown={(e) => viser(e.clientX)}
        onPointerLeave={() => setSurvol(null)}
        onBlur={() => setSurvol(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault()
            const dernier = donnees.jours.length - 1
            setSurvol((s) => (s === null ? (e.key === 'ArrowRight' ? 0 : dernier) : Math.max(0, Math.min(dernier, s + (e.key === 'ArrowRight' ? 1 : -1)))))
          } else if (e.key === 'Escape') setSurvol(null)
        }}
      >
        {sansDonnee && <p className="second flex items-center justify-center text-center" style={{ minHeight: H }}>{mesure.vide ?? t('Pas encore de donnée pour cette mesure.')}</p>}
        <svg className="graphe-svg" style={sansDonnee ? { display: 'none' } : undefined} viewBox={`0 0 ${largeur} ${H}`} height={H} role="img" aria-labelledby={`${id}-titre`}>
          <title id={`${id}-titre`}>{`${titre} : ${mesure.libelle}. ${visibles.map((s) => `${s.nom} ${ecrire(dernierConnu(s.v))}`).join(', ')}.`}</title>
          {/* Graduations : des filets, et la ligne de base à l'encre. */}
          {graduations.map((g) => (
            <g key={g}>
              <line x1={G.gauche} x2={largeur - G.droite} y1={y(g)} y2={y(g)} stroke={g === (rang ? plafond : 0) ? 'var(--encre)' : 'var(--filet)'} strokeWidth="1" shapeRendering="crispEdges" />
              <text x={G.gauche - 8} y={y(g) + 4} textAnchor="end">{ecrireAxe(g)}</text>
            </g>
          ))}
          {etiquettes.map((i) => (
            <g key={donnees.jours[i]}>
              <line x1={x(donnees.t[i])} x2={x(donnees.t[i])} y1={G.haut + Ht} y2={G.haut + Ht + 4} stroke="var(--encre)" strokeWidth="1" shapeRendering="crispEdges" />
              <text x={x(donnees.t[i])} y={H - 6} textAnchor={seul ? 'middle' : i === 0 ? 'start' : i === donnees.jours.length - 1 ? 'end' : 'middle'}>{jourEcrit(donnees.jours[i])}</text>
            </g>
          ))}

          {/* Repères verticaux : changement de modèle, action faite, mesure approfondie. */}
          {places.filter((r) => r.dedans).map((r) => (
            <g key={r.code} className="repere">
              <line x1={x(r.ms)} x2={x(r.ms)} y1={G.haut - 4} y2={G.haut + Ht} stroke="var(--encre)" strokeWidth="1" strokeDasharray="2 3" />
              <rect x={x(r.ms) - 11} y={G.haut - 19} width="22" height="14" fill="var(--surligneur)" stroke="var(--encre)" strokeWidth="1" />
              <text x={x(r.ms)} y={G.haut - 8.5} textAnchor="middle">{r.code}</text>
              <title>{`${r.code} · ${f.jourLong(new Date(r.ms))} · ${r.texte}`}</title>
            </g>
          ))}

          {/* Marge d'erreur de la série principale. */}
          {bande && !seul && bande.every((b) => b !== null) && (
            <polygon
              points={[...bande.map((b, i) => `${x(donnees.t[i]).toFixed(1)},${y(Math.min(b!.haut, plafond)).toFixed(1)}`), ...bande.map((b, i) => `${x(donnees.t[i]).toFixed(1)},${y(b!.bas).toFixed(1)}`).reverse()].join(' ')}
              fill="rgba(20,32,27,.08)"
            />
          )}

          {/* Période précédente : la même mesure, en pointillé gris. */}
          {montrerPrecedente && (
            <g>
              <path d={chemin(donnees.precedente!.v, donnees.precedente!.t)} fill="none" stroke="var(--encre-pale)" strokeWidth="1.5" strokeDasharray="3 4" />
              {donnees.precedente!.v.map((v, i) => (v === null ? null : <circle key={i} cx={x(donnees.precedente!.t[i])} cy={y(v)} r="2.5" fill="var(--clair)" stroke="var(--encre-pale)" strokeWidth="1.25" />))}
            </g>
          )}

          {/* Trait vertical qui suit le pointeur. */}
          {actif !== null && <line x1={xActif} x2={xActif} y1={G.haut} y2={G.haut + Ht} stroke="var(--encre)" strokeWidth="1" shapeRendering="crispEdges" />}

          {/* Les séries : segments droits, un point par relevé. La première (la nôtre) est dessinée en dernier, au-dessus. */}
          {[...visibles].reverse().map((s) => {
            const premiere = s === visibles[0]
            return (
              <g key={s.cle}>
                {!seul && <path d={chemin(s.v, donnees.t)} fill="none" stroke={s.couleur} strokeWidth={premiere ? 2.5 : 1.75} strokeDasharray={s.pointille ? '6 4' : undefined} strokeLinejoin="round" />}
                {s.v.map((v, i) => (v === null ? null : (
                  <circle key={i} cx={x(donnees.t[i])} cy={y(v)} r={actif === i ? 5 : premiere ? 3.75 : 3} fill={premiere && !s.pointille ? s.couleur : 'var(--clair)'} stroke={s.couleur} strokeWidth={actif === i ? 2.5 : 1.75} />
                )))}
              </g>
            )
          })}
        </svg>

        {actif !== null && !sansDonnee && (
          <div className="graphe-bulle" role="status" style={xActif > largeur * 0.55 ? { right: `${largeur - xActif + 14}px` } : { left: `${xActif + 14}px` }}>
            <p className="chiffre text-[0.75rem] font-semibold">{jourEcrit(donnees.jours[actif], true)}</p>
            {visibles.map((s) => (
              <div key={s.cle} className="rangee">
                <span className={`trait-serie ${s.pointille ? 'pointille' : ''}`} style={{ color: s.couleur }} />
                <span className="min-w-0 truncate">{s.nom}</span>
                <span className="chiffre font-semibold">{ecrire(s.v[actif])}</span>
                <span className="detail">{detail(s.k[actif], s.n[actif])}</span>
              </div>
            ))}
            {places.filter((r) => r.dedans && (pas === 'semaine' ? lundi(r.jour) === donnees.jours[actif] : r.jour === donnees.jours[actif])).map((r) => (
              <p key={r.code} className="second mt-1.5 border-t border-[var(--filet)] pt-1.5"><span className="chiffre font-semibold text-[var(--encre)]">{r.code}</span> {r.texte}</p>
            ))}
          </div>
        )}
      </div>

      {/* Légende cliquable : un clic masque ou remet une série. */}
      <div className="legende" role="group" aria-label={t('Séries affichées')}>
        {donnees.series.filter((s) => !s.concurrent || avecConcurrents).map((s) => {
          const montree = !masquees.includes(s.cle)
          return (
            <button key={s.cle} type="button" className="legende-bouton" aria-pressed={montree} title={montree ? t('Masquer cette série') : t('Afficher cette série')} onClick={() => setMasquees((m) => (montree ? (visibles.length > 1 ? [...m, s.cle] : m) : m.filter((c) => c !== s.cle)))}>
              <span className={`trait-serie ${s.pointille ? 'pointille' : ''}`} style={{ color: s.couleur }} />
              {s.nom}
              <span className="valeur">{ecrire(dernierConnu(s.v))}</span>
            </button>
          )
        })}
        {montrerPrecedente && (
          <span className="legende-bouton !cursor-default text-[var(--encre-douce)]">
            <span className="trait-serie pointille" style={{ color: 'var(--encre-pale)' }} />
            {t('Période précédente')}
          </span>
        )}
      </div>

      {(seul || places.length > 0 || (bande && !seul)) && (
        <div className="graphe-notes">
          {seul && <p><strong className="font-semibold text-[var(--encre)]">{t('Un seul relevé, le {date}.', { date: jourEcrit(donnees.jours[0], true) })}</strong> {t('C’est un échantillon, pas une tendance : la courbe se tracera au prochain relevé.')}</p>}
          {bande && !seul && <p><span className="pave" style={{ background: 'rgba(20,32,27,.11)', boxShadow: 'inset 0 0 0 1px rgba(20,32,27,.3)' }} aria-hidden="true" />{t('Bande grise : marge d’erreur de « {nom} ». Deux points dont les bandes se recouvrent ne se distinguent pas.', { nom: principale!.nom })}</p>}
          {places.length > 0 && (
            <ul aria-label={t('Repères du graphique')} className="space-y-1">
              {places.map((r) => (
                <li key={r.code} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-2">
                  <span className="chiffre font-semibold text-[var(--encre)]">{r.code}</span>
                  <span>
                    <span className="chiffre">{f.jourLong(new Date(r.ms))}</span> · {r.lien ? <a href={r.lien} className="hover:underline">{r.texte}</a> : r.texte}
                    {!r.dedans && <span className="discret"> ({seul ? t('pas de trait : un seul relevé') : t('hors de la période affichée')})</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
