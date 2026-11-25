'use client'

import { useState, useSyncExternalStore } from 'react'
import { useT } from '@/lib/i18n/client'

const CLE = 'gt_vue_reponses'
const CHANGEMENT = 'gt:vue-reponses'
type Vue = 'onglets' | 'cote'

function abonner(rappel: () => void) {
  window.addEventListener('storage', rappel)
  window.addEventListener(CHANGEMENT, rappel)
  return () => {
    window.removeEventListener('storage', rappel)
    window.removeEventListener(CHANGEMENT, rappel)
  }
}
const lireVue = (): Vue => {
  try {
    return localStorage.getItem(CLE) === 'cote' ? 'cote' : 'onglets'
  } catch {
    return 'onglets'
  }
}

/**
 * Les réponses des IA à une question, un jour donné. Deux vues, au choix (le
 * choix est retenu) : en onglets, une IA à la fois sur toute la largeur, avec
 * ses marques et ses sources à droite ; ou côte à côte, une colonne par IA.
 * Sur téléphone : toujours des onglets. Claude, mesuré par l'API, garde son
 * onglet en tirets et sa colonne derrière un filet double.
 */
export function Colonnes({ colonnes, depart }: { colonnes: { cle: string; libelle: string; api: boolean; etat: 'la' | 'absente' | 'rien'; contenu: React.ReactNode }[]; depart?: string }) {
  const { t } = useT()
  const [actif, setActif] = useState(colonnes.some((c) => c.cle === depart) ? depart! : colonnes[0]?.cle)
  const vue = useSyncExternalStore(abonner, lireVue, () => 'onglets' as Vue)
  const choisir = (v: Vue) => {
    try {
      localStorage.setItem(CLE, v)
    } catch {
      // Stockage indisponible : la vue vaut pour cette page seulement.
    }
    window.dispatchEvent(new Event(CHANGEMENT))
  }
  const signe = { la: '◆', absente: '○', rien: '·' }
  const dit = { la: t('présente'), absente: t('absente'), rien: t('sans réponse') }
  return (
    <div className="reponses" data-vue={vue}>
      <div className="reponses-barre">
        <div className="onglets" role="tablist" aria-label={t('Choisir une IA')}>
          {colonnes.map((c) => (
            <button key={c.cle} type="button" role="tab" id={`onglet-${c.cle}`} aria-controls={`reponse-${c.cle}`} aria-selected={c.cle === actif} className={`onglet ${c.api ? 'api' : ''}`} onClick={() => setActif(c.cle)}>
              <span className={`signe-etat ${c.etat}`} aria-hidden="true">{signe[c.etat]}</span>
              {c.libelle}{c.api ? ' (API)' : ''}
              <span className="invisible-lecteur"> : {dit[c.etat]}</span>
            </button>
          ))}
        </div>
        <div className="segments reponses-choix" role="group" aria-label={t('Disposition des réponses')}>
          <button type="button" className="segment" aria-pressed={vue === 'onglets'} onClick={() => choisir('onglets')}>{t('Onglets')}</button>
          <button type="button" className="segment" aria-pressed={vue === 'cote'} onClick={() => choisir('cote')}>{t('Côte à côte')}</button>
        </div>
      </div>
      <div className="reponses-colonnes">
        {colonnes.map((c) => (
          <div key={c.cle} id={`reponse-${c.cle}`} role="tabpanel" aria-labelledby={`onglet-${c.cle}`} className={`reponse-colonne ${c.api ? 'api' : ''} ${c.cle === actif ? 'active' : ''}`}>
            {c.contenu}
          </div>
        ))}
      </div>
    </div>
  )
}
