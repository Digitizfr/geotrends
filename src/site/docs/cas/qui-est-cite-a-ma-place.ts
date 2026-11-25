// Cas d'usage : les marques et les pages que les IA citent à la place de la nôtre.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/qui-est-cite-a-ma-place',
  rubrique: 'face-aux-concurrents',
  slug: { fr: 'qui-est-cite-a-ma-place', en: 'who-is-cited-instead-of-me' },
  titre: {
    fr: 'Qui est cité à ma place ?',
    en: 'Who is cited instead of me?',
  },
  resume: {
    fr: 'Les marques que les IA nomment sur vos questions, celles à suivre comme concurrents, leur rang, leur part de voix, et les pages qui les font citer à votre place.',
    en: 'The brands AIs name on your prompts, the ones to track as competitors, their position, their share of voice, and the pages that get them cited instead of you.',
  },
  ecrans: ['/vue', '/concurrents', '/questions', '/sources'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Sur « Quel logiciel de facturation choisir pour un auto-entrepreneur ? », Facturo n’apparaît pas. Quelqu’un apparaît forcément à sa place. Vous pensiez à Comptalis et à Devizo ; les IA en nomment peut-être d’autres. Il faut savoir qui, sur quelles questions, et grâce à quelles pages.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Des réponses dont les marques sont lues. ChatGPT les donne avec sa réponse ; pour les autres IA, la lecture automatique les relève après chaque relevé.',
          'Au moins un concurrent suivi pour que la part de voix se calcule. Suivre une marque est gratuit et ne lance aucun relevé.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Voir qui est nommé à votre place',
            texte: 'Sur **Vue d’ensemble**, le bloc **Nommés à notre place** liste les autres marques nommées par les IA d’interface, avec leur nombre de réponses, le nombre de fois où elles sont nommées en premier et leur rang moyen. Le bouton **Suivre** en fait un concurrent du projet.',
          },
          {
            titre: 'Choisir les concurrents à suivre',
            texte: 'Ouvrez **Concurrents**. Le bloc **Marques repérées, pas encore suivies** propose, pour chaque marque nommée, **Suivre** ou **Ignorer**. Ignorer retire la marque de la liste sans rien changer aux chiffres. Suivez Comptalis, Devizo, Tikette, Billbox, et toute marque que vous découvrez ici.',
            capture: 'concurrents',
          },
          {
            titre: 'Lire le classement',
            texte: 'Le tableau **Classement** met Facturo et les concurrents suivis côte à côte : **Nommée dans**, **Part de voix**, **Rang moyen**, **En premier**, **Questions**, **IA**, **Écart**. Le tableau **Face-à-face**, plus bas, reprend chaque mesure en ligne, une marque par colonne, et marque d’un trait vert la meilleure case de chaque ligne.',
          },
          {
            titre: 'Voir qui gagne chaque question',
            texte: 'Sur **Questions**, la colonne **Premier nommé** donne, pour chaque question, la marque le plus souvent nommée en premier. Sur **Concurrents**, la grille **Question par question, IA par IA**, réglée sur **Premier nommé**, le montre IA par IA.',
          },
          {
            titre: 'Trouver les pages qui les font citer',
            texte: 'Ouvrez **Sources**, onglet **Pages**, et choisissez **Seulement les pages citées sans nous**. La colonne **Dont sans nous** compte les réponses qui citent la page sans nommer ni citer Facturo. Un clic sur une ligne ouvre sa fiche : les réponses qui la citent et les marques nommées avec elle.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Quelles marques suivre comme concurrents, et lesquelles écarter. Sur quelles questions chacune prend votre place, chez quelles IA. Et quelles pages, souvent des comparatifs, il faudrait obtenir ou écrire pour entrer dans ces réponses.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Une réponse dont les marques ne sont pas encore lues est écartée des classements : la lecture automatique peut se tromper sur une écriture ou un nom proche, ouvrez quelques réponses pour vérifier. Les marques d’une page citée sont celles de la réponse : le contenu de la page n’est pas lu. Claude, mesuré par son API, a sa propre colonne et n’entre dans aucun total.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'comprendre/concurrents' },
          { page: 'projet/concurrents' },
          { page: 'comprendre/sources' },
          { page: 'cas/concurrent-qui-s-installe' },
          { page: 'cas/pages-ou-apparaitre' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'On “Which invoicing software should a sole trader choose?”, Facturo does not appear. Someone is bound to appear in its place. You had Comptalis and Devizo in mind; the AIs may name others. You need to know who, on which prompts, and thanks to which pages.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'Answers whose brands have been read. ChatGPT returns them with its answer; for the other AIs, automatic reading extracts them after each run.',
          'At least one tracked competitor, so that share of voice can be computed. Tracking a brand is free and starts no run.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'See who is mentioned instead of you',
            texte: 'On **Overview**, the **Mentioned instead of us** block lists the other brands named by interface AIs, with their number of answers, how often they are named first and their average position. The **Track** button makes one a competitor of the project.',
          },
          {
            titre: 'Choose the competitors to track',
            texte: 'Open **Competitors**. The **Brands spotted, not tracked yet** block offers **Track** or **Dismiss** for each brand mentioned. Dismissing removes the brand from the list without changing any number. Track Comptalis, Devizo, Tikette, Billbox, and any brand you discover here.',
            capture: 'concurrents',
          },
          {
            titre: 'Read the ranking',
            texte: 'The **Ranking** table puts Facturo and the tracked competitors side by side: **Mentioned in**, **Share of voice**, **Avg. position**, **First**, **Prompts**, **AI**, **Change**. The **Head-to-head** table further down takes each metric as a row, one brand per column, and marks the best cell of each row with a green rule.',
          },
          {
            titre: 'See who wins each prompt',
            texte: 'On **Prompts**, the **Named first** column gives, for each prompt, the brand most often named first. On **Competitors**, the **Prompt by prompt, AI by AI** grid, set to **Named first**, shows it AI by AI.',
          },
          {
            titre: 'Find the pages that get them cited',
            texte: 'Open **Sources**, tab **Pages**, and select **Only pages cited without us**. The **Without us** column counts the answers that cite the page without naming or citing Facturo. Clicking a row opens its sheet: the answers that cite it and the brands mentioned alongside.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Which brands to track as competitors, and which to dismiss. On which prompts each one takes your place, on which AIs. And which pages, often comparison sites, you would need to get into or to write in order to enter these answers.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'An answer whose brands have not been read yet is left out of the rankings: automatic reading can get a spelling or a similar name wrong, so open a few answers to check. The brands attached to a cited page are those of the answer: the page’s own content is not read. Claude, measured through its API, has its own column and is never part of a total.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'comprendre/concurrents' },
          { page: 'projet/concurrents' },
          { page: 'comprendre/sources' },
          { page: 'cas/concurrent-qui-s-installe' },
          { page: 'cas/pages-ou-apparaitre' },
        ],
      },
    ],
  },
}

export default page
