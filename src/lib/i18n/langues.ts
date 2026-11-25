// Langues de l'interface de l'outil. Le français est la langue de référence :
// chaque texte est écrit en français à l'endroit où il s'affiche, et le
// dictionnaire anglais (src/lib/i18n/en/) en donne la traduction.
// Rien à voir avec la langue des questions d'un projet, ni avec le texte des
// réponses des IA, qui n'est jamais traduit.

export const LANGUES = ['fr', 'en'] as const
export type Langue = (typeof LANGUES)[number]
export const LANGUE_DEFAUT: Langue = 'fr'
export const COOKIE_LANGUE = 'gt_langue'
export const NOMS_LANGUES: Record<Langue, string> = { fr: 'Français', en: 'English' }
export const LOCALES: Record<Langue, string> = { fr: 'fr-FR', en: 'en-GB' }

export const estLangue = (v: unknown): v is Langue => (LANGUES as readonly unknown[]).includes(v)

/** Langue préférée d'un navigateur, d'après son en-tête Accept-Language. Sert tant que personne n'est connecté. */
export function langueDuNavigateur(accept: string | null | undefined): Langue {
  const preferees = (accept ?? '')
    .split(',')
    .map((x) => {
      const [code, q] = x.trim().split(';q=')
      return { code: code.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 }
    })
    .filter((x) => x.code)
    .sort((a, b) => b.q - a.q)
  return preferees.map((x) => x.code).find(estLangue) ?? LANGUE_DEFAUT
}
