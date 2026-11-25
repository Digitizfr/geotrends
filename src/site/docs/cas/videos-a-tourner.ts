// Cas d'usage : choisir les vidéos YouTube à tourner d'après celles que citent les IA.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/videos-a-tourner',
  rubrique: 'contenus-et-reputation',
  slug: { fr: 'videos-a-tourner', en: 'videos-to-make' },
  titre: {
    fr: 'Quelles vidéos YouTube tourner ?',
    en: 'Which YouTube videos should I make?',
  },
  resume: {
    fr: 'Les questions où les IA citent une vidéo YouTube qui n’est pas la vôtre, les chaînes qui prennent la place, et comment en tirer une liste de vidéos à tourner.',
    en: 'The prompts where AIs cite a YouTube video that is not yours, the channels that take the spot, and how to turn that into a list of videos to make.',
  },
  ecrans: ['/projets/[id]', '/videos', '/actions'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Facturo a deux chaînes, « Facturo » et « Facturo Academy », et une liste d’idées de vidéos plus longue que le temps de tournage. Certaines IA, Google en tête, citent des vidéos YouTube dans leurs réponses. Celles qu’elles citent sur vos questions disent quels sujets filmer en premier.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Les chaînes YouTube de la marque déclarées dans le projet. Une vidéo citée compte pour la chaîne qui l’a publiée : sans déclaration, une vidéo de Facturo Academy compterait pour « youtube.com ».',
          'Des relevés dont les réponses citent des vidéos. Le titre, la chaîne, la date et les vues de chaque vidéo citée sont lus gratuitement.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Déclarer les chaînes',
            texte: 'Ouvrez la fiche du projet, onglet **Marque et propriétés**, rubrique **Chaînes YouTube** : une chaîne par ligne, son adresse ou son nom précédé de @. Le bouton **Détecter depuis le site** propose aussi les chaînes liées depuis la page d’accueil.',
            capture: 'projet',
          },
          {
            titre: 'Voir si vos chaînes sont citées',
            texte: 'Ouvrez **Vidéos et chaînes**. Le bloc **Vos chaînes** donne une carte par chaîne déclarée, même jamais citée : le nombre de réponses qui citent une de ses vidéos, et la vidéo la plus citée.',
            capture: 'videos',
          },
          {
            titre: 'Repérer les questions où une autre vidéo est citée',
            texte: 'Le bloc **Question par question** liste les questions pour lesquelles une IA cite au moins une vidéo YouTube, avec la miniature, la chaîne, les vues et, quand l’adresse le précise, le passage cité. La colonne **Pour qui** dit si la vidéo est la vôtre. En haut, les questions où la vidéo citée appartient à une autre chaîne.',
          },
          {
            titre: 'Connaître les chaînes concurrentes',
            texte: 'Le bloc **Les autres chaînes citées** réunit les chaînes d’autres créateurs ou marques dont une vidéo est citée. Celles qui reviennent souvent sont vos concurrentes sur YouTube pour ces questions, même si ce ne sont pas des éditeurs de logiciels.',
          },
          {
            titre: 'Passer par la liste de travail',
            texte: 'Sur **Actions**, le groupe **Écrire ou filmer** contient une ligne « Tourner une vidéo sur … » pour chaque question où les IA citent des vidéos et aucune des vôtres. La ligne rappelle les vidéos citées, leur chaîne et leurs vues. Le lien **Voir l’action**, sur l’écran des vidéos, y mène aussi.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Quels sujets filmer en premier : les questions où les IA citent déjà des vidéos, aucune de Facturo. Et sous quel angle : celui des vidéos citées, leur durée, le passage qui sert de réponse. Une question où aucune IA ne cite de vidéo ne se gagne probablement pas par YouTube.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Toutes les IA ne citent pas des vidéos : sur certaines périodes, seul Google le fait, et l’écran le dit. Les vidéos citées se comptent souvent sur les doigts d’une main : l’écran compte en réponses relevées, sans pourcentage. Une vidéo publiée ne sera pas forcément citée ; la mesure suivante le dira, sans prouver que la vidéo en est la cause.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'comprendre/videos' },
          { page: 'projet/sites-chaines-reseaux' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/citee-nommee-ou-absente' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Facturo has two channels, “Facturo” and “Facturo Academy”, and a list of video ideas longer than the time available to shoot them. Some AIs, Google first, cite YouTube videos in their answers. The ones they cite on your prompts tell you which subjects to film first.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'The brand’s YouTube channels declared in the project. A cited video counts for the channel that published it: without the declaration, a Facturo Academy video would count for “youtube.com”.',
          'Runs whose answers cite videos. The title, channel, date and views of each cited video are read for free.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Declare the channels',
            texte: 'Open the project page, tab **Brand and properties**, section **YouTube channels**: one channel per line, its address or its name preceded by @. The **Detect from the site** button also suggests the channels linked from the home page.',
            capture: 'projet',
          },
          {
            titre: 'See whether your channels are cited',
            texte: 'Open **Videos & channels**. The **Your channels** block gives one card per declared channel, even one never cited: the number of answers that cite one of its videos, and its most cited video.',
            capture: 'videos',
          },
          {
            titre: 'Spot the prompts where another video is cited',
            texte: 'The **Prompt by prompt** block lists the prompts for which an AI cites at least one YouTube video, with the thumbnail, the channel, the views and, when the address gives it, the passage cited. The **For whom** column says whether the video is yours. At the top, the prompts where the cited video belongs to another channel.',
          },
          {
            titre: 'Know the competing channels',
            texte: 'The **Other channels cited** block gathers the channels of other creators or brands with a cited video. Those that keep coming back are your YouTube competitors on these prompts, even when they are not software companies.',
          },
          {
            titre: 'Go through the work list',
            texte: 'On **Actions**, the **Write or film** group holds a “Shoot a video on …” row for each prompt where AIs cite videos and none of yours. The row lists the cited videos, their channel and their views. The **See the action** link on the videos screen leads there too.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Which subjects to film first: the prompts where AIs already cite videos, none of them Facturo’s. And from which angle: that of the cited videos, their length, the passage that serves as the answer. A prompt where no AI cites a video is probably not won through YouTube.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'Not every AI cites videos: over some periods only Google does, and the screen says so. Cited videos are often few enough to count on one hand: the screen counts captured answers, with no percentage. A published video will not necessarily be cited; the next measurement will tell, without proving the video is the cause.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'comprendre/videos' },
          { page: 'projet/sites-chaines-reseaux' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/citee-nommee-ou-absente' },
          { page: 'cas/effet-d-une-correction' },
        ],
      },
    ],
  },
}

export default page
