'use client'

import { useRef, useState } from 'react'

/**
 * Capture cliquable : un clic ouvre l'image en grand dans une fenêtre
 * (élément <dialog>, natif : Échap la ferme, le focus y est tenu). L'image en
 * grand n'est chargée qu'à l'ouverture.
 */
export function Loupe({ src, largeur, hauteur, alt, libelle, fermer, children }: { src: string; largeur: number; hauteur: number; alt: string; libelle: string; fermer: string; children: React.ReactNode }) {
  const fenetre = useRef<HTMLDialogElement>(null)
  const [ouverte, setOuverte] = useState(false)

  const ouvrir = () => {
    setOuverte(true)
    fenetre.current?.showModal()
  }
  const refermer = () => fenetre.current?.close()

  return (
    <>
      <button type="button" className="docs-capture-bouton" onClick={ouvrir} aria-label={`${libelle} : ${alt}`} aria-haspopup="dialog">
        {children}
        <span className="docs-capture-loupe machine" aria-hidden="true">{libelle}</span>
      </button>
      <dialog
        ref={fenetre}
        className="docs-loupe"
        aria-label={alt}
        onClose={() => setOuverte(false)}
        // Un clic hors de l'image (sur le fond) referme la fenêtre.
        onClick={(e) => {
          if (e.target === e.currentTarget) refermer()
        }}
      >
        <div className="docs-loupe-corps">
          <button type="button" className="docs-loupe-fermer bouton" onClick={refermer} autoFocus>
            {fermer} <span aria-hidden="true">×</span>
          </button>
          {ouverte && (
            // Image d'origine, sans redimensionnement : c'est le but de la loupe.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} width={largeur} height={hauteur} alt={alt} decoding="async" />
          )}
        </div>
      </dialog>
    </>
  )
}
