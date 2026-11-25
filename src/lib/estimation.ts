import { prisma } from './prisma'
import type { Moteur } from './fournisseurs/types'

// ── Estimation du prix d'un relevé, affichée avant de le lancer ─────────────

/** Prix d'une réponse relevée dans l'interface (DataForSEO, file normale). */
export const PRIX_INTERFACE_USD = 0.0012
/** Prix d'une question à Claude tant qu'aucune n'a été mesurée (Sonnet 5.5, 12/11/2026). */
const PRIX_CLAUDE_PAR_DEFAUT_USD = 0.06

/** Prix moyen réellement payé pour une question à Claude, sur les 30 derniers appels réussis. */
export async function prixClaudeMoyen(): Promise<number> {
  const appels = await prisma.apiCall.findMany({ where: { moteur: 'claude', reussi: true }, orderBy: { createdAt: 'desc' }, take: 30, select: { coutUsd: true } })
  if (appels.length === 0) return PRIX_CLAUDE_PAR_DEFAUT_USD
  return appels.reduce((n, a) => n + Number(a.coutUsd), 0) / appels.length
}

export async function prixParQuestion(): Promise<Record<Moteur, number>> {
  const claude = await prixClaudeMoyen()
  return { chatgpt: PRIX_INTERFACE_USD, gemini: PRIX_INTERFACE_USD, google_ai_mode: PRIX_INTERFACE_USD, google_ai_overview: PRIX_INTERFACE_USD, claude }
}
