'use client'

import { useEffect, useState } from 'react'
import { IcoCoche, IcoFermer } from '@/components/outil/Icones'
import { ecrireCookie } from '@/lib/cookie-client'
import { useT } from '@/lib/i18n/client'

/** Message bref en bas d'écran après une action. Il s'efface seul au bout de six secondes. */
export function Annonce({ annonce }: { annonce: { id: string; texte: string; genre: 'ok' | 'erreur' } | null }) {
  const { t } = useT()
  const [fermee, setFermee] = useState<string | null>(null)

  useEffect(() => {
    if (!annonce) return
    // Le message est montré une fois : on efface le cookie qui le portait.
    ecrireCookie('gt_annonce', '', 0)
    const minuterie = setTimeout(() => setFermee(annonce.id), 6000)
    return () => clearTimeout(minuterie)
  }, [annonce])

  if (!annonce || fermee === annonce.id) return <div className="annonce-zone" role="status" aria-live="polite" />
  return (
    <div className="annonce-zone" role="status" aria-live="polite">
      <div key={annonce.id} className={`annonce ${annonce.genre === 'erreur' ? 'erreur' : ''}`}>
        {annonce.genre === 'ok' && <IcoCoche taille={15} />}
        <span className="min-w-0">{annonce.texte}</span>
        <button type="button" onClick={() => setFermee(annonce.id)} aria-label={t('Fermer le message')} className="annonce-fermer"><IcoFermer taille={14} /></button>
      </div>
    </div>
  )
}
