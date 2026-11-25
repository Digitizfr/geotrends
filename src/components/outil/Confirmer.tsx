'use client'

import { useRef } from 'react'
import { useT } from '@/lib/i18n/client'

/**
 * Bouton d'envoi qui demande une confirmation dans une fenêtre de dialogue.
 * À placer dans un formulaire : « Confirmer » envoie ce formulaire.
 */
export function Confirmer({ libelle, titre, children, confirmer, className = 'bouton bouton-creux bouton-petit', nom, valeur, disabled = false }: { libelle: React.ReactNode; titre: string; children: React.ReactNode; confirmer?: string; className?: string; nom?: string; valeur?: string; disabled?: boolean }) {
  const { t } = useT()
  const dialogue = useRef<HTMLDialogElement>(null)
  const declencheur = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button ref={declencheur} type="button" className={className} disabled={disabled} onClick={() => dialogue.current?.showModal()}>{libelle}</button>
      <dialog ref={dialogue} className="dialogue" aria-label={titre}>
        <p className="titre text-[1.375rem]">{titre}</p>
        <div className="mt-2 text-[var(--encre-douce)]">{children}</div>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" className="bouton bouton-creux" onClick={() => dialogue.current?.close()}>{t('Annuler')}</button>
          <button
            type="button"
            className="bouton"
            onClick={() => {
              // Le dialogue est dans le formulaire : on l'envoie avec le nom et la valeur du bouton d'origine.
              const formulaire = declencheur.current?.form
              dialogue.current?.close()
              if (!formulaire) return
              if (nom) {
                const champ = document.createElement('input')
                champ.type = 'hidden'
                champ.name = nom
                champ.value = valeur ?? ''
                formulaire.appendChild(champ)
              }
              formulaire.requestSubmit()
            }}
          >
            {confirmer ?? t('Confirmer')}
          </button>
        </div>
      </dialog>
    </>
  )
}
