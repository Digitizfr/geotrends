<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Méthode de mesure

> Comment l’outil compte : présence de la marque, seuils, verdict, marge d’erreur, écarts réels, périodes, méthodes séparées, et ce que la mesure ne dit pas.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/reference/method.md)

Une réponse d’IA est un échantillon : la même question, posée deux fois, ne donne pas la même réponse. Un chiffre sans méthode ni nombre de relevés ne dit donc rien. Cette page décrit les règles que l’outil applique partout, telles qu’elles sont écrites dans son code. La page publique [Méthode](https://geotrends.io/methode) en donne la version courte.

<a id="etats"></a>

## D’un envoi à une réponse

Chaque question envoyée à une IA devient un relevé. Il revient quelques minutes plus tard avec l’un de ces états. Seules les réponses reçues entrent dans les chiffres.

| État | Ce qu’il veut dire | Dans les chiffres |
| --- | --- | --- |
| Reçu | La réponse est là, avec ses sources. | Compté, que la marque y soit ou non. |
| Pas d’aperçu, sans réponse | L’IA n’a rien affiché. Le cas courant : Google n’affiche pas d’Aperçu IA pour cette question. Ou Claude a décliné la question. | Écarté. Ce n’est pas une absence de la marque. |
| En attente | La question est partie, la réponse n’est pas revenue. Sa lecture est gratuite et se fait toute seule. | Pas encore. |
| Échec | Le relevé n’a pas abouti : refus du fournisseur, ou aucune réponse au bout de six heures. | Écarté. Le relevé est à refaire. |

<a id="presence"></a>

## Quand la marque est-elle présente ?

| État | Règle |
| --- | --- |
| **Citée** | Une source citée est une page d’un site de la marque (sous-domaines compris), une page sous un de ses profils sociaux déclarés, ou une vidéo d’une de ses chaînes YouTube. |
| **Nommée** | Le nom de la marque, ou une de ses autres écritures déclarées, figure dans le texte comme un mot entier, sans tenir compte des majuscules. Le nom de domaine du site compte aussi. Ou la lecture automatique lui donne un rang parmi les marques nommées. |
| **Lue** | Une page ou une vidéo de la marque a été ouverte par l’IA sans être citée. La marque n’est alors pas comptée comme présente. |
| **Absente** | L’IA a répondu sans la marque. |

La **visibilité** est la part des réponses reçues où la marque est citée ou nommée. Elle se compte toujours en « k sur n » : k réponses avec la marque, sur n réponses reçues.

<a id="indicateurs"></a>

## Part de voix et rang

- **Part de voix** : les mentions de la marque, rapportées à celles de la marque et des concurrents suivis, dans les réponses dont les marques sont lues. Sans concurrent suivi, elle vaudrait toujours 100 % : elle n’est pas calculée.
- **Rang** : la place de la marque parmi les marques nommées dans une réponse, dans leur ordre d’apparition, chaque marque comptée une fois. Le **rang moyen** est la moyenne des rangs connus ; plus il est petit, mieux c’est.
- **Premier nommé** : la marque nommée en premier dans une réponse.

<a id="seuils"></a>

## Les seuils

| Seuil | Valeur | Effet |
| --- | --- | --- |
| Chiffre affiché | 5 réponses | En dessous, aucun pourcentage : l’écran écrit « À partir de 5 relevés » et donne le compte seul. |
| Verdict d’une question | 3 réponses | En dessous, « Trop tôt pour dire ». |
| Solide | 60 % ou plus | La marque est dans au moins 6 réponses d’interface sur 10. |
| Occasionnelle | Entre 0 et 60 % | La marque est présente, moins de 6 fois sur 10. |
| Absente | 0 | Aucune réponse avec la marque, sur 3 réponses ou plus. |
| Écart jugé | 5 réponses de chaque côté | En dessous, l’écart est marqué « trop peu de relevés ». |

La carte des thèmes suit les mêmes seuils : un thème est **Tenu** quand la marque est dans 6 réponses sur 10 ou plus et qu’aucune autre marque n’y est nommée plus souvent, **À reprendre** quand la marque en est absente et qu’une autre marque est nommée dans 3 réponses sur 10 ou plus, **Angle mort** quand personne n’atteint ce niveau, **Trop tôt pour dire** sous 5 réponses lues. Voir [Thèmes et carte des thèmes](../comprendre/themes.md).

<a id="marge"></a>

## La marge d’erreur

Autour de chaque visibilité, l’outil calcule un intervalle de confiance à 95 % (méthode de Wilson) : la plage où la vraie valeur a de bonnes chances de se trouver. Il s’affiche dans les bulles d’aide (« entre … et … ») et en bande grise sur les graphiques. Deux points dont les bandes se recouvrent ne se distinguent pas.

| Réponses | Visibilité mesurée | Marge d’erreur |
| --- | --- | --- |
| 20 | 50 % | Entre 30 et 70 % : assez pour un verdict, pas pour un pourcentage. |
| 1 000 | 50 % | À trois points près. |

<a id="ecart"></a>

## Quand un écart est-il réel ?

Un écart compare deux parts : avant (k₁ sur n₁) et après (k₂ sur n₂). Il s’écrit en points. L’outil le juge ainsi :

1. Si l’un des deux côtés a moins de 5 réponses : « trop peu de relevés ».
2. Sinon, la marge vaut 1,96 × √( p₁(1 − p₁)/n₁ + p₂(1 − p₂)/n₂ ), où p₁ et p₂ sont les deux parts.
3. Si l’écart ne dépasse pas cette marge : « dans la marge », en gris. Sinon : une hausse ▲ ou une baisse ▼, en couleur.

> [!NOTE]
> **Un exemple**
>
> Facturo passe de 2 réponses sur 10 à 5 sur 10 : l’écart est de 30 points. La marge vaut environ 40 points : l’écart est « dans la marge ». Avec le même passage de 20 % à 50 % sur 50 réponses de chaque côté, la marge tombe à 18 points, et la hausse est réelle.

<a id="periodes"></a>

## Périodes et comparaisons

- **Période** : 7 jours, 4 semaines, 8 semaines (par défaut), 3 mois (12 semaines). L’écart compare à la période de même durée juste avant. Avec **Tout l’historique** ou **Dernier relevé seul**, il n’y a pas de période d’avant.
- **Dernier relevé seul** garde, pour chaque question, la réponse la plus récente de chaque IA.
- **Jour de relevé** : les relevés d’un même jour, à l’heure de Paris, forment un point des graphiques.
- **Rapport et alertes** : les deux derniers jours de relevé, sur les seuls couples question et IA qui ont une réponse aux deux dates, avec la dernière réponse du jour.
- **Mesure après une action** : les quatre semaines qui précèdent l’action, ce jour compris, contre tous les relevés des jours suivants.

<a id="methodes"></a>

## Interface et API, jamais additionnées

Un chiffre qui mêle les deux méthodes ne mesure plus rien. Toute fonction qui compte ne reçoit que des relevés d’une seule méthode. Les chiffres d’ensemble portent sur les quatre IA d’interface ; Claude, interrogé par son API, a sa colonne, sa courbe et sa ligne du rapport. Seul l’écran Faits vérifiés relit les deux ensemble, parce qu’il ne mesure pas une part : il cherche des phrases fausses, et chaque ligne dit sa méthode.

<a id="approfondie"></a>

## Mesures approfondies

Une mesure approfondie pose une question 5, 10 ou 25 fois de suite. Ses relevés comptent pour le verdict de cette question, et pour sa courbe. Ils n’entrent ni dans les chiffres d’ensemble, ni dans le grand graphique, ni dans le rapport : sinon, une question posée vingt-cinq fois pèserait vingt-cinq fois plus que les autres. Un repère signale leur jour sur les graphiques.

<a id="petit-modele"></a>

## Ce que lit le petit modèle

Certaines informations ne sont pas dans la réponse brute. Un petit modèle de langage (DeepSeek Flash aujourd’hui) les lit dans le texte. Chaque lecture est un appel payant, inscrit au journal des coûts ; une correction à la main l’emporte toujours.

| Lecture | Ce qu’elle tire | Prix moyen |
| --- | --- | --- |
| Lecture des réponses | Les marques nommées, dans l’ordre, et le ton employé pour chacune (positif, neutre, négatif), pour toutes les IA. Pour ChatGPT, elle remplace la liste du fournisseur une fois faite. | 0,0008 $ par réponse |
| Classement des sites | Le type de chaque site cité (comparatif, média, blog…) et, pour un site de marque, sa marque. Une fois par site, gardé pour tous les projets. | 0,00005 $ par site |
| Étiquettes des questions | Un thème de quelques mots et une intention : s’informer, comparer, acheter. | 0,00008 $ par question |
| Vérification des faits | Les phrases d’une réponse qui contredisent un fait vérifié sur la marque. | 0,0006 $ par réponse |

« Avec ou sans le nom de la marque » ne passe pas par le modèle : il se déduit du texte de la question, ce qui est plus sûr.

<a id="ne-dit-pas"></a>

## Ce que la mesure ne dit pas

- **Ce que voit une personne connectée.** Les relevés partent d’une session neutre, sans historique.
- **Combien de gens posent la question.** Aucune IA ne publie ce qu’on lui demande : l’outil n’affiche aucun volume.
- **Pourquoi un chiffre a bougé.** L’outil dit si un écart dépasse la marge d’erreur, pas sa cause. Les repères de changement de modèle et d’action faite aident à faire la part des choses.
- **Ce qu’affiche l’application Claude.** Claude est interrogé par son API.
- **Les pages lues par Gemini et par Google.** Seuls ChatGPT et Claude les donnent.
- **Une lecture sans erreur.** Le petit modèle peut se tromper sur une réponse ambiguë : chaque fiche renvoie au texte d’origine.

> [!WARNING]
> Et une chose que personne ne sait : comment être cité à coup sûr. L’outil mesure, vous corrigez, il mesure de nouveau. Avec une réponse par question et par IA chaque semaine, il faut plusieurs semaines pour qu’un écart devienne lisible.

**Voir aussi**

- [Mesure approfondie](../mesurer/mesure-approfondie.md)
- [Rapport et alertes](../piloter/rapport-et-alertes.md)
- [Les IA suivies](./ia-suivies.md)
- [Un chiffre a bougé : vraie évolution ou bruit ?](../cas-usage/evolution-ou-bruit.md)

---

Mise à jour : 2026-11-18 · [Lire cette page sur le site](https://geotrends.io/documentation/reference/methode)
