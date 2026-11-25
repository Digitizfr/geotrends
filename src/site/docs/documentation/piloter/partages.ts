import type { PageDoc } from '../../types'

// Écran /partages (src/app/(app)/partages), page publique /partage/[jeton]
// (src/app/partage/[jeton]/page.tsx), calculs dans src/lib/partages.ts.
const page: PageDoc = {
  id: 'piloter/partages',
  rubrique: 'piloter',
  slug: { fr: 'piloter/partager-avec-un-client', en: 'steer/share-with-a-client' },
  titre: { fr: 'Partager avec un client', en: 'Share with a client' },
  resume: {
    fr: 'Un lien privé, sans compte, qu’un client ou un partenaire ouvre pour voir où en est sa marque sur une série de questions. Mis à jour à chaque relevé, coupé en un clic.',
    en: 'A private link, with no account, that a client or partner opens to see where their brand stands on a set of prompts. Updated with every run, turned off in one click.',
  },
  ecrans: ['/partages'],
  maj: '2026-11-19',
  contenu: {
    fr: [
      { type: 'p', texte: 'Un client veut savoir si les IA citent sa marque, sans entrer dans l’outil. L’écran **Partages** (menu **Suivre**) crée pour lui une page privée sur une série de questions du projet affiché. Il l’ouvre par un simple lien, sans compte ni mot de passe. La page se met à jour d’elle-même à chaque nouveau relevé et ne montre rien d’autre que ces questions. Elle ne coûte rien : elle lit les relevés déjà faits.' },
      { type: 'capture', nom: 'partage-page', legende: 'La page que voit le client : la marque IA par IA, l’évolution, puis le détail question par question, avec les pages de la marque surlignées.' },
      { type: 'h2', id: 'creer', texte: 'Créer un lien' },
      {
        type: 'etapes',
        items: [
          { titre: 'Choisir les questions', texte: 'Sur **Questions**, cochez la série à montrer puis **Partager** ; ou ouvrez **Partages › Nouveau partage** et cochez-les dans la liste (**Tout cocher**, ou un thème d’un clic).' },
          { titre: 'Régler la page', texte: 'Le **titre**, **pour qui** (facultatif), les **IA montrées** (aucune cochée : toutes celles du projet), la **langue de la page**, et ce que voit la personne : un **extrait de chaque réponse**, les **marques nommées** à la place de la marque. Une **date de fin** est possible.' },
          { titre: 'Envoyer le lien', texte: '**Créer le lien de partage**, puis **Copier le lien** et envoyez-le par la messagerie de votre choix. **Ouvrir la page** la montre telle que le client la verra.' },
        ],
      },
      { type: 'capture', nom: 'partages', legende: 'L’écran Partages : le formulaire d’un nouveau partage, puis la liste des liens avec leur état, leurs ouvertures et leurs boutons.' },
      { type: 'h2', id: 'ce-que-voit-le-client', texte: 'Ce que voit le client' },
      {
        type: 'liste',
        items: [
          '**La marque, IA par IA** : la part des réponses où elle est nommée ou citée, avec le nombre de réponses, la marge d’erreur et une petite tendance. En dessous de cinq réponses, le compte est donné tel quel (« 2 sur 3 ») : un pourcentage serait trompeur.',
          '**L’évolution**, relevé après relevé, dès qu’il y a deux jours de relevé. Claude, mesuré par son API, a sa propre courbe : il n’est jamais additionné aux IA relevées dans leur interface.',
          '**Question par question** : pour chaque IA, l’état de sa dernière réponse (citée, nommée, lue, absente), le bilan de toutes ses réponses à la question, les pages qu’elle cite (celles de la marque surlignées), et selon vos choix les marques nommées et un extrait de la réponse.',
          '**La méthode**, en bas de page, en mots simples : interface ou API, depuis quel pays, pourquoi une réponse est un échantillon.',
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Ce qui n’y est jamais', texte: 'Les autres questions du projet, les autres projets, les coûts, les questions archivées depuis, le menu de l’outil. La page n’est pas proposée aux moteurs de recherche, et chaque lien est impossible à deviner.' },
      { type: 'h2', id: 'suivre', texte: 'Suivre et gérer les liens' },
      {
        type: 'tableau',
        colonnes: ['Sur la ligne d’un lien', 'Ce que cela fait'],
        lignes: [
          ['« ouvert 3 fois, la dernière le … »', 'Les ouvertures par quelqu’un qui n’est pas connecté à l’outil. Les vôtres ne comptent pas.'],
          ['**Modifier**', 'Change les questions, les IA, la langue ou les options. L’adresse reste la même : le client voit les changements à sa prochaine ouverture.'],
          ['**Couper le lien**', 'La page ne s’ouvre plus, tout de suite. **Rouvrir le lien** la remet en service à la même adresse.'],
          ['**Changer l’adresse**', 'Fait une nouvelle adresse et rend l’ancienne inutilisable, par exemple si le lien a circulé trop loin. Le compteur d’ouvertures repart de zéro.'],
          ['**Supprimer**', 'Retire le partage et ses réglages, après confirmation.'],
        ],
      },
      { type: 'p', texte: 'Un lien coupé, expiré ou remplacé affiche « Ce lien n’est plus actif » et invite à demander un nouveau lien. Les partages appartiennent au projet : chaque compte de l’outil les voit et peut les gérer.' },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'La page montre les réponses telles qu’elles ont été relevées : elle ne promet aucune citation et ne commente pas. Il n’y a pas de mot de passe propre à un lien : quiconque a l’adresse peut ouvrir la page tant qu’elle est active. Coupez-la quand le client n’en a plus besoin.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/questions' },
          { page: 'reference/methode' },
          { page: 'piloter/rapport-et-alertes' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'A client wants to know whether AIs cite their brand, without getting into the tool. The **Shares** screen (**Track** menu) creates a private page for them on a set of prompts of the current project. They open it with a plain link, no account and no password. The page updates itself with every new run and shows nothing but those prompts. It costs nothing: it reads runs already made.' },
      { type: 'capture', nom: 'partage-page', legende: 'The page the client sees: the brand AI by AI, the trend, then prompt-by-prompt detail, with the brand’s pages highlighted.' },
      { type: 'h2', id: 'create', texte: 'Creating a link' },
      {
        type: 'etapes',
        items: [
          { titre: 'Choose the prompts', texte: 'On **Prompts**, select the set to show then **Share**; or open **Shares › New share** and tick them in the list (**Select all**, or a topic in one click).' },
          { titre: 'Set up the page', texte: 'The **title**, **for whom** (optional), the **AIs shown** (none ticked: all of the project’s), the **page language**, and what the person sees: an **excerpt of each answer**, the **brands named** instead of the brand. An **end date** is possible.' },
          { titre: 'Send the link', texte: '**Create the share link**, then **Copy the link** and send it with the mail app of your choice. **Open the page** shows it as the client will see it.' },
        ],
      },
      { type: 'capture', nom: 'partages', legende: 'The Shares screen: the form for a new share, then the list of links with their state, their openings and their buttons.' },
      { type: 'h2', id: 'what-the-client-sees', texte: 'What the client sees' },
      {
        type: 'liste',
        items: [
          '**The brand, AI by AI**: the share of answers where it is named or cited, with the number of answers, the margin of error and a small trend line. Below five answers, the count is given as is (“2 of 3”): a percentage would mislead.',
          '**The trend**, run after run, as soon as there are two run days. Claude, measured through its API, has its own curve: it is never added to the AIs captured from their interface.',
          '**Prompt by prompt**: for each AI, the state of its latest answer (cited, named, read, absent), the tally of all its answers to the prompt, the pages it cites (the brand’s highlighted), and depending on your choices the brands named and an excerpt of the answer.',
          '**The method**, at the bottom, in plain words: interface or API, from which country, why an answer is a sample.',
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'What is never there', texte: 'The project’s other prompts, the other projects, the costs, prompts archived since, the tool’s menu. The page is not offered to search engines, and every link is impossible to guess.' },
      { type: 'h2', id: 'manage', texte: 'Following and managing links' },
      {
        type: 'tableau',
        colonnes: ['On a link’s line', 'What it does'],
        lignes: [
          ['“opened 3 times, last on …”', 'Openings by someone not signed in to the tool. Yours do not count.'],
          ['**Edit**', 'Changes the prompts, the AIs, the language or the options. The address stays the same: the client sees the changes next time they open it.'],
          ['**Turn the link off**', 'The page no longer opens, at once. **Turn the link back on** restores it at the same address.'],
          ['**Change the address**', 'Makes a new address and voids the old one, for instance if the link travelled too far. The opening counter starts again from zero.'],
          ['**Delete**', 'Removes the share and its settings, after confirmation.'],
        ],
      },
      { type: 'p', texte: 'A link turned off, expired or replaced shows “This link is no longer active” and suggests asking for a new one. Shares belong to the project: every account of the tool sees them and can manage them.' },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'The page shows answers as they were captured: it promises no citation and adds no commentary. There is no per-link password: anyone with the address can open the page while it is active. Turn it off when the client no longer needs it.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/questions' },
          { page: 'reference/methode' },
          { page: 'piloter/rapport-et-alertes' },
        ],
      },
    ],
  },
}

export default page
