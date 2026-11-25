import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Cadre } from '../../composants/Cadre'
import { chemin, type Lang } from '../../i18n'
import { accroches } from '../documentation'
import { ARBRES, autreLangue, cheminsStatiques, pagesDeRubrique, prefixe, titresDe, trouverParChemin, urlDe, voisines, type Entree, type NomArbre } from '../registre'
import type { PageDoc } from '../types'
import { Corps } from './Blocs'
import { adresseCapture, captureDe } from '../captures'
import { Gabarit } from './Gabarit'
import { dateEcrite, libelles } from './libelles'
import { texteBrut, typo } from './TexteRiche'

/*
 * Ce que partagent les quatre routes (documentation et cas d'usage, en
 * français et en anglais) : les adresses à produire, les métadonnées, le
 * balisage pour les moteurs et l'affichage d'une page.
 */

const SITE = 'https://geotrends.io'
const absolue = (url: string) => `${SITE}${url}`

/** Adresses produites à la construction : toutes connues d'avance, une adresse inconnue répond 404. */
export const statiques = (arbre: NomArbre, lang: Lang) => cheminsStatiques(arbre, lang)

/** Titre et chapô du sommaire d'un arbre qui n'a pas de page d'accueil écrite (les cas d'usage). */
const enteteArbre = (arbre: NomArbre, lang: Lang) => {
  const t = libelles(lang)
  return arbre === 'cas'
    ? t.casIntro
    : { titre: t.documentation, chapo: lang === 'fr' ? 'Comment se servir de GeoTrends, écran par écran.' : 'How to use GeoTrends, screen by screen.' }
}

/** Date de la page la plus récente d'un arbre. */
const majArbre = (arbre: NomArbre) => ARBRES[arbre].pages.map((p) => p.maj).sort().at(-1) ?? new Date().toISOString().slice(0, 10)

export async function metaDoc(arbre: NomArbre, lang: Lang, morceaux: string[] | undefined): Promise<Metadata> {
  const e = trouverParChemin(arbre, lang, morceaux)
  if (!e && (morceaux?.length ?? 0) > 0) return {}
  const titre = e ? e.page.titre[lang] : enteteArbre(arbre, lang).titre
  const description = e ? texteBrut(e.page.resume[lang]) : enteteArbre(arbre, lang).chapo
  const url = e ? e.url : { fr: prefixe(arbre, 'fr'), en: prefixe(arbre, 'en') }
  const complet = `${titre} · GeoTrends`
  const image = e ? premiereCapture(e.page, lang) : undefined
  return {
    metadataBase: new URL(SITE),
    title: complet,
    description,
    alternates: {
      canonical: url[lang],
      languages: { fr: url.fr, en: url.en, 'x-default': url.fr },
    },
    openGraph: {
      title: complet,
      description,
      url: url[lang],
      siteName: 'GeoTrends',
      locale: lang === 'fr' ? 'fr_FR' : 'en_GB',
      alternateLocale: lang === 'fr' ? ['en_GB'] : ['fr_FR'],
      type: 'article',
      modifiedTime: e?.page.maj ?? majArbre(arbre),
      ...(image ? { images: [{ url: image.url, width: image.largeur, height: image.hauteur }] } : {}),
    },
  }
}

/** La première capture disponible d'une page : sert d'image pour le partage et pour le balisage. */
function premiereCapture(page: PageDoc, lang: Lang) {
  for (const b of page.contenu[lang]) {
    const nom = b.type === 'capture' ? b.nom : b.type === 'etapes' ? b.items.find((x) => x.capture)?.capture : undefined
    const c = nom ? captureDe(nom, lang) : undefined
    if (c) return { url: adresseCapture(c.fichier), largeur: c.largeur, hauteur: c.hauteur }
  }
  return undefined
}

