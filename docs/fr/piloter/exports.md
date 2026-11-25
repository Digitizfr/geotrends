<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Exports CSV

> Quatre exports CSV gratuits : les réponses relevées, les sources citées, la liste de travail et le journal des coûts, plus les données de chaque graphique.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/steer/exports.md)

Un export sert à reprendre les données dans un tableur : faire un tableau croisé, envoyer une liste à un rédacteur, garder une trace. Tout vient de la base : un export est gratuit et ne lance aucun appel. Il porte sur le projet affiché, sauf le journal des coûts, qui couvre tous les projets.

<a id="ou-les-trouver"></a>

## Où les trouver

| Écran | Bouton | Ce qui est exporté |
| --- | --- | --- |
| Vue d’ensemble, Questions | **Exporter** | Les réponses relevées du projet, une ligne par relevé. |
| Sources | **Exporter** | Les sources de toutes les réponses, une ligne par source. |
| Actions | **Exporter** | La liste de travail, une ligne par action. |
| Administration › Coûts | **Exporter** | Le journal des coûts entier, tous projets. Réservé aux administrateurs. |
| Graphiques de la vue d’ensemble, des concurrents et de la page d’une question | **CSV** | Les données du graphique, telles qu’il les affiche. |

> [!NOTE]
> **Les filtres ne s’appliquent pas**
>
> Les quatre exports prennent tout l’historique du projet, toutes les IA, y compris les questions archivées et les mesures approfondies, sans tenir compte de la période ni des IA choisies dans la barre du haut. Seul le bouton **CSV** d’un graphique suit ce que le graphique montre.

<a id="reponses"></a>

## Les réponses relevées

| Colonne | Contenu |
| --- | --- |
| Question, Thème, Intention | Le texte de la question et ses étiquettes (intention écrite en code court : informer, comparer, acheter). |
| IA, Méthode | L’IA en code court (chatgpt, gemini, google_ai_mode, google_ai_overview, claude) et la méthode (interface ou api). |
| Envoyé le, Relevé le | La date d’envoi et la date du relevé, en temps universel (UTC). |
| Statut | recu, vide (pas de réponse ni d’aperçu), en_attente ou echec. |
| Mesure approfondie | oui pour un relevé de mesure approfondie. |
| Modèle | Le modèle qui a répondu, quand l’IA le donne. |
| Site cité, Vidéo citée, Nom dans le texte | oui ou non, pour une réponse reçue : une page du site (ou d’un profil social déclaré), une vidéo d’une chaîne de la marque, le nom de la marque dans le texte. |
| Sources citées | Le nombre de sources citées. |
| Marques nommées (dans l’ordre) | Les marques relevées par la lecture automatique, dans leur ordre d’apparition. |
| Prix ($) | Le prix de ce relevé. |

<a id="sources"></a>

## Les sources

| Colonne | Contenu |
| --- | --- |
| Question, IA, Méthode, Relevé le | La réponse d’où vient la source. |
| Rôle | citée, ou lue sans être citée. |
| Rang | La place de la source dans la liste de la réponse. |
| Domaine, Adresse, Titre | Le site, l’adresse complète de la page et son titre. |
| Chaîne YouTube | Pour une vidéo, la chaîne qui l’a publiée. |
| Type du site, Marque propriétaire | Le type gardé en base (comparatif, média, blog…), « à classer » s’il ne l’est pas encore, et la marque d’un site de marque. |
| À qui | à nous, concurrent suivi, autre marque ou tiers. |

<a id="actions"></a>

## La liste de travail

| Colonne | Contenu |
| --- | --- |
| Famille | En code court : reformuler, apparaitre, video, referencement, fait. |
| Action, Détail | Le titre de la ligne et son explication. |
| Page visée, Type du site | La page à ouvrir, et le type du site pour une page où apparaître. |
| Poids (1 à 5) | Le poids de la ligne, tiré du nombre de réponses et d’IA concernées. |
| État, Faite le, Note | L’état en code court (a_faire, en_cours, fait, ecarte), la date où l’action est passée à « fait », et votre note. |
| Questions à l’appui | Les questions qui servent de preuve, séparées par « \| ». |

<a id="appels"></a>

## Le journal des coûts

Une ligne par appel payant, le plus récent d’abord : **Date (UTC)**, **Fournisseur**, **Type d’appel**, **IA**, **Projet**, **Volume** et **Unité** (`appel`, ou `jeton` pour un appel compté en jetons), **Prix ($)** à six décimales, **Origine du prix** (renvoyé par le fournisseur, ou calculé depuis la grille), **Réussi**, **Durée (ms)**, **Modèle** et **Erreur**. L’export est réservé aux administrateurs.

<a id="graphiques"></a>

## Les données d’un graphique

Le bouton **CSV** d’un graphique télécharge une ligne par point : **Date du relevé** (ou **Semaine du**, si le graphique est réglé par semaine), puis, pour chaque courbe affichée, la valeur, le compte qui la fonde (réponses avec la marque, ou somme des rangs) et la taille de l’échantillon. Une courbe masquée dans la légende n’est pas exportée.

<a id="format"></a>

## Le format des fichiers

- Les fichiers suivent la langue de l’interface. En français : point-virgule entre les colonnes et virgule décimale, pour qu’ils s’ouvrent tels quels dans un tableur en français. En anglais : virgule et point décimal.
- Les en-têtes et les valeurs fixes (oui ou non, types de sites, appartenance) sont traduits. Le texte des questions et des réponses ne l’est jamais.
- Les fichiers sont en UTF-8, avec la marque qui fait reconnaître les accents aux tableurs. Leur nom donne le projet, l’export et la date : `geotrends-facturo-questions-2026-11-18.csv`.

<a id="pas-a-pas"></a>

## Ouvrir un export dans un tableur

1. **Choisir la langue de l’interface.** Si votre tableur est en anglais, passez l’interface en anglais dans Réglages avant d’exporter : le séparateur suivra.

2. **Exporter.** Cliquez sur **Exporter** dans la barre du haut de l’écran voulu. Le fichier se télécharge aussitôt.

3. **Séparer les méthodes.** Filtrez d’abord la colonne **Méthode** : un total qui mélange interface et api ne mesure plus rien.

<a id="limites"></a>

## Limites

> [!WARNING]
> Les codes courts (IA, statut, famille, état) ne sont pas traduits, et les dates des exports sont en temps universel, une ou deux heures avant l’heure de Paris. Un export ne recalcule ni visibilité ni marge d’erreur : il donne les relevés bruts, et un pourcentage calculé dans un tableur sur quelques réponses reste fragile.

**Voir aussi**

- [Le tableau des coûts](./couts.md)
- [L’écran Questions](../mesurer/questions.md)
- [Sources citées](../comprendre/sources.md)
- [La liste de travail](../agir/liste-de-travail.md)

---

Mise à jour : 2026-11-18 · [Lire cette page sur le site](https://geotrends.io/documentation/piloter/exports)
