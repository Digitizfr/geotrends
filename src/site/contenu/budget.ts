// Page « Budget » : ce que la mesure coûte à faire tourner. Exemples de calcul
// génériques, tirés des prix unitaires des fournisseurs. Aucune dépense réelle.
//   Interface : 50 questions × 4 IA × 4,33 semaines = 867 relevés × 0,0012 $ = 1,04 $
//   Claude    : 50 questions × 2,17 passages = 108 questions × 0,059 $ = 6,39 $

import { insecables } from '../typo'

const fr = {
  meta: {
    titre: 'Budget : ce que coûte le suivi d’une marque dans les IA',
    description: 'Le prix d’un relevé d’interface (0,0012 $), d’une question posée à Claude (environ 0,06 $), un exemple chiffré pour 50 questions (environ 7,50 $ par mois) et le plafond mensuel qui suspend les relevés.',
  },
  fil: 'Budget',
  titre: 'Suivre 50 questions sur cinq IA : [[environ 7,50 $ par mois.]]',
  chapo: 'GeoTrends est gratuit : il n’y a ni abonnement ni tarif. Vous payez seulement vos relevés, directement aux fournisseurs, avec vos propres clés. Cette page dit ce que la mesure coûte à faire tourner, relevé par relevé, et comment la dépense est tenue.',
  marge: ['0,0012 $ le relevé d’interface', 'Environ 0,06 $ la question à Claude', 'Plafond mensuel réglable', 'Prix relevés en novembre 2026'],
  unite: {
    chapitre: 'Le prix d’un relevé',
    titre: 'Deux prix, parce qu’il y a deux méthodes.',
    prix: [
      { montant: '0,0012 $', nom: 'Un relevé d’interface', texte: 'Une réponse de ChatGPT, de Gemini, du Mode IA ou des Aperçus IA de Google. Seul l’envoi de la question est facturé. Récupérer la réponse, plus tard, ne coûte rien.' },
      { montant: 'Environ 0,06 $', nom: 'Une question à Claude', texte: 'Par l’API d’Anthropic, recherche web comprise. Chaque question déclenche deux ou trois recherches, et les pages lues se paient au volume de texte. Selon le modèle choisi, le prix va d’environ 0,02 $ à 0,17 $.' },
    ],
  },
  exemple: {
    chapitre: 'Un exemple chiffré',
    titre: 'Un projet de 50 questions, au rythme retenu.',
    textes: [
      'Le calcul est le même pour tout projet : le nombre de questions, fois le nombre d’IA, fois le nombre de passages dans le mois.',
      'Dans cet exemple, Claude pèse 86 % de la note pour une IA sur cinq. C’est lui qu’il faut régler en premier, par le rythme ou par le modèle.',
    ],
    ticket: {
      entete: 'exemple de calcul · un mois',
      lignes: [
        { nom: 'Relevés d’interface', detail: '50 questions × 4 IA × 4,33 semaines', calcul: '867 relevés à 0,0012 $', montant: '1,04 $' },
        { nom: 'Claude, par API', detail: '50 questions × 2,17 passages', calcul: '108 questions à 0,059 $', montant: '6,39 $' },
      ],
      total: '7,43 $',
      pied: 'un exemple, pas une dépense réelle',
    },
    tableau: {
      titre: 'Selon le nombre de questions',
      colonnes: ['Questions suivies', 'Relevés d’interface', 'Claude', 'Par mois'],
      lignes: [['10', '0,21 $', '1,28 $', 'environ 1,50 $'], ['50', '1,04 $', '6,39 $', 'environ 7,50 $'], ['100', '2,08 $', '12,78 $', 'environ 15 $']],
    },
  },
  rythme: {
    chapitre: 'Le rythme fait le prix',
    titre: 'Relever plus souvent coûte vite plus cher, sans apprendre grand-chose de plus.',
    texte: 'Une réponse d’IA ne change pas d’heure en heure. Pour les mêmes 50 questions, voici ce que donneraient trois rythmes.',
    lignes: [
      { nom: 'Rythme retenu', detail: 'Chaque semaine, Claude toutes les deux semaines', montant: 'environ 7,50 $', part: 8, retenu: true },
      { nom: 'Tout chaque semaine', detail: 'Claude relevé aussi souvent que les autres', montant: 'environ 14 $', part: 14, retenu: false },
      { nom: 'Tout chaque jour', detail: 'Le rythme de beaucoup d’outils du marché', montant: 'environ 97 $', part: 100, retenu: false },
    ],
    fin: 'Le relevé quotidien multiplie la note par treize, pour une information à peine plus fraîche.',
  },
  plafond: {
    chapitre: 'Le plafond',
    titre: 'Un plafond mensuel, vérifié avant chaque envoi.',
    textes: [
      'Chaque appel payant est inscrit au journal des coûts au moment où il part : fournisseur, IA, projet, prix. Aucun appel facturé ne passe en dehors.',
      'Avant de lancer un relevé, l’outil affiche son prix IA par IA. Si le plafond du mois est atteint, rien ne part : l’outil le dit, et attend le mois suivant ou un nouveau réglage. Le plafond est de 20 $ par mois au départ, et se règle.',
    ],
  },
  gratuit: {
    chapitre: 'Ce qui ne coûte rien',
    titre: 'On ne paie que l’envoi d’une question.',
    liste: ['Créer un projet, ajouter des questions, des sites, des chaînes', 'Récupérer une réponse déjà demandée', 'Rattacher une vidéo YouTube citée à sa chaîne', 'Recalculer un chiffre : la réponse brute est gardée, le relevé ne se repaie pas'],
    aVenir: 'La lecture automatique des réponses coûte environ 0,001 $ par réponse lue, et une mesure approfondie environ 0,12 $ pour 25 relevés : les deux passent par le journal des coûts.',
    note: 'Prix constatés en novembre 2026. Ils sont fixés par les fournisseurs et peuvent changer : le journal des coûts enregistre le prix réel de chaque appel.',
  },
  appel: { nom: 'Voir la famille Piloter' },
}

