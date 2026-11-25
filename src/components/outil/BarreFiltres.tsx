'use client'

import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react'
import { reglerFiltres } from '@/app/(app)/_actions/filtres'
import { useT } from '@/lib/i18n/client'
import { IcoFermer, IcoFiltres } from './Icones'

type Option = { cle: string; libelle: string; court?: string }
type Etat = { periode: string; masquees: string[]; concurrent: string }

/**
 * Filtres de la barre du haut : la période en boutons côte à côte, les IA en
 * pastilles qu'on allume ou qu'on éteint (Claude, mesuré par l'API, reste à
 * part, en tirets), et le concurrent face auquel on se compare. Le réglage
 * s'applique au clic et vaut pour tous les écrans de mesure. Sur téléphone, le
 * tout se range derrière un bouton « Filtres ».
 */
export function BarreFiltres({ periodes, periode, defaut, interfaces, api, masquees, actif, concurrents = [], concurrent = '' }: { periodes: Option[]; periode: string; defaut: string; interfaces: Option[]; api: Option[]; masquees: string[]; actif: boolean; concurrents?: Option[]; concurrent?: string }) {
  const { t } = useT()
  const [enCours, demarrer] = useTransition()
  const [etat, setEtat] = useOptimistic<Etat>({ periode, masquees, concurrent })
  const [ouvert, setOuvert] = useState(false)
  const boite = useRef<HTMLDivElement>(null)
  const proposees = [...interfaces, ...api].map((o) => o.cle)
  const nbActifs = [etat.periode !== defaut, etat.masquees.length > 0, !!etat.concurrent].filter(Boolean).length

  useEffect(() => {
    if (!ouvert) return
    const fermer = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !boite.current?.contains(e.target as Node)) setOuvert(false)
    }
    document.addEventListener('mousedown', fermer)
    document.addEventListener('keydown', fermer)
    return () => {
      document.removeEventListener('mousedown', fermer)
      document.removeEventListener('keydown', fermer)
    }
  }, [ouvert])

  const appliquer = (suite: Etat | 'reinitialiser') => {
    const donnees = new FormData()
    if (suite === 'reinitialiser') donnees.set('reinitialiser', '1')
    else {
      donnees.set('periode', suite.periode)
      donnees.set('proposees', proposees.join(','))
      for (const cle of proposees) if (!suite.masquees.includes(cle)) donnees.set(`ia_${cle}`, 'on')
      donnees.set('concurrent', suite.concurrent)
    }
    demarrer(async () => {
      if (suite !== 'reinitialiser') setEtat(suite)
      await reglerFiltres(donnees)
    })
  }
  const basculerIa = (cle: string) => {
    const suite = etat.masquees.includes(cle) ? etat.masquees.filter((x) => x !== cle) : [...etat.masquees, cle]
    // Tout éteindre n'aurait pas de sens : la dernière IA allumée le reste.
    if (suite.length >= proposees.length) return
    appliquer({ ...etat, masquees: suite })
  }
  const pastille = (o: Option, estApi: boolean) => {
    const allumee = !etat.masquees.includes(o.cle)
    return (
      <button key={o.cle} type="button" className={`pastille-ia ${estApi ? 'api' : ''}`} aria-pressed={allumee} onClick={() => basculerIa(o.cle)} title={estApi ? t('Mesuré par l’API : jamais additionné aux relevés d’interface') : allumee ? t('Masquer {ia}', { ia: o.libelle }) : t('Afficher {ia}', { ia: o.libelle })}>
        <span className="signe-ia" aria-hidden="true">{o.libelle.charAt(0)}</span>
        {o.libelle}
        {estApi && <span className="etiquette">API</span>}
      </button>
    )
  }

  return (
    <div ref={boite} className="filtres" data-ouvert={ouvert ? 'oui' : 'non'} aria-busy={enCours}>
      <button type="button" className="bouton bouton-creux bouton-petit filtres-bouton" aria-expanded={ouvert} aria-controls="filtres-corps" onClick={() => setOuvert((v) => !v)}>
        <IcoFiltres taille={15} />
        {t('Filtres')}
        {nbActifs > 0 && <span className="compteur">{nbActifs}</span>}
      </button>
      <div id="filtres-corps" className="filtres-corps">
        <div className="filtres-tete">
          <p className="t4">{t('Filtres')}</p>
          <button type="button" className="bouton-icone" aria-label={t('Fermer les filtres')} onClick={() => setOuvert(false)}><IcoFermer taille={17} /></button>
        </div>
        <div className="filtre" role="group" aria-label={t('Période')}>
          <span className="etiquette filtre-nom">{t('Période')}</span>
          <div className="segments">
            {periodes.map((p) => (
              <button key={p.cle} type="button" className="segment" aria-pressed={etat.periode === p.cle} title={p.libelle} onClick={() => etat.periode !== p.cle && appliquer({ ...etat, periode: p.cle })}>
                <span className="segment-court">{p.court ?? p.libelle}</span>
                <span className="segment-long">{p.libelle}</span>
              </button>
            ))}
          </div>
        </div>
        {proposees.length > 0 && (
          <div className="filtre" role="group" aria-label={t('IA affichées')}>
            <span className="etiquette filtre-nom">{t('IA')}</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {interfaces.map((o) => pastille(o, false))}
              {api.length > 0 && interfaces.length > 0 && <span className="trait-double mx-0.5 h-6" aria-hidden="true" />}
              {api.map((o) => pastille(o, true))}
            </div>
          </div>
        )}
        {concurrents.length > 0 && (
          <label className="filtre" title={t('Ne garder que les réponses qui nomment un concurrent suivi : on voit où l’on en est face à lui')}>
            <span className="etiquette filtre-nom">{t('Face à')}</span>
            <select value={etat.concurrent} onChange={(e) => appliquer({ ...etat, concurrent: e.target.value })} className="champ champ-petit">
              <option value="">{t('Toutes les réponses')}</option>
              {concurrents.map((c) => <option key={c.cle} value={c.cle}>{c.libelle}</option>)}
            </select>
          </label>
        )}
        {actif && (
          <button type="button" className="lien filtres-raz" onClick={() => appliquer('reinitialiser')}>{t('Réinitialiser')}</button>
        )}
      </div>
    </div>
  )
}
