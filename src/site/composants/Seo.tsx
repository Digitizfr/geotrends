import { chemin, type Lang } from '../i18n'
import { GITHUB } from '../liens'

/*
 * Données structurées (schema.org, en JSON-LD) du site public. Elles disent
 * aux moteurs de recherche et aux IA ce qu'est GeoTrends, qui le publie, et
 * reprennent mot pour mot les questions fréquentes affichées sur la page.
 */

export const SITE = 'https://geotrends.io'

/** Balise <script type="application/ld+json">. Le contenu est échappé pour ne jamais fermer la balise. */
export function JsonLd({ donnees }: { donnees: object }) {
  const json = JSON.stringify(donnees).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

const DESCRIPTION: Record<Lang, string> = {
  fr: 'Logiciel GEO open source et gratuit, à installer chez soi avec ses propres clés d’API : il mesure la visibilité d’une marque dans les réponses de ChatGPT, Gemini, du Mode IA et des Aperçus IA de Google, et de Claude.',
  en: 'Free, open-source, self-hosted GEO software that runs on your own API keys: it measures a brand’s visibility in the answers of ChatGPT, Gemini, Google AI Mode and AI Overviews, and Claude.',
}

/** Organisation, site et logiciel : sur la page d'accueil de chaque langue. */
export function grapheAccueil(lang: Lang, faq: readonly (readonly string[])[]) {
  const url = `${SITE}${chemin('accueil', lang) === '/' ? '' : chemin('accueil', lang)}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE}/#organisation`,
        name: 'GeoTrends',
        url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/logo-geotrends.png`, width: 512, height: 512 },
        parentOrganization: { '@type': 'Organization', name: 'Digitiz', url: 'https://digitiz.fr' },
        sameAs: [GITHUB],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#site`,
        url: SITE,
        name: 'GeoTrends',
        inLanguage: ['fr-FR', 'en'],
        publisher: { '@id': `${SITE}/#organisation` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE}/#logiciel`,
        name: 'GeoTrends',
        url,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Generative Engine Optimization (GEO)',
        operatingSystem: 'Linux, macOS, Windows (Docker)',
        description: DESCRIPTION[lang],
        isAccessibleForFree: true,
        license: 'https://www.gnu.org/licenses/agpl-3.0.html',
        downloadUrl: GITHUB,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        inLanguage: lang === 'fr' ? 'fr-FR' : 'en',
        publisher: { '@id': `${SITE}/#organisation` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#questions`,
        inLanguage: lang === 'fr' ? 'fr-FR' : 'en',
        mainEntity: faq.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })),
      },
    ],
  }
}

/** Fil d'Ariane d'une page intérieure, pour les moteurs de recherche. */
export function grapheFil(lang: Lang, fil: { nom: string; href?: string }[]) {
  const accueil = `${SITE}${chemin('accueil', lang) === '/' ? '' : chemin('accueil', lang)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ nom: 'GeoTrends', href: accueil }, ...fil].map((x, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: x.nom,
      ...(x.href ? { item: x.href.startsWith('http') ? x.href : `${SITE}${x.href}` } : {}),
    })),
  }
}
