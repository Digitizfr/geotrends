// Page « Méthode » : comment la mesure est faite, et où elle s'arrête.
// Les ordres de grandeur viennent de docs/FONCTIONNALITES.md (fonction Q1).

import { insecables } from '../typo'

const fr = {
  meta: {
    titre: 'Méthode : comment GeoTrends mesure, et ce qu’il ne sait pas',
    description: 'Relevé de l’interface ou réponse de l’API, échantillon et marge d’erreur, rythme des relevés, sens d’une réponse « vide », limites de la mesure.',
  },
  fil: 'Méthode',
  titre: 'Un chiffre sans méthode [[est une opinion.]]',
  chapo: 'Voici comment les réponses sont relevées, comment les chiffres sont calculés, à quel rythme, et où la mesure s’arrête. Chaque règle de cette page se retrouve dans l’outil, à côté des chiffres.',
  marge: ['4 IA par l’interface', '1 IA par son API', 'Relevés chaque semaine', 'Claude toutes les 2 semaines'],
  interface: {
    chapitre: 'Interface ou API',
    titre: 'Ce que voit l’internaute n’est pas ce que renvoie l’API.',
    textes: [
      'Il existe deux façons d’interroger une IA. Ouvrir sa vraie page, comme le fait un internaute, et lire ce qui s’affiche : c’est le relevé d’interface. Ou appeler l’API de son éditeur, qui renvoie la réponse du modèle seul, sans l’habillage de l’application.',
      'Les deux ne donnent pas la même réponse. Une étude publiée par Surfer en 2026 trouve un recoupement d’environ un quart sur les marques nommées, et de quelques pour cent sur les sources.',
      'GeoTrends relève l’interface partout où un service le permet : ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google. Pour Claude, aucun service ne relève l’interface. Il passe donc par l’API d’Anthropic, recherche web activée, et chaque écran l’écrit.',
    ],
    colonnes: [
      { nom: 'Relevé d’interface', points: ['La vraie page de l’IA, ouverte comme le ferait un internaute', 'La réponse affichée, avec les sources affichées', 'Question posée depuis le pays visé, dans sa langue', 'Session neutre : ni historique, ni personnalisation'] },
      { nom: 'Réponse d’API', points: ['Le modèle seul, sans l’application', 'Les sources que renvoie l’outil de recherche du modèle', 'Un prix par question bien plus élevé', 'Un repère sur le modèle, pas ce que voit l’internaute'] },
    ],
  },
  echantillon: {
    chapitre: 'Échantillon et marge d’erreur',
    titre: 'La même question ne reçoit pas deux fois la même réponse.',
    textes: [
      'Une réponse d’IA est un tirage. Posez dix fois la même question : les marques et les sources changent. Un relevé isolé ne prouve donc ni une présence, ni une absence.',
      'C’est pourquoi chaque chiffre de l’outil dit sur combien de relevés il repose. Et c’est pourquoi la marge d’erreur compte plus que la décimale.',
    ],
    figure: {
      titre: 'La marge d’erreur selon le nombre de relevés',
      legende: 'Pour une visibilité mesurée à 50 %. Le trait noir est la mesure, la bande jaune ce qu’elle peut valoir en réalité.',
      lignes: [
        { nom: 'Une question, une IA', releves: '20 relevés', marge: 20, verdict: 'Assez pour dire « solide » ou « absente ». Pas pour afficher « 43 % ».' },
        { nom: 'Cinquante questions réunies, une IA', releves: '1 000 relevés', marge: 3, verdict: 'La visibilité d’ensemble est fiable à trois points près.' },
      ],
      points: 'points',
    },
    suite: 'Vingt relevés d’une même question, à un par semaine, demandent cinq mois. Pour une question seule, l’outil dit donc un mot plutôt qu’un pourcentage : solide, occasionnelle ou absente. Pour trancher plus vite, une mesure approfondie pose la question 5, 10 ou 25 fois de suite.',
    noteEcran: 'La marge d’erreur est écrite à côté de chaque visibilité, et tracée en bande grise sur les courbes de l’outil.',
  },
  addition: {
    chapitre: 'Deux méthodes, deux chiffres',
    titre: 'Interface et API ne s’additionnent jamais.',
    textes: [
      'Un chiffre qui mélange les deux méthodes ne mesure plus rien. Dans chaque tableau, Claude a sa propre colonne, séparée des autres par un filet.',
      'Les chiffres d’ensemble portent sur les quatre IA relevées par l’interface. Celui de Claude s’affiche à côté, jamais dedans.',
    ],
    groupes: [['ChatGPT', 'Gemini', 'Mode IA de Google', 'Aperçus IA de Google'], ['Claude']],
    legende: 'Jamais de total entre les deux colonnes.',
  },
  rythme: {
    chapitre: 'Le rythme',
    titre: 'Chaque semaine. Toutes les deux semaines pour Claude.',
    textes: [
      'Une réponse d’IA ne change pas d’heure en heure. Beaucoup d’outils relèvent chaque jour. Nous avons choisi un rythme plus lent : il suffit pour voir bouger une tendance, et il ne paie pas le bruit du jour.',
      'Une question posée à Claude coûte environ cinquante fois plus cher qu’un relevé d’interface. Claude est donc relevé une semaine sur deux.',
    ],
    semaine: 'Semaine',
    semaineCourt: 'S',
    moteurs: ['ChatGPT', 'Gemini', 'Mode IA', 'Aperçus IA', 'Claude'],
    legende: 'Un carré plein : un relevé d’interface. Un carré en pointillé : un relevé par API.',
    etat: 'Les relevés partent seuls une fois activés sur la page du projet, à ce rythme. Un relevé peut aussi se lancer d’un bouton, son prix affiché avant l’envoi.',
  },
  etats: {
    chapitre: 'Les états d’un relevé',
    titre: 'Une question sans réponse n’est pas une absence.',
    texte: 'Un relevé part, puis revient quelques minutes plus tard. Entre les deux, et selon ce qui revient, il porte un des quatre états ci-dessous. Deux seulement entrent dans les chiffres.',
    liste: [
      { nom: 'Reçu', compte: 'Compte', texte: 'La réponse est là, avec ses sources. Elle entre dans les chiffres, que la marque y figure ou non.' },
      { nom: 'Vide', compte: 'Sort du calcul', texte: 'L’IA n’a rien affiché pour cette question. Le cas courant : Google ne montre pas d’Aperçu IA. Ce n’est pas une absence de la marque.' },
      { nom: 'En attente', compte: 'Pas encore', texte: 'La question est partie, la réponse n’est pas revenue. Ce n’est pas un échec : il suffit de la récupérer plus tard, sans rien repayer.' },
      { nom: 'Échec', compte: 'Ne compte pas', texte: 'Le fournisseur n’a pas pu relever la réponse. Le relevé est à refaire.' },
    ],
    exemple: 'Exemple : dix questions, dont une sans Aperçu IA. La visibilité dans les Aperçus IA se calcule sur neuf réponses, pas sur dix.',
  },
  limites: {
    chapitre: 'Les limites',
    titre: 'Ce que la mesure ne dit pas.',
    liste: [
      ['Ce que voit un internaute connecté', 'Les relevés partent d’une session neutre, sans historique. Une personne connectée, avec ses habitudes, peut recevoir une autre réponse.'],
      ['Combien de gens posent la question', 'Aucune IA ne publie ce qu’on lui demande. L’outil n’affiche aucun volume de questions.'],
      ['Pourquoi un chiffre a bougé', 'L’outil dit si un écart dépasse la marge d’erreur, pas sa cause. Un nouveau modèle, un concurrent ou votre correction peuvent tous l’expliquer : la courbe porte un repère pour le premier et pour la troisième.'],
      ['Ce qu’affiche l’application Claude', 'Claude est interrogé par son API. Son chiffre est un repère sur le modèle, pas un relevé de l’application.'],
      ['Les pages lues par Gemini et par Google', 'Seuls ChatGPT et Claude donnent les pages ouvertes sans être citées, et les recherches qu’ils ont lancées.'],
      ['Le rang et le ton, lus par un modèle', 'Hors ChatGPT, qui les donne lui-même, les marques nommées, leur rang et le ton sont tirés du texte par un petit modèle de langage. Il peut se tromper sur une réponse ambiguë : chaque fiche renvoie au texte d’origine.'],
    ],
    fin: 'Et une chose que personne ne sait : comment obtenir une citation à coup sûr. On mesure, on corrige, on mesure de nouveau.',
  },
  appel: { nom: 'Voir les IA suivies' },
}

