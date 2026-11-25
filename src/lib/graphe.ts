import type { MesureG, Repere, SerieG } from '@/components/graphiques/GrapheLignes'
import { concurrentDe, estNotreNom } from './classements'
import type { Moteur } from './fournisseurs/types'
import { tr } from './i18n/courante'
import { estDuProfil } from './releves'
import { cleJour, nomCourt } from './libelles'
import { changementsDeModele, deMethode, deMoteur, METHODE, recus, simple, type Mesures, type ReleveLu } from './mesures'

/*
 * Données du grand graphique de la vue d'ensemble : quatre mesures au choix
 * (visibilité, rang moyen, part de voix, sources à nous), chacune avec la
 * série d'ensemble et une série par IA d'interface. Pour chaque jour de
 * relevé on passe le numérateur et la taille de l'échantillon : le graphique
 * en tire la valeur, la marge d'erreur et le regroupement par semaine.
 * Jamais d'API ici : Claude a son propre graphique.
 */

type Compte = { k: number; n: number }
/** Ce qu'un relevé apporte à une mesure : null s'il ne compte pas dans l'échantillon. */
type Lecture = (r: ReleveLu) => Compte | null

function parJour(rs: ReleveLu[], lire: Lecture) {
  const jours = new Map<string, Compte>()
  for (const r of recus(rs)) {
    const c = lire(r)
    if (!c) continue
    const x = jours.get(r.jour) ?? { k: 0, n: 0 }
    x.k += c.k
    x.n += c.n
    jours.set(r.jour, x)
  }
  return jours
}

function serieDe(cle: string, nom: string, jours: string[], rs: ReleveLu[], lire: Lecture, plus: Partial<SerieG> = {}): SerieG {
  const comptes = parJour(rs, lire)
  return { cle, nom, k: jours.map((j) => comptes.get(j)?.k ?? null), n: jours.map((j) => comptes.get(j)?.n ?? null), ...plus }
}

const decaler = (jour: string, jours: number) => new Date(Date.parse(`${jour}T12:00:00Z`) + jours * 86_400_000).toISOString().slice(0, 10)

