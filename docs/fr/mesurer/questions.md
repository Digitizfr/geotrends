<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# L’écran Questions

> Une ligne par question : l’état chez chaque IA, un verdict sur la période plutôt qu’un pourcentage, et qui est nommé en premier. Le point de départ pour agir.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/measure/prompts.md)

Une moyenne cache tout : la marque peut être solide sur trois questions et absente des sept autres. L’écran Questions montre la marque question par question, pour dire où elle tient, où elle manque, et qui prend la place. Chaque question y reçoit un verdict, parce qu’avec quelques réponses par question un pourcentage serait trompeur.

Pour y aller : un clic sur une question, partout dans l’outil, ouvre sa page ; le fil d’Ariane de cette page ramène ici. Le bouton **Ajouter des questions** mène à l’onglet Questions de la fiche du projet. Les filtres de la barre du haut (période, IA, face à un concurrent) s’appliquent, comme sur la [vue d’ensemble](./vue-d-ensemble.md#barre-du-haut).

![L’écran Questions du projet Facturo : une ligne par question, l’état chez chaque IA, le verdict et le premier nommé.](../../../public/docs/captures/fr/questions.webp)

*L’écran Questions du projet Facturo : une ligne par question, l’état chez chaque IA, le verdict et le premier nommé.*

<a id="phrase"></a>

## La phrase du haut et les bandeaux

La phrase donne le compte des verdicts : la marque est solide sur tant de questions, occasionnelle sur tant, absente sur tant, avec le nombre de réponses d’interface de la période. Des bandeaux s’ajoutent quand il le faut : des réponses en attente (avec **Récupérer les réponses**, gratuit), des questions jamais relevées (avec **Préparer un relevé**), des questions sans étiquette (avec **Étiqueter les questions**, payant, son prix sur le bouton).

<a id="verdict"></a>

## Le verdict d’une question

| Verdict | Règle |
| --- | --- |
| **Solide** | La marque est nommée ou citée dans 6 réponses d’interface sur 10 ou plus. |
| **Occasionnelle** | Elle est présente, mais dans moins de 6 réponses sur 10. |
| **Absente** | Elle n’apparaît dans aucune réponse. |
| **Trop tôt pour dire** | Moins de 3 réponses d’interface sur la période. |
| **Pas encore relevée** | Aucune réponse pour l’instant. |

Le verdict compte toutes les réponses d’interface de la période, mesures approfondies comprises. Claude, mesuré par son API, n’y entre pas. Sous le verdict : le compte (« 4 sur 6 ») et le nombre d’IA d’interface où la marque apparaît, sur celles qui ont répondu.

<a id="tableau"></a>

## Le tableau « Par question et par IA »

| Colonne | Ce qu’elle montre |
| --- | --- |
| **Question** | Le texte (un clic ouvre la page de la question), puis ses étiquettes : le thème (un clic filtre sur ce thème), l’intention, et « avec le nom de la marque » quand la question le contient. |
| **Une colonne par IA** | L’état du dernier relevé : Citée, Nommée (avec le rang quand il est connu), Lue, Absente, Pas d’aperçu, En attente ou Échec. Avec plusieurs relevés, le compte « 2 sur 3 » et un trait par relevé, surligné quand la marque est là. « hors période » : la question a été relevée, mais pas sur la période choisie. Un clic ouvre la réponse. Claude, mesuré par son API, a sa propre colonne. |
| **Verdict** | Voir ci-dessus. |
| **Premier nommé** | La marque le plus souvent nommée en premier dans les réponses à cette question, avec le nombre de fois. Un clic ouvre ces réponses. « marques pas encore lues » tant que la lecture n’est pas faite. |
| **Tendance** | La petite courbe de la présence de la marque sur cette question, jour de relevé après jour de relevé. |
| **Dernier relevé** | La date du dernier relevé et le nombre de relevés de la période. |

Les colonnes se trient d’un clic sur leur titre. Au-delà de cinq questions, un champ cherche dans les questions, les thèmes et les marques. Sous le tableau, la ligne **Présente dans** donne, IA par IA, le compte des réponses avec la marque, Claude à part ; elle ne compte pas les mesures approfondies. La légende des états suit.

<a id="filtrer"></a>

## Filtrer et grouper

Le volet **Filtrer et grouper**, au-dessus du tableau, propose :

- **Verdict** : Tous, Solide, Occasionnelle, Absente, Trop tôt pour dire, chacun avec son nombre de questions.
- **Thème** et **Intention** (s’informer, comparer, acheter), quand les questions sont étiquetées.
- **Grouper par** : Aucun, Thème ou Intention. Le tableau se découpe alors en groupes, chacun avec son titre.
- **Nom de la marque** : Toutes, Sans, Avec. Les questions sans le nom disent si l’IA pense à la marque d’elle-même.

**Tout afficher** retire les filtres. Quand un filtre est actif, le volet le signale.

<a id="selection"></a>

## Agir sur plusieurs questions

Chaque ligne a une case à cocher, et **Tout cocher** les coche toutes. Sur les questions cochées :

- **Archiver** : elles ne sont plus relevées et ne comptent plus dans les chiffres ; leur historique reste. Une question jamais relevée est simplement retirée. Une fenêtre demande de confirmer.
- **Changer le thème** : le thème saisi remplace celui des questions cochées. Gratuit ; une étiquette posée à la main n’est plus changée par le modèle.
- **Partir d’une page** (en haut de l’écran) : l’outil lit une page de la marque et propose les questions auxquelles elle répond. Voir [Pages suivies](./pages-suivies.md).
- **Partager** : ouvre l’écran Partages avec ces questions déjà cochées, pour en faire une page privée à envoyer à un client. Voir [Partager avec un client](../piloter/partager-avec-un-client.md).
- **Lancer un relevé pour la sélection** : ces questions seules, aux quatre IA d’interface, au prix écrit sur le bouton (questions × 4 × 0,0012 $). Claude n’est pas compris. Au-dessus du seuil de confirmation, une fenêtre demande de confirmer.

Les questions archivées se montrent avec le lien **Afficher les 2 questions archivées** (le nombre varie), sous le tableau ; leur page permet de reprendre le suivi.

> [!NOTE]
> **Les étiquettes et la carte des thèmes**
>
> Le bouton **Étiqueter les questions** donne à chacune un thème et une intention, par un petit modèle, pour moins d’un centime par projet. Après ce premier clic, les questions ajoutées sont étiquetées toutes seules ; cela se coupe sur ce même écran. Quand des thèmes existent, la **Carte des thèmes** s’affiche sous le tableau : voir [Thèmes et carte des thèmes](../comprendre/themes.md).

<a id="pas-a-pas"></a>

## Trouver les questions à travailler

1. **Choisir une période assez longue.** Dans la barre du haut, 8 semaines ou plus : un verdict sur une seule réponse par IA est souvent « trop tôt pour dire ».

2. **Filtrer les absentes.** **Verdict › Absente**, puis **Nom de la marque › Sans** : ce sont les questions où l’IA ne pense pas à Facturo.

3. **Lire le premier nommé.** Comptalis revient en tête sur plusieurs questions ? C’est le concurrent à étudier. Un clic ouvre les réponses qui le nomment.

4. **Ouvrir une question.** Sa page dit qui gagne, grâce à quelles pages, et ce qu’il faut faire. Voir [La page d’une question](./fiche-question.md).

5. **Trancher les cas douteux.** Une question « occasionnelle » ou « trop tôt pour dire » qui compte pour vous se tranche avec une [mesure approfondie](./mesure-approfondie.md).

<a id="limites"></a>

## Limites

> [!WARNING]
> Avec une réponse par question, par IA et par semaine, un verdict repose sur peu de réponses : « solide » sur cinq réponses n’a pas la portée de « solide » sur quarante. Le seuil de 6 sur 10 est une règle de lecture, pas une mesure de la marge d’erreur, que la page de la question donne. Le premier nommé et le rang viennent de la lecture des réponses par un petit modèle, sauf pour ChatGPT. « Avec le nom de la marque » est déduit du texte de la question.

**Voir aussi**

- [La page d’une question](./fiche-question.md)
- [Thèmes et carte des thèmes](../comprendre/themes.md)
- [Sur quels thèmes suis-je absent alors qu’un concurrent tient la place ?](../cas-usage/themes-ou-je-suis-absent.md)
- [Avec ou sans nom de marque : comment répartir mes questions ?](../cas-usage/questions-avec-ou-sans-marque.md)

---

Mise à jour : 2026-11-20 · [Lire cette page sur le site](https://geotrends.io/documentation/mesurer/questions)
