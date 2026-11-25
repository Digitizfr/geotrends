<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Questions fréquentes

> GEO, interface ou API, relevés répétés, absence de note sur 100, vidéos YouTube, Aperçus IA absents, coûts, Claude à part : les réponses courtes aux questions courantes.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/get-started/faq.md)

<a id="le-principe"></a>

## Le principe

<a id="geo"></a>

### Qu’est-ce que le GEO ?

Le GEO (Generative Engine Optimization) est le travail qui vise à faire figurer une marque dans les réponses des IA : ChatGPT, Gemini, Claude, le Mode IA et les Aperçus IA de Google. Il ressemble au référencement, avec une différence : l’IA ne renvoie pas une liste de liens, elle écrit une réponse qui nomme quelques marques et cite quelques pages. GeoTrends mesure cette présence, dit qui est cité à sa place et quoi corriger.

<a id="garantie"></a>

### L’outil garantit-il d’être cité ?

Non. Personne ne sait obtenir une citation à coup sûr, et l’outil ne le promet pas. Il mesure, il propose des actions tirées des relevés, puis il mesure de nouveau et dit si l’écart dépasse le bruit. Voir [Mesurer après une action](../agir/mesure-apres-action.md).

<a id="gratuit"></a>

### GeoTrends est-il gratuit ? Comment l’obtenir ?

Oui. C’est un logiciel libre, sous licence AGPL-3.0 : il n’y a ni abonnement ni inscription chez nous. Vous l’installez sur votre ordinateur ou votre serveur, vous y collez vos propres clés d’API, et vous ne payez que vos relevés, directement aux fournisseurs. Voir [Installer GeoTrends](./installer.md).

<a id="la-mesure"></a>

## La mesure

<a id="interface-api"></a>

### Quelle différence entre un relevé d’interface et une réponse d’API ?

Un relevé d’interface ouvre la vraie page de l’IA, pose la question depuis le pays du projet et garde ce qui s’affiche, sources comprises : c’est ce que voit un internaute. Une réponse d’API vient du modèle seul, sans l’application autour. Les deux ne donnent pas les mêmes marques ni les mêmes sources. Voir [Les IA suivies](../reference/ia-suivies.md).

<a id="claude"></a>

### Pourquoi Claude est-il compté à part ?

Parce qu’aucun service ne relève l’interface de Claude : il est interrogé par l’API d’Anthropic, avec la recherche web. Sa réponse est celle du modèle, pas celle de l’application. Ajouter ses réponses à celles de l’interface mélangerait deux mesures différentes : Claude a donc sa tuile, sa colonne et sa courbe, jamais additionnées aux autres.

<a id="repetition"></a>

### Pourquoi poser plusieurs fois la même question ?

Parce qu’une réponse d’IA est un tirage : la même question posée deux fois ne nomme pas les mêmes marques. Un seul relevé ne prouve ni une présence ni une absence. Les relevés réguliers donnent une série, et la [mesure approfondie](../mesurer/mesure-approfondie.md) pose une question 5, 10 ou 25 fois de suite pour trancher.

<a id="note"></a>

### Pourquoi pas de note sur 100 ?

Parce qu’une note mélange des choses qui ne se comparent pas (des IA, des méthodes, des questions) et cache sur combien de réponses elle repose. L’outil donne une visibilité par méthode, avec son nombre de réponses et sa marge d’erreur, et pour une question seule un verdict : solide, occasionnelle, absente, ou trop tôt pour dire.

<a id="pourcentage"></a>

### Pourquoi un pourcentage manque-t-il parfois ?

Sous 5 réponses, un pourcentage ne voudrait rien dire : l’écran écrit « À partir de 5 relevés » à la place, ou le compte seul (« 2 sur 4 »). Pour une question, le verdict demande au moins 3 réponses.

<a id="sans-apercu"></a>

### Que veut dire « Pas d’aperçu » ?

Que Google n’a pas affiché d’Aperçu IA pour cette question ce jour-là. Ce n’est pas une absence de la marque : ce relevé n’entre pas dans le calcul de la visibilité, qui ne compte que les réponses reçues. L’écran Aperçus IA et Google la classe « Pas d’Aperçu : à ne pas travailler pour Google ».

<a id="youtube"></a>

### Une vidéo YouTube compte-t-elle pour ma marque ?

Oui, si sa chaîne est déclarée dans le projet. Chaque vidéo citée par une IA est rattachée à la chaîne qui l’a publiée ; si cette chaîne appartient à la marque, la citation compte pour la marque, et non pour youtube.com. Il en va de même pour une publication sous un profil social déclaré (LinkedIn, Instagram…). Voir [Sites, chaînes YouTube et réseaux sociaux](../projet/sites-chaines-reseaux.md).

<a id="traduction"></a>

### Les réponses sont-elles traduites ?

Non. Les questions sont posées dans la langue du projet, et le texte des réponses est gardé tel que l’IA l’a écrit, sans traduction ni correction. La langue de l’interface (français ou anglais) se choisit dans les Réglages et ne change rien aux questions. Voir [Pays et langues](../reference/pays-et-langues.md).

<a id="les-couts"></a>

## Les coûts

<a id="prix"></a>

### Combien coûte un relevé ?

0,0012 $ par question et par IA relevée par l’interface, environ 0,06 $ par question pour Claude, et environ 0,0008 $ par réponse pour la lecture. Dix questions sur quatre IA d’interface coûtent environ 0,08 $, lecture comprise. Le prix est écrit sur le bouton avant l’envoi. Voir [Ce que coûte un relevé](./couts.md).

<a id="plafond"></a>

### Que se passe-t-il quand le plafond du mois est atteint ?

Plus aucun appel payant ne part : les relevés automatiques se suspendent d’eux-mêmes, et un relevé manuel est refusé. Les écrans restent consultables, gratuitement. Le plafond, 20 $ par défaut, se change dans Administration, Coûts.

<a id="perimetre"></a>

## Le périmètre

<a id="perplexity"></a>

### Peut-on suivre Perplexity ou Copilot ?

Pas aujourd’hui. Les IA suivies sont ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google par l’interface, et Claude par son API. Perplexity et Copilot ne sont pas relevés.

<a id="visites"></a>

### Peut-on voir les visites venues des IA ?

Non. Google Analytics et la Search Console ne sont pas reliés à l’outil : il mesure la présence dans les réponses, pas le trafic qu’elle apporte.

**Voir aussi**

- [Notions clés](./notions-cles.md)
- [Méthode de mesure](../reference/methode.md)
- [Quelles IA regarder en premier, et pourquoi Claude est-il à part ?](../cas-usage/quelles-ia-regarder.md)

---

Mise à jour : 2026-11-25 · [Lire cette page sur le site](https://geotrends.io/documentation/demarrer/questions-frequentes)
