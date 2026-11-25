# Captures d'écran de la documentation

Ce dossier produit les images de l'outil qui illustrent la documentation publique :
de **vraies captures** de GeoTrends, remplies de **données fictives**, en français
et en anglais.

## La commande

```
npm run captures
```

(ou `bash scripts/demo/tout.sh`, qui fait exactement la même chose).

Compter **environ 5 minutes** (mesuré le 18/11/2026 : 5 min 06 s), et une minute de plus
la première fois, le temps d'installer les dépendances dans le dossier de travail.
Le port 3020 doit être libre, et PostgreSQL doit tourner sur le Mac.

## Quand la relancer

Après **tout changement visible de l'outil** : un écran, un libellé, une couleur,
le menu, **le logo**. Les images ne se mettent pas à jour toutes seules. Il suffit
de relancer la commande : la documentation reprend les nouvelles images au même
endroit, sous les mêmes noms.

Les dates des relevés suivent le jour du lancement (le dernier relevé est toujours
le lundi le plus récent) : les écrans ont l'air à jour. Tous les autres chiffres
restent les mêmes d'une fois sur l'autre.

## Ce que fait la commande

1. Elle copie le projet dans un dossier de travail **hors de Google Drive**
   (`/private/tmp/geotrends-demo`), sans les clés ni le fichier `.env`.
2. Elle remplit une base locale à part, **`geotrends_demo`** (jamais la base de
   travail `geotrends_dev`, jamais la base en ligne) : `semer.ts`.
3. Elle démarre l'outil sur le port 3020, se connecte avec le compte de
   démonstration et photographie chaque écran : `captures.ts`.
4. Elle convertit les images en WebP et écrit le manifeste, puis arrête l'outil.

## Où vont les fichiers

- `public/docs/captures/fr/<nom>.webp` : l'outil en français, projet « Facturo » (France).
- `public/docs/captures/en/<nom>.webp` : l'outil en anglais, projet « Facturo UK » (Royaume-Uni).
- `public/docs/captures/manifeste.json` : pour chaque image, son adresse, sa largeur,
  sa hauteur et l'écran photographié.

Les noms sont fixes (la documentation s'y réfère) : `vue`, `questions`, `question`,
`reponses`, `concurrents`, `sources`, `videos`, `google`, `actions`,
`actions-resultats`, `faits`, `rapport`, `audit`, `projets`, `projet-nouveau`,
`projet`, `projet-questions`, `projet-releves`, `reglages`, `couts`, `connexion`,
et des gros plans : `vue-courbe`, `vue-alertes`, `question-presence`,
`question-colonnes`, `action-fiche`, `faits-contradictions`, `reglages-rythme`,
`projet-prix`, `projet-nouveau-recap`.

Les images sont nettes sur un écran Retina : 2880 × 1800 pixels pour un écran entier
(deux fois la fenêtre de 1440 × 900), environ 2264 pixels de large pour un gros plan.

## Deux retouches, et seulement deux

- **Réglages** : la démonstration tourne sans aucune clé, donc l'écran dirait « Clé
  absente » partout. Les pastilles sont remises dans l'état de l'outil en service :
  clés en place, sauf Resend (l'envoi du rapport par e-mail n'est pas encore branché).
- **Champs de date** : le navigateur sans fenêtre est réglé en anglais américain
  (« 10/12/2026 », le mois d'abord). Les dates des champs sont écrites jour/mois/année,
  comme dans un navigateur français ou britannique.

Rien d'autre n'est modifié : tout le reste est l'écran tel que l'outil l'affiche.

## La règle : uniquement des données fictives

- La marque **Facturo**, ses concurrents (**Comptalis**, **Devizo**, **Tikette**,
  **Billbox**) et toutes les autres marques sont inventés.
- Tous les sites cités ont un domaine en **`.exemple`**, qui n'existe pas.
  Les vidéos YouTube ont des identifiants inventés : leurs miniatures s'affichent
  en gris, c'est normal.
- Aucune donnée de Digitiz, aucun vrai relevé, aucune vraie marque. Ne jamais
  copier la base de travail dans la base de démonstration.
- **Aucun appel payant** : aucune clé n'est copiée, le script refuse de tourner
  s'il en trouve une, et aucun bouton d'envoi n'est cliqué. Le seul appel extérieur
  est l'audit d'une page de geotrends.io (lecture gratuite).

## Le compte de démonstration

`demo@geotrends.exemple`, mot de passe `demo-facturo-2026` (dans `compte.ts`).
Ce mot de passe est public et sans valeur : il n'ouvre que la base de démonstration
locale. Ce compte n'existe pas en ligne.

## Changer les données ou ajouter une capture

- Les questions, les réponses, les sites et les vidéos : `contenu-fr.ts` et
  `contenu-en.ts`. Les présences de la marque semaine par semaine sont écrites dans
  le champ `plan` de chaque question ; le script vérifie qu'elles donnent les
  chiffres annoncés dans `cibles`.
- La façon dont les réponses sont écrites et rangées en base : `semer.ts`.
- La liste des écrans photographiés : le tableau `CAPTURES` de `captures.ts`.
  Pour refaire seulement quelques images (outil déjà construit, base déjà remplie) :
  `npx tsx scripts/demo/captures.ts --sortie <projet>/public/docs/captures --seulement vue,questions`
  depuis le dossier de travail.

## L'histoire que racontent les données

Huit relevés hebdomadaires (ChatGPT, Gemini, Mode IA et Aperçus IA de Google), Claude
toutes les deux semaines. Facturo part de loin (19 % des réponses la première semaine)
et monte à 45 % : il y a cinq semaines, l'équipe a obtenu une place dans le comparatif
de comparatif-logiciels.exemple, et la hausse dépasse la marge d'erreur. Comptalis reste
la marque la plus nommée, Tikette monte depuis trois semaines, deux réponses répètent
un prix faux (19 € au lieu de 9 €), ChatGPT lit des pages de Facturo sans les citer,
une question n'a jamais d'Aperçu IA, ChatGPT change de modèle il y a trois semaines,
et une question a été mesurée 25 fois d'affilée.
