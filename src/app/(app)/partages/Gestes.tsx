'use client'

import { useState } from 'react'
import { useT } from '@/lib/i18n/client'

/** Copie l'adresse de la page, et le dit pendant deux secondes. */
export function CopierLien({ lien }: { lien: string }) {
  const { t } = useT()
  const [fait, setFait] = useState(false)
  return (
    <button
      type="button"
      className="bouton bouton-petit"
      onClick={async () => {
        await navigator.clipboard.writeText(lien)
        setFait(true)
        setTimeout(() => setFait(false), 2000)
      }}
    >
      {fait ? t('Copié') : t('Copier le lien')}
    </button>
  )
}

/** Supprimer, en deux temps : le lien et ses réglages disparaissent. */
export function SupprimerPartage({ id, titre, action }: { id: string; titre: string; action: (d: FormData) => Promise<void> }) {
  const { t } = useT()
  const [confirmer, setConfirmer] = useState(false)
  if (!confirmer) return <button type="button" className="bouton bouton-creux bouton-petit" onClick={() => setConfirmer(true)}>{t('Supprimer')}</button>
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <span className="second">{t('Supprimer « {titre} » ?', { titre })}</span>
      <button type="submit" className="bouton bouton-petit bouton-danger">{t('Oui, supprimer')}</button>
      <button type="button" className="bouton bouton-creux bouton-petit" onClick={() => setConfirmer(false)}>{t('Annuler')}</button>
    </form>
  )
}
