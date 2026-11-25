// Cas d'usage : la carte des thèmes, pour voir où un concurrent tient la place.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/themes-ou-je-suis-absent',
  rubrique: 'face-aux-concurrents',
  slug: { fr: 'themes-ou-je-suis-absent', en: 'topics-where-i-am-absent' },
  titre: {
    fr: 'Sur quels thèmes suis-je absent alors qu’un concurrent tient la place ?',
    en: 'On which topics am I absent while a competitor holds the ground?',
  },
  resume: {
    fr: 'Étiqueter les questions par thème, lire la carte des thèmes (tenu, disputé, à reprendre, angle mort) et choisir où mettre l’effort, thème par thème.',
    en: 'Tag prompts by topic, read the topic map (held, contested, to win back, blind spot) and choose where to put the effort, one topic at a time.',
  },
  ecrans: ['/questions', '/questions/[id]', '/actions'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Les questions de Facturo touchent plusieurs sujets : les devis, les relances d’impayés, la facture électronique, par exemple. Lire la visibilité question par question ne dit pas où se trouve le vrai trou. Regroupées par thème, les questions montrent les sujets où un concurrent est installé et ceux que personne ne tient encore.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Des questions étiquetées : un thème et une intention pour chacune. Un petit modèle les pose pour moins d’un centime ; vous pouvez aussi les poser vous-même, gratuitement.',
          'Assez de réponses lues par thème : en dessous de 5, l’état du thème est « trop tôt pour dire ».',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Étiqueter les questions',
            texte: 'Sur **Questions**, le bandeau propose **Étiqueter les questions** avec son prix. Chaque question reçoit un thème et une intention (s’informer, comparer, acheter). Après ce premier clic, les questions ajoutées sont étiquetées toutes seules ; cela se coupe au même endroit. Une étiquette se corrige sur la page de la question, par **Modifier les étiquettes** ; une étiquette posée à la main n’est plus changée par le modèle.',
          },
          {
            titre: 'Lire la carte des thèmes',
            texte: 'Plus bas sur **Questions**, la **Carte des thèmes** donne pour chaque thème le nombre de questions, la présence de Facturo (réponses où elle apparaît, sur les réponses reçues), la **Marque la plus nommée** et un **État**.',
            capture: 'questions',
          },
          {
            titre: 'Comprendre les états',
            texte: '**Tenu** : Facturo est dans 6 réponses sur 10 ou plus, et aucune autre marque n’y est nommée plus souvent. **Disputé** : présente, mais moins souvent, ou dépassée. **À reprendre** : absente, alors qu’une autre marque est nommée dans 3 réponses sur 10 ou plus. **Angle mort** : absente, et personne n’atteint 3 réponses sur 10. La règle de chaque état est rappelée dans la bulle d’aide de la colonne.',
          },
          {
            titre: 'Descendre au niveau des questions',
            texte: 'Un clic sur un thème filtre le tableau des questions sur ce thème. **Grouper par** **Thème** range tout le tableau par thème. Sur chaque question, le bloc **Sur cette question** dit **Qui gagne** et quelles pages font gagner.',
          },
          {
            titre: 'Passer aux actions',
            texte: 'Sur la page d’une question, **Actions liées** renvoie aux lignes de la liste de travail qui en découlent : pages où apparaître, pages à reformuler, vidéos à tourner.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      {
        type: 'liste',
        items: [
          '**À reprendre** : un concurrent occupe le thème. Le travail part des pages qui le font citer.',
          '**Angle mort** : personne ne tient le thème. Une bonne page peut suffire à y entrer la première.',
          '**Disputé** : vous y êtes déjà. Renforcer ce qui marche coûte souvent moins que conquérir un thème.',
          '**Tenu** : surveiller, sans y passer la semaine.',
        ],
      },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Avec un ou deux relevés par question, l’état d’un thème est une photographie, pas une tendance. La carte ne compte que les relevés d’interface, hors mesures approfondies ; la part de Facturo se compte sur toutes les réponses reçues, celle des autres marques sur les réponses dont les marques sont lues. Un thème mal étiqueté fausse sa ligne : relisez les étiquettes du modèle.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'comprendre/themes' },
          { page: 'mesurer/questions' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/pages-ou-apparaitre' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Facturo’s prompts cover several subjects: quotes, chasing unpaid invoices, e-invoicing, for example. Reading visibility prompt by prompt does not tell you where the real gap is. Grouped by topic, the prompts show the subjects where a competitor is settled and those nobody holds yet.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'Tagged prompts: a topic and an intent for each. A small model sets them for less than a cent; you can also set them yourself, for free.',
          'Enough answers read per topic: below 5, the topic’s status is “too early to tell”.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Tag the prompts',
            texte: 'On **Prompts**, the banner offers **Tag the prompts** with its price. Each prompt gets a topic and an intent (learn, compare, buy). After this first click, added prompts are tagged automatically; you can turn that off in the same place. A tag is corrected on the prompt page with **Edit tags**; a tag set by hand is no longer changed by the model.',
          },
          {
            titre: 'Read the topic map',
            texte: 'Further down **Prompts**, the **Topic map** gives for each topic the number of prompts, Facturo’s presence (answers where it appears, out of answers received), the **Most mentioned brand** and a **Status**.',
            capture: 'questions',
          },
          {
            titre: 'Understand the statuses',
            texte: '**Held**: Facturo is in 6 answers out of 10 or more, and no other brand is mentioned more often. **Contested**: present, but less often, or overtaken. **To win back**: absent while another brand is mentioned in 3 answers out of 10 or more. **Blind spot**: absent, and nobody reaches 3 answers out of 10. The rule for each status is repeated in the column’s help bubble.',
          },
          {
            titre: 'Go down to the prompts',
            texte: 'Clicking a topic filters the prompts table to that topic. **Group by** **Topic** sorts the whole table by topic. On each prompt, the **On this prompt** block tells you **Who wins** and which pages make them win.',
          },
          {
            titre: 'Move on to actions',
            texte: 'On a prompt page, **Related actions** leads to the work list rows that follow from it: pages to appear on, pages to rewrite, videos to make.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      {
        type: 'liste',
        items: [
          '**To win back**: a competitor holds the topic. The work starts from the pages that get it cited.',
          '**Blind spot**: nobody holds the topic. A good page may be enough to get in first.',
          '**Contested**: you are already there. Strengthening what works often costs less than conquering a topic.',
          '**Held**: keep watching, without spending the week on it.',
        ],
      },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'With one or two runs per prompt, a topic’s status is a snapshot, not a trend. The map counts interface readings only, deep measurements excluded; Facturo’s share is counted on all answers received, other brands’ on answers whose brands have been read. A badly tagged topic skews its row: review the model’s tags.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'comprendre/themes' },
          { page: 'mesurer/questions' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/pages-ou-apparaitre' },
        ],
      },
    ],
  },
}

export default page
