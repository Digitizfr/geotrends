import 'server-only'
import { cache } from 'react'
import { cookies, headers } from 'next/headers'
import { lireSession } from '../session'
import { fixerLangue } from './courante'
import { formats } from './formats'
import { COOKIE_LANGUE, estLangue, LANGUE_DEFAUT, langueDuNavigateur, type Langue } from './langues'
import { creerTraducteur } from './traduire'

/**
 * Langue de l'interface pour la requête en cours.
 * Compte connecté : son choix (colonne `langue`), sinon le cookie de ce
 * navigateur, sinon le français. Personne de connecté : la langue du navigateur.
 */
export const lireLangue = cache(async (): Promise<Langue> => {
  const [h, c] = await Promise.all([headers(), cookies()])
  let langue: Langue = LANGUE_DEFAUT
  // En développement seulement : forcer la langue d'une requête pour vérifier un écran (en-tête ou cookie d'essai).
  if (process.env.NODE_ENV === 'development') {
    const essai = h.get('x-gt-langue') ?? c.get('gt_langue_essai')?.value
    if (estLangue(essai)) {
      fixerLangue(essai)
      return essai
    }
  }
  const session = await lireSession().catch(() => null)
  if (session) {
    const duCompte = (session.user as { langue?: string | null }).langue
    const duCookie = c.get(COOKIE_LANGUE)?.value
    langue = estLangue(duCompte) ? duCompte : estLangue(duCookie) ? duCookie : LANGUE_DEFAUT
  } else {
    langue = langueDuNavigateur(h.get('accept-language'))
  }
  fixerLangue(langue)
  return langue
})

/**
 * À appeler en tête de chaque écran, de chaque composant serveur asynchrone et
 * de chaque action qui écrit un texte : `const t = await traducteur()`.
 * Remplit aussi la langue de la requête pour les fonctions de src/lib/libelles.ts.
 */
export async function traducteur() {
  const langue = await lireLangue()
  fixerLangue(langue)
  return creerTraducteur(langue)
}

/** Les écritures (dates, montants, pluriels) dans la langue de la requête. */
export async function ecritures() {
  return formats(await lireLangue())
}
