import type { PageDoc } from '../../types'

// Onglet « Résultats » de /actions et bloc « Avant et après » de la fiche
// (src/app/(app)/actions/page.tsx : resultat, enClair), repères d'action sur la
// courbe de la vue d'ensemble (src/lib/graphe.ts).
const page: PageDoc = {
  id: 'agir/mesure-apres-action',
  rubrique: 'agir',
  slug: { fr: 'agir/mesure-apres-action', en: 'act/measure-after-action' },
  titre: { fr: 'Mesurer après une action', en: 'Measuring after an action' },
  resume: {
    fr: 'Une action faite est suivie : la présence de la marque sur ses questions, quatre semaines avant et après, et une phrase qui dit si l’écart dépasse le bruit.',
    en: 'An action marked done is followed up: the brand’s presence on its prompts, four weeks before and after, and a sentence on whether the change exceeds the noise.',
  },
  ecrans: ['/actions'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Corriger une page ou entrer dans un comparatif prend du temps. Encore faut-il savoir si cela a changé quelque chose. Dès qu’une ligne de la liste de travail passe à « fait », l’outil compare la présence de la marque sur les questions de cette action, avant et après, et dit en clair si l’écart dépasse la marge d’erreur.' },
      { type: 'p', texte: 'Le résultat se lit à deux endroits : l’onglet **Résultats** de l’écran Actions, qui réunit toutes les actions faites, et le bloc **Avant et après** de la fiche de chaque action. Sur le grand graphique de la vue d’ensemble, un repère « Action faite » marque aussi la date, et sa ligne, sous le graphique, ouvre ce résultat.' },
      { type: 'capture', nom: 'actions-resultats', legende: 'L’onglet Résultats de l’écran Actions, projet Facturo : chaque action faite, sa date, la présence avant et après, l’écart et ce qu’on peut en dire.' },
      { type: 'h2', id: 'calcul', texte: 'Comment le résultat est calculé' },
      {
        type: 'liste',
        items: [
          '**Les questions** : celles de l’action, gardées au moment où elle est passée à « fait », même si elle sort ensuite de la liste.',
          '**Avant** : les réponses d’interface à ces questions sur les quatre semaines qui précèdent le jour de l’action, ce jour compris. Un relevé du jour même a précédé l’effet de l’action.',
          '**Après** : toutes les réponses d’interface des jours suivants.',
          '**La présence** : les réponses où la marque est nommée ou citée, sur les réponses reçues. Une question sans Aperçu IA ne compte pas comme une absence.',
          '**L’écart** n’est dit « réel » que s’il dépasse la marge d’erreur des deux échantillons, et il faut au moins 5 réponses de chaque côté.',
        ],
      },
      { type: 'p', texte: 'Les relevés d’une mesure approfondie comptent ici : poser la question plusieurs fois après l’action est le moyen le plus rapide d’avoir assez de réponses.' },
      { type: 'h2', id: 'tableau', texte: 'L’onglet Résultats' },
      {
        type: 'tableau',
        colonnes: ['Colonne', 'Ce qu’elle montre'],
        lignes: [
          ['**Action**', 'Le titre, le nombre de questions, et « sortie de la liste » si les relevés ne la proposent plus.'],
          ['**Faite le**', 'La date retenue pour la comparaison, corrigeable dans la fiche.'],
          ['**Avant**', 'Réponses avec la marque, sur les réponses reçues dans les quatre semaines d’avant (« 2 sur 12 », par exemple).'],
          ['**Après**', 'La même chose depuis le lendemain de l’action.'],
          ['**Écart**', 'L’écart en points, coloré seulement s’il dépasse la marge d’erreur.'],
          ['**Ce qu’on peut en dire**', 'La conclusion en une phrase, puis « Provisoire : mesure à quatre semaines le … » ou « Quatre semaines sont passées. »'],
        ],
      },
      {
        type: 'tableau',
        colonnes: ['Situation', 'Ce que dit l’outil'],
        lignes: [
          ['Aucun relevé depuis l’action', 'Rien à comparer pour l’instant.'],
          ['Aucun relevé dans les quatre semaines d’avant', 'Pas de point de comparaison.'],
          ['Moins de 5 réponses d’un côté', 'Trop peu de relevés pour conclure : il en faut au moins 5 de chaque côté.'],
          ['Écart dans la marge d’erreur', 'On ne peut pas dire que quelque chose a changé.'],
          ['Hausse au-delà de la marge', 'La hausse est réelle. L’action n’en est pas forcément la seule cause.'],
          ['Baisse au-delà de la marge', 'La baisse est réelle. L’action n’en est pas forcément la cause.'],
        ],
      },
      { type: 'p', texte: 'Le résultat se lit à tout moment, mais il est marqué provisoire pendant les quatre semaines qui suivent l’action. Dans la fiche, le bloc **Avant et après** donne les mêmes chiffres, avec **Les quatre semaines d’avant**, **Depuis le …**, l’écart et la conclusion.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Suivre l’effet d’une correction' },
      {
        type: 'etapes',
        items: [
          { titre: 'Passer la ligne à « Fait » le bon jour', texte: 'Le jour où la page corrigée est en ligne, ou où le comparatif vous ajoute. Si vous le faites plus tard, corrigez **Faite le** dans la fiche.' },
          { titre: 'Laisser les relevés tourner', texte: 'Les relevés automatiques de chaque semaine remplissent la colonne **Après**. Pour aller plus vite sur une question, lancez une mesure approfondie depuis sa page : le prix est écrit sur le bouton.' },
          { titre: 'Lire le résultat après quatre semaines', texte: 'Ouvrez l’onglet **Résultats**. Une hausse au-delà de la marge est réelle ; un écart dans la marge ne permet pas de conclure.' },
          { titre: 'Recouper avec les repères', texte: 'Sur la courbe de la vue d’ensemble, un repère de changement de modèle à la même date peut expliquer l’écart autant que votre action.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'L’outil dit si l’écart est réel, pas s’il vient de l’action : un nouveau modèle, un concurrent ou une autre action sur les mêmes questions peuvent jouer aussi. Avec quelques questions relevées une fois par semaine, quatre semaines donnent souvent moins de 5 réponses de chaque côté : la mesure approfondie aide alors. Une action sans effet mesurable n’est pas forcément inutile ; l’outil dit seulement qu’on ne peut pas le prouver.' },
      {
        type: 'liens',
        items: [
          { page: 'agir/liste-de-travail' },
          { page: 'mesurer/mesure-approfondie' },
          { page: 'reference/methode' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Fixing a page or getting into a comparison takes time. You still need to know whether it changed anything. As soon as a work-list line is marked “done”, the tool compares the brand’s presence on that action’s prompts, before and after, and says plainly whether the change exceeds the margin of error.' },
      { type: 'p', texte: 'The result can be read in two places: the **Results** tab of the Actions screen, which gathers every action done, and the **Before and after** block of each action’s sheet. On the overview’s main chart, an “Action done” marker also flags the date, and its line, under the chart, opens this result.' },
      { type: 'capture', nom: 'actions-resultats', legende: 'The Results tab of the Actions screen, Facturo UK project: each action done, its date, presence before and after, the change and what can be said.' },
      { type: 'h2', id: 'calculation', texte: 'How the result is calculated' },
      {
        type: 'liste',
        items: [
          '**The prompts**: those of the action, kept when it was marked done, even if it leaves the list afterwards.',
          '**Before**: the interface answers to these prompts over the four weeks leading up to the day of the action, that day included. A reading on the same day came before the action’s effect.',
          '**After**: every interface answer of the following days.',
          '**Presence**: the answers where the brand is mentioned or cited, out of the answers received. A prompt with no AI Overview does not count as an absence.',
          '**The change** is called “real” only if it exceeds the margin of error of both samples, and at least 5 answers are needed on each side.',
        ],
      },
      { type: 'p', texte: 'Deep measurement readings count here: asking the prompt several times after the action is the quickest way to get enough answers.' },
      { type: 'h2', id: 'results-tab', texte: 'The Results tab' },
      {
        type: 'tableau',
        colonnes: ['Column', 'What it shows'],
        lignes: [
          ['**Action**', 'The title, the number of prompts, and “out of the list” if the runs no longer suggest it.'],
          ['**Done on**', 'The date used for the comparison, which can be corrected in the sheet.'],
          ['**Before**', 'Answers with the brand, out of the answers received in the four weeks before (“2 out of 12”, for example).'],
          ['**After**', 'The same since the day after the action.'],
          ['**Change**', 'The change in points, coloured only when it exceeds the margin of error.'],
          ['**What can be said**', 'The conclusion in one sentence, then “Provisional: four-week measurement on …” or “Four weeks have passed.”'],
        ],
      },
      {
        type: 'tableau',
        colonnes: ['Situation', 'What the tool says'],
        lignes: [
          ['No run since the action', 'Nothing to compare yet.'],
          ['No run in the four weeks before', 'No point of comparison.'],
          ['Fewer than 5 answers on one side', 'Too few readings to conclude: at least 5 are needed on each side.'],
          ['Change within the margin of error', 'Nothing can be said to have changed.'],
          ['Rise beyond the margin', 'The rise is real. The action is not necessarily its only cause.'],
          ['Drop beyond the margin', 'The drop is real. The action is not necessarily its cause.'],
        ],
      },
      { type: 'p', texte: 'The result can be read at any time, but it is marked provisional during the four weeks after the action. In the sheet, the **Before and after** block gives the same numbers, with **The four weeks before**, **Since …**, the change and the conclusion.' },
      { type: 'h2', id: 'step-by-step', texte: 'Following the effect of a fix' },
      {
        type: 'etapes',
        items: [
          { titre: 'Mark the line “Done” on the right day', texte: 'The day the fixed page goes live, or the comparison adds you. If you do it later, correct **Done on** in the sheet.' },
          { titre: 'Let the runs go on', texte: 'The weekly automatic runs fill the **After** column. To go faster on one prompt, start a deep measurement from its page: the price is written on the button.' },
          { titre: 'Read the result after four weeks', texte: 'Open the **Results** tab. A rise beyond the margin is real; a change within the margin does not allow a conclusion.' },
          { titre: 'Cross-check with the markers', texte: 'On the overview chart, a model-change marker on the same date can explain the change as much as your action.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'The tool says whether the change is real, not whether it comes from the action: a new model, a competitor or another action on the same prompts can play a part too. With a few prompts run once a week, four weeks often give fewer than 5 answers on each side: deep measurement helps then. An action with no measurable effect is not necessarily useless; the tool only says that it cannot be proven.' },
      {
        type: 'liens',
        items: [
          { page: 'agir/liste-de-travail' },
          { page: 'mesurer/mesure-approfondie' },
          { page: 'reference/methode' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
  },
}

export default page
