'use server'

import { refresh, revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { redirect } from 'next/navigation'
import { annoncer } from '@/lib/annonce'
import { budgetDisponible } from '@/lib/couts'
import { etiqueterQuestions, etiquettesAuto } from '@/lib/etiquettes'
import { MOTEURS, type Moteur } from '@/lib/fournisseurs/types'
import { traducteur } from '@/lib/i18n/serveur'
import { clePage, proposerQuestions, questionsDuProjet, type Proposition } from '@/lib/pages-suivies'
import { prisma } from '@/lib/prisma'
import { projetCourant } from '@/lib/projets'
import { lancerReleves } from '@/lib/releves'
import { exigerSession } from '@/lib/session'

export type ResultatLecture =
  | { ok: true; url: string; titre: string | null; sujet: string | null; mots: number; propositions: Proposition[]; echecModele: boolean; dejaSuivie: string | null; pageId: string | null }
  | { ok: false; erreur: string }
  | null

async function projetAffiche() {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet) redirect('/projets')
  return projet
}

/**
 * Lit une page et fait proposer les questions auxquelles elle répond.
 * Lecture de la page gratuite ; proposition par le petit modèle, moins d'un
 * centime, inscrite au journal des coûts. Rien n'est enregistré à ce stade.
 */
export async function lirePageEtProposer(_: ResultatLecture, donnees: FormData): Promise<ResultatLecture> {
  const projet = await projetAffiche()
  const t = await traducteur()
  const pageId = String(donnees.get('pageId') ?? '') || null
  const page = pageId ? await prisma.pageSuivie.findFirst({ where: { id: pageId, projetId: projet.id } }) : null
  const saisie = page?.url ?? String(donnees.get('url') ?? '').trim()
  if (!saisie) return { ok: false, erreur: t('Collez l’adresse d’une page.') }
  if (!(await budgetDisponible())) return { ok: false, erreur: t('Plafond du mois atteint : la page ne peut pas être lue par le petit modèle. Vous pouvez quand même écrire vos questions à la main sur sa fiche.') }
  const existantes = (await prisma.question.findMany({ where: { projetId: projet.id, archive: false }, select: { texte: true } })).map((q) => q.texte)
  const r = await proposerQuestions(saisie, projet, existantes)
  if ('erreur' in r) {
    return {
      ok: false,
      erreur:
        r.erreur === 'adresse' ? t('Cette adresse n’est pas une page publique (vérifiez qu’elle commence par https://).')
        : r.erreur === 'illisible' ? t('La page ne répond pas, ou pas avec une page lisible. Vérifiez l’adresse, ou lancez un audit de la page.')
        : t('La page ne contient presque pas de texte lisible sans JavaScript : impossible d’en tirer des questions. Un audit de la page en dira plus.'),
    }
  }
  const deja = page ?? (await prisma.pageSuivie.findUnique({ where: { projetId_cle: { projetId: projet.id, cle: r.cle } }, select: { id: true } }))
  if (deja) await prisma.pageSuivie.update({ where: { id: deja.id }, data: { luLe: new Date() } })
  return { ok: true, url: r.url, titre: r.titre, sujet: r.sujet, mots: r.mots, propositions: r.propositions, echecModele: r.echecModele, dejaSuivie: deja?.id ?? null, pageId }
}

/**
 * Suit la page avec les questions gardées : celles proposées (retouchées ou non),
 * celles ajoutées à la main et celles du projet cochées. Gratuit.
 */
export async function suivrePage(donnees: FormData) {
  const projet = await projetAffiche()
  const t = await traducteur()
  const session = await exigerSession()
  const url = String(donnees.get('url') ?? '').trim()
  const titre = String(donnees.get('titre') ?? '').trim().slice(0, 300) || null
  if (!url) redirect('/pages')
  const textes = donnees.getAll('q').map(String)
  const nouvelles = await questionsDuProjet(projet, textes)
  const cochees = donnees.getAll('existante').map(String)
  const valides = (await prisma.question.findMany({ where: { id: { in: cochees }, projetId: projet.id }, select: { id: true } })).map((q) => q.id)
  const ids = [...new Set([...nouvelles, ...valides])]
  const cle = clePage(url)
  const existante = await prisma.pageSuivie.findUnique({ where: { projetId_cle: { projetId: projet.id, cle } } })
  const page = existante
    ? await prisma.pageSuivie.update({ where: { id: existante.id }, data: { questions: [...new Set([...existante.questions, ...ids])], titre: titre ?? existante.titre, luLe: new Date() } })
    : await prisma.pageSuivie.create({ data: { projetId: projet.id, url, cle, titre, questions: ids, luLe: new Date(), auteur: session.user.name } })
  if (nouvelles.length && (await etiquettesAuto(projet.id)) && (await budgetDisponible())) after(() => etiqueterQuestions(projet.id).catch(() => undefined))
  await annoncer(ids.length ? t('Page suivie, avec {n} [n:question|questions]. Lancez le relevé pour savoir si les IA la citent.', { n: ids.length }) : t('Page suivie, sans question pour l’instant : ajoutez-en sur sa fiche.'))
  refresh()
  redirect(`/pages?fiche=${page.id}#fiche`)
}

