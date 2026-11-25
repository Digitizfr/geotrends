/*
 * Logo de GeoTrends : une courbe qui monte dans un G et finit sur un point jaune.
 * La tendance, jusqu'à la citation. Dessin construit sur une grille.
 *
 * Construction, en traits (un trait = 1) :
 * - un seul trait pour le cercle, la barre du G et la courbe, de la même épaisseur
 *   que les lettres du nom à la taille de l'en-tête ;
 * - cercle de 9 traits de diamètre (axe de rayon 4), point de 2 traits ;
 * - un seul écart, d'un trait : pointe et cercle, courbe et barre, point et bout du G ;
 * - segments à 45°, creux au centre du cercle, dernier segment sur la diagonale
 *   jusqu'au centre du point, posé sur l'axe du cercle ;
 * - bout du G coupé dans l'axe du cercle, dessus de la barre sur l'horizontale du centre.
 *
 * Le nom est composé en Hanken Grotesk extra-grasse (variable --font-corps).
 * Icône d'onglet : src/app/icon.svg, même dessin sur une tuile de papier.
 */

const ENCRE = '#14201b'
const PAPIER = '#f2eee3'
const POINT = '#ffd21f'

/** Le G (avec sa barre) et la courbe, en une seule forme pleine. */
const TRACE =
  'M62.42 3.64A48 48 0 1 0 98 50H72.63V60.67H85.78A37.33 37.33 0 1 1 59.66 13.94Z' +
  'M12.72 65.41L35.3 42.84L50 57.54L83.94 23.6L76.4 16.06L50 42.46L35.3 27.75L5.18 57.87Z'

export function Signe({ taille = 28, inverse = false, tuile = false }: { taille?: number; inverse?: boolean; tuile?: boolean }) {
  const dessin = (
    <>
      <path d={TRACE} fill={inverse ? PAPIER : ENCRE} />
      <circle cx="80.17" cy="19.83" r="10.67" fill={POINT} />
    </>
  )
  return (
    <svg width={taille} height={taille} viewBox="0 0 100 100" aria-hidden="true" className="signe">
      {tuile ? (
        <>
          <rect width="100" height="100" rx="22" fill={PAPIER} />
          <g transform="translate(12 12) scale(.76)">{dessin}</g>
        </>
      ) : (
        dessin
      )}
    </svg>
  )
}

/** Le nom, en Hanken Grotesk extra-grasse. */
export function NomLogo({ taille, className = '' }: { taille: number; className?: string }) {
  return <span className={`nom-logo ${className}`} style={{ fontSize: taille }}>GeoTrends</span>
}

export function LogoSite({ taille = 28, inverse = false, className = '' }: { taille?: number; inverse?: boolean; className?: string }) {
  return (
    <span className={`logo-site inline-flex items-center ${className}`} style={{ gap: Math.round(taille * 0.3) }}>
      <Signe taille={Math.round(taille * 1.12)} inverse={inverse} />
      <NomLogo taille={taille * 0.8} />
    </span>
  )
}
