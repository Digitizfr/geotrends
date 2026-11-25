<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Glossaire

> Les mots de GeoTrends en une ligne chacun : question, relevé, méthode, visibilité, part de voix, verdict, marge d’erreur, source, liste de travail, rapport…

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/reference/glossary.md)

Les mots employés dans l’outil et dans cette documentation, avec leur équivalent dans l’interface en anglais. Ils sont rangés par thème. Les définitions sont celles que l’outil applique dans ses calculs.

<a id="mesure"></a>

## La mesure

| Terme | Définition |
| --- | --- |
| **GEO** | Generative Engine Optimization : le travail pour figurer dans les réponses des IA, comme le référencement le fait pour les moteurs de recherche. |
| **Question** (prompt) | Ce qu’un client demanderait à une IA, avec ses mots. Voir [Écrire les questions à suivre](../projet/questions.md). |
| **Relevé** (run, reading) | L’envoi des questions d’un projet aux IA choisies, et, pour chaque question et chaque IA, la réponse enregistrée avec ses sources. |
| **Réponse** (answer) | Le texte rendu par une IA à une question, un jour donné, tel qu’elle l’a écrit. |
| **Méthode** (method) | « Interface » ou « API ». Les deux ne sont jamais additionnées. |
| **Interface** | Relevé de la vraie page de l’IA : ce que voit un internaute. ChatGPT, Gemini, Mode IA et Aperçus IA de Google. |
| **API** | Réponse du modèle seul, par son interface de programmation. C’est le cas de Claude. |
| **Visibilité** (visibility) | Part des réponses reçues où la marque est citée ou nommée, comptée en « k sur n ». |
| **Part de voix** (share of voice) | Mentions de la marque rapportées à celles de la marque et des concurrents suivis. |
| **Rang moyen** (avg. position) | Place moyenne de la marque parmi les marques nommées, quand elle a un rang. |
| **Verdict** | Pour une question : solide (6 réponses sur 10 ou plus), occasionnelle, absente, ou trop tôt pour dire (moins de 3 réponses). |
| **Marge d’erreur** (margin of error) | Plage où la vraie valeur a de bonnes chances de se trouver (intervalle de confiance à 95 %). Voir [Méthode de mesure](./methode.md). |
| **Écart** (change) | Différence en points avec la période d’avant, colorée seulement quand elle dépasse la marge d’erreur. |
| **Réponse comparable** (comparable answer) | Couple question et IA qui a une réponse aux deux dates comparées par le rapport. |
| **Mesure approfondie** (deep measurement) | Une question posée 5, 10 ou 25 fois de suite pour trancher son verdict. Voir [Mesure approfondie](../mesurer/mesure-approfondie.md). |
| **Pas d’aperçu** (no overview) | Google n’a pas affiché d’Aperçu IA sur la question : ce n’est pas une absence de la marque. |

<a id="marque"></a>

## La marque et ses concurrents

| Terme | Définition |
| --- | --- |
| **Projet** (project) | Une marque suivie sur un marché : son pays, sa langue, ce qui lui appartient, ses concurrents et ses questions. |
| **Propriété** (property) | Ce qui appartient à la marque : un site, une chaîne YouTube, un profil social, une autre écriture de son nom. |
| **Citée** (cited) | Une page ou une vidéo de la marque figure parmi les sources de la réponse. |
| **Nommée** (mentioned) | Le nom de la marque est dans le texte de la réponse. |
| **Lue** (read) | Une page de la marque a été ouverte par l’IA sans être citée. Elle ne compte pas comme une présence. |
| **Absente** (absent) | L’IA a répondu sans la marque. |
| **Concurrent suivi** (tracked competitor) | Une marque comparée à la vôtre dans le classement, la part de voix et le face-à-face. |
| **Marque repérée** (brand spotted) | Une marque nommée par les IA sur vos questions, pas encore suivie. **Suivre** en fait un concurrent, gratuitement. |
| **Premier nommé** (named first) | La marque nommée en premier dans une réponse. |
| **Ton** (tone) | Positif (la marque est recommandée), neutre (simplement citée) ou négatif (déconseillée), lu par le petit modèle. |
| **Fait vérifié** (verified fact) | Une phrase que vous tenez pour vraie sur la marque. L’outil signale les réponses qui disent autre chose. Voir [Faits vérifiés](../comprendre/faits-verifies.md). |

