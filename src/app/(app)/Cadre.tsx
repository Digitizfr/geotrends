'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { IcoFermer, IcoOuvrir, IcoRecherche, IcoReduire, IcoSortie } from '@/components/outil/Icones'
import { authClient } from '@/lib/auth-client'
import { ecrireCookie } from '@/lib/cookie-client'
import { useT } from '@/lib/i18n/client'
import { NomLogo, Signe } from '@/site/composants/LogoSite'
import { Annonce } from './Annonce'
import { Navigation, type Compteurs } from './Navigation'
import { OUVRIR_RECHERCHE, Palette, type EntreeRecherche } from './Palette'
import { Initiale } from '@/components/outil/Initiale'
import { SelecteurProjet, type ProjetDuMenu } from './SelecteurProjet'

export const COOKIE_MENU = 'gt_menu'
export const OUVRIR_MENU = 'gt:menu'

export type Depense = { texte: string; part: number; depasse: boolean; lien: boolean }

const sansAbonnement = () => () => undefined
const surMac = () => /Mac|iPhone|iPad/.test(navigator.platform)

/**
 * Le cadre de l'outil : le menu latéral et la zone de travail.
 * Sur ordinateur, le menu se réduit à ses icônes (état retenu dans un cookie).
 * Sur téléphone, c'est un tiroir ouvert par le bouton de la barre du haut.
 */
