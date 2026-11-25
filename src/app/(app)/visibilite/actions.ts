'use server'

import { revalidatePath } from 'next/cache'
import { analyserEnAttente } from '@/lib/analyse'
import { budgetDisponible } from '@/lib/couts'
import { projetCourant } from '@/lib/projets'
import { exigerSession } from '@/lib/session'

/**
 * Fait lire par le petit modèle les réponses du projet pas encore lues
 * (marques nommées, rang, ton). Appel payant, déclenché par la personne
 * connectée, inscrit au journal des coûts.
 */
export async function lireLesReponses() {
  await exigerSession()
  const projet = await projetCourant()
  if (projet && (await budgetDisponible())) await analyserEnAttente(projet.id)
  revalidatePath('/visibilite')
  revalidatePath('/releves', 'layout')
}
