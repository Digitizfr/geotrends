// Page « IA suivies » : une fiche par IA, puis ce que chaque relevé contient.
// La matrice reprend ce que l'outil enregistre réellement (src/lib/extraction.ts).

import { insecables } from '../typo'

type Case = 'oui' | 'non' | 'lu'

const MATRICE: Case[][] = [
  ['oui', 'oui', 'oui', 'oui', 'oui'],
  ['oui', 'oui', 'oui', 'oui', 'oui'],
  ['oui', 'oui', 'oui', 'oui', 'oui'],
  ['oui', 'non', 'non', 'non', 'oui'],
  ['oui', 'non', 'non', 'non', 'oui'],
  ['oui', 'lu', 'lu', 'lu', 'lu'],
  ['oui', 'oui', 'non', 'non', 'oui'],
  ['non', 'non', 'non', 'oui', 'non'],
  ['non', 'non', 'non', 'oui', 'non'],
]

const fr = {
  meta: {
    titre: 'IA suivies : cinq assistants, et ce qui est relevé pour chacun',
    description: 'ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google relevés dans leur interface, Claude par son API. Méthode, rythme et contenu de chaque relevé. À venir : Perplexity et Copilot.',
  },
  fil: 'IA suivies',
  titre: 'Cinq IA bien mesurées, [[plutôt que quinze survolées.]]',
  chapo: 'ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google, et Claude. Pour chacune : la méthode, le rythme, et ce que le relevé contient vraiment. Toutes ne donnent pas la même chose, et cette page le dit.',
  marge: ['4 relevées par l’interface', '1 interrogée par son API', '2 à venir'],
  fiches: {
    chapitre: 'Les cinq IA',
    contient: 'Ce que le relevé contient',
    semaine: 'Chaque semaine',
    quinzaine: 'Toutes les deux semaines',
    aPart: 'Colonne à part',
    liste: [
      {
        nom: 'ChatGPT', editeur: 'OpenAI', api: false,
        texte: 'C’est l’IA la plus bavarde sur sa façon de travailler. En plus de la réponse et de ses sources, le relevé donne les pages qu’elle a ouvertes sans les citer, les marques qu’elle a reconnues et les recherches qu’elle a lancées.',
        contient: ['Texte complet de la réponse', 'Sources citées, avec leur rang', 'Pages lues sans être citées', 'Marques nommées, dans l’ordre', 'Recherches lancées avant de répondre', 'Nom du modèle'],
        note: 'Relevé sans forcer la recherche web. On veut ce qu’un internaute obtient, pas une réponse provoquée.',
      },
      {
        nom: 'Gemini', editeur: 'Google', api: false,
        texte: 'Le relevé donne la réponse affichée et ses sources. Gemini ne dit ni ce qu’il a lu sans le citer, ni ce qu’il a cherché.',
        contient: ['Texte complet de la réponse', 'Sources citées, avec leur rang', 'Nom du modèle'],
        note: 'Les marques nommées, leur rang et le ton sont tirés de sa réponse par la lecture automatique.',
      },
      {
        nom: 'Mode IA de Google', editeur: 'Google', api: false,
        texte: 'Le Mode IA est l’onglet de Google qui répond par un texte construit, sources à l’appui. Il est suivi à part des Aperçus IA : ce n’est ni le même écran, ni les mêmes sources.',
        contient: ['Texte complet de la réponse', 'Sources citées, avec leur rang', 'Vidéos YouTube citées, rattachées à leur chaîne'],
        note: 'Google ne donne pas le nom du modèle qui a répondu.',
      },
      {
        nom: 'Aperçus IA de Google', editeur: 'Google', api: false,
        texte: 'L’Aperçu IA est le résumé que Google place parfois au-dessus de ses résultats. Il n’a pas d’adresse propre : il se lit dans la page de résultats classique. Le relevé contient donc aussi les dix premiers résultats de la même recherche.',
        contient: ['Présence ou non d’un aperçu pour la question', 'Texte de l’aperçu et sources citées', 'Dix premiers résultats de Google, pour comparer', '« Autres questions posées » et recherches associées', 'Vidéos citées, avec le moment retenu'],
        note: 'Une question sans aperçu revient « vide » et sort du calcul. Ce n’est pas une absence de la marque.',
      },
      {
        nom: 'Claude', editeur: 'Anthropic', api: true,
        texte: 'Aucun service ne relève l’interface de Claude. Il est interrogé par l’API d’Anthropic, recherche web activée. C’est la réponse du modèle, pas celle de l’application : elle a sa colonne, et ne s’additionne à rien.',
        contient: ['Texte complet de la réponse', 'Sources citées, avec l’extrait cité', 'Pages trouvées par ses recherches et non citées', 'Recherches lancées avant de répondre', 'Nom du modèle'],
        note: 'Une question coûte environ 0,06 $, cinquante fois plus qu’un relevé d’interface. D’où le rythme : une semaine sur deux.',
      },
    ],
  },
  matrice: {
    chapitre: 'Ce que chaque relevé contient',
    titre: 'Toutes les IA ne donnent pas la même chose.',
    texte: 'Ce tableau dit ce que l’outil enregistre aujourd’hui, IA par IA. Une case vide n’est pas un oubli : l’IA ne fournit pas l’information.',
    colonnes: ['ChatGPT', 'Gemini', 'Mode IA', 'Aperçus IA', 'Claude'],
    donnee: 'Donnée',
    lignes: ['Réponse complète', 'Sources citées', 'Vidéos YouTube rattachées à leur chaîne', 'Pages lues sans être citées', 'Recherches lancées par l’IA', 'Marques nommées, dans l’ordre', 'Nom du modèle', 'Dix premiers résultats de Google', '« Autres questions posées »'],
    cases: { oui: 'Relevé', non: 'Non fourni', lu: 'Lu dans le texte' },
    legende: '« Lu dans le texte » : l’IA ne fournit pas la liste, la lecture automatique la tire de sa réponse. Claude est séparé par un filet : sa méthode n’est pas celle des autres.',
  },
  pays: {
    chapitre: 'Pays et langue',
    titre: 'La question part du pays visé, dans sa langue.',
    texte: 'Une IA ne répond pas la même chose à Paris et à Montréal. Chaque projet choisit donc le pays d’où ses questions sont posées, et leur langue. Le premier marché servi est la France, en français, mais rien n’est figé dans l’outil.',
  },
  avenir: {
    chapitre: 'À venir',
    titre: 'Perplexity et Copilot.',
    texte: 'Les deux passeront par un second fournisseur de relevés d’interface. Il sera choisi sur un essai réel : qualité des sources renvoyées, et relevé depuis le pays visé.',
    liste: [['Perplexity', 'Relevé d’interface prévu'], ['Copilot', 'Relevé d’interface prévu']],
    pourquoi: 'Pourquoi pas davantage',
    pourquoiTexte: 'Certains outils annoncent quinze IA ou plus. Nous préférons cinq ou six IA dont chaque chiffre a une méthode connue, et assez de relevés pour vouloir dire quelque chose.',
  },
  appel: { nom: 'Lire la méthode' },
}

