import type { PageDoc } from '../../types'

// Écran /google (src/app/(app)/google/page.tsx), diagnostics et idées dans
// src/lib/classements.ts (classerApercus, DIAGNOSTICS, classerIdees).
const page: PageDoc = {
  id: 'comprendre/google',
  rubrique: 'comprendre',
  slug: { fr: 'comprendre/google', en: 'understand/google' },
  titre: { fr: 'Aperçus IA et résultats de Google', en: 'AI Overviews and Google results' },
  resume: {
    fr: 'Les Aperçus IA de Google face aux dix premiers résultats de la recherche : une consigne par question, la part des sources classées, des idées de questions.',
    en: 'Google AI Overviews against the top ten results of the same search: one instruction per prompt, the share of ranked sources, and ideas for new prompts.',
  },
  ecrans: ['/google'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Quand Google affiche un Aperçu IA, il le pose au-dessus de ses résultats classiques. Le relevé d’un Aperçu IA garde les deux : le texte de l’aperçu avec ses sources, et les dix premiers résultats de la même recherche. L’écran les compare pour répondre à une question : si la marque manque à l’aperçu, est-ce un problème de référencement classique, ou un problème de page ?' },
      { type: 'p', texte: 'On y arrive aussi par la tuile **Aperçus IA** de la vue d’ensemble. Le bloc des idées de questions, en bas, est ouvert par **Voir des idées de questions** sur l’écran Questions et par **Toutes les idées, et les recherches des IA** dans la fiche du projet.' },
      { type: 'capture', nom: 'google', legende: 'L’écran Aperçus IA et Google du projet Facturo : les chiffres clés, le tableau « Que faire, question par question » et la part des sources qui viennent des dix premiers résultats.' },
      { type: 'encadre', ton: 'savoir', titre: 'Une question sans aperçu n’est pas une absence', texte: 'Google n’affiche pas d’Aperçu IA sur toutes les recherches. Une question pour laquelle il n’y en a pas revient « Pas d’aperçu » : elle n’est jamais comptée comme une absence de la marque, et le tableau la range à part.' },
      { type: 'h2', id: 'chiffres-cles', texte: 'Les chiffres clés' },
      {
        type: 'tableau',
        colonnes: ['Tuile', 'Ce qu’elle compte'],
        lignes: [
          ['**Aperçus IA affichés**', 'Nombre de questions pour lesquelles Google affiche un Aperçu IA, sur les questions relevées.'],
          ['**Aperçus qui nous citent**', 'Nombre de questions dont l’Aperçu IA cite une page ou une vidéo de la marque, sur celles qui ont un aperçu.'],
          ['**Sources dans le top 10**', 'Parmi les sources citées par les Aperçus IA, celles qui figurent aussi dans les dix premiers résultats de Google, avec leur part.'],
          ['**Nos pages dans le top 10**', 'Nombre de questions pour lesquelles une page de la marque est dans les dix premiers résultats de Google.'],
        ],
      },
      { type: 'p', texte: 'Tout est mesuré par l’interface, sur les relevés des Aperçus IA de la période ; chaque tuile dit sur combien de relevés elle repose.' },
      { type: 'h2', id: 'que-faire', texte: 'Que faire, question par question' },
      { type: 'p', texte: 'Deux questions suffisent : la marque est-elle dans les dix premiers résultats de Google, et l’Aperçu la cite-t-il ? Le croisement donne quatre cases, chacune avec le nombre de questions et sa consigne. Un clic sur une case filtre le tableau du dessous. Sous le tableau, une ligne compte les questions sans Aperçu IA.' },
      {
        type: 'tableau',
        colonnes: ['', 'Cités dans l’Aperçu', 'Pas cités'],
        lignes: [
          ['**Dans les 10 premiers**', '**Tenu, à surveiller**', '**Page à reformuler** : la page est trouvée, il lui manque une réponse nette.'],
          ['**Hors des 10 premiers**', '**Rare, à comprendre** : cité sans être bien classé.', '**D’abord du référencement classique**'],
        ],
      },
      { type: 'p', texte: 'Le bloc **Les sources des Aperçus viennent-elles des 10 premiers ?** découpe toutes les sources des aperçus en deux : dans les dix premiers de Google, ou hors des dix premiers. Si la majorité vient des dix premiers, l’écran conclut que le référencement classique reste la porte d’entrée ; sinon, qu’être bien classé ne suffit pas.' },
      { type: 'h2', id: 'tableau', texte: 'Le tableau, question par question' },
      {
        type: 'tableau',
        colonnes: ['Colonne', 'Ce qu’elle montre'],
        lignes: [
          ['**Aperçu IA**', '« Affiché » dans tant de relevés sur tant, « Pas d’aperçu », ou « pas relevé ».'],
          ['**Nous dans l’Aperçu**', '« Cités » (avec le compte s’il y a plusieurs relevés) ou « Pas cités ».'],
          ['**Notre position chez Google**', 'Le rang de la page de la marque dans les résultats classiques, avec son adresse, ou « hors des 10 premiers ».'],
          ['**Sources dans les 10 premiers**', 'Combien des sources de l’aperçu sont aussi dans les dix premiers résultats.'],
          ['**Vidéo**', 'L’aperçu cite-t-il une vidéo ?'],
          ['**Diagnostic**', 'La consigne pour cette question, tirée du dernier relevé de l’aperçu (voir ci-dessous).'],
        ],
      },
      {
        type: 'tableau',
        colonnes: ['Diagnostic', 'Quand'],
        lignes: [
          ['**Tenu, à surveiller**', 'Dans les 10 premiers et cité par l’Aperçu.'],
          ['**Page à reformuler**', 'Dans les 10 premiers, mais pas cité : la page est trouvée, il lui manque une réponse nette.'],
          ['**Rare, à comprendre**', 'Cité par l’Aperçu sans être dans les 10 premiers.'],
          ['**D’abord du référencement classique**', 'Ni dans les 10 premiers, ni cité.'],
          ['**Pas d’Aperçu : à ne pas travailler pour Google**', 'Google n’affiche pas d’Aperçu IA sur cette question.'],
          ['**Pas encore relevé**', 'Les Aperçus IA n’ont pas été relevés pour cette question.'],
        ],
      },
      { type: 'h2', id: 'idees', texte: 'Idées de questions à suivre' },
      { type: 'p', texte: 'Le dernier bloc propose des questions que vous ne suivez pas encore, tirées des relevés. Deux listes, au choix :' },
      {
        type: 'liste',
        items: [
          '**Autres questions posées** : les questions que Google affiche sous vos questions. Ce sont de vraies questions d’internautes. La colonne **Sous la question** dit sous laquelle des vôtres elle est apparue.',
          '**Recherches des IA** : ce que l’IA tape elle-même dans un moteur de recherche avant de répondre. C’est connu pour ChatGPT et Claude. Ce sont des sujets pour lesquels écrire.',
        ],
      },
      { type: 'p', texte: 'La colonne **Vue** compte combien de fois l’idée est revenue. **Ajouter au projet** en fait une question suivie : c’est gratuit, et chaque relevé suivant coûtera un peu plus (le prix par question est écrit dans la bulle d’aide). Les questions déjà suivies ou archivées ne sont pas reproposées.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Lire l’écran en quatre étapes' },
      {
        type: 'etapes',
        items: [
          { titre: 'Relever les Aperçus IA', texte: 'Au moment de lancer un relevé, laissez cochée la ligne **Aperçus IA de Google**. Le relevé des aperçus rapporte aussi les dix premiers résultats.' },
          { titre: 'Commencer par « Page à reformuler »', texte: 'Ce sont les questions où votre page est déjà bien classée sans être reprise. Chacune devient une ligne de la liste de travail, avec le rang de la page ; l’audit de la page dit si quelque chose bloque sa lecture.' },
          { titre: 'Traiter « D’abord du référencement classique »', texte: 'Tant que la page n’est pas mieux classée, l’aperçu a peu de chances de la reprendre. La liste de travail propose une ligne « Travailler le référencement » pour chacune.' },
          { titre: 'Suivre les bonnes questions', texte: 'Parcourez les **Autres questions posées** et ajoutez au projet celles que vos clients posent vraiment.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Le diagnostic d’une question vient de son dernier relevé d’aperçu : une seule page de résultats, à une date. Google n’affiche pas toujours un aperçu sur la même recherche d’un jour à l’autre. Les dix premiers résultats sont ceux de cette page, depuis le pays et dans la langue du projet. Être bien classé ou bien écrit ne garantit pas d’être cité : l’écran dit où se situe le frein, pas comment obtenir la citation.' },
      {
        type: 'liens',
        items: [
          { page: 'agir/liste-de-travail' },
          { page: 'agir/audit' },
          { page: 'projet/questions' },
          { page: 'cas/suivre-les-bonnes-questions' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'When Google shows an AI Overview, it places it above its classic results. An AI Overview reading keeps both: the overview’s text with its sources, and the top ten results of the same search. The screen compares them to answer one question: if the brand is missing from the overview, is it a classic SEO problem, or a page problem?' },
      { type: 'p', texte: 'You also get there through the **AI Overviews** tile on the overview. The prompt ideas block, at the bottom, is opened by **See prompt ideas** on the Prompts screen and by **All ideas, and the AI searches** on the project page.' },
      { type: 'capture', nom: 'google', legende: 'The AI Overviews & Google screen of the Facturo UK project: the key figures, the “What to do, prompt by prompt” table and the share of sources coming from the top ten results.' },
      { type: 'encadre', ton: 'savoir', titre: 'A prompt without an overview is not an absence', texte: 'Google does not show an AI Overview on every search. A prompt with none comes back “No overview”: it is never counted as an absence of the brand, and the table files it separately.' },
      { type: 'h2', id: 'key-figures', texte: 'Key figures' },
      {
        type: 'tableau',
        colonnes: ['Tile', 'What it counts'],
        lignes: [
          ['**AI Overviews shown**', 'Number of prompts for which Google shows an AI Overview, out of the prompts recorded.'],
          ['**Overviews citing us**', 'Number of prompts whose AI Overview cites a page or a video of the brand, out of those with an overview.'],
          ['**Sources in the top 10**', 'Among the sources cited by AI Overviews, those that are also in Google’s top ten results, with their share.'],
          ['**Our pages in the top 10**', 'Number of prompts for which a page of the brand is in Google’s top ten results.'],
        ],
      },
      { type: 'p', texte: 'Everything is measured through the interface, on the AI Overview readings of the period; each tile says how many readings it rests on.' },
      { type: 'h2', id: 'what-to-do', texte: 'What to do, prompt by prompt' },
      { type: 'p', texte: 'Two questions are enough: is the brand in Google’s top ten results, and does the Overview cite it? Crossing them gives four cells, each with its number of prompts and its instruction. Clicking a cell filters the table below. Under the table, a line counts the prompts with no AI Overview.' },
      {
        type: 'tableau',
        colonnes: ['', 'Cited in the Overview', 'Not cited'],
        lignes: [
          ['**In the top 10**', '**Held, keep watching**', '**Page to rewrite**: the page is found, it lacks a clear answer.'],
          ['**Outside the top 10**', '**Rare, worth understanding**: cited without ranking well.', '**Classic SEO first**'],
        ],
      },
      { type: 'p', texte: 'The **Do Overview sources come from the top 10?** block splits all overview sources in two: in Google’s top ten, or outside it. If most come from the top ten, the screen concludes that classic SEO remains the way in; otherwise, that ranking well is not enough.' },
      { type: 'h2', id: 'table', texte: 'The table, prompt by prompt' },
      {
        type: 'tableau',
        colonnes: ['Column', 'What it shows'],
        lignes: [
          ['**AI Overview**', '“Shown” in so many readings out of so many, “No overview”, or “not captured”.'],
          ['**Us in the Overview**', '“Cited” (with the count when there are several readings) or “Not cited”.'],
          ['**Our position on Google**', 'The rank of the brand’s page in the classic results, with its address, or “outside the top 10”.'],
          ['**Sources in the top 10**', 'How many of the overview’s sources are also in the top ten results.'],
          ['**Video**', 'Does the overview cite a video?'],
          ['**Diagnosis**', 'The instruction for this prompt, drawn from the latest overview reading (see below).'],
        ],
      },
      {
        type: 'tableau',
        colonnes: ['Diagnosis', 'When'],
        lignes: [
          ['**Held, keep watching**', 'In the top 10 and cited by the Overview.'],
          ['**Page to rewrite**', 'In the top 10 but not cited: the page is found, it lacks a clear answer.'],
          ['**Rare, worth understanding**', 'Cited by the Overview without being in the top 10.'],
          ['**Classic SEO first**', 'Neither in the top 10 nor cited.'],
          ['**No Overview: not worth working on for Google**', 'Google shows no AI Overview on this prompt.'],
          ['**Not captured yet**', 'AI Overviews have not been captured for this prompt.'],
        ],
      },
      { type: 'h2', id: 'ideas', texte: 'Prompt ideas to track' },
      { type: 'p', texte: 'The last block suggests prompts you do not track yet, drawn from the runs. Two lists, to choose from:' },
      {
        type: 'liste',
        items: [
          '**People also ask**: the questions Google shows under your prompts. These are real questions from users. The **Under the prompt** column says under which of yours it appeared.',
          '**AI searches**: what the AI itself types into a search engine before answering. It is known for ChatGPT and Claude. These are topics worth writing for.',
        ],
      },
      { type: 'p', texte: 'The **Seen** column counts how many times the idea came back. **Add to the project** makes it a tracked prompt: it is free, and every later run will cost a little more (the price per prompt is in the help bubble). Prompts already tracked or archived are not suggested again.' },
      { type: 'h2', id: 'step-by-step', texte: 'Reading the screen in four steps' },
      {
        type: 'etapes',
        items: [
          { titre: 'Record the AI Overviews', texte: 'When you start a run, keep the **Google AI Overviews** row ticked. The overview reading also brings back the top ten results.' },
          { titre: 'Start with “Page to rewrite”', texte: 'These are the prompts where your page already ranks well without being reused. Each one becomes a line of the work list, with the page’s rank; the page audit tells you whether something blocks it from being read.' },
          { titre: 'Handle “Classic SEO first”', texte: 'As long as the page does not rank better, the overview has little chance of reusing it. The work list offers a “Work on SEO” line for each one.' },
          { titre: 'Track the right prompts', texte: 'Browse **People also ask** and add to the project the ones your customers really ask.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'A prompt’s diagnosis comes from its latest overview reading: one results page, on one date. Google does not always show an overview for the same search from one day to the next. The top ten results are those of that page, from the project’s country and in its language. Ranking well or writing well does not guarantee a citation: the screen shows where the obstacle is, not how to get cited.' },
      {
        type: 'liens',
        items: [
          { page: 'agir/liste-de-travail' },
          { page: 'agir/audit' },
          { page: 'projet/questions' },
          { page: 'cas/suivre-les-bonnes-questions' },
        ],
      },
    ],
  },
}

export default page
