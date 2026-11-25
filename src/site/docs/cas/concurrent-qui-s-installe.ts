// Cas d'usage : repérer un concurrent qui gagne du terrain, et où.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/concurrent-qui-s-installe',
  rubrique: 'face-aux-concurrents',
  slug: { fr: 'concurrent-qui-s-installe', en: 'competitor-moving-in' },
  titre: {
    fr: 'Quel concurrent s’installe sur mes sujets ?',
    en: 'Which competitor is moving in on my topics?',
  },
  resume: {
    fr: 'Repérer la marque qui monte dans les réponses des IA, vérifier que la hausse dépasse la marge d’erreur, puis voir sur quelles questions et grâce à quelles pages.',
    en: 'Spot the brand that is rising in AI answers, check that the rise is beyond the margin of error, then see on which prompts and thanks to which pages.',
  },
  ecrans: ['/concurrents', '/rapport', '/vue', '/sources'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Il y a deux mois, Tikette n’apparaissait presque jamais dans les réponses sur la facturation des indépendants. Depuis quelques relevés, son nom revient. Avant de réagir, il faut savoir si la hausse est réelle, sur quelles questions elle se joue, chez quelles IA, et quelles pages la portent.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Plusieurs semaines de relevés : une hausse se lit entre deux périodes, pas entre deux jours.',
          'Le concurrent suivi dans le projet, avec son site déclaré si vous le connaissez : ses pages citées lui sont alors attribuées.',
          'Des réponses dont les marques sont lues.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Repérer qui monte',
            texte: 'Ouvrez **Concurrents** et choisissez une période assez longue dans la barre du haut, huit semaines ou trois mois. Dans le tableau **Classement**, la colonne **Écart** compare chaque marque à la période d’avant ; elle n’est colorée que si l’écart dépasse la marge d’erreur. Le graphique **Dans le temps : nous et les cinq premiers** trace la part des réponses lues qui nomment chaque marque, relevé après relevé.',
            capture: 'concurrents',
          },
          {
            titre: 'Repérer les nouveaux venus',
            texte: 'Ouvrez **Rapport**. La tuile **Nouvelles marques** et le bloc **Marques nommées pour la première fois** listent les marques nommées au dernier relevé et dans aucune réponse du précédent. Un nom inconnu qui revient d’un rapport à l’autre mérite d’être suivi : le bouton **Suivre** est sur la même ligne.',
          },
          {
            titre: 'Se placer face à lui',
            texte: 'Dans la barre du haut, le filtre **Face à** ne garde que les réponses qui nomment Tikette. Tous les écrans se recalculent : la visibilité de Facturo devient sa présence quand Tikette est cité, la liste des sources devient celle des réponses où Tikette apparaît. **Toutes les réponses** retire le filtre.',
          },
          {
            titre: 'Voir les questions où il passe devant',
            texte: 'Sur **Concurrents**, la grille **Question par question, IA par IA**, réglée sur **Face à un concurrent** puis sur Tikette, dit pour chaque question et chaque IA qui est devant. Le tableau **Face-à-face** compare les deux marques mesure par mesure.',
          },
          {
            titre: 'Trouver les pages qui le portent',
            texte: 'Ouvrez **Sources**. Dans la barre **À qui profitent les citations**, un clic sur la part « Concurrents suivis » filtre les tableaux sur les pages des concurrents. Sur l’onglet **Pages**, la fiche d’une page donne les marques nommées dans les réponses qui la citent : c’est souvent un comparatif tiers qui fait entrer une marque.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'S’il faut répondre, et où. Une hausse au-dessus de la marge, concentrée sur quelques questions et portée par quelques pages, se travaille : entrer dans les mêmes comparatifs, écrire une meilleure réponse sur ces questions. Une hausse dans la marge se surveille au relevé suivant.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Une hausse au-dessus de la marge dit que le concurrent est plus souvent nommé, pas pourquoi. « Pour la première fois » se lit par rapport au relevé précédent seulement. Les marques des IA autres que ChatGPT viennent de la lecture automatique, qui peut confondre deux noms proches. Le filtre **Face à** s’applique à tous les écrans tant que vous ne le retirez pas.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'comprendre/concurrents' },
          { page: 'piloter/rapport-et-alertes' },
          { page: 'comprendre/sources' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Two months ago, Tikette hardly ever appeared in answers about invoicing for freelancers. For a few runs now, its name keeps coming back. Before reacting, you need to know whether the rise is real, on which prompts it plays out, on which AIs, and which pages carry it.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'Several weeks of runs: a rise is read between two periods, not between two days.',
          'The competitor tracked in the project, with its site declared if you know it: its cited pages are then attributed to it.',
          'Answers whose brands have been read.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Spot who is rising',
            texte: 'Open **Competitors** and choose a long enough period in the top bar, eight weeks or three months. In the **Ranking** table, the **Change** column compares each brand with the previous period; it is coloured only when the change is beyond the margin of error. The **Over time: us and the top five** chart plots the share of answers read that mention each brand, run after run.',
            capture: 'concurrents',
          },
          {
            titre: 'Spot the newcomers',
            texte: 'Open **Report**. The **New brands** tile and the **Brands mentioned for the first time** block list the brands mentioned in the latest run and in no answer of the previous one. An unknown name that keeps coming back from one report to the next deserves tracking: the **Track** button is on the same row.',
          },
          {
            titre: 'Stand face to face',
            texte: 'In the top bar, the **Versus** filter keeps only the answers that mention Tikette. Every screen is recomputed: Facturo’s visibility becomes its presence when Tikette is named, and the source list becomes that of the answers where Tikette appears. **All answers** removes the filter.',
          },
          {
            titre: 'See the prompts where it gets ahead',
            texte: 'On **Competitors**, the **Prompt by prompt, AI by AI** grid, set to **Versus a competitor** and then to Tikette, tells you for each prompt and each AI who is ahead. The **Head-to-head** table compares the two brands metric by metric.',
          },
          {
            titre: 'Find the pages that carry it',
            texte: 'Open **Sources**. In the **Who gets the citations** bar, clicking the “Tracked competitors” share filters the tables to competitors’ pages. On the **Pages** tab, a page’s sheet gives the brands mentioned in the answers that cite it: a third-party comparison page is often what brings a brand in.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Whether to respond, and where. A rise beyond the margin, concentrated on a few prompts and carried by a few pages, can be worked on: get into the same comparison pages, write a better answer on those prompts. A rise within the margin is watched at the next run.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'A rise beyond the margin says the competitor is mentioned more often, not why. “For the first time” is read against the previous run only. Brands for AIs other than ChatGPT come from automatic reading, which can mix up two similar names. The **Versus** filter applies to every screen until you remove it.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'comprendre/concurrents' },
          { page: 'piloter/rapport-et-alertes' },
          { page: 'comprendre/sources' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
  },
}

export default page
