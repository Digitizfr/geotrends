'use client'

import { useFormStatus } from 'react-dom'
import { useT } from '@/lib/i18n/client'

/** Lit les réponses prêtes. Gratuit : seul l'envoi d'une question est facturé. */
export function BoutonCollecte({ creux = true }: { creux?: boolean }) {
  const { pending } = useFormStatus()
  const { t } = useT()
  return (
    <button type="submit" disabled={pending} className={`bouton shrink-0 ${creux ? 'bouton-creux' : ''}`}>
      {pending ? t('Lecture en cours…') : t('Récupérer les réponses')}
    </button>
  )
}
