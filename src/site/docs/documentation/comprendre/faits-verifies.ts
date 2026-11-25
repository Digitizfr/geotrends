import type { PageDoc } from '../../types'

// Écran /faits (src/app/(app)/faits/page.tsx, actions.ts, lecture.ts), comparaison
// par le petit modèle dans src/lib/analyse.ts (verifierFaits, MAX_FAITS).
const page: PageDoc = {
  id: 'comprendre/faits-verifies',
  rubrique: 'comprendre',
  slug: { fr: 'comprendre/faits-verifies', en: 'understand/fact-checks' },
  titre: { fr: 'Faits vérifiés', en: 'Fact checks' },
  resume: {
    fr: 'Vous écrivez ce qui est vrai sur la marque : prix, offre, pays, dates. L’outil signale les réponses des IA qui disent autre chose, et la source en cause.',
    en: 'You write what is true about the brand: price, offer, country, dates. The tool flags the AI answers that say otherwise, with the sentence and the source at fault.',
  },
  ecrans: ['/faits'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Une IA peut citer la marque et se tromper sur elle : un ancien prix, une offre qui n’existe plus, un mauvais pays. L’écran Faits vérifiés compare les réponses à ce que vous tenez pour vrai, et dit lesquelles disent autre chose. Il sert à décider quelle page corriger chez vous, ou quel site prévenir.' },
      { type: 'p', texte: 'Dans le menu, un nombre à côté de **Faits vérifiés** compte les réponses qui contredisent un fait, hors fausses alertes écartées. Chaque contradiction est aussi une ligne de la liste de travail, « Corriger un fait faux ».' },
      { type: 'capture', nom: 'faits', legende: 'L’écran Faits vérifiés du projet Facturo : les faits saisis, puis les réponses qui disent autre chose, avec la phrase en cause et la source citée à l’appui.' },
      { type: 'h2', id: 'chiffres-cles', texte: 'Les chiffres clés' },
      {
        type: 'tableau',
        colonnes: ['Tuile', 'Ce qu’elle compte'],
        lignes: [
          ['**Faits vérifiés**', 'Ce que vous avez écrit comme vrai sur la marque. 20 au plus par projet.'],
          ['**Réponses qui nomment la marque**', 'Les réponses reçues où la marque est nommée, sur toutes les réponses reçues. Seules celles-là peuvent la contredire.'],
          ['**Comparées aux faits**', 'Réponses déjà relues par le petit modèle pour y chercher une contradiction, ou le nombre qui reste à comparer.'],
          ['**Disent autre chose**', 'Réponses où une phrase affirme sur la marque autre chose qu’un fait vérifié, avec le nombre de fausses alertes écartées à la main.'],
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Interface et API comptées ensemble, ici seulement', texte: 'Partout ailleurs, les deux méthodes restent séparées. Ici, aucune part n’est mesurée : on relit des phrases. Une erreur écrite par Claude, interrogé par son API, est donc signalée aussi, et chaque ligne porte le tampon de sa méthode. Les réponses des questions archivées sont relues elles aussi, quelle que soit la période choisie.' },
      { type: 'h2', id: 'ecrire', texte: 'Écrire les faits' },
      { type: 'p', texte: 'Le bloc **Ce qui est vrai sur Facturo** liste les faits saisis. Pour en ajouter, remplissez **Ajouter des faits** : un fait par ligne, écrit comme une phrase complète, par exemple « L’offre de départ coûte 29 € par mois. » Une ligne de moins de huit signes ou déjà saisie est ignorée. Ajouter un fait ne coûte rien. **Retirer** supprime un fait, et les contradictions relevées contre lui partent avec.' },
      { type: 'p', texte: 'Une phrase par fait, précise et vérifiable : cinq à vingt faits suffisent. Le bloc **Quels faits écrire** propose six sujets :' },
      {
        type: 'liste',
        items: [
          'Le prix de l’offre de départ',
          'Ce que l’offre comprend, et ce qu’elle ne comprend pas',
          'Le pays et la ville du siège',
          'L’année de création',
          'Le nom du fondateur',
          'Les pays et les langues servis',
        ],
      },
      { type: 'h2', id: 'comparer', texte: 'Comparer les réponses aux faits' },
      { type: 'p', texte: 'Quand des réponses qui nomment la marque n’ont pas encore été comparées, un bandeau propose **Vérifier les réponses**, avec son prix (environ 0,0006 $ par réponse). Le petit modèle relit chacune et relève les phrases qui contredisent un fait. C’est un appel payant, inscrit au journal des coûts, qui ne part que sur votre clic.' },
      {
        type: 'liste',
        items: [
          'Les réponses qui ne nomment pas la marque ne sont pas relues : elles ne peuvent pas la contredire.',
          'Après l’ajout d’un fait, les réponses déjà comparées le sont de nouveau, pour tenir compte du nouveau fait : le bandeau revient.',
          'Les réponses à venir sont comparées aux faits pendant leur lecture automatique, sans appel en plus.',
        ],
      },
      { type: 'h2', id: 'contradictions', texte: 'Les réponses qui disent autre chose' },
      {
        type: 'tableau',
        colonnes: ['Colonne', 'Ce qu’elle montre'],
        lignes: [
          ['**Fait vérifié**', 'Le fait contredit.'],
          ['**Ce que dit la réponse**', 'La phrase de la réponse, copiée mot pour mot, et une explication courte : ce que dit la réponse, et ce qui est vrai.'],
          ['**IA**', 'L’IA, le tampon de sa méthode (interface ou API) et la date du relevé.'],
          ['**Source citée à l’appui**', 'La page sur laquelle s’appuie la phrase, avec son type et à qui elle appartient, ou « aucune source citée à l’appui ».'],
          ['**Réponse**', '**Ouvrir la réponse** affiche le texte complet, à la bonne date et sur la bonne IA.'],
        ],
      },
      { type: 'p', texte: 'Au bout de chaque ligne, **Voir l’action** ouvre la ligne de la liste de travail, et **Écarter (fausse alerte)** retire la contradiction : elle sort de la liste de travail et ne revient pas à la lecture suivante. Les lignes écartées restent visibles, repliées, sous **Écartées à la main** ; **Remettre dans la liste** les fait revenir.' },
      { type: 'capture', nom: 'faits-contradictions', legende: 'Les réponses qui disent autre chose qu’un fait vérifié : la phrase relevée, l’IA, la source citée à l’appui et le lien vers la réponse.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Faire corriger une information fausse' },
      {
        type: 'etapes',
        items: [
          { titre: 'Écrire cinq à dix faits', texte: 'Commencez par ce qui change souvent et coûte cher quand c’est faux : le prix, l’offre, les pays servis.' },
          { titre: 'Vérifier les réponses', texte: 'Cliquez **Vérifier les réponses** : le prix est écrit sur le bouton. Les réponses reviennent comparées en quelques instants.' },
          { titre: 'Relire chaque phrase', texte: '**Ouvrir la réponse** montre la phrase dans son contexte. Si le petit modèle s’est trompé, **Écarter (fausse alerte)**.' },
          { titre: 'Remonter à la source', texte: 'Si une source est citée à l’appui, c’est elle qu’il faut faire corriger : votre page si elle est à vous, sinon le site qui la publie.' },
          { titre: 'Noter la démarche', texte: '**Voir l’action** ouvre la fiche de la ligne : notez-y la demande de correction envoyée, puis passez la ligne à « Fait » quand la page est corrigée.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Le petit modèle peut se tromper, dans les deux sens : signaler une phrase juste, ou manquer une erreur. Chaque ligne renvoie à la réponse complète : relisez avant d’écrire à un site. Une information absente d’une réponse n’est pas une contradiction, et une phrase qui dit la même chose avec d’autres mots non plus. Faire corriger la source ne garantit pas que l’IA change sa réponse : la mesure suivante le dira.' },
      {
        type: 'liens',
        items: [
          { page: 'agir/liste-de-travail' },
          { page: 'agir/prises-de-contact' },
          { page: 'cas/information-fausse' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'An AI can mention the brand and get it wrong: an old price, an offer that no longer exists, the wrong country. The Fact checks screen compares the answers with what you hold to be true, and tells you which ones say otherwise. It helps you decide which of your pages to fix, or which site to warn.' },
      { type: 'p', texte: 'In the menu, a number next to **Fact checks** counts the answers that contradict a fact, excluding dismissed false alarms. Each contradiction is also a line of the work list, “Correct a wrong fact”.' },
      { type: 'capture', nom: 'faits', legende: 'The Fact checks screen of the Facturo UK project: the facts entered, then the answers that say otherwise, with the sentence at fault and the source cited in support.' },
      { type: 'h2', id: 'key-figures', texte: 'Key figures' },
      {
        type: 'tableau',
        colonnes: ['Tile', 'What it counts'],
        lignes: [
          ['**Fact checks**', 'What you wrote as true about the brand. 20 at most per project.'],
          ['**Answers mentioning the brand**', 'The answers received where the brand is mentioned, out of all answers received. Only those can contradict it.'],
          ['**Compared with the facts**', 'Answers already reread by the small model to look for a contradiction, or the number left to compare.'],
          ['**Say otherwise**', 'Answers where a sentence states something about the brand other than a verified fact, with the number of false alarms dismissed by hand.'],
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Interface and API counted together, here only', texte: 'Everywhere else the two methods stay separate. Here no share is measured: sentences are reread. A mistake written by Claude, queried through its API, is therefore flagged too, and each row carries its method stamp. Answers to archived prompts are reread as well, whatever the period chosen.' },
      { type: 'h2', id: 'writing', texte: 'Writing the facts' },
      { type: 'p', texte: 'The **What is true about Facturo** block lists the facts entered. To add some, fill in **Add facts**: one fact per line, written as a full sentence, for example “The starter plan costs £25 a month.” A line shorter than eight characters, or already entered, is ignored. Adding a fact is free. **Remove** deletes a fact, and the contradictions found against it go with it.' },
      { type: 'p', texte: 'One sentence per fact, precise and checkable: five to twenty facts are enough. The **Which facts to write** block suggests six topics:' },
      {
        type: 'liste',
        items: [
          'The price of the starter plan',
          'What the offer includes, and what it does not',
          'The country and city of the head office',
          'The founding year',
          'The founder’s name',
          'The countries and languages served',
        ],
      },
      { type: 'h2', id: 'comparing', texte: 'Comparing the answers with the facts' },
      { type: 'p', texte: 'When answers mentioning the brand have not been compared yet, a banner offers **Check the answers**, with its price (about $0.0006 per answer). The small model rereads each one and picks out the sentences that contradict a fact. It is a paid call, logged in the cost journal, sent only on your click.' },
      {
        type: 'liste',
        items: [
          'Answers that do not mention the brand are not reread: they cannot contradict it.',
          'After a fact is added, the answers already compared are compared again, to take the new fact into account: the banner comes back.',
          'Upcoming answers are compared with the facts during their automatic reading, with no extra call.',
        ],
      },
      { type: 'h2', id: 'contradictions', texte: 'Answers that say otherwise' },
      {
        type: 'tableau',
        colonnes: ['Column', 'What it shows'],
        lignes: [
          ['**Verified fact**', 'The fact contradicted.'],
          ['**What the answer says**', 'The answer’s sentence, copied word for word, and a short explanation: what the answer says, and what is true.'],
          ['**AI**', 'The AI, its method stamp (interface or API) and the reading’s date.'],
          ['**Source cited in support**', 'The page the sentence relies on, with its type and owner, or “no source cited in support”.'],
          ['**Answer**', '**Open the answer** shows the full text, on the right date and the right AI.'],
        ],
      },
      { type: 'p', texte: 'At the end of each row, **See the action** opens the work-list line, and **Dismiss (false alarm)** removes the contradiction: it leaves the work list and does not come back at the next reading. Dismissed rows stay visible, folded, under **Dismissed by hand**; **Put back in the list** brings them back.' },
      { type: 'capture', nom: 'faits-contradictions', legende: 'The answers that contradict a fact check: the sentence found, the AI, the source cited in support and the link to the answer.' },
      { type: 'h2', id: 'step-by-step', texte: 'Getting wrong information corrected' },
      {
        type: 'etapes',
        items: [
          { titre: 'Write five to ten facts', texte: 'Start with what changes often and is costly when wrong: the price, the offer, the countries served.' },
          { titre: 'Check the answers', texte: 'Click **Check the answers**: the price is written on the button. The answers come back compared within moments.' },
          { titre: 'Reread each sentence', texte: '**Open the answer** shows the sentence in context. If the small model got it wrong, **Dismiss (false alarm)**.' },
          { titre: 'Go back to the source', texte: 'If a source is cited in support, that is what needs correcting: your page if it is yours, otherwise the site that publishes it.' },
          { titre: 'Log the outreach', texte: '**See the action** opens the line’s sheet: log the correction request you sent, then mark the line “Done” once the page is corrected.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'The small model can be wrong both ways: flag a correct sentence, or miss a mistake. Every row links to the full answer: reread before writing to a site. Information missing from an answer is not a contradiction, and neither is a sentence that says the same thing in other words. Getting the source corrected does not guarantee the AI will change its answer: the next measurement will tell.' },
      {
        type: 'liens',
        items: [
          { page: 'agir/liste-de-travail' },
          { page: 'agir/prises-de-contact' },
          { page: 'cas/information-fausse' },
        ],
      },
    ],
  },
}

export default page
