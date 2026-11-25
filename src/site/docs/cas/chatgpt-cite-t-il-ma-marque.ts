// Cas d'usage : la présence de la marque chez ChatGPT, question par question.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/chatgpt-cite-t-il-ma-marque',
  rubrique: 'comprendre-sa-visibilite',
  slug: { fr: 'chatgpt-cite-t-il-ma-marque', en: 'does-chatgpt-cite-my-brand' },
  titre: {
    fr: 'ChatGPT cite-t-il ma marque, et sur quelles questions ?',
    en: 'Does ChatGPT cite my brand, and on which prompts?',
  },
  resume: {
    fr: 'Le chiffre de ChatGPT, puis la liste des questions où il cite, nomme ou ignore la marque, jusqu’au texte de chaque réponse avec ses sources et ses recherches.',
    en: 'ChatGPT’s number, then the list of prompts where it cites, mentions or ignores the brand, down to the text of each answer with its sources and searches.',
  },
  ecrans: ['/vue', '/questions', '/questions/[id]', '/reponses'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Un client vous dit qu’il a trouvé Facturo « en demandant à ChatGPT ». Un autre que ChatGPT lui a conseillé Comptalis. Avant d’en tirer quoi que ce soit, il faut savoir ce que ChatGPT répond vraiment sur vos questions : sur lesquelles il cite Facturo, sur lesquelles il la nomme sans la citer, et sur lesquelles il l’ignore.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Des relevés de ChatGPT sur les questions du projet. Un pourcentage s’affiche à partir de 5 réponses, un verdict sur une question à partir de 3.',
          'Le site, les chaînes YouTube et les réseaux sociaux de la marque déclarés dans le projet : sans eux, une page de Facturo citée ne compte pas pour Facturo.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Lire le chiffre de ChatGPT',
            texte: 'Sur **Vue d’ensemble**, le tableau **Présence, IA par IA** donne la ligne de ChatGPT : sa **Visibilité** sur la période, avec le nombre de réponses, puis comment Facturo y apparaît : **Site cité**, **Vidéo citée**, **Nom seul** et **Lu, non cité**. Un clic sur « ChatGPT » ouvre toutes ses réponses.',
          },
          {
            titre: 'Voir les questions une à une',
            texte: 'Ouvrez **Questions**. La colonne ChatGPT donne le dernier état de chaque question : citée, nommée, lue ou absente. Quand la question a plusieurs relevés, un compte du type « 3 sur 5 » et une coche par relevé s’affichent dessous. Un clic sur l’en-tête trie la colonne ; un clic sur un état ouvre la réponse.',
            capture: 'questions',
          },
          {
            titre: 'Ouvrir une réponse',
            texte: 'La page de la question montre en tête son verdict et la présence de Facturo, IA par IA. Plus bas, choisissez ChatGPT : le texte est celui que ChatGPT a affiché, jamais traduit : Facturo est surlignée, un concurrent suivi est souligné, chaque source porte son numéro. Dessous : **Sources citées**, **Pages lues sans être citées** et **Recherches lancées par l’IA**. Le lien **Reposer la question dans l’interface** permet de vérifier par vous-même.',
            capture: 'question',
          },
          {
            titre: 'Réunir toutes ses réponses',
            texte: 'L’écran **Réponses**, ouvert depuis le nom de ChatGPT, se filtre par **Présence** (avec ou sans Facturo) et par **IA**. Choisissez « Sans Facturo » : c’est la liste des réponses de ChatGPT où vous manquez, chacune avec sa question et ses marques nommées.',
            capture: 'reponses',
          },
          {
            titre: 'Lire tout l’outil du point de vue de ChatGPT',
            texte: 'Dans la barre du haut, masquez les autres IA avec le filtre **IA**. Les écrans **Concurrents**, **Sources** et la carte des thèmes ne comptent plus que ChatGPT : qui il nomme à votre place, quelles pages il cite.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      {
        type: 'liste',
        items: [
          'Les questions où ChatGPT ignore Facturo : ce sont elles qu’il faut travailler en premier, en partant des pages qu’il cite.',
          'Les questions où il lit une page de Facturo sans la citer : la page est trouvée, elle est à reformuler.',
          'Les questions où il nomme Facturo sans la citer : il connaît la marque, mais ne s’appuie pas sur vos pages.',
        ],
      },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Avec un relevé par semaine, une question compte peu de réponses : le verdict « absente » sur trois réponses est un signal, pas une certitude. ChatGPT est relevé sans forcer sa recherche web, depuis une session neutre : un client connecté peut lire autre chose. Quand OpenAI change de modèle, un repère l’indique sur la courbe de la vue d’ensemble ; un écart ce jour-là peut venir de là.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'mesurer/fiche-question' },
          { page: 'mesurer/reponses' },
          { page: 'reference/ia-suivies' },
          { page: 'cas/citee-nommee-ou-absente' },
          { page: 'cas/page-lue-pas-citee' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'A customer tells you they found Facturo “by asking ChatGPT”. Another says ChatGPT recommended Comptalis. Before drawing any conclusion, you need to know what ChatGPT really answers on your prompts: where it cites Facturo, where it mentions it without citing it, and where it ignores it.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'ChatGPT readings on the project’s prompts. A percentage shows from 5 answers, a verdict on a prompt from 3.',
          'The brand’s site, YouTube channels and social profiles declared in the project: without them, a Facturo page that gets cited does not count for Facturo.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Read ChatGPT’s number',
            texte: 'On **Overview**, the **Presence, AI by AI** table gives ChatGPT’s row: its **Visibility** over the period, with the number of answers, then how Facturo appears: **Site cited**, **Video cited**, **Name only** and **Read, not cited**. Clicking “ChatGPT” opens all its answers.',
          },
          {
            titre: 'See the prompts one by one',
            texte: 'Open **Prompts**. The ChatGPT column gives the latest state of each prompt: cited, mentioned, read or absent. When a prompt has several readings, a count such as “3 of 5” and one tick per reading show underneath. Click the header to sort the column; click a state to open the answer.',
            capture: 'questions',
          },
          {
            titre: 'Open an answer',
            texte: 'The prompt page opens with its verdict and Facturo’s presence, AI by AI. Further down, choose ChatGPT: the text is what ChatGPT displayed, never translated: Facturo is highlighted, a tracked competitor is underlined, each source carries its number. Below: **Cited sources**, **Pages read but not cited** and **Searches run by the AI**. The **Ask the prompt again in the interface** link lets you check for yourself.',
            capture: 'question',
          },
          {
            titre: 'Gather all its answers',
            texte: 'The **Answers** screen, opened from ChatGPT’s name, filters by **Presence** (with or without Facturo) and by **AI**. Choose “Without Facturo”: this is the list of ChatGPT answers where you are missing, each with its prompt and the brands it mentions.',
            capture: 'reponses',
          },
          {
            titre: 'Read the whole tool from ChatGPT’s point of view',
            texte: 'In the top bar, hide the other AIs with the **AI** filter. The **Competitors** and **Sources** screens and the topic map then count ChatGPT only: who it names instead of you, which pages it cites.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      {
        type: 'liste',
        items: [
          'The prompts where ChatGPT ignores Facturo: work on these first, starting from the pages it cites.',
          'The prompts where it reads a Facturo page without citing it: the page is found, it needs rewriting.',
          'The prompts where it mentions Facturo without citing it: it knows the brand, but does not rely on your pages.',
        ],
      },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'With one run a week, a prompt has few answers: an “absent” verdict on three answers is a signal, not a certainty. ChatGPT is captured without forcing its web search, from a neutral session: a signed-in customer may read something else. When OpenAI changes model, a marker shows it on the overview chart; a change that day may come from there.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'mesurer/fiche-question' },
          { page: 'mesurer/reponses' },
          { page: 'reference/ia-suivies' },
          { page: 'cas/citee-nommee-ou-absente' },
          { page: 'cas/page-lue-pas-citee' },
        ],
      },
    ],
  },
}

export default page
