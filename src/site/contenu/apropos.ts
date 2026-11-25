// Page « À propos » : qui construit l'outil, pourquoi, et où il va.
// Les constats sur le marché viennent d'une étude de vingt outils, faite en novembre 2026.

import { insecables } from '../typo'

const fr = {
  meta: {
    titre: 'À propos : un logiciel libre, construit par Digitiz pour ses propres marques',
    description: 'GeoTrends est le logiciel GEO que Digitiz a construit pour ses marques, puis publié sous licence libre. Pourquoi il existe, pourquoi il est gratuit, ses quatre principes, sa feuille de route.',
  },
  fil: 'À propos',
  titre: 'Construit pour nos marques, [[ouvert à tout le monde.]]',
  chapo: 'GeoTrends est fait par Digitiz, pour suivre ses sites et ses chaînes dans les réponses des IA. Nous le publions sous licence libre : chacun peut l’installer, le lire et l’améliorer. Il n’y a rien à acheter.',
  marge: ['Fait par Digitiz', 'Open source, licence AGPL-3.0', 'Gratuit : vous ne payez que vos relevés', 'En ligne depuis novembre 2026'],
  origine: {
    chapitre: 'D’où il vient',
    titre: 'Nous voulions des chiffres que l’on puisse vérifier.',
    textes: [
      'Digitiz tient un recensement des outils de visibilité dans les IA. Avant d’écrire une ligne de code, nous en avons étudié vingt, fonction par fonction, sur leurs pages publiques.',
      'Le constat tient en trois chiffres. Nous avons donc construit notre outil, pour nos marques, avec une règle : chaque chiffre dit d’où il vient. Puis nous l’avons ouvert : un relevé coûte un dixième de centime, il n’y a pas de raison de le payer au prix d’un abonnement.',
    ],
    constats: [
      ['8 sur 20', 'écrivent clairement qu’ils relèvent l’interface réelle, et pas la réponse d’une API'],
      ['2 sur 20', 'affichent une marge d’erreur à côté de leurs chiffres'],
      ['0 sur 20', 'disent ce que coûte une question suivie'],
    ],
    source: 'Relevé de novembre 2026, sur les pages officielles de chaque outil. Une fonction non vue sur ces pages peut exister.',
  },
  principes: {
    chapitre: 'Quatre principes',
    titre: 'Ce qui ne se discute pas.',
    liste: [
      ['Des données vraies', 'On relève ce que l’internaute voit dans l’interface, pas la réponse de l’API. Quand ce n’est pas possible, c’est écrit à côté du chiffre.'],
      ['Des chiffres fiables', 'Une question est relevée plusieurs fois. On affiche une tendance et son nombre de relevés, pas le bruit du jour.'],
      ['De l’action', 'La liste des pages où apparaître et des corrections à faire. Puis une nouvelle mesure, pour voir si elles ont compté.'],
      ['La France d’abord, pas seulement', 'Les premières questions sont posées en français, depuis la France. Mais le pays et la langue se choisissent projet par projet : rien n’est figé dans l’outil.'],
    ],
  },
  route: {
    chapitre: 'La feuille de route',
    titre: 'Trois temps, dans cet ordre.',
    etapes: [
      { nom: 'Mesurer et compter', etat: 'En service', fait: true, texte: 'Relevés sur cinq IA, réponses et sources conservées, lecture automatique des réponses, relevés automatiques avec leur marge d’erreur, vue d’ensemble, projets par marque avec leurs sites, chaînes et réseaux sociaux, journal des coûts.' },
      { nom: 'Comprendre et agir', etat: 'En service', fait: true, texte: 'Marques nommées à votre place, sources qui montent, thèmes, faits faux, questions perdues, pages où obtenir une mention, audit d’une page, liste de travail avec le suivi des prises de contact, mesure après action, alertes et rapport de la semaine.' },
      { nom: 'Relier aux visites, aller plus loin', etat: 'Prochaine étape', fait: false, texte: 'L’envoi du rapport par e-mail, le lien avec Google Analytics et la Search Console, l’importance de chaque question, un plan de contenu pour une question perdue, puis Perplexity et Copilot.' },
    ],
    lien: 'Le registre complet des fonctions',
    ecran: 'Un projet par marque, avec ses sites, ses chaînes, ses réseaux sociaux, ses concurrents et ses questions.',
  },
  acces: {
    chapitre: 'La licence',
    titre: 'Pas d’abonnement. Le code est ouvert.',
    textes: [
      'GeoTrends s’installe chez vous, avec Docker, en un quart d’heure. Il n’y a ni abonnement, ni essai, ni liste d’attente : le code est sur GitHub, sous licence AGPL-3.0. Vous pouvez l’utiliser, le modifier et le redistribuer. Si vous en faites un service en ligne, vos modifications doivent rester ouvertes, elles aussi.',
      'Sur geotrends.io, le bouton « Se connecter » est celui de l’équipe de Digitiz : cette installation est la nôtre, la vôtre aura sa propre adresse. Les écrans montrés sur ce site sont remplis de données d’exemple. Jamais les résultats d’une marque réelle.',
    ],
  },
  appel: { nom: 'Voir les fonctionnalités' },
}

