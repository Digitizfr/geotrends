'use server'

import { revalidatePath } from 'next/cache'
import { annoncer } from '@/lib/annonce'
import { traducteur } from '@/lib/i18n/serveur'
import { redirect } from 'next/navigation'
import { cleRapportAuto, envoiPossible, envoyerRapport } from '@/lib/courriel'
import { prisma } from '@/lib/prisma'
import { projetCourant } from '@/lib/projets'
import { exigerSession } from '@/lib/session'

/** Active ou coupe l'envoi du rapport chaque lundi, pour le projet affiché. Coupé par défaut. Gratuit. */
export async function reglerEnvoiRapport(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet) return
  const valeur = donnees.get('actif') === '1' && envoiPossible() ? '1' : '0'
  await prisma.reglage.upsert({ where: { cle: cleRapportAuto(projet.id) }, create: { cle: cleRapportAuto(projet.id), valeur }, update: { valeur } })
  await annoncer((await traducteur())('Réglage enregistré'))
  revalidatePath('/rapport')
}

/** Envoie tout de suite le rapport à la personne connectée, pour voir à quoi il ressemble. Gratuit. */
export async function envoyerRapportMaintenant() {
  const session = await exigerSession()
  const projet = await projetCourant()
  if (!projet) return
  const res = await envoyerRapport(projet.id, [session.user.email])
  redirect(res.reussi ? '/rapport?envoi=fait#courriel' : '/rapport?envoi=echec#courriel')
}
