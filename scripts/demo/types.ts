// Forme commune des deux jeux de données fictives (contenu-fr.ts, contenu-en.ts).
// Tout ce qui est écrit ici est inventé : marque Facturo, concurrents, sites en
// « .exemple », chaînes et vidéos YouTube aux identifiants fictifs.

export const IA = ['chatgpt', 'gemini', 'google_ai_mode', 'google_ai_overview'] as const
export type IA = (typeof IA)[number]
export type Moteur = IA | 'claude'

/** Comment la marque est présente dans une réponse : page de son site citée, vidéo de sa chaîne citée, profil social cité, ou nom seul. */
export type Via = 'site' | 'video' | 'profil' | 'nom'

export type Page = { url: string; titre: string }
export type Video = { id: string; titre: string; chaine: string; vues: number; publie: string; moment?: number }

/**
 * Une question suivie.
 * - `plan` : présence de la marque, semaine par semaine (8 caractères, « 1 » = présente),
 *   pour les questions sans le nom de la marque. Claude : 4 caractères (un relevé toutes les deux semaines).
 * - `sources` : clés des pages citées par chaque IA (dans `pages` ou `videos`).
 */
export type QuestionDemo = {
  cle: string
  texte: string
  theme: string
  intention: 'informer' | 'comparer' | 'acheter'
  genre: 'liste' | 'explication' | 'prix' | 'duel'
  /** La question contient le nom de la marque : elle est présente dans toutes les réponses. */
  marquee?: boolean
  /** Google n'affiche jamais d'Aperçu IA pour cette question. */
  sansApercu?: boolean
  plan?: Partial<Record<Moteur, string>>
  /** Par où la marque est présente quand elle l'est (par défaut : son nom seul). */
  via?: Partial<Record<Moteur, Via | ((semaine: number) => Via)>>
  /** Page de la marque citée quand elle l'est par son site. */
  pageMarque?: string
  /** Vidéo de la marque citée quand elle l'est par sa chaîne. */
  videoMarque?: string
  intros: string[]
  conclusions: string[]
  /** Marques nommées dans l'ordre habituel (sans Facturo). */
  marques: string[]
  /** Pour une explication : part des réponses qui nomment des marques (0 à 1). */
  frequenceMarques?: number
  etapes?: { titre: string; texte: string }[]
  sources: Partial<Record<Moteur, string[]>>
  /** Pages lues sans être citées (ChatGPT et Claude). */
  lues?: string[]
  /** Page de la marque lue sans être citée, à partir de la semaine donnée (ChatGPT). */
  lueMarque?: { page: string; depuis: number }
  top10: string[]
  associees: string[]
  recherches: string[]
}

export type Marche = {
  projet: { nom: string; marque: string; langue: string; pays: string }
  chaines: Record<string, { id: string; nom: string }>
  proprietes: { type: 'site' | 'youtube' | 'profil'; valeur: string; libelle?: string }[]
  concurrents: { nom: string; domaine: string }[]
  pages: Record<string, Page>
  videos: Record<string, Video>
  /** Descriptions des marques, plusieurs tournures ; `neg` : tournures négatives. */
  marques: Record<string, { desc: string[]; neg?: string[] }>
  /** Petites phrases de mise en page des réponses. */
  ph: {
    titreListe: string
    aRetenir: string
    enBref: string
    video: string
    aussi: (noms: string) => string
    aussiCourt: (noms: string) => string
    prix: { juste: string; faux: string; solo: string; soloFaux: string; equipe: string; entreprise: string; comparaison: string; essai: string }
    duel: { facile: string; complet: string; prixF: string; prixC: string; tableau: string; critere: string; prise: string; compta: string; prixLigne: string; mobile: string; oui: string; non: string; partiel: string; troisieme: string }
    hebergement: string
  }
  questions: QuestionDemo[]
  archivee: { texte: string; theme: string; intention: 'informer' | 'comparer' | 'acheter'; intro: string }
  /** Cibles de présence (questions sans le nom de la marque), par IA et par semaine : le script vérifie les plans. */
  cibles: Record<IA, number[]> & { claude: number[] }
  /** Mentions de Tikette par semaine (concurrent qui monte). */
  tikette: number[]
  /** Mesure approfondie de la question q1 : nombre de réponses où la marque est présente, sur 25. */
  approfondiPresents: number
  /** Relevé en échec (semaine 5, Gemini) : question concernée. */
  echec: string
  faits: string[]
  contradiction: { explication: string }
  ecartee: { explication: string }
  notes: {
    comparatif: string
    forum: string
    media: string
    correction: string
    officiel: string
    contacts: { comparatif: string; comparatifRelance: string; forum: string; media: string; correction: string }
    demarches: { ajout: string; relance: string; reponse: string; test: string; correction: string }
  }
  marquesRares: string[]
  domaines: Record<string, { type: string; marque?: string; main?: boolean }>
}
