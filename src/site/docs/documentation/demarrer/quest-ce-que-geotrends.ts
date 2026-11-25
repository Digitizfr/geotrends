import type { PageDoc } from '../../types'

// Accueil de la documentation (/documentation, /en/docs) : ce qu'est l'outil,
// ce qu'il fait et ne fait pas, et par où commencer. Les cartes des rubriques
// s'ajoutent dessous toutes seules.
const page: PageDoc = {
  id: 'demarrer/quest-ce-que-geotrends',
  rubrique: 'demarrer',
  slug: { fr: '', en: '' },
  titre: { fr: 'Qu’est-ce que GeoTrends ?', en: 'What is GeoTrends?' },
  resume: {
    fr: 'GeoTrends relève ce que ChatGPT, Gemini, Claude et Google répondent à vos clients, dit si votre marque y figure, qui est cité à sa place et quoi corriger.',
    en: 'GeoTrends records what ChatGPT, Gemini, Claude and Google answer your customers, tells you whether your brand is there, who is cited instead and what to fix.',
  },
  maj: '2026-11-25',
  contenu: {
    fr: [
      { type: 'p', texte: 'Quand un client demande à une IA « quel logiciel de facturation choisir pour un indépendant ? », la réponse nomme quelques marques et cite quelques pages. GeoTrends pose ces questions à votre place, garde chaque réponse avec ses sources, et dit si votre marque y figure. C’est un outil de **GEO** (Generative Engine Optimization) : le référencement dans les réponses des IA.' },
      { type: 'p', texte: 'Il sert à trois choses : **mesurer** la place de la marque, IA par IA et question par question ; **comprendre** qui est cité à sa place et grâce à quelles pages ; **agir** à partir d’une liste de travail tirée des relevés, puis mesurer de nouveau.' },
      { type: 'capture', nom: 'vue', legende: 'La vue d’ensemble du projet d’exemple Facturo : la visibilité, la part de voix, le rang moyen et leur évolution, chaque chiffre avec sa méthode et son nombre de réponses.' },
      { type: 'h2', id: 'ce-que-fait-l-outil', texte: 'Ce que fait l’outil' },
      {
        type: 'liste',
        items: [
          '**Il pose vos questions aux IA**, celles que vos clients leur posent, depuis le pays et dans la langue du projet. ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google sont relevés dans leur interface ; Claude est interrogé par son API.',
          '**Il garde chaque réponse** : son texte, les sources citées, les pages lues, les marques nommées dans l’ordre. Pour chacune, il dit si la marque est **citée** (une de ses pages ou vidéos en source), **nommée** (son nom dans le texte) ou **absente**.',
          '**Il montre qui prend la place** : les marques nommées le plus souvent, les sites et les pages qui servent de sources, les vidéos YouTube, les résultats de Google sous chaque Aperçu IA.',
          '**Il en tire une liste de travail** : les pages où apparaître, vos pages à corriger, les sujets à couvrir, les faits faux à faire corriger. Une action faite est suivie : l’outil compare la présence avant et après.',
        ],
      },
      { type: 'h2', id: 'principes', texte: 'Quatre principes, visibles à l’écran' },
      {
        type: 'tableau',
        colonnes: ['Principe', 'Ce que cela veut dire dans l’outil'],
        lignes: [
          ['Des données vraies', 'Un relevé d’interface montre ce que voit un internaute. Claude, interrogé par son API, a toujours sa propre colonne : les deux méthodes ne sont jamais additionnées.'],
          ['Des chiffres fiables', 'Chaque chiffre dit sur combien de réponses il repose. Sous 5 réponses, aucun pourcentage n’est affiché. Un écart n’est coloré que s’il dépasse la marge d’erreur.'],
          ['De l’action', 'Chaque ligne de la liste de travail renvoie aux réponses qui la justifient. Aucune note de gain n’est inventée.'],
          ['Les coûts en clair', 'Le prix d’un relevé s’affiche avant l’envoi, et chaque appel payant est inscrit au journal des coûts, avec un plafond par mois.'],
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Un logiciel libre et gratuit', texte: 'GeoTrends est publié sous licence AGPL-3.0 : vous l’installez chez vous, avec vos propres clés d’API, et vous ne payez que vos relevés, directement aux fournisseurs. Voir [Installer GeoTrends](doc:demarrer/installer). Les captures de cette documentation montrent une marque d’exemple, Facturo, et ses concurrents fictifs.' },
      { type: 'h2', id: 'ce-qu-il-ne-fait-pas', texte: 'Ce qu’il ne fait pas' },
      {
        type: 'liste',
        items: [
          '**Il ne promet aucune citation.** Personne ne sait obtenir une citation à coup sûr. L’outil mesure, vous corrigez, il mesure de nouveau.',
          '**Il ne donne pas de note sur 100.** Une visibilité se lit avec sa méthode et son nombre de réponses, pas comme un score.',
          '**Il ne suit pas Perplexity ni Copilot**, et ne relie pas les visites venues des IA (Google Analytics, Search Console). Ces deux chantiers ne sont pas faits.',
          '**L’envoi du rapport du lundi par e-mail n’a pas encore été éprouvé.** Le rapport est écrit et se lit à l’écran ; l’envoi demande une clé du service Resend et n’a pas encore servi en conditions réelles.',
        ],
      },
      {
        type: 'liens',
        titre: 'Par où commencer',
        items: [
          { page: 'demarrer/installer', texte: 'Installer l’outil chez vous et brancher vos clés, en un quart d’heure.' },
          { page: 'demarrer/prise-en-main', texte: 'Du premier projet au premier relevé, en six étapes.' },
          { page: 'demarrer/notions-cles', texte: 'Question, relevé, méthode, visibilité, part de voix : les mots de l’outil.' },
          { page: 'demarrer/premiers-resultats', texte: 'Ce qu’il faut regarder, et dans quel ordre, quand les réponses reviennent.' },
          { page: 'reference/methode', texte: 'Comment l’outil compte, et ce qu’il ne sait pas.' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'When a customer asks an AI “which invoicing software should a freelancer choose?”, the answer names a few brands and cites a few pages. GeoTrends asks those prompts for you, keeps every answer with its sources, and tells you whether your brand is in it. It is a **GEO** tool (Generative Engine Optimization): search optimisation for AI answers.' },
      { type: 'p', texte: 'It does three things: **measure** where the brand stands, AI by AI and prompt by prompt; **understand** who is cited instead and thanks to which pages; **act** from a work list drawn from the runs, then measure again.' },
      { type: 'capture', nom: 'vue', legende: 'The overview of the Facturo UK sample project: visibility, share of voice, average position and their trend, each number with its method and its number of answers.' },
      { type: 'h2', id: 'what-the-tool-does', texte: 'What the tool does' },
      {
        type: 'liste',
        items: [
          '**It asks your prompts to the AIs**, the ones your customers ask them, from the project’s country and in its language. ChatGPT, Gemini, Google AI Mode and AI Overviews are recorded from their interface; Claude is queried through its API.',
          '**It keeps every answer**: its text, the cited sources, the pages read, the brands mentioned in order. For each one it says whether the brand is **cited** (one of its pages or videos as a source), **mentioned** (its name in the text) or **absent**.',
          '**It shows who takes the spot**: the brands mentioned most often, the sites and pages used as sources, the YouTube videos, the Google results under each AI Overview.',
          '**It turns that into a work list**: pages to appear on, your pages to fix, topics to cover, wrong facts to get corrected. Once an action is done, the tool compares presence before and after.',
        ],
      },
      { type: 'h2', id: 'principles', texte: 'Four principles, visible on screen' },
      {
        type: 'tableau',
        colonnes: ['Principle', 'What it means in the tool'],
        lignes: [
          ['Real data', 'An interface reading shows what a person sees. Claude, queried through its API, always has its own column: the two methods are never added together.'],
          ['Reliable numbers', 'Every number says how many answers it rests on. Below 5 answers, no percentage is shown. A change is only coloured when it exceeds the margin of error.'],
          ['Action', 'Every line of the work list links to the answers that justify it. No made-up gain score.'],
          ['Costs in plain sight', 'The price of a run is shown before it is sent, and every paid call is logged in the cost journal, under a monthly cap.'],
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Free, open-source software', texte: 'GeoTrends is released under the AGPL-3.0 licence: you install it yourself, with your own API keys, and you only pay for your readings, straight to the providers. See [Install GeoTrends](doc:demarrer/installer). The screenshots in these docs show a sample brand, Facturo, and its fictional competitors.' },
      { type: 'h2', id: 'what-it-does-not-do', texte: 'What it does not do' },
      {
        type: 'liste',
        items: [
          '**It promises no citation.** Nobody knows how to get cited for certain. The tool measures, you fix, it measures again.',
          '**It gives no score out of 100.** Visibility is read with its method and its number of answers, not as a grade.',
          '**It does not track Perplexity or Copilot**, and does not connect visits coming from AI engines (Google Analytics, Search Console). Neither is built.',
          '**Sending the Monday report by e-mail is not battle-tested yet.** The report is written and can be read on screen; sending needs a Resend key and has not been used in real conditions yet.',
        ],
      },
      {
        type: 'liens',
        titre: 'Where to start',
        items: [
          { page: 'demarrer/installer', texte: 'Install the tool yourself and plug in your keys, in fifteen minutes.' },
          { page: 'demarrer/prise-en-main', texte: 'From the first project to the first run, in six steps.' },
          { page: 'demarrer/notions-cles', texte: 'Prompt, run, method, visibility, share of voice: the words of the tool.' },
          { page: 'demarrer/premiers-resultats', texte: 'What to look at, and in which order, when the answers come back.' },
          { page: 'reference/methode', texte: 'How the tool counts, and what it does not know.' },
        ],
      },
    ],
  },
}

export default page
