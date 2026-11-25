<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Nouveautés

> Ce qui a changé dans GeoTrends, jour par jour, le plus récent en tête : logiciel libre à installer chez soi, pages suivies, partage client, invitations, documentation.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/reference/changelog.md)

Cette page est mise à jour à chaque mise en ligne. Elle dit ce qui change pour vous, pas le détail technique. Les fonctions décrites ici sont en service ; ce qui n’est pas fait est écrit comme tel dans les pages concernées.

<a id="2026-11-25"></a>

## 25 novembre 2026

- **GeoTrends devient un logiciel libre**, sous licence AGPL-3.0. Le code est sur [GitHub](https://github.com/Digitizfr/geotrends) : chacun peut l’installer chez soi, avec ses propres clés d’API. Voir [Installer GeoTrends](../demarrer/installer.md).
- **Installation en trois étapes** : un script pose les questions, écrit le fichier de réglages et lance l’outil avec Docker. La tâche de fond des relevés automatiques est fournie avec, et le certificat HTTPS se fait tout seul sur un serveur.
- **Premier compte** : au premier lancement, la page de connexion fait créer le compte administrateur, puis ouvre la création du premier projet.
- **Clés des fournisseurs** : l’identifiant et le mot de passe DataForSEO se saisissent tels quels ; le petit modèle prend la clé DeepSeek ou, à défaut, celle d’Anthropic. Réglages dit, pour chaque clé absente, le nom à écrire dans le fichier `.env`.
- Toute la documentation est aussi sur GitHub, en Markdown, recopiée du site à chaque mise à jour.

<a id="2026-11-20"></a>

## 20 novembre 2026

- **Pages suivies** : collez l’adresse d’une page de la marque ; l’outil la lit, propose les questions auxquelles elle répond (à garder, retoucher, retirer, ou compléter à la main), puis dit, IA par IA, si les réponses à ces questions la citent et ce qu’elles citent à sa place.
- La **recherche rapide** (⌘ K) trouve aussi les pages, par un bout de leur adresse ou de leur titre.
- **Partir d’une page** sur l’écran Questions, et **Suivre** sur les pages de la marque dans Sources.

<a id="2026-11-19"></a>

## 19 novembre 2026

- **Partager avec un client** : une page privée, sans compte, sur une série de questions, avec la marque IA par IA, l’évolution et le détail de chaque réponse. Elle se met à jour à chaque relevé, compte ses ouvertures et se coupe d’un clic (écran **Partages**, ou **Partager** sur les questions cochées).
- **Inviter une personne** depuis **Réglages › Comptes** : elle reçoit un lien personnel, valable sept jours, pour choisir son mot de passe. Aucun mot de passe ne circule par e-mail. Le même bouton refait un lien quand quelqu’un a oublié le sien.
- **Mon mot de passe**, dans Réglages : chacun peut changer le sien.
- **Retirer un accès** d’un clic, confirmé, dans Réglages › Comptes.

<a id="2026-11-18"></a>

## 18 novembre 2026

- **Documentation et cas d’usage** sur le site public, en français et en anglais : chaque écran de l’outil décrit, avec des captures en données d’exemple.
- Un contrôle automatique signale tout écran de l’outil qu’aucune page de la documentation ne décrit : la documentation suit l’outil.

<a id="2026-11-15"></a>

## 15 novembre 2026

- **Réseaux sociaux de la marque** : un profil LinkedIn, Instagram, Facebook, X, TikTok, Pinterest, Threads, Bluesky ou GitHub se déclare comme une propriété. Une page citée sous ce profil compte pour la marque.
- **Détecter depuis le site** : à la création d’un projet et sur sa fiche, ce bouton lit gratuitement la page d’accueil du site et propose les profils et chaînes YouTube trouvés. Rien n’est ajouté sans relecture, et ce qui est déjà déclaré n’est pas reproposé.
- **Vidéos et chaînes** refait en trois blocs : vos chaînes, une carte par chaîne déclarée ; question par question, avec les miniatures et la chaîne de la vidéo citée ; les autres chaînes citées. Une seule unité de compte : la réponse relevée.
- Claude peut de nouveau être relevé par son API.

<a id="2026-11-14"></a>

## 14 novembre 2026

- **Projets** : créer une marque depuis l’outil, avec ses sites, ses chaînes, ses concurrents et ses questions ; la choisir en haut du menu ; lancer un relevé d’un clic, avec le prix de chaque IA affiché avant l’envoi.
- **Relevés automatiques** : chaque semaine pour ChatGPT, Gemini et Google, toutes les deux semaines pour Claude, une fois activés sur la fiche du projet.
- **Lecture automatique des réponses** par un petit modèle : marques nommées, rang et ton, pour toutes les IA.
- **Actions** : une liste de travail tirée des relevés, avec un état par ligne, une note, un journal des prises de contact et la comparaison avant et après une action faite.
- **Audit d’une page** (lecture gratuite : accès des robots, texte sans JavaScript, titres, données structurées, date, auteur) et **exports CSV**.
- **Nouveaux écrans** dans l’identité du site : vue d’ensemble, questions et page d’une question, réponses, concurrents, sources, vidéos, Aperçus IA et Google, actions, faits vérifiés, rapport, réglages, coûts.
- **Sources** : type de chaque site et marque propriétaire (bouton Classer les sites), sources qui montent et qui descendent.
- **Questions** : étiquettes (thème et intention), carte des thèmes, sélection de plusieurs questions, mesure approfondie d’une question.
- **Faits vérifiés** et **rapport** avec ses alertes ; repères et bande de marge d’erreur sur les graphiques ; filtre « Face à » un concurrent dans la barre du haut.
- **Interface** : menu repliable et réduit aux icônes, barre du haut avec la période et les IA, recherche rapide (⌘ K ou Ctrl K), tableaux triables, affichage sur téléphone, interface en français ou en anglais, page de connexion refaite.
- **Site public** complet, en français et en anglais, avec des écrans en données d’exemple.

<a id="2026-11-12"></a>

## 12 novembre 2026

- **Premiers relevés** : ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google, relevés dans leur interface, depuis le pays du projet.
- **Claude** interrogé par son API, recherche web activée, et compté à part.
- **Chaînes YouTube** : une vidéo citée est rattachée à sa chaîne ; si la chaîne appartient à la marque, la citation compte pour elle.
- **Comptes** à inscription fermée, **journal des coûts** avec un plafond par mois, et rubrique **Administration** pour les coûts.
- Rythme des relevés fixé : chaque semaine, et toutes les deux semaines pour Claude. Mise en ligne sur geotrends.io.

**Voir aussi**

- [Qu’est-ce que GeoTrends ?](../README.md)
- [Les IA suivies](./ia-suivies.md)

---

Mise à jour : 2026-11-25 · [Lire cette page sur le site](https://geotrends.io/documentation/reference/nouveautes)
