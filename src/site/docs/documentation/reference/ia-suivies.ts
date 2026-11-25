import type { PageDoc } from '../../types'

// Les IA relevées : src/lib/fournisseurs (dataforseo.ts, anthropic.ts, types.ts),
// src/lib/extraction.ts (ce que chaque relevé contient), src/lib/mesures.ts (METHODE).
const page: PageDoc = {
  id: 'reference/ia-suivies',
  rubrique: 'reference',
  slug: { fr: 'reference/ia-suivies', en: 'reference/ai-engines' },
  titre: { fr: 'Les IA suivies', en: 'AI engines tracked' },
  resume: {
    fr: 'ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google sont relevés dans leur interface, Claude par son API. Ce que contient chaque relevé, et les IA absentes.',
    en: 'ChatGPT, Gemini, Google AI Mode and AI Overviews are read from their interface, Claude through its API. What each reading holds, and the engines not tracked.',
  },
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'GeoTrends suit cinq IA, avec deux méthodes. Quatre sont relevées dans leur **interface** : un service ouvre la vraie page de l’IA, pose la question depuis le pays du projet, dans sa langue, et renvoie ce qui s’affiche. La cinquième, Claude, n’a pas de relevé d’interface : elle est interrogée par son **API**, la réponse du modèle seul. Les deux méthodes ne sont jamais additionnées.' },
      {
        type: 'tableau',
        colonnes: ['IA', 'Méthode', 'Comment elle est relevée', 'Ce que le relevé contient'],
        lignes: [
          ['**ChatGPT**', 'interface', 'Par DataForSEO, depuis le pays du projet, sans forcer la recherche web : on veut ce qu’un internaute obtient.', 'Le texte, les sources citées, les pages lues sans être citées, les marques nommées, les recherches lancées par l’IA, le modèle.'],
          ['**Gemini**', 'interface', 'Par DataForSEO, depuis le pays du projet.', 'Le texte, les sources citées, le modèle. Les marques sont lues par l’analyse automatique.'],
          ['**Mode IA de Google**', 'interface', 'Par DataForSEO, sur la page de Google en Mode IA.', 'Le texte et ses sources. Pas de nom de modèle.'],
          ['**Aperçus IA de Google**', 'interface', 'Par DataForSEO, sur la page de résultats classique de Google, sur ordinateur, Aperçus affichés en différé compris.', 'Le texte de l’Aperçu et ses sources, les dix premiers résultats de Google, les « autres questions posées ». « Pas d’aperçu » quand Google n’en affiche pas.'],
          ['**Claude**', 'API', 'Par l’API d’Anthropic, recherche web activée (cinq recherches au plus par question), avec le pays du projet comme lieu approximatif.', 'Le texte, les sources citées, les pages trouvées sans être citées, les recherches lancées, le modèle.'],
        ],
      },
      { type: 'h2', id: 'interface-ou-api', texte: 'Interface ou API' },
      { type: 'p', texte: 'Ce que voit un internaute n’est pas ce que renvoie l’API. Une étude publiée par Surfer en 2026 trouve environ un quart de recoupement sur les marques nommées, et quelques pour cent sur les sources. C’est pourquoi l’outil relève l’interface partout où un service le permet. Pour Claude, aucun service ne relève l’application : son chiffre est un repère sur le modèle, pas un relevé de l’application.' },
      { type: 'p', texte: 'Partout dans l’outil, Claude a sa propre colonne, séparée par un filet double, son propre graphique en pointillé et sa propre ligne dans le rapport. Son tampon dit **API**, celui des autres dit **interface**.' },
      { type: 'h2', id: 'ce-que-chaque-ia-donne', texte: 'Ce que chaque IA donne, et ce qu’elle ne donne pas' },
      {
        type: 'liste',
        items: [
          '**Les marques nommées** : ChatGPT renvoie lui-même sa liste. Pour les autres, un petit modèle les lit dans le texte, avec leur rang et le ton employé.',
          '**Les pages lues sans être citées** et **les recherches lancées par l’IA** : connues pour ChatGPT et pour Claude. Gemini et Google ne les donnent pas.',
          '**Les dix premiers résultats de Google** et les **autres questions posées** : relevés avec les Aperçus IA. Ce sont eux qui permettent le diagnostic de l’écran Aperçus IA et Google.',
          '**Le lien de contrôle** : quand le fournisseur le donne, la page d’une question propose **Reposer la question dans l’interface**, pour voir la réponse du moment.',
        ],
      },
      { type: 'h2', id: 'modeles', texte: 'Les modèles' },
      { type: 'p', texte: 'Quand l’IA le donne, le modèle qui a répondu est écrit sous chaque réponse, et sous le nom de l’IA dans le tableau **Présence, IA par IA**. Quand le modèle change d’un jour de relevé au suivant, un repère se pose sur les graphiques : une hausse ou une baisse ce jour-là peut venir de là. Le Mode IA et les Aperçus IA de Google ne donnent pas de nom de modèle.' },
      { type: 'h2', id: 'delais', texte: 'Délais et prix' },
      {
        type: 'tableau',
        colonnes: ['', 'Relevé d’interface', 'Claude par son API'],
        lignes: [
          ['Retour de la réponse', 'Quelques minutes, 45 au plus. La lecture du résultat est gratuite. Sans réponse au bout de six heures, le relevé passe en échec.', 'Dans la foulée de l’envoi, en une à deux minutes par lot.'],
          ['Prix', '0,0012 $ par réponse, renvoyé par le fournisseur. Pour les Aperçus IA, un supplément de 0,0006 $ pour les Aperçus affichés en différé, remboursé s’il n’y en a pas.', 'Calculé depuis la grille de tarifs (jetons et recherches web). L’outil affiche la moyenne de ses trente derniers relevés, 0,06 $ tant qu’aucun n’a été mesuré.'],
        ],
      },
      { type: 'h2', id: 'non-suivies', texte: 'Les IA qui ne sont pas suivies' },
      { type: 'p', texte: '**Perplexity et Copilot ne sont pas suivis.** Ils demandent un second fournisseur de relevés d’interface, qui n’est pas branché. L’application Claude n’est pas relevée non plus, faute de service : seule son API l’est. Aucune autre IA n’est relevée.' },
      { type: 'h2', id: 'choisir', texte: 'Choisir les IA d’un relevé' },
      {
        type: 'etapes',
        items: [
          { titre: 'Partir des quatre IA d’interface', texte: 'Elles sont cochées par défaut dans l’onglet Relevés de la fiche du projet, et ce sont elles qui font la visibilité de la vue d’ensemble.' },
          { titre: 'Ajouter Claude si le repère vous sert', texte: 'Il coûte bien plus cher par question. Il est décoché par défaut, et le rythme conseillé est toutes les deux semaines.' },
          { titre: 'Masquer une IA à la lecture', texte: 'Les pastilles de la barre du haut masquent une IA dans les chiffres et les graphiques, sans rien effacer.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Les relevés partent d’une session neutre, sans historique ni compte : une personne connectée, avec ses habitudes, peut obtenir une autre réponse. Les services de relevé dépendent des interfaces des IA : quand une interface change, un relevé peut échouer quelque temps, et l’outil l’inscrit comme un échec, sans le compter.' },
      {
        type: 'liens',
        items: [
          { page: 'reference/methode' },
          { page: 'projet/lancer-un-releve' },
          { page: 'comprendre/google' },
          { page: 'cas/quelles-ia-regarder' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'GeoTrends tracks five AI engines, with two methods. Four are recorded from their **interface**: a service opens the AI’s real page, asks the prompt from the project’s country, in its language, and returns what is displayed. The fifth, Claude, has no interface reading: it is queried through its **API**, the answer of the bare model. The two methods are never added together.' },
      {
        type: 'tableau',
        colonnes: ['AI', 'Method', 'How it is recorded', 'What the reading holds'],
        lignes: [
          ['**ChatGPT**', 'interface', 'Through DataForSEO, from the project’s country, without forcing web search: we want what a person gets.', 'The text, the cited sources, the pages read but not cited, the brands mentioned, the searches run by the AI, the model.'],
          ['**Gemini**', 'interface', 'Through DataForSEO, from the project’s country.', 'The text, the cited sources, the model. Brands are read by automatic analysis.'],
          ['**Google AI Mode**', 'interface', 'Through DataForSEO, on Google’s AI Mode page.', 'The text and its sources. No model name.'],
          ['**Google AI Overviews**', 'interface', 'Through DataForSEO, on Google’s classic results page, on desktop, including Overviews displayed with a delay.', 'The Overview’s text and its sources, Google’s top ten results, the “People also ask” questions. “No overview” when Google shows none.'],
          ['**Claude**', 'API', 'Through the Anthropic API, with web search on (five searches at most per prompt), using the project’s country as an approximate location.', 'The text, the cited sources, the pages found but not cited, the searches run, the model.'],
        ],
      },
      { type: 'h2', id: 'interface-or-api', texte: 'Interface or API' },
      { type: 'p', texte: 'What a person sees is not what the API returns. A study published by Surfer in 2026 found about a quarter of overlap on the brands mentioned, and a few percent on the sources. That is why the tool reads the interface wherever a service allows it. For Claude, no service reads the app: its number is a reference point on the model, not a reading of the app.' },
      { type: 'p', texte: 'Throughout the tool, Claude has its own column, set apart by a double rule, its own dotted chart and its own row in the report. Its stamp says **API**; the others say **interface**.' },
      { type: 'h2', id: 'what-each-ai-gives', texte: 'What each AI gives, and what it does not' },
      {
        type: 'liste',
        items: [
          '**Brands mentioned**: ChatGPT returns its own list. For the others, a small model reads them from the text, with their position and the tone used.',
          '**Pages read but not cited** and **searches run by the AI**: known for ChatGPT and Claude. Gemini and Google do not provide them.',
          '**Google’s top ten results** and **People also ask**: recorded with the AI Overviews. They make the diagnosis of the AI Overviews & Google screen possible.',
          '**The check link**: when the provider gives it, a prompt’s page offers **Ask the prompt again in the interface**, to see the current answer.',
        ],
      },
      { type: 'h2', id: 'models', texte: 'Models' },
      { type: 'p', texte: 'When the AI provides it, the model that answered is written under each answer, and under the AI’s name in the **Presence, AI by AI** table. When the model changes from one run day to the next, a marker is placed on the charts: a rise or drop that day may come from it. Google AI Mode and AI Overviews give no model name.' },
      { type: 'h2', id: 'timing', texte: 'Timing and price' },
      {
        type: 'tableau',
        colonnes: ['', 'Interface reading', 'Claude through its API'],
        lignes: [
          ['Answer comes back', 'Within minutes, 45 at most. Reading the result is free. With no answer after six hours, the reading is marked failed.', 'Right after sending, in one to two minutes per batch.'],
          ['Price', '$0.0012 per answer, returned by the provider. For AI Overviews, an extra $0.0006 for Overviews displayed with a delay, refunded when there is none.', 'Computed from the rate card (tokens and web searches). The tool shows the average of its last thirty readings, $0.06 until one has been measured.'],
        ],
      },
      { type: 'h2', id: 'not-tracked', texte: 'Engines that are not tracked' },
      { type: 'p', texte: '**Perplexity and Copilot are not tracked.** They require a second interface-reading provider, which is not connected. The Claude app is not recorded either, as no service does it: only its API is. No other AI engine is recorded.' },
      { type: 'h2', id: 'choosing', texte: 'Choosing the AIs of a run' },
      {
        type: 'etapes',
        items: [
          { titre: 'Start from the four interface AIs', texte: 'They are ticked by default in the Runs tab of the project page, and they make up the visibility shown on the overview.' },
          { titre: 'Add Claude if the reference point helps you', texte: 'It costs far more per prompt. It is unticked by default, and the recommended pace is every two weeks.' },
          { titre: 'Hide an AI when reading', texte: 'The pills in the top bar hide an AI from the numbers and charts, without deleting anything.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'Readings start from a neutral session, with no history and no account: a signed-in person, with their own habits, may get a different answer. Reading services depend on the AI interfaces: when an interface changes, a reading can fail for a while, and the tool logs it as failed, without counting it.' },
      {
        type: 'liens',
        items: [
          { page: 'reference/methode' },
          { page: 'projet/lancer-un-releve' },
          { page: 'comprendre/google' },
          { page: 'cas/quelles-ia-regarder' },
        ],
      },
    ],
  },
}

export default page
