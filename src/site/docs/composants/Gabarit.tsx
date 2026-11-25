import Link from 'next/link'
import { chemin, type Lang } from '../../i18n'
import { ARBRES, pagesDeRubrique, prefixe, urlDe, type NomArbre } from '../registre'
import { libelles, MENU_OUTIL } from './libelles'
import { TableMatieres } from './TableMatieres'
import { typo } from './TexteRiche'
import '../docs.css'

/*
 * Mise en page commune aux pages de la documentation et des cas d'usage, sur
 * le modèle des bonnes documentations : le sommaire à gauche (replié dans un
 * volet sur téléphone), la page au milieu, « Sur cette page » à droite sur
 * grand écran. L'enveloppe du site (en-tête, pied de page) est posée par la
 * route, avec <Cadre>.
 */

export type Miette = { nom: string; href?: string }

export function Gabarit({
  lang,
  arbre,
  idCourant,
  fil,
  surTitre,
  titre,
  chapo,
  ecrans,
  titres,
  children,
  pied,
}: {
  lang: Lang
  arbre: NomArbre
  /** Page en cours, marquée dans le sommaire (absente sur un sommaire d'arbre sans page d'accueil). */
  idCourant?: string
  fil: Miette[]
  surTitre?: string
  titre: string
  chapo: string
  /** Écrans de l'outil décrits par la page : la ligne « Dans l'outil ». */
  ecrans?: string[]
  titres: { niveau: 2 | 3; id: string; texte: string }[]
  children: React.ReactNode
  pied?: React.ReactNode
}) {
  const t = libelles(lang)
  const places = (ecrans ?? []).map((e) => MENU_OUTIL[e]?.[lang]).filter((x): x is string[] => !!x)
  return (
    <div className="docs cadre">
      <div className="docs-grille">
        <details className="docs-nav-mobile">
          <summary>
            <span>{arbre === 'cas' ? t.ouvrirSommaireCas : t.ouvrirSommaire}</span>
            <span aria-hidden="true" className="docs-chevron">↓</span>
          </summary>
          <Sommaire lang={lang} arbre={arbre} idCourant={idCourant} />
        </details>

        <aside className="docs-nav" aria-label={t.sommaire}>
          <Sommaire lang={lang} arbre={arbre} idCourant={idCourant} />
        </aside>

        <article className="docs-article">
          <nav aria-label={t.fil} className="machine docs-fil">
            <ol>
              <li><Link href={chemin('accueil', lang)}>GeoTrends</Link></li>
              {fil.map((m, i) => (
                <li key={`${i}:${m.nom}`}>
                  <span aria-hidden="true">/</span>
                  {m.href && i < fil.length - 1 ? <Link href={m.href}>{m.nom}</Link> : <span aria-current={i === fil.length - 1 ? 'page' : undefined}>{m.nom}</span>}
                </li>
              ))}
            </ol>
          </nav>

          <header className="docs-tete">
            {surTitre && <p className="machine docs-surtitre">{surTitre}</p>}
            <h1 className="titre">{typo(titre, lang)}</h1>
            <p className="chapo">{typo(chapo, lang)}</p>
            {places.length > 0 && (
              <p className="docs-place">
                <span className="machine">{t.dansOutil}</span>
                {places.map((p) => (
                  <span key={p.join('/')} className="docs-place-chemin">{p.join(' › ')}</span>
                ))}
              </p>
            )}
          </header>

          {children}

          {pied}
        </article>

        <aside className="docs-toc">
          <TableMatieres titres={titres.map((x) => ({ ...x, texte: typo(x.texte, lang) }))} libelle={t.surCettePage} />
        </aside>
      </div>
    </div>
  )
}

/** Le sommaire d'un arbre : la bascule documentation / cas d'usage, puis les rubriques et leurs pages. */
function Sommaire({ lang, arbre, idCourant }: { lang: Lang; arbre: NomArbre; idCourant?: string }) {
  const t = libelles(lang)
  const a = ARBRES[arbre]
  const accueil = a.pages.find((p) => (p.slug[lang] ?? '').replace(/\//g, '') === '')
  return (
    <div className="docs-sommaire">
      <div className="docs-bascule" role="group" aria-label={`${t.documentation} / ${t.cas}`}>
        <Link href={prefixe('documentation', lang)} aria-current={arbre === 'documentation' ? 'true' : undefined}>{t.documentation}</Link>
        <Link href={prefixe('cas', lang)} aria-current={arbre === 'cas' ? 'true' : undefined}>{t.cas}</Link>
      </div>
      {a.rubriques.map((r) => {
        const pages = pagesDeRubrique(arbre, r.id)
        const avecAccueil = accueil && accueil.rubrique === r.id
        if (pages.length === 0 && !avecAccueil) return null
        return (
          <div key={r.id} className="docs-sommaire-rubrique">
            <p className="machine">{r.titre[lang]}</p>
            <ul>
              {[...(avecAccueil ? [accueil] : []), ...pages].map((p) => (
                <li key={p.id}>
                  <Link href={urlDe(arbre, p, lang)} aria-current={p.id === idCourant ? 'page' : undefined}>{typo(p.titre[lang], lang)}</Link>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
