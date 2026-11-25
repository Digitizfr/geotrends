import { tr } from './i18n/courante'
import { deCleJour, jourCourt, jourLong } from './libelles'
import { serie, type ReleveLu } from './mesures'

/*
 * Prépare les données d'une courbe : un point par jour de relevé, une série
 * par groupe de relevés. Une série sans réponse un jour donné porte « null » ce
 * jour-là : on ne comble jamais un trou par un zéro.
 */

export type DonneesCourbe = {
  points: { cle: string; libelle: string; court: string }[]
  series: { cle: string; nom: string; valeurs: (number | null)[]; /** Réponses avec la marque et réponses reçues, par jour : ce que lit le graphique. */ k: (number | null)[]; n: (number | null)[]; details: string[]; pointille?: boolean; couleur?: string }[]
  /** Marge d'erreur (intervalle à 95 %) de la série demandée, en %, à chaque point. */
  bande?: { cle: string; bas: number[]; haut: number[] }
}

export type GroupeCourbe = { cle: string; nom: string; releves: ReleveLu[]; present?: (r: ReleveLu) => boolean; pointille?: boolean; couleur?: string; /** Tracer la marge d'erreur autour de cette série. */ bande?: boolean }

export function courbe(groupes: GroupeCourbe[]): DonneesCourbe {
  const series = groupes.map((g) => ({ g, points: serie(g.releves, g.present) }))
  const jours = [...new Set(series.flatMap((s) => s.points.map((p) => p.jour)))].sort()
  // La bande ne se trace que si la série a une réponse à chaque date : on ne comble pas un trou.
  const avecBande = series.find(({ g, points }) => g.bande && points.length === jours.length && jours.length > 0)
  return {
    bande: avecBande ? { cle: avecBande.g.cle, bas: avecBande.points.map((p) => p.bas * 100), haut: avecBande.points.map((p) => p.haut * 100) } : undefined,
    points: jours.map((j) => ({ cle: j, libelle: jourLong(deCleJour(j)), court: jourCourt(deCleJour(j)) })),
    series: series.map(({ g, points }) => {
      const parJour = new Map(points.map((p) => [p.jour, p]))
      return {
        cle: g.cle,
        nom: g.nom,
        pointille: g.pointille,
        couleur: g.couleur,
        valeurs: jours.map((j) => (parJour.has(j) ? (parJour.get(j)!.k / parJour.get(j)!.n) * 100 : null)),
        k: jours.map((j) => parJour.get(j)?.k ?? null),
        n: jours.map((j) => parJour.get(j)?.n ?? null),
        details: jours.map((j) => (parJour.has(j) ? tr('{k} sur {n}', { k: parJour.get(j)!.k, n: parJour.get(j)!.n }) : '')),
      }
    }),
  }
}

/** Valeurs d'une petite courbe de tendance : la part, en %, à chaque jour de relevé. */
export function tendance(rs: ReleveLu[], present?: (r: ReleveLu) => boolean) {
  const points = serie(rs, present)
  return { valeurs: points.map((p) => Math.round((p.k / p.n) * 100)), libelles: points.map((p) => jourCourt(deCleJour(p.jour))) }
}

/** Début lisible d'une réponse : le Markdown retiré, coupé au bon endroit. */
export function debutDe(texte: string | null, max = 150) {
  if (!texte) return ''
  const net = texte
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Gras, italique et code s'effacent sans laisser d'espace : « **Facturo**: » reste « Facturo: ».
    .replace(/\*+|`+/g, '')
    .replace(/(^|\s)_+|_+(?=\s|[.,:;!?]|$)/g, '$1')
    // Titres, citations et tableaux deviennent des espaces.
    .replace(/[#>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return net.length > max ? `${net.slice(0, max).replace(/\s+\S*$/, '')}…` : net
}
