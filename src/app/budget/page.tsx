import { metaDe } from '@/site/meta'
import { PageBudget } from '@/site/pages/Budget'

// Site public, page statique : aucun accès à la base ni à la session.
export const metadata = metaDe('budget', 'fr')

export default function Page() {
  return <PageBudget lang="fr" />
}
