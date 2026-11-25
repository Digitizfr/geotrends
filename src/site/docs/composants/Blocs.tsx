import Link from 'next/link'
import type { Lang } from '../../i18n'
import { titresDe, trouverParId } from '../registre'
import type { Bloc } from '../types'
import { Capture } from './Capture'
import { libelles } from './libelles'
import { Riche, texteBrut, typo } from './TexteRiche'

/*
 * Le corps d'une page : chaque bloc du fichier de contenu, dans l'ordre. Les
 * titres reçoivent l'ancre que reprend la table des matières (titresDe).
 */
export function Corps({ blocs, lang }: { blocs: Bloc[]; lang: Lang }) {
  const ancres = titresDe(blocs).map((x) => x.id)
  // Une capture en haut de page est souvent la plus grande image visible : elle se charge tout de suite.
  const premiere = blocs.findIndex((b) => b.type === 'capture')
  let titre = 0
  return (
    <div className="docs-prose">
      {blocs.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i}><Riche texte={b.texte} lang={lang} /></p>
          case 'h2':
            return <h2 key={i} id={ancres[titre++]} className="titre">{typo(b.texte, lang)}</h2>
          case 'h3':
            return <h3 key={i} id={ancres[titre++]}>{typo(b.texte, lang)}</h3>
          case 'liste':
            return b.ordonnee ? (
              <ol key={i} className="docs-liste">{b.items.map((x, j) => <li key={j}><Riche texte={x} lang={lang} /></li>)}</ol>
            ) : (
              <ul key={i} className="docs-liste">{b.items.map((x, j) => <li key={j}><Riche texte={x} lang={lang} /></li>)}</ul>
            )
          case 'capture':
            return <Capture key={i} nom={b.nom} legende={b.legende} lang={lang} prioritaire={i === premiere && i <= 3} />
          case 'tableau':
            return <Tableau key={i} colonnes={b.colonnes} lignes={b.lignes} lang={lang} />
          case 'encadre':
            return <Encadre key={i} ton={b.ton} titre={b.titre} texte={b.texte} lang={lang} />
          case 'etapes':
            return <Etapes key={i} items={b.items} lang={lang} />
          case 'liens':
            return <Liens key={i} titre={b.titre} items={b.items} lang={lang} />
        }
      })}
    </div>
  )
}

export function Tableau({ colonnes, lignes, lang }: { colonnes: string[]; lignes: string[][]; lang: Lang }) {
  return (
    <div className="defile docs-tableau" tabIndex={0} role="region" aria-label={colonnes.join(', ')}>
      <table className="matrice">
        <thead>
          <tr>{colonnes.map((c, j) => <th key={j} scope="col"><Riche texte={c} lang={lang} /></th>)}</tr>
        </thead>
        <tbody>
          {lignes.map((l, i) => (
            <tr key={i}>
              {l.map((c, j) => (j === 0 ? <th key={j} scope="row"><Riche texte={c} lang={lang} /></th> : <td key={j}><Riche texte={c} lang={lang} /></td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Encadre({ ton, titre, texte, lang }: { ton: 'savoir' | 'limite' | 'conseil'; titre?: string; texte: string; lang: Lang }) {
  return (
    <aside className={`docs-encadre ${ton}`} aria-label={titre ?? libelles(lang).encadre[ton]}>
      <p className="machine docs-encadre-ton">{libelles(lang).encadre[ton]}</p>
      {titre && <p className="docs-encadre-titre">{typo(titre, lang)}</p>}
      <p><Riche texte={texte} lang={lang} /></p>
    </aside>
  )
}

export function Etapes({ items, lang }: { items: { titre: string; texte: string; capture?: string }[]; lang: Lang }) {
  return (
    <ol className="docs-etapes">
      {items.map((x, i) => (
        <li key={i}>
          <span className="docs-etape-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <p className="docs-etape-titre"><span className="docs-lecteur">{libelles(lang).etape} {i + 1}{lang === 'fr' ? ' : ' : ': '}</span>{typo(x.titre, lang)}</p>
            <p className="docs-etape-texte"><Riche texte={x.texte} lang={lang} /></p>
            {x.capture && <Capture nom={x.capture} legende={x.titre} lang={lang} compacte />}
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Renvois vers d'autres pages : une carte par page, avec son titre et une phrase. */
export function Liens({ titre, items, lang }: { titre?: string; items: { page: string; texte?: string }[]; lang: Lang }) {
  const t = libelles(lang)
  const cartes = items.map((x) => ({ x, e: trouverParId(x.page) })).filter((c) => c.e)
  if (cartes.length === 0) return null
  return (
    <nav className="docs-renvois" aria-label={titre ?? t.aLire}>
      <p className="machine docs-renvois-titre">{titre ?? t.aLire}</p>
      <ul className="docs-cartes">
        {cartes.map(({ x, e }) => (
          <li key={x.page}>
            <Link href={e!.url[lang]} className="docs-carte">
              <span className="machine docs-carte-rubrique">{e!.arbre === 'cas' ? t.cas : (e!.rubrique?.titre[lang] ?? t.documentation)}</span>
              <span className="docs-carte-titre">{typo(e!.page.titre[lang], lang)}</span>
              <span className="docs-carte-texte">{typo(texteBrut(x.texte ?? e!.page.resume[lang]), lang)}</span>
              <span className="docs-carte-fleche" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
