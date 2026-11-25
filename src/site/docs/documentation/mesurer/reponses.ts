import type { PageDoc } from '../../types'

// Écran /reponses (src/app/(app)/reponses/page.tsx) et la liste de réponses
// commune (src/components/outil/ListeReponses.tsx) : filtres passés dans
// l'adresse par les autres écrans, panneau de lecture d'une réponse.
const page: PageDoc = {
  id: 'mesurer/reponses',
  rubrique: 'mesurer',
  slug: { fr: 'mesurer/reponses', en: 'measure/answers' },
  titre: { fr: 'Toutes les réponses', en: 'All answers' },
  resume: {
    fr: 'La preuve derrière chaque chiffre : les réponses relevées, filtrées par IA, par présence de la marque, par marque nommée ou site cité, chacune lisible en entier.',
    en: 'The evidence behind every number: the list of recorded answers, filtered by AI, by brand presence, by brand mentioned or by site cited, each readable in full.',
  },
  ecrans: ['/reponses'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Un chiffre n’est utile que si l’on peut voir ce qu’il compte. L’écran Réponses liste les réponses relevées qui se cachent derrière un chiffre : celles de ChatGPT, celles qui nomment Comptalis, celles qui citent un site, celles où Facturo est absente. Un clic ouvre la réponse entière, sans quitter la liste.' },
      { type: 'p', texte: 'L’écran n’a pas d’entrée propre dans le menu : on y arrive depuis un chiffre. Le nombre souligné de la phrase du haut, sur la vue d’ensemble, ouvre les réponses avec la marque ; **Toutes les réponses**, sous les dernières réponses, ouvre la liste complète. Un clic sur une marque dans un classement, sur une IA dans un tableau ou sur un site dans l’écran Sources ouvre la liste déjà filtrée. La recherche rapide (⌘K ou Ctrl K) y mène aussi, par le nom d’une marque.' },
      { type: 'capture', nom: 'reponses', legende: 'L’écran Réponses du projet Facturo : une ligne par réponse, avec l’IA, les marques nommées et la présence de la marque ; à droite, une réponse ouverte en entier.' },
      { type: 'h2', id: 'filtres', texte: 'Ce que la liste montre' },
      { type: 'p', texte: 'Le titre dit la sélection : « Toutes les réponses », ou par exemple « Réponses ChatGPT, avec Facturo ». La phrase dessous compte les réponses reçues où la marque apparaît. Au-dessus de la liste, deux choix se combinent avec le filtre venu de l’écran d’origine :' },
      {
        type: 'liste',
        items: [
          '**Présence** : Toutes, **Avec Facturo**, **Sans Facturo**. « Sans » ne garde que les réponses reçues : une question sans Aperçu IA n’est pas une absence.',
          '**IA** : Toutes, ou une IA. Claude, mesuré par son API, est une IA parmi les autres dans ce choix, avec son tampon API dans la liste.',
        ],
      },
      { type: 'p', texte: 'D’autres filtres n’arrivent que par un lien d’un autre écran, et s’ajoutent au titre : les réponses **qui nomment** une marque, **qui citent** un site ou une page, **mesurées par l’interface** ou **par l’API**, ou les réponses **à la question** choisie. **Tout afficher** les retire tous. La période et les IA de la barre du haut s’appliquent aussi.' },
      {
        type: 'tableau',
        colonnes: ['Colonne', 'Ce qu’elle montre'],
        lignes: [
          ['**Question et début de la réponse**', 'Le texte de la question, puis les premiers mots de la réponse, tels que l’IA les a écrits. Pour une réponse vide, en attente ou en échec, la raison.'],
          ['**IA**', 'Le nom de l’IA et sa méthode, interface ou API.'],
          ['**Marques nommées**', 'Les quatre premières marques nommées, dans l’ordre, puis « et n de plus ». « pas encore lues » tant que la lecture n’est pas faite.'],
          ['**Notre présence**', 'L’état de la marque dans cette réponse : Citée, Nommée (avec son rang), Lue, Absente, Pas d’aperçu, En attente, Échec.'],
          ['**Sources**', 'Le nombre de sources citées.'],
          ['**Date**', 'Le jour du relevé.'],
        ],
      },
      { type: 'p', texte: 'Les colonnes se trient d’un clic. Au-delà de huit réponses, un champ cherche dans les questions, le texte des réponses et les marques. Les 200 réponses les plus récentes sont affichées ; au-delà, une ligne le dit, et un filtre réduit la liste.' },
      { type: 'h2', id: 'ouvrir', texte: 'Lire une réponse' },
      { type: 'p', texte: 'Un clic sur une ligne ouvre un panneau à droite : la question, l’IA et le jour, la méthode, l’état, l’heure du relevé et le modèle. Puis le texte entier, avec la marque surlignée, les concurrents suivis soulignés et les sources numérotées, et dessous les **Marques nommées, dans l’ordre** et les **Sources citées**. **Ouvrir la question** mène à la page de la question, sur cette IA et ce jour, pour tout le reste : les pages lues, les recherches de l’IA, l’historique.' },
      { type: 'encadre', ton: 'savoir', titre: 'Les mesures approfondies', texte: 'Comme les chiffres d’ensemble, la liste ne compte pas les relevés d’une mesure approfondie : une question posée vingt-cinq fois la noierait. Ils y apparaissent quand la liste est filtrée sur leur question.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Vérifier ce que dit un chiffre' },
      {
        type: 'etapes',
        items: [
          { titre: 'Partir du chiffre', texte: 'Sur la vue d’ensemble, la ligne Gemini du tableau **Présence, IA par IA** affiche une visibilité basse : cliquez sur Gemini.' },
          { titre: 'Garder les absences', texte: 'Choisissez **Présence › Sans Facturo** : il ne reste que les réponses de Gemini où la marque manque.' },
          { titre: 'Lire les marques nommées', texte: 'La colonne **Marques nommées** montre qui revient à sa place. Triez par question pour voir les sujets.' },
          { titre: 'Ouvrir une réponse', texte: 'Un clic affiche le texte entier et ses sources. **Ouvrir la question** pour aller plus loin.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Sans filtre de méthode, la phrase du haut compte ensemble les réponses d’interface et celles de Claude par son API ; pour un compte d’une seule méthode, choisissez une IA ou partez d’un chiffre de la vue d’ensemble, qui filtre sur la méthode. Les réponses sont montrées telles que relevées, jamais traduites. Les marques nommées viennent de la lecture par un petit modèle, sauf pour ChatGPT.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/fiche-question' },
          { page: 'mesurer/vue-d-ensemble' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/chatgpt-cite-t-il-ma-marque' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'A number is only useful if you can see what it counts. The Answers screen lists the recorded answers behind a number: ChatGPT’s, those that mention Comptalis, those that cite a site, those where Facturo is absent. A click opens the full answer, without leaving the list.' },
      { type: 'p', texte: 'The screen has no menu entry of its own: you reach it from a number. The underlined number of the overview’s headline opens the answers with the brand; **All answers**, under the latest answers, opens the full list. Clicking a brand in a ranking, an AI in a table or a site on the Sources screen opens the list already filtered. Quick search (⌘K or Ctrl K) leads there too, through a brand name.' },
      { type: 'capture', nom: 'reponses', legende: 'The Answers screen of the Facturo UK project: one row per answer, with the AI, the brands mentioned and the brand’s presence; on the right, an answer opened in full.' },
      { type: 'h2', id: 'filters', texte: 'What the list shows' },
      { type: 'p', texte: 'The title states the selection: “All answers”, or for example “Answers ChatGPT, with Facturo”. The sentence below counts the received answers where the brand appears. Above the list, two choices combine with the filter that came from the original screen:' },
      {
        type: 'liste',
        items: [
          '**Presence**: All, **With Facturo**, **Without Facturo**. “Without” keeps only the received answers: a prompt without an AI Overview is not an absence.',
          '**AI**: All, or one AI. Claude, measured through its API, is one AI among the others in this choice, with its API stamp in the list.',
        ],
      },
      { type: 'p', texte: 'Other filters only come through a link from another screen, and are added to the title: answers **mentioning** a brand, **citing** a site or a page, **measured through the interface** or **through the API**, or the answers **to the prompt** chosen. **Show all** clears them all. The period and AIs of the top bar apply too.' },
      {
        type: 'tableau',
        colonnes: ['Column', 'What it shows'],
        lignes: [
          ['**Prompt and start of the answer**', 'The prompt’s text, then the first words of the answer, as the AI wrote them. For an empty, pending or failed answer, the reason.'],
          ['**AI**', 'The AI’s name and its method, interface or API.'],
          ['**Brands mentioned**', 'The first four brands mentioned, in order, then “and n more”. “not read yet” until reading is done.'],
          ['**Our presence**', 'The brand’s status in this answer: Cited, Mentioned (with its position), Read, Absent, No overview, Pending, Failed.'],
          ['**Sources**', 'The number of cited sources.'],
          ['**Date**', 'The day of the reading.'],
        ],
      },
      { type: 'p', texte: 'Columns sort with a click. Beyond eight answers, a field searches prompts, answer text and brands. The 200 most recent answers are shown; beyond that, a line says so, and a filter narrows the list.' },
      { type: 'h2', id: 'open', texte: 'Reading an answer' },
      { type: 'p', texte: 'Clicking a row opens a panel on the right: the prompt, the AI and the day, the method, the status, the time of the reading and the model. Then the full text, with the brand highlighted, tracked competitors underlined and sources numbered, and below the **Brands mentioned, in order** and **Cited sources**. **Open the prompt** leads to the prompt’s page, on this AI and this day, for everything else: pages read, the AI’s searches, the history.' },
      { type: 'encadre', ton: 'savoir', titre: 'Deep measurements', texte: 'Like the overall numbers, the list leaves out the readings of a deep measurement: a prompt asked twenty-five times would drown it. They show up when the list is filtered on their prompt.' },
      { type: 'h2', id: 'step-by-step', texte: 'Checking what a number says' },
      {
        type: 'etapes',
        items: [
          { titre: 'Start from the number', texte: 'On the overview, the Gemini row of the **Presence, AI by AI** table shows a low visibility: click Gemini.' },
          { titre: 'Keep the absences', texte: 'Choose **Presence › Without Facturo**: only Gemini’s answers where the brand is missing remain.' },
          { titre: 'Read the brands mentioned', texte: 'The **Brands mentioned** column shows who keeps taking its place. Sort by prompt to see the topics.' },
          { titre: 'Open an answer', texte: 'A click shows the full text and its sources. **Open the prompt** to go further.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'Without a method filter, the headline sentence counts interface answers and Claude’s API answers together; for a single-method count, pick an AI or start from an overview number, which filters on the method. Answers are shown as recorded, never translated. The brands mentioned come from a small model’s reading, except for ChatGPT.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/fiche-question' },
          { page: 'mesurer/vue-d-ensemble' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/chatgpt-cite-t-il-ma-marque' },
        ],
      },
    ],
  },
}

export default page
