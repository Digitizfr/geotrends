'use server'

import { refresh } from 'next/cache'
import { annoncer } from '@/lib/annonce'
import { traducteur } from '@/lib/i18n/serveur'
import { MAX_FAITS, quatreDeFront, verifierFaits } from '@/lib/analyse'
import { budgetDisponible } from '@/lib/couts'
import { lireMesures } from '@/lib/mesures'
import { prisma } from '@/lib/prisma'
import { lignes, projetCourant } from '@/lib/projets'
import { exigerSession } from '@/lib/session'
import { reponsesAVerifier } from './lecture'

/** Ajoute des faits vérifiés au projet affiché : un par ligne, vingt au plus. Gratuit. */
export async function ajouterFaits(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet) return
  const existants = await prisma.fait.findMany({ where: { projetId: projet.id }, select: { texte: true } })
  const connus = new Set(existants.map((f) => f.texte.toLowerCase()))
  const nouveaux = lignes(donnees.get('faits')).map((t) => t.slice(0, 300)).filter((t) => t.length >= 8 && !connus.has(t.toLowerCase())).slice(0, Math.max(0, MAX_FAITS - existants.length))
  if (nouveaux.length) await prisma.fait.createMany({ data: nouveaux.map((texte) => ({ projetId: projet.id, texte })) })
  await annoncer((await traducteur())('Faits enregistrés'))
  refresh()
}

/** Retire un fait. Les contradictions relevées contre lui partent avec. */
export async function retirerFait(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet) return
  await prisma.fait.deleteMany({ where: { id: String(donnees.get('faitId') ?? ''), projetId: projet.id } })
  await annoncer((await traducteur())('Fait retiré'))
  refresh()
}

/**
 * Compare aux faits vérifiés les réponses déjà lues qui nomment la marque.
 * Appel payant, déclenché par la personne connectée : son prix est écrit sur
 * le bouton. Les réponses à venir sont comparées pendant leur lecture
 * automatique, dans le même appel.
 */
export async function verifierLesReponses() {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet) return
  const [m, faits] = await Promise.all([lireMesures(projet.id), prisma.fait.findMany({ where: { projetId: projet.id }, select: { createdAt: true } })])
  if (!m || faits.length === 0) return
  await quatreDeFront(reponsesAVerifier(m, faits), async (r) => {
    if (await budgetDisponible()) await verifierFaits(r.id)
  })
  refresh()
}

/** Écarte une contradiction qui n'en est pas une (ou la remet). Elle sort alors de la liste de travail. */
export async function ecarterContradiction(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet) return
  await prisma.contradiction.updateMany({ where: { id: String(donnees.get('id') ?? ''), fait: { projetId: projet.id } }, data: { ecartee: donnees.get('remettre') !== '1' } })
  await annoncer((await traducteur())('Liste mise à jour'))
  refresh()
}
