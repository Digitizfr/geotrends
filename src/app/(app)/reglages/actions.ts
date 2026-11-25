'use server'

import { refresh, revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { annoncer } from '@/lib/annonce'
import { auth } from '@/lib/auth'
import { ecrireSeuilConfirmation } from '@/lib/couts'
import { ecritures, traducteur } from '@/lib/i18n/serveur'
import { preparerInvitation, retirerAcces, texteInvitation, type Role } from '@/lib/invitations'
import { prisma } from '@/lib/prisma'
import { exigerAdmin, exigerSession } from '@/lib/session'

/** Change le montant au-dessus duquel un envoi demande une confirmation. */
export async function reglerSeuil(donnees: FormData) {
  await exigerSession()
  const montant = Number(String(donnees.get('seuil')).replace(',', '.'))
  if (!Number.isFinite(montant) || montant < 0 || montant > 1000) return
  const seuil = Math.round(montant * 100) / 100
  await ecrireSeuilConfirmation(seuil)
  const [t, f] = await Promise.all([traducteur(), ecritures()])
  await annoncer(t('Seuil enregistré : confirmation au-dessus de {seuil}', { seuil: f.usd(seuil) }))
  refresh()
}

// ── Comptes : invitation, nouveau lien, retrait (administrateur), mot de passe (chacun) ──

export type ResultatLien = { ok: true; email: string; nom: string; lien: string; sujet: string; texte: string; nouveau: boolean; premiereFois: boolean } | { ok: false; erreur: string }

/** Crée le compte s'il le faut et prépare le lien et le texte de l'e-mail. */
async function lienPour(email: string, nom: string, role: Role): Promise<ResultatLien> {
  const session = await exigerAdmin()
  const t = await traducteur()
  try {
    const r = await preparerInvitation({ email, nom, role })
    const premiereFois = !(await prisma.account.findFirst({ where: { userId: r.compte.id, providerId: 'credential', password: { not: null } }, select: { id: true } }))
    const langue = r.compte.langue === 'en' ? 'en' : 'fr'
    const { sujet, texte } = texteInvitation({ nom: r.compte.name, lien: r.lien, expire: r.expire, de: session.user.name.split(/\s+/)[0], langue, premiereFois })
    revalidatePath('/reglages')
    return { ok: true, email: r.compte.email, nom: r.compte.name, lien: r.lien, sujet, texte, nouveau: r.nouveau, premiereFois }
  } catch (e) {
    return { ok: false, erreur: e instanceof Error && e.message === 'Adresse e-mail invalide' ? t('Adresse e-mail invalide.') : t('Le lien n’a pas pu être créé.') }
  }
}

/** Réglages › Comptes › Inviter : nouvelle personne, ou nouveau lien si l'adresse a déjà un compte. */
export async function inviter(_: ResultatLien | null, donnees: FormData): Promise<ResultatLien> {
  const role: Role = donnees.get('role') === 'admin' ? 'admin' : 'membre'
  return lienPour(String(donnees.get('email') ?? ''), String(donnees.get('nom') ?? ''), role)
}

/** Réglages › Comptes › Nouveau lien : pour une invitation perdue ou un mot de passe oublié. */
export async function nouveauLien(_: ResultatLien | null, donnees: FormData): Promise<ResultatLien> {
  return lienPour(String(donnees.get('email') ?? ''), '', 'membre')
}

/** Réglages › Comptes › Retirer l'accès. Jamais son propre compte, jamais le dernier administrateur. */
export async function retirer(donnees: FormData) {
  const session = await exigerAdmin()
  const t = await traducteur()
  const id = String(donnees.get('userId') ?? '')
  const cible = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, role: true } })
  if (!cible) return
  if (cible.id === session.user.id) {
    await annoncer(t('Vous ne pouvez pas retirer votre propre accès.'), 'erreur')
  } else if (cible.role === 'admin' && (await prisma.user.count({ where: { role: 'admin' } })) <= 1) {
    await annoncer(t('Il faut garder au moins un administrateur.'), 'erreur')
  } else {
    await retirerAcces(cible.id)
    await annoncer(t('Accès retiré : {nom}', { nom: cible.name }))
  }
  revalidatePath('/reglages')
}

export type ResultatMotDePasse = { ok: boolean; message: string } | null

/** Réglages › Mon mot de passe. Les autres sessions du compte sont fermées. */
export async function changerMotDePasse(_: ResultatMotDePasse, donnees: FormData): Promise<ResultatMotDePasse> {
  await exigerSession()
  const t = await traducteur()
  const actuel = String(donnees.get('actuel') ?? '')
  const nouveau = String(donnees.get('nouveau') ?? '')
  if (nouveau.length < 8) return { ok: false, message: t('Au moins {n} caractères.', { n: 8 }) }
  if (nouveau !== String(donnees.get('confirmation') ?? '')) return { ok: false, message: t('Les deux mots de passe ne sont pas identiques.') }
  try {
    await auth.api.changePassword({ body: { currentPassword: actuel, newPassword: nouveau, revokeOtherSessions: true }, headers: await headers() })
  } catch {
    return { ok: false, message: t('Mot de passe actuel incorrect.') }
  }
  return { ok: true, message: t('Mot de passe changé. Vos autres sessions sont fermées.') }
}
