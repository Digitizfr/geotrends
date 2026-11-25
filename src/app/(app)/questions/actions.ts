'use server'

import { refresh, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { budgetDisponible } from '@/lib/couts'
import { cleEtiquettesAuto, etiqueterQuestions, nettoyerTheme } from '@/lib/etiquettes'
import { MOTEURS, type Moteur } from '@/lib/fournisseurs/types'
import { estIntention, METHODE } from '@/lib/mesures'
import { prisma } from '@/lib/prisma'
import { projetCourant } from '@/lib/projets'
import { lancerReleves } from '@/lib/releves'
import { exigerSession } from '@/lib/session'

const INTERFACES = MOTEURS.filter((m) => METHODE[m] === 'interface') as Moteur[]
const FOIS = [5, 10, 25]

/**
 * Étiquette les questions du projet affiché (thème et intention). Appel payant,
 * déclenché par la personne connectée : son prix est écrit sur le bouton. Au
 * premier clic, les questions ajoutées ensuite s'étiquettent toutes seules ;
 * cela se coupe sur l'écran Questions.
 */
export async function etiqueterLesQuestions() {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet || !(await budgetDisponible())) return
  await etiqueterQuestions(projet.id)
  await prisma.reglage.upsert({ where: { cle: cleEtiquettesAuto(projet.id) }, create: { cle: cleEtiquettesAuto(projet.id), valeur: '1' }, update: {} })
  refresh()
}

/** Active ou coupe l'étiquetage automatique des questions ajoutées au projet affiché. */
export async function reglerEtiquettesAuto(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet) return
  const valeur = donnees.get('auto') === '1' ? '1' : '0'
  await prisma.reglage.upsert({ where: { cle: cleEtiquettesAuto(projet.id) }, create: { cle: cleEtiquettesAuto(projet.id), valeur }, update: { valeur } })
  revalidatePath('/questions')
}

/** Corrige à la main le thème et l'intention d'une question. Le modèle n'y touchera plus. Gratuit. */
export async function corrigerEtiquettes(donnees: FormData) {
  await exigerSession()
  const id = String(donnees.get('questionId') ?? '')
  const theme = nettoyerTheme(String(donnees.get('theme') ?? ''))
  const intention = donnees.get('intention')
  if (!(await prisma.question.findUnique({ where: { id }, select: { id: true } }))) return
  await prisma.question.update({ where: { id }, data: { theme: theme || null, intention: estIntention(intention) ? intention : null, etiquetteMain: true, etiqueteLe: new Date() } })
  refresh()
}

/**
 * Action sur plusieurs questions cochées dans la liste : archiver, changer le
 * thème (gratuits), ou lancer un relevé pour la sélection (payant : le prix
 * exact est écrit sur le bouton, et confirmé dans une fenêtre).
 */
export async function agirSurSelection(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const faire = String(donnees.get('faire') ?? '')
  if (!projet) return
  const ids = [...new Set(donnees.getAll('q').map(String))]
  const questions = await prisma.question.findMany({ where: { id: { in: ids }, projetId: projet.id, archive: false }, select: { id: true, _count: { select: { releves: true } } } })
  if (questions.length === 0) redirect('/questions')

  if (faire === 'archiver') {
    // Une question jamais relevée n'a pas d'historique à garder : elle est retirée.
    const jamais = questions.filter((q) => q._count.releves === 0).map((q) => q.id)
    await prisma.$transaction([
      prisma.question.deleteMany({ where: { id: { in: jamais } } }),
      prisma.question.updateMany({ where: { id: { in: questions.map((q) => q.id).filter((id) => !jamais.includes(id)) } }, data: { archive: true } }),
    ])
    refresh()
    redirect(`/questions?fait=archive&n=${questions.length}`)
  }
  if (faire === 'theme') {
    const theme = nettoyerTheme(String(donnees.get('theme') ?? ''))
    if (theme) await prisma.question.updateMany({ where: { id: { in: questions.map((q) => q.id) } }, data: { theme, etiquetteMain: true, etiqueteLe: new Date() } })
    refresh()
    redirect(`/questions?fait=theme&n=${questions.length}`)
  }
  if (faire === 'partager') {
    // Ouvre l'écran Partages avec ces questions déjà cochées.
    redirect(`/partages?nouveau=1&q=${questions.map((q) => q.id).join(',')}#formulaire`)
  }
  if (faire === 'lancer') {
    if (!(await budgetDisponible())) redirect('/questions?erreur=plafond')
    const bilan = await lancerReleves(questions.map((q) => q.id), INTERFACES)
    refresh()
    redirect(`/questions?fait=lance&n=${bilan.lances}`)
  }
  redirect('/questions')
}

/**
 * Mesure approfondie : pose une question 5, 10 ou 25 fois de suite aux IA
 * d'interface cochées. Appel payant, déclenché par la personne connectée, au
 * prix exact écrit sur le bouton. Les réponses reviennent par la collecte
 * habituelle. Ces relevés comptent pour le verdict de la question, pas dans les
 * chiffres d'ensemble du projet.
 */
export async function lancerMesureApprofondie(donnees: FormData) {
  await exigerSession()
  const id = String(donnees.get('questionId') ?? '')
  const fois = Number(donnees.get('fois'))
  const moteurs = INTERFACES.filter((m) => donnees.get(`moteur_${m}`) === 'on')
  const question = await prisma.question.findUnique({ where: { id }, select: { id: true, archive: true } })
  if (!question || question.archive || !FOIS.includes(fois) || moteurs.length === 0) redirect(`/questions/${id}?erreur=vide#approfondie`)
  if (!(await budgetDisponible())) redirect(`/questions/${id}?erreur=plafond#approfondie`)
  const bilan = await lancerReleves([id], moteurs, { fois, approfondi: true })
  refresh()
  redirect(`/questions/${id}?lance=${bilan.lances}#approfondie`)
}
