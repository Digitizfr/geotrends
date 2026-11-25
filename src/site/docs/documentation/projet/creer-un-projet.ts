import type { PageDoc } from '../../types'

// Écrans /projets (liste des projets), /projets/nouveau (création en étapes,
// src/app/(app)/projets/nouveau/Creation.tsx) et l'onglet « Réglages du projet »
// de /projets/[id] (nom, pays et langue, archivage).
const page: PageDoc = {
  id: 'projet/creer-un-projet',
  rubrique: 'projet',
  slug: { fr: 'projet/creer-un-projet', en: 'project/create-a-project' },
  titre: { fr: 'Créer un projet', en: 'Create a project' },
  resume: {
    fr: 'Un projet suit une marque : ce qui lui appartient, ses concurrents, ses questions, son pays et sa langue. Le créer est gratuit : la dépense vient avec le relevé.',
    en: 'A project tracks one brand: its name, what it owns, its competitors, its prompts, the country and the language. Creating it is free; spending starts with a run.',
  },
  ecrans: ['/projets', '/projets/nouveau'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Tout, dans l’outil, se lit projet par projet. Un projet suit une marque sur un marché : un pays et une langue. Pour suivre la même marque dans un autre pays, ou une autre marque, on crée un autre projet. Créer un projet est gratuit : la dépense ne commence qu’au premier relevé, et son prix s’affiche avant l’envoi.' },
      { type: 'p', texte: 'Pour créer un projet : le bouton **Nouveau projet** en haut de l’écran Projets, ou le lien **Nouveau projet** au bas de la liste des projets, dans le menu. Le premier projet se crée depuis l’écran vide, avec le même bouton.' },
      { type: 'capture', nom: 'projet-nouveau', legende: 'La création d’un projet : cinq étapes courtes et un récapitulatif. Ici, l’étape de la marque pour Facturo.' },
      { type: 'h2', id: 'etapes-creation', texte: 'Les étapes de la création' },
      { type: 'p', texte: 'Le formulaire tient en six onglets. Rien n’est enregistré avant le dernier bouton : on peut revenir en arrière, sauter une étape ou cliquer directement sur un onglet dès que le nom de la marque est saisi. La touche Entrée passe à l’étape suivante, elle ne crée pas le projet.' },
      {
        type: 'tableau',
        colonnes: ['Étape', 'Ce qu’on y saisit'],
        lignes: [
          ['**La marque**', 'Le **Nom de la marque**, le seul champ obligatoire. C’est ce nom qui est cherché dans le texte des réponses. Ses autres écritures (sigle, nom sans espace) s’ajoutent ensuite, dans la fiche du projet.'],
          ['**Ses propriétés**', 'Les **Sites**, les **Chaînes YouTube** et les **Réseaux sociaux** de la marque, un par ligne. Une page de ces sites, une vidéo de ces chaînes ou une publication de ces profils, citée par une IA, compte pour la marque. Le bouton **Détecter depuis le site** lit la page d’accueil et propose les profils trouvés.'],
          ['**Le marché**', 'Le **Pays** d’où les questions sont posées et leur **Langue**. Par défaut : France, français.'],
          ['**Les concurrents**', 'Un nom de marque par ligne. Facultatif : après le premier relevé, l’outil propose les marques que les IA nomment le plus.'],
          ['**Les questions**', 'Une question par ligne, comme un client la poserait à une IA. Dix suffisent pour commencer. Sous le champ, le prix d’un relevé d’interface pour ces questions se met à jour à chaque ligne.'],
          ['**Récapitulatif**', 'Ce que l’outil a compris : la marque, le marché, les **Sites reconnus**, les **Chaînes reconnues** et les **Réseaux reconnus**, les concurrents, les questions et le **Prix d’un premier relevé**. Puis le bouton **Créer le projet**.'],
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Le pays et la langue se choisissent une fois', texte: 'Ils ne se changent plus après le premier relevé : les courbes doivent rester comparables d’une semaine à l’autre. Pour suivre Facturo en Belgique, créez un second projet. Tant qu’aucun relevé n’est parti, ils se corrigent dans l’onglet **Réglages du projet**. Voir [Pays et langues](doc:reference/pays-et-langues).' },
      { type: 'p', texte: 'Le récapitulatif vérifie les saisies sans rien enregistrer : une adresse complète est ramenée à son domaine, une chaîne saisie par son nom (« @Facturo ») est retrouvée sur YouTube avec son vrai nom, un lien de partage ou de publication n’est pas pris pour un profil. Ce qui n’est pas reconnu est signalé avant la création.' },
      { type: 'capture', nom: 'projet-nouveau-recap', legende: 'Le récapitulatif avant de créer le projet : ce que l’outil a reconnu (sites, chaînes, réseaux) et le prix d’un premier relevé.' },
      { type: 'h2', id: 'liste-projets', texte: 'L’écran Projets' },
      { type: 'p', texte: 'Une carte par projet, avec son marché, son nombre de questions, de sites, de chaînes, de réseaux et de concurrents. Le projet affiché dans tout l’outil porte la mention « affiché dans l’outil » ; les autres ont un bouton **Afficher ce projet**. Le même choix se fait dans le menu, en haut à gauche, avec une recherche quand il y a plus de quatre projets.' },
      {
        type: 'tableau',
        colonnes: ['Case de la carte', 'Ce qu’elle montre'],
        lignes: [
          ['**Dernier relevé**', 'La date du dernier envoi, et le nombre de réponses encore en attente.'],
          ['**Visibilité**', 'La part des réponses d’interface où la marque est nommée ou citée, sur la période réglée dans la barre du haut. En pourcentage à partir de 5 réponses, sinon le compte seul (« 2 sur 4 »).'],
          ['**Dépense du mois**', 'Les appels payants du projet depuis le début du mois, et leur nombre.'],
          ['**Prochain relevé conseillé**', 'Sept jours après le dernier relevé d’interface, ou « dès maintenant ». Dessous : « Relevé hebdomadaire automatique » ou « Relevés lancés à la main ».'],
        ],
      },
      { type: 'p', texte: 'Au pied de chaque carte, trois liens ouvrent la fiche du projet sur l’onglet voulu : **Lancer un relevé**, **Questions**, **Marque et propriétés**.' },
      { type: 'h2', id: 'reglages-projet', texte: 'Renommer ou archiver un projet' },
      { type: 'p', texte: 'L’onglet **Réglages du projet** de la fiche réunit trois blocs. **Nom du projet** change le **Nom affiché dans l’outil** ; le nom cherché dans les réponses reste celui de la marque, et le journal des coûts suit le changement. **Pays et langue** ne se modifie que tant qu’aucun relevé n’est parti ; ensuite le bloc passe en lecture seule. **Archiver le projet** le retire de l’outil et arrête ses relevés automatiques ; rien n’est effacé, son historique reste en base.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Créer le projet Facturo, pas à pas' },
      {
        type: 'etapes',
        items: [
          { titre: 'Nommer la marque', texte: 'Écrivez « Facturo », tel que les IA l’écrivent. Un nom trop court ou trop courant fera des faux positifs : préférez la forme exacte de la marque.' },
          { titre: 'Déclarer ce qui lui appartient', texte: 'Saisissez facturo.exemple, puis cliquez sur **Détecter depuis le site** : les chaînes YouTube et les profils trouvés sur la page d’accueil s’ajoutent aux champs. Relisez-les et retirez les comptes personnels.' },
          { titre: 'Choisir le marché', texte: 'France et français pour Facturo. C’est le pays d’où les questions seront posées.' },
          { titre: 'Nommer deux ou trois concurrents', texte: 'Comptalis, Devizo. Les autres viendront des relevés : l’outil propose les marques que les IA nomment.' },
          { titre: 'Écrire une dizaine de questions', texte: 'Celles de vos clients, avec et sans le nom de la marque. Voir [Écrire les questions à suivre](doc:projet/questions).' },
          { titre: 'Relire le récapitulatif et créer', texte: 'Vérifiez ce qui a été reconnu, puis **Créer le projet**. Le projet devient celui affiché dans l’outil et sa fiche s’ouvre sur l’onglet Relevés, prête pour un premier relevé. Il porte le nom de la marque : renommez-le dans **Réglages du projet** si un autre marché doit suivre.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Le nouveau projet prend le nom de la marque, et deux projets ne peuvent pas porter le même nom. Pour suivre Facturo sur un second marché, renommez d’abord le premier projet (« Facturo France ») dans **Réglages du projet**, puis créez le second. La marque est reconnue dans le texte par son nom et ses autres écritures, mot entier, sans tenir compte des majuscules : un nom qui est aussi un mot courant sera repéré à tort dans certaines réponses. Une propriété oubliée se rattrape ensuite, y compris pour l’historique.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/sites-chaines-reseaux' },
          { page: 'projet/questions' },
          { page: 'projet/lancer-un-releve' },
          { page: 'cas/suivre-les-bonnes-questions' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'Everything in the tool is read project by project. A project tracks one brand on one market: a country and a language. To track the same brand in another country, or another brand, you create another project. Creating a project is free: spending only starts with the first run, and its price is shown before sending.' },
      { type: 'p', texte: 'To create one: the **New project** button at the top of the Projects screen, or the **New project** link at the bottom of the project list in the menu. The first project is created from the empty screen, with the same button.' },
      { type: 'capture', nom: 'projet-nouveau', legende: 'Creating a project: five short steps and a summary. Here, the brand step for Facturo UK.' },
      { type: 'h2', id: 'creation-steps', texte: 'The creation steps' },
      { type: 'p', texte: 'The form has six tabs. Nothing is saved before the last button: you can go back, skip a step or click a tab directly once the brand name is filled in. The Enter key moves to the next step; it does not create the project.' },
      {
        type: 'tableau',
        colonnes: ['Step', 'What you enter'],
        lignes: [
          ['**The brand**', 'The **Brand name**, the only required field. This name is what the tool looks for in the text of the answers. Other spellings (acronym, name without spaces) are added later, on the project page.'],
          ['**Its properties**', 'The brand’s **Sites**, **YouTube channels** and **Social networks**, one per line. A page of these sites, a video of these channels or a post of these profiles, cited by an AI, counts for the brand. The **Detect from the site** button reads the home page and suggests the profiles it finds.'],
          ['**The market**', 'The **Country** the prompts are asked from and their **Language**. Default: France, French.'],
          ['**Competitors**', 'One brand name per line. Optional: after the first run, the tool suggests the brands the AIs mention most.'],
          ['**Prompts**', 'One prompt per line, the way a customer would ask an AI. Ten are enough to start. Under the field, the price of an interface run for these prompts updates with every line.'],
          ['**Summary**', 'What the tool understood: the brand, the market, the **Sites recognised**, **Channels recognised** and **Recognised networks**, the competitors, the prompts and the **Price of a first run**. Then the **Create the project** button.'],
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Country and language are chosen once', texte: 'They can no longer be changed after the first run: the charts must stay comparable from one week to the next. To track Facturo UK in Ireland, create a second project. As long as no run has been sent, they can be corrected in the **Project settings** tab. See [Countries and languages](doc:reference/pays-et-langues).' },
      { type: 'p', texte: 'The summary checks your entries without saving anything: a full address is reduced to its domain, a channel typed by its handle (“@FacturoUK”) is looked up on YouTube with its real name, a share link or a post is not taken for a profile. Anything not recognised is flagged before creation.' },
      { type: 'capture', nom: 'projet-nouveau-recap', legende: 'The summary before creating the project: what the tool recognised (sites, channels, profiles) and the price of a first run.' },
      { type: 'h2', id: 'projects-screen', texte: 'The Projects screen' },
      { type: 'p', texte: 'One card per project, with its market and its number of prompts, sites, channels, networks and competitors. The project shown across the tool carries the label “shown in the tool”; the others have a **Show this project** button. The same choice can be made in the menu, top left, with a search box once there are more than four projects.' },
      {
        type: 'tableau',
        colonnes: ['Card field', 'What it shows'],
        lignes: [
          ['**Last run**', 'The date of the last run, and the number of answers still pending.'],
          ['**Visibility**', 'The share of interface answers where the brand is mentioned or cited, over the period set in the top bar. As a percentage from 5 answers, otherwise the count only (“2 out of 4”).'],
          ['**Spend this month**', 'The project’s paid calls since the start of the month, and how many.'],
          ['**Next recommended run**', 'Seven days after the last interface run, or “right now”. Below: “Automatic weekly run” or “Runs started by hand”.'],
        ],
      },
      { type: 'p', texte: 'At the foot of each card, three links open the project page on the right tab: **Start a run**, **Prompts**, **Brand and properties**.' },
      { type: 'h2', id: 'project-settings', texte: 'Renaming or archiving a project' },
      { type: 'p', texte: 'The **Project settings** tab of the project page has three blocks. **Project name** changes the **Name shown in the tool**; the name looked for in the answers stays the brand’s, and the cost journal follows the change. **Country and language** can only be edited as long as no run has been sent; after that the block is read-only. **Archive the project** removes it from the tool and stops its automatic runs; nothing is deleted, its history stays in the database.' },
      { type: 'h2', id: 'step-by-step', texte: 'Creating the Facturo UK project, step by step' },
      {
        type: 'etapes',
        items: [
          { titre: 'Name the brand', texte: 'Type “Facturo”, the way the AIs write it. A name that is too short or too common will cause false matches: use the exact form of the brand.' },
          { titre: 'Declare what it owns', texte: 'Enter facturo.exemple, then click **Detect from the site**: the YouTube channels and profiles found on the home page are added to the fields. Review them and remove personal accounts.' },
          { titre: 'Choose the market', texte: 'United Kingdom and English for Facturo UK. This is the country the prompts will be asked from.' },
          { titre: 'Name two or three competitors', texte: 'Comptalis, Devizo. The others will come from the runs: the tool suggests the brands the AIs mention.' },
          { titre: 'Write about ten prompts', texte: 'Your customers’ prompts, with and without the brand name. See [Write the prompts to track](doc:projet/questions).' },
          { titre: 'Check the summary and create', texte: 'Check what was recognised, then **Create the project**. The project becomes the one shown in the tool and its page opens on the Runs tab, ready for a first run. It is named after the brand: rename it “Facturo UK” in **Project settings** to tell it from other markets.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'A new project takes the brand’s name, and two projects cannot have the same name. To track Facturo on a second market, first rename the existing project (“Facturo France”) in **Project settings**, then create the new one. The brand is recognised in the text by its name and its other spellings, as a whole word, regardless of case: a name that is also a common word will be matched by mistake in some answers. A forgotten property can be added later, history included.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/sites-chaines-reseaux' },
          { page: 'projet/questions' },
          { page: 'projet/lancer-un-releve' },
          { page: 'cas/suivre-les-bonnes-questions' },
        ],
      },
    ],
  },
}

export default page
