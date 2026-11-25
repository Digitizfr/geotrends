import type { PageDoc } from '../../types'

// Écran /videos (src/app/(app)/videos/page.tsx), vidéos et chaînes dans
// src/lib/classements.ts (classerVideos) et src/lib/youtube.ts.
const page: PageDoc = {
  id: 'comprendre/videos',
  rubrique: 'comprendre',
  slug: { fr: 'comprendre/videos', en: 'understand/videos' },
  titre: { fr: 'Vidéos et chaînes', en: 'Videos and channels' },
  resume: {
    fr: 'Vos chaînes YouTube sont-elles citées par les IA, sur quelles questions une vidéo d’une autre chaîne prend la place, et quelles autres chaînes reviennent ?',
    en: 'Whether the AIs cite your YouTube channels, on which prompts a video from another channel takes the spot, and which other channels come back most often.',
  },
  ecrans: ['/videos'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Les IA citent aussi des vidéos YouTube. Une vidéo citée compte pour la chaîne qui l’a publiée, pas pour youtube.com : si la chaîne est celle de la marque, la citation compte pour la marque. L’écran Vidéos et chaînes répond à trois questions : vos chaînes sont-elles citées ? Sur quelles questions une autre vidéo prend-elle la place ? Quelles chaînes sont citées à votre place ?' },
      { type: 'p', texte: 'Le lien **Gérer les chaînes** ouvre l’onglet Marque et propriétés de la fiche du projet, où les chaînes se déclarent. Depuis la liste de travail, une ligne « Tourner une vidéo » renvoie aux mêmes questions.' },
      { type: 'capture', nom: 'videos', legende: 'L’écran Vidéos et chaînes du projet Facturo : la carte de chaque chaîne déclarée (Facturo, Facturo Academy), puis les questions où une vidéo est citée.' },
      { type: 'h2', id: 'unite', texte: 'Une seule unité : la réponse relevée' },
      { type: 'p', texte: 'Tout l’écran compte en réponses : combien de réponses relevées citent une vidéo, et laquelle. Seuls les relevés d’interface comptent : une vidéo citée par Claude, interrogé par son API, n’est pas ce que voit un internaute. La phrase du haut donne le compte : sur tant de réponses relevées, tant citent une vidéo YouTube, et une vidéo de la marque apparaît dans tant de réponses. Quand seul Google cite des vidéos (Mode IA ou Aperçus IA), la phrase le précise.' },
      { type: 'p', texte: 'Chaque vidéo citée est rattachée à sa chaîne, avec son titre, son nombre de vues et sa date de publication, par l’API publique de YouTube (gratuite). Les miniatures viennent de l’adresse publique de YouTube, sans appel en plus.' },
      { type: 'h2', id: 'vos-chaines', texte: 'Vos chaînes' },
      { type: 'p', texte: 'Une carte par chaîne déclarée, même si elle n’est jamais citée. La carte dit « citée dans tant de réponses » ou « jamais citée ». Pour chaque vidéo citée : sa miniature, son titre, les IA qui la citent, le nombre de citations, ses vues, sa date de publication, et le **Passage cité** quand l’adresse retenue par l’IA pointe un moment précis de la vidéo.' },
      { type: 'p', texte: 'Sans chaîne déclarée, l’écran affiche « Aucune chaîne YouTube n’est déclarée pour la marque. » et le bouton **Déclarer une chaîne**. Les vidéos citées restent listées dessous.' },
      { type: 'h2', id: 'question-par-question', texte: 'Question par question' },
      { type: 'p', texte: 'Les questions pour lesquelles une IA cite au moins une vidéo. En haut, celles où la vidéo citée n’est pas la vôtre : une vidéo sur le même sujet a des chances d’y entrer.' },
      {
        type: 'tableau',
        colonnes: ['Colonne', 'Ce qu’elle montre'],
        lignes: [
          ['**Question**', 'Le texte de la question, et « vidéo citée dans tant de réponses sur tant ».'],
          ['**Vidéo citée par l’IA**', 'Trois vidéos au plus, avec leur miniature, leur chaîne et les IA qui les citent. Un clic sur une IA ouvre la réponse.'],
          ['**Pour qui**', '« vous » si une de vos vidéos est citée, sinon « une autre chaîne ». **Voir l’action** ouvre la ligne correspondante de la liste de travail.'],
        ],
      },
      { type: 'h2', id: 'autres-chaines', texte: 'Les autres chaînes citées' },
      { type: 'p', texte: 'Les chaînes d’autres créateurs ou marques dont une vidéo est citée, avec leurs **Réponses**, **Vidéos**, **Questions**, les IA qui les citent (**Citée par**) et leur **Vidéo la plus citée**. Celles qui reviennent souvent sont vos concurrents sur YouTube pour ces questions.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Choisir la prochaine vidéo' },
      {
        type: 'etapes',
        items: [
          { titre: 'Déclarer vos chaînes', texte: 'Dans la fiche du projet, onglet **Marque et propriétés**, ajoutez chaque chaîne (Facturo, Facturo Academy) par son adresse ou son nom précédé de @. Sans cela, une de vos vidéos compterait pour quelqu’un d’autre.' },
          { titre: 'Lire vos cartes', texte: 'Une chaîne « jamais citée » n’est pas forcément absente des réponses : la marque peut y être par son site ou son nom.' },
          { titre: 'Repérer les questions prises par une autre chaîne', texte: 'Dans **Question par question**, les lignes « une autre chaîne » sont en haut. Regardez le sujet, la durée et le passage cité de la vidéo retenue.' },
          { titre: 'Passer à l’action', texte: '**Voir l’action** ouvre la ligne « Tourner une vidéo sur … » de la liste de travail. Marquez-la « En cours », puis « Fait » quand la vidéo est en ligne : l’outil comparera avant et après.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Les nombres sont souvent petits : peu de réponses citent une vidéo, et souvent seulement chez Google. Les vues sont celles du jour où la vidéo a été rattachée, pas celles d’aujourd’hui. Une vidéo ne compte pour la marque que si sa chaîne est déclarée. Publier une vidéo sur un sujet ne garantit pas qu’une IA la cite : l’écran dit où la place est prise, pas comment l’obtenir à coup sûr.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/sites-chaines-reseaux' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/videos-a-tourner' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'AIs also cite YouTube videos. A cited video counts for the channel that published it, not for youtube.com: if the channel is the brand’s, the citation counts for the brand. The Videos & channels screen answers three questions: are your channels cited? On which prompts does another video take the spot? Which channels are cited instead of you?' },
      { type: 'p', texte: 'The **Manage channels** link opens the Brand and properties tab of the project page, where channels are declared. From the work list, a “Shoot a video” line leads back to the same prompts.' },
      { type: 'capture', nom: 'videos', legende: 'The Videos & channels screen of the Facturo UK project: the card of each declared channel (Facturo, Facturo Academy), then the prompts where a video is cited.' },
      { type: 'h2', id: 'unit', texte: 'A single unit: the recorded answer' },
      { type: 'p', texte: 'The whole screen counts in answers: how many recorded answers cite a video, and which one. Only interface readings count: a video cited by Claude, queried through its API, is not what a person sees. The headline sentence gives the count: out of so many recorded answers, so many cite a YouTube video, and a video of the brand appears in so many answers. When only Google cites videos (AI Mode or AI Overviews), the sentence says so.' },
      { type: 'p', texte: 'Each cited video is linked to its channel, with its title, view count and publication date, through YouTube’s public API (free). Thumbnails come from YouTube’s public address, with no extra call.' },
      { type: 'h2', id: 'your-channels', texte: 'Your channels' },
      { type: 'p', texte: 'One card per declared channel, even if it is never cited. The card says “cited in so many answers” or “never cited”. For each cited video: its thumbnail, its title, the AIs that cite it, the number of citations, its views, its publication date, and the **Moment cited** when the address kept by the AI points to a precise moment of the video.' },
      { type: 'p', texte: 'With no channel declared, the screen shows “No YouTube channel is declared for the brand.” and the **Declare a channel** button. The cited videos are still listed below.' },
      { type: 'h2', id: 'prompt-by-prompt', texte: 'Prompt by prompt' },
      { type: 'p', texte: 'The prompts for which an AI cites at least one video. At the top, those where the cited video is not yours: a video on the same topic has a chance to get in.' },
      {
        type: 'tableau',
        colonnes: ['Column', 'What it shows'],
        lignes: [
          ['**Prompt**', 'The prompt’s text, and “video cited in so many answers out of so many”.'],
          ['**Video cited by the AI**', 'Up to three videos, with their thumbnail, their channel and the AIs that cite them. Clicking an AI opens the answer.'],
          ['**For whom**', '“you” if one of your videos is cited, otherwise “another channel”. **See the action** opens the matching line of the work list.'],
        ],
      },
      { type: 'h2', id: 'other-channels', texte: 'Other channels cited' },
      { type: 'p', texte: 'The channels of other creators or brands with a cited video, with their **Answers**, **Videos**, **Prompts**, the AIs that cite them (**Cited by**) and their **Most cited video**. Those that come back often are your YouTube competitors on these prompts.' },
      { type: 'h2', id: 'step-by-step', texte: 'Choosing the next video' },
      {
        type: 'etapes',
        items: [
          { titre: 'Declare your channels', texte: 'On the project page, **Brand and properties** tab, add each channel (Facturo, Facturo Academy) by its address or its name preceded by @. Otherwise one of your videos would count for someone else.' },
          { titre: 'Read your cards', texte: 'A channel “never cited” does not mean the brand is absent from the answers: it may be there through its site or its name.' },
          { titre: 'Spot the prompts taken by another channel', texte: 'In **Prompt by prompt**, the “another channel” rows are at the top. Look at the topic, the length and the moment cited of the video that was kept.' },
          { titre: 'Move to action', texte: '**See the action** opens the “Shoot a video on …” line of the work list. Mark it “In progress”, then “Done” once the video is online: the tool will compare before and after.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'Numbers are often small: few answers cite a video, and often only on Google. Views are those of the day the video was linked, not today’s. A video only counts for the brand if its channel is declared. Publishing a video on a topic does not guarantee an AI will cite it: the screen shows where the spot is taken, not how to win it for certain.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/sites-chaines-reseaux' },
          { page: 'agir/liste-de-travail' },
          { page: 'cas/videos-a-tourner' },
        ],
      },
    ],
  },
}

export default page
