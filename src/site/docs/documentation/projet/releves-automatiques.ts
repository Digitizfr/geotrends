import type { PageDoc } from '../../types'

// Bloc « Relevés automatiques » de l'onglet Relevés de /projets/[id], bloc
// « Rythme des relevés » de /reglages, action reglerAuto et tâche de fond
// src/lib/taches.ts (toutes les demi-heures).
const page: PageDoc = {
  id: 'projet/releves-automatiques',
  rubrique: 'projet',
  slug: { fr: 'projet/releves-automatiques', en: 'project/scheduled-runs' },
  titre: { fr: 'Relevés automatiques', en: 'Automatic runs' },
  resume: {
    fr: 'Chaque semaine pour ChatGPT, Gemini et Google, toutes les deux semaines pour Claude : les relevés partent seuls et s’arrêtent si le plafond du mois est atteint.',
    en: 'Every week for ChatGPT, Gemini and Google, every two weeks for Claude: once ticked, runs start on their own and pause when the monthly cap is reached.',
  },
  ecrans: ['/projets/[id]', '/reglages'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Une réponse d’IA est un échantillon : c’est la répétition, semaine après semaine, qui fait une tendance. Les relevés automatiques donnent des séries régulières sans que personne n’ait à y penser. Le rythme est fixé : chaque semaine pour les quatre IA relevées par l’interface, toutes les deux semaines pour Claude, plus cher à interroger. Rien n’est activé par défaut : vous décidez, projet par projet.' },
      { type: 'p', texte: 'Pour y aller : le bloc **Relevés automatiques** de l’onglet Relevés, sur la fiche du projet. Le bloc **Rythme des relevés** de l’écran Réglages règle les mêmes cases pour tous les projets à la fois.' },
      { type: 'h2', id: 'cases', texte: 'Les deux cases' },
      {
        type: 'tableau',
        colonnes: ['Case', 'Ce qui part', 'Estimation affichée'],
        lignes: [
          ['**Chaque semaine : ChatGPT, Gemini, Mode IA et Aperçus IA de Google**', 'Toutes les questions actives du projet, aux quatre IA d’interface, sept jours après l’envoi automatique précédent.', 'Questions × 4 IA × (0,0012 $ de relevé + 0,0008 $ de lecture) × 4,33 semaines. Pour 10 questions : environ 0,35 $ par mois.'],
          ['**Toutes les deux semaines : Claude**', 'Toutes les questions actives, à Claude par son API, quatorze jours après l’envoi précédent.', 'Questions × (prix moyen d’une question à Claude + lecture) × 2,17. Pour 10 questions, avec l’estimation de 0,06 $ : environ 1,32 $ par mois.'],
        ],
      },
      { type: 'p', texte: 'Cochez, puis **Enregistrer**. Le bloc affiche « activés » ou « aucun pour l’instant », et sous chaque case la date du dernier envoi automatique. Le premier part dans la demi-heure qui suit l’activation.' },
      { type: 'capture', nom: 'reglages-rythme', legende: 'L’écran Réglages : le bloc Rythme des relevés réunit les relevés automatiques de tous les projets, avec l’estimation du mois face au plafond.' },
      { type: 'h2', id: 'rythme-reglages', texte: 'Tous les projets dans Réglages' },
      { type: 'p', texte: 'Dans **Rythme des relevés**, une ligne par projet : son marché, son nombre de questions, puis les cases **Chaque semaine** (4 IA, interface) et **Toutes les deux semaines** (Claude, API), chacune avec son estimation par mois et, si elle est cochée, la date du prochain envoi (« dans la demi-heure », ou une date). En tête du bloc, le total estimé de tous les projets face au plafond du mois ; un administrateur peut **Changer le plafond** d’un clic.' },
      { type: 'h2', id: 'tache-de-fond', texte: 'Ce que fait le serveur toutes les demi-heures' },
      {
        type: 'liste',
        ordonnee: true,
        items: [
          '**Lire les réponses prêtes** des relevés en attente. Gratuit.',
          '**Lancer les relevés dus** : ceux des projets dont la case est cochée et dont le dernier envoi automatique date de sept jours (quatorze pour Claude).',
          '**Lire les réponses récentes** avec le petit modèle : marques nommées, rang, ton. Environ 0,0008 $ par réponse. Seules les réponses de moins de trois jours sont lues ainsi ; les plus anciennes se lisent à la demande, avec le bouton **Lire les réponses** de la vue d’ensemble.',
          '**Classer les nouveaux sites cités**, pour les projets où le classement a été lancé une première fois à la main sur l’écran Sources.',
          '**Envoyer le rapport du lundi** aux projets qui l’ont demandé, gratuitement. Cet envoi ne peut pas être activé tant que la clé du service d’envoi (Resend) n’est pas installée : aujourd’hui, aucun e-mail ne part.',
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Le plafond arrête tout ce qui est payant', texte: 'Avant chaque étape payante, la tâche vérifie la dépense du mois. Si le plafond est atteint, les relevés automatiques, la lecture et le classement sont suspendus, et reprennent seuls au mois suivant, ou dès que le plafond est relevé. La lecture des réponses prêtes, gratuite, continue.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Mettre Facturo en relevé automatique' },
      {
        type: 'etapes',
        items: [
          { titre: 'Faire un premier relevé à la main', texte: 'Il permet de vérifier les questions et les propriétés avant de payer chaque semaine. Voir [Lancer un relevé](doc:projet/lancer-un-releve).' },
          { titre: 'Cocher la case hebdomadaire', texte: 'Dans **Relevés automatiques**, cochez **Chaque semaine** et lisez l’estimation par mois.' },
          { titre: 'Décider pour Claude', texte: 'Cochez **Toutes les deux semaines : Claude** si la réponse du modèle seul vous sert. C’est l’essentiel de la dépense.' },
          { titre: 'Enregistrer et vérifier dans Réglages', texte: 'Le bloc **Rythme des relevés** montre le prochain envoi et le total de tous les projets face au plafond.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Le rythme n’est pas réglable : sept et quatorze jours, avec une heure de marge pour que l’envoi ne glisse pas d’une semaine à l’autre. Un relevé lancé à la main ne décale pas le relevé automatique : la même semaine peut en compter deux. L’estimation par mois suppose le même nombre de questions toute la période. Archiver le projet arrête ses relevés automatiques.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/lancer-un-releve' },
          { page: 'piloter/reglages' },
          { page: 'piloter/couts' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'An AI answer is a sample: repetition, week after week, is what makes a trend. Automatic runs give regular series without anyone having to think about them. The pace is fixed: every week for the four AIs read through the interface, every two weeks for Claude, which is more expensive to query. Nothing is on by default: you decide, project by project.' },
      { type: 'p', texte: 'To get there: the **Automatic runs** block of the Runs tab, on the project page. The **Run schedule** block of the Settings screen sets the same boxes for all projects at once.' },
      { type: 'h2', id: 'boxes', texte: 'The two boxes' },
      {
        type: 'tableau',
        colonnes: ['Box', 'What is sent', 'Estimate shown'],
        lignes: [
          ['**Every week: ChatGPT, Gemini, Google AI Mode and AI Overviews**', 'All the project’s active prompts, to the four interface AIs, seven days after the previous automatic run.', 'Prompts × 4 AIs × ($0.0012 per reading + $0.0008 for reading the answer) × 4.33 weeks. For 10 prompts: about $0.35 a month.'],
          ['**Every two weeks: Claude**', 'All active prompts, to Claude through its API, fourteen days after the previous run.', 'Prompts × (average price of a prompt to Claude + reading) × 2.17. For 10 prompts, with the $0.06 estimate: about $1.32 a month.'],
        ],
      },
      { type: 'p', texte: 'Tick, then **Save**. The block shows “on” or “none yet”, and under each box the date of the last automatic run. The first one starts within half an hour of turning it on.' },
      { type: 'capture', nom: 'reglages-rythme', legende: 'The Settings screen: the Run schedule block gathers the automatic runs of every project, with the month’s estimate against the cap.' },
      { type: 'h2', id: 'schedule-settings', texte: 'All projects in Settings' },
      { type: 'p', texte: 'In **Run schedule**, one row per project: its market, its number of prompts, then the **Every week** (4 AIs, interface) and **Every two weeks** (Claude, API) boxes, each with its monthly estimate and, when ticked, the date of the next run (“within half an hour”, or a date). At the top of the block, the estimated total of all projects against the monthly cap; an admin can **Change the cap** in one click.' },
      { type: 'h2', id: 'background-task', texte: 'What the server does every half hour' },
      {
        type: 'liste',
        ordonnee: true,
        items: [
          '**Fetch the answers that are ready** for pending readings. Free.',
          '**Start the runs that are due**: those of projects whose box is ticked and whose last automatic run is seven days old (fourteen for Claude).',
          '**Read recent answers** with the small model: brands mentioned, position, tone. About $0.0008 per answer. Only answers less than three days old are read this way; older ones are read on demand, with the **Read the answers** button of the overview.',
          '**Classify newly cited sites**, for projects where classification has been started once by hand on the Sources screen.',
          '**Send the Monday report** to projects that asked for it, for free. Sending cannot be turned on until the e-mail service key (Resend) is installed: today, no e-mail goes out.',
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'The cap stops everything that costs money', texte: 'Before each paid step, the task checks the month’s spend. If the cap is reached, automatic runs, reading and classification are paused, and resume on their own the next month, or as soon as the cap is raised. Fetching ready answers, which is free, carries on.' },
      { type: 'h2', id: 'step-by-step', texte: 'Putting Facturo on automatic runs' },
      {
        type: 'etapes',
        items: [
          { titre: 'Do a first run by hand', texte: 'It lets you check the prompts and properties before paying every week. See [Start a run](doc:projet/lancer-un-releve).' },
          { titre: 'Tick the weekly box', texte: 'In **Automatic runs**, tick **Every week** and read the monthly estimate.' },
          { titre: 'Decide about Claude', texte: 'Tick **Every two weeks: Claude** if the model’s answer alone is useful to you. It is most of the spend.' },
          { titre: 'Save and check in Settings', texte: 'The **Run schedule** block shows the next run and the total of all projects against the cap.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'The pace cannot be changed: seven and fourteen days, with one hour of slack so the run does not drift from week to week. A run started by hand does not move the automatic run: the same week can have two. The monthly estimate assumes the same number of prompts over the whole period. Archiving the project stops its automatic runs.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/lancer-un-releve' },
          { page: 'piloter/reglages' },
          { page: 'piloter/couts' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
  },
}

export default page