const en: typeof fr = {
  meta: {
    titre: 'AI engines: five assistants, and what is recorded for each',
    description: 'ChatGPT, Gemini, Google AI Mode and AI Overviews read in their interface, Claude through its API. Method, schedule and content of each reading. Coming next: Perplexity and Copilot.',
  },
  fil: 'AI engines',
  titre: 'Five engines measured properly, [[rather than fifteen skimmed.]]',
  chapo: 'ChatGPT, Gemini, Google AI Mode and AI Overviews, and Claude. For each one: the method, the schedule, and what the reading really contains. They do not all give the same thing, and this page says so.',
  marge: ['4 read through the interface', '1 queried through its API', '2 coming next'],
  fiches: {
    chapitre: 'The five engines',
    contient: 'What the reading contains',
    semaine: 'Every week',
    quinzaine: 'Every two weeks',
    aPart: 'Separate column',
    liste: [
      {
        nom: 'ChatGPT', editeur: 'OpenAI', api: false,
        texte: 'It is the engine that says the most about how it works. On top of the answer and its sources, the reading gives the pages it opened without citing them, the brands it recognised and the searches it ran.',
        contient: ['Full text of the answer', 'Cited sources, with their rank', 'Pages read but not cited', 'Brands named, in order', 'Searches run before answering', 'Model name'],
        note: 'Read without forcing web search. We want what a real user gets, not an answer we provoked.',
      },
      {
        nom: 'Gemini', editeur: 'Google', api: false,
        texte: 'The reading gives the displayed answer and its sources. Gemini does not say what it read without citing, or what it searched for.',
        contient: ['Full text of the answer', 'Cited sources, with their rank', 'Model name'],
        note: 'Brands named, their rank and the tone are drawn from its answer by automatic reading.',
      },
      {
        nom: 'Google AI Mode', editeur: 'Google', api: false,
        texte: 'AI Mode is the Google tab that answers with a structured text backed by sources. It is tracked separately from AI Overviews: it is not the same screen, and not the same sources.',
        contient: ['Full text of the answer', 'Cited sources, with their rank', 'YouTube videos cited, matched to their channel'],
        note: 'Google does not give the name of the model that answered.',
      },
      {
        nom: 'Google AI Overviews', editeur: 'Google', api: false,
        texte: 'An AI Overview is the summary Google sometimes places above its results. It has no address of its own: it is read inside the classic results page. So the reading also contains the top ten results for the same search.',
        contient: ['Whether an overview is shown for the question', 'Text of the overview and cited sources', 'Google’s top ten results, for comparison', '“People also ask” and related searches', 'Videos cited, with the moment picked'],
        note: 'A question with no overview comes back “empty” and leaves the calculation. It is not an absence of the brand.',
      },
      {
        nom: 'Claude', editeur: 'Anthropic', api: true,
        texte: 'No service reads Claude’s interface. It is queried through the Anthropic API with web search turned on. That is the model’s answer, not the app’s: it has its own column, and is added to nothing.',
        contient: ['Full text of the answer', 'Cited sources, with the cited excerpt', 'Pages found by its searches and not cited', 'Searches run before answering', 'Model name'],
        note: 'One question costs about $0.06, fifty times more than an interface reading. Hence the schedule: every other week.',
      },
    ],
  },
  matrice: {
    chapitre: 'What each reading contains',
    titre: 'Not every engine gives the same thing.',
    texte: 'This table shows what the tool records today, engine by engine. An empty cell is not an oversight: the engine does not provide the information.',
    colonnes: ['ChatGPT', 'Gemini', 'AI Mode', 'AI Overviews', 'Claude'],
    donnee: 'Data',
    lignes: ['Full answer', 'Cited sources', 'YouTube videos matched to their channel', 'Pages read but not cited', 'Searches run by the engine', 'Brands named, in order', 'Model name', 'Google’s top ten results', '“People also ask”'],
    cases: { oui: 'Recorded', non: 'Not provided', lu: 'Read from the text' },
    legende: '“Read from the text”: the engine does not provide the list, automatic reading draws it from its answer. Claude is set apart by a rule: its method is not the same as the others.',
  },
  pays: {
    chapitre: 'Country and language',
    titre: 'The question leaves from the target country, in its language.',
    texte: 'An AI engine does not give the same answer in Paris and in Montreal. So each project chooses the country its questions are asked from, and their language. The first market served is France, in French, but nothing is hard-wired in the tool.',
  },
  avenir: {
    chapitre: 'Coming next',
    titre: 'Perplexity and Copilot.',
    texte: 'Both will go through a second interface-reading provider. It will be chosen after a real trial: quality of the sources returned, and reading from the target country.',
    liste: [['Perplexity', 'Interface reading planned'], ['Copilot', 'Interface reading planned']],
    pourquoi: 'Why not more',
    pourquoiTexte: 'Some tools advertise fifteen engines or more. We prefer five or six engines where every number has a known method, and enough readings to mean something.',
  },
  appel: { nom: 'Read the method' },
}

export const moteurs = { fr: insecables(fr), en, MATRICE }
