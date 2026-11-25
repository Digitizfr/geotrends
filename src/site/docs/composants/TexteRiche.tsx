import Link from 'next/link'
import { Fragment } from 'react'
import type { Lang } from '../../i18n'
import { insecables } from '../../typo'
import { resoudreLien } from '../registre'

/*
 * Texte d'un bloc de la documentation. Cinq marques, et rien d'autre :
 *   [[surligné]]   **gras**   `code`   [texte](/adresse)   [texte](doc:identifiant)
 * Un lien « doc: » mène à une page de la documentation ou des cas d'usage, dans
 * la langue affichée. S'il ne mène nulle part, le texte reste sans lien (et le
 * script scripts/verifier-docs.ts le signale).
 */

/**
 * Typographie française : espace insécable avant « : ; ! ? », à l'intérieur
 * des guillemets (règle commune du site, src/site/typo.ts), et avant « % » et
 * « $ » pour qu'un montant ne se coupe pas. Le contenu s'écrit avec des
 * espaces ordinaires. Sans effet sur l'anglais.
 */
export const typo = (texte: string, lang: Lang) => (lang === 'fr' ? insecables(texte).replace(/ ([%$])/g, '\u00a0$1') : texte)

const MOTIF = /(\[\[.+?\]\]|\*\*.+?\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g
const LIEN = /^\[([^\]]+)\]\(([^)\s]+)\)$/

export function Riche({ texte, lang }: { texte: string; lang: Lang }): React.ReactNode {
  return texte.split(MOTIF).map((bout, i) => {
    if (!bout) return null
    if (bout.startsWith('[[') && bout.endsWith(']]')) return <mark key={i} className="surligne">{<Riche texte={bout.slice(2, -2)} lang={lang} />}</mark>
    if (bout.startsWith('**') && bout.endsWith('**') && bout.length > 4) return <strong key={i}>{<Riche texte={bout.slice(2, -2)} lang={lang} />}</strong>
    if (bout.startsWith('`') && bout.endsWith('`') && bout.length > 2) return <code key={i}>{bout.slice(1, -1)}</code>
    const lien = bout.match(LIEN)
    if (lien) {
      const [, libelle, cible] = lien
      const contenu = <Riche texte={libelle} lang={lang} />
      if (cible.startsWith('doc:')) {
        const url = resoudreLien(cible.slice(4), lang)
        return url ? <Link key={i} href={url}>{contenu}</Link> : <span key={i} className="docs-lien-casse" title={cible}>{contenu}</span>
      }
      if (cible.startsWith('/') || cible.startsWith('#')) return <Link key={i} href={cible}>{contenu}</Link>
      return <a key={i} href={cible} target="_blank" rel="noopener noreferrer">{contenu}</a>
    }
    return <Fragment key={i}>{typo(bout, lang)}</Fragment>
  })
}

/** Le même texte sans ses marques : pour un texte de remplacement, une description, un titre d'onglet. */
export const texteBrut = (texte: string) =>
  texte
    .replace(/\[\[(.+?)\]\]/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
