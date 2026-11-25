// Cas d'usage : choisir la page d'un autre site où obtenir une place en premier.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/pages-ou-apparaitre',
  rubrique: 'contenus-et-reputation',
  slug: { fr: 'pages-ou-apparaitre', en: 'pages-to-appear-on' },
  titre: {
    fr: 'Dans quelle page faut-il apparaître en premier ?',
    en: 'Which page should I get into first?',
  },
  resume: {
    fr: 'Les pages que les IA citent sur vos questions sans vous, classées par type de site, et la façon de choisir celle où demander une place, puis de suivre la démarche.',
    en: 'The pages AIs cite on your prompts without you, sorted by site type, and how to choose the one where you ask for a place, then follow up on the outreach.',
  },
  ecrans: ['/sources', '/actions'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Sur vos questions, les IA citent des pages d’autres sites : un comparatif de logiciels, un article de média, un annuaire, un fil de forum. Facturo n’y figure pas. Vous ne pouvez pas écrire à tout le monde. Il faut choisir la page où une place compte le plus, et commencer par elle.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Des relevés d’interface avec leurs sources citées.',
          'Les sites classés par type. Le classement se lance une fois, d’un clic, pour quelques centimes ; les nouveaux sites sont ensuite classés tout seuls.',
          'Le site et les propriétés de Facturo déclarés, pour que l’outil sache quelles pages sont les vôtres.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Classer les sites cités',
            texte: 'Ouvrez **Sources**. Si des sites ne sont pas encore classés, le bandeau propose **Classer les sites**, avec son prix. Chaque site reçoit un type (comparatif, média, blog, forum, annuaire, site de marque, site officiel, boutique) et un propriétaire : à nous, concurrent suivi, autre marque ou tiers. La barre **À qui profitent les citations** montre la répartition. Un type faux se corrige à la main, sur la fiche du site.',
            capture: 'sources',
          },
          {
            titre: 'Lister les pages citées sans vous',
            texte: 'Passez à l’onglet **Pages** et choisissez **Seulement les pages citées sans nous**. Chaque ligne donne la **Page**, son **Type**, **À qui** elle appartient, le nombre de **Réponses** qui la citent, la colonne **Dont sans nous** (celles où Facturo n’apparaît pas) et les **IA** qui la citent. Triez sur **Dont sans nous**.',
          },
          {
            titre: 'Ouvrir la fiche d’une page',
            texte: 'Un clic sur une ligne ouvre la fiche : les réponses qui citent la page, les marques nommées dans ces réponses, le type du site. Si la page n’est pas déjà dans la liste de travail, le bouton **Ajouter à la liste de travail** l’y met.',
          },
          {
            titre: 'Lire la liste de travail',
            texte: 'Ouvrez **Actions**. Le groupe **Apparaître ailleurs** réunit les pages des autres que les IA citent sans vous ; les sites de marque en sont exclus, les comparatifs, les médias et les annuaires passent devant. Chaque ligne dit quoi faire, par exemple « Entrer dans le comparatif de comparatif-logiciels.exemple », et la colonne **Preuve** compte les réponses et les IA concernées.',
            capture: 'actions',
          },
          {
            titre: 'Lancer la démarche et la noter',
            texte: 'Ouvrez la ligne retenue et passez-la **En cours**. Dans **Prises de contact**, notez chaque message : le type de démarche (**Demande d’ajout**, **Proposition de test**, **Réponse dans un fil**…), la date, la personne contactée, ce qui a été demandé, puis **Ajouter au journal**. Quand la réponse arrive, marquez-la : **Réponse favorable**, **Refus** ou **Sans réponse**.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Par quelle page commencer : celle qui est citée sans vous dans le plus de réponses, par le plus d’IA, sur un site où une place se demande (un comparatif, un média, un annuaire). Pour un fil de forum, l’onglet **Discussions** liste les endroits où il est encore possible de répondre.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Le contenu des pages citées n’est pas lu : les marques de la fiche sont celles des réponses, pas celles de la page. L’outil ne connaît pas le trafic d’une page, faute de lien avec Google Analytics ou la Search Console. Une page citée dans une seule réponse peut l’être par hasard. Et entrer dans un comparatif ne garantit pas d’être cité : la mesure suivante le dira.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'comprendre/sources' },
          { page: 'agir/liste-de-travail' },
          { page: 'agir/prises-de-contact' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'On your prompts, AIs cite pages from other sites: a software comparison, a media article, a directory, a forum thread. Facturo is not in them. You cannot write to everyone. You need to choose the page where a place counts most, and start there.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'Interface readings with their cited sources.',
          'Sites classified by type. Classification is started once, with one click, for a few cents; new sites are then classified automatically.',
          'Facturo’s site and properties declared, so the tool knows which pages are yours.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Classify the cited sites',
            texte: 'Open **Sources**. If some sites are not classified yet, the banner offers **Classify the sites**, with its price. Each site gets a type (comparison site, media, blog, forum, directory, brand site, official site, shop) and an owner: ours, tracked competitor, other brand or third party. The **Who gets the citations** bar shows the split. A wrong type is corrected by hand on the site’s sheet.',
            capture: 'sources',
          },
          {
            titre: 'List the pages cited without you',
            texte: 'Go to the **Pages** tab and choose **Only pages cited without us**. Each row gives the **Page**, its **Type**, its **Owner**, the number of **Answers** that cite it, the **Without us** column (those where Facturo does not appear) and the **AIs** that cite it. Sort by **Without us**.',
          },
          {
            titre: 'Open a page’s sheet',
            texte: 'Clicking a row opens the sheet: the answers that cite the page, the brands mentioned in those answers, the site type. If the page is not in the work list yet, the **Add to the work list** button puts it there.',
          },
          {
            titre: 'Read the work list',
            texte: 'Open **Actions**. The **Appear elsewhere** group gathers other people’s pages that AIs cite without you; brand sites are excluded, and comparison sites, media and directories come first. Each row says what to do, for example “Get into the comparison on comparatif-logiciels.exemple”, and the **Evidence** column counts the answers and AIs concerned.',
            capture: 'actions',
          },
          {
            titre: 'Start the outreach and log it',
            texte: 'Open the row you picked and set it to **In progress**. Under **Outreach**, log each message: the type of outreach (**Inclusion request**, **Test offer**, **Reply in a thread**…), the date, the person contacted, what was asked, then **Add to the log**. When the reply comes, mark it: **Positive reply**, **Declined** or **No answer**.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Which page to start with: the one cited without you in the most answers, by the most AIs, on a site where you can ask for a place (a comparison site, a media outlet, a directory). For forum threads, the **Discussions** tab lists the places where you can still reply.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'The content of cited pages is not read: the brands on the sheet are those of the answers, not of the page. The tool does not know a page’s traffic, since it has no link with Google Analytics or Search Console. A page cited in a single answer may be cited by chance. And getting into a comparison does not guarantee being cited: the next measurement will tell.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'comprendre/sources' },
          { page: 'agir/liste-de-travail' },
          { page: 'agir/prises-de-contact' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
  },
}

export default page
