import { metaDe } from '@/site/meta'
import { PageMoteurs } from '@/site/pages/Moteurs'

// Site public, page statique : aucun accès à la base ni à la session.
export const metadata = metaDe('moteurs', 'fr')

export default function Page() {
  return <PageMoteurs lang="fr" />
}