/** Balisage schema.org : le fil d'Ariane, puis l'article (ou la liste, pour un sommaire d'arbre). */
function Balisage({ lang, arbre, e }: { lang: Lang; arbre: NomArbre; e?: Entree }) {
  const t = libelles(lang)
  const nomArbre = arbre === 'cas' ? t.cas : t.documentation
  const racine = absolue(prefixe(arbre, lang))
  const miettes = [
    { name: 'GeoTrends', item: absolue(chemin('accueil', lang)) },
    { name: nomArbre, item: racine },
    ...(e && !e.accueil ? [{ name: e.page.titre[lang], item: absolue(e.url[lang]) }] : []),
  ]
  const editeur = { '@type': 'Organization', name: 'GeoTrends', url: SITE, logo: { '@type': 'ImageObject', url: absolue('/icon.svg') } }
  const image = e ? premiereCapture(e.page, lang) : undefined
  const donnees = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: miettes.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.name, item: m.item })) },
      e
        ? {
            '@type': 'TechArticle',
            headline: e.page.titre[lang],
            description: texteBrut(e.page.resume[lang]),
            dateModified: e.page.maj,
            inLanguage: lang,
            url: absolue(e.url[lang]),
            mainEntityOfPage: absolue(e.url[lang]),
            isPartOf: { '@type': 'WebSite', name: 'GeoTrends', url: SITE },
            publisher: editeur,
            author: editeur,
            ...(e.rubrique ? { articleSection: e.rubrique.titre[lang] } : {}),
            ...(image ? { image: absolue(image.url) } : {}),
          }
        : {
            '@type': 'CollectionPage',
            name: enteteArbre(arbre, lang).titre,
            description: enteteArbre(arbre, lang).chapo,
            inLanguage: lang,
            url: racine,
            dateModified: majArbre(arbre),
            publisher: editeur,
          },
    ],
  }
  // « < » échappé : le texte du balisage ne peut pas fermer la balise <script>.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees).replace(/</g, '\\u003c') }} />
}

/** Une page de la documentation ou des cas d'usage, dans son enveloppe. */
export function PageArbre({ arbre, lang, morceaux }: { arbre: NomArbre; lang: Lang; morceaux: string[] | undefined }) {
  const e = trouverParChemin(arbre, lang, morceaux)
  const vide = (morceaux?.length ?? 0) === 0
  if (!e && !vide) notFound()
  const page = arbre === 'documentation' ? 'documentation' : 'cas'
  const autre = autreLangue(lang)
  const autreLien = e ? e.url[autre] : prefixe(arbre, autre)
  return (
    <Cadre lang={lang} page={page} autreLien={autreLien}>
      <Balisage lang={lang} arbre={arbre} e={e} />
      {e ? <Article e={e} lang={lang} /> : <SommaireArbre arbre={arbre} lang={lang} />}
    </Cadre>
  )
}

function Article({ e, lang }: { e: Entree; lang: Lang }) {
  const t = libelles(lang)
  const blocs = e.page.contenu[lang]
  const accueilDoc = e.arbre === 'documentation' && e.accueil
  const titres = [...titresDe(blocs), ...(accueilDoc ? [{ niveau: 2 as const, id: t.toutesRubriquesId, texte: t.toutesRubriques }] : [])]
  const nomArbre = e.arbre === 'cas' ? t.cas : t.documentation
  const fil = e.accueil
    ? [{ nom: nomArbre }]
    : [{ nom: nomArbre, href: prefixe(e.arbre, lang) }, ...(e.rubrique ? [{ nom: e.rubrique.titre[lang], href: `${prefixe(e.arbre, lang)}#${e.arbre === 'documentation' ? `rubrique-${e.rubrique.id}` : e.rubrique.id}` }] : []), { nom: e.page.titre[lang] }]
  return (
    <Gabarit
      lang={lang}
      arbre={e.arbre}
      idCourant={e.page.id}
      fil={fil}
      surTitre={e.rubrique?.titre[lang]}
      titre={e.page.titre[lang]}
      chapo={texteBrut(e.page.resume[lang])}
      ecrans={e.page.ecrans}
      titres={titres}
      pied={<Pied e={e} lang={lang} />}
    >
      <Corps blocs={blocs} lang={lang} />
      {accueilDoc && <ToutesRubriques lang={lang} />}
    </Gabarit>
  )
}

