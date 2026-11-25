import type { PageDoc } from '../../types'

// Onglet « Relevés » de /projets/[id] : LancerReleve.tsx (prix par IA, total,
// plafond, confirmation), action lancerReleve (src/app/(app)/projets/actions.ts),
// collecte des réponses (src/lib/releves.ts, releves/Actualisation.tsx) et
// « Journal des envois ».
const page: PageDoc = {
  id: 'projet/lancer-un-releve',
  rubrique: 'projet',
  slug: { fr: 'projet/lancer-un-releve', en: 'project/start-a-run' },
  titre: { fr: 'Lancer un relevé', en: 'Start a run' },
  resume: {
    fr: 'Un relevé pose les questions du projet aux IA cochées. Le prix de chaque IA s’affiche avant l’envoi, le plafond du mois est vérifié : rien ne part sans votre clic.',
    en: 'A run asks the project’s prompts to the AIs you tick. Each AI’s price is shown before sending and the monthly cap is checked: nothing leaves without your click.',
  },
  ecrans: ['/projets/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Un relevé est l’envoi de toutes les questions actives du projet aux IA que vous choisissez. Chaque couple question et IA donne un relevé : une réponse, avec ses sources, gardée en base. C’est la seule étape payante de la mesure. L’écran sert à décider d’un envoi en voyant son prix, IA par IA, avant de payer.' },
      { type: 'p', texte: 'Pour y aller : l’onglet **Relevés** de la fiche du projet, celui qui s’ouvre par défaut. Le bouton **Lancer un relevé** de la barre du haut, sur les écrans de mesure, y mène, comme les boutons **Préparer un relevé** des écrans vides. Pour quelques questions seulement, cochez-les sur l’écran Questions ; pour poser une question plusieurs fois, voir [Mesure approfondie](doc:mesurer/mesure-approfondie).' },
      { type: 'capture', nom: 'projet-releves', legende: 'L’onglet Relevés du projet Facturo : une ligne par IA avec sa méthode et son prix, le total de l’envoi, puis la dépense du mois après l’envoi.' },
      { type: 'h2', id: 'tableau-prix', texte: 'Le tableau des prix' },
      { type: 'p', texte: 'Une ligne par IA, avec une case à cocher. Les quatre IA relevées par l’interface sont cochées d’office ; Claude, interrogé par son API et bien plus cher, ne l’est pas. Le total se recalcule à chaque case cochée.' },
      {
        type: 'tableau',
        colonnes: ['Colonne', 'Ce qu’elle dit'],
        lignes: [
          ['**IA**', 'ChatGPT, Gemini, Mode IA de Google, Aperçus IA de Google, puis Claude, séparé par un filet.'],
          ['**Méthode**', '« interface », ce que voit l’internaute, ou « API », la réponse du modèle seul.'],
          ['**Dernier relevé**', 'La date du dernier envoi à cette IA, ou « jamais relevée ». Si le dernier envoi date de moins de 7 jours (14 pour Claude), une ligne rouge donne le rythme conseillé : « dans 3 jours », par exemple.'],
          ['**Prix par question**', '0,0012 $ pour une IA d’interface, le prix renvoyé par le fournisseur. Pour Claude, la moyenne de ce qu’ont réellement coûté ses 30 derniers relevés ; avant le premier, une estimation de 0,06 $.'],
          ['**Pour n questions**', 'Le prix pour toutes les questions du projet, ou « non cochée ».'],
          ['**Total de cet envoi**', 'Le nombre d’IA × le nombre de questions = le nombre d’envois, et leur prix.'],
        ],
      },
      { type: 'p', texte: 'Sous le tableau, une phrase et une jauge disent ce que deviendra la dépense du mois : ce qui est déjà dépensé en trait plein, cet envoi en hachures, sur le plafond du mois. La même ligne estime ce qu’ajoutera la lecture automatique des réponses, environ 0,0008 $ par réponse. Si l’envoi doit dépasser le plafond, l’écran l’écrit en rouge.' },
      { type: 'capture', nom: 'projet-prix', legende: 'Le tableau des prix avant l’envoi : une ligne par IA, sa méthode, son prix par question et le total, puis la dépense du mois après l’envoi.' },
      { type: 'h2', id: 'envoyer', texte: 'Envoyer' },
      { type: 'p', texte: 'Le bouton porte le prix : **Lancer le relevé : 0,0480 $**, par exemple. Au-dessus du seuil de confirmation (1 $ par défaut, réglable dans Réglages), une fenêtre demande de confirmer, avec le nombre d’envois et les IA concernées : **Confirmer l’envoi**. Chaque envoi est inscrit au journal des coûts, avec le prix renvoyé par le fournisseur, qu’il réussisse ou non.' },
      { type: 'encadre', ton: 'savoir', titre: 'Le plafond du mois', texte: 'Si la dépense du mois a déjà atteint le plafond (20 $ par défaut, réglé par un administrateur dans Administration › Coûts), rien ne part et un bandeau le dit. Un envoi qui ferait seulement dépasser le plafond part quand même, après l’avertissement en rouge : c’est à vous de décocher une IA si vous ne voulez pas le dépasser.' },
      { type: 'h2', id: 'retour', texte: 'Le retour des réponses' },
      { type: 'p', texte: 'Après l’envoi, l’onglet affiche « Relevé envoyé. », le nombre de réponses revenues sur le nombre d’envois et une barre d’avancement. Les IA d’interface répondent en quelques minutes, 45 au plus ; Claude répond en une à deux minutes par lot, et ses réponses s’ajoutent ensuite. Tant que des réponses sont attendues, l’écran se met à jour tout seul pendant dix minutes. Au-delà, le bouton **Récupérer les réponses** va les lire, gratuitement, et la tâche de fond du serveur le fait de toute façon toutes les demi-heures.' },
      {
        type: 'tableau',
        colonnes: ['État d’un relevé', 'Ce qu’il veut dire', 'Dans les chiffres'],
        lignes: [
          ['**Réponse revenue**', 'La réponse est là, avec ses sources.', 'Compte, que la marque y soit ou non.'],
          ['**Sans réponse d’IA**', 'L’IA n’a rien affiché. Pour les Aperçus IA : Google n’a pas montré d’aperçu sur cette question.', 'Écarté : ce n’est pas une absence de la marque.'],
          ['**En attente**', 'La question est partie, la réponse n’est pas encore revenue.', 'Pas encore.'],
          ['**En échec**', 'Le fournisseur n’a pas pu relever la réponse, ou elle n’est jamais arrivée après six heures d’attente.', 'Ne compte pas. La question est posée de nouveau au relevé suivant.'],
        ],
      },
      { type: 'h2', id: 'journal', texte: 'Le journal des envois' },
      { type: 'p', texte: 'En bas de l’onglet, **Journal des envois** garde une ligne par jour et par IA : la **Date**, l’**IA** (un clic ouvre ses réponses), la **Méthode**, le nombre de **Questions**, puis les **Réponses revenues**, **Sans réponse d’IA**, **En attente** et **En échec**, et le **Coût**. Quand une question a été posée plusieurs fois le même jour, la colonne Questions le précise (« 30 envois »). En tête du bloc : le nombre total d’envois du projet et leur prix.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Le premier relevé de Facturo' },
      {
        type: 'etapes',
        items: [
          { titre: 'Ouvrir l’onglet Relevés', texte: 'Depuis la fiche du projet, ou par **Lancer un relevé** dans la barre du haut.' },
          { titre: 'Choisir les IA', texte: 'Gardez les quatre IA d’interface. Cochez Claude si vous voulez aussi la réponse du modèle seul : son prix s’ajoute au total.' },
          { titre: 'Lire le total et la jauge', texte: 'Pour dix questions et quatre IA d’interface : 40 envois à 0,0012 $, soit 0,0480 $, plus environ 0,0320 $ de lecture automatique.' },
          { titre: 'Lancer', texte: 'Cliquez sur le bouton qui porte le prix. Confirmez si la fenêtre s’ouvre.' },
          { titre: 'Attendre le retour', texte: 'Restez sur l’onglet ou revenez plus tard : la barre d’avancement se remplit. Quand tout est revenu, **Voir les réponses** ouvre l’écran Questions.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Un relevé donne une réponse par question et par IA : un échantillon, pas une vérité. La même question donne des réponses différentes d’un jour à l’autre, d’où l’intérêt de relever chaque semaine. Le prix de Claude est une moyenne : un relevé précis peut coûter un peu plus ou un peu moins, et le journal des coûts garde le prix réel. Un relevé lancé ne s’annule pas.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/releves-automatiques' },
          { page: 'demarrer/couts' },
          { page: 'piloter/couts' },
          { page: 'cas/budget-de-suivi' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'A run sends every active prompt of the project to the AIs you choose. Each prompt and AI pair gives one reading: an answer, with its sources, kept in the database. It is the only paid step of the measurement. This screen is where you decide on a run while seeing its price, AI by AI, before paying.' },
      { type: 'p', texte: 'To get there: the **Runs** tab of the project page, the one that opens by default. The **Start a run** button of the top bar, on measurement screens, leads there, as do the **Prepare a run** buttons of empty screens. For a few prompts only, tick them on the Prompts screen; to ask one prompt several times, see [Deep measurement](doc:mesurer/mesure-approfondie).' },
      { type: 'capture', nom: 'projet-releves', legende: 'The Runs tab of the Facturo UK project: one row per AI with its method and price, the total of the run, then the month’s spend after the run.' },
      { type: 'h2', id: 'price-table', texte: 'The price table' },
      { type: 'p', texte: 'One row per AI, with a checkbox. The four AIs read through the interface are ticked by default; Claude, queried through its API and much more expensive, is not. The total updates with every box you tick.' },
      {
        type: 'tableau',
        colonnes: ['Column', 'What it says'],
        lignes: [
          ['**AI**', 'ChatGPT, Gemini, Google AI Mode, Google AI Overviews, then Claude, set apart by a rule.'],
          ['**Method**', '“interface”, what the user sees, or “API”, the model’s answer alone.'],
          ['**Last run**', 'The date of the last run sent to this AI, or “never run”. If the last run is less than 7 days old (14 for Claude), a red line gives the recommended pace: “in 3 days”, for example.'],
          ['**Price per prompt**', '$0.0012 for an interface AI, the price returned by the provider. For Claude, the average of what its last 30 readings actually cost; before the first one, an estimate of $0.06.'],
          ['**For n prompts**', 'The price for all the project’s prompts, or “not selected”.'],
          ['**Total for this run**', 'The number of AIs × the number of prompts = the number of requests, and their price.'],
        ],
      },
      { type: 'p', texte: 'Under the table, a sentence and a gauge show what the month’s spend will become: what is already spent as a solid line, this run as hatching, against the monthly cap. The same line estimates what the automatic reading of the answers will add, about $0.0008 per answer. If the run would exceed the cap, the screen says so in red.' },
      { type: 'capture', nom: 'projet-prix', legende: 'The price table before sending: one row per AI, its method, its price per prompt and the total, then the month’s spending after the run.' },
      { type: 'h2', id: 'send', texte: 'Sending' },
      { type: 'p', texte: 'The button carries the price: **Start the run: $0.0480**, for example. Above the confirmation threshold ($1 by default, set in Settings), a window asks you to confirm, with the number of requests and the AIs concerned: **Confirm sending**. Every request is logged in the cost journal, with the price returned by the provider, whether it succeeds or not.' },
      { type: 'encadre', ton: 'savoir', titre: 'The monthly cap', texte: 'If the month’s spend has already reached the cap ($20 by default, set by an admin in Admin › Costs), nothing is sent and a banner says so. A run that would only push spending over the cap is still sent, after the red warning: untick an AI if you do not want to go over.' },
      { type: 'h2', id: 'answers-back', texte: 'Answers coming back' },
      { type: 'p', texte: 'After sending, the tab shows “Run sent.”, the number of answers back out of the number of requests, and a progress bar. Interface AIs answer within minutes, 45 at most; Claude answers in one to two minutes per batch, and its answers are added afterwards. While answers are expected, the screen refreshes by itself for ten minutes. After that, the **Collect the answers** button fetches them, for free, and the server’s background task does it anyway every half hour.' },
      {
        type: 'tableau',
        colonnes: ['Reading status', 'What it means', 'In the numbers'],
        lignes: [
          ['**Answer back**', 'The answer is there, with its sources.', 'Counts, whether the brand is in it or not.'],
          ['**No AI answer**', 'The AI displayed nothing. For AI Overviews: Google showed no overview on this prompt.', 'Left out: it is not an absence of the brand.'],
          ['**Pending**', 'The prompt has gone out, the answer has not come back yet.', 'Not yet.'],
          ['**Failed**', 'The provider could not record the answer, or it never arrived after six hours of waiting.', 'Does not count. The prompt is asked again at the next run.'],
        ],
      },
      { type: 'h2', id: 'send-log', texte: 'The send log' },
      { type: 'p', texte: 'At the bottom of the tab, **Send log** keeps one row per day and per AI: the **Date**, the **AI** (a click opens its answers), the **Method**, the number of **Prompts**, then **Answers back**, **No AI answer**, **Pending** and **Failed**, and the **Cost**. When a prompt was asked several times on the same day, the Prompts column says so (“30 requests”). At the top of the block: the project’s total number of requests and their price.' },
      { type: 'h2', id: 'step-by-step', texte: 'Facturo’s first run' },
      {
        type: 'etapes',
        items: [
          { titre: 'Open the Runs tab', texte: 'From the project page, or with **Start a run** in the top bar.' },
          { titre: 'Choose the AIs', texte: 'Keep the four interface AIs. Tick Claude if you also want the model’s answer alone: its price is added to the total.' },
          { titre: 'Read the total and the gauge', texte: 'For ten prompts and four interface AIs: 40 requests at $0.0012, that is $0.0480, plus about $0.0320 of automatic reading.' },
          { titre: 'Start', texte: 'Click the button that carries the price. Confirm if the window opens.' },
          { titre: 'Wait for the answers', texte: 'Stay on the tab or come back later: the progress bar fills up. When everything is back, **See the answers** opens the Prompts screen.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'A run gives one answer per prompt and per AI: a sample, not the truth. The same prompt gets different answers from one day to the next, which is why running every week matters. Claude’s price is an average: a given run may cost slightly more or less, and the cost journal keeps the real price. A run that has been sent cannot be cancelled.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/releves-automatiques' },
          { page: 'demarrer/couts' },
          { page: 'piloter/couts' },
          { page: 'cas/budget-de-suivi' },
        ],
      },
    ],
  },
}

export default page
