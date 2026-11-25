# GeoTrends

Instructions pour les assistants de code (Claude Code et autres) et pour toute personne qui contribue.
Si un fichier `CLAUDE.local.md` existe à la racine, le lire d'abord : il porte les notes et les règles
propres à l'équipe qui a installé l'outil. Il n'est jamais publié (voir `.gitignore`).

## Le produit

**GeoTrends** est un outil GEO (Generative Engine Optimization) : il mesure si une marque est citée
dans les réponses des assistants IA (ChatGPT, Gemini, Mode IA et Aperçus IA de Google, Claude),
explique pourquoi elle ne l'est pas, et dit quoi faire pour y entrer.

C'est un **logiciel libre** (licence AGPL-3.0, dépôt public `Digitizfr/geotrends`), fait par Digitiz.
Chacun l'installe chez soi avec Docker et y branche **ses propres clés d'API** : il n'y a ni
abonnement, ni paiement, ni inscription publique. Le site de présentation est https://geotrends.io.

Quatre principes, à respecter dans tout changement :

1. **Des données vraies** : on relève ce que l'utilisateur voit dans l'interface, pas la réponse de l'API.
2. **Des chiffres fiables** : chaque question est posée plusieurs fois, on affiche une tendance, pas le bruit du jour.
3. **De l'action** : la liste des pages où il faut apparaître et des corrections à faire, puis une nouvelle mesure.
4. **Multilingue et multi-pays** : jamais de « fr » ni de « France » codés en dur.

Et une exigence : **le journal des coûts**. Chaque appel à une API payante est enregistré avec son
prix (`src/lib/couts.ts`), pour voir la dépense par jour, par fournisseur, par IA et par projet.

## Règles de travail

1. **Le dépôt est public.** Aucun secret, aucune donnée réelle d'une marque, aucune note interne
   (serveur, adresses e-mail, dépenses, résultats) dans un fichier suivi par git. Les clés vivent dans
   `.env` ou dans des fichiers `*.key.txt`, ignorés par git.
2. **Tout appel payant passe par le journal des coûts** et respecte le plafond mensuel
   (`budgetDisponible()`). Le prix s'affiche avant l'envoi : c'est l'utilisateur qui déclenche la dépense.
3. **Honnêteté de la mesure** : chaque chiffre affiché précise sa méthode (interface ou API) et son
   nombre de relevés. Les deux méthodes ne s'additionnent jamais. On ne promet jamais une citation.
4. **Les pages publiques ne montrent que des données d'exemple** (marque fictive « Facturo »).
5. **Le site et la documentation suivent l'outil, dans le même lot** : état des fonctions dans
   `src/site/contenu/fonctions.ts`, page de documentation de l'écran touché et sa date `maj`, page
   « Nouveautés » (`reference/nouveautes`), captures rejouées (`npm run captures`), puis
   `npm run verifier-docs` sans erreur. Ce dernier refait aussi la copie Markdown de `docs/`.
   Une fonction pas encore prête se dit une seule fois, en clair : jamais de tampon « Bientôt ».
6. **Français** pour le code (noms, commentaires), les messages de commit et les textes de l'interface.
   Chaque texte de l'interface a sa traduction anglaise (`src/lib/i18n/en/`), chaque page du site et
   de la documentation existe en français et en anglais.
7. **Une installation neuve part de zéro** : base vide, premier compte créé au premier lancement
   (`src/lib/premier-compte.ts`), aucune donnée ni réglage propre à une marque dans le code.

## Stack

- **Next.js** (App Router, TypeScript), **Tailwind CSS**
- **Prisma** avec **PostgreSQL**
- **Better Auth**, inscription fermée : premier compte au premier lancement, les suivants par invitation
- **Docker Compose** : l'outil (`app`), la base (`db`), la tâche de fond (`taches`), et Caddy pour le
  HTTPS quand un nom de domaine est donné (`COMPOSE_PROFILES=https`)

## Où sont les choses

- `src/app/(app)/` : les écrans de l'outil (derrière la connexion). `src/app/connexion`, `invitation`, `partage` : hors connexion.
- `src/app/` (le reste) et `src/site/` : le site public, en français et en anglais. Il n'est servi à la
  racine que si `SITE_VITRINE=1` (geotrends.io) ; ailleurs, la racine ouvre l'outil (`src/proxy.ts`).
