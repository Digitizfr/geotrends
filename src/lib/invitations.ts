// Invitations : donner accès à une personne sans jamais lui transmettre de mot de passe.
//
// L'administrateur crée le compte (Réglages › Comptes, ou `npm run inviter`) et
// reçoit un lien personnel, valable sept jours. La personne l'ouvre, choisit son
// mot de passe (/invitation/[jeton]) et entre dans l'outil. Le même lien sert
// quand quelqu'un a oublié son mot de passe : l'administrateur en refait un.
//
// Le lien repose sur le jeton de réinitialisation de Better Auth
// (« reset-password:<jeton> », valeur = identifiant du compte) : c'est Better Auth
// qui vérifie le jeton et enregistre le mot de passe (POST /api/auth/reset-password).
// Pas d'import de « server-only » : le script `npm run inviter` s'en sert aussi.
import { randomBytes } from 'node:crypto'
import { auth } from './auth'
import { prisma } from './prisma'

export const DUREE_INVITATION_JOURS = 7
const PREFIXE = 'reset-password:'
const JOUR = 86_400_000

export type Role = 'admin' | 'membre'

const adresseValide = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
const base = () => (process.env.BETTER_AUTH_URL || 'https://geotrends.io').replace(/\/+$/, '')

/**
 * Crée le compte s'il n'existe pas, puis un lien personnel pour choisir son mot de passe.
 * Un seul lien vaut à la fois : le précédent ne marche plus.
 */
export async function preparerInvitation(entree: { email: string; nom?: string; role?: Role }) {
  const email = entree.email.trim().toLowerCase()
  if (!adresseValide(email)) throw new Error('Adresse e-mail invalide')
  const ctx = await auth.$context
  let compte = await prisma.user.findUnique({ where: { email } })
  const nouveau = !compte
  if (!compte) {
    const cree = await ctx.internalAdapter.createUser({ email, name: entree.nom?.trim() || email.split('@')[0], emailVerified: true }, { method: 'admin' } as never)
    compte = await prisma.user.update({ where: { id: cree.id }, data: { role: entree.role === 'admin' ? 'admin' : 'membre' } })
  }
  await prisma.verification.deleteMany({ where: { value: compte.id, identifier: { startsWith: PREFIXE } } })
  const jeton = randomBytes(24).toString('base64url')
  const expire = new Date(Date.now() + DUREE_INVITATION_JOURS * JOUR)
  await ctx.internalAdapter.createVerificationValue({ identifier: PREFIXE + jeton, value: compte.id, expiresAt: expire })
  return { compte, nouveau, lien: `${base()}/invitation/${jeton}`, expire }
}

/** Le compte que désigne un lien, s'il est encore valable. */
export async function lireInvitation(jeton: string) {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(jeton)) return null
  const ctx = await auth.$context
  const v = await ctx.internalAdapter.findVerificationValue(PREFIXE + jeton)
  if (!v || v.expiresAt < new Date()) return null
  const compte = await prisma.user.findUnique({ where: { id: v.value }, select: { id: true, name: true, email: true } })
  if (!compte) return null
  const motDePasse = await prisma.account.findFirst({ where: { userId: compte.id, providerId: 'credential', password: { not: null } }, select: { id: true } })
  return { ...compte, expire: v.expiresAt, premiereFois: !motDePasse }
}

/** Où en est chaque compte : mot de passe choisi, lien en cours, dernière connexion. */
export async function etatDesComptes() {
  const [comptes, mdp, liens, sessions] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'asc' }, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
    prisma.account.findMany({ where: { providerId: 'credential', password: { not: null } }, select: { userId: true } }),
    prisma.verification.findMany({ where: { identifier: { startsWith: PREFIXE }, expiresAt: { gt: new Date() } }, select: { value: true, expiresAt: true } }),
    prisma.session.groupBy({ by: ['userId'], _max: { createdAt: true } }),
  ])
  const avecMdp = new Set(mdp.map((a) => a.userId))
  const lien = new Map(liens.map((l) => [l.value, l.expiresAt]))
  const derniere = new Map(sessions.map((s) => [s.userId, s._max.createdAt]))
  return comptes.map((c) => ({
    ...c,
    motDePasse: avecMdp.has(c.id),
    lienJusquau: lien.get(c.id) ?? null,
    derniereConnexion: derniere.get(c.id) ?? null,
  }))
}

/** Le texte de l'e-mail d'invitation, à envoyer depuis sa propre messagerie. */
export function texteInvitation(c: { nom: string; lien: string; expire: Date; de: string; langue: 'fr' | 'en'; premiereFois: boolean }) {
  const prenom = c.nom.split(/\s+/)[0] || c.nom
  const jour = c.expire.toLocaleDateString(c.langue === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', timeZone: 'Europe/Paris' })
  if (c.langue === 'en') {
    return c.premiereFois
      ? {
          sujet: 'Your access to GeoTrends',
          texte: `Hi ${prenom},\n\nI'm giving you access to GeoTrends, our tool that measures whether our brands are cited by ChatGPT, Gemini, Google and Claude.\n\nChoose your password here (the link works until ${jour}):\n${c.lien}\n\nThen sign in at ${base()}/connexion with this e-mail address.\n\nTry whatever you like and reply with anything that is unclear or missing.\n\n${c.de}`,
        }
      : {
          sujet: 'New GeoTrends password',
          texte: `Hi ${prenom},\n\nHere is a link to choose a new GeoTrends password (it works until ${jour}):\n${c.lien}\n\n${c.de}`,
        }
  }
  return c.premiereFois
    ? {
        sujet: 'Ton accès à GeoTrends',
        texte: `Bonjour ${prenom},\n\nJe t'ouvre un accès à GeoTrends, notre outil qui mesure si nos marques sont citées par ChatGPT, Gemini, Google et Claude.\n\nChoisis ton mot de passe ici (lien valable jusqu'au ${jour}) :\n${c.lien}\n\nEnsuite, connecte-toi sur ${base()}/connexion avec cette adresse.\n\nTeste ce que tu veux et réponds-moi avec ce qui n'est pas clair ou ce qui manque.\n\n${c.de}`,
      }
    : {
        sujet: 'Nouveau mot de passe GeoTrends',
        texte: `Bonjour ${prenom},\n\nVoici un lien pour choisir un nouveau mot de passe GeoTrends (valable jusqu'au ${jour}) :\n${c.lien}\n\n${c.de}`,
      }
}

/** Retire l'accès : le compte, ses sessions et ses liens disparaissent. */
export async function retirerAcces(userId: string) {
  await prisma.verification.deleteMany({ where: { value: userId, identifier: { startsWith: PREFIXE } } })
  await prisma.user.delete({ where: { id: userId } })
}
