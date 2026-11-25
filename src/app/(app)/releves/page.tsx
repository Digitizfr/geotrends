import { redirect } from 'next/navigation'
import { projetAffiche } from '@/lib/contexte'

/*
 * Ancienne adresse de la liste des relevés. Elle reste valable :
 *  - après un envoi (« ?lance=1 »), elle mène au journal des relevés du
 *    projet, où l'on suit le retour des réponses ;
 *  - sinon, elle mène à la vue d'ensemble, l'accueil de l'outil.
 * La liste par question vit désormais à l'adresse /questions.
 */
export default async function Releves({ searchParams }: { searchParams: Promise<{ lance?: string }> }) {
  const { lance } = await searchParams
  if (lance === '1') {
    const projet = await projetAffiche()
    if (projet) redirect(`/projets/${projet.id}?onglet=releves&lance=1`)
  }
  redirect('/vue')
}
