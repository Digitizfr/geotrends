import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'

/** Session en cours, ou null. Lue une seule fois par page. */
export const lireSession = cache(async () => auth.api.getSession({ headers: await headers() }))

/** À appeler en tête de toute page ou action réservée : renvoie vers la connexion sinon. */
export async function exigerSession() {
  const session = await lireSession()
  if (!session) redirect('/connexion')
  return session
}

/** Vrai si le compte a accès à la rubrique Administration. */
export function estAdmin(session: { user: { role?: string | null } }) {
  return session.user.role === 'admin'
}

/** À appeler en tête de toute page ou action d'administration. */
export async function exigerAdmin() {
  const session = await exigerSession()
  if (!estAdmin(session)) redirect('/vue')
  return session
}
