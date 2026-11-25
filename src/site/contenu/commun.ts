// Mots communs à toutes les pages du site public.

import { insecables } from '../typo'

const fr = {
  fil: 'Fil d’Ariane',
  /** Deux-points : avec une espace avant en français. */
  dp: ' : ',
  connexion: 'Se connecter',
  enService: 'En service',
  enConstruction: 'En construction',
  interface: 'Interface',
  api: 'API',
  nEnService: (n: number) => (n === 0 ? 'aucune en service' : `${n} en service`),
  nEnConstruction: (n: number) => (n === 0 ? 'aucune en construction' : `${n} en construction`),
  nFonctions: (n: number) => `${n} fonctions`,
  familles: { mesurer: 'Mesurer', comprendre: 'Comprendre', agir: 'Agir', piloter: 'Piloter' },
  ceQueCaFait: 'Ce que ça fait',
  decision: 'La décision que ça permet',
  aSavoir: 'À savoir',
  appel: {
    titre: 'Gratuit, ouvert, [[à installer chez vous.]]',
    texte: 'Le code est sur GitHub, sous licence AGPL-3.0. Il vous faut Docker et une clé DataForSEO : le script d’installation fait le reste, en un quart d’heure.',
    github: 'Installer depuis GitHub',
  },
}

const en: typeof fr = {
  fil: 'Breadcrumb',
  dp: ': ',
  connexion: 'Sign in',
  enService: 'Live',
  enConstruction: 'In progress',
  interface: 'Interface',
  api: 'API',
  nEnService: (n: number) => (n === 0 ? 'none live' : `${n} live`),
  nEnConstruction: (n: number) => (n === 0 ? 'none in progress' : `${n} in progress`),
  nFonctions: (n: number) => `${n} features`,
  familles: { mesurer: 'Measure', comprendre: 'Understand', agir: 'Act', piloter: 'Steer' },
  ceQueCaFait: 'What it does',
  decision: 'The decision it supports',
  aSavoir: 'Good to know',
  appel: {
    titre: 'Free, open, [[yours to install.]]',
    texte: 'The code is on GitHub, under the AGPL-3.0 licence. You need Docker and a DataForSEO key: the install script does the rest, in fifteen minutes.',
    github: 'Install from GitHub',
  },
}

export const commun = { fr: insecables(fr), en }