export function mesuresDuGraphe(m: Mesures): MesureG[] {
  const ui = deMethode(m.releves, 'interface')
  const avant = deMethode(m.precedents, 'interface')
  const interfaces = m.moteurs.filter((x) => METHODE[x] === 'interface')
  const jours = [...new Set(recus(ui).map((r) => r.jour))].sort()
  const dureeJours = /^\d+$/.test(m.filtres.periode) ? Number(m.filtres.periode) * 7 : 0
  const echantillon = tr('réponses')

  const aNous = (r: ReleveLu) => r.sources.filter((s) => s.role === 'citee' && (m.marque.domaines.some((d) => s.domaine === d || s.domaine.endsWith(`.${d}`)) || (!!s.videoYoutube && m.marque.chainesYoutube.some((c) => c.id === s.videoYoutube!.chaineId)) || estDuProfil(s, m.marque))).length
  const nomme = (r: ReleveLu, cle: string) => r.marques.some((x) => !estNotreNom(x.nom, m) && simple(concurrentDe(x.nom, m)?.nom ?? '') === cle)
  const suivis = m.concurrents.map((c) => ({ nom: c.nom, cle: simple(c.nom) }))
  /** Mentions de notre marque et des concurrents suivis dans une réponse dont les marques sont lues. */
  const mentions = (r: ReleveLu) => (r.present ? 1 : 0) + suivis.filter((c) => nomme(r, c.cle)).length

  const lectures: Record<string, Lecture> = {
    visibilite: (r) => ({ k: r.present ? 1 : 0, n: 1 }),
    rang: (r) => (r.rang === null ? null : { k: r.rang, n: 1 }),
    voix: (r) => (r.marquesLues ? { k: r.present ? 1 : 0, n: mentions(r) } : null),
    sources: (r) => ({ k: aNous(r), n: 1 }),
  }

  const construire = (cle: keyof typeof lectures, libelle: string, unite: MesureG['unite'], aide: string, plus: { bande?: boolean; concurrents?: (c: { nom: string; cle: string }) => Lecture } = {}): MesureG => {
    const lire = lectures[cle]
    const comptesAvant = parJour(avant, lire)
    const joursAvant = [...comptesAvant.keys()].sort()
    return {
      cle,
      libelle,
      aide,
      unite,
      jours,
      echantillon,
      series: [
        serieDe('ensemble', interfaces.length > 1 ? tr('Toutes les IA d’interface') : nomCourt(interfaces[0] ?? 'chatgpt'), jours, ui, lire, { bande: plus.bande }),
        ...(interfaces.length > 1 ? interfaces.map((x: Moteur) => serieDe(x, nomCourt(x), jours, deMoteur(ui, x), lire)) : []),
        ...(plus.concurrents ? suivis.map((c, i) => serieDe(`c:${c.cle}`, c.nom, jours, ui, plus.concurrents!(c), { concurrent: true, pointille: true, couleur: ['#a8320f', '#7b857f', '#6b4f3a', '#c0508f'][i % 4] })) : []),
      ],
      precedente: dureeJours && joursAvant.length ? { jours: joursAvant.map((j) => decaler(j, dureeJours)), k: joursAvant.map((j) => comptesAvant.get(j)!.k), n: joursAvant.map((j) => comptesAvant.get(j)!.n) } : undefined,
    }
  }

  const sansConcurrent = suivis.length === 0
  const mesures = [
    construire('visibilite', tr('Visibilité'), 'part', tr('Part des réponses d’interface où la marque est nommée ou citée. Un point par jour de relevé.'), {
      bande: true,
      concurrents: (c) => (r) => (r.marquesLues ? { k: nomme(r, c.cle) ? 1 : 0, n: 1 } : null),
    }),
    construire('rang', tr('Rang moyen'), 'rang', tr('Place moyenne de la marque parmi les marques nommées, dans les réponses où elle a un rang. Le 1er est en haut.')),
    construire('voix', tr('Part de voix'), 'part', tr('Mentions de la marque rapportées à celles de la marque et des concurrents suivis, dans les réponses dont les marques sont lues.'), {
      concurrents: (c) => (r) => (r.marquesLues ? { k: nomme(r, c.cle) ? 1 : 0, n: mentions(r) } : null),
    }),
    construire('sources', tr('Sources à nous'), 'nombre', tr('Nombre de pages du site et de vidéos de la marque citées comme sources, par jour de relevé.')),
  ]
  // Sans concurrent suivi, la part de voix vaudrait toujours 100 % : on ne la trace pas.
  return mesures.map((x) => (x.cle === 'voix' && sansConcurrent ? { ...x, series: x.series.map((s) => ({ ...s, k: s.k.map(() => null), n: s.n.map(() => null) })), precedente: undefined, vide: tr('Suivez au moins un concurrent pour calculer la part de voix.') } : x))
}

/** Repères du graphique : changement de modèle d'une IA, action faite, mesure approfondie d'une question. */
export function reperesDuGraphe(m: Mesures, methode: 'interface' | 'api', faites: { cle: string; titre: string; faitLe: Date }[] = []): Repere[] {
  const rs = deMethode(m.releves, methode)
  const reperes: Repere[] = changementsDeModele(rs).map((x) => ({ jour: x.jour, genre: 'modele' as const, texte: tr('{ia} change de modèle : {avant} devient {apres}. Une hausse ou une baisse ce jour-là peut venir de là.', { ia: nomCourt(x.moteur), avant: x.avant, apres: x.apres }) }))
  if (methode === 'api') return reperes
  for (const a of faites) reperes.push({ jour: cleJour(a.faitLe), genre: 'action', texte: tr('Action faite : {titre}', { titre: a.titre }), lien: `/actions?onglet=resultats&action=${encodeURIComponent(a.cle)}#fiche` })
  // Mesures approfondies : une question posée de nombreuses fois le même jour. Elles ne comptent pas dans la courbe.
  const approfondies = new Map<string, { jour: string; question: { id: string; texte: string }; n: number }>()
  for (const r of m.tous) {
    if (!r.approfondi || r.methode !== 'interface') continue
    const cle = `${r.jour}:${r.question.id}`
    const x = approfondies.get(cle) ?? { jour: r.jour, question: r.question, n: 0 }
    x.n++
    approfondies.set(cle, x)
  }
  for (const x of approfondies.values()) reperes.push({ jour: x.jour, genre: 'approfondi', texte: tr('Mesure approfondie ({n} relevés) : {question}', { n: x.n, question: x.question.texte }), lien: `/questions/${x.question.id}` })
  return reperes
}
