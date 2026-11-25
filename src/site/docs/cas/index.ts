// ── Cas d'usage : l'arbre ──────────────────────────────────────────────────
// Chaque cas part d'une question qu'on se pose, dit les données à réunir, les
// étapes dans l'outil, la décision qu'il permet et ses limites. Une page par
// fichier, en français et en anglais côte à côte. Les rubriques et les pages
// s'affichent dans l'ordre de ces listes.

import type { Arbre } from '../types'
import suivreLesBonnesQuestions from './suivre-les-bonnes-questions'
import questionsAvecOuSansMarque from './questions-avec-ou-sans-marque'
import quellesIaRegarder from './quelles-ia-regarder'
import chatgptCiteTIlMaMarque from './chatgpt-cite-t-il-ma-marque'
import citeeNommeeOuAbsente from './citee-nommee-ou-absente'
import evolutionOuBruit from './evolution-ou-bruit'
import quiEstCiteAMaPlace from './qui-est-cite-a-ma-place'
import concurrentQuiSInstalle from './concurrent-qui-s-installe'
import themesOuJeSuisAbsent from './themes-ou-je-suis-absent'
import pagesOuApparaitre from './pages-ou-apparaitre'
import pageLuePasCitee from './page-lue-pas-citee'
import informationFausse from './information-fausse'
import videosATourner from './videos-a-tourner'
import effetDUneCorrection from './effet-d-une-correction'
import pointDuLundi from './point-du-lundi'
import robotsDesIa from './robots-des-ia'
import budgetDeSuivi from './budget-de-suivi'

export const cas: Arbre = {
  rubriques: [
    { id: 'demarrer-le-suivi', titre: { fr: 'Démarrer le suivi', en: 'Start tracking' } },
    { id: 'comprendre-sa-visibilite', titre: { fr: 'Comprendre sa visibilité', en: 'Understand your visibility' } },
    { id: 'face-aux-concurrents', titre: { fr: 'Face aux concurrents', en: 'Against competitors' } },
    { id: 'contenus-et-reputation', titre: { fr: 'Améliorer ses contenus et sa réputation', en: 'Improve your content and reputation' } },
    { id: 'mesurer-l-effet', titre: { fr: 'Mesurer l’effet', en: 'Measure the impact' } },
    { id: 'technique-et-budget', titre: { fr: 'Technique et budget', en: 'Technical and budget' } },
  ],
  pages: [
    // Démarrer le suivi
    suivreLesBonnesQuestions,
    questionsAvecOuSansMarque,
    quellesIaRegarder,
    // Comprendre sa visibilité
    chatgptCiteTIlMaMarque,
    citeeNommeeOuAbsente,
    evolutionOuBruit,
    // Face aux concurrents
    quiEstCiteAMaPlace,
    concurrentQuiSInstalle,
    themesOuJeSuisAbsent,
    // Améliorer ses contenus et sa réputation
    pagesOuApparaitre,
    pageLuePasCitee,
    informationFausse,
    videosATourner,
    // Mesurer l'effet
    effetDUneCorrection,
    pointDuLundi,
    // Technique et budget
    robotsDesIa,
    budgetDeSuivi,
  ],
}
