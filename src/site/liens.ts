// Adresses du projet, écrites une seule fois.

/** Le dépôt public : code source, guide d'installation, documentation. */
export const GITHUB = 'https://github.com/Digitizfr/geotrends'
/** La licence du logiciel. */
export const LICENCE = 'AGPL-3.0'
export const LICENCE_URL = `${GITHUB}/blob/main/LICENSE`

/**
 * Le site de présentation (accueil, fonctionnalités, méthode…) n'est servi à la
 * racine que sur geotrends.io, où SITE_VITRINE vaut « 1 ». Sur une installation
 * chez soi, la racine ouvre directement l'outil, et aucune page n'est proposée
 * aux moteurs de recherche. Lu à chaque requête, jamais à la construction.
 */
export const estVitrine = () => process.env['SITE_VITRINE'] === '1'
