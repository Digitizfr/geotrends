// Cas d'usage : lire l'avant et l'après d'une action, sans conclure à une cause.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/effet-d-une-correction',
  rubrique: 'mesurer-l-effet',
  slug: { fr: 'effet-d-une-correction', en: 'did-my-fix-work' },
  titre: {
    fr: 'Ma correction a-t-elle compté ?',
    en: 'Did my fix make a difference?',
  },
  resume: {
    fr: 'Marquer une action faite, lire la présence de la marque avant et après sur les questions concernées, et savoir ce qu’on peut en dire, et ce qu’on ne peut pas.',
    en: 'Mark an action as done, read the brand’s presence before and after on the prompts concerned, and know what can be said about it, and what cannot.',
  },
  ecrans: ['/actions', '/vue', '/reponses', '/questions/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Il y a cinq semaines, après plusieurs échanges, comparatif-logiciels.exemple a ajouté Facturo à son comparatif. Depuis, la marque semble revenir plus souvent sur les questions où cette page est citée. L’équipe demande si l’effort a payé. La réponse honnête tient en deux temps : ce que les chiffres montrent, puis ce qu’ils ne prouvent pas.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'Une action de la liste de travail passée à « fait », avec la bonne date.',
          'Des relevés d’interface dans les quatre semaines qui précèdent cette date, et après elle : au moins 5 réponses de chaque côté.',
          'Du temps : le résultat reste provisoire tant que quatre semaines ne sont pas passées.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Marquer l’action faite, à la bonne date',
            texte: 'Sur **Actions**, passez la ligne à **Fait**. Dans sa fiche, le champ **Faite le** prend la date du jour ; corrigez-la si le changement a eu lieu un autre jour, par exemple le jour où le comparatif a été mis à jour. Notez ce qui a été fait dans **Note**.',
          },
          {
            titre: 'Lire l’avant et l’après',
            texte: 'La fiche de l’action affiche **Avant et après, sur** les questions concernées, en relevés d’interface : **Les quatre semaines d’avant** et **Depuis le …**, chacun en « k sur n » réponses où Facturo apparaît, puis l’écart et une phrase qui dit s’il dépasse la marge d’erreur. Avant quatre semaines, la fiche précise que le résultat est provisoire.',
          },
          {
            titre: 'Comparer toutes les actions faites',
            texte: 'L’onglet **Résultats** réunit les actions faites : **Faite le**, **Avant**, **Après**, **Écart** et **Ce qu’on peut en dire**. Une action sortie de la liste, parce que la page n’est plus citée sans vous, y garde sa fiche, sa note et son résultat.',
            capture: 'actions-resultats',
          },
          {
            titre: 'Chercher la trace dans les réponses',
            texte: 'Ouvrez les questions concernées et lisez les réponses d’après la date. La page où vous êtes entré est-elle citée dans les réponses qui nomment maintenant Facturo ? Sur l’écran **Réponses**, le filtre **Présence** sépare les réponses avec et sans la marque. C’est cette trace, plus que le chiffre, qui relie l’action à l’écart.',
          },
          {
            titre: 'Replacer l’action dans la courbe',
            texte: 'Sur **Vue d’ensemble**, un repère « Action faite » marque la courbe ce jour-là. Regardez les autres repères autour : un changement de modèle à la même période brouille la lecture. Si les relevés sont trop peu nombreux, une **Mesure approfondie** sur une question concernée ajoute des réponses du côté « après ».',
            capture: 'vue',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Continuer dans la même voie, par exemple viser d’autres comparatifs, attendre la mesure à quatre semaines, ou changer d’approche. Le résultat d’une action sert à orienter les suivantes, pas à attribuer un mérite.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'Un écart qui suit une action est une piste à vérifier, pas la preuve que l’action l’a causé. Pendant les mêmes semaines, un modèle a pu changer, un concurrent reculer, une autre page évoluer. L’outil compare les questions de l’action à elles-mêmes, sans groupe témoin. Même au-dessus de la marge, il écrit : « l’action n’en est pas forcément la seule cause ».',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'agir/mesure-apres-action' },
          { page: 'agir/liste-de-travail' },
          { page: 'reference/methode' },
          { page: 'cas/evolution-ou-bruit' },
          { page: 'cas/pages-ou-apparaitre' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Five weeks ago, after several exchanges, comparatif-logiciels.exemple added Facturo to its comparison page. Since then, the brand seems to come up more often on the prompts where that page is cited. The team asks whether the effort paid off. The honest answer comes in two parts: what the numbers show, then what they do not prove.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'An action from the work list marked “done”, with the right date.',
          'Interface readings in the four weeks before that date, and after it: at least 5 answers on each side.',
          'Time: the result stays provisional until four weeks have passed.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Mark the action done, on the right date',
            texte: 'On **Actions**, set the row to **Done**. In its sheet, the **Done on** field takes today’s date; correct it if the change happened on another day, for example the day the comparison page was updated. Write down what was done in **Note**.',
          },
          {
            titre: 'Read the before and after',
            texte: 'The action sheet shows **Before and after, on** the prompts concerned, in interface readings: **The four weeks before** and **Since …**, each as “k of n” answers where Facturo appears, then the change and a sentence saying whether it is beyond the margin of error. Before four weeks, the sheet says the result is provisional.',
          },
          {
            titre: 'Compare all the actions done',
            texte: 'The **Results** tab gathers the actions done: **Done on**, **Before**, **After**, **Change** and **What can be said**. An action that left the list, because the page is no longer cited without you, keeps its sheet, note and result there.',
            capture: 'actions-resultats',
          },
          {
            titre: 'Look for the trace in the answers',
            texte: 'Open the prompts concerned and read the answers after the date. Is the page you got into cited in the answers that now name Facturo? On the **Answers** screen, the **Presence** filter separates answers with and without the brand. This trace, more than the number, is what links the action to the change.',
          },
          {
            titre: 'Place the action on the chart',
            texte: 'On **Overview**, an “Action done” marker sits on the chart that day. Look at the other markers around it: a model change in the same period blurs the reading. If readings are too few, a **Deep measurement** on a prompt concerned adds answers on the “after” side.',
            capture: 'vue',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Keep going the same way, for example by targeting other comparison pages, wait for the four-week measurement, or change approach. The result of an action is there to steer the next ones, not to hand out credit.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'A change after an action is evidence for investigation, not proof that the action caused it. During the same weeks, a model may have changed, a competitor may have fallen back, another page may have moved. The tool compares the action’s prompts with themselves, with no control group. Even beyond the margin, it says: “the action is not necessarily its only cause”.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'agir/mesure-apres-action' },
          { page: 'agir/liste-de-travail' },
          { page: 'reference/methode' },
          { page: 'cas/evolution-ou-bruit' },
          { page: 'cas/pages-ou-apparaitre' },
        ],
      },
    ],
  },
}

export default page
