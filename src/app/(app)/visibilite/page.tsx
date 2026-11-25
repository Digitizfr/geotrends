import { redirect } from 'next/navigation'

/** L'ancienne page « Visibilité » était un fourre-tout : ses blocs sont devenus des écrans. Son adresse mène à la vue d'ensemble. */
export default function Visibilite() {
  redirect('/vue')
}
