import { metaDe } from '@/site/meta'
import { PageMethode } from '@/site/pages/Methode'

// Site public, page statique : aucun accès à la base ni à la session.
export const metadata = metaDe('methode', 'fr')

export default function Page() {
  return <PageMethode lang="fr" />
}
