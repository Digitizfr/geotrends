import type { PageDoc } from '../../types'

// Onglet « Questions » de /projets/[id] (AjoutQuestions dans Ajouts.tsx,
// archiverQuestion et ajouterQuestions dans src/app/(app)/projets/actions.ts,
// idées tirées de classerIdees dans src/lib/classements.ts).
const page: PageDoc = {
  id: 'projet/questions',
  rubrique: 'projet',
  slug: { fr: 'projet/questions', en: 'project/prompts' },
  titre: { fr: 'Écrire les questions à suivre', en: 'Write the prompts to track' },
  resume: {
    fr: 'Les questions sont ce que vos clients demandent aux IA, et tout ce que mesure l’outil en dépend. Comment les écrire, les ajouter, les archiver, trouver des idées.',
    en: 'Prompts are what your customers ask the AIs: everything the tool measures depends on them. How to write them, add them, archive them, and where to find ideas.',
  },
  ecrans: ['/projets/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Une question est ce qu’un client potentiel demande à une IA, avec ses mots. Chaque relevé pose toutes les questions du projet à chaque IA choisie : ce sont elles qui décident de ce que vous mesurez, et de ce que coûte un relevé. Mieux vaut dix questions bien choisies que cinquante écrites à la hâte.' },
      { type: 'p', texte: 'Pour y aller : l’onglet **Questions** de la fiche du projet. Le bouton **Ajouter des questions** de l’écran Questions et le bouton **Écrire mes questions** des écrans vides y mènent aussi. Une question se suit encore depuis l’écran Aperçus IA et Google, avec **Ajouter au projet**.' },
      { type: 'capture', nom: 'projet-questions', legende: 'L’onglet Questions du projet Facturo : les questions suivies avec leur verdict, le champ d’ajout, et les idées vues chez Google.' },
      { type: 'h2', id: 'bien-ecrire', texte: 'Écrire de bonnes questions' },
      {
        type: 'liste',
        items: [
          '**Comme un client la poserait**, en phrase complète, dans la langue du projet : « Quel logiciel de facturation choisir pour un auto-entrepreneur ? » plutôt que « logiciel facturation auto-entrepreneur ».',
          '**Surtout sans le nom de la marque.** Ces questions-là disent si l’IA pense à Facturo quand on ne lui parle pas de Facturo : ce sont elles qui amènent de nouveaux clients.',
          '**Quelques-unes avec le nom**, pour savoir ce que l’IA dit de la marque : « Facturo convient-il à une TPE ? ». L’outil les repère tout seul, dès que le texte contient le nom de la marque.',
          '**Une idée par question.** Deux sujets dans la même phrase donnent une réponse qui ne mesure ni l’un ni l’autre.',
          '**Les trois intentions** : s’informer (« comment faire une facture conforme ? »), comparer (« Comptalis ou Devizo pour un freelance ? »), acheter (« logiciel de facturation pas cher avec relances automatiques »).',
          '**Des questions stables.** Une question reformulée est une nouvelle question : sa courbe repart de zéro.',
        ],
      },
      {
        type: 'tableau',
        colonnes: ['Question', 'Ce qu’elle mesure'],
        lignes: [
          ['« Quel logiciel de facturation choisir pour un indépendant ? »', 'Sans le nom de la marque, intention comparer : l’IA pense-t-elle à Facturo, et qui cite-t-elle à sa place ?'],
          ['« Comment relancer un client qui ne paie pas ? »', 'Sans le nom, intention s’informer : vos pages d’aide servent-elles de source ?'],
          ['« Facturo est-il gratuit ? »', 'Avec le nom : ce que l’IA affirme sur la marque, à comparer aux faits vérifiés.'],
        ],
      },
      { type: 'h2', id: 'questions-suivies', texte: 'Les questions suivies' },
      { type: 'p', texte: 'Le bloc **Questions suivies** liste les questions du projet. Pour chacune : son texte (un clic ouvre sa page), son **Verdict (interface)** avec le compte des réponses où la marque apparaît et un trait par relevé, puis le nombre de **Relevés**. Au-delà de six questions, un champ permet de chercher dans la liste.' },
      { type: 'p', texte: 'Le verdict suit la règle de l’écran Questions : « solide » à partir de 6 réponses d’interface sur 10, « occasionnelle » en dessous, « absente » à zéro, « trop tôt pour dire » avec moins de 3 réponses. Voir [L’écran Questions](doc:mesurer/questions).' },
      { type: 'h2', id: 'ajouter', texte: 'Ajouter, retirer, archiver' },
      {
        type: 'liste',
        items: [
          '**Ajouter** : une question par ligne dans **Ajouter des questions**. Le bouton dit combien seront ajoutées, et la ligne voisine ce que chaque relevé d’interface coûtera de plus (4 IA × 0,0012 $ par question). Ajouter ne coûte rien : la dépense commence au prochain relevé. Une question déjà présente n’est pas ajoutée deux fois.',
          '**Retirer** : une question jamais relevée se retire tout simplement, elle n’a pas d’historique.',
          '**Archiver** : une question déjà relevée ne se modifie plus et ne s’efface pas. Archivée, elle n’est plus relevée et ne compte plus dans les chiffres ; son historique reste. Une fenêtre demande de confirmer.',
          '**Reprendre** : le bloc **Questions archivées** liste les questions archivées, avec un bouton pour les remettre dans le suivi.',
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Étiquettes des nouvelles questions', texte: 'Si l’étiquetage automatique est en place sur l’écran Questions, une question ajoutée reçoit toute seule un thème et une intention, pour environ 0,00008 $. La ligne sous le champ d’ajout le rappelle. Cela se coupe sur l’écran Questions. Voir [Thèmes et carte des thèmes](doc:comprendre/themes).' },
      { type: 'h2', id: 'idees', texte: 'Les idées de questions' },
      { type: 'p', texte: 'Le bloc **Idées de questions** (vues chez Google) reprend les « autres questions posées » que Google affiche sous vos questions, relevées avec les Aperçus IA. Ce sont de vraies questions d’internautes. Chaque idée dit combien de fois elle a été vue ; **Suivre** l’ajoute au projet, gratuitement, et chaque relevé d’interface coûtera ensuite 0,0048 $ de plus. Les questions déjà suivies ne sont pas reproposées. **Toutes les idées, et les recherches des IA** ouvre la liste complète sur l’écran Aperçus IA et Google, avec les recherches que ChatGPT et Claude lancent avant de répondre.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Constituer la liste de Facturo' },
      {
        type: 'etapes',
        items: [
          { titre: 'Écrire dix questions', texte: 'Sept sans le nom de la marque, trois avec. Partez des questions que les clients posent au support ou en rendez-vous.' },
          { titre: 'Les ajouter', texte: 'Collez-les dans **Ajouter des questions**, une par ligne, puis cliquez sur **Ajouter 10 questions**.' },
          { titre: 'Lancer un premier relevé', texte: 'Onglet **Relevés** : le prix s’affiche avant l’envoi. Voir [Lancer un relevé](doc:projet/lancer-un-releve).' },
          { titre: 'Compléter avec les idées', texte: 'Après le relevé, lisez **Idées de questions** et suivez celles qui ressemblent à vos clients.' },
          { titre: 'Archiver ce qui ne sert pas', texte: 'Une question qui ne dit rien d’utile au bout de quelques relevés s’archive : elle coûte à chaque relevé.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'L’outil ne dit pas combien de personnes posent une question : aucune IA ne publie ce qu’on lui demande. Le texte d’une question ne se corrige pas une fois relevé : on archive et on en écrit une autre. « Avec ou sans le nom de la marque » se déduit du seul texte de la question, par une recherche du nom. Les idées de Google n’apparaissent qu’après un relevé des Aperçus IA.' },
      {
        type: 'liens',
        items: [
          { page: 'cas/suivre-les-bonnes-questions' },
          { page: 'cas/questions-avec-ou-sans-marque' },
          { page: 'mesurer/questions' },
          { page: 'comprendre/google' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'A prompt is what a potential customer asks an AI, in their own words. Each run asks every prompt of the project to each AI chosen: prompts decide what you measure, and what a run costs. Ten well-chosen prompts are worth more than fifty written in a hurry.' },
      { type: 'p', texte: 'To get there: the **Prompts** tab of the project page. The **Add prompts** button of the Prompts screen and the **Write my prompts** button of empty screens lead there too. A prompt can also be tracked from the AI Overviews & Google screen, with **Add to the project**.' },
      { type: 'capture', nom: 'projet-questions', legende: 'The Prompts tab of the Facturo UK project: tracked prompts with their verdict, the add field, and the ideas seen on Google.' },
      { type: 'h2', id: 'writing-well', texte: 'Writing good prompts' },
      {
        type: 'liste',
        items: [
          '**The way a customer would ask**, as a full sentence, in the project’s language: “Which invoicing software should a sole trader choose?” rather than “invoicing software sole trader”.',
          '**Mostly without the brand name.** These prompts tell you whether the AI thinks of Facturo when nobody mentions Facturo: they are the ones that bring new customers.',
          '**A few with the name**, to learn what the AI says about the brand: “Is Facturo suitable for a small business?”. The tool spots them on its own, as soon as the text contains the brand name.',
          '**One idea per prompt.** Two topics in the same sentence give an answer that measures neither.',
          '**The three intents**: learn (“how do I issue a compliant invoice?”), compare (“Comptalis or Devizo for a freelancer?”), buy (“cheap invoicing software with automatic reminders”).',
          '**Stable prompts.** A reworded prompt is a new prompt: its line starts again from zero.',
        ],
      },
      {
        type: 'tableau',
        colonnes: ['Prompt', 'What it measures'],
        lignes: [
          ['“Which invoicing software should a freelancer choose?”', 'Without the brand name, compare intent: does the AI think of Facturo, and whom does it cite instead?'],
          ['“How do I chase a client who doesn’t pay?”', 'Without the name, learn intent: are your help pages used as sources?'],
          ['“Is Facturo free?”', 'With the name: what the AI claims about the brand, to compare with the fact checks.'],
        ],
      },
      { type: 'h2', id: 'tracked-prompts', texte: 'Tracked prompts' },
      { type: 'p', texte: 'The **Tracked prompts** block lists the project’s prompts. For each one: its text (a click opens its page), its **Verdict (interface)** with the count of answers where the brand appears and one mark per reading, then the number of **Runs**. Beyond six prompts, a field lets you search the list.' },
      { type: 'p', texte: 'The verdict follows the Prompts screen’s rule: “solid” from 6 interface answers out of 10, “occasional” below, “absent” at zero, “too early to tell” with fewer than 3 answers. See [The Prompts screen](doc:mesurer/questions).' },
      { type: 'h2', id: 'add', texte: 'Adding, removing, archiving' },
      {
        type: 'liste',
        items: [
          '**Add**: one prompt per line in **Add prompts**. The button says how many will be added, and the line next to it how much more each interface run will cost (4 AIs × $0.0012 per prompt). Adding is free: spending starts at the next run. A prompt already in the list is not added twice.',
          '**Remove**: a prompt that has never been run is simply removed, it has no history.',
          '**Archive**: a prompt already run can no longer be edited or deleted. Once archived, it is no longer run and no longer counts in the numbers; its history stays. A window asks you to confirm.',
          '**Resume**: the **Archived prompts** block lists archived prompts, with a button to put them back into tracking.',
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Tags for new prompts', texte: 'If automatic tagging is on in the Prompts screen, an added prompt gets a topic and an intent on its own, for about $0.00008. The line under the add field says so. It can be turned off in the Prompts screen. See [Topics and the topic map](doc:comprendre/themes).' },
      { type: 'h2', id: 'ideas', texte: 'Prompt ideas' },
      { type: 'p', texte: 'The **Prompt ideas** block (seen on Google) shows the “people also ask” questions Google displays under your prompts, recorded with the AI Overviews. They are real questions from users. Each idea says how many times it was seen; **Track** adds it to the project, for free, and each interface run will then cost $0.0048 more. Prompts already tracked are not suggested again. **All ideas, and the AI searches** opens the full list on the AI Overviews & Google screen, with the searches ChatGPT and Claude run before answering.' },
      { type: 'h2', id: 'step-by-step', texte: 'Building Facturo’s list' },
      {
        type: 'etapes',
        items: [
          { titre: 'Write ten prompts', texte: 'Seven without the brand name, three with it. Start from the questions customers ask support or in meetings.' },
          { titre: 'Add them', texte: 'Paste them into **Add prompts**, one per line, then click **Add 10 prompts**.' },
          { titre: 'Start a first run', texte: '**Runs** tab: the price is shown before sending. See [Start a run](doc:projet/lancer-un-releve).' },
          { titre: 'Complete with the ideas', texte: 'After the run, read **Prompt ideas** and track the ones that sound like your customers.' },
          { titre: 'Archive what does not help', texte: 'A prompt that tells nothing useful after a few runs should be archived: it costs money on every run.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'The tool does not say how many people ask a prompt: no AI publishes what it is asked. The text of a prompt cannot be corrected once it has been run: archive it and write another. “With or without the brand name” is deduced from the prompt’s text alone, by searching for the name. Google ideas only appear after an AI Overviews run.' },
      {
        type: 'liens',
        items: [
          { page: 'cas/suivre-les-bonnes-questions' },
          { page: 'cas/questions-avec-ou-sans-marque' },
          { page: 'mesurer/questions' },
          { page: 'comprendre/google' },
        ],
      },
    ],
  },
}

export default page
