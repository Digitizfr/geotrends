import type { Lang } from '../../i18n'

/** Les mots de l'habillage de la documentation : sommaire, table des matières, liens de fin de page. */
export const LIBELLES = {
  fr: {
    documentation: 'Documentation',
    cas: 'Cas d’usage',
    sommaire: 'Sommaire',
    ouvrirSommaire: 'Sommaire de la documentation',
    ouvrirSommaireCas: 'Tous les cas d’usage',
    surCettePage: 'Sur cette page',
    fil: 'Fil d’Ariane',
    majLe: (date: string) => `Page mise à jour le ${date}`,
    precedente: 'Précédent',
    suivante: 'Suivant',
    voisines: 'Pages précédente et suivante',
    aLire: 'À lire aussi',
    dansOutil: 'Dans l’outil',
    toutesRubriques: 'Toute la documentation',
    toutesRubriquesId: 'toute-la-documentation',
    voirCas: 'Les cas d’usage',
    voirDoc: 'La documentation',
    casIntro: {
      titre: 'Cas d’usage',
      chapo: 'Les questions que l’on se pose sur sa visibilité dans les IA, et la marche à suivre dans GeoTrends pour y répondre, preuve à l’appui. Chaque cas renvoie aux pages de la documentation qui détaillent les écrans.',
    },
    nbCas: (n: number) => `${n} cas`,
    encadre: { savoir: 'À savoir', limite: 'Limite', conseil: 'Conseil' },
    agrandir: 'Agrandir la capture',
    fermer: 'Fermer',
    ecran: 'Écran',
    captureExemple: 'Données d’exemple',
    etape: 'Étape',
  },
  en: {
    documentation: 'Docs',
    cas: 'Use cases',
    sommaire: 'Contents',
    ouvrirSommaire: 'Documentation contents',
    ouvrirSommaireCas: 'All use cases',
    surCettePage: 'On this page',
    fil: 'Breadcrumb',
    majLe: (date: string) => `Page updated on ${date}`,
    precedente: 'Previous',
    suivante: 'Next',
    voisines: 'Previous and next pages',
    aLire: 'Read next',
    dansOutil: 'In the tool',
    toutesRubriques: 'All the documentation',
    toutesRubriquesId: 'all-the-documentation',
    voirCas: 'Use cases',
    voirDoc: 'Documentation',
    casIntro: {
      titre: 'Use cases',
      chapo: 'The questions people ask about their visibility in AI answers, and the steps to answer each one in GeoTrends, with the evidence. Each case links to the documentation pages that detail the screens.',
    },
    nbCas: (n: number) => `${n} ${n > 1 ? 'cases' : 'case'}`,
    encadre: { savoir: 'Good to know', limite: 'Limit', conseil: 'Tip' },
    agrandir: 'Enlarge the screenshot',
    fermer: 'Close',
    ecran: 'Screen',
    captureExemple: 'Sample data',
    etape: 'Step',
  },
} as const

export const libelles = (lang: Lang) => LIBELLES[lang]

/** Date d'une page, écrite en toutes lettres : « 18 novembre 2026 », « 18 November 2026 ». */
export const dateEcrite = (iso: string, lang: Lang) => {
  const d = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d)
}

/**
 * Où se trouve chaque écran dans le menu de l'outil, tel qu'il s'affiche dans
 * chaque langue. Sert à la ligne « Dans l'outil » en tête de page.
 */
export const MENU_OUTIL: Record<string, Record<Lang, string[]>> = {
  '/vue': { fr: ['Suivre', 'Vue d’ensemble'], en: ['Track', 'Overview'] },
  '/questions': { fr: ['Suivre', 'Questions'], en: ['Track', 'Prompts'] },
  '/questions/[id]': { fr: ['Suivre', 'Questions', 'une question'], en: ['Track', 'Prompts', 'a prompt'] },
  '/reponses': { fr: ['Suivre', 'Questions', 'Réponses'], en: ['Track', 'Prompts', 'Answers'] },
  '/concurrents': { fr: ['Suivre', 'Concurrents'], en: ['Track', 'Competitors'] },
  '/rapport': { fr: ['Suivre', 'Rapport'], en: ['Track', 'Report'] },
  '/sources': { fr: ['Comprendre', 'Sources'], en: ['Understand', 'Sources'] },
  '/videos': { fr: ['Comprendre', 'Vidéos et chaînes'], en: ['Understand', 'Videos & channels'] },
  '/google': { fr: ['Comprendre', 'Aperçus IA et Google'], en: ['Understand', 'AI Overviews & Google'] },
  '/faits': { fr: ['Comprendre', 'Faits vérifiés'], en: ['Understand', 'Fact checks'] },
  '/actions': { fr: ['Agir', 'Actions'], en: ['Act', 'Actions'] },
  '/audit': { fr: ['Agir', 'Audit d’une page'], en: ['Act', 'Page audit'] },
  '/projets': { fr: ['Régler', 'Projets'], en: ['Set up', 'Projects'] },
  '/projets/nouveau': { fr: ['Régler', 'Projets', 'Nouveau projet'], en: ['Set up', 'Projects', 'New project'] },
  '/projets/[id]': { fr: ['Régler', 'Projets', 'un projet'], en: ['Set up', 'Projects', 'a project'] },
  '/reglages': { fr: ['Régler', 'Réglages'], en: ['Set up', 'Settings'] },
  '/admin/couts': { fr: ['Administration', 'Coûts'], en: ['Admin', 'Costs'] },
  '/connexion': { fr: ['Connexion'], en: ['Sign in'] },
}

/** Écran montré par chaque capture, quand le manifeste ne le dit pas. */
export const ECRAN_DE_CAPTURE: Record<string, string> = {
  vue: '/vue',
  questions: '/questions',
  question: '/questions/[id]',
  reponses: '/reponses',
  concurrents: '/concurrents',
  sources: '/sources',
  videos: '/videos',
  google: '/google',
  actions: '/actions',
  'actions-resultats': '/actions?onglet=resultats',
  faits: '/faits',
  rapport: '/rapport',
  audit: '/audit',
  projets: '/projets',
  'projet-nouveau': '/projets/nouveau',
  projet: '/projets/[id]?onglet=marque',
  'projet-questions': '/projets/[id]?onglet=questions',
  'projet-releves': '/projets/[id]?onglet=releves',
  reglages: '/reglages',
  couts: '/admin/couts',
  connexion: '/connexion',
  // Détails d'écran, cadrés sur un bloc.
  'vue-courbe': '/vue',
  'vue-alertes': '/vue',
  'question-presence': '/questions/[id]',
  'question-colonnes': '/questions/[id]',
  'action-fiche': '/actions',
  'faits-contradictions': '/faits',
  'reglages-rythme': '/reglages',
  'projet-prix': '/projets/[id]?onglet=releves',
  'projet-nouveau-recap': '/projets/nouveau',
}
