import type { PageDoc } from '../../types'

// Écran /pages (src/app/(app)/pages), lecture de la page (lirePage, src/lib/audit.ts),
// propositions et bilan (src/lib/pages-suivies.ts).
const page: PageDoc = {
  id: 'mesurer/pages-suivies',
  rubrique: 'mesurer',
  slug: { fr: 'mesurer/pages-suivies', en: 'measure/tracked-pages' },
  titre: { fr: 'Pages suivies', en: 'Tracked pages' },
  resume: {
    fr: 'Partir d’une page de la marque : l’outil la lit, propose les questions auxquelles elle répond, puis dit si les IA la citent et ce qu’elles citent à sa place.',
    en: 'Start from a page of the brand: the tool reads it, suggests the prompts it answers, then tells you whether AIs cite it and what they cite instead.',
  },
  ecrans: ['/pages'],
  maj: '2026-11-20',
  contenu: {
    fr: [
      { type: 'p', texte: 'On pense souvent par page : un article sponsorisé, une page produit, un comparatif. L’outil, lui, part des questions : il les pose aux IA et note les pages qu’elles citent. L’écran **Pages suivies** (menu **Suivre**) fait le lien entre les deux. Vous collez l’adresse d’une page de la marque ; l’outil la lit, propose les questions qu’un internaute poserait et auxquelles elle répond, puis montre, IA par IA, si les réponses à ces questions la citent.' },
      { type: 'capture', nom: 'pages', legende: 'L’écran Pages suivies : coller l’adresse d’une page, la liste des pages suivies avec leur bilan, et les pages de la marque déjà citées, à suivre d’un clic.' },
      { type: 'h2', id: 'suivre', texte: 'Suivre une page' },
      {
        type: 'etapes',
        items: [
          { titre: 'Coller l’adresse', texte: 'Dans **Suivre une page**, l’adresse complète (https://…), puis **Lire la page et proposer des questions**. Autres chemins : **Partir d’une page** sur l’écran Questions, ou **Suivre** sur une page de l’onglet **Nos pages** de Sources.' },
          { titre: 'Relire les questions proposées', texte: 'L’outil lit la page comme un robot d’IA, sans JavaScript (gratuit). Un petit modèle propose jusqu’à six questions, la plupart sans le nom de la marque (moins d’un centime, inscrit au journal des coûts). Décochez celles qui ne conviennent pas, retouchez le texte, **Retirer** en supprime une, et le champ du dessous en **Ajoute** à la main.' },
          { titre: 'Suivre la page', texte: '**Suivre la page avec … questions** (gratuit). Les questions rejoignent le projet : elles comptent ensuite dans ses chiffres et ses relevés automatiques. Vous pouvez aussi **rattacher des questions déjà suivies**.' },
          { titre: 'Lancer le relevé', texte: 'Sur la fiche de la page, **Lancer un relevé pour ces questions**, au prix affiché (0,0012 $ par question et par IA d’interface). Les réponses arrivent en quelques minutes.' },
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Pourquoi des questions sans le nom de la marque', texte: 'Une question qui nomme la marque fait presque toujours citer son site. Ce qui compte, c’est de savoir si l’IA cite la page quand l’internaute ne la connaît pas encore : « Quelle application de contrôle parental choisir ? » plutôt que « Que vaut l’application X ? ».' },
      { type: 'h2', id: 'fiche', texte: 'La fiche d’une page' },
      { type: 'capture', nom: 'page-fiche', legende: 'La fiche d’une page suivie : IA par IA, les réponses qui la citent ; puis chaque question avec la dernière réponse de chaque IA, et ce qui est cité à sa place.' },
      {
        type: 'liste',
        items: [
          '**IA par IA** : « 3 sur 12 réponses qui citent la page », et en dessous la présence de la marque (nommée ou autre page citée). Claude, mesuré par son API, a sa tuile à part.',
          '**Ses questions** : une ligne par question, une colonne par IA, avec la dernière réponse : **Page citée**, **Marque, pas cette page**, **Lue, pas citée**, **Absente** ou **Sans réponse**. Un clic ouvre la réponse.',
          '**Retirer** détache une question de la page ; elle reste dans le projet. **Ajouter des questions à la main** (une par ligne) et **Proposer d’autres questions** complètent la liste.',
          '**Cité à sa place** : les pages citées dans les réponses qui ne citent pas la sienne. C’est là qu’il faut regarder pour comprendre ce que l’IA préfère.',
          '**Citée sur d’autres questions** : les réponses à d’autres questions du projet qui la citent aussi.',
          'En haut : **Auditer la page** (lisible par les robots des IA ?), **Partager** (une page privée pour un client, sur ces questions) et **Ne plus suivre** (ses questions restent dans le projet).',
        ],
      },
      { type: 'h2', id: 'chercher', texte: 'Retrouver une page' },
      { type: 'p', texte: 'La recherche rapide (⌘ K sur Mac, Ctrl K ailleurs) trouve aussi les pages : celles que vous suivez mènent à leur fiche, les autres pages citées à leur fiche dans Sources. Tapez un bout de l’adresse ou du titre.' },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Une page n’est mesurée que sur ses questions : si une IA la cite pour une question que vous ne suivez pas, l’outil ne le voit pas. Les questions proposées sont un point de départ, à relire. Une page dont le texte ne s’affiche qu’avec JavaScript ne peut pas être lue : l’audit de la page le dit.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/questions' },
          { page: 'comprendre/sources' },
          { page: 'agir/audit' },
          { page: 'piloter/partages' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'People often think in pages: a sponsored article, a product page, a comparison. The tool starts from prompts: it asks them to the AIs and notes the pages they cite. The **Tracked pages** screen (**Track** menu) bridges the two. You paste the address of a page of the brand; the tool reads it, suggests the prompts a user would ask that it answers, then shows, AI by AI, whether the answers to those prompts cite it.' },
      { type: 'capture', nom: 'pages', legende: 'The Tracked pages screen: paste a page’s address, the list of tracked pages with their tally, and the brand’s pages already cited, to track in one click.' },
      { type: 'h2', id: 'track', texte: 'Tracking a page' },
      {
        type: 'etapes',
        items: [
          { titre: 'Paste the address', texte: 'In **Track a page**, the full address (https://…), then **Read the page and suggest prompts**. Other ways in: **Start from a page** on the Prompts screen, or **Track** on a page of the **Our pages** tab in Sources.' },
          { titre: 'Review the suggested prompts', texte: 'The tool reads the page as an AI crawler does, without JavaScript (free). A small model suggests up to six prompts, most without the brand’s name (less than a cent, logged in the cost journal). Untick the ones that do not fit, edit the text, **Remove** deletes one, and the field below **Adds** one by hand.' },
          { titre: 'Track the page', texte: '**Track the page with … prompts** (free). The prompts join the project: they then count in its figures and its automatic runs. You can also **attach prompts already tracked**.' },
          { titre: 'Start the run', texte: 'On the page’s sheet, **Start a run for these prompts**, at the price shown ($0.0012 per prompt and per interface AI). Answers come back within minutes.' },
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Why prompts without the brand’s name', texte: 'A prompt that names the brand almost always gets its site cited. What matters is whether the AI cites the page when the user does not know it yet: “Which parental control app should I choose?” rather than “Is app X any good?”.' },
      { type: 'h2', id: 'sheet', texte: 'A page’s sheet' },
      { type: 'capture', nom: 'page-fiche', legende: 'A tracked page’s sheet: AI by AI, the answers that cite it; then each prompt with each AI’s latest answer, and what is cited instead.' },
      {
        type: 'liste',
        items: [
          '**AI by AI**: “3 of 12 answers citing the page”, and below it the brand’s presence (named or another page cited). Claude, measured through its API, has its own tile.',
          '**Its prompts**: one row per prompt, one column per AI, with the latest answer: **Page cited**, **Brand, not this page**, **Read, not cited**, **Absent** or **No answer**. A click opens the answer.',
          '**Remove** detaches a prompt from the page; it stays in the project. **Add prompts by hand** (one per line) and **Suggest more prompts** complete the list.',
          '**Cited instead**: the pages cited in the answers that do not cite this one. That is where to look to understand what the AI prefers.',
          '**Cited on other prompts**: answers to other prompts of the project that also cite it.',
          'At the top: **Audit the page** (readable by AI crawlers?), **Share** (a private page for a client, on these prompts) and **Stop tracking** (its prompts stay in the project).',
        ],
      },
      { type: 'h2', id: 'find', texte: 'Finding a page again' },
      { type: 'p', texte: 'Quick search (⌘ K on a Mac, Ctrl K elsewhere) also finds pages: the ones you track lead to their sheet, other cited pages to their sheet in Sources. Type part of the address or the title.' },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'A page is only measured on its prompts: if an AI cites it for a prompt you do not track, the tool does not see it. Suggested prompts are a starting point, to be reviewed. A page whose text only shows with JavaScript cannot be read: the page audit says so.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/questions' },
          { page: 'comprendre/sources' },
          { page: 'agir/audit' },
          { page: 'piloter/partages' },
        ],
      },
    ],
  },
}

export default page
