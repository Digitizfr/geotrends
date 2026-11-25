// ── Grille de tarifs ────────────────────────────────────────────────────────
// Sert quand le fournisseur ne renvoie pas le prix de l'appel (Anthropic,
// DeepSeek) : on le calcule depuis les volumes facturés. Ces appels sont
// inscrits au journal avec sourcePrix = « grille ».
//
// Prix relevés le 12/11/2026 sur https://platform.claude.com/docs/en/about-claude/pricing
// À revérifier quand un modèle change : une grille fausse fausse le journal.

type TarifModele = {
  /** Dollars par million de jetons. */
  entree: number
  sortie: number
  /** Écriture en cache (5 minutes) et lecture du cache. */
  cacheEcriture: number
  cacheLecture: number
}

const ANTHROPIC: Record<string, TarifModele> = {
  'claude-opus-5-5': { entree: 4, sortie: 20, cacheEcriture: 5, cacheLecture: 0.2 },
  'claude-sonnet-5-5': { entree: 2, sortie: 10, cacheEcriture: 2.5, cacheLecture: 0.1 },
  // Prix pour les demandes de moins de 100 000 jetons.
  'claude-haiku-5-5': { entree: 0.1, sortie: 0.5, cacheEcriture: 0.125, cacheLecture: 0.01 },
  // Modèles de repli possibles quand le modèle demandé décline une question.
  'claude-opus-5': { entree: 5, sortie: 25, cacheEcriture: 6.25, cacheLecture: 0.5 },
  'claude-opus-4-8': { entree: 5, sortie: 25, cacheEcriture: 6.25, cacheLecture: 0.5 },
  'claude-sonnet-5': { entree: 2, sortie: 10, cacheEcriture: 2.5, cacheLecture: 0.2 },
}

/** Recherche web d'Anthropic : 10 $ les 1 000 recherches, en plus des jetons. */
const ANTHROPIC_RECHERCHE_WEB = 10 / 1000

export type VolumesAnthropic = {
  entree: number
  sortie: number
  cacheEcriture: number
  cacheLecture: number
  recherchesWeb: number
}

/** Prix d'un appel à Anthropic, en dollars. Renvoie null si le modèle n'est pas dans la grille. */
export function prixAnthropic(modele: string, v: VolumesAnthropic): number | null {
  const t = ANTHROPIC[modele]
  if (!t) return null
  return (v.entree * t.entree + v.sortie * t.sortie + v.cacheEcriture * t.cacheEcriture + v.cacheLecture * t.cacheLecture) / 1_000_000 + v.recherchesWeb * ANTHROPIC_RECHERCHE_WEB
}

// DeepSeek : prix des heures pleines (les heures creuses coûtent moitié moins),
// relevés le 14/11/2026 sur https://api-docs.deepseek.com/quick_start/pricing
// On compte au prix fort : le journal ne sous-estime jamais une dépense.
const DEEPSEEK: Record<string, { entree: number; entreeCache: number; sortie: number }> = {
  'deepseek-flash': { entree: 0.3, entreeCache: 0.006, sortie: 1.2 },
  'deepseek-v4-pro': { entree: 1.32, entreeCache: 0.044, sortie: 3.96 },
}

/** Prix d'un appel à DeepSeek, en dollars. Renvoie null si le modèle n'est pas dans la grille. */
export function prixDeepseek(modele: string, v: { entree: number; entreeCache: number; sortie: number }): number | null {
  const t = DEEPSEEK[modele]
  if (!t) return null
  return ((v.entree - v.entreeCache) * t.entree + v.entreeCache * t.entreeCache + v.sortie * t.sortie) / 1_000_000
}
