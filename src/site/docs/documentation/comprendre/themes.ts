import type { PageDoc } from '../../types'

// Étiquettes des questions (src/lib/etiquettes.ts, src/app/(app)/questions/actions.ts)
// et carte des thèmes de l'écran /questions (classerThemes et ETATS_THEME dans
// src/lib/classements.ts).
const page: PageDoc = {
  id: 'comprendre/themes',
  rubrique: 'comprendre',
  slug: { fr: 'comprendre/themes', en: 'understand/topic-map' },
  titre: { fr: 'Thèmes et carte des thèmes', en: 'Topics and the topic map' },
  resume: {
    fr: 'Un thème et une intention par question, posés par un petit modèle ou à la main, puis la carte des thèmes : ceux que la marque tient, ceux qu’on lui prend.',
    en: 'A topic and an intent for each prompt, set by a small model or by hand, then the topic map: the topics the brand holds, and those another brand takes from it.',
  },
  ecrans: ['/questions', '/questions/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Avec quelques dizaines de questions, une ligne par question ne suffit plus pour savoir où mettre l’effort. Les étiquettes rangent les questions par famille de sujets et par intention, et la **Carte des thèmes** dit, pour chaque famille, si la marque la tient, la dispute, ou la laisse à un autre.' },
      { type: 'p', texte: 'Tout se passe sur l’écran Questions : le bandeau d’étiquetage, le bloc **Filtrer et grouper** et la carte, en bas de l’écran. Les étiquettes d’une question se corrigent sur sa page, par **Modifier les étiquettes**.' },
      { type: 'capture', nom: 'questions', legende: 'L’écran Questions du projet Facturo : chaque question porte son thème et son intention ; la carte des thèmes est en bas de l’écran.' },
      { type: 'h2', id: 'etiquettes', texte: 'Les deux étiquettes' },
      {
        type: 'tableau',
        colonnes: ['Étiquette', 'Ce qu’elle dit'],
        lignes: [
          ['**Thème**', 'La famille de sujets de la question, en un à trois mots, sans nom de marque : « facturation », « gestion d’entreprise ». Un thème réunit plusieurs questions ; le modèle en garde peu, huit au plus.'],
          ['**Intention** : s’informer', 'Comprendre un sujet, apprendre comment faire.'],
          ['**Intention** : comparer', 'Choisir entre plusieurs offres : le meilleur, un comparatif, un avis, « quel outil choisir ».'],
          ['**Intention** : acheter', 'Prêt à passer à l’acte : prix, devis, essai gratuit, inscription, où acheter.'],
        ],
      },
      { type: 'p', texte: 'Une troisième indication n’est pas une étiquette : « avec le nom de la marque » ou « sans nom de marque » se déduit du texte de la question, sans modèle. Les questions sans nom de marque sont celles qui amènent de nouveaux clients.' },
      { type: 'h2', id: 'poser', texte: 'Poser les étiquettes' },
      { type: 'p', texte: 'Tant que des questions n’ont pas d’étiquette, un bandeau propose **Étiqueter les questions**, avec son prix : moins d’un dixième de centime par question. Le petit modèle range les questions par lots de soixante et reprend les thèmes déjà posés, pour que la liste reste courte et stable. C’est un appel payant, inscrit au journal des coûts, qui ne part que sur votre clic.' },
      { type: 'p', texte: 'Après ce premier clic, les questions ajoutées ensuite sont étiquetées toutes seules : celles écrites dans la fiche du projet, comme celles ajoutées depuis une idée. **Couper l’étiquetage automatique** l’arrête, sur le même écran ; **Activer l’étiquetage automatique** le remet.' },
      { type: 'encadre', ton: 'conseil', titre: 'Une correction à la main l’emporte', texte: 'Sur la page d’une question, **Modifier les étiquettes** permet de choisir le thème (40 signes au plus) et l’intention, puis **Enregistrer**. Sur l’écran Questions, cochez plusieurs questions et tapez un thème, puis **Changer le thème**. C’est gratuit, et le modèle ne touche plus jamais une étiquette posée à la main.' },
      { type: 'h2', id: 'filtrer', texte: 'Filtrer et grouper les questions' },
      { type: 'p', texte: 'Le bloc **Filtrer et grouper** du tableau des questions garde les questions d’un **Thème** ou d’une **Intention**, ou celles **Avec** ou **Sans** le **Nom de la marque**. **Grouper par** range le tableau en sections, par thème ou par intention. Un clic sur l’étiquette de thème d’une question filtre aussi le tableau sur ce thème.' },
      { type: 'h2', id: 'carte', texte: 'La carte des thèmes' },
      { type: 'p', texte: 'Une ligne par thème, avec ses **Questions**, la présence de votre marque (réponses d’interface où elle apparaît, sur les réponses reçues du thème), la **Marque la plus nommée** et l’**État**. Un clic sur un thème filtre le tableau des questions.' },
      {
        type: 'tableau',
        colonnes: ['État', 'Règle'],
        lignes: [
          ['**Tenu**', 'La marque est dans 6 réponses sur 10 ou plus, et aucune autre marque n’y est nommée plus souvent.'],
          ['**Disputé**', 'La marque est présente, mais dans moins de 6 réponses sur 10, ou une autre marque y est nommée plus souvent.'],
          ['**À reprendre**', 'La marque est absente, alors qu’une autre marque est nommée dans 3 réponses sur 10 ou plus.'],
          ['**Angle mort**', 'La marque est absente, et aucune marque n’atteint 3 réponses sur 10 : personne ne tient le thème.'],
          ['**Trop tôt pour dire**', 'Moins de 5 réponses lues sur le thème.'],
        ],
      },
      { type: 'p', texte: 'La part de votre marque se compte sur toutes les réponses d’interface reçues du thème ; celle des autres marques, sur les réponses dont les marques sont lues. Les mesures approfondies n’y entrent pas, et les marques que vous avez écartées ne comptent pas comme « la plus nommée ».' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Choisir les thèmes à travailler' },
      {
        type: 'etapes',
        items: [
          { titre: 'Étiqueter les questions', texte: 'Cliquez **Étiqueter les questions** une fois. Le prix est écrit sur le bouton.' },
          { titre: 'Relire les thèmes', texte: 'Deux thèmes trop proches se fusionnent : cochez leurs questions et donnez-leur le même thème avec **Changer le thème**.' },
          { titre: 'Lire la carte', texte: 'Commencez par les thèmes « À reprendre » : un concurrent y est installé, il faut aller là où il est cité. Un « Angle mort » est une place libre à prendre.' },
          { titre: 'Descendre aux questions', texte: 'Un clic sur le thème filtre le tableau ; la page de chaque question dit qui gagne et grâce à quelles pages.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Le petit modèle peut mal ranger une question : relisez les thèmes une fois, puis corrigez à la main. Avec un ou deux relevés par question, l’état d’un thème est une photographie, pas une tendance. Un thème de deux ou trois questions repose sur peu de réponses : il reste « Trop tôt pour dire » tant qu’il n’a pas 5 réponses lues.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/questions' },
          { page: 'mesurer/fiche-question' },
          { page: 'cas/themes-ou-je-suis-absent' },
          { page: 'cas/questions-avec-ou-sans-marque' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'With a few dozen prompts, one row per prompt is no longer enough to know where to put the effort. Tags group the prompts by topic and by intent, and the **Topic map** says, for each topic, whether the brand holds it, contests it, or leaves it to another brand.' },
      { type: 'p', texte: 'Everything happens on the Prompts screen: the tagging banner, the **Filter and group** block and the map, at the bottom of the screen. A prompt’s tags are corrected on its page, through **Edit tags**.' },
      { type: 'capture', nom: 'questions', legende: 'The Prompts screen of the Facturo UK project: each prompt carries its topic and intent; the topic map is at the bottom of the screen.' },
      { type: 'h2', id: 'tags', texte: 'The two tags' },
      {
        type: 'tableau',
        colonnes: ['Tag', 'What it says'],
        lignes: [
          ['**Topic**', 'The prompt’s family of subjects, in one to three words, without a brand name: “invoicing”, “business management”. A topic groups several prompts; the model keeps few of them, eight at most.'],
          ['**Intent**: learn', 'Understand a subject, learn how to do something.'],
          ['**Intent**: compare', 'Choose between several offers: the best one, a comparison, a review, “which tool to choose”.'],
          ['**Intent**: buy', 'Ready to act: price, quote, free trial, sign-up, where to buy.'],
        ],
      },
      { type: 'p', texte: 'A third indication is not a tag: “with the brand name” or “without the brand name” is deduced from the prompt’s text, without a model. Prompts without the brand name are the ones that bring new customers.' },
      { type: 'h2', id: 'setting', texte: 'Setting the tags' },
      { type: 'p', texte: 'While some prompts have no tag, a banner offers **Tag the prompts**, with its price: less than a tenth of a cent per prompt. The small model files the prompts in batches of sixty and reuses the topics already set, so the list stays short and stable. It is a paid call, logged in the cost journal, sent only on your click.' },
      { type: 'p', texte: 'After that first click, prompts added later are tagged automatically: those written on the project page, as well as those added from an idea. **Turn off automatic tagging** stops it, on the same screen; **Turn on automatic tagging** brings it back.' },
      { type: 'encadre', ton: 'conseil', titre: 'A manual correction takes precedence', texte: 'On a prompt’s page, **Edit tags** lets you choose the topic (40 characters at most) and the intent, then **Save**. On the Prompts screen, select several prompts, type a topic, then **Change topic**. It is free, and the model never touches a tag set by hand again.' },
      { type: 'h2', id: 'filtering', texte: 'Filtering and grouping the prompts' },
      { type: 'p', texte: 'The **Filter and group** block of the prompts table keeps the prompts of a **Topic** or an **Intent**, or those **With** or **Without** the **Brand name**. **Group by** splits the table into sections, by topic or by intent. Clicking a prompt’s topic tag also filters the table on that topic.' },
      { type: 'h2', id: 'map', texte: 'The topic map' },
      { type: 'p', texte: 'One row per topic, with its **Prompts**, your brand’s presence (interface answers where it appears, out of the answers received for the topic), the **Most mentioned brand** and the **Status**. Clicking a topic filters the prompts table.' },
      {
        type: 'tableau',
        colonnes: ['Status', 'Rule'],
        lignes: [
          ['**Held**', 'The brand is in 6 answers out of 10 or more, and no other brand is mentioned more often.'],
          ['**Contested**', 'The brand is present, but in fewer than 6 answers out of 10, or another brand is mentioned more often.'],
          ['**To win back**', 'The brand is absent while another brand is mentioned in 3 answers out of 10 or more.'],
          ['**Blind spot**', 'The brand is absent and no brand reaches 3 answers out of 10: nobody holds the topic.'],
          ['**Too early to tell**', 'Fewer than 5 answers read on the topic.'],
        ],
      },
      { type: 'p', texte: 'Your brand’s share is counted on all interface answers received for the topic; other brands’ share, on the answers whose brands have been read. Deep measurements are left out, and the brands you dismissed do not count as “most mentioned”.' },
      { type: 'h2', id: 'step-by-step', texte: 'Choosing the topics to work on' },
      {
        type: 'etapes',
        items: [
          { titre: 'Tag the prompts', texte: 'Click **Tag the prompts** once. The price is written on the button.' },
          { titre: 'Review the topics', texte: 'Two topics that are too close can be merged: select their prompts and give them the same topic with **Change topic**.' },
          { titre: 'Read the map', texte: 'Start with the “To win back” topics: a competitor has settled there, and you need to go where it is cited. A “Blind spot” is a free spot to take.' },
          { titre: 'Go down to the prompts', texte: 'Clicking the topic filters the table; each prompt’s page says who wins and thanks to which pages.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'The small model can misfile a prompt: review the topics once, then correct by hand. With one or two runs per prompt, a topic’s status is a snapshot, not a trend. A topic with two or three prompts rests on few answers: it stays “Too early to tell” until it has 5 answers read.' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/questions' },
          { page: 'mesurer/fiche-question' },
          { page: 'cas/themes-ou-je-suis-absent' },
          { page: 'cas/questions-avec-ou-sans-marque' },
        ],
      },
    ],
  },
}

export default page
