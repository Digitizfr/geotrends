'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useT } from '@/lib/i18n/client'
import { IcoAide } from './Icones'

type Place = { left: number; top?: number; bottom?: number }

/**
 * Bulle d'aide : un petit « ? » à côté d'un libellé, qui dit comment le
 * chiffre est calculé. Elle s'ouvre au survol, au focus du clavier et au
 * toucher ; elle se place seule pour ne jamais sortir de l'écran.
 */
export function Aide({ children, libelle }: { children: React.ReactNode; libelle?: string }) {
  const { t } = useT()
  const id = useId()
  const bouton = useRef<HTMLButtonElement>(null)
  const [place, setPlace] = useState<Place | null>(null)

  const ouvrir = () => {
    const r = bouton.current?.getBoundingClientRect()
    if (!r) return
    const largeur = Math.min(304, window.innerWidth - 16)
    const left = Math.max(8, Math.min(r.left + r.width / 2 - largeur / 2, window.innerWidth - largeur - 8))
    setPlace(r.top > window.innerHeight * 0.6 ? { left, bottom: window.innerHeight - r.top + 8 } : { left, top: r.bottom + 8 })
  }
  const fermer = () => setPlace(null)

  useEffect(() => {
    if (!place) return
    const touche = (e: KeyboardEvent) => e.key === 'Escape' && setPlace(null)
    const dehors = (e: Event) => !bouton.current?.contains(e.target as Node) && setPlace(null)
    document.addEventListener('keydown', touche)
    document.addEventListener('pointerdown', dehors)
    window.addEventListener('scroll', fermer, { capture: true, passive: true })
    return () => {
      document.removeEventListener('keydown', touche)
      document.removeEventListener('pointerdown', dehors)
      window.removeEventListener('scroll', fermer, { capture: true })
    }
  }, [place])

  return (
    <>
      <button
        ref={bouton}
        type="button"
        className="aide-bouton"
        aria-label={libelle ?? t('Comment ce chiffre est calculé')}
        aria-expanded={!!place}
        aria-describedby={place ? id : undefined}
        onMouseEnter={ouvrir}
        onMouseLeave={fermer}
        onFocus={ouvrir}
        onBlur={fermer}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!place) ouvrir()
        }}
      >
        <IcoAide taille={13} />
      </button>
      {place && (
        <span id={id} role="tooltip" className="bulle" style={{ left: place.left, top: place.top, bottom: place.bottom }}>
          {children}
        </span>
      )}
    </>
  )
}
