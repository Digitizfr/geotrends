'use client'

import { useState } from 'react'
import { useT } from '@/lib/i18n/client'

/** Un bouton en deux temps : le geste, puis « Oui ». Les champs cachés partent avec. */
export function Confirmer({ action, champs, libelle, question, oui, petit = true }: { action: (d: FormData) => Promise<void>; champs: Record<string, string>; libelle: string; question: string; oui: string; petit?: boolean }) {
  const { t } = useT()
  const [ouvert, setOuvert] = useState(false)
  const taille = petit ? 'bouton-petit' : ''
  if (!ouvert) return <button type="button" className={`bouton bouton-creux ${taille}`} onClick={() => setOuvert(true)}>{libelle}</button>
  return (
    <form action={action} className="inline-flex flex-wrap items-center gap-2">
      {Object.entries(champs).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <span className="second">{question}</span>
      <button type="submit" className={`bouton bouton-danger ${taille}`}>{oui}</button>
      <button type="button" className={`bouton bouton-creux ${taille}`} onClick={() => setOuvert(false)}>{t('Annuler')}</button>
    </form>
  )
}
