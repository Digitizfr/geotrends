import { metaDe } from '@/site/meta'
import { PageFamille } from '@/site/pages/Famille'

// Site public, page statique : aucun accès à la base ni à la session.
export const metadata = metaDe('agir', 'en')

export default function Page() {
  return <PageFamille lang="en" famille="agir" />
}
