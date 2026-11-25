import type { PageDoc } from '../../types'

// Installation chez soi : docker-compose.yml, installer.sh, .env.example, premier
// compte (src/lib/premier-compte.ts, src/app/connexion), clés (src/lib/cles.ts,
// bloc « Clés des fournisseurs » de Réglages). Les ancres « cles » (fr) et
// « keys » (en) sont visées par la page d'accueil du site et par l'écran Réglages.
const page: PageDoc = {
  id: 'demarrer/installer',
  rubrique: 'demarrer',
  slug: { fr: 'demarrer/installer', en: 'get-started/install' },
  titre: { fr: 'Installer GeoTrends', en: 'Install GeoTrends' },
  resume: {
    fr: 'Installer GeoTrends chez vous avec Docker : télécharger le code, brancher vos clés d’API (DataForSEO, DeepSeek ou Anthropic), créer le compte administrateur.',
    en: 'Install GeoTrends on your own machine with Docker: download the code, plug in your API keys (DataForSEO, DeepSeek or Anthropic), create the admin account.',
  },
  maj: '2026-11-25',
  contenu: {
    fr: [
      { type: 'p', texte: 'GeoTrends est un logiciel libre et gratuit : vous l’installez sur votre ordinateur ou sur un serveur, avec vos propres clés d’API. Rien ne passe par nous : vos questions, les réponses relevées et vos chiffres restent dans votre base de données. Comptez un quart d’heure. Le code est sur [GitHub](https://github.com/Digitizfr/geotrends).' },
      { type: 'h2', id: 'ce-qu-il-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          '**Docker**, gratuit : Docker Desktop sur Mac ou Windows, Docker Engine sur Linux. C’est lui qui fait tourner l’outil, sa base de données et sa tâche de fond.',
          '**Un compte DataForSEO**, pour relever ChatGPT, Gemini et Google. C’est la seule clé indispensable.',
          '**Une clé DeepSeek ou Anthropic**, conseillée : elle sert à faire lire les réponses par un petit modèle.',
          '**Un ordinateur ou un petit serveur.** Les relevés automatiques partent tant que l’outil tourne : sur un ordinateur éteint la nuit, ils partiront au réveil. Un serveur à quelques euros par mois suffit (2 Go de mémoire).',
        ],
      },
      { type: 'h2', id: 'installer', texte: 'Installer, en trois étapes' },
      {
        type: 'etapes',
        items: [
          { titre: 'Télécharger le code', texte: 'Dans un terminal : `git clone https://github.com/Digitizfr/geotrends.git`, puis `cd geotrends`. Sans git, le bouton **Code › Download ZIP** de la [page GitHub](https://github.com/Digitizfr/geotrends) donne le même dossier.' },
          { titre: 'Lancer le script d’installation', texte: 'Tapez `./installer.sh`. Il demande, dans l’ordre : le nom de domaine (laissez vide sur votre ordinateur), l’identifiant et le mot de passe d’API DataForSEO, puis les clés facultatives. La touche Entrée passe une question. Il écrit le fichier `.env`, génère deux secrets propres à votre installation, construit l’outil et le démarre. La première construction prend quelques minutes.' },
          { titre: 'Créer le compte administrateur', texte: 'Ouvrez l’adresse affichée à la fin (`http://localhost:3010` sur votre ordinateur). Au premier lancement, l’écran demande votre nom, votre adresse e-mail et un mot de passe : c’est le compte administrateur. L’outil enchaîne sur la création de votre premier projet.', capture: 'premier-compte' },
        ],
      },
      { type: 'encadre', ton: 'conseil', titre: 'Sans le script', texte: 'Copiez `.env.example` vers `.env`, remplissez-le (chaque ligne est expliquée), puis lancez `docker compose up -d --build`. Le résultat est le même.' },
      { type: 'h2', id: 'cles', texte: 'Les clés d’API' },
      { type: 'p', texte: 'Une clé d’API est un mot de passe qui permet à l’outil d’appeler un fournisseur en votre nom. Vous ouvrez un compte chez lui, vous y créez la clé, vous la collez dans le fichier `.env`. Elle ne quitte votre machine que pour appeler ce fournisseur, et l’outil ne l’affiche jamais.' },
      {
        type: 'tableau',
        colonnes: ['Fournisseur', 'Ce qu’il permet', 'Prix', 'Dans le fichier .env'],
        lignes: [
          ['**DataForSEO** (indispensable)', 'Les relevés de ChatGPT, de Gemini, du Mode IA et des Aperçus IA de Google, dans leur vraie interface. Identifiant et mot de passe d’API sur [app.dataforseo.com](https://app.dataforseo.com/api-access).', '0,0012 $ par réponse. Recharge minimale de 50 $.', '`DATAFORSEO_LOGIN` et `DATAFORSEO_PASSWORD`'],
          ['**DeepSeek** (conseillé)', 'Le petit modèle : il lit chaque réponse (marques nommées, rang, ton), étiquette les questions, classe les sites, propose les questions d’une page. Clé sur [platform.deepseek.com](https://platform.deepseek.com/api_keys).', 'Environ 0,0008 $ par réponse lue.', '`DEEPSEEK_API_KEY`'],
          ['**Anthropic** (facultatif)', 'Les relevés de Claude, par son API. Sert aussi de petit modèle si vous n’avez pas de clé DeepSeek. Clé sur [console.anthropic.com](https://console.anthropic.com/settings/keys).', 'Environ 0,06 $ par question posée à Claude.', '`ANTHROPIC_API_KEY`'],
          ['**YouTube** (facultatif)', 'Le nom de la chaîne de chaque vidéo citée, pour compter les vidéos de vos chaînes. Clé « YouTube Data API v3 » dans la [console Google Cloud](https://console.cloud.google.com/apis/credentials).', 'Gratuit.', '`YOUTUBE_API_KEY`'],
          ['**Resend** (facultatif)', 'L’envoi du rapport du lundi par e-mail. Il faut aussi une adresse d’expédition sur un domaine vérifié chez Resend. Clé sur [resend.com](https://resend.com/api-keys).', 'Gratuit jusqu’à 3 000 e-mails par mois.', '`RESEND_API_KEY` et `RAPPORT_EXPEDITEUR`'],
        ],
      },
      { type: 'p', texte: 'Sans clé DeepSeek ni Anthropic, les relevés fonctionnent et la présence de votre marque est mesurée. Ce qui manque : les marques concurrentes nommées, leur rang et le ton (sauf pour ChatGPT), les étiquettes des questions et le classement des sites.' },
      { type: 'h2', id: 'changer-une-cle', texte: 'Ajouter ou changer une clé' },
      {
        type: 'etapes',
        items: [
          { titre: 'Ouvrir le fichier .env', texte: 'Il est dans le dossier de l’installation. Collez la clé entre les guillemets, sur la ligne qui porte son nom.' },
          { titre: 'Relancer l’outil', texte: 'Tapez `docker compose up -d` : l’outil redémarre avec la nouvelle valeur. Vos données ne bougent pas.' },
          { titre: 'Vérifier dans Réglages', texte: 'Le bloc **Clés des fournisseurs** dit « Clé en place » ou « Clé absente » pour chacune. Après un premier appel payant, il donne aussi la date du dernier appel réussi : c’est elle qui prouve que la clé fonctionne. Voir [Réglages](doc:piloter/reglages).' },
        ],
      },
      { type: 'h2', id: 'serveur', texte: 'Sur un serveur, avec un nom de domaine' },
      { type: 'p', texte: 'Faites pointer le nom de domaine vers le serveur (un enregistrement A), puis donnez-le au script d’installation quand il le demande. L’outil démarre avec un service de plus, Caddy, qui obtient le certificat HTTPS tout seul. Les ports 80 et 443 du serveur doivent être libres.' },
      { type: 'p', texte: 'À la main, cela revient à trois lignes du fichier `.env` : `DOMAINE="geo.exemple.fr"`, `COMPOSE_PROFILES="https"` et `BETTER_AUTH_URL="https://geo.exemple.fr"`. La valeur de `BETTER_AUTH_URL` doit toujours être l’adresse exacte que vous tapez dans le navigateur : sinon la connexion est refusée.' },
      { type: 'h2', id: 'equipe', texte: 'Inviter votre équipe' },
      { type: 'p', texte: 'Personne ne s’inscrit seul. Dans **Réglages › Comptes**, l’administrateur saisit un nom et une adresse e-mail : l’outil crée le compte et affiche un lien personnel, valable sept jours, que vous envoyez depuis votre messagerie. La personne y choisit son mot de passe. Aucun service d’e-mail n’est à configurer. Voir [Comptes et connexion](doc:piloter/comptes).' },
      { type: 'h2', id: 'mettre-a-jour', texte: 'Mettre à jour, sauvegarder, arrêter' },
      {
        type: 'liste',
        items: [
          '**Mettre à jour** : dans le dossier de l’installation, `git pull` puis `docker compose up -d --build`. La base de données est mise à niveau toute seule au démarrage et vos données sont conservées. Les changements sont listés dans [Nouveautés](doc:reference/nouveautes).',
          '**Sauvegarder** : toutes vos données sont dans la base PostgreSQL. La commande `docker compose exec -T db pg_dump -U geotrends geotrends > sauvegarde.sql` en fait une copie. Gardez aussi le fichier `.env`.',
          '**Arrêter** : `docker compose down` arrête l’outil sans rien effacer, `docker compose up -d` le relance.',
          '**Voir ce qui se passe** : `docker compose logs app` pour l’outil, `docker compose logs taches` pour les relevés automatiques.',
        ],
      },
      { type: 'encadre', ton: 'limite', texte: 'GeoTrends est fourni tel quel, sans assistance ni garantie (licence AGPL-3.0). Le plafond mensuel, 20 $ au départ, est le garde-fou de la dépense : il suspend les envois quand il est atteint. Une installation ouverte sur Internet doit être en HTTPS, et le compte administrateur créé tout de suite après l’installation : tant qu’il n’existe pas, la première personne qui ouvre la page peut le créer.' },
      {
        type: 'liens',
        titre: 'Ensuite',
        items: [
          { page: 'demarrer/prise-en-main', texte: 'Du premier projet au premier relevé, en six étapes.' },
          { page: 'demarrer/couts', texte: 'Ce que coûte un relevé, et comment la dépense est tenue.' },
          { page: 'piloter/reglages', texte: 'Les clés en place, le rythme des relevés, les comptes.' },
          { page: 'piloter/comptes', texte: 'Inviter une personne, les deux rôles, se repérer dans l’outil.' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'GeoTrends is free, open-source software: you install it on your computer or on a server, with your own API keys. Nothing goes through us: your prompts, the recorded answers and your numbers stay in your own database. Allow fifteen minutes. The code is on [GitHub](https://github.com/Digitizfr/geotrends).' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          '**Docker**, which is free: Docker Desktop on Mac or Windows, Docker Engine on Linux. It runs the tool, its database and its background task.',
          '**A DataForSEO account**, to record ChatGPT, Gemini and Google. It is the only key you cannot do without.',
          '**A DeepSeek or Anthropic key**, recommended: it lets a small model read the answers.',
          '**A computer or a small server.** Automatic runs go out while the tool is running: on a computer switched off at night, they go out when it wakes up. A server at a few euros a month is enough (2 GB of memory).',
        ],
      },
      { type: 'h2', id: 'install', texte: 'Install, in three steps' },
      {
        type: 'etapes',
        items: [
          { titre: 'Download the code', texte: 'In a terminal: `git clone https://github.com/Digitizfr/geotrends.git`, then `cd geotrends`. Without git, the **Code › Download ZIP** button on the [GitHub page](https://github.com/Digitizfr/geotrends) gives you the same folder.' },
          { titre: 'Run the install script', texte: 'Type `./installer.sh`. It asks, in order: the domain name (leave empty on your computer), the DataForSEO API login and password, then the optional keys. Pressing Enter skips a question. It writes the `.env` file, generates two secrets unique to your installation, builds the tool and starts it. The first build takes a few minutes.' },
          { titre: 'Create the admin account', texte: 'Open the address shown at the end (`http://localhost:3010` on your computer). On first launch, the screen asks for your name, your e-mail address and a password: that is the admin account. The tool then takes you to creating your first project.', capture: 'premier-compte' },
        ],
      },
      { type: 'encadre', ton: 'conseil', titre: 'Without the script', texte: 'Copy `.env.example` to `.env`, fill it in (every line is explained), then run `docker compose up -d --build`. The result is the same.' },
      { type: 'h2', id: 'keys', texte: 'API keys' },
      { type: 'p', texte: 'An API key is a password that lets the tool call a provider on your behalf. You open an account with the provider, create the key there, and paste it into the `.env` file. It only leaves your machine to call that provider, and the tool never displays it.' },
      {
        type: 'tableau',
        colonnes: ['Provider', 'What it enables', 'Price', 'In the .env file'],
        lignes: [
          ['**DataForSEO** (required)', 'Readings of ChatGPT, Gemini, Google AI Mode and AI Overviews, in their real interface. API login and password at [app.dataforseo.com](https://app.dataforseo.com/api-access).', '$0.0012 per answer. Minimum top-up of $50.', '`DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`'],
          ['**DeepSeek** (recommended)', 'The small model: it reads every answer (brands named, rank, tone), tags the prompts, classifies the sites, suggests the prompts of a page. Key at [platform.deepseek.com](https://platform.deepseek.com/api_keys).', 'About $0.0008 per answer read.', '`DEEPSEEK_API_KEY`'],
          ['**Anthropic** (optional)', 'Claude readings, through its API. Also acts as the small model if you have no DeepSeek key. Key at [console.anthropic.com](https://console.anthropic.com/settings/keys).', 'About $0.06 per prompt asked to Claude.', '`ANTHROPIC_API_KEY`'],
          ['**YouTube** (optional)', 'The channel name of every cited video, to count the videos from your channels. “YouTube Data API v3” key in the [Google Cloud console](https://console.cloud.google.com/apis/credentials).', 'Free.', '`YOUTUBE_API_KEY`'],
          ['**Resend** (optional)', 'Sending the Monday report by e-mail. You also need a sender address on a domain verified with Resend. Key at [resend.com](https://resend.com/api-keys).', 'Free up to 3,000 e-mails a month.', '`RESEND_API_KEY` and `RAPPORT_EXPEDITEUR`'],
        ],
      },
      { type: 'p', texte: 'Without a DeepSeek or Anthropic key, runs still work and your brand’s presence is measured. What is missing: the competing brands named, their rank and the tone (except for ChatGPT), prompt tags and site classification.' },
      { type: 'h2', id: 'change-a-key', texte: 'Adding or changing a key' },
      {
        type: 'etapes',
        items: [
          { titre: 'Open the .env file', texte: 'It is in the installation folder. Paste the key between the quotes, on the line that bears its name.' },
          { titre: 'Restart the tool', texte: 'Type `docker compose up -d`: the tool restarts with the new value. Your data does not move.' },
          { titre: 'Check in Settings', texte: 'The **Provider keys** block says “Key in place” or “Key missing” for each one. After a first paid call, it also gives the date of the last successful call: that is what proves the key works. See [Settings](doc:piloter/reglages).' },
        ],
      },
      { type: 'h2', id: 'server', texte: 'On a server, with a domain name' },
      { type: 'p', texte: 'Point the domain name to the server (an A record), then give it to the install script when it asks. The tool starts with one more service, Caddy, which obtains the HTTPS certificate on its own. Ports 80 and 443 of the server must be free.' },
      { type: 'p', texte: 'By hand, this comes down to three lines of the `.env` file: `DOMAINE="geo.example.com"`, `COMPOSE_PROFILES="https"` and `BETTER_AUTH_URL="https://geo.example.com"`. The value of `BETTER_AUTH_URL` must always be the exact address you type in the browser: otherwise sign-in is refused.' },
      { type: 'h2', id: 'team', texte: 'Inviting your team' },
      { type: 'p', texte: 'Nobody signs up on their own. In **Settings › Accounts**, the admin enters a name and an e-mail address: the tool creates the account and shows a personal link, valid for seven days, which you send from your own mail app. The person chooses a password there. There is no e-mail service to configure. See [Accounts and sign-in](doc:piloter/comptes).' },
      { type: 'h2', id: 'update', texte: 'Updating, backing up, stopping' },
      {
        type: 'liste',
        items: [
          '**Update**: in the installation folder, `git pull` then `docker compose up -d --build`. The database is upgraded on its own at start-up and your data is kept. Changes are listed in [What’s new](doc:reference/nouveautes).',
          '**Back up**: all your data is in the PostgreSQL database. The command `docker compose exec -T db pg_dump -U geotrends geotrends > backup.sql` makes a copy. Keep the `.env` file too.',
          '**Stop**: `docker compose down` stops the tool without deleting anything, `docker compose up -d` starts it again.',
          '**See what is going on**: `docker compose logs app` for the tool, `docker compose logs taches` for automatic runs.',
        ],
      },
      { type: 'encadre', ton: 'limite', texte: 'GeoTrends is provided as is, with no support and no warranty (AGPL-3.0 licence). The monthly cap, $20 to start with, is the spending safeguard: it pauses sending once reached. An installation open to the Internet must use HTTPS, and the admin account must be created right after installing: until it exists, the first person who opens the page can create it.' },
      {
        type: 'liens',
        titre: 'Next',
        items: [
          { page: 'demarrer/prise-en-main', texte: 'From the first project to the first run, in six steps.' },
          { page: 'demarrer/couts', texte: 'What a run costs, and how spend is kept in check.' },
          { page: 'piloter/reglages', texte: 'Keys in place, run schedule, accounts.' },
          { page: 'piloter/comptes', texte: 'Inviting someone, the two roles, finding your way in the tool.' },
        ],
      },
    ],
  },
}

export default page
