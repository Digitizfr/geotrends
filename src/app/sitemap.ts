import type { MetadataRoute } from 'next'
import { toutesLesPages } from '@/site/docs/registre'
import { CHEMINS, type Page } from '@/site/i18n'
import { estVitrine } from '@/site/liens'

// Lu à chaque requête : une installation chez soi n'a pas de plan de site (SITE_VITRINE).
export const dynamic = 'force-dynamic'

// Plan du site public, en français et en anglais, chaque page avec l'adresse
// de l'autre langue : les pages du site, puis toute la documentation et les
// cas d'usage (leur date est celle de leur dernière mise à jour, champ `maj`).
// L'outil n'y figure pas.
//
// MAJ_SITE : date de la dernière mise à jour du texte des pages du site.
// À changer à chaque lot qui modifie leur texte.
const MAJ_SITE = '2026-11-25'
const SITE = 'https://geotrends.io'

const PRIORITE: Partial<Record<Page, number>> = { accueil: 1, fonctions: 0.9, documentation: 0.8, cas: 0.8 }
const absolue = (chemin: string) => `${SITE}${chemin === '/' ? '' : chemin}`

export default function sitemap(): MetadataRoute.Sitemap {
  if (!estVitrine()) return []
  // Les accueils de la documentation et des cas d'usage viennent du registre, avec leur date.
  const pagesDuSite = (Object.keys(CHEMINS) as Page[]).filter((p) => p !== 'documentation' && p !== 'cas').flatMap((p) =>
    (['fr', 'en'] as const).map((lang) => ({
      url: absolue(CHEMINS[p][lang]),
      lastModified: MAJ_SITE,
      changeFrequency: 'weekly' as const,
      priority: PRIORITE[p] ?? 0.7,
      alternates: { languages: { fr: absolue(CHEMINS[p].fr), en: absolue(CHEMINS[p].en) } },
    })),
  )
  const pagesDeDoc = toutesLesPages().flatMap((e) =>
    (['fr', 'en'] as const).map((lang) => ({
      url: absolue(e.url[lang]),
      lastModified: e.maj,
      changeFrequency: 'monthly' as const,
      priority: e.accueil ? 0.8 : 0.6,
      alternates: { languages: { fr: absolue(e.url.fr), en: absolue(e.url.en) } },
    })),
  )
  return [...pagesDuSite, ...pagesDeDoc]
}
