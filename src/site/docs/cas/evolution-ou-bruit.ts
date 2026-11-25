// Cas d'usage : un chiffre a bougé, l'écart dépasse-t-il la marge d'erreur ?
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/evolution-ou-bruit',
  rubrique: 'comprendre-sa-visibilite',
  slug: { fr: 'evolution-ou-bruit', en: 'real-change-or-noise' },
  titre: {
    fr: 'Un chiffre a bougé : vraie évolution ou bruit ?',
    en: 'A number moved: real change or noise?',
  },
  resume: {
    fr: 'Marge d’erreur, écarts colorés, repères sur la courbe et mesure approfondie : comment savoir si une hausse ou une baisse est réelle avant d’y réagir.',
    en: 'Margin of error, coloured changes, chart markers and deep measurement: how to tell whether a rise or a drop in visibility is real before you react to it.',
  },
  ecrans: ['/vue', '/rapport', '/questions/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Lundi, la visibilité de Facturo a perdu quelques points. La semaine d’avant, elle en avait gagné. Une réponse d’IA est un tirage : posée deux fois, la même question ne reçoit pas la même réponse. Avant de chercher une cause, il faut savoir si l’écart dépasse ce que le hasard suffit à expliquer.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Au moins deux jours de relevé, pour avoir quelque chose à comparer.',
          'Assez de réponses de chaque côté : en dessous de 5, l’outil n’affiche pas de pourcentage et ne qualifie pas l’écart.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Regarder la couleur de l’écart',
            texte: 'Sur **Vue d’ensemble**, chaque tuile compare la période choisie à celle d’avant. L’écart n’est coloré que s’il dépasse la marge d’erreur ; sinon il est marqué « dans la marge » ou « trop peu de relevés ». La bulle d’aide de **Visibilité** donne la marge : « entre … et … ». Changez la période dans la barre du haut pour comparer quatre semaines à quatre semaines, plutôt qu’un relevé à un autre.',
          },
          {
            titre: 'Lire la courbe avec sa bande',
            texte: 'Le graphique **Évolution, relevé après relevé** place un point par jour de relevé, relié par des segments droits, jamais lissés. Autour de la courbe principale, une bande grise trace la marge d’erreur : deux points dont les bandes se recouvrent ne se distinguent pas. L’option **Période précédente** ajoute la même mesure, en pointillé.',
            capture: 'vue',
          },
          {
            titre: 'Lire les repères',
            texte: 'Des repères marquent la courbe : un changement de modèle (« ChatGPT change de modèle : … devient … »), une action passée à « fait », une mesure approfondie. Un écart qui tombe le jour d’un changement de modèle peut venir de là, et pas de vous.',
          },
          {
            titre: 'Ne garder que ce qui dépasse la marge',
            texte: 'Ouvrez **Rapport**. Il compare les deux derniers jours de relevé, sur les seuls couples question et IA qui ont une réponse aux deux dates. Le bloc **Au-dessus de la marge d’erreur** ne liste que les écarts réels ; **Présence gagnée ou perdue, question par question** donne des indices, à confirmer. Les **Alertes** de la vue d’ensemble suivent la même règle.',
            capture: 'rapport',
          },
          {
            titre: 'Trancher sur une question',
            texte: 'Une question seule a trop peu de réponses pour un verdict net. Sur sa page, le bloc **Mesure approfondie** la pose 5, 10 ou 25 fois de suite aux IA d’interface que vous cochez, avec le prix affiché avant l’envoi. Le verdict et la marge se recalculent ; ces relevés comptent pour cette question seulement, pas dans les chiffres d’ensemble.',
            capture: 'question',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Réagir ou attendre. Un écart dans la marge ne demande rien, sinon le relevé suivant. Un écart au-dessus de la marge mérite une enquête : quelle IA, quelles questions, quel repère ce jour-là, quel concurrent est monté en même temps.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Un écart « réel » dit que le chiffre a bougé, pas pourquoi : un nouveau modèle, un concurrent, une page modifiée ailleurs ou votre propre correction peuvent l’expliquer. La marge est calculée à 95 % : sur vingt écarts signalés, un peut encore venir du hasard. Le rapport et les alertes ignorent les filtres de la barre du haut ; les tuiles, elles, les suivent.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'reference/methode' },
          { page: 'mesurer/mesure-approfondie' },
          { page: 'piloter/rapport-et-alertes' },
          { page: 'mesurer/vue-d-ensemble' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'On Monday, Facturo’s visibility lost a few points. The week before, it had gained some. An AI answer is a draw: asked twice, the same prompt does not get the same answer. Before looking for a cause, you need to know whether the change is larger than chance alone can explain.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'At least two run days, so there is something to compare.',
          'Enough answers on each side: below 5, the tool shows no percentage and does not qualify the change.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Look at the colour of the change',
            texte: 'On **Overview**, each tile compares the chosen period with the one before. The change is coloured only when it is beyond the margin of error; otherwise it reads “within margin” or “too few readings”. The **Visibility** help bubble gives the margin: “between … and …”. Change the period in the top bar to compare four weeks with four weeks, rather than one run with another.',
          },
          {
            titre: 'Read the chart with its band',
            texte: 'The **Trend, run after run** chart puts one point per run day, joined by straight segments, never smoothed. Around the main line, a grey band shows the margin of error: two points whose bands overlap cannot be told apart. The **Previous period** option adds the same metric, dotted.',
            capture: 'vue',
          },
          {
            titre: 'Read the markers',
            texte: 'Markers sit on the chart: a model change (“ChatGPT switched model: … became …”), an action marked done, a deep measurement. A change that falls on the day of a model switch may come from there, not from you.',
          },
          {
            titre: 'Keep only what is beyond the margin',
            texte: 'Open **Report**. It compares the last two run days, on the prompt and AI pairs that have an answer on both dates. The **Beyond the margin of error** block lists only real changes; **Presence gained or lost, prompt by prompt** gives clues to be confirmed. The **Alerts** on the overview follow the same rule.',
            capture: 'rapport',
          },
          {
            titre: 'Settle a single prompt',
            texte: 'A single prompt has too few answers for a clear verdict. On its page, the **Deep measurement** block asks it 5, 10 or 25 times in a row to the interface AIs you tick, with the price shown before sending. The verdict and the margin are recomputed; these readings count for this prompt only, not in the overall numbers.',
            capture: 'question',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'React or wait. A change within the margin asks for nothing but the next run. A change beyond the margin deserves an investigation: which AI, which prompts, which marker that day, which competitor rose at the same time.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'A “real” change says the number moved, not why: a new model, a competitor, a page edited elsewhere or your own fix can all explain it. The margin is computed at 95%: out of twenty flagged changes, one may still come from chance. The report and the alerts ignore the top-bar filters; the tiles follow them.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'reference/methode' },
          { page: 'mesurer/mesure-approfondie' },
          { page: 'piloter/rapport-et-alertes' },
          { page: 'mesurer/vue-d-ensemble' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
  },
}

export default page
