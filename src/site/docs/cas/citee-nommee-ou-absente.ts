// Cas d'usage : distinguer une marque citée, nommée, lue ou absente.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/citee-nommee-ou-absente',
  rubrique: 'comprendre-sa-visibilite',
  slug: { fr: 'citee-nommee-ou-absente', en: 'cited-mentioned-or-absent' },
  titre: {
    fr: 'Ma marque est-elle citée, nommée ou absente ?',
    en: 'Is my brand cited, mentioned or absent?',
  },
  resume: {
    fr: 'Site cité, vidéo citée, nom seul, page lue sans être citée : quatre façons d’être dans une réponse d’IA, qui ne se lisent pas et ne se corrigent pas pareil.',
    en: 'Site cited, video cited, name only, page read but not cited: four ways of being in an AI answer, which are not read the same way and not fixed the same way.',
  },
  ecrans: ['/projets/[id]', '/questions', '/vue', '/sources', '/questions/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Être dans une réponse d’IA peut vouloir dire plusieurs choses. L’IA cite une page de facturo.exemple ou une vidéo de la chaîne Facturo comme source. Elle écrit « Facturo » dans son texte sans s’appuyer sur vos pages. Ou elle ouvre une de vos pages et ne la retient pas. Chaque cas appelle un travail différent : il faut d’abord savoir lequel est le vôtre.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Tout ce qui appartient à la marque, déclaré dans le projet : ses sites, ses chaînes YouTube, ses réseaux sociaux, les autres écritures de son nom.',
          'Des réponses reçues. Une question sans réponse, ou sans Aperçu IA chez Google, n’entre pas dans le compte.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Déclarer ce qui appartient à la marque',
            texte: 'Ouvrez la fiche du projet, onglet **Marque et propriétés** : **Sites de la marque**, **Chaînes YouTube** (Facturo, Facturo Academy), **Réseaux sociaux**, **Autres écritures du nom**. Le bouton **Détecter depuis le site** lit la page d’accueil et propose les profils trouvés ; rien n’est ajouté sans votre relecture. Une page publiée sous un profil déclaré, sur LinkedIn par exemple, compte comme une page de la marque.',
            capture: 'projet',
          },
          {
            titre: 'Lire l’état de chaque réponse',
            texte: 'Sur **Questions**, chaque case porte un état, expliqué sous le tableau. **Citée** : une page ou une vidéo de la marque figure parmi les sources. **Nommée** : le nom est dans le texte, sans page de la marque citée. **Lue** : une page de la marque a été ouverte par l’IA, sans être citée. **Absente** : l’IA a répondu sans la marque. **Pas d’aperçu** : Google n’a rien affiché, ce n’est pas une absence.',
            capture: 'questions',
          },
          {
            titre: 'Voir d’où vient la visibilité',
            texte: 'Sur **Vue d’ensemble**, la **Visibilité** compte les réponses où Facturo est nommée ou citée. La tuile **Sources à nous** compte les citations de vos pages et de vos vidéos. Plus bas, le bloc **D’où vient la visibilité** répartit les réponses avec la marque en trois : **Par le site**, **Par la chaîne YouTube**, **Par le seul nom**.',
            capture: 'vue',
          },
          {
            titre: 'Retrouver vos pages une à une',
            texte: 'Ouvrez **Sources**, onglet **Nos pages**. Chaque page ou vidéo de la marque y figure avec le nombre de réponses où elle est **Citée**, le nombre de fois où elle a été **Lue sans être citée**, sa place **Chez Google** et les **Pages citées à sa place**.',
          },
          {
            titre: 'Vérifier sur une question',
            texte: 'Sur la page d’une question, le bloc **Sur cette question** liste **Nos pages** : celles qui ont été citées, et celles qui ont été lues sans être citées. Les réponses s’ouvrent juste en dessous, IA par IA, avec la marque surlignée dans le texte.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      {
        type: 'tableau',
        colonnes: ['Ce que vous voyez', 'Ce que ça veut dire', 'Où travailler'],
        lignes: [
          ['Citée', 'Une de vos pages sert de preuve à l’IA.', 'Garder la page à jour, et la surveiller.'],
          ['Nommée seulement', 'L’IA connaît la marque, mais s’appuie sur d’autres pages.', 'Les pages qu’elle cite : y entrer, ou écrire mieux qu’elles.'],
          ['Lue sans être citée', 'Votre page est trouvée, puis écartée.', 'La reformuler : une réponse nette, en tête de page.'],
          ['Absente', 'Ni votre nom, ni vos pages.', 'Les pages citées à votre place, en commençant par les comparatifs.'],
        ],
      },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Seuls ChatGPT et Claude disent quelles pages ils ont lues sans les citer : chez Gemini et Google, l’état « lue » n’existe pas. Le nom est cherché comme un mot entier, avec ses autres écritures : un homonyme compterait aussi, relisez quelques réponses avant de conclure. Une propriété oubliée dans le projet fait passer une citation de Facturo pour une absence.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'projet/sites-chaines-reseaux' },
          { page: 'demarrer/notions-cles' },
          { page: 'comprendre/sources' },
          { page: 'cas/page-lue-pas-citee' },
          { page: 'cas/pages-ou-apparaitre' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Being in an AI answer can mean several things. The AI cites a page of facturo.exemple or a video from the Facturo channel as a source. It writes “Facturo” in its text without relying on your pages. Or it opens one of your pages and does not keep it. Each case calls for different work: first you need to know which one is yours.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'Everything the brand owns, declared in the project: its sites, its YouTube channels, its social profiles, the other spellings of its name.',
          'Answers received. A prompt with no answer, or with no AI Overview on Google, is not counted.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Declare what the brand owns',
            texte: 'Open the project page, tab **Brand and properties**: **Brand sites**, **YouTube channels** (Facturo, Facturo Academy), **Social networks**, **Other spellings of the name**. The **Detect from the site** button reads the home page and suggests the profiles it finds; nothing is added until you review it. A page published under a declared profile, on LinkedIn for example, counts as a brand page.',
            capture: 'projet',
          },
          {
            titre: 'Read the state of each answer',
            texte: 'On **Prompts**, each cell carries a state, explained under the table. **Cited**: a page or video of the brand is among the sources. **Mentioned**: the name is in the text, with no brand page cited. **Read**: a brand page was opened by the AI but not cited. **Absent**: the AI answered without the brand. **No overview**: Google displayed nothing, which is not an absence.',
            capture: 'questions',
          },
          {
            titre: 'See where visibility comes from',
            texte: 'On **Overview**, **Visibility** counts the answers where Facturo is mentioned or cited. The **Owned sources** tile counts citations of your pages and videos. Further down, the **Where visibility comes from** block splits the answers with the brand three ways: **Through the site**, **Through the YouTube channel**, **By name only**.',
            capture: 'vue',
          },
          {
            titre: 'Find your pages one by one',
            texte: 'Open **Sources**, tab **Our pages**. Each page or video of the brand is listed with the number of answers where it is **Cited**, the number of times it was **Read, not cited**, its place **On Google** and the **Pages cited instead**.',
          },
          {
            titre: 'Check on a single prompt',
            texte: 'On a prompt page, the **On this prompt** block lists **Our pages**: those that were cited, and those that were read but not cited. The answers open just below, AI by AI, with the brand highlighted in the text.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      {
        type: 'tableau',
        colonnes: ['What you see', 'What it means', 'Where to work'],
        lignes: [
          ['Cited', 'One of your pages serves as evidence for the AI.', 'Keep the page up to date, and watch it.'],
          ['Mentioned only', 'The AI knows the brand, but relies on other pages.', 'The pages it cites: get into them, or write better than them.'],
          ['Read, not cited', 'Your page is found, then set aside.', 'Rewrite it: a clear answer, at the top of the page.'],
          ['Absent', 'Neither your name nor your pages.', 'The pages cited instead of you, starting with comparison sites.'],
        ],
      },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'Only ChatGPT and Claude say which pages they read without citing: on Gemini and Google, the “read” state does not exist. The name is searched as a whole word, with its other spellings: a namesake would count too, so read a few answers before concluding. A property missing from the project turns a Facturo citation into an absence.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'projet/sites-chaines-reseaux' },
          { page: 'demarrer/notions-cles' },
          { page: 'comprendre/sources' },
          { page: 'cas/page-lue-pas-citee' },
          { page: 'cas/pages-ou-apparaitre' },
        ],
      },
    ],
  },
}

export default page
