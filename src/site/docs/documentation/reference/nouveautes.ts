import type { PageDoc } from '../../types'

// Nouveautés : écrites depuis `git log`, en mots simples, la plus récente en tête.
// À compléter à chaque mise en ligne : une section par jour, ce qui change pour
// la personne qui se sert de l'outil (pas le détail des commits). Changer `maj`.
const page: PageDoc = {
  id: 'reference/nouveautes',
  rubrique: 'reference',
  slug: { fr: 'reference/nouveautes', en: 'reference/changelog' },
  titre: { fr: 'Nouveautés', en: 'What’s new' },
  resume: {
    fr: 'Ce qui a changé dans GeoTrends, jour par jour, le plus récent en tête : logiciel libre à installer chez soi, pages suivies, partage client, invitations, documentation.',
    en: 'What has changed in GeoTrends, day by day, newest first: open-source software you install yourself, tracked pages, client sharing, invitations, documentation.',
  },
  maj: '2026-11-25',
  contenu: {
    fr: [
      { type: 'p', texte: 'Cette page est mise à jour à chaque mise en ligne. Elle dit ce qui change pour vous, pas le détail technique. Les fonctions décrites ici sont en service ; ce qui n’est pas fait est écrit comme tel dans les pages concernées.' },
      { type: 'h2', id: '2026-11-25', texte: '25 novembre 2026' },
      {
        type: 'liste',
        items: [
          '**GeoTrends devient un logiciel libre**, sous licence AGPL-3.0. Le code est sur [GitHub](https://github.com/Digitizfr/geotrends) : chacun peut l’installer chez soi, avec ses propres clés d’API. Voir [Installer GeoTrends](doc:demarrer/installer).',
          '**Installation en trois étapes** : un script pose les questions, écrit le fichier de réglages et lance l’outil avec Docker. La tâche de fond des relevés automatiques est fournie avec, et le certificat HTTPS se fait tout seul sur un serveur.',
          '**Premier compte** : au premier lancement, la page de connexion fait créer le compte administrateur, puis ouvre la création du premier projet.',
          '**Clés des fournisseurs** : l’identifiant et le mot de passe DataForSEO se saisissent tels quels ; le petit modèle prend la clé DeepSeek ou, à défaut, celle d’Anthropic. Réglages dit, pour chaque clé absente, le nom à écrire dans le fichier `.env`.',
          'Toute la documentation est aussi sur GitHub, en Markdown, recopiée du site à chaque mise à jour.',
        ],
      },
      { type: 'h2', id: '2026-11-20', texte: '20 novembre 2026' },
      {
        type: 'liste',
        items: [
          '**Pages suivies** : collez l’adresse d’une page de la marque ; l’outil la lit, propose les questions auxquelles elle répond (à garder, retoucher, retirer, ou compléter à la main), puis dit, IA par IA, si les réponses à ces questions la citent et ce qu’elles citent à sa place.',
          'La **recherche rapide** (⌘ K) trouve aussi les pages, par un bout de leur adresse ou de leur titre.',
          '**Partir d’une page** sur l’écran Questions, et **Suivre** sur les pages de la marque dans Sources.',
        ],
      },
      { type: 'h2', id: '2026-11-19', texte: '19 novembre 2026' },
      {
        type: 'liste',
        items: [
          '**Partager avec un client** : une page privée, sans compte, sur une série de questions, avec la marque IA par IA, l’évolution et le détail de chaque réponse. Elle se met à jour à chaque relevé, compte ses ouvertures et se coupe d’un clic (écran **Partages**, ou **Partager** sur les questions cochées).',
          '**Inviter une personne** depuis **Réglages › Comptes** : elle reçoit un lien personnel, valable sept jours, pour choisir son mot de passe. Aucun mot de passe ne circule par e-mail. Le même bouton refait un lien quand quelqu’un a oublié le sien.',
          '**Mon mot de passe**, dans Réglages : chacun peut changer le sien.',
          '**Retirer un accès** d’un clic, confirmé, dans Réglages › Comptes.',
        ],
      },
      { type: 'h2', id: '2026-11-18', texte: '18 novembre 2026' },
      {
        type: 'liste',
        items: [
          '**Documentation et cas d’usage** sur le site public, en français et en anglais : chaque écran de l’outil décrit, avec des captures en données d’exemple.',
          'Un contrôle automatique signale tout écran de l’outil qu’aucune page de la documentation ne décrit : la documentation suit l’outil.',
        ],
      },
      { type: 'h2', id: '2026-11-15', texte: '15 novembre 2026' },
      {
        type: 'liste',
        items: [
          '**Réseaux sociaux de la marque** : un profil LinkedIn, Instagram, Facebook, X, TikTok, Pinterest, Threads, Bluesky ou GitHub se déclare comme une propriété. Une page citée sous ce profil compte pour la marque.',
          '**Détecter depuis le site** : à la création d’un projet et sur sa fiche, ce bouton lit gratuitement la page d’accueil du site et propose les profils et chaînes YouTube trouvés. Rien n’est ajouté sans relecture, et ce qui est déjà déclaré n’est pas reproposé.',
          '**Vidéos et chaînes** refait en trois blocs : vos chaînes, une carte par chaîne déclarée ; question par question, avec les miniatures et la chaîne de la vidéo citée ; les autres chaînes citées. Une seule unité de compte : la réponse relevée.',
          'Claude peut de nouveau être relevé par son API.',
        ],
      },
      { type: 'h2', id: '2026-11-14', texte: '14 novembre 2026' },
      {
        type: 'liste',
        items: [
          '**Projets** : créer une marque depuis l’outil, avec ses sites, ses chaînes, ses concurrents et ses questions ; la choisir en haut du menu ; lancer un relevé d’un clic, avec le prix de chaque IA affiché avant l’envoi.',
          '**Relevés automatiques** : chaque semaine pour ChatGPT, Gemini et Google, toutes les deux semaines pour Claude, une fois activés sur la fiche du projet.',
          '**Lecture automatique des réponses** par un petit modèle : marques nommées, rang et ton, pour toutes les IA.',
          '**Actions** : une liste de travail tirée des relevés, avec un état par ligne, une note, un journal des prises de contact et la comparaison avant et après une action faite.',
          '**Audit d’une page** (lecture gratuite : accès des robots, texte sans JavaScript, titres, données structurées, date, auteur) et **exports CSV**.',
          '**Nouveaux écrans** dans l’identité du site : vue d’ensemble, questions et page d’une question, réponses, concurrents, sources, vidéos, Aperçus IA et Google, actions, faits vérifiés, rapport, réglages, coûts.',
          '**Sources** : type de chaque site et marque propriétaire (bouton Classer les sites), sources qui montent et qui descendent.',
          '**Questions** : étiquettes (thème et intention), carte des thèmes, sélection de plusieurs questions, mesure approfondie d’une question.',
          '**Faits vérifiés** et **rapport** avec ses alertes ; repères et bande de marge d’erreur sur les graphiques ; filtre « Face à » un concurrent dans la barre du haut.',
          '**Interface** : menu repliable et réduit aux icônes, barre du haut avec la période et les IA, recherche rapide (⌘ K ou Ctrl K), tableaux triables, affichage sur téléphone, interface en français ou en anglais, page de connexion refaite.',
          '**Site public** complet, en français et en anglais, avec des écrans en données d’exemple.',
        ],
      },
      { type: 'h2', id: '2026-11-12', texte: '12 novembre 2026' },
      {
        type: 'liste',
        items: [
          '**Premiers relevés** : ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google, relevés dans leur interface, depuis le pays du projet.',
          '**Claude** interrogé par son API, recherche web activée, et compté à part.',
          '**Chaînes YouTube** : une vidéo citée est rattachée à sa chaîne ; si la chaîne appartient à la marque, la citation compte pour elle.',
          '**Comptes** à inscription fermée, **journal des coûts** avec un plafond par mois, et rubrique **Administration** pour les coûts.',
          'Rythme des relevés fixé : chaque semaine, et toutes les deux semaines pour Claude. Mise en ligne sur geotrends.io.',
        ],
      },
      {
        type: 'liens',
        items: [
          { page: 'demarrer/quest-ce-que-geotrends' },
          { page: 'reference/ia-suivies' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'This page is updated with every release. It says what changes for you, not the technical detail. The features described here are live; what is not built is said so on the pages concerned.' },
      { type: 'h2', id: '2026-11-25', texte: '25 November 2026' },
      {
        type: 'liste',
        items: [
          '**GeoTrends becomes open-source software**, under the AGPL-3.0 licence. The code is on [GitHub](https://github.com/Digitizfr/geotrends): anyone can install it themselves, with their own API keys. See [Install GeoTrends](doc:demarrer/installer).',
          '**Three-step installation**: a script asks the questions, writes the settings file and starts the tool with Docker. The background task for automatic runs comes with it, and on a server the HTTPS certificate takes care of itself.',
          '**First account**: on first launch, the sign-in page has you create the admin account, then opens the creation of the first project.',
          '**Provider keys**: the DataForSEO login and password are entered as they are; the small model uses the DeepSeek key or, failing that, the Anthropic one. Settings tells you, for each missing key, the name to write in the `.env` file.',
          'All the documentation is also on GitHub, in Markdown, copied from the site with every update.',
        ],
      },
      { type: 'h2', id: '2026-11-20', texte: '20 November 2026' },
      {
        type: 'liste',
        items: [
          '**Tracked pages**: paste the address of a page of the brand; the tool reads it, suggests the prompts it answers (keep, edit, remove, or add your own by hand), then tells you, AI by AI, whether the answers to those prompts cite it and what they cite instead.',
          '**Quick search** (⌘ K) also finds pages, by part of their address or title.',
          '**Start from a page** on the Prompts screen, and **Track** on the brand’s pages in Sources.',
        ],
      },
      { type: 'h2', id: '2026-11-19', texte: '19 November 2026' },
      {
        type: 'liste',
        items: [
          '**Share with a client**: a private page, with no account, on a set of prompts, showing the brand AI by AI, the trend and the detail of each answer. It updates with every run, counts its openings and turns off in one click (**Shares** screen, or **Share** on the ticked prompts).',
          '**Invite a person** from **Settings › Accounts**: they get a personal link, valid for seven days, to choose a password. No password ever travels by e-mail. The same button makes a new link when someone forgets theirs.',
          '**My password**, in Settings: everyone can change their own.',
          '**Remove access** in one confirmed click, in Settings › Accounts.',
        ],
      },
      { type: 'h2', id: '2026-11-18', texte: '18 November 2026' },
      {
        type: 'liste',
        items: [
          '**Documentation and use cases** on the public site, in French and English: every screen of the tool described, with screenshots showing sample data.',
          'An automatic check flags any tool screen that no documentation page describes: the docs follow the tool.',
        ],
      },
      { type: 'h2', id: '2026-11-15', texte: '15 November 2026' },
      {
        type: 'liste',
        items: [
          '**The brand’s social profiles**: a LinkedIn, Instagram, Facebook, X, TikTok, Pinterest, Threads, Bluesky or GitHub profile can be declared as a property. A page cited under that profile counts for the brand.',
          '**Detect from the site**: when creating a project and on its page, this button reads the site’s home page for free and suggests the profiles and YouTube channels found. Nothing is added without review, and what is already declared is not suggested again.',
          '**Videos & channels** rebuilt in three blocks: your channels, one card per declared channel; prompt by prompt, with thumbnails and the channel of the cited video; the other channels cited. A single counting unit: the recorded answer.',
          'Claude can be recorded through its API again.',
        ],
      },
      { type: 'h2', id: '2026-11-14', texte: '14 November 2026' },
      {
        type: 'liste',
        items: [
          '**Projects**: create a brand from the tool, with its sites, channels, competitors and prompts; pick it at the top of the menu; start a run in one click, with the price of each AI shown before sending.',
          '**Automatic runs**: every week for ChatGPT, Gemini and Google, every two weeks for Claude, once turned on from the project page.',
          '**Automatic reading of answers** by a small model: brands mentioned, position and tone, for every AI.',
          '**Actions**: a work list drawn from the runs, with a status per line, a note, an outreach log and the before-and-after comparison of a completed action.',
          '**Page audit** (free reading: crawler access, text without JavaScript, headings, structured data, date, author) and **CSV exports**.',
          '**New screens** in the site’s visual identity: overview, prompts and a prompt’s page, answers, competitors, sources, videos, AI Overviews & Google, actions, fact checks, report, settings, costs.',
          '**Sources**: each site’s type and owning brand (Classify the sites button), sources going up and down.',
          '**Prompts**: tags (topic and intent), topic map, selection of several prompts, deep measurement of a prompt.',
          '**Fact checks** and the **report** with its alerts; markers and the margin-of-error band on charts; a “Versus” competitor filter in the top bar.',
          '**Interface**: foldable menu that collapses to icons, top bar with the period and the AIs, quick search (⌘ K or Ctrl K), sortable tables, phone layout, interface in French or English, redesigned sign-in page.',
          '**Public site** complete, in French and English, with screens showing sample data.',
        ],
      },
      { type: 'h2', id: '2026-11-12', texte: '12 November 2026' },
      {
        type: 'liste',
        items: [
          '**First runs**: ChatGPT, Gemini, Google AI Mode and AI Overviews, recorded from their interface, from the project’s country.',
          '**Claude** queried through its API, with web search on, and counted separately.',
          '**YouTube channels**: a cited video is attached to its channel; if the channel belongs to the brand, the citation counts for it.',
          '**Accounts** with closed sign-up, a **cost journal** with a monthly cap, and an **Admin** section for costs.',
          'Run schedule set: every week, and every two weeks for Claude. Live on geotrends.io.',
        ],
      },
      {
        type: 'liens',
        items: [
          { page: 'demarrer/quest-ce-que-geotrends' },
          { page: 'reference/ia-suivies' },
        ],
      },
    ],
  },
}

export default page
