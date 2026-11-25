'use client'

import { useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n/client'
import { IcoMenu, IcoRecherche } from './Icones'

/** Ouvre le menu en tiroir, sur téléphone. Le menu vit dans le cadre : on le prévient par un événement. */
export function BoutonMenu() {
  const { t } = useT()
  const bouton = useRef<HTMLButtonElement>(null)
  // La hauteur de la barre est donnée aux tableaux : leur en-tête se colle juste dessous.
  useEffect(() => {
    const barre = bouton.current?.closest('.barre-haut')
    if (!barre) return
    const mesurer = () => document.documentElement.style.setProperty('--barre-h', `${Math.round(barre.getBoundingClientRect().height)}px`)
    mesurer()
    const veille = new ResizeObserver(mesurer)
    veille.observe(barre)
    return () => veille.disconnect()
  }, [])
  return (
    <button ref={bouton} type="button" className="bouton-icone barre-menu" aria-label={t('Ouvrir le menu')} onClick={() => window.dispatchEvent(new Event('gt:menu'))}>
      <IcoMenu taille={19} />
    </button>
  )
}

/** Ouvre la recherche rapide (Cmd K ou Ctrl K). */
export function BoutonRecherche() {
  const { t } = useT()
  return (
    <button type="button" className="bouton-icone barre-recherche" aria-label={t('Rechercher')} title={t('Rechercher')} onClick={() => window.dispatchEvent(new Event('gt:recherche'))}>
      <IcoRecherche taille={17} />
    </button>
  )
}
