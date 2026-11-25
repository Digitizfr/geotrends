// Cas d'usage : une page de la marque est trouvée par l'IA, mais pas retenue.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/page-lue-pas-citee',
  rubrique: 'contenus-et-reputation',
  slug: { fr: 'page-lue-pas-citee', en: 'page-read-not-cited' },
  titre: {
    fr: 'Ma page est lue mais pas citée : que corriger ?',
    en: 'My page is read but not cited: what should I fix?',
  },
  resume: {
    fr: 'Une IA ouvre votre page puis cite celle d’un autre, ou Google la classe sans la reprendre dans son Aperçu IA : comment le voir, comparer et reformuler.',
    en: 'An AI opens your page then cites someone else’s, or Google ranks it without using it in its AI Overview: how to spot it, compare, and rewrite the page.',
  },
  ecrans: ['/sources', '/questions/[id]', '/google', '/actions', '/audit'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'ChatGPT ouvre la page « Facturer en auto-entrepreneur » de facturo.exemple, puis répond en citant un comparatif et la page d’un concurrent. Votre page a été trouvée : c’est le plus dur. Elle a été écartée : c’est ce qu’il faut corriger. C’est souvent le gain le plus rapide de la liste de travail.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Des relevés de ChatGPT ou de Claude : ce sont les seules IA qui disent quelles pages elles ont lues sans les citer.',
          'Pour le cas de Google : des relevés des Aperçus IA, qui rapportent aussi les dix premiers résultats classiques.',
          'Le site de la marque déclaré dans le projet.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Trouver vos pages écartées',
            texte: 'Ouvrez **Sources**, onglet **Nos pages**. Pour chaque page de Facturo : le nombre de réponses où elle est **Citée**, le nombre de fois où elle a été **Lue sans être citée**, sa place **Chez Google** sur vos questions, et les **Pages citées à sa place**.',
          },
          {
            titre: 'Comparer avec les pages citées à sa place',
            texte: 'Ouvrez les pages citées à la place de la vôtre, puis la page de la question concernée. Le bloc **Les pages qui font gagner** liste les pages citées par deux IA ou plus. Regardez ce qu’elles ont et que la vôtre n’a pas : une réponse dès les premières lignes, un tableau, un prix, une date.',
          },
          {
            titre: 'Repérer le cas de Google',
            texte: 'Ouvrez **Aperçus IA et Google**. Le tableau **Que faire, question par question** croise deux questions : êtes-vous dans les dix premiers résultats, et l’Aperçu vous cite-t-il ? La case **Page à reformuler** compte les questions où votre page est bien classée mais absente de l’Aperçu. Un clic filtre le détail.',
            capture: 'google',
          },
          {
            titre: 'Ouvrir la ligne de travail et auditer la page',
            texte: 'Sur **Actions**, le groupe **Corriger nos pages** contient « Reformuler une page lue par l’IA mais pas citée » et « Reformuler la page classée n° … sur Google, absente de l’Aperçu IA ». Le lien **Auditer cette page** lance **Audit d’une page** : d’abord les **Points bloquants**, puis les **Points à revoir** (titre principal, sous-titres, texte lisible sans JavaScript, données structurées, date).',
            capture: 'audit',
          },
          {
            titre: 'Reformuler, puis marquer l’action faite',
            texte: 'Réécrivez la page pour qu’elle réponde à la question en tête, nettement, avec ce que donnent les pages citées à sa place. Puis passez la ligne à **Fait**, à la date de mise en ligne : l’outil comparera la présence de Facturo sur ces questions avant et après.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Quelle page réécrire en premier, et dans quel sens. Une page lue par plusieurs IA, ou classée dans les dix premiers sans être reprise, passe avant une page jamais trouvée : celle-là a d’abord un problème de référencement.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Gemini et Google ne disent pas quelles pages ils ont lues : chez eux, une page écartée ne se voit pas. Une page lue une seule fois peut l’avoir été par hasard. L’audit dit ce qui empêche une IA de lire ou de reprendre la page, pas si elle sera citée. Et une hausse après la réécriture est un indice à vérifier, pas la preuve que la réécriture l’a causée.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'comprendre/sources' },
          { page: 'comprendre/google' },
          { page: 'agir/audit' },
          { page: 'cas/robots-des-ia' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'ChatGPT opens the “Invoicing as a sole trader” page on facturo.exemple, then answers by citing a comparison page and a competitor’s page. Your page was found: that is the hard part. It was set aside: that is what needs fixing. It is often the quickest win in the work list.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'ChatGPT or Claude readings: they are the only AIs that say which pages they read without citing them.',
          'For the Google case: AI Overviews readings, which also bring back the top ten classic results.',
          'The brand’s site declared in the project.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Find your pages that were set aside',
            texte: 'Open **Sources**, tab **Our pages**. For each Facturo page: the number of answers where it is **Cited**, the number of times it was **Read, not cited**, its place **On Google** for your prompts, and the **Pages cited instead**.',
          },
          {
            titre: 'Compare with the pages cited instead',
            texte: 'Open the pages cited instead of yours, then the page of the prompt concerned. The **Winning pages** block lists the pages cited by two AIs or more. Look at what they have that yours lacks: an answer in the first lines, a table, a price, a date.',
          },
          {
            titre: 'Spot the Google case',
            texte: 'Open **AI Overviews & Google**. The **What to do, prompt by prompt** table crosses two questions: are you in the top ten results, and does the Overview cite you? The **Page to rewrite** cell counts the prompts where your page ranks well but is missing from the Overview. One click filters the detail.',
            capture: 'google',
          },
          {
            titre: 'Open the work-list row and audit the page',
            texte: 'On **Actions**, the **Fix our pages** group holds “Rewrite a page read by the AI but not cited” and “Rewrite the page ranked no. … on Google, missing from the AI Overview”. The **Audit this page** link runs **Page audit**: first the **Blocking issues**, then the **Points to review** (main heading, subheadings, text readable without JavaScript, structured data, date).',
            capture: 'audit',
          },
          {
            titre: 'Rewrite, then mark the action done',
            texte: 'Rewrite the page so that it answers the prompt at the top, clearly, with what the pages cited instead provide. Then set the row to **Done**, on the date it went live: the tool will compare Facturo’s presence on these prompts before and after.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Which page to rewrite first, and in which direction. A page read by several AIs, or ranked in the top ten without being used, comes before a page that is never found: that one has an SEO problem first.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'Gemini and Google do not say which pages they read: on them, a page that was set aside cannot be seen. A page read only once may have been read by chance. The audit says what prevents an AI from reading or reusing the page, not whether it will be cited. And a rise after the rewrite is a clue to check, not proof that the rewrite caused it.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'comprendre/sources' },
          { page: 'comprendre/google' },
          { page: 'agir/audit' },
          { page: 'cas/robots-des-ia' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
  },
}

export default page
