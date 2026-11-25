'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useT } from '@/lib/i18n/client'
import { Aide } from './Aide'
import { IcoRecherche, IcoTriBas, IcoTriHaut } from './Icones'
import { PanneauLateral } from './Panneau'

export type Colonne = {
  /** Tête de colonne. */
  libelle: React.ReactNode
  /** Le même libellé en texte simple : il sert d'étiquette sur les fiches du téléphone quand `libelle` n'est pas une chaîne. */
  texte?: string
  /** Colonne de chiffres : alignée à droite, en chasse fixe. */
  num?: boolean
  /** Bulle d'aide à côté du libellé. */
  aide?: React.ReactNode
  /** Colonne mesurée par l'API : séparée par un filet double. */
  api?: boolean
  /** Faux : pas de tri sur cette colonne. */
  triable?: boolean
  classe?: string
}

export type Ligne = {
  cle: string
  /** Une cellule par colonne, déjà mise en forme par l'écran. */
  cellules: React.ReactNode[]
  /** Valeur de tri de chaque colonne (nombre ou texte) ; null : toujours en bas. */
  tri?: (string | number | null | undefined)[]
  /** Texte dans lequel la recherche du tableau cherche. */
  recherche?: string
  /** Notre ligne : teintée, avec un trait d'encre. */
  nous?: boolean
  classe?: string
  /** Détail ouvert dans le panneau latéral par un clic sur la ligne. */
  panneau?: { titre: React.ReactNode; sousTitre?: React.ReactNode; contenu: React.ReactNode }
  /** À défaut de panneau : l'adresse ouverte par un clic sur la ligne. */
  href?: string
  /** L'adresse ouvre un panneau sur le même écran : on ne remonte pas en haut de page. */
  surPlace?: boolean
}

const sansAccent = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * Le tableau de l'outil : en-têtes triables, recherche, ligne survolée,
 * en-tête qui reste visible, 25 lignes puis « voir la suite », panneau latéral
 * au clic sur une ligne. Sur téléphone, au-delà de quatre colonnes, chaque
 * ligne devient une fiche. L'écran prépare les cellules ; le tableau ne fait
 * que les ranger.
 */
