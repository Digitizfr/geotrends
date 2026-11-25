import { metaDe } from '@/site/meta'
import { PageFonctionnalites } from '@/site/pages/Fonctionnalites'

// Site public, page statique : aucun accès à la base ni à la session.
export const metadata = metaDe('fonctions', 'en')

export default function Page() {
  return <PageFonctionnalites lang="en" />
}
