import { metaDoc, PageArbre, statiques } from '@/site/docs/composants/Route'

// Site public, pages statiques : le contenu vient de src/site/docs (aucun accès à la base).
// Toutes les adresses sont produites à la construction ; une adresse inconnue répond 404 (notFound dans PageArbre).
// Pas de « dynamicParams = false » : une page statique invalidée doit pouvoir se refaire à la demande,
// sinon elle répond 404 jusqu'à la construction suivante (constaté en ligne le 25/11/2026).
export const generateStaticParams = () => statiques('cas', 'en')

type Props = { params: Promise<{ chemin?: string[] }> }

export async function generateMetadata({ params }: Props) {
  return metaDoc('cas', 'en', (await params).chemin)
}

export default async function Page({ params }: Props) {
  return <PageArbre arbre="cas" lang="en" morceaux={(await params).chemin} />
}
