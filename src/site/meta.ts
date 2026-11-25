import type { Metadata } from 'next'
import { accueil } from './contenu/accueil'
import { apropos } from './contenu/apropos'
import { budget } from './contenu/budget'
import { familles, hub } from './contenu/fonctions'
import { methode } from './contenu/methode'
import { moteurs } from './contenu/moteurs'
import { chemin, type Lang, type Page } from './i18n'

// Titre et description de chaque page, dans chaque langue : ils vivent dans
// les fichiers de contenu, à côté du texte de la page.
const metaDePage = (page: Page, lang: Lang): { titre: string; description: string } => {
  switch (page) {
    case 'accueil': return accueil[lang].meta
    case 'fonctions': return hub[lang].meta
    case 'mesurer':
    case 'comprendre':
    case 'agir':
    case 'piloter': return familles[lang][page].meta
    case 'methode': return methode[lang].meta
    case 'moteurs': return moteurs[lang].meta
    case 'budget': return budget[lang].meta
    case 'apropos': return apropos[lang].meta
    case 'documentation': return lang === 'fr'
      ? { titre: 'Documentation', description: 'Comment se servir de GeoTrends, écran par écran : créer un projet, lancer un relevé, lire la visibilité, comprendre qui est cité à votre place et quoi corriger.' }
      : { titre: 'Documentation', description: 'How to use GeoTrends, screen by screen: create a project, launch a reading, read visibility, understand who is cited instead of you and what to fix.' }
    case 'cas': return lang === 'fr'
      ? { titre: 'Cas d’usage', description: 'Les questions que l’on se pose sur sa visibilité dans les IA, et la marche à suivre dans GeoTrends pour y répondre, preuve à l’appui.' }
      : { titre: 'Use cases', description: 'The questions people ask about their visibility in AI answers, and the steps to answer each one in GeoTrends, with the evidence.' }
  }
}

/** Métadonnées d'une page du site public : titre, description, et l'adresse de l'autre langue. */
export function metaDe(page: Page, lang: Lang): Metadata {
  const m = metaDePage(page, lang)
  const titre = m.titre.includes('GeoTrends') ? m.titre : `${m.titre} · GeoTrends`
  return {
    metadataBase: new URL('https://geotrends.io'),
    title: titre,
    description: m.description,
    alternates: {
      canonical: chemin(page, lang),
      languages: { fr: chemin(page, 'fr'), en: chemin(page, 'en'), 'x-default': chemin(page, 'fr') },
    },
    openGraph: { title: titre, description: m.description, url: chemin(page, lang), siteName: 'GeoTrends', locale: lang === 'fr' ? 'fr_FR' : 'en_GB', alternateLocale: lang === 'fr' ? 'en_GB' : 'fr_FR', type: 'website' },
    twitter: { card: 'summary_large_image', title: titre, description: m.description },
  }
}
