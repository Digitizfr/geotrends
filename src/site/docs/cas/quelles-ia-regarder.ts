// Cas d'usage : par quelle IA commencer, et pourquoi Claude est compté à part.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/quelles-ia-regarder',
  rubrique: 'demarrer-le-suivi',
  slug: { fr: 'quelles-ia-regarder', en: 'which-ai-engines-first' },
  titre: {
    fr: 'Quelles IA regarder en premier, et pourquoi Claude est-il à part ?',
    en: 'Which AI engines should I look at first, and why is Claude kept apart?',
  },
  resume: {
    fr: 'Quatre IA relevées par l’interface, une par son API : comment les comparer, par laquelle commencer, et pourquoi le chiffre de Claude ne s’additionne jamais.',
    en: 'Four AI engines read through the interface, one through its API: how to compare them, where to start, and why Claude’s number is never added to the others.',
  },
  ecrans: ['/vue', '/google', '/projets/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'GeoTrends relève cinq IA. Quatre par leur interface, comme un internaute les voit : ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google. La cinquième, Claude, par son API : c’est la réponse du modèle seul. Avec quelques heures par semaine pour Facturo, il faut choisir où regarder d’abord.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Au moins un relevé des quatre IA d’interface sur les questions du projet.',
          'Pour le repère de Claude : des relevés de Claude, cochés au moment de lancer un relevé ou activés toutes les deux semaines.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Comparer les IA d’interface',
            texte: 'Ouvrez **Vue d’ensemble**. Les tuiles du haut portent sur les quatre IA d’interface réunies. Plus bas, le tableau **Présence, IA par IA** donne une ligne par IA, sans jamais les additionner : **Relevés**, **Visibilité**, **Écart**, **Site cité**, **Vidéo citée**, **Nom seul**, **Lu, non cité**. Les étiquettes « la plus forte » et « la plus faible » n’apparaissent que si au moins deux IA ont assez de réponses pour être comparées. Sous chaque nom, le modèle qui a répondu.',
            capture: 'vue',
          },
          {
            titre: 'Regarder Google à part',
            texte: 'Ouvrez **Aperçus IA et Google**. La tuile **Aperçus IA affichés** dit sur combien de questions Google affiche un Aperçu IA. Une question sans Aperçu sort du calcul : ce n’est pas une absence de Facturo, et ce n’est pas une question à travailler pour Google. Le bloc **Que faire, question par question** croise les dix premiers résultats de Google et les sources de l’Aperçu.',
            capture: 'google',
          },
          {
            titre: 'Lire une IA seule',
            texte: 'Dans la barre du haut, le filtre **IA** masque ou affiche chaque IA. Une IA masquée sort des chiffres de tous les écrans, sans que rien ne soit effacé : pratique pour lire ChatGPT seul, puis Gemini seul.',
          },
          {
            titre: 'Lire Claude à part',
            texte: 'Sur **Vue d’ensemble**, la tuile **Claude (API)** et le bloc **Claude, mesuré par son API** ont leur propre chiffre et leur propre courbe, en pointillé. Dans les tableaux, la colonne de Claude est séparée des autres par un double filet. Son chiffre dit si le modèle connaît Facturo et la recommande ; il ne dit pas ce qu’affiche l’application Claude.',
          },
          {
            titre: 'Choisir le rythme et le prix',
            texte: 'Ouvrez la fiche du projet, onglet **Relevés**. Le prix par question de chaque IA s’affiche avant tout envoi : 0,0012 $ par l’interface, environ 0,06 $ pour Claude. Le bloc **Relevés automatiques** propose chaque semaine pour les quatre IA d’interface, toutes les deux semaines pour Claude.',
            capture: 'projet-releves',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Par quelle IA commencer le travail : en général celle d’interface où Facturo est la plus faible, en gardant ChatGPT près des yeux parce qu’il dit aussi les pages lues sans être citées et les recherches lancées. Pour Google, ne travailler que les questions où un Aperçu IA s’affiche. Et s’il faut payer Claude : utile comme repère sur le modèle, pas comme mesure de ce que voient vos clients.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Perplexity et Copilot ne sont pas suivis. Claude est interrogé par son API, recherche web activée : un écart entre Claude et ChatGPT peut venir de la méthode autant que du modèle. Gemini et Google ne donnent ni les pages lues sans être citées, ni les recherches lancées. Tous les relevés partent d’une session neutre, sans historique : une personne connectée peut recevoir une autre réponse.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'reference/ia-suivies' },
          { page: 'reference/methode' },
          { page: 'mesurer/vue-d-ensemble' },
          { page: 'projet/releves-automatiques' },
          { page: 'cas/chatgpt-cite-t-il-ma-marque' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'GeoTrends captures five AI engines. Four through their interface, as a person sees them: ChatGPT, Gemini, Google AI Mode and Google AI Overviews. The fifth, Claude, through its API: the answer of the bare model. With a few hours a week for Facturo, you have to choose where to look first.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'At least one run of the four interface AIs on the project’s prompts.',
          'For the Claude reference point: Claude readings, ticked when you start a run or scheduled every two weeks.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Compare the interface AIs',
            texte: 'Open **Overview**. The tiles at the top cover the four interface AIs together. Further down, the **Presence, AI by AI** table gives one row per AI, never adding them up: **Runs**, **Visibility**, **Change**, **Site cited**, **Video cited**, **Name only**, **Read, not cited**. The “strongest” and “weakest” labels only show when at least two AIs have enough answers to be compared. Under each name, the model that answered.',
            capture: 'vue',
          },
          {
            titre: 'Look at Google separately',
            texte: 'Open **AI Overviews & Google**. The **AI Overviews shown** tile tells you on how many prompts Google displays an AI Overview. A prompt with no Overview is left out of the calculation: it is not an absence of Facturo, and not a prompt to work on for Google. The **What to do, prompt by prompt** block crosses Google’s top ten results with the Overview’s sources.',
            capture: 'google',
          },
          {
            titre: 'Read one AI on its own',
            texte: 'In the top bar, the **AI** filter hides or shows each AI. A hidden AI leaves the numbers of every screen, and nothing is deleted: handy to read ChatGPT alone, then Gemini alone.',
          },
          {
            titre: 'Read Claude separately',
            texte: 'On **Overview**, the **Claude (API)** tile and the **Claude, measured through its API** block have their own number and their own dotted line. In tables, Claude’s column is set apart by a double rule. Its number tells you whether the model knows Facturo and recommends it; it does not tell you what the Claude app displays.',
          },
          {
            titre: 'Choose the pace and the price',
            texte: 'Open the project page, tab **Runs**. The price per prompt of each AI is shown before anything is sent: $0.0012 through the interface, about $0.06 for Claude. The **Automatic runs** block offers every week for the four interface AIs, every two weeks for Claude.',
            capture: 'projet-releves',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Which AI to start working on: usually the interface AI where Facturo is weakest, while keeping an eye on ChatGPT because it also reports the pages it read without citing and the searches it ran. For Google, only work on the prompts where an AI Overview shows. And whether to pay for Claude: useful as a reference point on the model, not as a measure of what your customers see.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'Perplexity and Copilot are not tracked. Claude is queried through its API with web search turned on: a gap between Claude and ChatGPT may come from the method as much as from the model. Gemini and Google report neither the pages read without being cited nor the searches they ran. Every reading starts from a neutral session with no history: a signed-in person may get a different answer.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'reference/ia-suivies' },
          { page: 'reference/methode' },
          { page: 'mesurer/vue-d-ensemble' },
          { page: 'projet/releves-automatiques' },
          { page: 'cas/chatgpt-cite-t-il-ma-marque' },
        ],
      },
    ],
  },
}

export default page
