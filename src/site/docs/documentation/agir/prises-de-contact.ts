import type { PageDoc } from '../../types'

// Fiche d'une action sur /actions (src/app/(app)/actions/page.tsx) : état, note,
// date du « fait » et journal des prises de contact (actions.ts, DEMARCHES et
// REPONSES dans src/lib/travail.ts).
const page: PageDoc = {
  id: 'agir/prises-de-contact',
  rubrique: 'agir',
  slug: { fr: 'agir/prises-de-contact', en: 'act/outreach' },
  titre: { fr: 'Suivre une action et ses prises de contact', en: 'Following up an action and its outreach' },
  resume: {
    fr: 'La fiche d’une action garde son état, une note, la date où elle a été faite et le journal des prises de contact : à qui, quand, et ce qui en est revenu.',
    en: 'An action’s sheet keeps its status, a free note, the date it was done and the outreach log: whom you wrote to, when, what you asked and what came back.',
  },
  ecrans: ['/actions'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Entrer dans un comparatif ou faire corriger un article demande souvent plusieurs messages, sur plusieurs semaines. La fiche d’une action garde la trace de ce travail : vous ne relancerez pas deux fois le même site, et vous verrez ce qui a marché. Tout y est gratuit : rien ne part vers un fournisseur payant.' },
      { type: 'p', texte: 'La fiche s’ouvre d’un clic sur le titre d’une ligne de la liste de travail, ou sur sa colonne **Suivi** (« noter », « 1 note », ou le nombre de prises de contact et la dernière réponse). Les liens **Voir l’action** des écrans Vidéos et chaînes et Faits vérifiés ouvrent directement la bonne fiche.' },
      { type: 'h2', id: 'etat', texte: 'L’état de la ligne' },
      {
        type: 'tableau',
        colonnes: ['État', 'Quand le choisir'],
        lignes: [
          ['**À faire**', 'L’état de départ de toute ligne.'],
          ['**En cours**', 'Vous avez commencé : une page en réécriture, un message envoyé. Une première prise de contact fait passer une nouvelle ligne à « En cours ».'],
          ['**Fait**', 'L’action est terminée. L’outil garde la date et une copie de la ligne : c’est ce qui permet de comparer avant et après.'],
          ['**Écartée**', 'La ligne ne vaut pas la peine. Elle sort des lignes ouvertes sans être supprimée.'],
        ],
      },
      { type: 'p', texte: 'Sous les boutons, la fiche rappelle « Faite le … » ou « Dernier changement le … ». La date du « fait » ne bouge plus si la ligne était déjà faite.' },
      { type: 'h2', id: 'note', texte: 'La note' },
      { type: 'p', texte: 'Le champ **Note** reçoit ce que vous avez fait, ce qu’il reste à faire, un lien utile : 2 000 signes au plus. Pour une ligne faite, un champ **Faite le** permet de corriger la date si l’action a été faite un autre jour (jamais une date à venir) : c’est elle qui sert à comparer avant et après. **Enregistrer** garde les deux. La note apparaît dans la colonne **Suivi** de la liste et dans l’export CSV.' },
      { type: 'h2', id: 'journal', texte: 'Le journal des prises de contact' },
      { type: 'p', texte: 'Le bloc **Prises de contact** liste chaque démarche, la plus récente d’abord : son type, sa date, la personne ou le formulaire contacté, et ce qui a été demandé. Pour en ajouter une, remplissez **Type de démarche**, **Date** (aujourd’hui par défaut), **À qui** (nom, adresse ou formulaire du site) et **Ce qui a été demandé**, puis **Ajouter au journal**.' },
      {
        type: 'tableau',
        colonnes: ['Type de démarche', 'Pour quoi'],
        lignes: [
          ['**Demande d’ajout**', 'Demander une place dans un comparatif, un annuaire, un article. Proposé par défaut.'],
          ['**Proposition de test**', 'Proposer à un auteur de tester votre offre.'],
          ['**Réponse dans un fil**', 'Répondre dans une discussion de forum ou de réseau social.'],
          ['**Demande de correction**', 'Faire corriger une information fausse. Proposé par défaut pour un fait faux.'],
          ['**Relance**', 'Relancer une démarche restée sans réponse.'],
          ['**Autre démarche**', 'Tout le reste.'],
        ],
      },
      { type: 'p', texte: 'Une démarche ajoutée est « En attente ». Quand la réponse arrive, un clic la note : **Réponse favorable**, **Refus**, **Sans réponse**, ou de nouveau **En attente**. **Retirer** efface une démarche du journal.' },
      { type: 'capture', nom: 'action-fiche', legende: 'La fiche d’une action : son état, la page visée, les questions concernées, la note et le journal des prises de contact.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Tenir le journal d’une démarche' },
      {
        type: 'etapes',
        items: [
          { titre: 'Ouvrir la fiche', texte: 'Depuis la liste de travail, un clic sur le titre de la ligne, par exemple « Entrer dans le comparatif de comparatif-logiciels.exemple ».' },
          { titre: 'Noter le message envoyé', texte: 'Choisissez **Demande d’ajout**, indiquez à qui (« rédaction, formulaire de contact ») et ce que vous avez demandé, puis **Ajouter au journal**. La ligne passe à « En cours ».' },
          { titre: 'Noter la réponse', texte: 'Le jour où l’auteur répond, cliquez **Réponse favorable** ou **Refus**. Sans nouvelles, notez **Sans réponse**, puis ajoutez une **Relance**.' },
          { titre: 'Passer la ligne à « Fait »', texte: 'Quand la page vous cite, passez la ligne à **Fait**. Corrigez la date dans **Faite le** si la page a changé un autre jour.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Le journal est un carnet : l’outil n’envoie aucun message et ne relance personne. Une ligne que les relevés ne proposent plus disparaît de la liste, sauf si elle est faite (elle reste alors dans l’onglet Résultats) ; sa note et son journal restent gardés et reviennent si la page est de nouveau citée. Une réponse favorable ne garantit pas une citation : seule la mesure suivante le dira.' },
      {
        type: 'liens',
        items: [
          { page: 'agir/liste-de-travail' },
          { page: 'agir/mesure-apres-action' },
          { page: 'cas/pages-ou-apparaitre' },
          { page: 'cas/information-fausse' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Getting into a comparison or getting an article corrected often takes several messages, over several weeks. An action’s sheet keeps a record of that work: you will not chase the same site twice, and you will see what worked. It is all free: nothing goes to a paid provider.' },
      { type: 'p', texte: 'The sheet opens with a click on a line’s title in the work list, or on its **Follow-up** column (“add a note”, “1 note”, or the number of outreach entries and the last reply). The **See the action** links on the Videos & channels and Fact checks screens open the right sheet directly.' },
      { type: 'h2', id: 'status', texte: 'The line’s status' },
      {
        type: 'tableau',
        colonnes: ['Status', 'When to choose it'],
        lignes: [
          ['**To do**', 'The starting status of every line.'],
          ['**In progress**', 'You have started: a page being rewritten, a message sent. A first outreach moves a new line to “In progress”.'],
          ['**Done**', 'The action is finished. The tool keeps the date and a copy of the line: that is what makes the before-and-after comparison possible.'],
          ['**Dismissed**', 'The line is not worth it. It leaves the open lines without being deleted.'],
        ],
      },
      { type: 'p', texte: 'Under the buttons, the sheet shows “Done on …” or “Last change on …”. The date a line was done no longer moves if the line was already done.' },
      { type: 'h2', id: 'note', texte: 'The note' },
      { type: 'p', texte: 'The **Note** field takes what you did, what remains to do, a useful link: 2,000 characters at most. For a line marked done, a **Done on** field lets you correct the date if the action was done on another day (never a future date): it is the date used to compare before and after. **Save** keeps both. The note appears in the list’s **Follow-up** column and in the CSV export.' },
      { type: 'h2', id: 'log', texte: 'The outreach log' },
      { type: 'p', texte: 'The **Outreach** block lists each step, most recent first: its type, its date, the person or form contacted, and what was asked. To add one, fill in **Type of outreach**, **Date** (today by default), **Owner** (the name, address or contact form of the site) and **What was asked**, then **Add to the log**.' },
      {
        type: 'tableau',
        colonnes: ['Type of outreach', 'What for'],
        lignes: [
          ['**Inclusion request**', 'Ask for a spot in a comparison, a directory, an article. Selected by default.'],
          ['**Test offer**', 'Offer an author a test of your product.'],
          ['**Reply in a thread**', 'Reply in a forum or social network discussion.'],
          ['**Correction request**', 'Get wrong information corrected. Selected by default for a wrong fact.'],
          ['**Follow-up**', 'Chase a step that got no reply.'],
          ['**Other outreach**', 'Everything else.'],
        ],
      },
      { type: 'p', texte: 'A new entry is “Pending”. When the reply arrives, one click records it: **Positive reply**, **Declined**, **No answer**, or **Pending** again. **Remove** deletes an entry from the log.' },
      { type: 'capture', nom: 'action-fiche', legende: 'An action’s sheet: its status, the target page, the prompts concerned, the note and the outreach log.' },
      { type: 'h2', id: 'step-by-step', texte: 'Keeping the log of an outreach' },
      {
        type: 'etapes',
        items: [
          { titre: 'Open the sheet', texte: 'From the work list, click the line’s title, for example “Get into the comparison on comparatif-logiciels.exemple”.' },
          { titre: 'Log the message sent', texte: 'Choose **Inclusion request**, say whom you contacted (“editorial team, contact form”) and what you asked, then **Add to the log**. The line moves to “In progress”.' },
          { titre: 'Log the reply', texte: 'The day the author answers, click **Positive reply** or **Declined**. With no news, record **No answer**, then add a **Follow-up**.' },
          { titre: 'Mark the line “Done”', texte: 'Once the page cites you, mark the line **Done**. Correct the date in **Done on** if the page changed on another day.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'The log is a notebook: the tool sends no message and chases no one. A line the runs no longer suggest disappears from the list, unless it is done (it then stays in the Results tab); its note and log are kept and come back if the page is cited again. A positive reply does not guarantee a citation: only the next measurement will tell.' },
      {
        type: 'liens',
        items: [
          { page: 'agir/liste-de-travail' },
          { page: 'agir/mesure-apres-action' },
          { page: 'cas/pages-ou-apparaitre' },
          { page: 'cas/information-fausse' },
        ],
      },
    ],
  },
}

export default page
