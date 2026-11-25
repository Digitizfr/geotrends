// Cas d'usage : la liste de questions ressemble-t-elle à ce que les clients demandent ?
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/suivre-les-bonnes-questions',
  rubrique: 'demarrer-le-suivi',
  slug: { fr: 'suivre-les-bonnes-questions', en: 'tracking-the-right-prompts' },
  titre: {
    fr: 'Suis-je en train de suivre les bonnes questions ?',
    en: 'Am I tracking the right prompts?',
  },
  resume: {
    fr: 'Vérifier que vos questions sont celles de vos clients : verdicts, premier nommé, idées tirées de Google et des IA, questions à ajouter ou à archiver.',
    en: 'Check that your prompts are the ones your customers ask: verdicts, brand named first, ideas from Google and the AIs, prompts to add or to archive.',
  },
  ecrans: ['/questions', '/google', '/projets/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Vous avez écrit une première liste de questions en créant le projet Facturo. Quelques relevés plus tard, le doute vient : ces questions ressemblent-elles à ce que vos clients demandent vraiment aux IA, ou à ce que vous aimeriez qu’ils demandent ? Tous les chiffres de l’outil reposent sur cette liste. Elle mérite une relecture.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Un projet avec ses questions, et deux ou trois relevés au moins. Avant, chaque question porte le verdict « trop tôt pour dire ».',
          'Un relevé des Aperçus IA de Google : c’est lui qui rapporte les « autres questions posées » par les internautes.',
          'Des relevés de ChatGPT ou de Claude, pour connaître les recherches que l’IA lance elle-même avant de répondre.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Relire les verdicts, question par question',
            texte: 'Ouvrez **Questions**. Chaque ligne donne le dernier état chez chaque IA, puis le **Verdict** sur la période (solide, occasionnelle, absente) et la marque **Premier nommé**. Une question où Facturo est absente n’est pas une mauvaise question : c’est souvent celle qu’il faut gagner. Regardez plutôt qui est nommé en premier : si ce ne sont jamais des logiciels de facturation, la question ne dit peut-être pas ce que vous croyez.',
            capture: 'questions',
          },
          {
            titre: 'Regarder ce que demandent les internautes',
            texte: 'Ouvrez **Aperçus IA et Google**, bloc **Idées de questions à suivre**. Vous y trouvez les « autres questions posées » que Google affiche sous vos questions, et les recherches que ChatGPT ou Claude ont tapées avant de répondre, les plus fréquentes d’abord. Ce sont de vraies formulations, pas les vôtres.',
            capture: 'google',
          },
          {
            titre: 'Ajouter les questions retenues',
            texte: 'Le bouton **Ajouter au projet** reprend une idée telle quelle. Pour écrire vos propres questions, ouvrez la fiche du projet, onglet **Questions** : une question par ligne, comme un client la poserait à une IA. Ajouter une question ne coûte rien ; la dépense commence au prochain relevé.',
            capture: 'projet-questions',
          },
          {
            titre: 'Archiver ce qui ne sert plus',
            texte: 'Dans **Questions**, cochez les questions devenues inutiles, puis **Archiver les questions cochées**. Elles ne sont plus relevées et ne comptent plus dans les chiffres ; leur historique reste, et elles se reprennent à tout moment. Une question déjà relevée ne se modifie pas : pour la reformuler, archivez-la et écrivez-en une nouvelle.',
          },
          {
            titre: 'Vérifier l’équilibre de la liste',
            texte: 'Ouvrez **Filtrer et grouper** au-dessus du tableau. Les filtres **Intention** (s’informer, comparer, acheter), **Thème** et **Nom de la marque** montrent comment la liste se répartit. Une liste faite seulement de questions « acheter », ou de questions qui contiennent déjà le mot Facturo, ne dira pas grand-chose de votre place chez les clients qui ne vous connaissent pas encore.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Quelles questions garder, lesquelles ajouter, lesquelles archiver. Et donc sur quelle base se calculeront la visibilité, la part de voix et la liste de travail des semaines suivantes.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'L’outil n’affiche aucun volume de recherche : aucune IA ne publie ce qu’on lui demande, et les « autres questions posées » de Google sont de vraies questions sans fréquence connue. Changer la liste change aussi la base des chiffres : pour comparer deux périodes, comparez des périodes où la liste est la même, ou lisez les questions une à une.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'projet/questions' },
          { page: 'mesurer/questions' },
          { page: 'comprendre/google' },
          { page: 'cas/questions-avec-ou-sans-marque' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'You wrote a first list of prompts when you created the Facturo UK project. A few runs later, a doubt sets in: do these prompts sound like what your customers really ask AI assistants, or like what you would like them to ask? Every number in the tool rests on this list. It deserves a second look.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'A project with its prompts, and at least two or three runs. Before that, every prompt carries the verdict “too early to tell”.',
          'A run that includes Google AI Overviews: it brings back the “People also ask” questions.',
          'Readings from ChatGPT or Claude, to see the searches the AI runs on its own before answering.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Read the verdicts, prompt by prompt',
            texte: 'Open **Prompts**. Each row shows the latest state on each AI, then the **Verdict** over the period (solid, occasional, absent) and the brand **Named first**. A prompt where Facturo is absent is not a bad prompt: it is often the one to win. Look at who is named first instead: if it is never an invoicing tool, the prompt may not mean what you think.',
            capture: 'questions',
          },
          {
            titre: 'See what people actually ask',
            texte: 'Open **AI Overviews & Google**, block **Prompt ideas to track**. It lists the “People also ask” questions Google shows under your prompts, and the searches ChatGPT or Claude typed before answering, most frequent first. These are real wordings, not yours.',
            capture: 'google',
          },
          {
            titre: 'Add the prompts you keep',
            texte: 'The **Add to the project** button takes an idea as it is. To write your own prompts, open the project page, tab **Prompts**: one prompt per line, the way a customer would ask an AI. Adding a prompt is free; spending starts at the next run.',
            capture: 'projet-questions',
          },
          {
            titre: 'Archive what no longer helps',
            texte: 'In **Prompts**, tick the prompts that no longer matter, then **Archive the selected prompts**. They are no longer captured and no longer count in the numbers; their history stays, and they can be resumed at any time. A prompt that already has readings cannot be edited: to reword it, archive it and write a new one.',
          },
          {
            titre: 'Check the balance of the list',
            texte: 'Open **Filter and group** above the table. The **Intent** (learn, compare, buy), **Topic** and **Brand name** filters show how the list is spread. A list made only of “buy” prompts, or of prompts that already contain the word Facturo, says little about your place with customers who do not know you yet.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Which prompts to keep, which to add, which to archive. And therefore what visibility, share of voice and the work list will be computed on in the weeks that follow.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'The tool shows no search volume: no AI engine publishes what it is asked, and Google’s “People also ask” questions are real questions with no known frequency. Changing the list also changes the base of the numbers: to compare two periods, compare periods with the same list, or read the prompts one by one.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'projet/questions' },
          { page: 'mesurer/questions' },
          { page: 'comprendre/google' },
          { page: 'cas/questions-avec-ou-sans-marque' },
        ],
      },
    ],
  },
}

export default page
