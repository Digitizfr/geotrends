'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IcoRecherche } from '@/components/outil/Icones'
import { useT } from '@/lib/i18n/client'
import { useGroupes, type Compteurs } from './Navigation'

export type EntreeRecherche = { genre: 'question' | 'marque' | 'site' | 'page'; libelle: string; href: string; note?: string }

const sansAccent = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
export const OUVRIR_RECHERCHE = 'gt:recherche'

/**
 * Recherche rapide (Cmd K ou Ctrl K) : aller à un écran, à une question, à une
 * marque ou à un site sans passer par le menu. Flèches pour choisir, Entrée
 * pour y aller, Échap pour fermer.
 */
export function Palette({ admin, compteurs, entrees }: { admin: boolean; compteurs: Compteurs; entrees: EntreeRecherche[] }) {
  const { t } = useT()
  const router = useRouter()
  const groupes = useGroupes(admin, compteurs)
  const dialogue = useRef<HTMLDialogElement>(null)
  const champ = useRef<HTMLInputElement>(null)
  const liste = useRef<HTMLDivElement>(null)
  const [texte, setTexte] = useState('')
  const [choisi, setChoisi] = useState(0)

  useEffect(() => {
    const ouvrir = () => {
      if (dialogue.current?.open) return
      setTexte('')
      setChoisi(0)
      dialogue.current?.showModal()
      champ.current?.focus()
    }
    const touche = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (dialogue.current?.open) dialogue.current.close()
        else ouvrir()
      }
    }
    window.addEventListener('keydown', touche)
    window.addEventListener(OUVRIR_RECHERCHE, ouvrir)
    return () => {
      window.removeEventListener('keydown', touche)
      window.removeEventListener(OUVRIR_RECHERCHE, ouvrir)
    }
  }, [])

  const sections = useMemo(() => {
    const q = sansAccent(texte.trim())
    type Trouvable = { libelle: string; href: string; note?: string }
    const garde = (xs: Trouvable[], max: number): Trouvable[] => (q ? xs.filter((x) => sansAccent(`${x.libelle} ${x.note ?? ''}`).includes(q)) : xs).slice(0, max)
    const ecrans = groupes.flatMap((g) => g.entrees.map((e) => ({ libelle: e.libelle, href: e.href, note: g.titre })))
    return [
      { titre: t('Écrans'), lignes: garde(ecrans, q ? 8 : 14) },
      { titre: t('Questions'), lignes: garde(entrees.filter((e) => e.genre === 'question'), q ? 8 : 4) },
      { titre: t('Marques'), lignes: garde(entrees.filter((e) => e.genre === 'marque'), q ? 8 : 4) },
      { titre: t('Sites'), lignes: garde(entrees.filter((e) => e.genre === 'site'), q ? 8 : 4) },
      { titre: t('Pages'), lignes: garde(entrees.filter((e) => e.genre === 'page'), q ? 8 : 4) },
    ].filter((s) => s.lignes.length > 0)
  }, [texte, entrees, groupes, t])
  const aPlat = sections.flatMap((s) => s.lignes)
  const actif = Math.min(choisi, Math.max(aPlat.length - 1, 0))

  const aller = (href: string) => {
    dialogue.current?.close()
    router.push(href)
  }
  const deplacer = (pas: number) => {
    const suite = aPlat.length ? (actif + pas + aPlat.length) % aPlat.length : 0
    setChoisi(suite)
    liste.current?.querySelector(`[data-rang="${suite}"]`)?.scrollIntoView({ block: 'nearest' })
  }

  // Rang de la première ligne de chaque section dans la liste à plat.
  const debuts = sections.map((_, i) => sections.slice(0, i).reduce((n, x) => n + x.lignes.length, 0))
  return (
    <dialog
      ref={dialogue}
      className="palette"
      aria-label={t('Recherche rapide')}
      onClick={(e) => {
        if (e.target === dialogue.current) dialogue.current?.close()
      }}
    >
      <div className="palette-boite">
        <label className="champ-recherche grand border-b border-[var(--encre)]">
          <IcoRecherche taille={17} />
          <span className="invisible-lecteur">{t('Recherche rapide')}</span>
          <input
            ref={champ}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-liste"
            aria-activedescendant={aPlat.length ? `palette-${actif}` : undefined}
            autoComplete="off"
            spellCheck={false}
            value={texte}
            placeholder={t('Aller à un écran, une question, une marque, un site, une page…')}
            onChange={(e) => {
              setTexte(e.target.value)
              setChoisi(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); deplacer(1) }
              else if (e.key === 'ArrowUp') { e.preventDefault(); deplacer(-1) }
              else if (e.key === 'Enter' && aPlat[actif]) { e.preventDefault(); aller(aPlat[actif].href) }
            }}
          />
          <kbd className="touche">{t('Échap')}</kbd>
        </label>
        <div ref={liste} id="palette-liste" role="listbox" aria-label={t('Résultats')} className="palette-liste">
          {sections.length === 0 && <p className="second px-4 py-6">{t('Rien ne correspond à « {texte} ».', { texte })}</p>}
          {sections.map((s, i) => (
            <div key={s.titre} role="group" aria-label={s.titre}>
              <p className="etiquette px-4 pb-1 pt-3">{s.titre}</p>
              {s.lignes.map((l, j) => {
                const ici = debuts[i] + j
                return (
                  <button key={`${s.titre}:${l.href}:${l.libelle}`} type="button" role="option" id={`palette-${ici}`} data-rang={ici} aria-selected={ici === actif} className="palette-ligne" onMouseMove={() => setChoisi(ici)} onClick={() => aller(l.href)}>
                    <span className="min-w-0 flex-1 truncate">{l.libelle}</span>
                    {l.note && <span className="second shrink-0">{l.note}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <p className="palette-pied">
          <span><kbd className="touche">↑</kbd><kbd className="touche">↓</kbd> {t('choisir')}</span>
          <span><kbd className="touche">↵</kbd> {t('ouvrir')}</span>
          <span><kbd className="touche">{t('Échap')}</kbd> {t('fermer')}</span>
        </p>
      </div>
    </dialog>
  )
}
