import type { MetadataRoute } from 'next'
import { estVitrine } from '@/site/liens'

// Lu à chaque requête : la réponse dépend de l'installation (SITE_VITRINE).
export const dynamic = 'force-dynamic'

// Sur geotrends.io, le site public est ouvert à tous les robots, y compris ceux
// des IA : un outil de GEO doit pouvoir être lu et cité. L'outil et l'API ne
// sont pas à explorer (leurs pages portent aussi « noindex » et demandent une
// connexion). Sur une installation chez soi, rien n'est à explorer.
export default function robots(): MetadataRoute.Robots {
  if (!estVitrine()) return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/invitation/', '/partage/'] }],
    sitemap: 'https://geotrends.io/sitemap.xml',
    host: 'https://geotrends.io',
  }
}
