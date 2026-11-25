import type { PageDoc } from '../../types'

// Du premier projet au premier relevé : le parcours complet, en renvoyant aux
// pages qui détaillent chaque écran.
const page: PageDoc = {
  id: 'demarrer/prise-en-main',
  rubrique: 'demarrer',
  slug: { fr: 'demarrer/prise-en-main', en: 'get-started/quick-start' },
  titre: { fr: 'Prise en main', en: 'Quick start' },
  resume: {
    fr: 'Du premier projet aux premiers résultats en six étapes : créer la marque, déclarer ce qui lui appartient, écrire ses questions, lancer un relevé, puis lire.',
    en: 'From the first project to the first results in six steps: create the brand, declare what it owns, write its prompts, start a run, then read the answers.',
  },
  maj: '2026-11-25',
  contenu: {
    fr: [
      { type: 'p', texte: 'Cette page suit le chemin le plus court, de la connexion aux premiers résultats. Comptez une demi-heure, dont quelques minutes d’attente pendant que les réponses reviennent. Rien n’est payant avant l’étape 5, et le prix s’affiche toujours avant l’envoi.' },
      { type: 'h2', id: 'avant-de-commencer', texte: 'Avant de commencer' },
      {
        type: 'liste',
        items: [
          'L’outil installé et un compte. Le premier compte se crée au premier lancement ; les suivants, par invitation de l’administrateur. Voir [Installer GeoTrends](doc:demarrer/installer) et [Comptes et connexion](doc:piloter/comptes).',
          'Le nom de la marque tel que les IA l’écrivent, son site, sa chaîne YouTube et ses profils sociaux s’il y en a.',
          'Une dizaine de questions qu’un client poserait à une IA, avec ses mots. Gardez-en une bonne part sans le nom de la marque : ce sont elles qui amènent de nouveaux clients.',
        ],
      },
      { type: 'h2', id: 'six-etapes', texte: 'Les six étapes' },
      {
        type: 'etapes',
        items: [
          { titre: 'Se connecter', texte: 'Ouvrez la page de connexion (bouton **Se connecter** en haut du site), puis saisissez votre adresse e-mail et votre mot de passe. L’outil s’ouvre sur la vue d’ensemble du dernier projet affiché.', capture: 'connexion' },
          { titre: 'Créer le projet', texte: 'Menu **Régler › Projets**, puis **Nouveau projet**. La création tient en cinq étapes courtes et un récapitulatif : la marque, ses propriétés, le marché (pays et langue), les concurrents, les questions. Seul le nom de la marque est obligatoire, et créer un projet ne coûte rien. Détail : [Créer un projet](doc:projet/creer-un-projet).', capture: 'projet-nouveau' },
          { titre: 'Déclarer ce qui appartient à la marque', texte: 'Sites, chaînes YouTube, réseaux sociaux, autres écritures du nom. Une page de ces sites ou une vidéo de ces chaînes, citée par une IA, compte alors pour la marque. Le bouton **Détecter depuis le site** lit la page d’accueil et propose les profils trouvés, gratuitement ; relisez avant d’ajouter. Détail : [Sites, chaînes YouTube et réseaux sociaux](doc:projet/sites-chaines-reseaux).' },
          { titre: 'Écrire les questions', texte: 'Une question par ligne, comme un client la poserait. Dix suffisent pour commencer. Une question déjà relevée ne se modifie plus : on l’archive, son historique reste. Conseils d’écriture : [Écrire les questions à suivre](doc:projet/questions).' },
          { titre: 'Lancer le premier relevé', texte: 'Sur la fiche du projet, onglet **Relevés**, le tableau donne le prix par question de chaque IA et le total. ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google sont cochés ; Claude, plus cher, ne l’est pas. Cliquez sur **Lancer le relevé** : son prix est écrit sur le bouton. Les réponses reviennent en quelques minutes, 45 au plus, et la page se met à jour toute seule. Détail : [Lancer un relevé](doc:projet/lancer-un-releve).', capture: 'projet-releves' },
          { titre: 'Lire les premiers résultats', texte: 'Ouvrez **Suivre › Vue d’ensemble**. Si un bandeau dit que des réponses n’ont pas encore été lues, **Lire les réponses** relève les marques nommées, leur rang et le ton (appel payant, son prix est affiché). Puis suivez l’ordre de lecture de [Lire ses premiers résultats](doc:demarrer/premiers-resultats).', capture: 'vue' },
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'Ce que coûte ce premier relevé', texte: 'Une réponse relevée dans l’interface coûte 0,0012 $. Dix questions posées à quatre IA font 40 relevés, soit environ 0,05 $, plus environ 0,0008 $ par réponse pour la lecture automatique. Chaque appel est inscrit au journal des coûts. Voir [Ce que coûte un relevé](doc:demarrer/couts).' },
      { type: 'h2', id: 'ensuite', texte: 'Ensuite' },
      {
        type: 'liste',
        items: [
          '**Suivre des concurrents.** Après le premier relevé, l’écran Concurrents propose les marques que les IA nomment le plus sur vos questions. **Suivre** en fait un concurrent : gratuit, cela ne lance aucun relevé. Voir [Choisir ses concurrents](doc:projet/concurrents).',
          '**Activer les relevés automatiques.** Sur l’onglet Relevés du projet : chaque semaine pour les IA relevées par l’interface, toutes les deux semaines pour Claude. Ils s’arrêtent d’eux-mêmes si le plafond du mois est atteint. Voir [Relevés automatiques](doc:projet/releves-automatiques).',
          '**Classer les sites et étiqueter les questions.** Deux clics, à quelques centimes au plus pour un projet, le prix écrit sur chaque bouton : le type de chaque site cité (sur Sources) et le thème de chaque question (sur Questions). La suite se fait toute seule.',
          '**Ouvrir la liste de travail.** L’écran Actions réunit ce qu’il faut faire, tiré des relevés. Voir [La liste de travail](doc:agir/liste-de-travail).',
        ],
      },
      { type: 'encadre', ton: 'limite', texte: 'Un premier relevé est un échantillon : une réponse par question et par IA. Il dit où la marque apparaît aujourd’hui, pas une tendance. Les courbes et les écarts prennent leur sens à partir du deuxième ou du troisième relevé.' },
      {
        type: 'liens',
        items: [
          { page: 'demarrer/notions-cles' },
          { page: 'demarrer/premiers-resultats' },
          { page: 'projet/creer-un-projet' },
          { page: 'cas/suivre-les-bonnes-questions' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'This page follows the shortest path, from signing in to the first results. Allow half an hour, including a few minutes of waiting while the answers come back. Nothing is paid before step 5, and the price is always shown before anything is sent.' },
      { type: 'h2', id: 'before-you-start', texte: 'Before you start' },
      {
        type: 'liste',
        items: [
          'The tool installed, and an account. The first account is created on first launch; the next ones by invitation from the administrator. See [Install GeoTrends](doc:demarrer/installer) and [Accounts and sign-in](doc:piloter/comptes).',
          'The brand’s name as AI engines write it, its site, its YouTube channel and its social profiles, if any.',
          'About ten prompts a customer would ask an AI, in their own words. Keep a good share of them without the brand’s name: those are the ones that bring new customers.',
        ],
      },
      { type: 'h2', id: 'six-steps', texte: 'The six steps' },
      {
        type: 'etapes',
        items: [
          { titre: 'Sign in', texte: 'Open the sign-in page (**Sign in** button at the top of the site), then enter your e-mail address and password. The tool opens on the overview of the last project shown.', capture: 'connexion' },
          { titre: 'Create the project', texte: 'Menu **Set up › Projects**, then **New project**. Creation takes five short steps and a summary: the brand, its properties, the market (country and language), competitors, prompts. Only the brand’s name is required, and creating a project costs nothing. Details: [Create a project](doc:projet/creer-un-projet).', capture: 'projet-nouveau' },
          { titre: 'Declare what belongs to the brand', texte: 'Sites, YouTube channels, social profiles, other spellings of the name. A page of these sites or a video of these channels, cited by an AI, then counts for the brand. The **Detect from the site** button reads the home page and suggests the profiles it finds, for free; review them before adding. Details: [Sites, YouTube channels and social profiles](doc:projet/sites-chaines-reseaux).' },
          { titre: 'Write the prompts', texte: 'One prompt per line, the way a customer would ask it. Ten are enough to start. A prompt that has been recorded can no longer be edited: you archive it, and its history stays. Writing tips: [Write the prompts to track](doc:projet/questions).' },
          { titre: 'Start the first run', texte: 'On the project page, **Runs** tab, the table gives each AI’s price per prompt and the total. ChatGPT, Gemini, Google AI Mode and AI Overviews are ticked; Claude, more expensive, is not. Click **Start the run**: its price is written on the button. Answers come back within minutes, 45 at most, and the page updates by itself. Details: [Start a run](doc:projet/lancer-un-releve).', capture: 'projet-releves' },
          { titre: 'Read the first results', texte: 'Open **Track › Overview**. If a banner says some answers have not been read yet, **Read the answers** extracts the brands mentioned, their position and the tone (a paid call, its price is shown). Then follow the reading order in [Reading your first results](doc:demarrer/premiers-resultats).', capture: 'vue' },
        ],
      },
      { type: 'encadre', ton: 'savoir', titre: 'What this first run costs', texte: 'An answer recorded from the interface costs $0.0012. Ten prompts asked to four AIs make 40 readings, about $0.05, plus about $0.0008 per answer for automatic reading. Every call is logged in the cost journal. See [What a run costs](doc:demarrer/couts).' },
      { type: 'h2', id: 'next', texte: 'Next' },
      {
        type: 'liste',
        items: [
          '**Track competitors.** After the first run, the Competitors screen suggests the brands the AIs mention most on your prompts. **Track** makes one a competitor: free, and it starts no run. See [Choose your competitors](doc:projet/concurrents).',
          '**Turn on automatic runs.** In the project’s Runs tab: every week for the AIs recorded from the interface, every two weeks for Claude. They stop by themselves when the monthly cap is reached. See [Automatic runs](doc:projet/releves-automatiques).',
          '**Classify the sites and tag the prompts.** Two clicks, a few cents at most for a project, with the price written on each button: the type of every cited site (on Sources) and the topic of every prompt (on Prompts). The rest happens on its own.',
          '**Open the work list.** The Actions screen gathers what to do, drawn from the runs. See [The work list](doc:agir/liste-de-travail).',
        ],
      },
      { type: 'encadre', ton: 'limite', texte: 'A first run is a sample: one answer per prompt and per AI. It tells you where the brand appears today, not a trend. Lines and changes start to mean something from the second or third run.' },
      {
        type: 'liens',
        items: [
          { page: 'demarrer/notions-cles' },
          { page: 'demarrer/premiers-resultats' },
          { page: 'projet/creer-un-projet' },
          { page: 'cas/suivre-les-bonnes-questions' },
        ],
      },
    ],
  },
}

export default page
