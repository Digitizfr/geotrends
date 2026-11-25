/** Pastille carrée à l'initiale d'une marque, d'un site ou d'un compte : aucun logo n'est chargé depuis un autre site. */
export function Initiale({ nom, nous = false, taille = 'm' }: { nom: string; nous?: boolean; taille?: 'p' | 'm' | 'g' }) {
  const lettre = (nom.replace(/^(https?:\/\/)?(www\.)?/, '').match(/[\p{L}\p{N}]/u)?.[0] ?? '·').toUpperCase()
  return <span className={`initiale ${taille} ${nous ? 'nous' : ''}`} aria-hidden="true">{lettre}</span>
}
