'use server'

import { refresh, revalidatePath } from 'next/cache'
import { annoncer } from '@/lib/annonce'
import { traducteur } from '@/lib/i18n/serveur'
import { budgetDisponible } from '@/lib/couts'
import { prisma } from '@/lib/prisma'
import { projetCourant } from '@/lib/projets'
import { exigerSession } from '@/lib/session'
import { classerSites, cleClassementAuto, estTypeSite } from '@/lib/sites'

/**
 * Classe les sites cités du projet affiché (type et marque propriétaire).
 * Appel payant, déclenché par la personne connectée : son prix est écrit sur le
 * bouton. Au premier clic, le classement des nouveaux sites devient
 * automatique ; il se coupe sur le même écran.
 */
export async function classerLesSites() {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet || !(await budgetDisponible())) return
  await classerSites(projet.id)
  // Premier clic : les nouveaux sites se classeront seuls. Un réglage déjà posé (coupé ou non) n'est pas touché.
  await prisma.reglage.upsert({ where: { cle: cleClassementAuto(projet.id) }, create: { cle: cleClassementAuto(projet.id), valeur: '1' }, update: {} })
  refresh()
}

/** Active ou coupe le classement automatique des nouveaux sites du projet affiché. */
export async function reglerClassementAuto(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  if (!projet) return
  const valeur = donnees.get('auto') === '1' ? '1' : '0'
  await prisma.reglage.upsert({ where: { cle: cleClassementAuto(projet.id) }, create: { cle: cleClassementAuto(projet.id), valeur }, update: { valeur } })
  await annoncer((await traducteur())('Réglage enregistré'))
  revalidatePath('/sources')
}

/** Corrige à la main le type d'un site. La correction l'emporte sur le classement du modèle, pour tous les projets. */
export async function corrigerSite(donnees: FormData) {
  await exigerSession()
  const domaine = String(donnees.get('domaine') ?? '').trim().toLowerCase()
  const type = donnees.get('type')
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domaine) || !estTypeSite(type)) return
  const marque = type === 'marque' ? String(donnees.get('marque') ?? '').trim().slice(0, 80) || null : null
  await prisma.domaine.upsert({ where: { domaine }, create: { domaine, type, marque, origine: 'main' }, update: { type, marque, origine: 'main', classeLe: new Date() } })
  await annoncer((await traducteur())('Type du site corrigé'))
  refresh()
}
