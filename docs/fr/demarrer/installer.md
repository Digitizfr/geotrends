<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Installer GeoTrends

> Installer GeoTrends chez vous avec Docker : télécharger le code, brancher vos clés d’API (DataForSEO, DeepSeek ou Anthropic), créer le compte administrateur.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/get-started/install.md)

GeoTrends est un logiciel libre et gratuit : vous l’installez sur votre ordinateur ou sur un serveur, avec vos propres clés d’API. Rien ne passe par nous : vos questions, les réponses relevées et vos chiffres restent dans votre base de données. Comptez un quart d’heure. Le code est sur [GitHub](https://github.com/Digitizfr/geotrends).

<a id="ce-qu-il-faut"></a>

## Ce qu’il vous faut

- **Docker**, gratuit : Docker Desktop sur Mac ou Windows, Docker Engine sur Linux. C’est lui qui fait tourner l’outil, sa base de données et sa tâche de fond.
- **Un compte DataForSEO**, pour relever ChatGPT, Gemini et Google. C’est la seule clé indispensable.
- **Une clé DeepSeek ou Anthropic**, conseillée : elle sert à faire lire les réponses par un petit modèle.
- **Un ordinateur ou un petit serveur.** Les relevés automatiques partent tant que l’outil tourne : sur un ordinateur éteint la nuit, ils partiront au réveil. Un serveur à quelques euros par mois suffit (2 Go de mémoire).

<a id="installer"></a>

## Installer, en trois étapes

1. **Télécharger le code.** Dans un terminal : `git clone https://github.com/Digitizfr/geotrends.git`, puis `cd geotrends`. Sans git, le bouton **Code › Download ZIP** de la [page GitHub](https://github.com/Digitizfr/geotrends) donne le même dossier.

2. **Lancer le script d’installation.** Tapez `./installer.sh`. Il demande, dans l’ordre : le nom de domaine (laissez vide sur votre ordinateur), l’identifiant et le mot de passe d’API DataForSEO, puis les clés facultatives. La touche Entrée passe une question. Il écrit le fichier `.env`, génère deux secrets propres à votre installation, construit l’outil et le démarre. La première construction prend quelques minutes.

3. **Créer le compte administrateur.** Ouvrez l’adresse affichée à la fin (`http://localhost:3010` sur votre ordinateur). Au premier lancement, l’écran demande votre nom, votre adresse e-mail et un mot de passe : c’est le compte administrateur. L’outil enchaîne sur la création de votre premier projet.

   ![Créer le compte administrateur](../../../public/docs/captures/fr/premier-compte.webp)

> [!TIP]
> **Sans le script**
>
> Copiez `.env.example` vers `.env`, remplissez-le (chaque ligne est expliquée), puis lancez `docker compose up -d --build`. Le résultat est le même.

<a id="cles"></a>

## Les clés d’API

Une clé d’API est un mot de passe qui permet à l’outil d’appeler un fournisseur en votre nom. Vous ouvrez un compte chez lui, vous y créez la clé, vous la collez dans le fichier `.env`. Elle ne quitte votre machine que pour appeler ce fournisseur, et l’outil ne l’affiche jamais.

| Fournisseur | Ce qu’il permet | Prix | Dans le fichier .env |
| --- | --- | --- | --- |
| **DataForSEO** (indispensable) | Les relevés de ChatGPT, de Gemini, du Mode IA et des Aperçus IA de Google, dans leur vraie interface. Identifiant et mot de passe d’API sur [app.dataforseo.com](https://app.dataforseo.com/api-access). | 0,0012 $ par réponse. Recharge minimale de 50 $. | `DATAFORSEO_LOGIN` et `DATAFORSEO_PASSWORD` |
| **DeepSeek** (conseillé) | Le petit modèle : il lit chaque réponse (marques nommées, rang, ton), étiquette les questions, classe les sites, propose les questions d’une page. Clé sur [platform.deepseek.com](https://platform.deepseek.com/api_keys). | Environ 0,0008 $ par réponse lue. | `DEEPSEEK_API_KEY` |
| **Anthropic** (facultatif) | Les relevés de Claude, par son API. Sert aussi de petit modèle si vous n’avez pas de clé DeepSeek. Clé sur [console.anthropic.com](https://console.anthropic.com/settings/keys). | Environ 0,06 $ par question posée à Claude. | `ANTHROPIC_API_KEY` |
| **YouTube** (facultatif) | Le nom de la chaîne de chaque vidéo citée, pour compter les vidéos de vos chaînes. Clé « YouTube Data API v3 » dans la [console Google Cloud](https://console.cloud.google.com/apis/credentials). | Gratuit. | `YOUTUBE_API_KEY` |
| **Resend** (facultatif) | L’envoi du rapport du lundi par e-mail. Il faut aussi une adresse d’expédition sur un domaine vérifié chez Resend. Clé sur [resend.com](https://resend.com/api-keys). | Gratuit jusqu’à 3 000 e-mails par mois. | `RESEND_API_KEY` et `RAPPORT_EXPEDITEUR` |

Sans clé DeepSeek ni Anthropic, les relevés fonctionnent et la présence de votre marque est mesurée. Ce qui manque : les marques concurrentes nommées, leur rang et le ton (sauf pour ChatGPT), les étiquettes des questions et le classement des sites.

<a id="changer-une-cle"></a>

## Ajouter ou changer une clé

1. **Ouvrir le fichier .env.** Il est dans le dossier de l’installation. Collez la clé entre les guillemets, sur la ligne qui porte son nom.

2. **Relancer l’outil.** Tapez `docker compose up -d` : l’outil redémarre avec la nouvelle valeur. Vos données ne bougent pas.

3. **Vérifier dans Réglages.** Le bloc **Clés des fournisseurs** dit « Clé en place » ou « Clé absente » pour chacune. Après un premier appel payant, il donne aussi la date du dernier appel réussi : c’est elle qui prouve que la clé fonctionne. Voir [Réglages](../piloter/reglages.md).

<a id="serveur"></a>

## Sur un serveur, avec un nom de domaine

Faites pointer le nom de domaine vers le serveur (un enregistrement A), puis donnez-le au script d’installation quand il le demande. L’outil démarre avec un service de plus, Caddy, qui obtient le certificat HTTPS tout seul. Les ports 80 et 443 du serveur doivent être libres.

À la main, cela revient à trois lignes du fichier `.env` : `DOMAINE="geo.exemple.fr"`, `COMPOSE_PROFILES="https"` et `BETTER_AUTH_URL="https://geo.exemple.fr"`. La valeur de `BETTER_AUTH_URL` doit toujours être l’adresse exacte que vous tapez dans le navigateur : sinon la connexion est refusée.

<a id="equipe"></a>

## Inviter votre équipe

Personne ne s’inscrit seul. Dans **Réglages › Comptes**, l’administrateur saisit un nom et une adresse e-mail : l’outil crée le compte et affiche un lien personnel, valable sept jours, que vous envoyez depuis votre messagerie. La personne y choisit son mot de passe. Aucun service d’e-mail n’est à configurer. Voir [Comptes et connexion](../piloter/comptes.md).

<a id="mettre-a-jour"></a>

## Mettre à jour, sauvegarder, arrêter

- **Mettre à jour** : dans le dossier de l’installation, `git pull` puis `docker compose up -d --build`. La base de données est mise à niveau toute seule au démarrage et vos données sont conservées. Les changements sont listés dans [Nouveautés](../reference/nouveautes.md).
- **Sauvegarder** : toutes vos données sont dans la base PostgreSQL. La commande `docker compose exec -T db pg_dump -U geotrends geotrends > sauvegarde.sql` en fait une copie. Gardez aussi le fichier `.env`.
- **Arrêter** : `docker compose down` arrête l’outil sans rien effacer, `docker compose up -d` le relance.
- **Voir ce qui se passe** : `docker compose logs app` pour l’outil, `docker compose logs taches` pour les relevés automatiques.

> [!WARNING]
> GeoTrends est fourni tel quel, sans assistance ni garantie (licence AGPL-3.0). Le plafond mensuel, 20 $ au départ, est le garde-fou de la dépense : il suspend les envois quand il est atteint. Une installation ouverte sur Internet doit être en HTTPS, et le compte administrateur créé tout de suite après l’installation : tant qu’il n’existe pas, la première personne qui ouvre la page peut le créer.

**Ensuite**

- [Prise en main](./prise-en-main.md) : Du premier projet au premier relevé, en six étapes.
- [Ce que coûte un relevé](./couts.md) : Ce que coûte un relevé, et comment la dépense est tenue.
- [Réglages](../piloter/reglages.md) : Les clés en place, le rythme des relevés, les comptes.
- [Comptes et connexion](../piloter/comptes.md) : Inviter une personne, les deux rôles, se repérer dans l’outil.

---

Mise à jour : 2026-11-25 · [Lire cette page sur le site](https://geotrends.io/documentation/demarrer/installer)
