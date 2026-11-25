// Cas d'usage : une IA affirme sur la marque autre chose qu'un fait vérifié.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/information-fausse',
  rubrique: 'contenus-et-reputation',
  slug: { fr: 'information-fausse', en: 'wrong-information' },
  titre: {
    fr: 'Une IA répète une information fausse sur ma marque : que faire ?',
    en: 'An AI keeps saying something wrong about my brand: what can I do?',
  },
  resume: {
    fr: 'Écrire ce qui est vrai sur la marque, repérer les réponses qui disent autre chose, remonter à la page qui sert de source, puis corriger ou demander une correction.',
    en: 'Write down what is true about the brand, spot the answers that say otherwise, trace the page used as a source, then fix it or ask its author for a correction.',
  },
  ecrans: ['/faits', '/actions', '/questions/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Un prospect vous écrit que Facturo « coûte plus cher que prévu ». Il a lu un prix dans une réponse d’IA, et ce prix n’est plus le vôtre depuis longtemps. Une erreur répétée par une IA se propage sans bruit : il faut la repérer, retrouver d’où elle vient, et la corriger à la source.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Des faits vérifiés sur la marque, écrits par vous : un prix, une offre, un pays, une date de création. Vingt au plus par projet ; les saisir est gratuit.',
          'Des réponses qui nomment Facturo. Les questions qui contiennent le nom de la marque en donnent le plus.',
          'Un premier clic payant pour comparer les réponses déjà relevées ; les suivantes sont comparées pendant leur lecture automatique, sans appel en plus.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Écrire ce qui est vrai',
            texte: 'Ouvrez **Faits vérifiés**. Dans **Ce qui est vrai sur Facturo**, écrivez un fait par ligne, comme une phrase complète, précise et vérifiable : le prix de l’offre de départ, les pays servis, la date de création. Le bloc **Quels faits écrire** donne des exemples. Cinq à vingt faits suffisent.',
          },
          {
            titre: 'Comparer les réponses aux faits',
            texte: 'Le bouton **Vérifier les réponses** affiche son prix avant le clic. Un petit modèle relit chaque réponse qui nomme Facturo et relève les phrases qui contredisent un fait. Les réponses qui ne nomment pas la marque ne sont pas relues : elles ne peuvent pas la contredire.',
          },
          {
            titre: 'Lire les contradictions',
            texte: 'Le tableau **Réponses qui disent autre chose** donne, pour chaque phrase, le **Fait vérifié** contredit, **Ce que dit la réponse**, l’IA et sa méthode (interface ou API), la **Source citée à l’appui**, un lien vers la réponse complète et la **Suite à donner**. Une fausse alerte s’écarte avec **Écarter (fausse alerte)**.',
            capture: 'faits',
          },
          {
            titre: 'Remonter à la source',
            texte: 'Si la phrase s’appuie sur une page de facturo.exemple, corrigez votre page : une ancienne grille tarifaire oubliée suffit à tromper une IA. Si la page est celle d’un autre site, son auteur peut la corriger. Si aucune source n’est citée, vérifiez que vos propres pages disent ce fait clairement, à un endroit facile à trouver.',
          },
          {
            titre: 'Suivre la correction',
            texte: 'Chaque contradiction est aussi une ligne d’**Actions**, dans le groupe **Corriger un fait faux**. Notez-y la **Demande de correction** envoyée dans **Prises de contact**, puis passez la ligne à **Fait** quand la source est corrigée. Les relevés suivants diront si la phrase revient.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Qui doit corriger quoi : votre équipe si la source est à vous, l’auteur d’une page tierce sinon, et une page plus claire de votre côté quand l’IA ne cite rien. Et quelles erreurs passent en premier : celles qui reviennent chez plusieurs IA, ou qui touchent au prix.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Le petit modèle peut se tromper : relisez la phrase dans la réponse complète avant d’écrire à un site. Une information absente d’une réponse n’est pas une contradiction. Ici, interface et API sont comptées ensemble, parce qu’on relit des phrases au lieu de mesurer une part ; chaque ligne dit sa méthode. Une source corrigée peut mettre du temps à disparaître des réponses, et rien ne garantit qu’elle disparaîtra.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'comprendre/faits-verifies' },
          { page: 'agir/prises-de-contact' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/questions-avec-ou-sans-marque' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'A prospect writes that Facturo “costs more than expected”. They read a price in an AI answer, and that price has not been yours for a long time. An error repeated by an AI spreads quietly: you need to spot it, find where it comes from, and fix it at the source.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'Verified facts about the brand, written by you: a price, a plan, a country, a founding date. Twenty at most per project; entering them is free.',
          'Answers that name Facturo. Prompts that contain the brand name produce the most.',
          'One paid click to compare the answers already captured; later ones are compared during their automatic reading, at no extra cost.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Write down what is true',
            texte: 'Open **Fact checks**. In **What is true about Facturo**, write one fact per line, as a full sentence, precise and checkable: the price of the starter plan, the countries served, the founding date. The **Which facts to write** block gives examples. Five to twenty facts are enough.',
          },
          {
            titre: 'Compare the answers with the facts',
            texte: 'The **Check the answers** button shows its price before you click. A small model rereads each answer that names Facturo and picks out the sentences that contradict a fact. Answers that do not name the brand are not reread: they cannot contradict it.',
          },
          {
            titre: 'Read the contradictions',
            texte: 'The **Answers that say otherwise** table gives, for each sentence, the **Verified fact** contradicted, **What the answer says**, the AI and its method (interface or API), the **Source cited in support**, a link to the full answer and the **Next step**. A false alarm is set aside with **Dismiss (false alarm)**.',
            capture: 'faits',
          },
          {
            titre: 'Trace the source',
            texte: 'If the sentence relies on a page of facturo.exemple, fix your page: an old, forgotten price list is enough to mislead an AI. If the page belongs to another site, its author can correct it. If no source is cited, check that your own pages state the fact clearly, somewhere easy to find.',
          },
          {
            titre: 'Follow the correction',
            texte: 'Each contradiction is also a row in **Actions**, in the **Correct a wrong fact** group. Log the **Correction request** you sent under **Outreach**, then set the row to **Done** once the source is fixed. The next runs will tell whether the sentence comes back.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Who must fix what: your team if the source is yours, the author of a third-party page otherwise, and a clearer page on your side when the AI cites nothing. And which errors come first: those that recur across several AIs, or that concern the price.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'The small model can be wrong: reread the sentence in the full answer before writing to a site. Information missing from an answer is not a contradiction. Here, interface and API are counted together, because sentences are reread rather than a share measured; each row states its method. A corrected source can take time to disappear from answers, and nothing guarantees that it will.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'comprendre/faits-verifies' },
          { page: 'agir/prises-de-contact' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/questions-avec-ou-sans-marque' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
  },
}

export default page