export function Cadre({ children, admin, compteurs, projets, courant, reduitInitial, fermesInitial, compte, depense, recherche, annonce }: {
  children: React.ReactNode
  admin: boolean
  compteurs: Compteurs
  projets: ProjetDuMenu[]
  courant: string
  reduitInitial: boolean
  fermesInitial: string[]
  compte: { nom: string; email: string }
  depense: Depense | null
  recherche: EntreeRecherche[]
  annonce: { id: string; texte: string; genre: 'ok' | 'erreur' } | null
}) {
  const { t } = useT()
  const router = useRouter()
  const [reduitChoisi, setReduit] = useState(reduitInitial)
  const [tiroir, setTiroir] = useState(false)
  const menu = useRef<HTMLElement>(null)
  const mac = useSyncExternalStore(sansAbonnement, surMac, () => false)
  // Dans le tiroir du téléphone, le menu est toujours entier.
  const reduit = reduitChoisi && !tiroir

  useEffect(() => {
    const ouvrir = () => setTiroir(true)
    window.addEventListener(OUVRIR_MENU, ouvrir)
    return () => window.removeEventListener(OUVRIR_MENU, ouvrir)
  }, [])

  // Tableaux en fiches sur téléphone : chaque cellule reçoit le libellé de sa colonne, lu dans l'en-tête.
  // Seulement sur petit écran, et après l'hydratation de la page : React ne doit pas trouver d'attribut qu'il n'a pas écrit.
  useEffect(() => {
    const etroit = window.matchMedia('(max-width: 699px)')
    let veille: MutationObserver | null = null
    const etiqueter = () => {
      document.querySelectorAll<HTMLTableElement>('table.tableau.fiches').forEach((table) => {
        const tetes = [...table.querySelectorAll('thead th')].map((th) => th.textContent?.trim() ?? '')
        table.querySelectorAll('tbody tr').forEach((ligne) => {
          ;[...ligne.children].forEach((cellule, i) => {
            if (i > 0 && tetes[i] && !cellule.hasAttribute('data-libelle') && !cellule.hasAttribute('colspan')) cellule.setAttribute('data-libelle', tetes[i])
          })
        })
      })
    }
    const brancher = () => {
      if (!etroit.matches || veille) return
      etiqueter()
      veille = new MutationObserver(etiqueter)
      veille.observe(document.getElementById('contenu') ?? document.body, { childList: true, subtree: true })
    }
    const minuterie = setTimeout(brancher, 700)
    etroit.addEventListener('change', brancher)
    return () => {
      clearTimeout(minuterie)
      etroit.removeEventListener('change', brancher)
      veille?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!tiroir) return
    menu.current?.querySelector<HTMLElement>('button, a')?.focus()
    const touche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTiroir(false)
    }
    // Le tiroir ne vaut que sur petit écran : on le referme si la fenêtre s'élargit.
    const large = window.matchMedia('(min-width: 900px)')
    const elargie = () => large.matches && setTiroir(false)
    document.addEventListener('keydown', touche)
    large.addEventListener('change', elargie)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', touche)
      large.removeEventListener('change', elargie)
      document.body.style.overflow = ''
    }
  }, [tiroir])

  const basculer = () => {
    const suite = !reduitChoisi
    setReduit(suite)
    ecrireCookie(COOKIE_MENU, suite ? 'reduit' : 'ouvert')
  }
  const fermerTiroir = () => setTiroir(false)
  const chercher = () => {
    setTiroir(false)
    window.dispatchEvent(new Event(OUVRIR_RECHERCHE))
  }

  return (
    <div className="chassis" data-menu={reduit ? 'reduit' : 'ouvert'} data-tiroir={tiroir ? 'ouvert' : 'ferme'}>
      <a href="#contenu" className="evitement">{t('Aller au contenu')}</a>
      <div className="voile" onClick={fermerTiroir} aria-hidden="true" />
      <aside ref={menu} className="menu" aria-label={t('Menu et projet')}>
        <div className="menu-tete">
          <Link href="/vue" aria-label={t('GeoTrends, vue d’ensemble')} className="logo-site inline-flex min-w-0 items-center gap-2" onClick={fermerTiroir}>
            <Signe taille={26} />
            <NomLogo taille={19} className="menu-seulement-ouvert" />
          </Link>
          <button type="button" className="bouton-icone menu-bascule" onClick={basculer} aria-pressed={reduit} aria-label={reduit ? t('Ouvrir le menu') : t('Réduire le menu aux icônes')} title={reduit ? t('Ouvrir le menu') : t('Réduire le menu aux icônes')}>
            {reduit ? <IcoOuvrir taille={17} /> : <IcoReduire taille={17} />}
          </button>
          <button type="button" className="bouton-icone menu-fermer" onClick={fermerTiroir} aria-label={t('Fermer le menu')}>
            <IcoFermer taille={18} />
          </button>
        </div>

        <div className="menu-projet">
          <SelecteurProjet projets={projets} courant={courant} reduit={reduit} surNavigation={fermerTiroir} />
          <button type="button" className="menu-recherche" onClick={chercher} title={reduit ? t('Rechercher') : undefined} aria-label={reduit ? t('Rechercher') : undefined}>
            <IcoRecherche taille={15} />
            <span className="menu-seulement-ouvert flex-1 text-left">{t('Rechercher')}</span>
            <kbd className="touche menu-seulement-ouvert">{mac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
        </div>

        <div className="menu-corps">
          <Navigation admin={admin} compteurs={compteurs} reduit={reduit} fermesInitial={fermesInitial} surNavigation={fermerTiroir} />
        </div>

        <div className="menu-pied">
          {depense && (
            <DepenseDuMois depense={depense} reduit={reduit} surNavigation={fermerTiroir} />
          )}
          <div className="menu-compte">
            <Initiale nom={compte.nom} />
            <span className="menu-seulement-ouvert min-w-0 flex-1">
              <span className="block truncate text-[0.875rem] font-semibold leading-tight">{compte.nom}</span>
              <span className="second block truncate leading-tight">{compte.email}</span>
            </span>
            <button
              type="button"
              className="bouton-icone menu-seulement-ouvert"
              aria-label={t('Se déconnecter')}
              title={t('Se déconnecter')}
              onClick={async () => {
                await authClient.signOut()
                router.push('/connexion')
                router.refresh()
              }}
            >
              <IcoSortie taille={16} />
            </button>
          </div>
        </div>
      </aside>

      <main id="contenu" className="contenu">{children}</main>

      <Palette admin={admin} compteurs={compteurs} entrees={recherche} />
      <Annonce annonce={annonce} />
    </div>
  )
}

/** Le plafond de dépense du mois, en une ligne et une barre fine. */
function DepenseDuMois({ depense, reduit, surNavigation }: { depense: Depense; reduit: boolean; surNavigation: () => void }) {
  const { t } = useT()
  const titre = `${t('Dépense du mois')} : ${depense.texte}`
  const contenu = (
    <>
      <span className="menu-seulement-ouvert flex items-baseline justify-between gap-2">
        <span className="etiquette">{t('Dépense du mois')}</span>
        <span className="chiffre text-[0.75rem]">{depense.texte}</span>
      </span>
      <span className={`jauge fine mt-1.5 block ${depense.depasse ? 'depasse' : ''}`} role="img" aria-label={titre}>
        <span style={{ width: `${Math.min(100, Math.max(depense.part > 0 ? 2 : 0, depense.part * 100))}%` }} />
      </span>
    </>
  )
  return depense.lien ? (
    <Link href="/admin/couts" className="menu-depense" title={reduit ? titre : t('Voir le détail des coûts')} onClick={surNavigation}>{contenu}</Link>
  ) : (
    <div className="menu-depense" title={reduit ? titre : undefined}>{contenu}</div>
  )
}
