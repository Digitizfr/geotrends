'use server'

import { revalidatePath } from 'next/cache'
import { annoncer } from '@/lib/annonce'
import { traducteur } from '@/lib/i18n/serveur'
import { exigerAdmin } from '@/lib/session'
import { ecrirePlafond } from '@/lib/couts'

export async function changerPlafond(donnees: FormData) {
  await exigerAdmin()
  const montant = Number(String(donnees.get('plafond')).replace(',', '.'))
  // Borne haute de sécurité : au-delà, c'est une faute de frappe.
  if (!Number.isFinite(montant) || montant < 0 || montant > 5000) return
  await ecrirePlafond(Math.round(montant * 100) / 100)
  await annoncer((await traducteur())('Plafond du mois enregistré'))
  revalidatePath('/admin/couts')
}