- `src/site/docs/` : la documentation et les cas d'usage (une page par fichier, français et anglais
  côte à côte). `docs/fr` et `docs/en` en sont la copie Markdown, **générée** : ne pas la modifier à la main.
- `src/lib/` : la logique. `releves.ts` (envoi et collecte), `fournisseurs/` (DataForSEO, Anthropic),
  `analyse.ts` (lecture des réponses par le petit modèle, `demanderJson`), `mesures.ts` (comptes, marge
  d'erreur, verdicts), `cles.ts` (lecture des clés), `couts.ts` (journal et plafond), `taches.ts` (tâche de fond).
- `src/lib/i18n/` : `t('texte français')` et les dictionnaires anglais.
- `prisma/` : le schéma et les migrations. `scripts/` : tâche de fond, invitation, vérification de la
  documentation, export Markdown, données et captures de démonstration (`scripts/demo/`).

## Vocabulaire du produit

- **Question** (prompt) : ce qu'un client potentiel demande à une IA.
- **Relevé** : une réponse d'une IA à une question, à un instant donné, avec ses sources.
- **Visibilité** : part des relevés où la marque est mentionnée.
- **Part de voix** : mentions de la marque rapportées à celles de ses concurrents.
- **Source** : page citée ou utilisée par l'IA pour répondre.
- **Méthode** : « interface » (ce que voit l'utilisateur) ou « API » (réponse du modèle seul).

## Commandes

- `npm run dev` : l'outil en local sur http://localhost:3010 (il faut `DATABASE_URL`, `BETTER_AUTH_SECRET` et `BETTER_AUTH_URL` dans `.env`).
- `npx prisma migrate deploy && npx prisma generate` : mettre la base à niveau.
- `npm run lint`, `npx tsc --noEmit`, `npm run verifier-docs` : à passer avant tout envoi.
- `npm run captures` : refait les captures de la documentation sur une base de démonstration fictive
  (`scripts/demo/LISEZMOI.md`). `npm run captures -- --seulement reglages,partages` n'en refait que quelques-unes.
- `npm run taches` : un passage de la tâche de fond. `npm run entretien -- collecter | extraire | videos | lire`.
- `npm run inviter -- email "Nom" [--admin]` : crée un compte et affiche son lien d'invitation.
- `./installer.sh` : installation complète avec Docker.

## Pièges connus

- Les réponses des API ne sont pas celles de l'interface. Ne jamais mélanger les deux méthodes dans un même indicateur.
- Une réponse d'IA est un échantillon, pas un classement : la même question donne des réponses différentes d'un essai à l'autre.
- DataForSEO : seul l'envoi d'une tâche est facturé, la lecture est gratuite. Tant que la tâche n'est pas
  prête, la lecture répond 40601 ou 40602 : ce n'est pas un échec. Une question sans Aperçu IA revient en
  statut « vide », à ne pas compter comme une absence de la marque.
- Les Aperçus IA n'ont pas d'adresse propre chez DataForSEO : ils se lisent dans la page de résultats
  classique (`serp/google/organic`), avec `load_async_ai_overview`.
- Recherche web de Claude : garder `web_search_20250305`. La version `web_search_20260209` filtre les
  résultats par un programme et ne renvoie aucune citation, donc aucune source à mesurer.
- **Ne jamais appeler `revalidatePath('/', 'layout')`** depuis l'outil : il invalide aussi les pages
  statiques du site, et la documentation répondait alors 404. Pour rafraîchir l'écran après une action :
  `refresh()` de `next/cache`.
- Une page statique qui lit `process.env` le fait à la construction, pas au démarrage. Ce qui dépend de
  l'installation (`SITE_VITRINE`) se lit à la requête : `src/proxy.ts`, `robots.ts` et `sitemap.ts` en `force-dynamic`.
- Après une migration Prisma, redémarrer `npm run dev` : le serveur garde l'ancien client en mémoire.
- Une nouvelle capture de la documentation s'ajoute au tableau `CAPTURES` de `scripts/demo/captures.ts`.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
