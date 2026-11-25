// Cas d'usage : préparer la réunion d'équipe du lundi avec le rapport, les alertes et les exports.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/point-du-lundi',
  rubrique: 'mesurer-l-effet',
  slug: { fr: 'point-du-lundi', en: 'monday-team-meeting' },
  titre: {
    fr: 'Comment préparer le point du lundi avec l’équipe ?',
    en: 'How do I prepare the Monday team meeting?',
  },
  resume: {
    fr: 'Le rapport compare les deux derniers relevés, la liste de travail dit quoi faire, les exports donnent les données : un ordre du jour en un quart d’heure, sans bruit.',
    en: 'The report compares the last two runs, the work list says what to do, the exports hold the data: an agenda in fifteen minutes, without the noise.',
  },
  ecrans: ['/rapport', '/vue', '/actions', '/admin/couts'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Chaque lundi, l’équipe de Facturo passe un quart d’heure sur sa présence dans les IA. Sans préparation, la réunion commente le moindre point de visibilité gagné ou perdu. Avec le rapport, elle part de ce qui a vraiment changé, et finit sur qui fait quoi cette semaine.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Au moins deux jours de relevé : le rapport compare les deux derniers. Avec les relevés automatiques activés, ils arrivent chaque semaine sans y penser.',
          'Une liste de travail à jour : les états des actions, leurs notes et leurs prises de contact.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Partir du rapport',
            texte: 'Ouvrez **Rapport**. Il compare les deux derniers jours de relevé du projet, sans tenir compte des filtres des autres écrans. En tête, **Au-dessus de la marge d’erreur** : les seuls changements qu’on peut tenir pour réels. Viennent ensuite les tuiles (**Présence de la marque**, **Présences gagnées**, **Présences perdues**, **Nouvelles marques**, **Dépense de la période**) et **Présence de la marque, IA par IA**.',
            capture: 'rapport',
          },
          {
            titre: 'Lire les indices, sans s’y arrêter',
            texte: '**Présence gagnée ou perdue, question par question**, **Marques nommées pour la première fois** et **Sources gagnées et perdues** donnent des pistes. Avec une seule réponse par question et par IA à chaque date, ce sont des indices : notez ceux qui reviennent d’une semaine à l’autre, ou lancez une mesure approfondie sur la question.',
          },
          {
            titre: 'Fixer les actions de la semaine',
            texte: 'Le bloc **Les trois actions les plus utiles** reprend la tête de la liste de travail. Sur **Actions**, passez en revue les lignes **En cours**, leurs **Prises de contact** et les réponses reçues ; décidez qui reprend quoi, et passez à **Fait** ce qui l’est. L’onglet **Résultats** montre l’avant et l’après des actions déjà faites.',
            capture: 'actions',
          },
          {
            titre: 'Exporter ce qu’il faut garder',
            texte: 'Le bouton **Exporter** de la barre du haut télécharge les données de l’écran en CSV : une ligne par réponse relevée depuis **Vue d’ensemble** ou **Questions**, les sources depuis **Sources**, la liste de travail depuis **Actions**. Chaque graphique a aussi son propre téléchargement. Les comptes administrateurs exportent tous les appels payants depuis **Coûts**.',
          },
          {
            titre: 'Voir l’e-mail du lundi',
            texte: 'En bas du rapport, **Recevoir ce rapport par e-mail** montre la version courte prévue pour l’équipe, avec **Voir l’e-mail tel qu’il sera envoyé**. Aujourd’hui, l’e-mail ne part pas : la clé du service d’envoi n’est pas installée, et l’écran le dit. Le rapport se lit sur l’écran, ou se partage par ses exports.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'L’ordre du jour : ce qui a changé au-delà de la marge, et pourquoi on le pense ; les trois actions de la semaine et leurs responsables ; les démarches à relancer. Le reste attend le relevé suivant.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Le rapport compare deux dates, pas deux périodes : pour une tendance, lisez **Vue d’ensemble** sur quatre ou huit semaines. Les mesures approfondies n’entrent pas dans sa comparaison. Il n’existe ni export PDF ni lien de partage public : les exports sont des fichiers CSV, et l’outil reste réservé aux comptes de l’équipe.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'piloter/rapport-et-alertes' },
          { page: 'piloter/exports' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/evolution-ou-bruit' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Every Monday, the Facturo UK team spends fifteen minutes on its presence in AI answers. Without preparation, the meeting comments on every point of visibility gained or lost. With the report, it starts from what really changed, and ends with who does what this week.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'At least two run days: the report compares the last two. With automatic runs turned on, they arrive every week without a thought.',
          'An up-to-date work list: action statuses, their notes and their outreach.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Start from the report',
            texte: 'Open **Report**. It compares the project’s last two run days, ignoring the filters of the other screens. At the top, **Beyond the margin of error**: the only changes that can be taken as real. Then come the tiles (**Brand presence**, **Presence gained**, **Presence lost**, **New brands**, **Spend of the period**) and **Brand presence, AI by AI**.',
            capture: 'rapport',
          },
          {
            titre: 'Read the clues, without dwelling on them',
            texte: '**Presence gained or lost, prompt by prompt**, **Brands mentioned for the first time** and **Sources gained and lost** give leads. With one answer per prompt and per AI at each date, these are clues: note the ones that recur from week to week, or run a deep measurement on the prompt.',
          },
          {
            titre: 'Set the week’s actions',
            texte: 'The block **The three most useful actions** takes the top of the work list. On **Actions**, go through the rows **In progress**, their **Outreach** and the replies received; decide who picks up what, and set to **Done** whatever is. The **Results** tab shows the before and after of actions already done.',
            capture: 'actions',
          },
          {
            titre: 'Export what you need to keep',
            texte: 'The **Export** button in the top bar downloads the screen’s data as CSV: one row per captured answer from **Overview** or **Prompts**, the sources from **Sources**, the work list from **Actions**. Each chart also has its own download. Admin accounts export every paid call from **Costs**.',
          },
          {
            titre: 'See the Monday e-mail',
            texte: 'At the bottom of the report, **Get this report by e-mail** shows the short version planned for the team, with **See the e-mail as it will be sent**. Today, the e-mail is not sent: the sending service key is not installed, and the screen says so. The report is read on screen, or shared through its exports.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'The agenda: what changed beyond the margin, and why you think so; the three actions of the week and who owns them; the outreach to follow up. Everything else waits for the next run.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'The report compares two dates, not two periods: for a trend, read **Overview** over four or eight weeks. Deep measurements are left out of its comparison. There is no PDF export and no public share link: exports are CSV files, and the tool remains limited to the team’s accounts.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'piloter/rapport-et-alertes' },
          { page: 'piloter/exports' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/evolution-ou-bruit' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
  },
}

export default page
