import type { PageDoc } from '../../types'

// Bloc « Mesure approfondie » de /questions/[id] (MesureApprofondie.tsx, action
// lancerMesureApprofondie dans src/app/(app)/questions/actions.ts) ; relevés
// marqués « approfondi » dans src/lib/releves.ts et src/lib/mesures.ts.
const page: PageDoc = {
  id: 'mesurer/mesure-approfondie',
  rubrique: 'mesurer',
  slug: { fr: 'mesurer/mesure-approfondie', en: 'measure/deep-measurement' },
  titre: { fr: 'Mesure approfondie', en: 'Deep measurement' },
  resume: {
    fr: 'Poser une même question 5, 10 ou 25 fois de suite pour trancher son verdict et resserrer la marge d’erreur, sans fausser les chiffres d’ensemble du projet.',
    en: 'Ask one prompt 5, 10 or 25 times in a row to settle its verdict and narrow the margin of error, without skewing the overall numbers of the project.',
  },
  ecrans: ['/questions/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Une réponse d’IA est un tirage : posée dix fois, la même question ne donne pas dix fois les mêmes marques. Au rythme d’un relevé par semaine, il faut des mois pour qu’une question réunisse assez de réponses pour un verdict sûr. La mesure approfondie pose la question plusieurs fois de suite, le même jour, pour trancher tout de suite : la marque est-elle vraiment absente de cette question, avant d’y passer du temps ?' },
      { type: 'p', texte: 'Pour y aller : le bloc **Mesure approfondie**, sur la page de la question, sous l’évolution. Il n’existe pas pour une question archivée. En tête du bloc, le tampon « interface » et le nombre de relevés déjà faits ainsi, ou « jamais lancée ». Quand une question a entre 3 et 19 réponses, la phrase de son en-tête rappelle que la marge reste large et que la mesure approfondie la resserre.' },
      { type: 'h2', id: 'reglages', texte: 'Ce qu’on choisit' },
      {
        type: 'liste',
        items: [
          '**Nombre de fois** : 5 fois, 10 fois (le choix par défaut) ou 25 fois.',
          '**IA relevées par l’interface** : ChatGPT, Gemini, Mode IA et Aperçus IA, toutes cochées au départ, chacune avec le nombre de réponses déjà reçues sur cette question (« 3 déjà »). Claude n’est pas proposé : la mesure approfondie ne se fait que par l’interface.',
        ],
      },
      { type: 'p', texte: 'Dessous, le calcul s’écrit en clair et se met à jour à chaque choix : « 10 fois × 4 IA = 40 envois, à 0,0012 $ l’envoi : 0,0480 $ ». La ligne suivante donne la dépense du mois après l’envoi face au plafond, et ce qu’ajoutera la lecture automatique des réponses (environ 0,0008 $ par réponse). Le bouton porte le prix : **Lancer la mesure approfondie : 0,0480 $**.' },
      { type: 'encadre', ton: 'savoir', titre: 'Confirmation et plafond', texte: 'Au-dessus du seuil de confirmation (1 $ par défaut, réglable dans Réglages), une fenêtre récapitule les IA et le nombre d’envois avant de partir : **Confirmer l’envoi**. Si le plafond du mois est déjà atteint, le bloc l’écrit et le bouton reste grisé. Si l’envoi doit seulement le dépasser, un avertissement s’affiche en rouge.' },
      { type: 'h2', id: 'marge', texte: 'Ce que la marge d’erreur y gagne' },
      { type: 'p', texte: 'La marge d’erreur se resserre avec le nombre de réponses. Pour une marque présente dans la moitié des réponses, l’outil donne, à 95 % de confiance :' },
      {
        type: 'tableau',
        colonnes: ['Réponses d’interface sur la question', 'La vraie part est entre'],
        lignes: [
          ['4', '15 % et 85 %'],
          ['10', '24 % et 76 %'],
          ['20', '30 % et 70 %'],
          ['40', '35 % et 65 %'],
          ['100', '40 % et 60 %'],
        ],
      },
      { type: 'p', texte: 'Une mesure de 10 fois sur 4 IA ajoute 40 réponses d’un coup : assez pour qu’un verdict « absente » ou « solide » se lise sans hésiter.' },
      { type: 'h2', id: 'comptage', texte: 'Comment ces relevés comptent' },
      {
        type: 'liste',
        items: [
          '**Pour la question, oui** : son verdict, sa marge d’erreur, sa présence IA par IA et son évolution se recalculent avec toutes les réponses de la période, mesures approfondies comprises.',
          '**Dans les chiffres d’ensemble, non** : la vue d’ensemble, les concurrents, les sources, la ligne « Présente dans » de l’écran Questions, la carte des thèmes, le rapport et la liste des réponses les laissent de côté. Sinon, une question posée vingt-cinq fois pèserait vingt-cinq fois plus que les autres.',
          '**Un repère sur la courbe** : le grand graphique de la vue d’ensemble marque le jour de la mesure, sans la compter dans la courbe.',
          '**Une marque sur la réponse** : chaque réponse ainsi relevée porte l’étiquette « mesure approfondie », et la page de la question les parcourt une à une (« Réponse 2 sur 10 ce jour-là »).',
        ],
      },
      { type: 'h2', id: 'pas-a-pas', texte: 'Trancher une question' },
      {
        type: 'etapes',
        items: [
          { titre: 'Choisir la bonne question', texte: 'Une question qui compte pour Facturo et dont le verdict est « occasionnelle » ou « trop tôt pour dire ». Inutile sur une question déjà solide.' },
          { titre: 'Régler la mesure', texte: '10 fois sur les quatre IA, ou 25 fois sur une seule IA si c’est elle qui vous intéresse.' },
          { titre: 'Lire le prix et lancer', texte: 'Le prix est sur le bouton. Confirmez si la fenêtre s’ouvre.' },
          { titre: 'Attendre le retour', texte: 'Les réponses reviennent en quelques minutes par la collecte habituelle ; la page se met à jour toute seule et le verdict se recalcule.' },
          { titre: 'Décider', texte: 'Absente sur 40 réponses : la question est perdue, la liste de travail dit pourquoi. Solide : passez à une autre.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Poser la question le même jour mesure la réponse de ce jour : si l’IA change de modèle ou de sources la semaine suivante, le verdict peut changer. Les réponses d’une même série se ressemblent plus entre elles que des réponses espacées de plusieurs semaines. Claude ne se mesure pas ainsi. Chaque envoi est payé : 25 fois sur 4 IA coûte 0,1200 $ par question, plus la lecture.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/fiche-question' },
          { page: 'reference/methode' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'An AI answer is a draw: asked ten times, the same prompt does not give the same brands ten times. At one run a week, it takes months for a prompt to gather enough answers for a reliable verdict. A deep measurement asks the prompt several times in a row, on the same day, to settle it at once: is the brand really absent from this prompt, before you spend time on it?' },
      { type: 'p', texte: 'To get there: the **Deep measurement** block, on the prompt’s page, below the trend. It does not exist for an archived prompt. At the top of the block, the “interface” stamp and the number of readings already done this way, or “never run”. When a prompt has between 3 and 19 answers, the sentence in its header points out that the margin is still wide and that a deep measurement narrows it.' },
      { type: 'h2', id: 'settings', texte: 'What you choose' },
      {
        type: 'liste',
        items: [
          '**Number of times**: 5 times, 10 times (the default) or 25 times.',
          '**AIs read through the interface**: ChatGPT, Gemini, AI Mode and AI Overviews, all ticked at first, each with the number of answers already received on this prompt (“3 so far”). Claude is not offered: deep measurement only goes through the interface.',
        ],
      },
      { type: 'p', texte: 'Below, the calculation is written out and updates with every choice: “10 times × 4 AIs = 40 requests, at $0.0012 per request: $0.0480”. The next line gives the month’s spend after sending against the cap, and what the automatic reading of the answers will add (about $0.0008 per answer). The button carries the price: **Start the deep measurement: $0.0480**.' },
      { type: 'encadre', ton: 'savoir', titre: 'Confirmation and cap', texte: 'Above the confirmation threshold ($1 by default, set in Settings), a window sums up the AIs and the number of requests before sending: **Confirm sending**. If the monthly cap has already been reached, the block says so and the button stays greyed out. If the run would only exceed it, a warning shows in red.' },
      { type: 'h2', id: 'margin', texte: 'What the margin of error gains' },
      { type: 'p', texte: 'The margin of error narrows with the number of answers. For a brand present in half of the answers, the tool gives, at 95% confidence:' },
      {
        type: 'tableau',
        colonnes: ['Interface answers on the prompt', 'The true share lies between'],
        lignes: [
          ['4', '15% and 85%'],
          ['10', '24% and 76%'],
          ['20', '30% and 70%'],
          ['40', '35% and 65%'],
          ['100', '40% and 60%'],
        ],
      },
      { type: 'p', texte: 'A measurement of 10 times on 4 AIs adds 40 answers at once: enough for an “absent” or “solid” verdict to be read without hesitation.' },
      { type: 'h2', id: 'counting', texte: 'How these readings count' },
      {
        type: 'liste',
        items: [
          '**For the prompt, yes**: its verdict, margin of error, presence AI by AI and trend are recalculated with all the answers of the period, deep measurements included.',
          '**In the overall numbers, no**: the overview, competitors, sources, the “Present in” line of the Prompts screen, the topic map, the report and the answer list leave them out. Otherwise a prompt asked twenty-five times would weigh twenty-five times more than the others.',
          '**A marker on the chart**: the overview’s main chart marks the day of the measurement, without counting it in the line.',
          '**A label on the answer**: each answer recorded this way carries the “deep measurement” label, and the prompt’s page lets you browse them one by one (“Answer 2 of 10 that day”).',
        ],
      },
      { type: 'h2', id: 'step-by-step', texte: 'Settling a prompt' },
      {
        type: 'etapes',
        items: [
          { titre: 'Choose the right prompt', texte: 'A prompt that matters for Facturo and whose verdict is “occasional” or “too early to tell”. Pointless on a prompt that is already solid.' },
          { titre: 'Set the measurement', texte: '10 times on all four AIs, or 25 times on a single AI if that is the one you care about.' },
          { titre: 'Read the price and start', texte: 'The price is on the button. Confirm if the window opens.' },
          { titre: 'Wait for the answers', texte: 'They come back within minutes through the usual collection; the page refreshes by itself and the verdict is recalculated.' },
          { titre: 'Decide', texte: 'Absent on 40 answers: the prompt is lost, and the work list says why. Solid: move on to another one.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'Asking on the same day measures that day’s answer: if the AI changes model or sources the following week, the verdict may change. Answers from the same series are more alike than answers spread over several weeks. Claude cannot be measured this way. Every request is paid: 25 times on 4 AIs costs $0.1200 per prompt, plus reading.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/fiche-question' },
          { page: 'reference/methode' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
  },
}

export default page
