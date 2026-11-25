import { cookies } from 'next/headers'
import { MOTEURS, type Moteur } from './fournisseurs/types'
import { langueActive } from './i18n/courante'
import { traduire } from './i18n/traduire'

// ── Filtres de la barre du haut ─────────────────────────────────────────────
// La période et les IA affichées valent pour tous les écrans de mesure. Elles
// sont retenues dans deux cookies, comme le projet affiché : on change d'écran
// sans perdre son réglage.

export const PERIODES = [
  { cle: '1', libelle: '7 jours', court: '7 j' },
  { cle: '4', libelle: '4 semaines', court: '4 sem.' },
  { cle: '8', libelle: '8 semaines', court: '8 sem.' },
  { cle: '12', libelle: '3 mois', court: '3 mois' },
  { cle: 'tout', libelle: 'Tout l’historique', court: 'Tout' },
  { cle: 'dernier', libelle: 'Dernier relevé seul', court: 'Dernier' },
] as const

export type Periode = (typeof PERIODES)[number]['cle']
export const PERIODE_DEFAUT: Periode = '8'
export const COOKIE_PERIODE = 'gt_periode'
export const COOKIE_MASQUEES = 'gt_ia_masquees'
export const COOKIE_CONCURRENT = 'gt_concurrent'

export type Filtres = {
  periode: Periode
  /** IA décochées dans la barre du haut. */
  masquees: Moteur[]
  /** Concurrent choisi (son identifiant) : on ne garde que les réponses qui le nomment. */
  concurrent: string | null
  /** Vrai dès qu'un filtre s'écarte du réglage par défaut. */
  actif: boolean
}

export const estPeriode = (v: unknown): v is Periode => PERIODES.some((p) => p.cle === v)
export const estMoteur = (v: unknown): v is Moteur => (MOTEURS as readonly unknown[]).includes(v)

export async function lireFiltres(): Promise<Filtres> {
  const c = await cookies()
  const p = c.get(COOKIE_PERIODE)?.value
  const periode = estPeriode(p) ? p : PERIODE_DEFAUT
  const masquees = (c.get(COOKIE_MASQUEES)?.value ?? '').split(',').filter(estMoteur)
  const concurrent = c.get(COOKIE_CONCURRENT)?.value || null
  return { periode, masquees, concurrent, actif: periode !== PERIODE_DEFAUT || masquees.length > 0 || !!concurrent }
}

/** Libellé de la période, dans la langue de l'interface. */
export const libellePeriode = (p: Periode) => traduire(langueActive(), PERIODES.find((x) => x.cle === p)!.libelle)
