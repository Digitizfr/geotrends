// ── Site public : langues et adresses ───────────────────────────────────────
// Le français est servi à la racine, l'anglais sous /en. Chaque page existe
// dans les deux langues : ajouter une page, c'est ajouter une ligne ici, un
// fichier de contenu (src/site/contenu) et deux fichiers de route (src/app).

export type Lang = 'fr' | 'en'
export const LANGUES: Lang[] = ['fr', 'en']

export const CHEMINS = {
  accueil: { fr: '/', en: '/en' },
  fonctions: { fr: '/fonctionnalites', en: '/en/features' },
  mesurer: { fr: '/fonctionnalites/mesurer', en: '/en/features/measure' },
  comprendre: { fr: '/fonctionnalites/comprendre', en: '/en/features/understand' },
  agir: { fr: '/fonctionnalites/agir', en: '/en/features/act' },
  piloter: { fr: '/fonctionnalites/piloter', en: '/en/features/steer' },
  methode: { fr: '/methode', en: '/en/method' },
  moteurs: { fr: '/ia-suivies', en: '/en/ai-engines' },
  budget: { fr: '/budget', en: '/en/budget' },
  apropos: { fr: '/a-propos', en: '/en/about' },
  documentation: { fr: '/documentation', en: '/en/docs' },
  cas: { fr: '/cas-usage', en: '/en/use-cases' },
} as const

export type Page = keyof typeof CHEMINS
export const chemin = (page: Page, lang: Lang): string => CHEMINS[page][lang]

/** Les quatre familles de fonctions, dans l'ordre du menu. */
export const FAMILLES = ['mesurer', 'comprendre', 'agir', 'piloter'] as const
export type Famille = (typeof FAMILLES)[number]
