import { demanderJson } from './analyse'
import { budgetDisponible } from './couts'
import { nomLangue } from './marches'
import { prisma } from './prisma'

/*
 * Étiquettes des questions (fonction P2) : un thème et une intention, posés
 * par le petit modèle. Une question corrigée à la main n'est plus touchée.
 *
 * L'appel est payant (moins d'un centime pour un projet). Il part du bouton
 * « Étiqueter les questions » de l'écran Questions, puis tout seul à l'ajout
 * d'une question, tant que l'utilisateur ne l'a pas coupé.
 */

/** Prix moyen de l'étiquetage d'une question, pour l'estimation écrite sur le bouton. */
export const PRIX_ETIQUETTE_USD = 0.00008
const INTENTIONS = ['informer', 'comparer', 'acheter']
const LOT = 60

export const cleEtiquettesAuto = (projetId: string) => `etiquettes_auto:${projetId}`

/** Vrai si les questions ajoutées au projet s'étiquettent toutes seules. */
export async function etiquettesAuto(projetId: string) {
  return (await prisma.reglage.findUnique({ where: { cle: cleEtiquettesAuto(projetId) } }))?.valeur === '1'
}

/** Thème écrit proprement : sans majuscules, sans ponctuation finale, 40 caractères au plus. */
export const nettoyerTheme = (t: string) => t.replace(/\s+/g, ' ').replace(/'/g, '’').replace(/[.;:!?]+$/, '').trim().toLowerCase().slice(0, 40)

function consigne(questions: { texte: string }[], themes: string[], langue: string) {
  // Une carte des thèmes n'a de sens que si un thème réunit plusieurs questions.
  const plafond = Math.max(2, Math.min(8, Math.ceil((questions.length + themes.length) / 3)))
  return [
    'Tu ranges les questions qu’une marque suit dans les réponses des assistants IA. Pour chaque question, donne :',
    `- "theme" : la famille de sujets à laquelle la question appartient, en un à trois mots, en ${langue}, en minuscules, sans nom de marque. Un thème est une famille, pas le sujet exact de la question : par exemple « gestion d’entreprise » réunit la facturation, la comptabilité et le suivi des clients ; « marketing en ligne » réunit l’emailing, le référencement et la publicité. Il ne faut pas un thème par question : utilise au plus ${plafond} thèmes pour toute la liste, et donne exactement le même thème aux questions d’une même famille.`,
    themes.length ? `  Thèmes déjà utilisés dans ce projet, à reprendre tels quels quand ils conviennent : ${themes.join(' ; ')}.` : '',
    '- "intention" : "informer" (comprendre un sujet, apprendre comment faire), "comparer" (choisir entre plusieurs offres : le meilleur, un comparatif, un avis, « quel outil choisir ») ou "acheter" (prêt à passer à l’acte : prix, devis, essai gratuit, inscription, où acheter).',
    'Réponds uniquement par un objet JSON de cette forme, avec une entrée par question : {"questions":[{"numero":1,"theme":"…","intention":"comparer"}]}',
    '',
    '--- QUESTIONS ---',
    ...questions.map((q, i) => `${i + 1}. ${q.texte}`),
  ].filter(Boolean).join('\n')
}

export type BilanEtiquettes = { etiquetees: number; echecs: number; coutUsd: number }

/** Questions actives du projet qui n'ont pas encore de thème ou d'intention (et pas de correction à la main). */
export function aEtiqueter(projetId: string) {
  return { projetId, archive: false, etiquetteMain: false, OR: [{ theme: null }, { intention: null }] }
}

/**
 * Étiquette les questions du projet qui ne le sont pas encore. Un appel pour 60
 * questions au plus, inscrit au journal des coûts.
 */
export async function etiqueterQuestions(projetId: string): Promise<BilanEtiquettes> {
  const bilan: BilanEtiquettes = { etiquetees: 0, echecs: 0, coutUsd: 0 }
  const projet = await prisma.projet.findUnique({ where: { id: projetId }, select: { nom: true, langue: true } })
  if (!projet) return bilan
  const questions = await prisma.question.findMany({ where: aEtiqueter(projetId), orderBy: { ordre: 'asc' }, select: { id: true, texte: true } })
  for (let i = 0; i < questions.length; i += LOT) {
    const lot = questions.slice(i, i + LOT)
    if (!(await budgetDisponible())) {
      bilan.echecs += lot.length
      continue
    }
    // Les thèmes déjà posés (par le modèle ou à la main) sont proposés au modèle : la liste reste courte et stable.
    const themes = (await prisma.question.findMany({ where: { projetId, archive: false, theme: { not: null } }, distinct: ['theme'], select: { theme: true } })).map((q) => q.theme!).sort()
    const { json, coutUsd } = await demanderJson(consigne(lot, themes, nomLangue(projet.langue).toLowerCase()), { operation: 'etiquettes', projet: projet.nom, detail: { questions: lot.length }, valide: (j) => Array.isArray(j.questions) })
    bilan.coutUsd += coutUsd
    const lues = new Map<number, { theme: string; intention: string }>()
    for (const x of Array.isArray(json?.questions) ? json.questions : []) {
      const o = x && typeof x === 'object' ? (x as Record<string, unknown>) : {}
      const theme = typeof o.theme === 'string' ? nettoyerTheme(o.theme) : ''
      if (!theme || typeof o.intention !== 'string' || !INTENTIONS.includes(o.intention)) continue
      lues.set(Number(o.numero) - 1, { theme, intention: o.intention })
    }
    const maintenant = new Date()
    await prisma.$transaction(lot.flatMap((q, n) => (lues.has(n) ? [prisma.question.update({ where: { id: q.id }, data: { ...lues.get(n)!, etiqueteLe: maintenant } })] : [])))
    const faites = lot.filter((_, n) => lues.has(n)).length
    bilan.etiquetees += faites
    bilan.echecs += lot.length - faites
  }
  return bilan
}
