'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { annoncer } from '@/lib/annonce'
import { traducteur } from '@/lib/i18n/serveur'
import { estMoteur, nouveauJeton } from '@/lib/partages'
import { prisma } from '@/lib/prisma'
import { projetCourant } from '@/lib/projets'
import { exigerSession } from '@/lib/session'

const texte = (v: FormDataEntryValue | null, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

/**
 * Crée un partage, ou enregistre ses changements. Les questions et les IA sont
 * vérifiées contre le projet affiché : un partage ne montre jamais une question
 * d'un autre projet. Aucun appel payant.
 */
export async function enregistrerPartage(donnees: FormData) {
  const session = await exigerSession()
  const t = await traducteur()
  const projet = await projetCourant()
  if (!projet) redirect('/projets')
  const id = String(donnees.get('id') ?? '')
  const demandees = [...new Set(donnees.getAll('q').map(String))]
  const valides = await prisma.question.findMany({ where: { id: { in: demandees }, projetId: projet.id }, select: { id: true } })
  const garder = new Set(valides.map((q) => q.id))
  const questions = demandees.filter((q) => garder.has(q))
  if (questions.length === 0) {
    await annoncer(t('Cochez au moins une question à partager.'), 'erreur')
    redirect(id ? `/partages?modifier=${id}#formulaire` : '/partages?nouveau=1#formulaire')
  }
  const moteurs = [...new Set(donnees.getAll('ia').map(String))].filter(estMoteur)
  const fin = String(donnees.get('expireLe') ?? '')
  const expireLe = /^\d{4}-\d{2}-\d{2}$/.test(fin) ? new Date(`${fin}T23:59:59+01:00`) : null
  const champs = {
    titre: texte(donnees.get('titre'), 140) || `${projet.marque} · ${t('visibilité dans les IA')}`,
    destinataire: texte(donnees.get('destinataire'), 140) || null,
    questions,
    moteurs,
    langue: donnees.get('langue') === 'en' ? 'en' : 'fr',
    reponses: donnees.get('reponses') === 'on',
    concurrents: donnees.get('concurrents') === 'on',
    expireLe,
  }
  if (id) {
    const existant = await prisma.partage.findFirst({ where: { id, projetId: projet.id }, select: { id: true } })
    if (!existant) redirect('/partages')
    await prisma.partage.update({ where: { id }, data: champs })
    await annoncer(t('Partage enregistré : le lien ne change pas.'))
    revalidatePath('/partages')
    redirect(`/partages#partage-${id}`)
  }
  const cree = await prisma.partage.create({ data: { ...champs, projetId: projet.id, jeton: nouveauJeton(), auteur: session.user.name } })
  await annoncer(t('Lien de partage créé : copiez-le et envoyez-le.'))
  revalidatePath('/partages')
  redirect(`/partages?cree=${cree.id}#partage-${cree.id}`)
}

async function partageDuProjet(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const id = String(donnees.get('id') ?? '')
  return projet ? prisma.partage.findFirst({ where: { id, projetId: projet.id } }) : null
}

/** Coupe le lien tout de suite : la page ne s'ouvre plus. */
export async function couperPartage(donnees: FormData) {
  const p = await partageDuProjet(donnees)
  const t = await traducteur()
  if (p) {
    await prisma.partage.update({ where: { id: p.id }, data: { coupeLe: new Date() } })
    await annoncer(t('Lien coupé : la page ne s’ouvre plus.'))
  }
  revalidatePath('/partages')
}

/** Rouvre un lien coupé, à la même adresse. */
export async function rouvrirPartage(donnees: FormData) {
  const p = await partageDuProjet(donnees)
  const t = await traducteur()
  if (p) {
    await prisma.partage.update({ where: { id: p.id }, data: { coupeLe: null } })
    await annoncer(t('Lien rouvert, à la même adresse.'))
  }
  revalidatePath('/partages')
}

/** Change l'adresse : l'ancien lien ne marche plus, le nouveau est à renvoyer. */
export async function changerAdresse(donnees: FormData) {
  const p = await partageDuProjet(donnees)
  const t = await traducteur()
  if (p) {
    await prisma.partage.update({ where: { id: p.id }, data: { jeton: nouveauJeton(), vues: 0, derniereVue: null } })
    await annoncer(t('Nouvelle adresse : l’ancien lien ne marche plus.'))
  }
  revalidatePath('/partages')
}

export async function supprimerPartage(donnees: FormData) {
  const p = await partageDuProjet(donnees)
  const t = await traducteur()
  if (p) {
    await prisma.partage.delete({ where: { id: p.id } })
    await annoncer(t('Partage supprimé.'))
  }
  revalidatePath('/partages')
}