<a id="sources"></a>

## Les sources

| Terme | Définition |
| --- | --- |
| **Source** | Page citée ou lue par l’IA pour répondre. |
| **Source citée** (cited source) | Page affichée comme source avec la réponse. Seules les sources citées par les IA d’interface entrent dans les chiffres. |
| **Page lue sans être citée** (read, not cited) | Page ouverte par l’IA et non retenue. Connue pour ChatGPT et Claude. |
| **Type de site** (site type) | Comparatif, média, annuaire, blog, forum ou communauté, vidéo, réseau social, site officiel, boutique, site de marque, autre, ou « à classer ». |
| **À qui** (owner) | À qui profite une citation : à nous, à un concurrent suivi, à une autre marque, ou à un tiers. |
| **Discussion** | Fil de forum ou publication de réseau social cité comme source : un endroit où l’on peut répondre. |
| **Aperçu IA** (AI Overview) | La réponse générée que Google affiche au-dessus de ses résultats. |
| **Mode IA** (AI Mode) | Le mode conversationnel de Google, relevé comme une IA à part. |
| **Dix premiers résultats** (top 10) | Les résultats classiques de Google, relevés avec les Aperçus IA. |
| **Autres questions posées** (People also ask) | Les questions que Google affiche sous ses résultats : des idées de questions à suivre. |
| **Recherches lancées par l’IA** (searches run by the AI) | Ce que l’IA tape elle-même dans un moteur avant de répondre. Connues pour ChatGPT et Claude. |

<a id="outil"></a>

## L’outil

| Terme | Définition |
| --- | --- |
| **Thème** (topic) | Quelques mots qui disent de quoi parle une question, posés par le petit modèle ou à la main. |
| **Intention** (intent) | s’informer, comparer ou acheter. |
| **Carte des thèmes** (topic map) | Pour chaque thème : tenu, disputé, à reprendre, angle mort ou trop tôt pour dire. Voir [Thèmes et carte des thèmes](../comprendre/themes.md). |
| **Liste de travail** (work list) | Les actions tirées des relevés, chacune avec sa preuve. Voir [La liste de travail](../agir/liste-de-travail.md). |
| **Prise de contact** (outreach) | Un message envoyé à un site, noté dans le journal d’une action. |
| **Rapport** (report) | La comparaison des deux derniers jours de relevé. Voir [Rapport et alertes](../piloter/rapport-et-alertes.md). |
| **Alerte** (alert) | Un écart entre les deux derniers relevés qui dépasse la marge d’erreur. |
| **Repère** (marker) | Un trait sur un graphique : changement de modèle d’une IA, action faite, mesure approfondie. |
| **Lecture automatique** (automatic reading) | La lecture des réponses par un petit modèle de langage : marques nommées, rang, ton. |
| **Petit modèle** (small model) | Le modèle de langage peu coûteux qui lit les réponses, classe les sites, étiquette les questions et vérifie les faits. |
| **Journal des coûts** (cost journal) | La liste de chaque appel payant, avec son prix. |
| **Plafond** (cap) | La dépense maximale du mois, tous projets. Une fois atteint, aucun appel payant ne part. |
| **Seuil de confirmation** (confirmation threshold) | Au-dessus de ce montant, un envoi lancé à la main demande une confirmation. |
| **Relevés automatiques** (automatic runs) | Chaque semaine pour les IA d’interface, toutes les deux semaines pour Claude, une fois activés. |

**Voir aussi**

- [Notions clés](../demarrer/notions-cles.md)
- [Méthode de mesure](./methode.md)
- [Les IA suivies](./ia-suivies.md)

---

Mise à jour : 2026-11-18 · [Lire cette page sur le site](https://geotrends.io/documentation/reference/glossaire)
