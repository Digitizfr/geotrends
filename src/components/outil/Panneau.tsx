'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n/client'
import { IcoFermer } from './Icones'

/**
 * Panneau latéral de détail : une source, une marque, une question, sans
 * quitter l'écran. Il se ferme par la croix, la touche Échap ou un clic à
 * côté. `fermer` est une adresse (panneau ouvert par un paramètre de
 * l'adresse) ou une fonction (panneau ouvert par un clic dans un tableau).
 */
export function PanneauLateral({ titre, sousTitre, fermer, children, large = false }: { titre: React.ReactNode; sousTitre?: React.ReactNode; fermer: string | (() => void); children: React.ReactNode; large?: boolean }) {
  const { t } = useT()
  const router = useRouter()
  const croix = useRef<HTMLButtonElement>(null)
  const sortir = useRef<() => void>(() => undefined)

  useEffect(() => {
    sortir.current = () => (typeof fermer === 'string' ? router.push(fermer, { scroll: false }) : fermer())
  }, [fermer, router])

  useEffect(() => {
    const avant = document.activeElement as HTMLElement | null
    croix.current?.focus()
    const touche = (e: KeyboardEvent) => e.key === 'Escape' && sortir.current()
    document.addEventListener('keydown', touche)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', touche)
      document.body.style.overflow = ''
      avant?.focus?.()
    }
  }, [])

  return (
    <>
      <div className="panneau-voile" onClick={() => sortir.current()} aria-hidden="true" />
      <aside className="panneau-lateral" role="dialog" aria-modal="true" aria-label={typeof titre === 'string' ? titre : t('Détail')} style={large ? { width: 'min(48rem, 100vw)' } : undefined}>
        <header>
          <div className="min-w-0">
            <p className="sous-titre">{sousTitre ?? t('Détail')}</p>
            <h2 className="titre mt-1 break-words text-[1.375rem] leading-tight">{titre}</h2>
          </div>
          <button ref={croix} type="button" className="bouton-icone" onClick={() => sortir.current()} aria-label={t('Fermer le panneau')} title={t('Fermer le panneau')}>
            <IcoFermer taille={18} />
          </button>
        </header>
        <div className="corps">{children}</div>
      </aside>
    </>
  )
}
