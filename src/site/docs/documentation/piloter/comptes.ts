import type { PageDoc } from '../../types'

// Connexion (src/app/connexion), invitation (src/app/invitation, src/lib/invitations.ts,
// Réglages › Comptes, scripts/inviter.ts), comptes et rôles (src/lib/auth.ts, session.ts), menu, choix du projet et recherche rapide
// (src/app/(app)/Cadre.tsx, Navigation.tsx, SelecteurProjet.tsx, Palette.tsx).
const page: PageDoc = {
  id: 'piloter/comptes',
  rubrique: 'piloter',
  slug: { fr: 'piloter/comptes', en: 'steer/accounts' },
  titre: { fr: 'Comptes et connexion', en: 'Accounts and sign-in' },
  resume: {
    fr: 'Le premier compte se crée au premier lancement ; ensuite chaque personne est invitée et choisit son mot de passe par un lien. Deux rôles, le menu, la recherche.',
    en: 'The first account is created on first launch; after that each person is invited and chooses a password through a link. Two roles, the menu, quick search.',
  },
  maj: '2026-11-25',
  contenu: {
    fr: [
      { type: 'p', texte: 'Personne ne s’inscrit seul dans une installation de GeoTrends. Le premier compte, celui de l’administrateur, se crée au premier lancement. Ensuite, l’administrateur invite chaque personne depuis **Réglages › Comptes** ; elle reçoit un lien personnel pour choisir son mot de passe. Aucun mot de passe ne circule par e-mail. Cette page dit comment entrer, ce que chaque rôle peut faire, et comment se repérer une fois connecté.' },
      { type: 'h2', id: 'premier-compte', texte: 'Le premier compte' },
      { type: 'capture', nom: 'premier-compte', legende: 'Au premier lancement, la page de connexion fait créer le compte administrateur.' },
      { type: 'p', texte: 'Tant qu’aucun compte n’existe, la page de connexion affiche « Bienvenue dans GeoTrends » : **Votre nom**, **Adresse e-mail**, **Mot de passe** (huit caractères au moins, deux fois), puis **Créer le compte et entrer**. Ce compte est administrateur, et l’outil enchaîne sur la création du premier projet. Le formulaire ne s’affiche qu’une fois : dès qu’un compte existe, on n’entre plus que par invitation. Créez-le donc tout de suite après l’installation.' },
      { type: 'capture', nom: 'connexion', legende: 'La page de connexion ordinaire : l’adresse e-mail et le mot de passe.' },
      { type: 'h2', id: 'se-connecter', texte: 'Se connecter' },
      { type: 'p', texte: 'L’adresse de votre installation ouvre la page de connexion : **Adresse e-mail**, **Mot de passe**, puis **Se connecter**. L’outil s’ouvre sur la vue d’ensemble. Tant que personne n’est connecté, la page suit la langue du navigateur ; ensuite, c’est la langue choisie pour votre compte.' },
      {
        type: 'tableau',
        colonnes: ['Message', 'Ce qu’il veut dire'],
        lignes: [
          ['« Adresse ou mot de passe incorrect. »', 'L’un des deux ne correspond pas. Vérifiez l’adresse, puis le mot de passe.'],
          ['« Trop de tentatives. Réessayez dans une minute. »', 'Plus de dix essais en une minute : la connexion est suspendue un instant.'],
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Mot de passe oublié', texte: 'Demandez un nouveau lien à l’administrateur : il le crée en un clic dans **Réglages › Comptes** (**Lien de nouveau mot de passe**). Vous l’ouvrez, vous choisissez un nouveau mot de passe, et l’ancien ne marche plus. Pour en changer sans l’avoir oublié : **Réglages › Mon mot de passe**.' },
      { type: 'h2', id: 'invitation', texte: 'Entrer avec une invitation' },
      { type: 'capture', nom: 'invitation', legende: 'La page ouverte par le lien d’invitation : l’adresse est déjà remplie, il reste à choisir le mot de passe.' },
      {
        type: 'etapes',
        items: [
          { titre: 'Ouvrir le lien reçu', texte: 'L’e-mail de l’administrateur contient un lien personnel. Il vaut **sept jours** et ne sert **qu’une fois**.' },
          { titre: 'Choisir son mot de passe', texte: 'Huit caractères au moins, deux fois le même, puis **Enregistrer et entrer**. L’outil s’ouvre directement sur la vue d’ensemble.' },
          { titre: 'Se connecter les fois suivantes', texte: 'Avec **Se connecter**, l’adresse e-mail et ce mot de passe.' },
        ],
      },
      { type: 'p', texte: 'Un lien déjà utilisé, expiré ou remplacé par un plus récent affiche « Ce lien ne marche plus » : il suffit d’en demander un nouveau à l’administrateur.' },
      { type: 'h2', id: 'roles', texte: 'Deux rôles' },
      {
        type: 'tableau',
        colonnes: ['Rôle', 'Ce qu’il permet'],
        lignes: [
          ['**Membre**', 'Tous les écrans de l’outil, tous les projets. Un membre peut créer un projet, écrire des questions et lancer un relevé payant, dans la limite du plafond du mois et après la confirmation prévue au-dessus du seuil.'],
          ['**Administrateur**', 'En plus : la rubrique **Administration › Coûts**, la ligne **Dépense du mois** en bas du menu, l’export du journal des coûts, le lien pour changer le plafond et la gestion des comptes dans Réglages : inviter, refaire un lien, retirer un accès.'],
        ],
      },
      { type: 'p', texte: 'Le rôle se choisit à l’invitation. Il ne se change pas ensuite : pour le modifier, retirez l’accès puis invitez de nouveau la personne avec le bon rôle (rien n’est perdu, les projets n’appartiennent à aucun compte). Tous les comptes voient tous les projets, et tous recevront le rapport du lundi quand l’envoi par e-mail sera possible.' },
      { type: 'h2', id: 'se-reperer', texte: 'Se repérer dans l’outil' },
      {
        type: 'liste',
        items: [
          '**Le menu** range les écrans par verbe : **Suivre**, **Comprendre**, **Agir**, **Régler**, et **Administration** pour un administrateur. Chaque groupe se replie d’un clic sur son titre ; le bouton **Réduire le menu aux icônes** ne garde que les icônes. Ces choix sont retenus. Sur téléphone, le menu s’ouvre en volet par le bouton de la barre du haut.',
          '**Les compteurs** du menu signalent ce qui attend : les réponses en attente à côté de Questions, les réponses qui contredisent un fait à côté de Faits vérifiés, les actions à faire à côté d’Actions.',
          '**Le choix du projet**, en haut du menu, montre le projet affiché et son marché. Un clic ouvre la liste des projets, avec la date de leur dernier relevé, une recherche quand il y en a plus de quatre, et les liens **Tous les projets** et **Nouveau projet**. Choisir un projet change tous les écrans.',
          '**La recherche rapide** s’ouvre avec le bouton **Rechercher** ou le raccourci ⌘ K sur Mac, Ctrl K ailleurs. Elle mène à un écran, à une question, à une marque (ses réponses), à un site ou à une page (sa fiche dans Sources, ou dans Pages suivies si vous la suivez). Flèches pour choisir, Entrée pour y aller, Échap pour fermer.',
          '**Se déconnecter** : l’icône à côté de votre nom, en bas du menu.',
        ],
      },
      { type: 'h2', id: 'pas-a-pas', texte: 'Donner accès à une nouvelle personne' },
      {
        type: 'etapes',
        items: [
          { titre: 'Inviter', texte: 'Dans **Réglages › Comptes** (administrateur), saisissez le nom, l’adresse e-mail et le rôle, puis **Inviter**. Le compte est créé et un lien personnel s’affiche.' },
          { titre: 'Envoyer le lien', texte: '**Écrire l’e-mail** ouvre votre messagerie avec le message tout prêt et le lien dedans ; **Copier le lien** et **Copier le texte de l’e-mail** servent pour une autre messagerie. Le lien ne se réaffiche pas : envoyez-le tout de suite, ou refaites-en un.' },
          { titre: 'Choisir son mot de passe', texte: 'La personne ouvre le lien, choisit son mot de passe et entre dans l’outil. Sa ligne dans Réglages passe de « Invitation en cours » à « Dernière connexion ».' },
          { titre: 'Choisir sa langue', texte: 'Dans **Réglages**, elle choisit Français ou English : le choix suit son compte.' },
          { titre: 'Choisir le projet', texte: 'En haut du menu, elle choisit le projet à afficher. Elle peut alors suivre les écrans sans rien régler d’autre.' },
        ],
      },
      { type: 'h2', id: 'retirer', texte: 'Retirer un accès' },
      { type: 'p', texte: 'Dans **Réglages › Comptes**, **Retirer l’accès** puis **Oui, retirer** : le compte, ses sessions ouvertes et son lien en cours disparaissent tout de suite. On ne peut retirer ni son propre accès, ni celui du dernier administrateur.' },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Il n’y a pas de droits par projet : chaque compte voit chaque projet et peut lancer un relevé payant. Le plafond du mois et le seuil de confirmation sont les seuls garde-fous de la dépense. L’outil n’envoie pas lui-même l’invitation : c’est vous qui l’envoyez depuis votre messagerie. Il n’y a pas de lien « mot de passe oublié » en libre accès, ni de double authentification.' },
      {
        type: 'liens',
        items: [
          { page: 'piloter/reglages' },
          { page: 'piloter/couts' },
          { page: 'demarrer/prise-en-main' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Nobody signs up on their own in a GeoTrends installation. The first account, the admin’s, is created on first launch. After that, the administrator invites each person from **Settings › Accounts**; they get a personal link to choose a password. No password ever travels by e-mail. This page explains how to get in, what each role can do, and how to find your way once signed in.' },
      { type: 'h2', id: 'first-account', texte: 'The first account' },
      { type: 'capture', nom: 'premier-compte', legende: 'On first launch, the sign-in page has you create the admin account.' },
      { type: 'p', texte: 'As long as no account exists, the sign-in page shows “Welcome to GeoTrends”: **Your name**, **E-mail address**, **Password** (at least eight characters, twice), then **Create the account and enter**. This account is an admin, and the tool takes you straight to creating the first project. The form is shown only once: as soon as an account exists, people only get in by invitation. So create it right after installing.' },
      { type: 'capture', nom: 'connexion', legende: 'The ordinary sign-in page: e-mail address and password.' },
      { type: 'h2', id: 'sign-in', texte: 'Signing in' },
      { type: 'p', texte: 'The address of your installation opens the sign-in page: **E-mail address**, **Password**, then **Sign in**. The tool opens on the overview. Until someone is signed in, the page follows the browser language; after that, it uses the language chosen for your account.' },
      {
        type: 'tableau',
        colonnes: ['Message', 'What it means'],
        lignes: [
          ['“Wrong e-mail address or password.”', 'One of the two does not match. Check the address, then the password.'],
          ['“Too many attempts. Try again in a minute.”', 'More than ten attempts in one minute: sign-in is paused for a moment.'],
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Forgotten password', texte: 'Ask the administrator for a new link: one click in **Settings › Accounts** (**New-password link**). Open it, choose a new password, and the old one stops working. To change it without having forgotten it: **Settings › My password**.' },
      { type: 'h2', id: 'invitation', texte: 'Getting in with an invitation' },
      { type: 'capture', nom: 'invitation', legende: 'The page opened by the invitation link: the address is filled in, all that is left is to choose the password.' },
      {
        type: 'etapes',
        items: [
          { titre: 'Open the link you received', texte: 'The administrator’s e-mail contains a personal link. It works for **seven days**, **only once**.' },
          { titre: 'Choose a password', texte: 'At least eight characters, the same twice, then **Save and enter**. The tool opens straight on the overview.' },
          { titre: 'Sign in next time', texte: 'With **Sign in**, your e-mail address and that password.' },
        ],
      },
      { type: 'p', texte: 'A link already used, expired or replaced by a newer one shows “This link no longer works”: just ask the administrator for a new one.' },
      { type: 'h2', id: 'roles', texte: 'Two roles' },
      {
        type: 'tableau',
        colonnes: ['Role', 'What it allows'],
        lignes: [
          ['**Member**', 'Every screen of the tool, every project. A member can create a project, write prompts and start a paid run, within the monthly cap and after the confirmation required above the threshold.'],
          ['**Admin**', 'On top of that: the **Admin › Costs** section, the **Spend this month** line at the bottom of the menu, the cost journal export, the link to change the cap and account management in Settings: invite, make a new link, remove access.'],
        ],
      },
      { type: 'p', texte: 'The role is chosen at invitation time. It cannot be changed afterwards: to change it, remove access and invite the person again with the right role (nothing is lost, projects belong to no account). Every account sees every project, and every account will receive the Monday report once e-mail sending is possible.' },
      { type: 'h2', id: 'finding-your-way', texte: 'Finding your way in the tool' },
      {
        type: 'liste',
        items: [
          '**The menu** groups the screens by verb: **Track**, **Understand**, **Act**, **Set up**, and **Admin** for an admin. Each group folds with a click on its title; the **Collapse menu to icons** button keeps only the icons. These choices are remembered. On a phone, the menu opens as a drawer from the top-bar button.',
          '**The counters** in the menu flag what is waiting: pending answers next to Prompts, answers contradicting a fact next to Fact checks, actions to do next to Actions.',
          '**The project switcher**, at the top of the menu, shows the current project and its market. A click opens the list of projects, with the date of their last run, a search box when there are more than four, and the **All projects** and **New project** links. Picking a project changes every screen.',
          '**Quick search** opens with the **Search** button or the ⌘ K shortcut on a Mac, Ctrl K elsewhere. It jumps to a screen, a prompt, a brand (its answers), a site or a page (its sheet in Sources, or in Tracked pages if you track it). Arrows to choose, Enter to go, Esc to close.',
          '**Sign out**: the icon next to your name, at the bottom of the menu.',
        ],
      },
      { type: 'h2', id: 'step-by-step', texte: 'Giving a new person access' },
      {
        type: 'etapes',
        items: [
          { titre: 'Invite', texte: 'In **Settings › Accounts** (admin), enter the name, the e-mail address and the role, then **Invite**. The account is created and a personal link appears.' },
          { titre: 'Send the link', texte: '**Write the e-mail** opens your mail app with the message ready and the link in it; **Copy the link** and **Copy the e-mail text** work for any other mail app. The link is not shown again: send it right away, or make a new one.' },
          { titre: 'Choose a password', texte: 'The person opens the link, chooses a password and enters the tool. Their line in Settings goes from “Invitation pending” to “Last sign-in”.' },
          { titre: 'Choose a language', texte: 'In **Settings**, they choose Français or English: the choice follows their account.' },
          { titre: 'Choose the project', texte: 'At the top of the menu, they pick the project to show. They can then follow the screens without setting anything else.' },
        ],
      },
      { type: 'h2', id: 'remove', texte: 'Removing access' },
      { type: 'p', texte: 'In **Settings › Accounts**, **Remove access** then **Yes, remove**: the account, its open sessions and its pending link disappear at once. You cannot remove your own access, nor the last admin’s.' },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'There are no per-project rights: every account sees every project and can start a paid run. The monthly cap and the confirmation threshold are the only spending safeguards. The tool does not send the invitation itself: you send it from your own mail app. There is no self-service “forgot password” link, and no two-factor authentication.' },
      {
        type: 'liens',
        items: [
          { page: 'piloter/reglages' },
          { page: 'piloter/couts' },
          { page: 'demarrer/prise-en-main' },
        ],
      },
    ],
  },
}

export default page