const en: typeof fr = {
  meta: {
    titre: 'Method: how GeoTrends measures, and what it does not know',
    description: 'Interface reading or API answer, sampling and margin of error, reading schedule, what an “empty” answer means, limits of the measurement.',
  },
  fil: 'Method',
  titre: 'A number without a method [[is an opinion.]]',
  chapo: 'Here is how answers are recorded, how numbers are calculated, how often, and where the measurement stops. Every rule on this page shows up in the tool, next to the numbers.',
  marge: ['4 engines through the interface', '1 engine through its API', 'Readings every week', 'Claude every 2 weeks'],
  interface: {
    chapitre: 'Interface or API',
    titre: 'What a person sees is not what the API returns.',
    textes: [
      'There are two ways to query an AI engine. Open its real page, as a person would, and read what is displayed: that is an interface reading. Or call its maker’s API, which returns the answer of the bare model, without the application around it.',
      'The two do not give the same answer. A study published by Surfer in 2026 found an overlap of about a quarter on the brands named, and of a few percent on the sources.',
      'GeoTrends reads the interface wherever a service makes it possible: ChatGPT, Gemini, Google AI Mode and AI Overviews. For Claude, no service reads the interface. It goes through the Anthropic API with web search turned on, and every screen says so.',
    ],
    colonnes: [
      { nom: 'Interface reading', points: ['The engine’s real page, opened the way a person would', 'The answer as displayed, with the sources as displayed', 'Question asked from the target country, in its language', 'Neutral session: no history, no personalisation'] },
      { nom: 'API answer', points: ['The bare model, without the application', 'The sources returned by the model’s search tool', 'A much higher price per question', 'A reference point on the model, not what a person sees'] },
    ],
  },
  echantillon: {
    chapitre: 'Sampling and margin of error',
    titre: 'The same question never gets the same answer twice.',
    textes: [
      'An AI answer is a draw. Ask the same question ten times and the brands and sources change. A single reading therefore proves neither a presence nor an absence.',
      'That is why every number in the tool says how many readings it rests on. And why the margin of error matters more than the decimal.',
    ],
    figure: {
      titre: 'Margin of error by number of readings',
      legende: 'For a visibility measured at 50%. The black line is the measurement, the yellow band is what it may really be.',
      lignes: [
        { nom: 'One question, one engine', releves: '20 readings', marge: 20, verdict: 'Enough to say “solid” or “absent”. Not enough to display “43%”.' },
        { nom: 'Fifty questions pooled, one engine', releves: '1,000 readings', marge: 3, verdict: 'Overall visibility is reliable to within three points.' },
      ],
      points: 'points',
    },
    suite: 'Twenty readings of the same question, at one a week, take five months. For a single question, the tool therefore gives a word instead of a percentage: solid, occasional or absent. To settle it faster, a deep measurement asks the question 5, 10 or 25 times in a row.',
    noteEcran: 'The margin of error is written next to every visibility number, and drawn as a grey band on the tool’s curves.',
  },
  addition: {
    chapitre: 'Two methods, two numbers',
    titre: 'Interface and API are never added together.',
    textes: [
      'A number that mixes the two methods no longer measures anything. In every table, Claude has its own column, set apart from the others by a rule.',
      'Overall numbers cover the four engines read through the interface. Claude’s number sits next to them, never inside them.',
    ],
    groupes: [['ChatGPT', 'Gemini', 'Google AI Mode', 'Google AI Overviews'], ['Claude']],
    legende: 'Never a total across the two columns.',
  },
  rythme: {
    chapitre: 'The schedule',
    titre: 'Every week. Every two weeks for Claude.',
    textes: [
      'An AI answer does not change by the hour. Many tools take a reading every day. We chose a slower pace: it is enough to see a trend move, and it does not pay for daily noise.',
      'A question put to Claude costs about fifty times more than an interface reading. So Claude is read every other week.',
    ],
    semaine: 'Week',
    semaineCourt: 'W',
    moteurs: ['ChatGPT', 'Gemini', 'AI Mode', 'AI Overviews', 'Claude'],
    legende: 'A solid square: an interface reading. A dashed square: an API reading.',
    etat: 'Readings go out on their own once activated on the project page, at this pace. A reading can also be launched with one button, its price shown before sending.',
  },
  etats: {
    chapitre: 'The states of a reading',
    titre: 'A question with no answer is not an absence.',
    texte: 'A reading goes out, then comes back a few minutes later. In between, and depending on what comes back, it carries one of the four states below. Only two of them feed the numbers.',
    liste: [
      { nom: 'Received', compte: 'Counts', texte: 'The answer is there, with its sources. It feeds the numbers, whether or not the brand is in it.' },
      { nom: 'Empty', compte: 'Left out', texte: 'The engine displayed nothing for this question. The usual case: Google shows no AI Overview. It is not an absence of the brand.' },
      { nom: 'Pending', compte: 'Not yet', texte: 'The question has gone out and the answer has not come back. It is not a failure: you collect it later, at no extra cost.' },
      { nom: 'Failed', compte: 'Does not count', texte: 'The provider could not record the answer. The reading has to be redone.' },
    ],
    exemple: 'Example: ten questions, one of them with no AI Overview. Visibility in AI Overviews is calculated on nine answers, not ten.',
  },
  limites: {
    chapitre: 'The limits',
    titre: 'What the measurement does not tell you.',
    liste: [
      ['What a signed-in user sees', 'Readings start from a neutral session with no history. A signed-in person, with their own habits, may get a different answer.'],
      ['How many people ask the question', 'No AI engine publishes what it is asked. The tool shows no question volumes.'],
      ['Why a number moved', 'The tool says whether a gap is larger than the margin of error, not what caused it. A new model, a competitor or your fix can all explain it: the curve carries a marker for the first and the third.'],
      ['What the Claude app displays', 'Claude is queried through its API. Its number is a reference point on the model, not a reading of the app.'],
      ['The pages read by Gemini and Google', 'Only ChatGPT and Claude expose the pages they opened without citing, and the searches they ran.'],
      ['Rank and tone, read by a model', 'Except for ChatGPT, which returns them itself, brands named, their rank and the tone are drawn from the text by a small language model. It can be wrong on an ambiguous answer: every sheet links back to the original text.'],
    ],
    fin: 'And one thing nobody knows: how to get cited for certain. We measure, we fix, we measure again.',
  },
  appel: { nom: 'See the AI engines' },
}

export const methode = { fr: insecables(fr), en }
