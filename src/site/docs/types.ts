// ── Documentation et cas d'usage : la forme commune de toutes les pages ─────
// Le contenu vit dans des fichiers de données (src/site/docs/documentation et
// src/site/docs/cas), une page par fichier, en français et en anglais côte à
// côte. Les composants de src/site/docs/composants les affichent.

import type { Lang } from '../i18n'

/** Texte d'un bloc : [[surligné]], **gras**, `code` et [lien](/adresse) ou [lien](doc:identifiant-de-page). */
export type Texte = string

export type Bloc =
  | { type: 'p'; texte: Texte }
  | { type: 'h2'; id: string; texte: string }
  | { type: 'h3'; id?: string; texte: string }
  | { type: 'liste'; items: Texte[]; ordonnee?: boolean }
  /** Capture réelle de l'outil, en données d'exemple : `nom` est une clé de public/docs/captures/manifeste.json. */
  | { type: 'capture'; nom: string; legende: Texte }
  | { type: 'tableau'; colonnes: string[]; lignes: Texte[][] }
  | { type: 'encadre'; ton: 'savoir' | 'limite' | 'conseil'; titre?: string; texte: Texte }
  | { type: 'etapes'; items: { titre: string; texte: Texte; capture?: string }[] }
  /** Renvois vers d'autres pages de la documentation ou des cas d'usage, par identifiant. */
  | { type: 'liens'; titre?: string; items: { page: string; texte?: string }[] }

export type PageDoc = {
  /** Identifiant stable, en français : « demarrer/prise-en-main », « cas/savoir-si-chatgpt-me-cite ». */
  id: string
  /** Identifiant de la rubrique (voir les rubriques déclarées dans l'index de l'arbre). */
  rubrique: string
  /** Fin de l'adresse dans chaque langue (sans le préfixe /documentation ou /en/docs). */
  slug: Record<Lang, string>
  titre: Record<Lang, string>
  /** Chapô de la page, repris en description pour les moteurs de recherche (150 à 160 signes). */
  resume: Record<Lang, string>
  /** Écrans de l'outil décrits par la page, par leur adresse dans l'outil (« /vue », « /questions/[id] »). */
  ecrans?: string[]
  /** Date de la dernière mise à jour du contenu, AAAA-MM-JJ. */
  maj: string
  contenu: Record<Lang, Bloc[]>
}

export type Rubrique = { id: string; titre: Record<Lang, string> }

/** Un arbre de pages : la documentation, ou les cas d'usage. */
export type Arbre = { rubriques: Rubrique[]; pages: PageDoc[] }
