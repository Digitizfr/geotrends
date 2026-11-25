<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Mesure approfondie

> Poser une même question 5, 10 ou 25 fois de suite pour trancher son verdict et resserrer la marge d’erreur, sans fausser les chiffres d’ensemble du projet.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/measure/deep-measurement.md)

Une réponse d’IA est un tirage : posée dix fois, la même question ne donne pas dix fois les mêmes marques. Au rythme d’un relevé par semaine, il faut des mois pour qu’une question réunisse assez de réponses pour un verdict sûr. La mesure approfondie pose la question plusieurs fois de suite, le même jour, pour trancher tout de suite : la marque est-elle vraiment absente de cette question, avant d’y passer du temps ?

Pour y aller : le bloc **Mesure approfondie**, sur la page de la question, sous l’évolution. Il n’existe pas pour une question archivée. En tête du bloc, le tampon « interface » et le nombre de relevés déjà faits ainsi, ou « jamais lancée ». Quand une question a entre 3 et 19 réponses, la phrase de son en-tête rappelle que la marge reste large et que la mesure approfondie la resserre.

<a id="reglages"></a>

## Ce qu’on choisit

- **Nombre de fois** : 5 fois, 10 fois (le choix par défaut) ou 25 fois.
- **IA relevées par l’interface** : ChatGPT, Gemini, Mode IA et Aperçus IA, toutes cochées au départ, chacune avec le nombre de réponses déjà reçues sur cette question (« 3 déjà »). Claude n’est pas proposé : la mesure approfondie ne se fait que par l’interface.

Dessous, le calcul s’écrit en clair et se met à jour à chaque choix : « 10 fois × 4 IA = 40 envois, à 0,0012 $ l’envoi : 0,0480 $ ». La ligne suivante donne la dépense du mois après l’envoi face au plafond, et ce qu’ajoutera la lecture automatique des réponses (environ 0,0008 $ par réponse). Le bouton porte le prix : **Lancer la mesure approfondie : 0,0480 $**.

> [!NOTE]
> **Confirmation et plafond**
>
> Au-dessus du seuil de confirmation (1 $ par défaut, réglable dans Réglages), une fenêtre récapitule les IA et le nombre d’envois avant de partir : **Confirmer l’envoi**. Si le plafond du mois est déjà atteint, le bloc l’écrit et le bouton reste grisé. Si l’envoi doit seulement le dépasser, un avertissement s’affiche en rouge.

<a id="marge"></a>

## Ce que la marge d’erreur y gagne

La marge d’erreur se resserre avec le nombre de réponses. Pour une marque présente dans la moitié des réponses, l’outil donne, à 95 % de confiance :

| Réponses d’interface sur la question | La vraie part est entre |
| --- | --- |
| 4 | 15 % et 85 % |
| 10 | 24 % et 76 % |
| 20 | 30 % et 70 % |
| 40 | 35 % et 65 % |
| 100 | 40 % et 60 % |

Une mesure de 10 fois sur 4 IA ajoute 40 réponses d’un coup : assez pour qu’un verdict « absente » ou « solide » se lise sans hésiter.

<a id="comptage"></a>

## Comment ces relevés comptent

- **Pour la question, oui** : son verdict, sa marge d’erreur, sa présence IA par IA et son évolution se recalculent avec toutes les réponses de la période, mesures approfondies comprises.
- **Dans les chiffres d’ensemble, non** : la vue d’ensemble, les concurrents, les sources, la ligne « Présente dans » de l’écran Questions, la carte des thèmes, le rapport et la liste des réponses les laissent de côté. Sinon, une question posée vingt-cinq fois pèserait vingt-cinq fois plus que les autres.
- **Un repère sur la courbe** : le grand graphique de la vue d’ensemble marque le jour de la mesure, sans la compter dans la courbe.
- **Une marque sur la réponse** : chaque réponse ainsi relevée porte l’étiquette « mesure approfondie », et la page de la question les parcourt une à une (« Réponse 2 sur 10 ce jour-là »).

<a id="pas-a-pas"></a>

## Trancher une question

1. **Choisir la bonne question.** Une question qui compte pour Facturo et dont le verdict est « occasionnelle » ou « trop tôt pour dire ». Inutile sur une question déjà solide.

2. **Régler la mesure.** 10 fois sur les quatre IA, ou 25 fois sur une seule IA si c’est elle qui vous intéresse.

3. **Lire le prix et lancer.** Le prix est sur le bouton. Confirmez si la fenêtre s’ouvre.

4. **Attendre le retour.** Les réponses reviennent en quelques minutes par la collecte habituelle ; la page se met à jour toute seule et le verdict se recalcule.

5. **Décider.** Absente sur 40 réponses : la question est perdue, la liste de travail dit pourquoi. Solide : passez à une autre.

<a id="limites"></a>

## Limites

> [!WARNING]
> Poser la question le même jour mesure la réponse de ce jour : si l’IA change de modèle ou de sources la semaine suivante, le verdict peut changer. Les réponses d’une même série se ressemblent plus entre elles que des réponses espacées de plusieurs semaines. Claude ne se mesure pas ainsi. Chaque envoi est payé : 25 fois sur 4 IA coûte 0,1200 $ par question, plus la lecture.

**Voir aussi**

- [La page d’une question](./fiche-question.md)
- [Méthode de mesure](../reference/methode.md)
- [Un chiffre a bougé : vraie évolution ou bruit ?](../cas-usage/evolution-ou-bruit.md)

---

Mise à jour : 2026-11-18 · [Lire cette page sur le site](https://geotrends.io/documentation/mesurer/mesure-approfondie)
