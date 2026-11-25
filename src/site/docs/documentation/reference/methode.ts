import type { PageDoc } from '../../types'

// Méthode de mesure : src/lib/mesures.ts (seuils, verdict, intervalle, écart,
// périodes), src/lib/releves.ts (présence), src/lib/classements.ts (carte des
// thèmes), src/lib/rapport.ts (comparaisons), src/lib/analyse.ts (petit modèle).
const page: PageDoc = {
  id: 'reference/methode',
  rubrique: 'reference',
  slug: { fr: 'reference/methode', en: 'reference/method' },
  titre: { fr: 'Méthode de mesure', en: 'Measurement method' },
  resume: {
    fr: 'Comment l’outil compte : présence de la marque, seuils, verdict, marge d’erreur, écarts réels, périodes, méthodes séparées, et ce que la mesure ne dit pas.',
    en: 'How the tool counts: brand presence, thresholds, verdict, margin of error, real changes, periods, methods kept apart, and what the measurement cannot tell.',
  },
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Une réponse d’IA est un échantillon : la même question, posée deux fois, ne donne pas la même réponse. Un chiffre sans méthode ni nombre de relevés ne dit donc rien. Cette page décrit les règles que l’outil applique partout, telles qu’elles sont écrites dans son code. La page publique [Méthode](/methode) en donne la version courte.' },
      { type: 'h2', id: 'etats', texte: 'D’un envoi à une réponse' },
      { type: 'p', texte: 'Chaque question envoyée à une IA devient un relevé. Il revient quelques minutes plus tard avec l’un de ces états. Seules les réponses reçues entrent dans les chiffres.' },
      {
        type: 'tableau',
        colonnes: ['État', 'Ce qu’il veut dire', 'Dans les chiffres'],
        lignes: [
          ['Reçu', 'La réponse est là, avec ses sources.', 'Compté, que la marque y soit ou non.'],
          ['Pas d’aperçu, sans réponse', 'L’IA n’a rien affiché. Le cas courant : Google n’affiche pas d’Aperçu IA pour cette question. Ou Claude a décliné la question.', 'Écarté. Ce n’est pas une absence de la marque.'],
          ['En attente', 'La question est partie, la réponse n’est pas revenue. Sa lecture est gratuite et se fait toute seule.', 'Pas encore.'],
          ['Échec', 'Le relevé n’a pas abouti : refus du fournisseur, ou aucune réponse au bout de six heures.', 'Écarté. Le relevé est à refaire.'],
        ],
      },
      { type: 'h2', id: 'presence', texte: 'Quand la marque est-elle présente ?' },
      {
        type: 'tableau',
        colonnes: ['État', 'Règle'],
        lignes: [
          ['**Citée**', 'Une source citée est une page d’un site de la marque (sous-domaines compris), une page sous un de ses profils sociaux déclarés, ou une vidéo d’une de ses chaînes YouTube.'],
          ['**Nommée**', 'Le nom de la marque, ou une de ses autres écritures déclarées, figure dans le texte comme un mot entier, sans tenir compte des majuscules. Le nom de domaine du site compte aussi. Ou la lecture automatique lui donne un rang parmi les marques nommées.'],
          ['**Lue**', 'Une page ou une vidéo de la marque a été ouverte par l’IA sans être citée. La marque n’est alors pas comptée comme présente.'],
          ['**Absente**', 'L’IA a répondu sans la marque.'],
        ],
      },
      { type: 'p', texte: 'La **visibilité** est la part des réponses reçues où la marque est citée ou nommée. Elle se compte toujours en « k sur n » : k réponses avec la marque, sur n réponses reçues.' },
      { type: 'h2', id: 'indicateurs', texte: 'Part de voix et rang' },
      {
        type: 'liste',
        items: [
          '**Part de voix** : les mentions de la marque, rapportées à celles de la marque et des concurrents suivis, dans les réponses dont les marques sont lues. Sans concurrent suivi, elle vaudrait toujours 100 % : elle n’est pas calculée.',
          '**Rang** : la place de la marque parmi les marques nommées dans une réponse, dans leur ordre d’apparition, chaque marque comptée une fois. Le **rang moyen** est la moyenne des rangs connus ; plus il est petit, mieux c’est.',
          '**Premier nommé** : la marque nommée en premier dans une réponse.',
        ],
      },
      { type: 'h2', id: 'seuils', texte: 'Les seuils' },
      {
        type: 'tableau',
        colonnes: ['Seuil', 'Valeur', 'Effet'],
        lignes: [
          ['Chiffre affiché', '5 réponses', 'En dessous, aucun pourcentage : l’écran écrit « À partir de 5 relevés » et donne le compte seul.'],
          ['Verdict d’une question', '3 réponses', 'En dessous, « Trop tôt pour dire ».'],
          ['Solide', '60 % ou plus', 'La marque est dans au moins 6 réponses d’interface sur 10.'],
          ['Occasionnelle', 'Entre 0 et 60 %', 'La marque est présente, moins de 6 fois sur 10.'],
          ['Absente', '0', 'Aucune réponse avec la marque, sur 3 réponses ou plus.'],
          ['Écart jugé', '5 réponses de chaque côté', 'En dessous, l’écart est marqué « trop peu de relevés ».'],
        ],
      },
      { type: 'p', texte: 'La carte des thèmes suit les mêmes seuils : un thème est **Tenu** quand la marque est dans 6 réponses sur 10 ou plus et qu’aucune autre marque n’y est nommée plus souvent, **À reprendre** quand la marque en est absente et qu’une autre marque est nommée dans 3 réponses sur 10 ou plus, **Angle mort** quand personne n’atteint ce niveau, **Trop tôt pour dire** sous 5 réponses lues. Voir [Thèmes et carte des thèmes](doc:comprendre/themes).' },
      { type: 'h2', id: 'marge', texte: 'La marge d’erreur' },
      { type: 'p', texte: 'Autour de chaque visibilité, l’outil calcule un intervalle de confiance à 95 % (méthode de Wilson) : la plage où la vraie valeur a de bonnes chances de se trouver. Il s’affiche dans les bulles d’aide (« entre … et … ») et en bande grise sur les graphiques. Deux points dont les bandes se recouvrent ne se distinguent pas.' },
      {
        type: 'tableau',
        colonnes: ['Réponses', 'Visibilité mesurée', 'Marge d’erreur'],
        lignes: [
          ['20', '50 %', 'Entre 30 et 70 % : assez pour un verdict, pas pour un pourcentage.'],
          ['1 000', '50 %', 'À trois points près.'],
        ],
      },
      { type: 'h2', id: 'ecart', texte: 'Quand un écart est-il réel ?' },
      { type: 'p', texte: 'Un écart compare deux parts : avant (k₁ sur n₁) et après (k₂ sur n₂). Il s’écrit en points. L’outil le juge ainsi :' },
      {
        type: 'liste',
        ordonnee: true,
        items: [
          'Si l’un des deux côtés a moins de 5 réponses : « trop peu de relevés ».',
          'Sinon, la marge vaut 1,96 × √( p₁(1 − p₁)/n₁ + p₂(1 − p₂)/n₂ ), où p₁ et p₂ sont les deux parts.',
          'Si l’écart ne dépasse pas cette marge : « dans la marge », en gris. Sinon : une hausse ▲ ou une baisse ▼, en couleur.',
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Un exemple', texte: 'Facturo passe de 2 réponses sur 10 à 5 sur 10 : l’écart est de 30 points. La marge vaut environ 40 points : l’écart est « dans la marge ». Avec le même passage de 20 % à 50 % sur 50 réponses de chaque côté, la marge tombe à 18 points, et la hausse est réelle.' },
      { type: 'h2', id: 'periodes', texte: 'Périodes et comparaisons' },
      {
        type: 'liste',
        items: [
          '**Période** : 7 jours, 4 semaines, 8 semaines (par défaut), 3 mois (12 semaines). L’écart compare à la période de même durée juste avant. Avec **Tout l’historique** ou **Dernier relevé seul**, il n’y a pas de période d’avant.',
          '**Dernier relevé seul** garde, pour chaque question, la réponse la plus récente de chaque IA.',
          '**Jour de relevé** : les relevés d’un même jour, à l’heure de Paris, forment un point des graphiques.',
          '**Rapport et alertes** : les deux derniers jours de relevé, sur les seuls couples question et IA qui ont une réponse aux deux dates, avec la dernière réponse du jour.',
          '**Mesure après une action** : les quatre semaines qui précèdent l’action, ce jour compris, contre tous les relevés des jours suivants.',
        ],
      },
      { type: 'h2', id: 'methodes', texte: 'Interface et API, jamais additionnées' },
      { type: 'p', texte: 'Un chiffre qui mêle les deux méthodes ne mesure plus rien. Toute fonction qui compte ne reçoit que des relevés d’une seule méthode. Les chiffres d’ensemble portent sur les quatre IA d’interface ; Claude, interrogé par son API, a sa colonne, sa courbe et sa ligne du rapport. Seul l’écran Faits vérifiés relit les deux ensemble, parce qu’il ne mesure pas une part : il cherche des phrases fausses, et chaque ligne dit sa méthode.' },
      { type: 'h2', id: 'approfondie', texte: 'Mesures approfondies' },
      { type: 'p', texte: 'Une mesure approfondie pose une question 5, 10 ou 25 fois de suite. Ses relevés comptent pour le verdict de cette question, et pour sa courbe. Ils n’entrent ni dans les chiffres d’ensemble, ni dans le grand graphique, ni dans le rapport : sinon, une question posée vingt-cinq fois pèserait vingt-cinq fois plus que les autres. Un repère signale leur jour sur les graphiques.' },
      { type: 'h2', id: 'petit-modele', texte: 'Ce que lit le petit modèle' },
      { type: 'p', texte: 'Certaines informations ne sont pas dans la réponse brute. Un petit modèle de langage (DeepSeek Flash aujourd’hui) les lit dans le texte. Chaque lecture est un appel payant, inscrit au journal des coûts ; une correction à la main l’emporte toujours.' },
      {
        type: 'tableau',
        colonnes: ['Lecture', 'Ce qu’elle tire', 'Prix moyen'],
        lignes: [
          ['Lecture des réponses', 'Les marques nommées, dans l’ordre, et le ton employé pour chacune (positif, neutre, négatif), pour toutes les IA. Pour ChatGPT, elle remplace la liste du fournisseur une fois faite.', '0,0008 $ par réponse'],
          ['Classement des sites', 'Le type de chaque site cité (comparatif, média, blog…) et, pour un site de marque, sa marque. Une fois par site, gardé pour tous les projets.', '0,00005 $ par site'],
          ['Étiquettes des questions', 'Un thème de quelques mots et une intention : s’informer, comparer, acheter.', '0,00008 $ par question'],
          ['Vérification des faits', 'Les phrases d’une réponse qui contredisent un fait vérifié sur la marque.', '0,0006 $ par réponse'],
        ],
      },
      { type: 'p', texte: '« Avec ou sans le nom de la marque » ne passe pas par le modèle : il se déduit du texte de la question, ce qui est plus sûr.' },
      { type: 'h2', id: 'ne-dit-pas', texte: 'Ce que la mesure ne dit pas' },
      {
        type: 'liste',
        items: [
          '**Ce que voit une personne connectée.** Les relevés partent d’une session neutre, sans historique.',
          '**Combien de gens posent la question.** Aucune IA ne publie ce qu’on lui demande : l’outil n’affiche aucun volume.',
          '**Pourquoi un chiffre a bougé.** L’outil dit si un écart dépasse la marge d’erreur, pas sa cause. Les repères de changement de modèle et d’action faite aident à faire la part des choses.',
          '**Ce qu’affiche l’application Claude.** Claude est interrogé par son API.',
          '**Les pages lues par Gemini et par Google.** Seuls ChatGPT et Claude les donnent.',
          '**Une lecture sans erreur.** Le petit modèle peut se tromper sur une réponse ambiguë : chaque fiche renvoie au texte d’origine.',
        ],
      },
      { type: 'encadre', ton: 'limite', texte: 'Et une chose que personne ne sait : comment être cité à coup sûr. L’outil mesure, vous corrigez, il mesure de nouveau. Avec une réponse par question et par IA chaque semaine, il faut plusieurs semaines pour qu’un écart devienne lisible.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/mesure-approfondie' },
          { page: 'piloter/rapport-et-alertes' },
          { page: 'reference/ia-suivies' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'An AI answer is a sample: the same prompt, asked twice, does not get the same answer. A number without a method or a number of readings therefore tells nothing. This page describes the rules the tool applies everywhere, as they are written in its code. The public [Method](/en/method) page gives the short version.' },
      { type: 'h2', id: 'states', texte: 'From a request to an answer' },
      { type: 'p', texte: 'Each prompt sent to an AI becomes a reading. It comes back a few minutes later in one of these states. Only received answers count in the numbers.' },
      {
        type: 'tableau',
        colonnes: ['State', 'What it means', 'In the numbers'],
        lignes: [
          ['Received', 'The answer is there, with its sources.', 'Counted, whether or not the brand is in it.'],
          ['No overview, no answer', 'The AI displayed nothing. The usual case: Google shows no AI Overview for this prompt. Or Claude declined the prompt.', 'Left out. It is not an absence of the brand.'],
          ['Pending', 'The prompt has gone out, the answer has not come back. Collecting it is free and happens on its own.', 'Not yet.'],
          ['Failed', 'The reading did not succeed: the provider refused it, or no answer came within six hours.', 'Left out. The reading has to be redone.'],
        ],
      },
      { type: 'h2', id: 'presence', texte: 'When is the brand present?' },
      {
        type: 'tableau',
        colonnes: ['State', 'Rule'],
        lignes: [
          ['**Cited**', 'A cited source is a page of one of the brand’s sites (subdomains included), a page under one of its declared social profiles, or a video from one of its YouTube channels.'],
          ['**Mentioned**', 'The brand’s name, or one of its declared other spellings, appears in the text as a whole word, regardless of case. The site’s domain name counts too. Or automatic reading gives it a position among the brands mentioned.'],
          ['**Read**', 'A page or a video of the brand was opened by the AI without being cited. The brand is then not counted as present.'],
          ['**Absent**', 'The AI answered without the brand.'],
        ],
      },
      { type: 'p', texte: '**Visibility** is the share of received answers where the brand is cited or mentioned. It is always counted as “k out of n”: k answers with the brand, out of n answers received.' },
      { type: 'h2', id: 'metrics', texte: 'Share of voice and position' },
      {
        type: 'liste',
        items: [
          '**Share of voice**: mentions of the brand, relative to those of the brand and its tracked competitors, in the answers whose brands have been read. Without a tracked competitor it would always be 100%: it is not computed.',
          '**Position**: the brand’s place among the brands mentioned in an answer, in order of appearance, each brand counted once. The **average position** is the mean of the known positions; the smaller, the better.',
          '**Named first**: the brand mentioned first in an answer.',
        ],
      },
      { type: 'h2', id: 'thresholds', texte: 'Thresholds' },
      {
        type: 'tableau',
        colonnes: ['Threshold', 'Value', 'Effect'],
        lignes: [
          ['Number shown', '5 answers', 'Below that, no percentage: the screen says “From 5 readings” and gives the count only.'],
          ['Verdict on a prompt', '3 answers', 'Below that, “Too early to tell”.'],
          ['Solid', '60% or more', 'The brand is in at least 6 interface answers out of 10.'],
          ['Occasional', 'Between 0 and 60%', 'The brand is present, fewer than 6 times out of 10.'],
          ['Absent', '0', 'No answer with the brand, out of 3 answers or more.'],
          ['Change judged', '5 answers on each side', 'Below that, the change is marked “too few readings”.'],
        ],
      },
      { type: 'p', texte: 'The topic map uses the same thresholds: a topic is **Held** when the brand is in 6 answers out of 10 or more and no other brand is mentioned more often, **To win back** when the brand is absent and another brand is mentioned in 3 answers out of 10 or more, **Blind spot** when nobody reaches that level, **Too early to tell** below 5 answers read. See [Topics and the topic map](doc:comprendre/themes).' },
      { type: 'h2', id: 'margin', texte: 'Margin of error' },
      { type: 'p', texte: 'Around each visibility, the tool computes a 95% confidence interval (Wilson method): the range where the true value most likely lies. It shows in the help bubbles (“between … and …”) and as a grey band on the charts. Two points whose bands overlap cannot be told apart.' },
      {
        type: 'tableau',
        colonnes: ['Answers', 'Visibility measured', 'Margin of error'],
        lignes: [
          ['20', '50%', 'Between 30 and 70%: enough for a verdict, not for a percentage.'],
          ['1,000', '50%', 'Within three points.'],
        ],
      },
      { type: 'h2', id: 'change', texte: 'When is a change real?' },
      { type: 'p', texte: 'A change compares two shares: before (k₁ out of n₁) and after (k₂ out of n₂). It is written in points. The tool judges it this way:' },
      {
        type: 'liste',
        ordonnee: true,
        items: [
          'If either side has fewer than 5 answers: “too few readings”.',
          'Otherwise, the margin is 1.96 × √( p₁(1 − p₁)/n₁ + p₂(1 − p₂)/n₂ ), where p₁ and p₂ are the two shares.',
          'If the change does not exceed that margin: “within margin”, in grey. Otherwise: a rise ▲ or a drop ▼, in colour.',
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'An example', texte: 'Facturo goes from 2 answers out of 10 to 5 out of 10: the change is 30 points. The margin is about 40 points: the change is “within margin”. With the same move from 20% to 50% over 50 answers on each side, the margin drops to 18 points, and the rise is real.' },
      { type: 'h2', id: 'periods', texte: 'Periods and comparisons' },
      {
        type: 'liste',
        items: [
          '**Period**: 7 days, 4 weeks, 8 weeks (default), 3 months (12 weeks). The change compares with the period of the same length just before. With **All time** or **Latest run only**, there is no previous period.',
          '**Latest run only** keeps, for each prompt, the most recent answer of each AI.',
          '**Run day**: the readings of one day, Paris time, make one point on the charts.',
          '**Report and alerts**: the last two run days, on the prompt and AI pairs that have an answer on both dates only, with the last answer of the day.',
          '**Measuring after an action**: the four weeks before the action, that day included, against every reading of the following days.',
        ],
      },
      { type: 'h2', id: 'methods', texte: 'Interface and API, never added together' },
      { type: 'p', texte: 'A number that mixes the two methods no longer measures anything. Every counting function only receives readings of a single method. Overall numbers cover the four interface AIs; Claude, queried through its API, has its column, its line and its row in the report. Only the Fact checks screen reads both together, because it measures no share: it looks for wrong sentences, and each line states its method.' },
      { type: 'h2', id: 'deep', texte: 'Deep measurements' },
      { type: 'p', texte: 'A deep measurement asks a prompt 5, 10 or 25 times in a row. Its readings count for that prompt’s verdict and its line. They stay out of the overall numbers, the main chart and the report: otherwise a prompt asked twenty-five times would weigh twenty-five times more than the others. A marker flags their day on the charts.' },
      { type: 'h2', id: 'small-model', texte: 'What the small model reads' },
      { type: 'p', texte: 'Some information is not in the raw answer. A small language model (DeepSeek Flash today) reads it from the text. Each reading is a paid call, logged in the cost journal; a manual correction always wins.' },
      {
        type: 'tableau',
        colonnes: ['Reading', 'What it extracts', 'Average price'],
        lignes: [
          ['Answer reading', 'The brands mentioned, in order, and the tone used for each one (positive, neutral, negative), for every AI. For ChatGPT, once done, it replaces the provider’s list.', '$0.0008 per answer'],
          ['Site classification', 'The type of each cited site (comparison site, media, blog…) and, for a brand site, its brand. Once per site, kept for every project.', '$0.00005 per site'],
          ['Prompt tags', 'A topic of a few words and an intent: learn, compare, buy.', '$0.00008 per prompt'],
          ['Fact checking', 'The sentences of an answer that contradict a verified fact about the brand.', '$0.0006 per answer'],
        ],
      },
      { type: 'p', texte: '“With or without the brand name” does not go through the model: it is deduced from the prompt’s text, which is safer.' },
      { type: 'h2', id: 'does-not-tell', texte: 'What the measurement does not tell you' },
      {
        type: 'liste',
        items: [
          '**What a signed-in person sees.** Readings start from a neutral session, with no history.',
          '**How many people ask the prompt.** No AI publishes what it is asked: the tool shows no volume.',
          '**Why a number moved.** The tool says whether a change exceeds the margin of error, not its cause. The model-change and action-done markers help sort it out.',
          '**What the Claude app displays.** Claude is queried through its API.',
          '**The pages read by Gemini and Google.** Only ChatGPT and Claude provide them.',
          '**An error-free reading.** The small model can be wrong on an ambiguous answer: every sheet links back to the original text.',
        ],
      },
      { type: 'encadre', ton: 'limite', texte: 'And one thing nobody knows: how to get cited for certain. The tool measures, you fix, it measures again. With one answer per prompt and per AI each week, it takes several weeks for a change to become readable.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/mesure-approfondie' },
          { page: 'piloter/rapport-et-alertes' },
          { page: 'reference/ia-suivies' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
  },
}

export default page