export function TableauTriable({ colonnes, lignes, libelle, triInitial, recherche, parPage = 25, vide, outils, pied, dense = false, fiches, compte = true }: {
  colonnes: Colonne[]
  lignes: Ligne[]
  /** Nom du tableau pour les lecteurs d'écran. */
  libelle: string
  triInitial?: { colonne: number; sens: 'asc' | 'desc' }
  /** Texte d'invite de la recherche ; sans lui, pas de champ. */
  recherche?: string
  parPage?: number
  vide?: React.ReactNode
  /** Réglages propres à l'écran, à droite de la recherche. */
  outils?: React.ReactNode
  pied?: React.ReactNode
  dense?: boolean
  /** Fiches sur téléphone : par défaut dès cinq colonnes. */
  fiches?: boolean
  /** Affiche le nombre de lignes à côté de la recherche. */
  compte?: boolean
}) {
  const { t, f } = useT()
  const router = useRouter()
  const [tri, setTri] = useState(triInitial ?? null)
  const [texte, setTexte] = useState('')
  const [montrees, setMontrees] = useState(parPage)
  const [ouverte, setOuverte] = useState<string | null>(null)
  const triables = colonnes.map((c, i) => c.triable !== false && lignes.some((l) => l.tri?.[i] !== undefined && l.tri?.[i] !== null))
  const enFiches = fiches ?? colonnes.length > 4

  const rangees = useMemo(() => {
    const q = sansAccent(texte.trim())
    const gardees = q ? lignes.filter((l) => sansAccent(l.recherche ?? '').includes(q)) : lignes
    if (!tri) return gardees
    const sens = tri.sens === 'asc' ? 1 : -1
    return [...gardees].sort((a, b) => {
      const x = a.tri?.[tri.colonne]
      const y = b.tri?.[tri.colonne]
      const xVide = x === null || x === undefined
      const yVide = y === null || y === undefined
      if (xVide || yVide) return xVide === yVide ? 0 : xVide ? 1 : -1
      return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), f.locale, { numeric: true, sensitivity: 'base' })) * sens
    })
  }, [lignes, texte, tri, f.locale])

  const trier = (i: number) => {
    setTri((actuel) => (actuel?.colonne === i ? { colonne: i, sens: actuel.sens === 'asc' ? 'desc' : 'asc' } : { colonne: i, sens: colonnes[i].num ? 'desc' : 'asc' }))
    setMontrees(parPage)
  }
  const visibles = rangees.slice(0, montrees)
  const choisie = ouverte ? lignes.find((l) => l.cle === ouverte) : undefined
  const activer = (l: Ligne) => (l.panneau ? setOuverte(l.cle) : l.href ? router.push(l.href, { scroll: !l.surPlace }) : undefined)

  return (
    <div>
      {(recherche || outils) && (
        <div className="tableau-outils">
          {recherche ? (
            <label className="champ-recherche cadre-fin">
              <IcoRecherche taille={14} />
              <span className="invisible-lecteur">{recherche}</span>
              <input
                type="search"
                value={texte}
                placeholder={recherche}
                onChange={(e) => {
                  setTexte(e.target.value)
                  setMontrees(parPage)
                }}
              />
              {compte && <span className="chiffre shrink-0 text-[0.75rem] text-[var(--encre-pale)]">{texte.trim() ? `${f.nombre(rangees.length)} / ${f.nombre(lignes.length)}` : f.nombre(lignes.length)}</span>}
            </label>
          ) : <span />}
          {outils && <div className="flex flex-wrap items-center gap-x-4 gap-y-2">{outils}</div>}
        </div>
      )}
      <div className="defile collant">
        <table className={`tableau ${dense ? 'dense' : ''} ${enFiches ? 'fiches' : ''}`} aria-label={libelle}>
          <thead>
            <tr>
              {colonnes.map((c, i) => (
                <th key={i} scope="col" className={`${c.num ? 'num' : ''} ${c.api ? 'api' : ''} ${i === 0 ? 'fixe' : ''} ${c.classe ?? ''}`} aria-sort={tri?.colonne === i ? (tri.sens === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {triables[i] ? (
                    <button type="button" className="tri" onClick={() => trier(i)} title={t('Trier sur cette colonne')}>
                      <span>{c.libelle}</span>
                      {tri?.colonne === i && tri.sens === 'asc' ? <IcoTriHaut taille={11} /> : <IcoTriBas taille={11} />}
                    </button>
                  ) : c.libelle}
                  {c.aide && <> <Aide>{c.aide}</Aide></>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((l) => {
              const cliquable = !!l.panneau || !!l.href
              return (
                <tr
                  key={l.cle}
                  className={`${l.nous ? 'nous' : ''} ${cliquable ? 'cliquable' : ''} ${l.classe ?? ''}`}
                  aria-selected={ouverte === l.cle ? true : undefined}
                  tabIndex={cliquable ? 0 : undefined}
                  onClick={cliquable ? (e) => {
                    // Un lien, un bouton ou un champ dans la ligne garde son propre clic.
                    if ((e.target as HTMLElement).closest('a, button, input, select, label, form, summary')) return
                    activer(l)
                  } : undefined}
                  onKeyDown={cliquable ? (e) => {
                    if (e.key === 'Enter' && e.target === e.currentTarget) activer(l)
                  } : undefined}
                >
                  {l.cellules.map((cellule, i) => {
                    const c = colonnes[i]
                    const classe = `${c?.num ? 'num' : ''} ${c?.api ? 'api' : ''} ${i === 0 ? 'fixe' : ''} ${c?.classe ?? ''}`
                    const etiquette = i === 0 ? undefined : (c?.texte ?? (typeof c?.libelle === 'string' ? c.libelle : undefined))
                    return i === 0 ? <th key={i} scope="row" className={classe}>{cellule}</th> : <td key={i} className={classe} data-libelle={etiquette}>{cellule}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {rangees.length === 0 && (
        <p className="second px-4 py-4">{texte.trim() ? t('Aucune ligne ne correspond à « {texte} ».', { texte: texte.trim() }) : (vide ?? t('Rien à montrer pour l’instant.'))}</p>
      )}
      {(rangees.length > montrees || pied) && (
        <div className="tableau-pied">
          {rangees.length > montrees ? (
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <button type="button" className="bouton bouton-creux bouton-petit" onClick={() => setMontrees((n) => n + parPage)}>
                {t('Voir la suite')} <span className="chiffre opacity-70">+{Math.min(parPage, rangees.length - montrees)}</span>
              </button>
              <span className="second">{t('{montrees} sur {total} affichées', { montrees: visibles.length, total: rangees.length })}</span>
              {rangees.length - montrees > parPage && <button type="button" className="lien text-[0.8125rem]" onClick={() => setMontrees(rangees.length)}>{t('Tout afficher')}</button>}
            </span>
          ) : <span />}
          {pied}
        </div>
      )}
      {choisie?.panneau && (
        <PanneauLateral titre={choisie.panneau.titre} sousTitre={choisie.panneau.sousTitre} fermer={() => setOuverte(null)}>
          {choisie.panneau.contenu}
        </PanneauLateral>
      )}
    </div>
  )
}
