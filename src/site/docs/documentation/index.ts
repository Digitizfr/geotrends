// ── Documentation : les rubriques et les pages, dans l'ordre de lecture ─────
// Une page par fichier, rangée dans le dossier de sa rubrique. Pour ajouter une
// page : écrire son fichier (français et anglais côte à côte), l'importer ici,
// la placer dans `pages`, puis lancer `npx tsx scripts/verifier-docs.ts`.
// Chaque écran de l'outil doit être décrit par au moins une page (champ
// `ecrans`) : le script le vérifie.

import type { Lang } from '../../i18n'
import type { Arbre } from '../types'

import queEstCe from './demarrer/quest-ce-que-geotrends'
import installer from './demarrer/installer'
import priseEnMain from './demarrer/prise-en-main'
import notionsCles from './demarrer/notions-cles'
import premiersResultats from './demarrer/premiers-resultats'
import coutsDemarrer from './demarrer/couts'
import questionsFrequentes from './demarrer/questions-frequentes'

import creerUnProjet from './projet/creer-un-projet'
import sitesChainesReseaux from './projet/sites-chaines-reseaux'
import concurrentsProjet from './projet/concurrents'
import questionsProjet from './projet/questions'
import lancerUnReleve from './projet/lancer-un-releve'
import relevesAutomatiques from './projet/releves-automatiques'

import vueDEnsemble from './mesurer/vue-d-ensemble'
import questionsMesurer from './mesurer/questions'
import ficheQuestion from './mesurer/fiche-question'
import pagesSuivies from './mesurer/pages-suivies'
import reponses from './mesurer/reponses'
import mesureApprofondie from './mesurer/mesure-approfondie'

import concurrentsComprendre from './comprendre/concurrents'
import sources from './comprendre/sources'
import videos from './comprendre/videos'
import google from './comprendre/google'
import faitsVerifies from './comprendre/faits-verifies'
import themes from './comprendre/themes'

import listeDeTravail from './agir/liste-de-travail'
import prisesDeContact from './agir/prises-de-contact'
import mesureApresAction from './agir/mesure-apres-action'
import audit from './agir/audit'

import rapportEtAlertes from './piloter/rapport-et-alertes'
import partages from './piloter/partages'
import coutsPiloter from './piloter/couts'
import exportsCsv from './piloter/exports'
import reglages from './piloter/reglages'
import comptes from './piloter/comptes'

import iaSuivies from './reference/ia-suivies'
import methode from './reference/methode'
import paysEtLangues from './reference/pays-et-langues'
import glossaire from './reference/glossaire'
import nouveautes from './reference/nouveautes'

export const documentation: Arbre = {
  rubriques: [
    { id: 'demarrer', titre: { fr: 'Démarrer', en: 'Get started' } },
    { id: 'projet', titre: { fr: 'Préparer un projet', en: 'Set up a project' } },
    { id: 'mesurer', titre: { fr: 'Mesurer', en: 'Measure' } },
    { id: 'comprendre', titre: { fr: 'Comprendre', en: 'Understand' } },
    { id: 'agir', titre: { fr: 'Agir', en: 'Act' } },
    { id: 'piloter', titre: { fr: 'Piloter', en: 'Steer' } },
    { id: 'reference', titre: { fr: 'Référence', en: 'Reference' } },
  ],
  pages: [
    queEstCe, installer, priseEnMain, notionsCles, premiersResultats, coutsDemarrer, questionsFrequentes,
    creerUnProjet, sitesChainesReseaux, concurrentsProjet, questionsProjet, lancerUnReleve, relevesAutomatiques,
    vueDEnsemble, questionsMesurer, ficheQuestion, pagesSuivies, reponses, mesureApprofondie,
    concurrentsComprendre, sources, videos, google, faitsVerifies, themes,
    listeDeTravail, prisesDeContact, mesureApresAction, audit,
    rapportEtAlertes, partages, coutsPiloter, exportsCsv, reglages, comptes,
    iaSuivies, methode, paysEtLangues, glossaire, nouveautes,
  ],
}

/** Une phrase par rubrique, pour les cartes de l'accueil de la documentation. */
export const accroches: Record<string, Record<Lang, string>> = {
  demarrer: {
    fr: 'Ce que mesure l’outil, comment l’installer, les mots à connaître, le premier relevé et ce qu’il coûte.',
    en: 'What the tool measures, how to install it, the words to know, the first run and what it costs.',
  },
  projet: {
    fr: 'Une marque, ce qui lui appartient, ses concurrents, ses questions, et les relevés.',
    en: 'A brand, what it owns, its competitors, its prompts, and the runs.',
  },
  mesurer: {
    fr: 'La visibilité de la marque, IA par IA et question par question, avec chaque réponse.',
    en: 'The brand’s visibility, AI by AI and prompt by prompt, with every answer.',
  },
  comprendre: {
    fr: 'Qui est cité à votre place, grâce à quelles pages, vidéos et résultats de Google.',
    en: 'Who is cited instead of you, and thanks to which pages, videos and Google results.',
  },
  agir: {
    fr: 'La liste de travail tirée des relevés, les prises de contact, puis le résultat.',
    en: 'The work list drawn from the runs, the outreach log, then the result.',
  },
  piloter: {
    fr: 'Le rapport, les coûts, les exports, les réglages et les comptes.',
    en: 'The report, costs, exports, settings and accounts.',
  },
  reference: {
    fr: 'Les IA suivies, la méthode, les pays et langues, le glossaire, les nouveautés.',
    en: 'The AI engines tracked, the method, countries and languages, the glossary, what’s new.',
  },
}
