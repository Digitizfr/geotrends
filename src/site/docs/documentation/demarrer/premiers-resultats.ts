import type { PageDoc } from '../../types'

// Après le premier relevé : dans quel ordre regarder les écrans, et ce qu'il ne
// faut pas encore en conclure.
const page: PageDoc = {
  id: 'demarrer/premiers-resultats',
  rubrique: 'demarrer',
  slug: { fr: 'demarrer/premiers-resultats', en: 'get-started/first-results' },
  titre: { fr: 'Lire ses premiers résultats', en: 'Reading your first results' },
  resume: {
    fr: 'Quand les réponses du premier relevé reviennent : les faire lire, puis regarder la vue d’ensemble, les verdicts, les marques et les sources, dans cet ordre.',
    en: 'When the first run’s answers come back: have them read, then look at the overview, the verdicts, the brands and the sources, in that order, without over-reading.',
  },
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Le premier relevé donne une photographie : une réponse par question et par IA. Elle suffit pour voir où la marque apparaît, qui est nommé à sa place et quelles pages servent de sources. Elle ne suffit pas pour parler d’une tendance. Voici l’ordre de lecture qui tire le plus d’un premier relevé.' },
      { type: 'h2', id: 'attendre', texte: '1. Attendre que les réponses reviennent' },
      { type: 'p', texte: 'Une réponse revient en quelques minutes, 45 au plus ; celles de Claude arrivent par lot en une à deux minutes. Pendant ce temps, l’écran **Questions** affiche « réponses en attente » et se met à jour tout seul. Le bouton **Récupérer les réponses** va les chercher tout de suite : c’est gratuit, seul l’envoi est facturé. Un relevé sans réponse au bout de 6 heures passe en échec.' },
      { type: 'h2', id: 'lire', texte: '2. Faire lire les réponses' },
      { type: 'p', texte: 'Pour comparer les IA, il faut connaître les marques nommées dans chaque réponse, leur ordre et le ton. ChatGPT les donne lui-même ; pour les autres, un petit modèle lit le texte. Les réponses nouvelles sont lues toutes seules par la tâche de fond, qui passe toutes les demi-heures. Si la vue d’ensemble affiche un bandeau de réponses pas encore lues, **Lire les réponses** les lit tout de suite, au prix écrit à côté (environ 0,0008 $ par réponse).' },
      { type: 'h2', id: 'vue', texte: '3. La vue d’ensemble' },
      { type: 'p', texte: 'Lisez d’abord la phrase du haut : la marque apparaît dans tant de réponses d’interface sur tant. Puis la tuile **Visibilité** : elle ne s’affiche qu’à partir de 5 réponses, avec sa marge d’erreur dans la bulle d’aide. Sur un premier relevé, les écarts disent « 1re mesure » : il n’y a rien à comparer.' },
      { type: 'p', texte: 'Le tableau **Présence, IA par IA** dit où la marque est la plus forte et la plus faible, et sous quelle forme : **Site cité**, **Vidéo citée**, **Nom seul** ou **Lu, non cité**. Une page lue mais pas citée est le gain le plus rapide : elle est déjà trouvée.' },
      { type: 'capture', nom: 'vue', legende: 'Après le premier relevé, la vue d’ensemble montre la visibilité par IA et la couverture question par question ; la courbe attend le deuxième relevé.' },
      { type: 'h2', id: 'questions', texte: '4. Les verdicts, question par question' },
      { type: 'p', texte: 'Sur l’écran **Questions**, chaque question reçoit un verdict sur les réponses d’interface de la période : **Solide** (la marque est dans 6 réponses sur 10 ou plus), **Occasionnelle**, **Absente**, ou **Trop tôt pour dire** sous 3 réponses. Avec quatre IA d’interface, un premier relevé donne au plus quatre réponses par question : le verdict existe, mais il reste fragile. Commencez par les questions **absentes** sans nom de marque : ce sont celles où des clients découvrent vos concurrents.' },
      { type: 'h2', id: 'marques', texte: '5. Qui est nommé à votre place' },
      { type: 'p', texte: 'Le bloc **Nommés à notre place** de la vue d’ensemble, et l’écran **Concurrents**, classent les marques que les IA nomment sur vos questions. Suivez celles qui comptent avec **Suivre** : la part de voix et le face-à-face se remplissent, sans aucun nouveau relevé.' },
      { type: 'h2', id: 'sources', texte: '6. Les sources' },
      { type: 'p', texte: 'L’écran **Sources** dit quels sites et quelles pages les IA citent, et à qui profitent ces citations. Lancez une fois **Classer les sites** : chaque site reçoit un type (comparatif, média, blog, forum, annuaire, site de marque…), gardé ensuite pour tous les projets. C’est ce classement qui range la liste de travail : un comparatif ou un annuaire où vos concurrents figurent sans vous passe devant.' },
      { type: 'h2', id: 'agir', texte: '7. La liste de travail' },
      { type: 'p', texte: 'L’écran **Actions** réunit ce qui ressort de ce relevé : vos pages trouvées mais pas citées, les pages des autres où apparaître, les sujets où une vidéo ou une page manque. Chaque ligne renvoie aux réponses qui la justifient.' },
      { type: 'encadre', ton: 'limite', titre: 'Ce qu’un premier relevé ne dit pas', texte: 'Il ne dit pas si la marque monte ou baisse : il faut au moins deux jours de relevé, et les écarts ne se colorent que s’ils dépassent la marge d’erreur. Il ne dit pas non plus ce que voit une personne connectée avec son propre historique : les relevés partent d’une session neutre. Pour trancher sur une question précise, utilisez la [mesure approfondie](doc:mesurer/mesure-approfondie).' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/vue-d-ensemble' },
          { page: 'mesurer/questions' },
          { page: 'comprendre/sources' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'The first run gives a snapshot: one answer per prompt and per AI. It is enough to see where the brand appears, who is mentioned instead and which pages are used as sources. It is not enough to talk about a trend. Here is the reading order that gets the most out of a first run.' },
      { type: 'h2', id: 'wait', texte: '1. Wait for the answers to come back' },
      { type: 'p', texte: 'An answer comes back within minutes, 45 at most; Claude’s arrive in a batch within one to two minutes. Meanwhile, the **Prompts** screen shows “answers pending” and updates by itself. The **Collect the answers** button fetches them right away: it is free, only sending is charged. A reading with no answer after 6 hours is marked failed.' },
      { type: 'h2', id: 'read', texte: '2. Have the answers read' },
      { type: 'p', texte: 'To compare the AIs, you need the brands mentioned in each answer, their order and the tone. ChatGPT returns them itself; for the others, a small model reads the text. New answers are read automatically by the background task, which runs every half hour. If the overview shows a banner about answers not read yet, **Read the answers** reads them right away, at the price written next to it (about $0.0008 per answer).' },
      { type: 'h2', id: 'overview', texte: '3. The overview' },
      { type: 'p', texte: 'Read the headline sentence first: the brand appears in so many interface answers out of so many. Then the **Visibility** tile: it only shows from 5 answers, with its margin of error in the help bubble. On a first run, changes read “first measure”: there is nothing to compare.' },
      { type: 'p', texte: 'The **Presence, AI by AI** table tells where the brand is strongest and weakest, and in which form: **Site cited**, **Video cited**, **Name only** or **Read, not cited**. A page read but not cited is the quickest win: it has already been found.' },
      { type: 'capture', nom: 'vue', legende: 'After the first run, the overview shows visibility by AI and coverage prompt by prompt; the line waits for the second run.' },
      { type: 'h2', id: 'prompts', texte: '4. Verdicts, prompt by prompt' },
      { type: 'p', texte: 'On the **Prompts** screen, each prompt gets a verdict on the interface answers of the period: **Solid** (the brand is in 6 answers out of 10 or more), **Occasional**, **Absent**, or **Too early to tell** below 3 answers. With four interface AIs, a first run gives at most four answers per prompt: the verdict exists, but it is fragile. Start with the **absent** prompts without the brand name: they are the ones where customers discover your competitors.' },
      { type: 'h2', id: 'brands', texte: '5. Who is mentioned instead of you' },
      { type: 'p', texte: 'The **Mentioned instead of us** block of the overview, and the **Competitors** screen, rank the brands the AIs mention on your prompts. Track the ones that matter with **Track**: share of voice and head-to-head fill in, without any new run.' },
      { type: 'h2', id: 'sources', texte: '6. The sources' },
      { type: 'p', texte: 'The **Sources** screen tells which sites and pages the AIs cite, and who gets those citations. Run **Classify the sites** once: each site gets a type (comparison site, media, blog, forum, directory, brand site…), then kept for all projects. That classification orders the work list: a comparison site or a directory where your competitors appear without you comes first.' },
      { type: 'h2', id: 'act', texte: '7. The work list' },
      { type: 'p', texte: 'The **Actions** screen gathers what comes out of this run: your pages found but not cited, other people’s pages to appear on, topics where a video or a page is missing. Each line links to the answers that justify it.' },
      { type: 'encadre', ton: 'limite', titre: 'What a first run does not tell you', texte: 'It does not tell whether the brand is going up or down: that takes at least two run days, and changes are only coloured when they exceed the margin of error. Nor does it tell what a signed-in person sees with their own history: readings start from a neutral session. To settle a specific prompt, use the [deep measurement](doc:mesurer/mesure-approfondie).' },
      {
        type: 'liens',
        items: [
          { page: 'mesurer/vue-d-ensemble' },
          { page: 'mesurer/questions' },
          { page: 'comprendre/sources' },
          { page: 'cas/evolution-ou-bruit' },
        ],
      },
    ],
  },
}

export default page