/** Fin de page : la date de mise à jour, puis les pages précédente et suivante. */
function Pied({ e, lang }: { e: Entree; lang: Lang }) {
  const t = libelles(lang)
  const { precedente, suivante } = voisines(e)
  return (
    <footer className="docs-pied">
      <p className="machine docs-maj">{t.majLe(dateEcrite(e.page.maj, lang))}</p>
      {(precedente || suivante) && (
        <nav className="docs-voisines" aria-label={t.voisines}>
          {precedente ? (
            <Link href={precedente.url[lang]} className="docs-voisine precedente" rel="prev">
              <span className="machine">← {t.precedente}</span>
              <span className="docs-voisine-titre">{typo(precedente.page.titre[lang], lang)}</span>
            </Link>
          ) : <span />}
          {suivante && (
            <Link href={suivante.url[lang]} className="docs-voisine suivante" rel="next">
              <span className="machine">{t.suivante} →</span>
              <span className="docs-voisine-titre">{typo(suivante.page.titre[lang], lang)}</span>
            </Link>
          )}
        </nav>
      )}
    </footer>
  )
}

/** Accueil de la documentation : une carte par rubrique, avec ses pages. */
function ToutesRubriques({ lang }: { lang: Lang }) {
  const t = libelles(lang)
  const a = ARBRES.documentation
  return (
    <section className="docs-rubriques" aria-labelledby={t.toutesRubriquesId}>
      <h2 id={t.toutesRubriquesId} className="titre">{t.toutesRubriques}</h2>
      <ul>
        {a.rubriques.map((r) => {
          const pages = pagesDeRubrique('documentation', r.id)
          if (pages.length === 0) return null
          return (
            <li key={r.id} id={`rubrique-${r.id}`} className="docs-rubrique">
              <p className="docs-rubrique-titre titre">{r.titre[lang]}</p>
              {accroches[r.id] && <p className="docs-rubrique-texte">{typo(accroches[r.id][lang], lang)}</p>}
              <ul>
                {pages.map((p) => (
                  <li key={p.id}><Link href={urlDe('documentation', p, lang)}>{typo(p.titre[lang], lang)}</Link></li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
      <p className="docs-rubriques-cas">
        <Link href={prefixe('cas', lang)} className="lien-fleche">{t.voirCas} <span aria-hidden="true">→</span></Link>
      </p>
    </section>
  )
}

/** Sommaire d'un arbre sans page d'accueil écrite : les rubriques et leurs pages, titre et chapô. */
function SommaireArbre({ arbre, lang }: { arbre: NomArbre; lang: Lang }) {
  const t = libelles(lang)
  const a = ARBRES[arbre]
  const entete = enteteArbre(arbre, lang)
  const rubriques = a.rubriques.map((r) => ({ r, pages: pagesDeRubrique(arbre, r.id) })).filter((x) => x.pages.length > 0)
  return (
    <Gabarit
      lang={lang}
      arbre={arbre}
      fil={[{ nom: arbre === 'cas' ? t.cas : t.documentation }]}
      titre={entete.titre}
      chapo={entete.chapo}
      titres={rubriques.map(({ r }) => ({ niveau: 2 as const, id: r.id, texte: r.titre[lang] }))}
      pied={
        <footer className="docs-pied">
          <p className="docs-rubriques-cas">
            <Link href={prefixe(arbre === 'cas' ? 'documentation' : 'cas', lang)} className="lien-fleche">{arbre === 'cas' ? t.voirDoc : t.voirCas} <span aria-hidden="true">→</span></Link>
          </p>
        </footer>
      }
    >
      <div className="docs-prose docs-liste-cas">
        {rubriques.map(({ r, pages }) => (
          <section key={r.id} aria-labelledby={r.id}>
            <h2 id={r.id} className="titre">{r.titre[lang]} <span className="machine docs-compte">{t.nbCas(pages.length)}</span></h2>
            <ul>
              {pages.map((p) => (
                <li key={p.id}>
                  <Link href={urlDe(arbre, p, lang)} className="docs-cas">
                    <span className="docs-cas-titre">{typo(p.titre[lang], lang)}</span>
                    <span className="docs-cas-texte">{typo(texteBrut(p.resume[lang]), lang)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Gabarit>
  )
}