async function pageDuProjet(donnees: FormData) {
  const projet = await projetAffiche()
  const id = String(donnees.get('pageId') ?? '')
  const page = await prisma.pageSuivie.findFirst({ where: { id, projetId: projet.id } })
  return { projet, page }
}

/** Ajoute à la page des questions écrites à la main (une par ligne) ou gardées parmi de nouvelles propositions. */
export async function ajouterQuestionsPage(donnees: FormData) {
  const { projet, page } = await pageDuProjet(donnees)
  if (!page) redirect('/pages')
  const t = await traducteur()
  const textes = [...donnees.getAll('q').map(String), ...String(donnees.get('lignes') ?? '').split(/\r?\n/)]
  const ids = await questionsDuProjet(projet, textes)
  const ajoutees = ids.filter((id) => !page.questions.includes(id))
  if (ajoutees.length) {
    await prisma.pageSuivie.update({ where: { id: page.id }, data: { questions: [...page.questions, ...ajoutees] } })
    if ((await etiquettesAuto(projet.id)) && (await budgetDisponible())) after(() => etiqueterQuestions(projet.id).catch(() => undefined))
    await annoncer(t('{n} [n:question ajoutée|questions ajoutées] à la page.', { n: ajoutees.length }))
  } else await annoncer(t('Aucune question nouvelle : elles étaient déjà rattachées à la page.'))
  refresh()
  redirect(`/pages?fiche=${page.id}#fiche`)
}

/** Retire une question de la page. Elle reste dans le projet (et son historique avec elle). */
export async function retirerQuestionPage(donnees: FormData) {
  const { page } = await pageDuProjet(donnees)
  if (!page) redirect('/pages')
  const t = await traducteur()
  const questionId = String(donnees.get('questionId') ?? '')
  await prisma.pageSuivie.update({ where: { id: page.id }, data: { questions: page.questions.filter((q) => q !== questionId) } })
  await annoncer(t('Question retirée de la page. Elle reste dans le projet.'))
  revalidatePath('/pages')
  redirect(`/pages?fiche=${page.id}#questions-page`)
}

/** Ne plus suivre la page. Ses questions restent dans le projet. */
export async function nePlusSuivre(donnees: FormData) {
  const { page } = await pageDuProjet(donnees)
  const t = await traducteur()
  if (page) {
    await prisma.pageSuivie.delete({ where: { id: page.id } })
    await annoncer(t('La page n’est plus suivie. Ses questions restent dans le projet.'))
  }
  refresh()
  redirect('/pages')
}

/** Relevé des seules questions de la page, aux IA cochées. Payant : le prix est écrit sur le bouton. */
export async function lancerPourLaPage(donnees: FormData) {
  const { page } = await pageDuProjet(donnees)
  if (!page) redirect('/pages')
  const moteurs = MOTEURS.filter((m) => donnees.get(`moteur_${m}`) === 'on') as Moteur[]
  const ids = (await prisma.question.findMany({ where: { id: { in: page.questions }, archive: false }, select: { id: true } })).map((q) => q.id)
  if (moteurs.length === 0 || ids.length === 0) redirect(`/pages?fiche=${page.id}&erreur=vide#fiche`)
  if (!(await budgetDisponible())) redirect(`/pages?fiche=${page.id}&erreur=plafond#fiche`)
  const interfaces = moteurs.filter((m) => m !== 'claude')
  let lances = 0
  if (interfaces.length) lances = (await lancerReleves(ids, interfaces)).lances
  if (moteurs.includes('claude')) after(() => lancerReleves(ids, ['claude']).catch(() => undefined))
  refresh()
  redirect(`/pages?fiche=${page.id}&lance=${lances + (moteurs.includes('claude') ? ids.length : 0)}#fiche`)
}
