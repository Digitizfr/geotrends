'use server'

import { refresh } from 'next/cache'
import { annoncer } from '@/lib/annonce'
import { traducteur } from '@/lib/i18n/serveur'
import { after } from 'next/server'
import { budgetDisponible } from '@/lib/couts'
import { etiqueterQuestions, etiquettesAuto } from '@/lib/etiquettes'
import { cleIgnorees, simple } from '@/lib/mesures'
import { prisma } from '@/lib/prisma'
import { projetCourant } from '@/lib/projets'
import { exigerSession } from '@/lib/session'

/*
 * Petites actions gratuites, proposées au fil des écrans : suivre une marque
 * repérée, l'écarter de la liste, suivre une question suggérée, épingler une
 * page dans la liste de travail. Aucune ne déclenche d'appel payant, sauf
 * l'étiquetage d'une question ajoutée quand l'utilisateur l'a mis en place
 * (moins d'un dixième de centime par question).
 */

async function ignorees(projetId: string): Promise<string[]> {
  const r = await prisma.reglage.findUnique({ where: { cle: cleIgnorees(projetId) } })
  try {
    const v = r ? JSON.parse(r.valeur) : []
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** Ajoute une marque repérée aux concurrents suivis du projet affiché. */
export async function suivreMarque(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const nom = String(donnees.get('nom') ?? '').trim().slice(0, 80)
  if (!projet || !nom) return
  await prisma.concurrent.createMany({ data: [{ projetId: projet.id, nom }], skipDuplicates: true })
  await annoncer((await traducteur())('Marque suivie comme concurrent'))
  refresh()
}

/** Écarte une marque de la liste des marques repérées (ou la remet). Elle reste comptée dans les réponses. */
export async function ignorerMarque(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const cle = simple(String(donnees.get('nom') ?? ''))
  if (!projet || !cle) return
  const liste = await ignorees(projet.id)
  const suite = donnees.get('remettre') === '1' ? liste.filter((x) => x !== cle) : [...new Set([...liste, cle])]
  await prisma.reglage.upsert({ where: { cle: cleIgnorees(projet.id) }, create: { cle: cleIgnorees(projet.id), valeur: JSON.stringify(suite) }, update: { valeur: JSON.stringify(suite) } })
  await annoncer((await traducteur())('Liste des marques mise à jour'))
  refresh()
}

/** Ajoute une question suggérée au projet affiché. Gratuit : la dépense ne commence qu'au prochain relevé. */
export async function suivreQuestion(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const texte = String(donnees.get('texte') ?? '').trim().slice(0, 300)
  if (!projet || !texte) return
  const existantes = await prisma.question.findMany({ where: { projetId: projet.id }, select: { texte: true, ordre: true } })
  if (!existantes.some((q) => q.texte.toLowerCase() === texte.toLowerCase())) {
    await prisma.question.create({ data: { projetId: projet.id, texte, langue: projet.langue, pays: projet.pays, ordre: Math.max(0, ...existantes.map((q) => q.ordre)) + 1 } })
    // Étiquettes de la nouvelle question : seulement si l'étiquetage automatique est en place pour ce projet.
    if ((await etiquettesAuto(projet.id)) && (await budgetDisponible())) after(() => etiqueterQuestions(projet.id).catch(() => undefined))
  }
  await annoncer((await traducteur())('Question ajoutée au projet'))
  refresh()
}

/** Épingle une page dans la liste de travail (« où apparaître »), même si elle n'est citée qu'une fois. */
export async function ajouterPageAuTravail(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const url = String(donnees.get('url') ?? '').trim()
  if (!projet || !/^https?:\/\//.test(url)) return
  const cle = `page:${url}`
  // « ajoute » : la ligne est à faire, et reste dans la liste même hors de la sélection automatique.
  await prisma.etatAction.upsert({ where: { projetId_cle: { projetId: projet.id, cle } }, create: { projetId: projet.id, cle, etat: 'ajoute' }, update: {} })
  await annoncer((await traducteur())('Page ajoutée à la liste de travail'))
  refresh()
}
