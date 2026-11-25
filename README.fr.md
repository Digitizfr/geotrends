<p align="center">
  <img src="public/logo-geotrends.png" alt="GeoTrends" width="96" height="96">
</p>

<h1 align="center">GeoTrends</h1>

<p align="center">
  <strong>Logiciel GEO open source et gratuit.</strong><br>
  Mesurez si ChatGPT, Gemini, Google et Claude citent votre marque, avec vos propres clés d’API.
</p>

<p align="center">
  <a href="README.md">🇬🇧 English version</a> ·
  <a href="https://geotrends.io">Site</a> ·
  <a href="docs/fr/demarrer/installer.md">Guide d’installation</a> ·
  <a href="docs/fr/README.md">Documentation</a>
</p>

![La vue d’ensemble d’un projet GeoTrends, en données d’exemple](public/docs/captures/fr/vue.webp)

## Arrêtez de surpayer votre outil GEO

Un outil GEO (Generative Engine Optimization) pose aux IA les questions de vos clients et range les réponses. Il passe pour cela par des services de relevé et par les API des modèles, ouverts à tous, à des prix publics : **0,0012 $ pour une réponse** de ChatGPT, de Gemini ou de Google.

Un abonnement vous revend ce relevé au forfait. GeoTrends est un logiciel que vous installez vous-même : vous y branchez vos propres clés d’API et vous payez chaque relevé à son prix, sans intermédiaire.

| Pour suivre 50 questions | Un abonnement GEO | GeoTrends, avec vos clés |
| --- | --- | --- |
| Par mois | 95 $ | environ 7,50 $ |
| Par an | 1 140 $ | environ 90 $ |
| IA suivies | selon l’offre choisie | 5, dont Claude |
| Vos réponses et vos chiffres | chez l’éditeur | chez vous |
| Le code | fermé | ouvert, AGPL-3.0 |

<sub>Abonnement : 95 $ par mois pour 50 questions, le prix d’entrée affiché par trois outils GEO sur leurs pages de tarifs (relevées le 12 novembre 2026). GeoTrends : prix des fournisseurs constatés en novembre 2026, relevés chaque semaine, Claude toutes les deux semaines ; sans Claude, environ 1 $ par mois. Ce que vous n’aurez pas ici : un service d’assistance, un hébergement clés en main, Perplexity et Copilot.</sub>

## Ce qu’il fait

- **Mesurer.** Vos questions partent vers cinq IA (ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google dans leur vraie interface, Claude par son API), depuis le pays et dans la langue de votre choix. Chaque réponse est gardée mot pour mot, avec ses sources.
- **Comprendre.** Les marques nommées à votre place, leur rang et le ton, les sites et les pages qui servent de sources, les chaînes YouTube, les dix premiers résultats de Google sous chaque Aperçu IA, les faits faux sur votre marque.
- **Agir.** Une seule liste de travail, tirée des relevés : les pages où obtenir une mention, vos pages lues mais pas citées, les sujets à couvrir. Après une correction, l’outil dit si l’écart dépasse la marge d’erreur.
- **Garder la main.** Chaque appel payant est inscrit avec son prix, sous un plafond mensuel qui suspend les envois. Chaque chiffre affiche sa méthode et le nombre de réponses sur lequel il repose.

L’interface existe en français et en anglais. [Toutes les fonctions](https://geotrends.io/fonctionnalites) · [La méthode](https://geotrends.io/methode)

## Installer en trois étapes

Il vous faut [Docker](https://docs.docker.com/get-docker/) et un compte [DataForSEO](https://app.dataforseo.com/api-access). Comptez un quart d’heure.

```bash
git clone https://github.com/Digitizfr/geotrends.git
cd geotrends
./installer.sh
```

Le script demande vos clés, écrit le fichier `.env`, puis construit et démarre l’outil. Ouvrez l’adresse qu’il affiche (`http://localhost:3010` sur votre ordinateur) : le premier écran crée le compte administrateur, le suivant votre premier projet.

Sur un serveur, donnez au script un nom de domaine qui pointe déjà vers lui : le HTTPS se met en place tout seul. Sans le script : copiez `.env.example` vers `.env`, remplissez-le, puis lancez `docker compose up -d --build`.

Le guide complet : [Installer GeoTrends](docs/fr/demarrer/installer.md).

## Les clés d’API

Seule la première est indispensable. Les clés s’écrivent dans le fichier `.env`, restent sur votre machine, et l’outil ne les affiche jamais.

| Clé | À quoi elle sert | Ce qu’elle coûte | |
| --- | --- | --- | --- |
| **DataForSEO** | Relever ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google, dans leur vraie interface | 0,0012 $ la réponse, recharge minimale de 50 $ | Indispensable |
| **DeepSeek** ou **Anthropic** | Faire lire chaque réponse par un petit modèle : marques nommées, rang, ton, thèmes | Moins de 0,001 $ la réponse | Conseillée |
| **Anthropic** | Poser aussi vos questions à Claude | Environ 0,06 $ la question | Facultative |
| **YouTube** | Rattacher chaque vidéo citée à sa chaîne | Gratuit | Facultative |
| **Resend** | Recevoir le rapport du lundi par e-mail | Gratuit | Facultative |

## Mettre à jour et sauvegarder

```bash
git pull && docker compose up -d --build                                      # mise à jour : la base se met à niveau seule, vos données sont gardées
docker compose exec -T db pg_dump -U geotrends geotrends > sauvegarde.sql      # sauvegarde
```

## Documentation

- [Documentation en français](docs/fr/README.md) et [cas d’usage](docs/fr/README.md#cas-dusage)
- [Documentation in English](docs/en/README.md)
- Sur le site, avec le même contenu : [geotrends.io/documentation](https://geotrends.io/documentation)

Les fichiers Markdown de `docs/` sont générés depuis la documentation du site (`src/site/docs`) : on modifie la source, puis on lance `npm run verifier-docs`.

## Développement

Next.js (App Router, TypeScript), Prisma avec PostgreSQL, Better Auth, Tailwind CSS. Le code, ses commentaires et les messages de commit sont en français.

```bash
npm ci
cp .env.example .env        # renseigner DATABASE_URL (PostgreSQL local), BETTER_AUTH_SECRET et BETTER_AUTH_URL="http://localhost:3010"
npx prisma migrate deploy && npx prisma generate
npm run dev                 # http://localhost:3010
```

Avant d’envoyer une modification : `npm run lint`, `npx tsc --noEmit` et `npm run verifier-docs`. Les captures de la documentation sont de vrais écrans de l’outil sur un jeu de données fictif ; `npm run captures` les refait (voir `scripts/demo/LISEZMOI.md`). Les signalements et les propositions de modification sont bienvenus, en français ou en anglais.

## Licence

[GNU Affero General Public License v3.0](LICENSE). Vous pouvez utiliser, modifier et redistribuer GeoTrends ; si vous faites tourner une version modifiée comme service en ligne, vous devez publier vos modifications sous la même licence.

Copyright © 2026 [Digitiz](https://digitiz.fr). GeoTrends n’est affilié ni à OpenAI, ni à Google, ni à Anthropic, ni à DataForSEO, ni à DeepSeek.
