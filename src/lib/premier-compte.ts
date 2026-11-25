// Premier lancement : tant qu'aucun compte n'existe, la page de connexion
// propose de créer le compte administrateur. Dès qu'il existe, l'inscription
// est fermée pour de bon : les autres personnes entrent par invitation
// (Réglages › Comptes, src/lib/invitations.ts).
import { auth } from './auth'
import { prisma } from './prisma'

export const LONGUEUR_MIN_MOT_DE_PASSE = 8

/** Vrai tant qu'aucun compte n'existe : l'outil vient d'être installé. */
export const aucunCompte = async () => (await prisma.user.count()) === 0

/**
 * Crée le compte administrateur, seulement s'il n'existe encore aucun compte.
 * Un verrou de la base garantit qu'un seul compte peut être créé ainsi, même si
 * deux personnes envoient le formulaire au même instant.
 */
export async function creerPremierCompte(entree: { nom: string; email: string; motDePasse: string }): Promise<'cree' | 'deja'> {
  // Réponse immédiate dès qu'un compte existe : pas de calcul inutile si le formulaire est rejoué.
  if (!(await aucunCompte())) return 'deja'
  const ctx = await auth.$context
  const hash = await ctx.password.hash(entree.motDePasse)
  return prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(7243001)::text`
      if ((await tx.user.count()) > 0) return 'deja' as const
      const compte = await ctx.internalAdapter.createUser({ email: entree.email, name: entree.nom, emailVerified: true }, { method: 'admin' } as never)
      await ctx.internalAdapter.linkAccount({ userId: compte.id, providerId: 'credential', accountId: compte.id, password: hash })
      await prisma.user.update({ where: { id: compte.id }, data: { role: 'admin' } })
      return 'cree' as const
    },
    { timeout: 20_000 },
  )
}
