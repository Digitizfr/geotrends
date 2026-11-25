// Cas d'usage : répartir les questions entre celles qui contiennent le nom de la marque et les autres.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/questions-avec-ou-sans-marque',
  rubrique: 'demarrer-le-suivi',
  slug: { fr: 'questions-avec-ou-sans-marque', en: 'branded-or-unbranded-prompts' },
  titre: {
    fr: 'Avec ou sans nom de marque : comment répartir mes questions ?',
    en: 'Branded or unbranded: how should I split my prompts?',
  },
  resume: {
    fr: 'Une question qui contient le nom de la marque ne mesure pas la même chose qu’une autre. Comment les repérer, les lire à part et les répartir dans un projet.',
    en: 'A prompt that contains the brand name does not measure the same thing as one that does not. How to spot them, read them apart and balance them in a project.',
  },
  ecrans: ['/questions', '/questions/[id]', '/faits', '/vue'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: '« Facturo est-il adapté aux auto-entrepreneurs ? » : l’IA parle presque forcément de Facturo, et ce qui compte est ce qu’elle en dit. « Quel logiciel de facturation choisir pour un auto-entrepreneur ? » : c’est là qu’un client qui ne vous connaît pas encore vous découvre, ou découvre Comptalis. Les deux sortes de questions sont utiles, mais elles ne répondent pas à la même question.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Des questions des deux sortes dans le projet. L’outil les classe tout seul, sans appel payant : une question est « avec le nom de la marque » si son texte contient ce nom, « sans » dans le cas contraire.',
          'Quelques relevés sur chaque question, pour que les verdicts sortent du « trop tôt pour dire ».',
          'Pour les questions avec le nom : quelques faits vérifiés sur la marque, saisis sur l’écran **Faits vérifiés**.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Voir la répartition',
            texte: 'Ouvrez **Questions**, puis **Filtrer et grouper**. Le filtre **Nom de la marque** propose **Sans** et **Avec**, chacun avec son nombre de questions. Dans le tableau, une question qui contient le nom porte l’étiquette « avec le nom de la marque ».',
            capture: 'questions',
          },
          {
            titre: 'Lire votre place sur les questions sans le nom',
            texte: 'Choisissez **Sans**. Le tableau ne garde que ces questions : comptez les verdicts solide, occasionnelle et absente, et regardez la colonne **Premier nommé**. C’est votre place réelle face à Comptalis, Devizo ou Tikette, chez des clients qui ne cherchaient pas Facturo.',
          },
          {
            titre: 'Lire ce que les IA disent de vous sur les questions avec le nom',
            texte: 'Choisissez **Avec**, puis ouvrez une question. Le texte de chaque réponse est affiché tel que l’IA l’a écrit, la marque surlignée. Sur **Vue d’ensemble**, le bloc **Le ton employé pour Facturo** répartit les mentions entre positif, neutre et négatif.',
          },
          {
            titre: 'Vérifier les faits',
            texte: 'Les questions avec le nom sont celles où l’IA en dit le plus sur la marque : prix, offres, public visé. L’écran **Faits vérifiés** compare les réponses qui nomment la marque aux faits que vous avez écrits, et liste celles qui disent autre chose.',
            capture: 'faits',
          },
          {
            titre: 'Ajuster la liste',
            texte: 'Gardez quelques questions avec le nom, celles qu’un client pose avant d’acheter : le prix, les avis, la comparaison avec un concurrent. Mettez l’essentiel de l’effort sur les questions sans le nom, en puisant dans **Idées de questions à suivre** sur l’écran **Aperçus IA et Google**.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Sur quelles questions juger les progrès : les questions sans le nom pour savoir si de nouveaux clients vous rencontrent, les questions avec le nom pour savoir si ce que les IA disent de vous est juste. L’outil n’impose aucune proportion ; une liste faite surtout de questions sans le nom donne une visibilité plus basse, mais plus honnête.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Le filtre **Nom de la marque** n’existe que sur l’écran **Questions** : la vue d’ensemble, les concurrents et la carte des thèmes comptent les deux sortes ensemble, et une question avec le nom tire la visibilité vers le haut. Le classement ne cherche que le nom principal : une question qui n’emploie qu’une autre écriture du nom, ou seulement le nom d’un concurrent, est rangée « sans ».',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'mesurer/questions' },
          { page: 'comprendre/faits-verifies' },
          { page: 'reference/methode' },
          { page: 'cas/suivre-les-bonnes-questions' },
          { page: 'cas/information-fausse' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: '“Is Facturo right for sole traders?”: the AI almost has to talk about Facturo, and what matters is what it says. “Which invoicing software should a sole trader choose?”: this is where a customer who does not know you yet discovers you, or discovers Comptalis. Both kinds of prompt are useful, but they do not answer the same question.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'Prompts of both kinds in the project. The tool sorts them on its own, with no paid call: a prompt is “with the brand name” if its text contains that name, “without” otherwise.',
          'A few readings on each prompt, so that verdicts move past “too early to tell”.',
          'For branded prompts: a few verified facts about the brand, entered on the **Fact checks** screen.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'See the split',
            texte: 'Open **Prompts**, then **Filter and group**. The **Brand name** filter offers **Without** and **With**, each with its number of prompts. In the table, a prompt that contains the name carries the tag “with the brand name”.',
            capture: 'questions',
          },
          {
            titre: 'Read your place on unbranded prompts',
            texte: 'Choose **Without**. The table keeps only these prompts: count the solid, occasional and absent verdicts, and look at the **Named first** column. This is your real place against Comptalis, Devizo or Tikette, with customers who were not looking for Facturo.',
          },
          {
            titre: 'Read what the AIs say about you on branded prompts',
            texte: 'Choose **With**, then open a prompt. Each answer is shown as the AI wrote it, with the brand highlighted. On **Overview**, the **Tone used for Facturo** block splits the mentions into positive, neutral and negative.',
          },
          {
            titre: 'Check the facts',
            texte: 'Branded prompts are where the AI says the most about the brand: price, plans, target customers. The **Fact checks** screen compares the answers that name the brand with the facts you wrote, and lists those that say otherwise.',
            capture: 'faits',
          },
          {
            titre: 'Adjust the list',
            texte: 'Keep a few branded prompts, the ones a customer asks before buying: price, reviews, comparison with a competitor. Put most of the effort on unbranded prompts, drawing on **Prompt ideas to track** on the **AI Overviews & Google** screen.',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Which prompts to judge progress on: unbranded prompts to know whether new customers come across you, branded prompts to know whether what the AIs say about you is right. The tool sets no ratio; a list made mostly of unbranded prompts gives a lower visibility, but a more honest one.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'The **Brand name** filter only exists on the **Prompts** screen: the overview, competitors and topic map count both kinds together, and a branded prompt pulls visibility up. The sorting only looks for the main name: a prompt that uses only another spelling of the name, or only a competitor’s name, is filed as “without”.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'mesurer/questions' },
          { page: 'comprendre/faits-verifies' },
          { page: 'reference/methode' },
          { page: 'cas/suivre-les-bonnes-questions' },
          { page: 'cas/information-fausse' },
        ],
      },
    ],
  },
}

export default page
