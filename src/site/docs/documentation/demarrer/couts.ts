import type { PageDoc } from '../../types'

// Les prix de l'outil, tirés du code : src/lib/estimation.ts (relevés),
// src/lib/analyse.ts (lecture, faits), src/lib/etiquettes.ts, src/lib/sites.ts,
// src/lib/couts.ts (plafond, seuil), src/app/(app)/projets/[id]/page.tsx (estimation mensuelle).
const page: PageDoc = {
  id: 'demarrer/couts',
  rubrique: 'demarrer',
  slug: { fr: 'demarrer/couts', en: 'get-started/costs' },
  titre: { fr: 'Ce que coûte un relevé', en: 'What a run costs' },
  resume: {
    fr: 'Le prix de chaque appel payant, ce qui est gratuit, le plafond du mois et le seuil de confirmation, avec des exemples de budget pour 10 et 50 questions par mois.',
    en: 'The price of each paid call, what is free, the monthly cap and the confirmation threshold, with budget examples for 10 and 50 prompts tracked each month.',
  },
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'GeoTrends ne coûte que ce qu’il appelle : chaque relevé et chaque lecture par un petit modèle sont facturés en dollars par le fournisseur, et chacun est inscrit au journal des coûts avec son prix. Le prix d’un envoi est toujours écrit sur son bouton, avant le clic. Aucune dépense ne part sans votre accord, sauf celles que vous avez activées (relevés automatiques, classement des nouveaux sites, étiquetage des nouvelles questions).' },
      { type: 'h2', id: 'prix', texte: 'Ce qui est payant' },
      {
        type: 'tableau',
        colonnes: ['Appel', 'Prix', 'Quand'],
        lignes: [
          ['Relevé d’interface (ChatGPT, Gemini, Mode IA, Aperçus IA)', '0,0012 $ par question et par IA, prix renvoyé par le fournisseur', 'À chaque relevé, manuel ou automatique'],
          ['Relevé de Claude, par son API', 'Le prix moyen réellement payé sur les 30 derniers appels réussis (0,06 $ par question tant qu’aucun n’a été mesuré)', 'Quand Claude est coché, ou toutes les deux semaines s’il est automatique'],
          ['Lecture d’une réponse (marques, rang, ton)', 'Environ 0,0008 $ par réponse', 'Toute seule pour les réponses nouvelles ; sur clic pour les autres'],
          ['Comparaison aux faits vérifiés', 'Environ 0,0006 $ par réponse relue', 'Sur clic ; ensuite pendant la lecture, sans appel en plus'],
          ['Étiquette d’une question (thème, intention)', 'Environ 0,00008 $ par question', 'Sur clic, puis à chaque question ajoutée'],
          ['Type d’un site cité', 'Environ 0,00005 $ par site, une seule fois par site', 'Sur clic, puis pour chaque nouveau site'],
        ],
      },
      { type: 'h2', id: 'gratuit', texte: 'Ce qui est gratuit' },
      {
        type: 'liste',
        items: [
          'Créer un projet, ajouter des questions, des concurrents, des faits vérifiés.',
          'Récupérer les réponses d’un relevé : seul l’envoi est facturé.',
          'Ouvrir n’importe quel écran : tout est lu dans la base.',
          'La fiche des vidéos YouTube citées, la détection des réseaux sociaux depuis le site, l’audit d’une page, les exports CSV.',
        ],
      },
      { type: 'h2', id: 'exemples', texte: 'Exemples de budget' },
      {
        type: 'tableau',
        colonnes: ['Situation', 'Calcul', 'Ordre de grandeur'],
        lignes: [
          ['Un relevé de 10 questions sur 4 IA d’interface', '40 relevés × 0,0012 $, plus 40 lectures × 0,0008 $', 'environ 0,08 $'],
          ['Une mesure approfondie : une question 10 fois sur 4 IA', '40 relevés × 0,0012 $, plus la lecture', 'environ 0,08 $'],
          ['50 questions chaque semaine, interface seule', '50 × 4 IA × (0,0012 $ + 0,0008 $) × 4,33 semaines', 'environ 1,75 $ par mois'],
          ['Les mêmes 50 questions à Claude, toutes les deux semaines', '50 × (0,06 $ + 0,0008 $) × 2,17 passages', 'environ 6,60 $ par mois'],
        ],
      },
      { type: 'p', texte: 'Ces estimations sont celles qu’affiche l’outil : sur l’onglet Relevés d’un projet, à côté de chaque relevé automatique, et sur l’écran Réglages, projet par projet. Claude coûte une cinquantaine de fois plus cher qu’un relevé d’interface : c’est pourquoi il est décoché par défaut et relevé deux fois moins souvent.' },
      { type: 'h2', id: 'garde-fous', texte: 'Les deux garde-fous' },
      {
        type: 'tableau',
        colonnes: ['Réglage', 'Par défaut', 'Ce qu’il fait'],
        lignes: [
          ['**Plafond mensuel**', '20 $', 'Quand la dépense du mois l’atteint, plus aucun appel payant ne part : les relevés automatiques se suspendent et un relevé manuel est refusé, jusqu’au mois suivant ou jusqu’à ce que le plafond soit relevé. Il se règle dans **Administration › Coûts**.'],
          ['**Seuil de confirmation**', '1 $', 'Au-dessus de ce montant, une fenêtre demande de confirmer l’envoi, en plus du prix écrit sur le bouton. Il se règle dans **Réglages**.'],
        ],
      },
      { type: 'encadre', ton: 'limite', texte: 'Le plafond est vérifié avant l’envoi, pas contre le prix de l’envoi : un relevé lancé juste sous le plafond part, et peut le dépasser. L’onglet Relevés le signale en rouge avant le clic (« Cet envoi dépasserait le plafond du mois »). Les prix des petits modèles et de Claude sont calculés depuis la grille de tarifs quand le fournisseur ne les renvoie pas ; le journal les marque d’un astérisque.' },
      {
        type: 'liens',
        items: [
          { page: 'piloter/couts' },
          { page: 'projet/releves-automatiques' },
          { page: 'cas/budget-de-suivi' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'GeoTrends only costs what it calls: each reading and each pass of a small model is billed in dollars by the provider, and each is logged in the cost journal with its price. The price of a run is always written on its button, before you click. No spending goes out without your consent, except what you turned on (automatic runs, classification of new sites, tagging of new prompts).' },
      { type: 'h2', id: 'prices', texte: 'What is paid' },
      {
        type: 'tableau',
        colonnes: ['Call', 'Price', 'When'],
        lignes: [
          ['Interface reading (ChatGPT, Gemini, AI Mode, AI Overviews)', '$0.0012 per prompt and per AI, price returned by the provider', 'At every run, manual or automatic'],
          ['Claude reading, through its API', 'The average price actually paid over the last 30 successful calls ($0.06 per prompt until one has been measured)', 'When Claude is ticked, or every two weeks if automatic'],
          ['Reading an answer (brands, position, tone)', 'About $0.0008 per answer', 'Automatically for new answers; on click for the others'],
          ['Comparison with the fact checks', 'About $0.0006 per answer reread', 'On click; then during reading, at no extra call'],
          ['Tagging a prompt (topic, intent)', 'About $0.00008 per prompt', 'On click, then for each prompt added'],
          ['Typing a cited site', 'About $0.00005 per site, once per site', 'On click, then for each new site'],
        ],
      },
      { type: 'h2', id: 'free', texte: 'What is free' },
      {
        type: 'liste',
        items: [
          'Creating a project, adding prompts, competitors and fact checks.',
          'Collecting a run’s answers: only sending is charged.',
          'Opening any screen: everything is read from the database.',
          'The details of cited YouTube videos, detecting social profiles from the site, the page audit, CSV exports.',
        ],
      },
      { type: 'h2', id: 'examples', texte: 'Budget examples' },
      {
        type: 'tableau',
        colonnes: ['Situation', 'Calculation', 'Order of magnitude'],
        lignes: [
          ['One run of 10 prompts on 4 interface AIs', '40 readings × $0.0012, plus 40 reads × $0.0008', 'about $0.08'],
          ['A deep measurement: one prompt 10 times on 4 AIs', '40 readings × $0.0012, plus reading', 'about $0.08'],
          ['50 prompts every week, interface only', '50 × 4 AIs × ($0.0012 + $0.0008) × 4.33 weeks', 'about $1.75 a month'],
          ['The same 50 prompts to Claude, every two weeks', '50 × ($0.06 + $0.0008) × 2.17 runs', 'about $6.60 a month'],
        ],
      },
      { type: 'p', texte: 'These estimates are the ones the tool shows: in a project’s Runs tab, next to each automatic run, and on the Settings screen, project by project. Claude costs about fifty times more than an interface reading: that is why it is unticked by default and recorded half as often.' },
      { type: 'h2', id: 'safeguards', texte: 'The two safeguards' },
      {
        type: 'tableau',
        colonnes: ['Setting', 'Default', 'What it does'],
        lignes: [
          ['**Monthly cap**', '$20', 'When the month’s spending reaches it, no paid call goes out: automatic runs are suspended and a manual run is refused, until next month or until the cap is raised. It is set in **Admin › Costs**.'],
          ['**Confirmation threshold**', '$1', 'Above this amount, a window asks you to confirm the run, on top of the price written on the button. It is set in **Settings**.'],
        ],
      },
      { type: 'encadre', ton: 'limite', texte: 'The cap is checked before sending, not against the price of the run: a run started just under the cap goes out and can exceed it. The Runs tab flags this in red before you click (“This would exceed the monthly cap.”). Prices of the small models and of Claude are calculated from the rate card when the provider does not return them; the journal marks them with an asterisk.' },
      {
        type: 'liens',
        items: [
          { page: 'piloter/couts' },
          { page: 'projet/releves-automatiques' },
          { page: 'cas/budget-de-suivi' },
        ],
      },
    ],
  },
}

export default page
