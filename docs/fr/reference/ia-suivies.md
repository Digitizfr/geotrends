<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Les IA suivies

> ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google sont relevés dans leur interface, Claude par son API. Ce que contient chaque relevé, et les IA absentes.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/reference/ai-engines.md)

GeoTrends suit cinq IA, avec deux méthodes. Quatre sont relevées dans leur **interface** : un service ouvre la vraie page de l’IA, pose la question depuis le pays du projet, dans sa langue, et renvoie ce qui s’affiche. La cinquième, Claude, n’a pas de relevé d’interface : elle est interrogée par son **API**, la réponse du modèle seul. Les deux méthodes ne sont jamais additionnées.

| IA | Méthode | Comment elle est relevée | Ce que le relevé contient |
| --- | --- | --- | --- |
| **ChatGPT** | interface | Par DataForSEO, depuis le pays du projet, sans forcer la recherche web : on veut ce qu’un internaute obtient. | Le texte, les sources citées, les pages lues sans être citées, les marques nommées, les recherches lancées par l’IA, le modèle. |
| **Gemini** | interface | Par DataForSEO, depuis le pays du projet. | Le texte, les sources citées, le modèle. Les marques sont lues par l’analyse automatique. |
| **Mode IA de Google** | interface | Par DataForSEO, sur la page de Google en Mode IA. | Le texte et ses sources. Pas de nom de modèle. |
| **Aperçus IA de Google** | interface | Par DataForSEO, sur la page de résultats classique de Google, sur ordinateur, Aperçus affichés en différé compris. | Le texte de l’Aperçu et ses sources, les dix premiers résultats de Google, les « autres questions posées ». « Pas d’aperçu » quand Google n’en affiche pas. |
| **Claude** | API | Par l’API d’Anthropic, recherche web activée (cinq recherches au plus par question), avec le pays du projet comme lieu approximatif. | Le texte, les sources citées, les pages trouvées sans être citées, les recherches lancées, le modèle. |

<a id="interface-ou-api"></a>

## Interface ou API

Ce que voit un internaute n’est pas ce que renvoie l’API. Une étude publiée par Surfer en 2026 trouve environ un quart de recoupement sur les marques nommées, et quelques pour cent sur les sources. C’est pourquoi l’outil relève l’interface partout où un service le permet. Pour Claude, aucun service ne relève l’application : son chiffre est un repère sur le modèle, pas un relevé de l’application.

Partout dans l’outil, Claude a sa propre colonne, séparée par un filet double, son propre graphique en pointillé et sa propre ligne dans le rapport. Son tampon dit **API**, celui des autres dit **interface**.

<a id="ce-que-chaque-ia-donne"></a>

## Ce que chaque IA donne, et ce qu’elle ne donne pas

- **Les marques nommées** : ChatGPT renvoie lui-même sa liste. Pour les autres, un petit modèle les lit dans le texte, avec leur rang et le ton employé.
- **Les pages lues sans être citées** et **les recherches lancées par l’IA** : connues pour ChatGPT et pour Claude. Gemini et Google ne les donnent pas.
- **Les dix premiers résultats de Google** et les **autres questions posées** : relevés avec les Aperçus IA. Ce sont eux qui permettent le diagnostic de l’écran Aperçus IA et Google.
- **Le lien de contrôle** : quand le fournisseur le donne, la page d’une question propose **Reposer la question dans l’interface**, pour voir la réponse du moment.

<a id="modeles"></a>

## Les modèles

Quand l’IA le donne, le modèle qui a répondu est écrit sous chaque réponse, et sous le nom de l’IA dans le tableau **Présence, IA par IA**. Quand le modèle change d’un jour de relevé au suivant, un repère se pose sur les graphiques : une hausse ou une baisse ce jour-là peut venir de là. Le Mode IA et les Aperçus IA de Google ne donnent pas de nom de modèle.

<a id="delais"></a>

## Délais et prix

|  | Relevé d’interface | Claude par son API |
| --- | --- | --- |
| Retour de la réponse | Quelques minutes, 45 au plus. La lecture du résultat est gratuite. Sans réponse au bout de six heures, le relevé passe en échec. | Dans la foulée de l’envoi, en une à deux minutes par lot. |
| Prix | 0,0012 $ par réponse, renvoyé par le fournisseur. Pour les Aperçus IA, un supplément de 0,0006 $ pour les Aperçus affichés en différé, remboursé s’il n’y en a pas. | Calculé depuis la grille de tarifs (jetons et recherches web). L’outil affiche la moyenne de ses trente derniers relevés, 0,06 $ tant qu’aucun n’a été mesuré. |

<a id="non-suivies"></a>

## Les IA qui ne sont pas suivies

**Perplexity et Copilot ne sont pas suivis.** Ils demandent un second fournisseur de relevés d’interface, qui n’est pas branché. L’application Claude n’est pas relevée non plus, faute de service : seule son API l’est. Aucune autre IA n’est relevée.

<a id="choisir"></a>

## Choisir les IA d’un relevé

1. **Partir des quatre IA d’interface.** Elles sont cochées par défaut dans l’onglet Relevés de la fiche du projet, et ce sont elles qui font la visibilité de la vue d’ensemble.

2. **Ajouter Claude si le repère vous sert.** Il coûte bien plus cher par question. Il est décoché par défaut, et le rythme conseillé est toutes les deux semaines.

3. **Masquer une IA à la lecture.** Les pastilles de la barre du haut masquent une IA dans les chiffres et les graphiques, sans rien effacer.

<a id="limites"></a>

## Limites

> [!WARNING]
> Les relevés partent d’une session neutre, sans historique ni compte : une personne connectée, avec ses habitudes, peut obtenir une autre réponse. Les services de relevé dépendent des interfaces des IA : quand une interface change, un relevé peut échouer quelque temps, et l’outil l’inscrit comme un échec, sans le compter.

**Voir aussi**

- [Méthode de mesure](./methode.md)
- [Lancer un relevé](../projet/lancer-un-releve.md)
- [Aperçus IA et résultats de Google](../comprendre/google.md)
- [Quelles IA regarder en premier, et pourquoi Claude est-il à part ?](../cas-usage/quelles-ia-regarder.md)

---

Mise à jour : 2026-11-18 · [Lire cette page sur le site](https://geotrends.io/documentation/reference/ia-suivies)
