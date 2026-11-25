import type { PageDoc } from '../../types'

// Écran /admin/couts (src/app/(app)/admin/couts/page.tsx), journal et plafond
// (src/lib/couts.ts), grille de tarifs (src/lib/tarifs.ts), ligne de dépense du
// menu (src/app/(app)/Cadre.tsx).
const page: PageDoc = {
  id: 'piloter/couts',
  rubrique: 'piloter',
  slug: { fr: 'piloter/couts', en: 'steer/costs' },
  titre: { fr: 'Le tableau des coûts', en: 'The cost dashboard' },
  resume: {
    fr: 'Chaque appel payant est inscrit au journal des coûts. Cet écran en tire la dépense du mois, sa projection, le plafond et le détail par fournisseur et projet.',
    en: 'Every paid call is logged in the cost journal. The Costs screen draws from it the month’s spend, its projection, the cap and the split by provider and project.',
  },
  ecrans: ['/admin/couts'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Chaque appel à une API payante passe par le journal des coûts, avec son prix : un relevé, la lecture d’une réponse, le classement d’un site, l’étiquetage d’une question, la vérification des faits. Cet écran lit ce journal. Il dit combien a été dépensé ce mois-ci, par quoi, pour quel projet, et où le mois va finir. Il sert à fixer le plafond et à repérer une dépense anormale.' },
      { type: 'encadre', ton: 'savoir', titre: 'Réservé aux administrateurs', texte: 'La rubrique **Administration › Coûts** n’apparaît que pour un compte administrateur. Un administrateur voit aussi, en bas du menu, la ligne **Dépense du mois** : la dépense sur le plafond, avec une barre fine ; un clic ouvre cet écran. Un membre qui ouvre l’adresse arrive sur la vue d’ensemble.' },
      { type: 'capture', nom: 'couts', legende: 'L’écran Coûts : le plafond du mois et sa jauge, les chiffres clés, la dépense par jour et les répartitions par fournisseur, par IA, par projet et par type d’appel.' },
      { type: 'h2', id: 'plafond', texte: 'Le plafond du mois' },
      { type: 'p', texte: 'Le mois commence le 1er à minuit, heure de Paris. Le premier bloc donne la dépense du mois sur le plafond (20 $ par défaut), une jauge en trait plein pour ce qui est dépensé et des hachures pour la projection. Le champ **Plafond mensuel (en dollars)** le change, de 0 à 5 000 $, avec **Enregistrer**. Le plafond vaut pour tous les projets ensemble.' },
      {
        type: 'tableau',
        colonnes: ['Situation', 'Ce qui se passe'],
        lignes: [
          ['Sous le plafond', 'Les envois partent. Avant un relevé, la fiche du projet montre la dépense du mois après l’envoi et prévient s’il ferait dépasser le plafond. L’envoi reste possible : le plafond se vérifie avant chaque appel.'],
          ['Plafond atteint', 'Plus aucun appel payant ne part : ni relevé, à la main ou automatique, ni lecture des réponses, ni classement des sites, ni étiquetage, ni vérification des faits. Les relevés planifiés reprennent le mois suivant, ou dès que le plafond est relevé.'],
          ['Projection', 'La dépense du mois prolongée au rythme des jours écoulés. Elle s’affiche après un jour complet. Si elle dépasse le plafond, le bloc le dit.'],
        ],
      },
      { type: 'h2', id: 'chiffres-cles', texte: 'Les chiffres clés' },
      {
        type: 'tableau',
        colonnes: ['Tuile', 'Ce qu’elle compte'],
        lignes: [
          ['**Dépense du mois**', 'Somme des appels payants inscrits au journal depuis le début du mois, sur le plafond.'],
          ['**Projection fin de mois**', 'La dépense du mois prolongée au rythme actuel.'],
          ['**Dernières 24 h**', 'Appels payants des vingt-quatre dernières heures.'],
          ['**Coût d’un relevé**', 'Coût moyen d’une réponse relevée ce mois-ci, tous fournisseurs confondus, sur les relevés réussis.'],
          ['**Coût par question**', 'Dépense du mois rapportée au nombre de questions suivies, tous projets.'],
          ['**Appels ce mois-ci**', 'Chaque appel payant inscrit au journal, réussi ou non, avec le nombre d’échecs.'],
        ],
      },
      { type: 'h2', id: 'repartitions', texte: 'Les répartitions' },
      {
        type: 'liste',
        items: [
          '**Dépense par jour** : les 30 derniers jours, jours sans appel compris, avec la moyenne par jour. Le survol d’une barre donne la dépense du jour.',
          '**Par fournisseur, sur 30 jours** : DataForSEO (relevés d’interface), Anthropic (Claude), DeepSeek (le petit modèle qui lit les réponses). Dans la légende, les montants sont en centimes de dollar.',
          '**Par fournisseur**, **Par IA relevée**, **Par projet** et **Par type d’appel, ce mois-ci** : le montant, le nombre d’appels et la part de chacun. Les types d’appel sont les relevés, l’analyse des réponses, le classement des sites, les étiquettes des questions et la vérification des faits.',
          '**Coût par projet** : pour chaque projet, ses questions, ses appels, sa dépense du mois, son coût par question et sa prévision de fin de mois.',
        ],
      },
      { type: 'h2', id: 'journal', texte: 'Le journal des appels' },
      { type: 'p', texte: 'Le bloc **Derniers appels** montre les 40 appels les plus récents ; **Échecs seulement** n’affiche que les appels en échec. Colonnes : **Date** (heure de Paris), **Fournisseur**, **Appel**, **Projet**, **IA**, **Durée**, **État** (Réussi ou Échec) et **Prix**. Le bouton **Exporter** de la barre du haut télécharge le journal entier, avec le modèle et le message d’erreur de chaque appel : voir [Exports CSV](doc:piloter/exports).' },
      {
        type: 'tableau',
        colonnes: ['Prix', 'D’où il vient'],
        lignes: [
          ['Sans astérisque', 'Le prix renvoyé par le fournisseur pour cet appel. C’est le cas des relevés d’interface (DataForSEO).'],
          ['Avec un astérisque (*)', 'Le prix calculé depuis la grille de tarifs, faute de montant renvoyé : jetons d’entrée et de sortie, et recherches web pour Claude. C’est le cas d’Anthropic et de DeepSeek. Les heures creuses de DeepSeek sont comptées au prix fort : le journal ne sous-estime jamais une dépense.'],
        ],
      },
      { type: 'p', texte: 'Un envoi refusé par le fournisseur n’est pas facturé : il s’inscrit en échec, à 0 $. Les prix moyens de chaque appel sont détaillés dans [Ce que coûte un relevé](doc:demarrer/couts).' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Contrôler la dépense du mois' },
      {
        type: 'etapes',
        items: [
          { titre: 'Lire la projection', texte: 'Si le bloc du plafond dit que le mois finirait au-dessus, décidez maintenant : relever le plafond, ou réduire le rythme des relevés.' },
          { titre: 'Trouver ce qui coûte', texte: 'Regardez **Par projet, ce mois-ci** et **Par type d’appel, ce mois-ci**. Les relevés de Claude coûtent bien plus cher qu’un relevé d’interface.' },
          { titre: 'Vérifier les échecs', texte: 'Ouvrez **Échecs seulement**. Une série d’échecs sur un fournisseur signale une clé refusée ou un service en panne : voyez l’état des clés dans Réglages.' },
          { titre: 'Ajuster', texte: 'Changez le plafond ici, ou les relevés automatiques de chaque projet dans **Réglages › Rythme des relevés**.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Le journal ne connaît que les appels de l’outil : une dépense faite ailleurs avec les mêmes clés n’y figure pas, et la facture du fournisseur fait foi. Les prix de la grille ont été relevés à une date ; si un fournisseur change ses tarifs, la grille doit être mise à jour. Le plafond se vérifie avant chaque envoi : un relevé lancé juste sous le plafond peut le dépasser un peu. Les montants sont en dollars, la devise de facturation des fournisseurs.' },
      {
        type: 'liens',
        items: [
          { page: 'demarrer/couts' },
          { page: 'piloter/reglages' },
          { page: 'projet/releves-automatiques' },
          { page: 'cas/budget-de-suivi' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Every call to a paid API goes through the cost journal, with its price: a reading, reading an answer, classifying a site, tagging a prompt, checking facts. This screen reads that journal. It tells how much was spent this month, on what, for which project, and where the month will end. It is used to set the cap and to spot unusual spending.' },
      { type: 'encadre', ton: 'savoir', titre: 'Admins only', texte: 'The **Admin › Costs** section only appears for an admin account. An admin also sees, at the bottom of the menu, the **Spend this month** line: spend against the cap, with a thin bar; a click opens this screen. A member who opens the address lands on the overview.' },
      { type: 'capture', nom: 'couts', legende: 'The Costs screen: the monthly cap and its gauge, the key figures, spend per day and the split by provider, by AI, by project and by type of call.' },
      { type: 'h2', id: 'cap', texte: 'The monthly cap' },
      { type: 'p', texte: 'The month starts on the 1st at midnight, Paris time. The first block gives the month’s spend against the cap ($20 by default), a solid gauge for what has been spent and hatching for the projection. The **Monthly cap (in dollars)** field changes it, from $0 to $5,000, with **Save**. The cap covers all projects together.' },
      {
        type: 'tableau',
        colonnes: ['Situation', 'What happens'],
        lignes: [
          ['Under the cap', 'Requests go out. Before a run, the project page shows the month’s spend after sending and warns if it would push past the cap. Sending is still possible: the cap is checked before each call.'],
          ['Cap reached', 'No paid call goes out any more: no run, manual or automatic, no answer reading, no site classification, no tagging, no fact checking. Scheduled runs resume the next month, or as soon as the cap is raised.'],
          ['Projection', 'The month’s spend extended at the pace of the days elapsed. It shows after one full day. If it exceeds the cap, the block says so.'],
        ],
      },
      { type: 'h2', id: 'key-figures', texte: 'Key figures' },
      {
        type: 'tableau',
        colonnes: ['Tile', 'What it counts'],
        lignes: [
          ['**Spend this month**', 'Sum of the paid calls logged since the start of the month, against the cap.'],
          ['**End-of-month projection**', 'The month’s spend extended at the current pace.'],
          ['**Last 24 h**', 'Paid calls of the last twenty-four hours.'],
          ['**Cost of a reading**', 'Average cost of one recorded answer this month, all providers together, over successful readings.'],
          ['**Cost per prompt**', 'The month’s spend divided by the number of prompts tracked, all projects.'],
          ['**Calls this month**', 'Every paid call logged, successful or not, with the number of failures.'],
        ],
      },
      { type: 'h2', id: 'breakdowns', texte: 'The breakdowns' },
      {
        type: 'liste',
        items: [
          '**Spend per day**: the last 30 days, days without calls included, with the daily average. Hovering a bar gives that day’s spend.',
          '**By provider, over 30 days**: DataForSEO (interface readings), Anthropic (Claude), DeepSeek (the small model that reads the answers). In the legend, amounts are in US cents.',
          '**By provider**, **By AI**, **By project** and **By type of call, this month**: the amount, the number of calls and each one’s share. The types of call are runs, answer analysis, site classification, prompt tags and fact checking.',
          '**Cost per project**: for each project, its prompts, its calls, its spend this month, its cost per prompt and its end-of-month forecast.',
        ],
      },
      { type: 'h2', id: 'journal', texte: 'The call journal' },
      { type: 'p', texte: 'The **Latest calls** block shows the 40 most recent calls; **Failures only** shows only the failed ones. Columns: **Date** (Paris time), **Provider**, **Call**, **Project**, **AI**, **Duration**, **Status** (Success or Failed) and **Price**. The **Export** button in the top bar downloads the whole journal, with each call’s model and error message: see [CSV exports](doc:piloter/exports).' },
      {
        type: 'tableau',
        colonnes: ['Price', 'Where it comes from'],
        lignes: [
          ['No asterisk', 'The price returned by the provider for that call. This is the case for interface readings (DataForSEO).'],
          ['With an asterisk (*)', 'The price computed from the rate card, as no amount was returned: input and output tokens, plus web searches for Claude. This is the case for Anthropic and DeepSeek. DeepSeek’s off-peak hours are counted at the full price: the journal never underestimates spending.'],
        ],
      },
      { type: 'p', texte: 'A request refused by the provider is not billed: it is logged as failed, at $0. The average price of each call is detailed in [What a run costs](doc:demarrer/couts).' },
      { type: 'h2', id: 'step-by-step', texte: 'Keeping the month’s spend in check' },
      {
        type: 'etapes',
        items: [
          { titre: 'Read the projection', texte: 'If the cap block says the month would end above it, decide now: raise the cap, or slow the run schedule.' },
          { titre: 'Find what costs', texte: 'Look at **By project, this month** and **By type of call, this month**. Claude readings cost far more than an interface reading.' },
          { titre: 'Check the failures', texte: 'Open **Failures only**. A series of failures on one provider points to a refused key or a service outage: check the keys in Settings.' },
          { titre: 'Adjust', texte: 'Change the cap here, or each project’s automatic runs in **Settings › Run schedule**.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'The journal only knows the tool’s own calls: spending done elsewhere with the same keys does not appear, and the provider’s invoice prevails. Rate card prices were captured on a given date; if a provider changes its prices, the rate card has to be updated. The cap is checked before each request: a run started just below the cap can go slightly over it. Amounts are in US dollars, the providers’ billing currency.' },
      {
        type: 'liens',
        items: [
          { page: 'demarrer/couts' },
          { page: 'piloter/reglages' },
          { page: 'projet/releves-automatiques' },
          { page: 'cas/budget-de-suivi' },
        ],
      },
    ],
  },
}

export default page
