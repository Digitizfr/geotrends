'use client'

import { useT } from '@/lib/i18n/client'
import { AnimatedCounter } from './arc/animated-counter/animated-counter'
import { BarChart } from './arc/bar-chart/bar-chart'
import { GrapheLignes, SERIES, type Repere } from './GrapheLignes'

/*
 * Graphiques de l'outil. Les courbes sont dessinées par GrapheLignes (la même
 * grammaire sur tous les écrans) ; les barres par jour, les petites tendances
 * et les compteurs viennent de la bibliothèque Arc.
 */

export { GrapheLignes, SERIES }
export type { Repere }
export type { MesureG, SerieG } from './GrapheLignes'

export type PointCourbe = { cle: string; libelle: string; court: string }
export type SerieCourbe = {
  cle: string
  nom: string
  /** Réponses avec la marque, par jour de relevé. null : pas de relevé ce jour-là. */
  k: (number | null)[]
  /** Réponses reçues, par jour de relevé. */
  n: (number | null)[]
  couleur?: string
  pointille?: boolean
}

/**
 * Courbe d'une part (de 0 à 100 %) relevé après relevé, pour les écrans qui
 * n'ont qu'une mesure à montrer. Mêmes gestes que le grand graphique de la vue
 * d'ensemble : point par relevé, bulle au survol, légende cliquable, repères,
 * téléchargement. « bande » trace la marge d'erreur autour d'une série.
 */
export function Courbe({ titre, points, series, hauteur = 280, vide, bande, reperes = [], csv, mesure, echantillon }: { titre: string; points: PointCourbe[]; series: SerieCourbe[]; hauteur?: number; vide?: string; bande?: { cle: string } | null; reperes?: Repere[]; /** Nom du fichier CSV (sans extension). */ csv?: string; /** Nom de la mesure : « Visibilité » par défaut. */ mesure?: string; echantillon?: string }) {
  const { t } = useT()
  return (
    <GrapheLignes
      titre={titre}
      hauteur={hauteur}
      vide={vide}
      reperes={reperes}
      csv={csv}
      optionPas={points.length > 2}
      mesures={[{
        cle: 'visibilite',
        libelle: mesure ?? t('Visibilité'),
        unite: 'part',
        jours: points.map((p) => p.cle),
        echantillon: echantillon ?? t('réponses'),
        series: series.map((s) => ({ cle: s.cle, nom: s.nom, couleur: s.couleur, pointille: s.pointille, k: s.k, n: s.n, bande: bande?.cle === s.cle })),
      }]}
    />
  )
}

/**
 * Petite tendance d'une tuile ou d'une ligne de tableau : un trait, un point
 * par relevé, le dernier plein. Au survol, les valeurs de chaque relevé.
 * Avec un seul relevé : un point, et on le dit.
 */
export function Tendance({ valeurs, libelles, titre, largeur = 96, hauteur = 26, court = false }: { valeurs: number[]; libelles?: string[]; titre: string; largeur?: number; hauteur?: number; court?: boolean }) {
  const { t, f } = useT()
  if (valeurs.length === 0) return null
  if (valeurs.length === 1) {
    return (
      <span className={`second inline-flex items-center gap-1.5 ${court ? 'whitespace-nowrap' : ''}`} title={t('Un seul relevé : c’est un échantillon. La tendance se tracera au prochain.')}>
        <svg className="shrink-0" width="14" height="12" viewBox="0 0 14 12" role="img" aria-label={t('Un seul relevé')}>
          <line x1="0" x2="14" y1="11.5" y2="11.5" stroke="rgba(20,32,27,.3)" />
          <circle cx="7" cy="5" r="3" fill="#14201b" />
        </svg>
        {court ? t('1 relevé') : t('1 relevé : la tendance viendra au prochain')}
      </span>
    )
  }
  const max = Math.max(...valeurs, 1)
  const min = Math.min(...valeurs, 0)
  const x = (i: number) => 3 + (i / (valeurs.length - 1)) * (largeur - 6)
  const y = (v: number) => 3 + (1 - (v - min) / (max - min || 1)) * (hauteur - 7)
  const detail = valeurs.map((v, i) => `${libelles?.[i] ? `${libelles[i]} : ` : ''}${f.pc(v)}`).join(' · ')
  return (
    <svg className="mini-tendance" width={largeur} height={hauteur} viewBox={`0 0 ${largeur} ${hauteur}`} role="img" aria-label={`${titre} : ${detail}`}>
      <title>{`${titre} : ${detail}`}</title>
      <line x1="0" x2={largeur} y1={hauteur - 0.5} y2={hauteur - 0.5} stroke="rgba(20,32,27,.22)" />
      <polyline points={valeurs.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')} fill="none" stroke="#14201b" strokeWidth="1.5" strokeLinejoin="round" />
      {valeurs.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === valeurs.length - 1 ? 2.6 : 1.8} fill={i === valeurs.length - 1 ? '#14201b' : '#fffdf8'} stroke="#14201b" strokeWidth="1.2" />)}
    </svg>
  )
}

/** Compteur animé d'un chiffre clé. Le texte complet reste lisible par un lecteur d'écran. */
export function Compteur({ valeur, suffixe = '', prefixe = '', decimales = 0 }: { valeur: number; suffixe?: string; prefixe?: string; decimales?: number }) {
  const { f } = useT()
  // « 4 % » en français, « 4% » en anglais.
  const fin = suffixe.trim() === '%' ? (f.langue === 'fr' ? '\u00a0%' : '%') : suffixe.replace(/^ /, '\u00a0')
  return (
    <span className="compteur-arc inline-block align-top text-[1.75rem]">
      <AnimatedCounter value={valeur} suffix={fin} prefix={prefixe} decimals={decimales} animateOnView locale={f.locale} />
    </span>
  )
}

/** Dépense par jour, en barres. Les montants arrivent en centimes de dollar pour garder une échelle lisible. */
export function BarresParJour({ jours, titre, periode }: { jours: { cle: string; libelle: string; court?: string; centimes: number }[]; titre: string; periode: string }) {
  const { t, f } = useT()
  // Sous dix centimes, quatre décimales : un relevé coûte environ un dixième de centime.
  const dollars = (c: number) => f.usd(c / 100, c > 0 && c < 10 ? 4 : 2)
  return (
    <BarChart
      label={titre}
      period={periode}
      averageLabel={t('Moyenne par jour')}
      averageShort={t('Moy.')}
      valueLabel={t('Dépense du jour')}
      categoryLabel={t('Jour')}
      height={190}
      formatValue={dollars}
      data={jours.map((j) => ({ key: j.cle, label: j.libelle, axisLabel: j.court, value: j.centimes }))}
    />
  )
}
