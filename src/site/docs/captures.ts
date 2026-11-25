import type { Lang } from '../i18n'
import manifesteBrut from '../../../public/docs/captures/manifeste.json'

/*
 * Captures réelles de l'outil, en données d'exemple (la marque fictive Facturo).
 * Les fichiers et leurs dimensions viennent de public/docs/captures/manifeste.json,
 * écrit par le script qui prend les captures. Lu par le composant <Capture> et
 * par scripts/verifier-docs.ts.
 */

export type CaptureConnue = { fichier: string; largeur: number; hauteur: number; ecran?: string }
type Manifeste = { genere: string | null; captures: Partial<Record<Lang, Record<string, CaptureConnue>>> }

export const manifeste = manifesteBrut as unknown as Manifeste

/** Adresse publique du fichier d'une capture (le manifeste peut donner un nom seul ou une adresse). */
export const adresseCapture = (fichier: string) => (fichier.startsWith('/') ? fichier : fichier.startsWith('docs/') ? `/${fichier}` : `/docs/captures/${fichier}`)

/** La capture d'un écran dans une langue, si elle existe et a des dimensions. */
export function captureDe(nom: string, lang: Lang): CaptureConnue | undefined {
  const c = manifeste.captures?.[lang]?.[nom]
  return c && c.fichier && c.largeur > 0 && c.hauteur > 0 ? c : undefined
}
