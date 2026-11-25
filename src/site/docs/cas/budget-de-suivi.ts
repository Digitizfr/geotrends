// Cas d'usage : suivre une marque en tenant la dépense sous le plafond du mois.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/budget-de-suivi',
  rubrique: 'technique-et-budget',
  slug: { fr: 'budget-de-suivi', en: 'tracking-on-a-budget' },
  titre: {
    fr: 'Comment suivre une marque sans dépasser son budget ?',
    en: 'How do I track a brand without going over budget?',
  },
  resume: {
    fr: 'Prix affiché avant chaque envoi, rythme des relevés automatiques, seuil de confirmation et plafond du mois : régler la dépense d’un projet avant qu’elle n’arrive.',
    en: 'Price shown before each send, pace of automatic runs, confirmation threshold and monthly cap: set a project’s spending before it happens, not after.',
  },
  ecrans: ['/projets/[id]', '/reglages', '/admin/couts', '/questions'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Facturo vient s’ajouter aux projets déjà suivis, et le budget du mois ne bouge pas. Chaque question coûte un peu à chaque relevé, chaque IA a son prix, et Claude coûte bien plus que les autres. Tout se règle avant l’envoi : rien ne part sans un clic, ou sans un rythme que vous avez activé.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'La liste des questions du projet : le prix d’un relevé est proportionnel à leur nombre.',
          'Un compte administrateur pour changer le plafond du mois, commun à tous les projets ; il vaut 20 $ tant que personne ne le change.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Lire le prix avant l’envoi',
            texte: 'Ouvrez la fiche du projet, onglet **Relevés**. Le bloc **Lancer un relevé** donne, pour chaque IA, son **Prix par question** (0,0012 $ par l’interface, environ 0,06 $ pour Claude), la date du **Dernier relevé** et le rythme conseillé. Cochez les IA voulues : le **Total de cet envoi** et la dépense du mois après l’envoi s’affichent, puis le bouton **Lancer le relevé** porte le prix.',
            capture: 'projet-releves',
          },
          {
            titre: 'Choisir le rythme automatique',
            texte: 'Dans le même onglet, **Relevés automatiques** propose deux cases : **Chaque semaine : ChatGPT, Gemini, Mode IA et Aperçus IA de Google**, et **Toutes les deux semaines : Claude**. Chacune affiche son coût estimé par mois pour les questions du projet. Laissez Claude décoché si le budget est serré : les quatre IA d’interface montrent ce que voient vos clients.',
          },
          {
            titre: 'Vérifier le total de tous les projets',
            texte: 'Ouvrez **Réglages**. **Rythme des relevés** liste les projets relevés automatiquement, avec leur coût estimé et le total rapporté au plafond. **Confirmation avant un envoi** fixe le montant au-dessus duquel un envoi demande une confirmation de plus ; il vaut 1 $ par défaut.',
            capture: 'reglages',
          },
          {
            titre: 'Tenir le plafond',
            texte: 'Dans **Coûts** (comptes administrateurs), le haut de l’écran montre la dépense du mois face au plafond, avec une barre ; le champ **Plafond mensuel (en dollars)** le change. La tuile **Projection fin de mois** prolonge la dépense au rythme des jours écoulés ; **Par projet, ce mois-ci** et **Par IA relevée, ce mois-ci** disent où part l’argent. Quand le plafond est atteint, les relevés planifiés se suspendent d’eux-mêmes et aucun envoi n’est possible. La dépense du mois reste visible dans le menu, avec sa barre.',
            capture: 'couts',
          },
          {
            titre: 'Alléger la liste',
            texte: 'Sur **Questions**, archivez les questions qui ne servent plus : elles ne sont plus relevées. Avant une **Mesure approfondie**, le prix s’affiche aussi : 25 envois sur quatre IA, c’est cent relevés pour une seule question.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Combien de questions suivre, sur quelles IA et à quel rythme, pour un montant connu d’avance. Et où couper si le mois dérape : Claude d’abord, puis les questions les moins utiles, plutôt que le rythme des IA d’interface, qui fait la tendance.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Le prix de Claude est une moyenne des derniers appels : il varie avec la longueur des réponses et le nombre de recherches. La lecture automatique des réponses et les autres petits appels (étiquettes, classement des sites, faits) s’ajoutent, pour quelques centimes ; tout est inscrit au journal des coûts. Le plafond vaut pour tout l’outil : il n’existe pas de plafond par projet.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'demarrer/couts' },
          { page: 'piloter/couts' },
          { page: 'projet/lancer-un-releve' },
          { page: 'projet/releves-automatiques' },
          { page: 'cas/quelles-ia-regarder' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Facturo UK joins the projects already tracked, and the monthly budget stays the same. Each prompt costs a little at every run, each AI has its price, and Claude costs much more than the others. Everything is set before sending: nothing goes out without a click, or without a schedule you turned on.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'The project’s list of prompts: the price of a run is proportional to their number.',
          'An admin account to change the monthly cap, shared by all projects; it is $20 until someone changes it.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Read the price before sending',
            texte: 'Open the project page, tab **Runs**. The **Start a run** block gives, for each AI, its **Price per prompt** ($0.0012 through the interface, about $0.06 for Claude), the date of the **Last run** and the recommended pace. Tick the AIs you want: the **Total for this run** and the month’s spend after sending appear, and the **Start the run** button carries the price.',
            capture: 'projet-releves',
          },
          {
            titre: 'Choose the automatic pace',
            texte: 'In the same tab, **Automatic runs** offers two boxes: **Every week: ChatGPT, Gemini, Google AI Mode and AI Overviews**, and **Every two weeks: Claude**. Each shows its estimated monthly cost for the project’s prompts. Leave Claude unticked if the budget is tight: the four interface AIs show what your customers see.',
          },
          {
            titre: 'Check the total across projects',
            texte: 'Open **Settings**. **Run schedule** lists the projects with automatic runs, with their estimated cost and the total against the cap. **Confirmation before sending** sets the amount above which a send asks for one more confirmation; it is $1 by default.',
            capture: 'reglages',
          },
          {
            titre: 'Hold the cap',
            texte: 'In **Costs** (admin accounts), the top of the screen shows the month’s spend against the cap, with a bar; the **Monthly cap (in dollars)** field changes it. The **End-of-month projection** tile extends the spend at the pace of the days elapsed; **By project, this month** and **By AI, this month** show where the money goes. When the cap is reached, scheduled runs pause on their own and nothing can be sent. The month’s spend stays visible in the menu, with its bar.',
            capture: 'couts',
          },
          {
            titre: 'Trim the list',
            texte: 'On **Prompts**, archive the prompts that no longer help: they are no longer captured. Before a **Deep measurement**, the price is shown too: 25 sends on four AIs means a hundred readings for a single prompt.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'How many prompts to track, on which AIs and at what pace, for an amount known in advance. And where to cut if the month slips: Claude first, then the least useful prompts, rather than the pace of the interface AIs, which carries the trend.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'Claude’s price is an average of recent calls: it varies with the length of answers and the number of searches. Automatic reading of answers and other small calls (tags, site classification, facts) add a few cents; everything is logged in the cost journal. The cap applies to the whole tool: there is no per-project cap.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'demarrer/couts' },
          { page: 'piloter/couts' },
          { page: 'projet/lancer-un-releve' },
          { page: 'projet/releves-automatiques' },
          { page: 'cas/quelles-ia-regarder' },
        ],
      },
    ],
  },
}

export default page
