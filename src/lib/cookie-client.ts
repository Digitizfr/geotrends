/** Écrit un cookie depuis le navigateur (réglages d'affichage retenus : menu réduit, groupes repliés). Un an par défaut. */
export function ecrireCookie(nom: string, valeur: string, secondes = 31_536_000) {
  document.cookie = `${nom}=${valeur}; path=/; max-age=${secondes}; samesite=lax`
}
