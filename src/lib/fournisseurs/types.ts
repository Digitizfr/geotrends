// ── Contrat commun à tous les fournisseurs de relevés ───────────────────────
// Ces services cassent quand les interfaces des IA changent : chaque
// fournisseur est isolé derrière ce contrat, pour basculer sans réécrire
// l'outil (voir docs/API.md).

export const MOTEURS = ['chatgpt', 'gemini', 'google_ai_mode', 'google_ai_overview', 'claude'] as const
export type Moteur = (typeof MOTEURS)[number]

/** « interface » : ce que voit l'utilisateur. « api » : réponse du modèle seul. */
export type Methode = 'interface' | 'api'

export type DemandeReleve = {
  question: string
  /** Code ISO 639-1, ex. "fr". */
  langue: string
  /** Code ISO 3166-1 alpha-2, ex. "FR". */
  pays: string
  moteur: Moteur
}

/** Résultat de l'envoi d'une question : c'est ici que l'appel est facturé. */
export type TachePostee = {
  reussi: boolean
  tacheId: string | null
  /** Prix renvoyé par le fournisseur pour cette tâche, en dollars. */
  coutUsd: number
  dureeMs: number
  erreur?: string
  detail?: Record<string, unknown>
  /** D'où vient le prix : renvoyé par le fournisseur (« api », par défaut) ou calculé (« grille »). */
  sourcePrix?: 'api' | 'grille'
  /** Volume facturé, dans l'unité du fournisseur (jetons…). Une tâche par défaut. */
  unites?: number
  unite?: string
  /** Réponse immédiate, pour les fournisseurs qui répondent dans la foulée (Claude). */
  resultat?: ResultatReleve
}

export type SourceRelevee = {
  url: string
  domaine: string
  titre: string | null
  extrait: string | null
  /** « citee » : affichée comme source. « consultee » : lue sans être citée. */
  role: 'citee' | 'consultee'
}

export type ResultatReleve =
  | { etat: 'en_attente' }
  | {
      etat: 'recu'
      texte: string
      sources: SourceRelevee[]
      modele: string | null
      releveLe: Date | null
      urlControle: string | null
      brut: unknown
    }
  /** La tâche a abouti, mais l'IA n'a rien affiché (ex. pas d'aperçu IA). */
  | { etat: 'vide'; raison: string; releveLe: Date | null; urlControle: string | null; brut: unknown }
  | { etat: 'echec'; erreur: string; brut?: unknown }

export interface FournisseurReleves {
  nom: string
  methode: Methode
  moteurs: readonly Moteur[]
  /** Envoie les questions (appel payant). Renvoie une tâche par demande, dans le même ordre. */
  poster(demandes: DemandeReleve[]): Promise<TachePostee[]>
  /** Lit la réponse d'une tâche (appel gratuit). */
  recuperer(moteur: Moteur, tacheId: string): Promise<ResultatReleve>
}

/** Domaine d'une adresse, en minuscules et sans « www. ». Chaîne vide si l'adresse est illisible. */
export function domaineDe(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return ''
  }
}
