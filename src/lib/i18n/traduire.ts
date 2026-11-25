import { EN } from './en'
import { LOCALES, type Langue } from './langues'

export type Variables = Record<string, string | number | null | undefined>
export type Traducteur = ((cle: string, vars?: Variables) => string) & { langue: Langue }

const DICTIONNAIRES: Record<Langue, Record<string, string> | null> = { fr: null, en: EN }

/** En développement, un texte sans traduction est encadré : on le repère d'un coup d'œil (et par une recherche). */
const MARQUER = process.env.NODE_ENV === 'development'
export const MARQUE_MANQUE = '⟦'

/**
 * Traduit un texte de l'interface. La clé est le texte français lui-même.
 *
 *   t('Vue d’ensemble')
 *   t('{n} [n:réponse|réponses] sur {total}', { n: 3, total: 79 })
 *
 * « {nom} » est remplacé par la variable (un nombre est écrit dans le format
 * de la langue). « [n:un|plusieurs] » choisit la forme selon le nombre : en
 * français le singulier vaut pour 0 et 1, en anglais pour 1 seulement.
 */
export function traduire(langue: Langue, cle: string, vars?: Variables): string {
  const dico = DICTIONNAIRES[langue]
  let texte = cle
  if (dico) {
    const trouve = dico[cle]
    texte = trouve !== undefined ? trouve : MARQUER && /\p{L}{2}/u.test(cle) ? `${MARQUE_MANQUE}${cle}⟧` : cle
  }
  // Un mot accordé (« answer|answers ») demandé seul : on donne sa première forme.
  if (langue !== 'fr' && !vars && texte.includes('|') && !texte.includes('[')) return texte.split('|')[0]
  if (!vars) return texte
  return texte
    .replace(/\[(\w+):([^|\]]*)\|([^\]]*)\]/g, (_, nom: string, un: string, plusieurs: string) => {
      const n = Number(vars[nom] ?? 0)
      return (langue === 'fr' ? Math.abs(n) < 2 : Math.abs(n) === 1) ? un : plusieurs
    })
    .replace(/\{(\w+)\}/g, (_, nom: string) => {
      const v = vars[nom]
      return typeof v === 'number' ? v.toLocaleString(LOCALES[langue]) : String(v ?? '')
    })
}

export function creerTraducteur(langue: Langue): Traducteur {
  const t = ((cle: string, vars?: Variables) => traduire(langue, cle, vars)) as Traducteur
  t.langue = langue
  return t
}
