'use client'

import { useFormStatus } from 'react-dom'
import { useT } from '@/lib/i18n/client'

/**
 * Bouton d'envoi d'un formulaire, qui dit ce qu'il fait pendant qu'il le fait.
 * Pour un appel payant, le prix s'écrit dans le libellé.
 */
export function BoutonEnvoi({ children, enCours, className = 'bouton', nom, valeur, disabled = false }: { children: React.ReactNode; enCours?: string; className?: string; nom?: string; valeur?: string; disabled?: boolean }) {
  const { pending } = useFormStatus()
  const { t } = useT()
  return (
    <button type="submit" name={nom} value={valeur} disabled={pending || disabled} className={`${className} shrink-0`}>
      {pending ? (enCours ?? t('En cours…')) : children}
    </button>
  )
}
