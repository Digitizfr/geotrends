<!-- Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici. -->

# Ce que coûte un relevé

> Le prix de chaque appel payant, ce qui est gratuit, le plafond du mois et le seuil de confirmation, avec des exemples de budget pour 10 et 50 questions par mois.

[← Sommaire de la documentation](../README.md) · [Read this page in English](../../en/get-started/costs.md)

GeoTrends ne coûte que ce qu’il appelle : chaque relevé et chaque lecture par un petit modèle sont facturés en dollars par le fournisseur, et chacun est inscrit au journal des coûts avec son prix. Le prix d’un envoi est toujours écrit sur son bouton, avant le clic. Aucune dépense ne part sans votre accord, sauf celles que vous avez activées (relevés automatiques, classement des nouveaux sites, étiquetage des nouvelles questions).

<a id="prix"></a>

## Ce qui est payant

| Appel | Prix | Quand |
| --- | --- | --- |
| Relevé d’interface (ChatGPT, Gemini, Mode IA, Aperçus IA) | 0,0012 $ par question et par IA, prix renvoyé par le fournisseur | À chaque relevé, manuel ou automatique |
| Relevé de Claude, par son API | Le prix moyen réellement payé sur les 30 derniers appels réussis (0,06 $ par question tant qu’aucun n’a été mesuré) | Quand Claude est coché, ou toutes les deux semaines s’il est automatique |
| Lecture d’une réponse (marques, rang, ton) | Environ 0,0008 $ par réponse | Toute seule pour les réponses nouvelles ; sur clic pour les autres |
| Comparaison aux faits vérifiés | Environ 0,0006 $ par réponse relue | Sur clic ; ensuite pendant la lecture, sans appel en plus |
| Étiquette d’une question (thème, intention) | Environ 0,00008 $ par question | Sur clic, puis à chaque question ajoutée |
| Type d’un site cité | Environ 0,00005 $ par site, une seule fois par site | Sur clic, puis pour chaque nouveau site |

<a id="gratuit"></a>

## Ce qui est gratuit

- Créer un projet, ajouter des questions, des concurrents, des faits vérifiés.
- Récupérer les réponses d’un relevé : seul l’envoi est facturé.
- Ouvrir n’importe quel écran : tout est lu dans la base.
- La fiche des vidéos YouTube citées, la détection des réseaux sociaux depuis le site, l’audit d’une page, les exports CSV.

<a id="exemples"></a>

## Exemples de budget

| Situation | Calcul | Ordre de grandeur |
| --- | --- | --- |
| Un relevé de 10 questions sur 4 IA d’interface | 40 relevés × 0,0012 $, plus 40 lectures × 0,0008 $ | environ 0,08 $ |
| Une mesure approfondie : une question 10 fois sur 4 IA | 40 relevés × 0,0012 $, plus la lecture | environ 0,08 $ |
| 50 questions chaque semaine, interface seule | 50 × 4 IA × (0,0012 $ + 0,0008 $) × 4,33 semaines | environ 1,75 $ par mois |
| Les mêmes 50 questions à Claude, toutes les deux semaines | 50 × (0,06 $ + 0,0008 $) × 2,17 passages | environ 6,60 $ par mois |

Ces estimations sont celles qu’affiche l’outil : sur l’onglet Relevés d’un projet, à côté de chaque relevé automatique, et sur l’écran Réglages, projet par projet. Claude coûte une cinquantaine de fois plus cher qu’un relevé d’interface : c’est pourquoi il est décoché par défaut et relevé deux fois moins souvent.

<a id="garde-fous"></a>

## Les deux garde-fous

| Réglage | Par défaut | Ce qu’il fait |
| --- | --- | --- |
| **Plafond mensuel** | 20 $ | Quand la dépense du mois l’atteint, plus aucun appel payant ne part : les relevés automatiques se suspendent et un relevé manuel est refusé, jusqu’au mois suivant ou jusqu’à ce que le plafond soit relevé. Il se règle dans **Administration › Coûts**. |
| **Seuil de confirmation** | 1 $ | Au-dessus de ce montant, une fenêtre demande de confirmer l’envoi, en plus du prix écrit sur le bouton. Il se règle dans **Réglages**. |

> [!WARNING]
> Le plafond est vérifié avant l’envoi, pas contre le prix de l’envoi : un relevé lancé juste sous le plafond part, et peut le dépasser. L’onglet Relevés le signale en rouge avant le clic (« Cet envoi dépasserait le plafond du mois »). Les prix des petits modèles et de Claude sont calculés depuis la grille de tarifs quand le fournisseur ne les renvoie pas ; le journal les marque d’un astérisque.

**Voir aussi**

- [Le tableau des coûts](../piloter/couts.md)
- [Relevés automatiques](../projet/releves-automatiques.md)
- [Comment suivre une marque sans dépasser son budget ?](../cas-usage/budget-de-suivi.md)

---

Mise à jour : 2026-11-18 · [Lire cette page sur le site](https://geotrends.io/documentation/demarrer/couts)
