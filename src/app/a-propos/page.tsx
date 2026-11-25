import { metaDe } from '@/site/meta'
import { PageAPropos } from '@/site/pages/APropos'

// Site public, page statique : aucun accès à la base ni à la session.
export const metadata = metaDe('apropos', 'fr')

export default function Page() {
  return <PageAPropos lang="fr" />
}
