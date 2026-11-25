import { metaDe } from '@/site/meta'
import { PageAccueil } from '@/site/pages/Accueil'

// Site public, page statique : aucun accès à la base ni à la session.
export const metadata = metaDe('accueil', 'fr')

export default function Page() {
  return <PageAccueil lang="fr" />
}
