'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { IcoHautBas, IcoPlus, IcoRecherche } from '@/components/outil/Icones'
import { Initiale } from '@/components/outil/Initiale'
import { useT } from '@/lib/i18n/client'
import { choisirProjet } from './projets/actions'

export type ProjetDuMenu = { id: string; nom: string; marche: string; dernier: string | null }

const sansAccent = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * Choix du projet affiché dans tout l'outil : la pastille de la marque, son
 * nom et son marché ; au clic, une liste avec recherche, le dernier relevé de
 * chaque projet, « Tous les projets » et « Nouveau projet ».
 */
export function SelecteurProjet({ projets, courant, reduit = false, surNavigation }: { projets: ProjetDuMenu[]; courant: string; reduit?: boolean; surNavigation?: () => void }) {
  const { t } = useT()
  const [ouvert, setOuvert] = useState(false)
  const [recherche, setRecherche] = useState('')
  const boite = useRef<HTMLDivElement>(null)
  const champ = useRef<HTMLInputElement>(null)
  const actuel = projets.find((p) => p.id === courant) ?? projets[0]

  useEffect(() => {
    if (!ouvert) return
    champ.current?.focus()
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

  const fermer = () => {
    setOuvert(false)
    setRecherche('')
    surNavigation?.()
  }
  const q = sansAccent(recherche.trim())
  const trouves = q ? projets.filter((p) => sansAccent(`${p.nom} ${p.marche}`).includes(q)) : projets

  if (!actuel) {
    return (
      <Link href="/projets/nouveau" className="projet-bouton" onClick={surNavigation} title={reduit ? t('Nouveau projet') : undefined}>
        <span className="initiale m"><IcoPlus taille={13} /></span>
        <span className="projet-texte"><span className="block truncate font-semibold leading-tight">{t('Nouveau projet')}</span></span>
      </Link>
    )
  }
  return (
    <div ref={boite} className="relative">
      <button type="button" onClick={() => setOuvert((v) => !v)} aria-haspopup="dialog" aria-expanded={ouvert} className="projet-bouton" title={reduit ? `${t('Projet')} : ${actuel.nom}` : undefined}>
        <Initiale nom={actuel.nom} nous />
        <span className="projet-texte">
          <span className="block truncate font-semibold leading-tight">{actuel.nom}</span>
          <span className="machine block truncate">{actuel.marche}</span>
        </span>
        <IcoHautBas taille={14} className="projet-fleche text-[var(--encre-douce)]" />
      </button>
      {ouvert && (
        <div className={`menu-flottant projet-liste ${reduit ? 'a-droite' : ''}`} role="dialog" aria-label={t('Changer de projet')}>
          {projets.length > 4 || recherche ? (
            <label className="champ-recherche border-b border-[var(--encre)]">
              <IcoRecherche taille={14} />
              <span className="invisible-lecteur">{t('Chercher un projet')}</span>
              <input ref={champ} type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder={t('Chercher un projet')} />
            </label>
          ) : (
            <p className="etiquette border-b border-[var(--filet)] px-3 py-2">{t('Projets')}</p>
          )}
          <form action={choisirProjet} onSubmit={fermer}>
            <ul className="max-h-[50vh] overflow-y-auto">
              {trouves.map((p) => (
                <li key={p.id} className="border-b border-[var(--filet)]">
                  <button type="submit" name="projetId" value={p.id} aria-current={p.id === actuel.id ? 'true' : undefined} className="projet-ligne">
                    <Initiale nom={p.nom} nous={p.id === actuel.id} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-semibold">{p.nom}</span>
                        {p.id === actuel.id && <span className="etiquette shrink-0">{t('affiché')}</span>}
                      </span>
                      <span className="second block truncate">{p.marche} · {p.dernier ? t('relevé le {date}', { date: p.dernier }) : t('aucun relevé')}</span>
                    </span>
                  </button>
                </li>
              ))}
              {trouves.length === 0 && <li className="second px-3 py-3">{t('Aucun projet ne correspond.')}</li>}
            </ul>
          </form>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-[0.8125rem]">
            <Link href="/projets" onClick={fermer} className="lien">{t('Tous les projets')}</Link>
            <Link href="/projets/nouveau" onClick={fermer} className="lien inline-flex items-center gap-1"><IcoPlus taille={13} />{t('Nouveau projet')}</Link>
          </div>
        </div>
      )}
    </div>
  )
}
