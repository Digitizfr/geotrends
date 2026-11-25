import { AsyncLocalStorage } from 'node:async_hooks'
import { cache } from 'react'
import { LANGUE_DEFAUT, type Langue } from './langues'
import { traduire, type Variables } from './traduire'

/*
 * La langue de la requête en cours, pour les fonctions d'écriture appelées
 * sans langue (dates, montants, pluriels de src/lib/libelles.ts, phrases des
 * bibliothèques). `traducteur()` la fixe en tête de chaque écran, de chaque
 * action et de chaque route.
 *
 * Pendant le rendu d'une page, elle vit dans une boîte propre à la requête
 * (cache de React). Hors d'un rendu (action serveur, route d'export), le cache
 * de React ne retient rien : elle vit alors dans le contexte asynchrone de la
 * requête. Sans rien de fixé (script, tâche planifiée) : le français.
 */
type Boite = { langue: Langue }
const boiteDuRendu: () => Boite = typeof cache === 'function' ? cache(() => ({ langue: LANGUE_DEFAUT })) : () => ({ langue: LANGUE_DEFAUT })
const horsRendu = new AsyncLocalStorage<Boite>()

/** La boîte du rendu en cours, ou null si l'on n'est pas dans un rendu (le cache rend alors un objet neuf à chaque appel). */
function boite(): Boite | null {
  const b = boiteDuRendu()
  return b === boiteDuRendu() ? b : null
}

export const langueActive = (): Langue => boite()?.langue ?? horsRendu.getStore()?.langue ?? LANGUE_DEFAUT

export function fixerLangue(langue: Langue) {
  const b = boite()
  if (b) b.langue = langue
  else {
    const courante = horsRendu.getStore()
    if (courante) courante.langue = langue
    else horsRendu.enterWith({ langue })
  }
}

/**
 * Traduction dans la langue de la requête, pour un composant serveur qui
 * n'est pas asynchrone ou une fonction de bibliothèque qui écrit un texte.
 * L'écran, l'action ou la route qui l'appelle a déjà fait `await traducteur()`.
 */
export const tr = (cle: string, vars?: Variables) => traduire(langueActive(), cle, vars)

/** Un texte cité tel quel (question, phrase d'une réponse, titre de page) : guillemets de la langue affichée. */
export const entreGuillemets = (texte: string) => (langueActive() === 'fr' ? `«\u00a0${texte}\u00a0»` : `“${texte}”`)

/** Deux-points de la langue affichée : avec une espace avant en français. */
export const deuxPoints = () => (langueActive() === 'fr' ? '\u00a0: ' : ': ')