const en: typeof fr = {
  meta: {
    titre: 'About: open-source software, built by Digitiz for its own brands',
    description: 'GeoTrends is the GEO software Digitiz built for its own brands, then released under an open-source licence. Why it exists, why it is free, its four principles, its roadmap.',
  },
  fil: 'About',
  titre: 'Built for our brands, [[open to everyone.]]',
  chapo: 'GeoTrends is made by Digitiz to track its websites and channels in AI answers. We release it under an open-source licence: anyone can install it, read it and improve it. There is nothing to buy.',
  marge: ['Made by Digitiz', 'Open source, AGPL-3.0 licence', 'Free: you only pay for your readings', 'Online since November 2026'],
  origine: {
    chapitre: 'Where it comes from',
    titre: 'We wanted numbers we could check.',
    textes: [
      'Digitiz keeps a census of AI visibility tools. Before writing a line of code, we studied twenty of them, feature by feature, on their public pages.',
      'The finding fits in three numbers. So we built our own tool, for our brands, with one rule: every number says where it comes from. Then we opened it up: a reading costs a tenth of a cent, and there is no reason to pay a subscription price for it.',
    ],
    constats: [
      ['8 of 20', 'state clearly that they read the real interface, not an API answer'],
      ['2 of 20', 'show a margin of error next to their numbers'],
      ['0 of 20', 'say what one tracked question costs'],
    ],
    source: 'Survey from November 2026, on each tool’s official pages. A feature we did not see on those pages may still exist.',
  },
  principes: {
    chapitre: 'Four principles',
    titre: 'What is not up for debate.',
    liste: [
      ['True data', 'We record what a person sees in the interface, not the API answer. When that is not possible, it is written next to the number.'],
      ['Reliable numbers', 'A question is read several times. We show a trend and its number of readings, not the noise of the day.'],
      ['Action', 'The list of pages to appear on and fixes to make. Then a new measurement, to see whether they counted.'],
      ['France first, not France only', 'The first questions are asked in French, from France. But country and language are chosen project by project: nothing is hard-wired in the tool.'],
    ],
  },
  route: {
    chapitre: 'The roadmap',
    titre: 'Three stages, in this order.',
    etapes: [
      { nom: 'Measure and count', etat: 'Live', fait: true, texte: 'Readings on five AI engines, answers and sources kept, automatic reading of answers, scheduled readings with their margin of error, overview, one project per brand with its websites, channels and social profiles, cost log.' },
      { nom: 'Understand and act', etat: 'Live', fait: true, texte: 'Brands named instead of you, rising sources, topics, wrong facts, lost questions, pages to get mentioned on, page audit, work list with the outreach log, measurement after an action, alerts and weekly report.' },
      { nom: 'Link to visits, go further', etat: 'Next step', fait: false, texte: 'Sending the report by email, the link with Google Analytics and Search Console, the weight of each question, a content plan for a lost question, then Perplexity and Copilot.' },
    ],
    lien: 'The full ledger of features',
    ecran: 'One project per brand, with its websites, channels, social profiles, competitors and questions.',
  },
  acces: {
    chapitre: 'The licence',
    titre: 'No subscription. The code is open.',
    textes: [
      'GeoTrends installs on your own machine, with Docker, in fifteen minutes. There is no subscription, no trial and no waiting list: the code is on GitHub, under the AGPL-3.0 licence. You may use it, modify it and redistribute it. If you turn it into an online service, your changes must stay open too.',
      'On geotrends.io, the “Sign in” button belongs to the Digitiz team: this installation is ours, and yours will have its own address. The screens shown on this site are filled with sample data. Never the results of a real brand.',
    ],
  },
  appel: { nom: 'See the features' },
}

export const apropos = { fr: insecables(fr), en }
