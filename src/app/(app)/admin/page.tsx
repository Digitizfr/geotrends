import { redirect } from 'next/navigation'

// La rubrique Administration n'a qu'une page pour l'instant : les coûts.
export default function Administration() {
  redirect('/admin/couts')
}
