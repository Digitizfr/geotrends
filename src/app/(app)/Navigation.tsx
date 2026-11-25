'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
// Une icône par fichier, et non le paquet entier : le menu ne charge que les treize dont il a besoin.
// (Sur le Mac de travail, Google Drive ne livre pas tous les fichiers du paquet : l'import groupé bloquait le serveur local.)
import BadgeCheck from 'lucide-react/icons/badge-check'
import Coins from 'lucide-react/icons/coins'
import FileBarChart from 'lucide-react/icons/file-chart-column'
import FolderKanban from 'lucide-react/icons/folder-kanban'
import VueDEnsemble from 'lucide-react/icons/chart-no-axes-combined'
import Sources from 'lucide-react/icons/quote'
import ListChecks from 'lucide-react/icons/list-checks'
import MessagesSquare from 'lucide-react/icons/messages-square'
import ScanSearch from 'lucide-react/icons/scan-search'
import Search from 'lucide-react/icons/search'
import Settings from 'lucide-react/icons/settings'
import Partages from 'lucide-react/icons/share-2'
import PagesSuivies from 'lucide-react/icons/file-search'
import SquarePlay from 'lucide-react/icons/square-play'
import Swords from 'lucide-react/icons/swords'
import { IcoChevronBas } from '@/components/outil/Icones'
import { ecrireCookie } from '@/lib/cookie-client'
import { useT } from '@/lib/i18n/client'

export type Compteurs = { aFaire: number; enAttente: number; contradictions: number }
type Entree = { href: string; libelle: string; icone: LucideIcon; compteur?: number; aide?: string }
type Groupe = { cle: string; titre: string; entrees: Entree[] }

export const COOKIE_GROUPES = 'gt_groupes'

/** Les écrans de l'outil, rangés par verbes : suivre, comprendre, agir, régler. Sert au menu et à la recherche rapide. */
export function useGroupes(admin: boolean, compteurs: Compteurs): Groupe[] {
  const { t } = useT()
  return [
    {
      cle: 'suivre',
      titre: t('Suivre'),
      entrees: [
        { href: '/vue', libelle: t('Vue d’ensemble'), icone: VueDEnsemble },
        { href: '/questions', libelle: t('Questions'), icone: MessagesSquare, compteur: compteurs.enAttente, aide: t('réponses en attente') },
        { href: '/pages', libelle: t('Pages suivies'), icone: PagesSuivies },
        { href: '/concurrents', libelle: t('Concurrents'), icone: Swords },
        { href: '/rapport', libelle: t('Rapport'), icone: FileBarChart },
        { href: '/partages', libelle: t('Partages'), icone: Partages },
      ],
    },
    {
      cle: 'comprendre',
      titre: t('Comprendre'),
      entrees: [
        { href: '/sources', libelle: t('Sources'), icone: Sources },
        { href: '/videos', libelle: t('Vidéos et chaînes'), icone: SquarePlay },
        { href: '/google', libelle: t('Aperçus IA et Google'), icone: Search },
        { href: '/faits', libelle: t('Faits vérifiés'), icone: BadgeCheck, compteur: compteurs.contradictions, aide: t('réponses qui contredisent un fait') },
      ],
    },
    {
      cle: 'agir',
      titre: t('Agir'),
      entrees: [
        { href: '/actions', libelle: t('Actions'), icone: ListChecks, compteur: compteurs.aFaire, aide: t('actions à faire') },
        { href: '/audit', libelle: t('Audit d’une page'), icone: ScanSearch },
      ],
    },
    {
      cle: 'regler',
      titre: t('Régler'),
      entrees: [
        { href: '/projets', libelle: t('Projets'), icone: FolderKanban },
        { href: '/reglages', libelle: t('Réglages'), icone: Settings },
      ],
    },
    ...(admin ? [{ cle: 'admin', titre: t('Administration'), entrees: [{ href: '/admin/couts', libelle: t('Coûts'), icone: Coins }] }] : []),
  ]
}

/** Vrai si l'adresse affichée appartient à cette entrée du menu. */
export const estIci = (chemin: string, href: string) => chemin === href || chemin.startsWith(`${href}/`) || (href === '/questions' && chemin.startsWith('/reponses'))

/**
 * Menu de l'outil. Chaque groupe se replie (l'état est retenu dans un cookie,
 * pour que la page arrive déjà dans le bon état) ; un groupe replié qui
 * contient l'écran affiché garde cette entrée visible. Menu réduit : les
 * icônes seules, avec le nom au survol.
 */
export function Navigation({ admin, compteurs, reduit, fermesInitial, surNavigation }: { admin: boolean; compteurs: Compteurs; reduit: boolean; fermesInitial: string[]; surNavigation?: () => void }) {
  const chemin = usePathname()
  const { t } = useT()
  const groupes = useGroupes(admin, compteurs)
  const [fermes, setFermes] = useState<string[]>(fermesInitial)

  const basculer = (cle: string) => {
    const suite = fermes.includes(cle) ? fermes.filter((x) => x !== cle) : [...fermes, cle]
    setFermes(suite)
    ecrireCookie(COOKIE_GROUPES, suite.join(','))
  }

  return (
    <nav aria-label={t('Menu de l’outil')} className="menu-nav">
      {groupes.map((g) => {
        const ferme = !reduit && fermes.includes(g.cle)
        const total = g.entrees.reduce((n, e) => n + (e.compteur ?? 0), 0)
        return (
          <div key={g.cle} className="menu-groupe">
            {!reduit && (
              <button type="button" className="menu-titre" aria-expanded={!ferme} aria-controls={`groupe-${g.cle}`} onClick={() => basculer(g.cle)}>
                <span>{g.titre}</span>
                {ferme && total > 0 && <span className="compteur">{total}</span>}
                <IcoChevronBas taille={13} className={`chevron ${ferme ? 'ferme' : ''}`} />
              </button>
            )}
            <ul id={`groupe-${g.cle}`}>
              {g.entrees.map((e) => {
                const ici = estIci(chemin, e.href)
                if (ferme && !ici) return null
                return (
                  <li key={e.href}>
                    <Link href={e.href} className="entree" aria-current={ici ? 'page' : undefined} title={reduit ? e.libelle : undefined} onClick={surNavigation}>
                      <e.icone size={16} strokeWidth={ici ? 2.25 : 1.75} className="shrink-0" aria-hidden="true" />
                      <span className="entree-nom">{e.libelle}</span>
                      {!!e.compteur && (
                        <span className="compteur" title={`${e.compteur} ${e.aide}`}>
                          {e.compteur}
                          <span className="invisible-lecteur"> {e.aide}</span>
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
