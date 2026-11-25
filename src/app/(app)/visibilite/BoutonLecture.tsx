'use client'

import { useFormStatus } from 'react-dom'
import { useT } from '@/lib/i18n/client'

/** Bouton de la lecture automatique des réponses. C'est un appel payant : son prix est écrit dans le libellé. */
export function BoutonLecture({ prix }: { prix?: string }) {
  const { pending } = useFormStatus()
  const { t } = useT()
  return (
    <button type="submit" disabled={pending} className="bouton shrink-0">
      {pending ? t('Lecture en cours…') : `${t('Lire les réponses')}${prix ? ` : ${prix}` : ''}`}
    </button>
  )
}
