<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Notions clés

> Question, relevé, méthode, présence, visibilité, part de voix, verdict, marge d’erreur : les mots de l’outil et ce qu’ils comptent exactement, avant de lire un écran.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/get-started/key-concepts.md)

GeoTrends emploie peu de mots, toujours dans le même sens. Les connaître évite les deux erreurs les plus courantes : additionner des choses qui ne s’additionnent pas, et lire un écart qui n’est que du hasard.

<a id="projet-et-marque"></a>

## Projet et marque

Un **projet** suit une marque sur un marché : un pays et une langue. Il réunit le nom de la marque, ce qui lui appartient, ses concurrents et ses questions. La même marque sur deux marchés fait deux projets. Le projet affiché se choisit en haut du menu de l’outil.

Une marque ne se limite pas à son site. Ses **propriétés** sont ses sites, ses chaînes YouTube, ses profils sociaux et les autres écritures de son nom. Une page d’un de ces sites, une vidéo d’une de ces chaînes ou une publication d’un de ces profils, citée par une IA, compte pour la marque.

<a id="question-et-releve"></a>

## Question, relevé, réponse

| Mot | Ce qu’il désigne |
| --- | --- |
| **Question** | Ce qu’un client potentiel demande à une IA, avec ses mots : « Quel logiciel de facturation choisir pour un auto-entrepreneur ? ». Une question « sans nom de marque » ne contient pas le nom de la marque suivie. |
| **Relevé** | Une question posée à une IA à un instant donné. On dit aussi « relevé » pour l’envoi de toutes les questions d’un projet à plusieurs IA, le même jour. |
| **Réponse** | Ce que l’IA a répondu, gardé tel quel : son texte, les sources citées, les pages lues, les recherches lancées, les marques nommées dans l’ordre. Le texte n’est jamais traduit ni corrigé. |
| **Source** | Une page citée par l’IA pour répondre. Une page **lue** a été ouverte par l’IA sans être citée : on ne le sait que pour ChatGPT et Claude. |

<a id="methode"></a>

## Méthode : interface ou API

Un **relevé d’interface** ouvre la vraie page de l’IA, pose la question depuis le pays du projet et garde ce qui s’affiche : c’est ce que voit un internaute. ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google sont relevés ainsi. Une **réponse d’API** vient du modèle seul, sans l’application autour : c’est le cas de Claude, interrogé par l’API d’Anthropic avec la recherche web.

> [!NOTE]
> **Jamais additionnées**
>
> Les deux méthodes ne donnent pas les mêmes réponses. Aucun chiffre de l’outil ne les mélange : Claude a toujours sa propre tuile, sa propre colonne, sa propre courbe. Chaque chiffre porte un tampon « interface » ou « API ».

<a id="presence"></a>

## Présence : citée, nommée, lue, absente

Pour chaque réponse reçue, l’outil dit comment la marque y figure. La marque est **présente** quand elle est citée ou nommée.

| État | Définition | Compte comme présente |
| --- | --- | --- |
| **Citée** | Une page ou une vidéo de la marque figure parmi les sources. | oui |
| **Nommée** | Le nom de la marque (ou une de ses autres écritures, ou son domaine) est dans le texte, sans page de la marque citée. | oui |
| **Lue** | Une page de la marque a été lue par l’IA, sans être citée. | non |
| **Absente** | L’IA a répondu sans la marque. | non |
| **Pas d’aperçu** | Google n’a pas affiché d’Aperçu IA (ou l’IA n’a rien affiché). Ce n’est pas une absence : la réponse n’entre pas dans le compte. | hors compte |
| **En attente** | La réponse n’est pas encore revenue. Elle se lit plus tard, gratuitement. | hors compte |
| **Échec** | Le relevé n’a pas abouti, ou la réponse n’est pas arrivée en 6 heures. | hors compte |

<a id="chiffres"></a>

## Les chiffres

| Chiffre | Comment il se calcule |
| --- | --- |
| **Visibilité** | Part des réponses reçues où la marque est présente (citée ou nommée), pour une méthode. Elle s’affiche à partir de 5 réponses. |
| **Part de voix** | Mentions de la marque rapportées à celles de la marque et des concurrents suivis, dans les réponses dont les marques sont lues. Sans concurrent suivi, elle ne se calcule pas. |
| **Rang moyen** | Place moyenne de la marque dans la liste des marques nommées, quand elle y figure. Le 1er est le mieux placé. |
| **Verdict** | Pour une question seule, un mot plutôt qu’un pourcentage : « solide » si la marque est dans 6 réponses d’interface sur 10 ou plus, « occasionnelle » en dessous, « absente » à zéro, « trop tôt pour dire » avec moins de 3 réponses. |

<a id="marge"></a>

## Échantillon et marge d’erreur

Une réponse d’IA est un tirage : la même question posée deux fois ne donne pas la même réponse. Chaque chiffre dit donc sur combien de réponses il repose, et la visibilité porte sa **marge d’erreur** (un intervalle de confiance à 95 %). Un **écart** avec la période d’avant n’est coloré que s’il dépasse cette marge : sinon, il est dans le bruit.

Pour trancher sur une question, la **mesure approfondie** la pose 5, 10 ou 25 fois de suite. Ces relevés comptent pour le verdict de la question, pas dans les chiffres d’ensemble du projet : sinon une question posée 25 fois pèserait 25 fois plus que les autres.

<a id="concurrents"></a>

## Concurrents suivis et marques repérées

Un **concurrent suivi** est une marque que vous avez choisi de comparer à la vôtre : il entre dans le classement, la part de voix et le face-à-face. Une **marque repérée** est une marque que les IA nomment sur vos questions, pas encore suivie. Suivre une marque repérée est gratuit et ne lance aucun relevé.

<a id="lecture"></a>

## La lecture des réponses

ChatGPT renvoie lui-même les marques qu’il nomme. Pour les autres IA, un petit modèle de langage lit chaque réponse et en tire les marques nommées, leur ordre et le ton employé (positif, neutre, négatif). C’est un appel payant, d’environ 0,0008 $ par réponse, inscrit au journal des coûts. Le même petit modèle range les sites cités par type, donne un thème et une intention à chaque question, et compare les réponses aux faits vérifiés.

> [!WARNING]
> Ce que lit le petit modèle peut être faux sur une réponse ambiguë. Chaque fiche renvoie au texte d’origine de la réponse, pour vérifier.

**Voir aussi**

- [Glossaire](../reference/glossaire.md) : Tous les mots de l’outil, en français et en anglais.
- [Méthode de mesure](../reference/methode.md)
- [Lire ses premiers résultats](./premiers-resultats.md)
- [Ma marque est-elle citée, nommée ou absente ?](../cas-usage/citee-nommee-ou-absente.md)

---

Mise à jour : 2026-11-18 · [Lire cette page sur le site](https://geotrends.io/documentation/demarrer/notions-cles)