const en: typeof fr = {
  meta: {
    titre: 'Budget: what it costs to track a brand in AI answers',
    description: 'The price of an interface reading ($0.0012), of a question put to Claude (about $0.06), a worked example for 50 questions (about $7.50 a month) and the monthly cap that pauses readings.',
  },
  fil: 'Budget',
  titre: 'Tracking 50 questions on five AI engines: [[about $7.50 a month.]]',
  chapo: 'GeoTrends is free: there is no subscription and no pricing. You only pay for your readings, straight to the providers, with your own keys. This page says what the measurement costs to run, reading by reading, and how spend is kept in check.',
  marge: ['$0.0012 per interface reading', 'About $0.06 per Claude question', 'Adjustable monthly cap', 'Prices as of November 2026'],
  unite: {
    chapitre: 'The price of a reading',
    titre: 'Two prices, because there are two methods.',
    prix: [
      { montant: '$0.0012', nom: 'One interface reading', texte: 'One answer from ChatGPT, Gemini, Google AI Mode or AI Overviews. Only sending the question is billed. Collecting the answer later costs nothing.' },
      { montant: 'About $0.06', nom: 'One question to Claude', texte: 'Through the Anthropic API, web search included. Each question triggers two or three searches, and the pages read are billed by volume of text. Depending on the model, the price runs from about $0.02 to $0.17.' },
    ],
  },
  exemple: {
    chapitre: 'A worked example',
    titre: 'A 50-question project, on the chosen schedule.',
    textes: [
      'The sum is the same for any project: number of questions, times number of engines, times number of passes in the month.',
      'In this example, Claude accounts for 86% of the bill for one engine out of five. It is the first thing to tune, through the schedule or the model.',
    ],
    ticket: {
      entete: 'worked example · one month',
      lignes: [
        { nom: 'Interface readings', detail: '50 questions × 4 engines × 4.33 weeks', calcul: '867 readings at $0.0012', montant: '$1.04' },
        { nom: 'Claude, through the API', detail: '50 questions × 2.17 passes', calcul: '108 questions at $0.059', montant: '$6.39' },
      ],
      total: '$7.43',
      pied: 'an example, not real spending',
    },
    tableau: {
      titre: 'By number of questions',
      colonnes: ['Questions tracked', 'Interface readings', 'Claude', 'Per month'],
      lignes: [['10', '$0.21', '$1.28', 'about $1.50'], ['50', '$1.04', '$6.39', 'about $7.50'], ['100', '$2.08', '$12.78', 'about $15']],
    },
  },
  rythme: {
    chapitre: 'The schedule sets the price',
    titre: 'Reading more often gets expensive fast, and teaches you little more.',
    texte: 'An AI answer does not change by the hour. For the same 50 questions, here is what three schedules would cost.',
    lignes: [
      { nom: 'Chosen schedule', detail: 'Weekly, Claude every two weeks', montant: 'about $7.50', part: 8, retenu: true },
      { nom: 'Everything weekly', detail: 'Claude read as often as the others', montant: 'about $14', part: 14, retenu: false },
      { nom: 'Everything daily', detail: 'The pace of many tools on the market', montant: 'about $97', part: 100, retenu: false },
    ],
    fin: 'Daily readings multiply the bill by thirteen, for information that is barely fresher.',
  },
  plafond: {
    chapitre: 'The cap',
    titre: 'A monthly cap, checked before every send.',
    textes: [
      'Every paid call is written to the cost log as it leaves: provider, engine, project, price. No billed call goes around it.',
      'Before a reading is launched, the tool shows its price engine by engine. If the month’s cap has been reached, nothing is sent: the tool says so, and waits for the next month or a new setting. The cap starts at $20 a month and can be changed.',
    ],
  },
  gratuit: {
    chapitre: 'What costs nothing',
    titre: 'You only pay for sending a question.',
    liste: ['Creating a project, adding questions, websites, channels', 'Collecting an answer that was already requested', 'Matching a cited YouTube video to its channel', 'Recalculating a number: the raw answer is kept, so the reading is not paid for twice'],
    aVenir: 'Automatic reading of answers costs about $0.001 per answer read, and a deep measurement about $0.12 for 25 readings: both go through the cost log.',
    note: 'Prices as observed in November 2026. They are set by the providers and may change: the cost log records the real price of every call.',
  },
  appel: { nom: 'See the Steer family' },
}

export const budget = { fr: insecables(fr), en }
