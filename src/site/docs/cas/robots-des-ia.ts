// Cas d'usage : vérifier qu'une page peut être lue par les robots des IA.
import type { PageDoc } from '../types'

const page: PageDoc = {
  id: 'cas/robots-des-ia',
  rubrique: 'technique-et-budget',
  slug: { fr: 'robots-des-ia', en: 'can-ai-crawlers-read-my-page' },
  titre: {
    fr: 'Les robots des IA peuvent-ils lire ma page ?',
    en: 'Can AI crawlers read my page?',
  },
  resume: {
    fr: 'Un audit gratuit d’une page : ce que le robots.txt autorise, ce que le serveur répond aux robots des IA, le texte lisible sans JavaScript et ce qui gêne la citation.',
    en: 'A free audit of one page: what robots.txt allows, what the server answers to AI crawlers, the text readable without JavaScript, and what hinders citation.',
  },
  ecrans: ['/audit', '/actions', '/sources'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'La page tarifs de facturo.exemple n’est jamais citée, ni même lue, alors qu’elle répond exactement à « Combien coûte un logiciel de facturation ? ». Avant de la réécrire, il faut écarter une cause plus bête : les robots des IA n’y ont peut-être pas accès, ou n’y trouvent rien à lire.' },
      { type: 'h2', id: 'il-vous-faut', texte: 'Ce qu’il vous faut' },
      {
        type: 'liste',
        items: [
          'L’adresse complète d’une page publique. L’audit la lit directement : aucun appel payant, rien à installer.',
          'Si la page est à vous, un accès au site ou à son hébergeur pour corriger ce que l’audit trouve.',
        ],
      },
      { type: 'h2', id: 'etapes', texte: 'Étapes' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Lancer l’audit',
            texte: 'Ouvrez **Audit d’une page**, collez l’adresse dans **Adresse de la page**, puis **Auditer la page**. Depuis **Actions**, le lien **Auditer cette page** et, sur **Sources**, onglet **Nos pages**, le lien **Auditer** remplissent l’adresse pour vous.',
          },
          {
            titre: 'Lire le résumé',
            texte: 'Quatre chiffres en tête : **Robots d’IA autorisés** (sur les douze robots vérifiés), **Mots sans JavaScript**, **Points bloquants** et **Points à revoir**. Une phrase dit si quelque chose empêche les IA de lire la page.',
            capture: 'audit',
          },
          {
            titre: 'Vérifier robot par robot',
            texte: 'Le tableau **Robot par robot** donne, pour chaque robot, à quoi il sert, la **Règle du site** tirée du robots.txt (autorisé ou bloqué) et la **Réponse du serveur**. Cette réponse est testée pour les robots de recherche de ChatGPT, de Claude, de Perplexity et de Google, en se présentant sous leur nom. Un serveur qui répond 200 à un navigateur mais refuse ces robots signale un pare-feu ou un hébergeur qui les bloque, même si le robots.txt les autorise.',
          },
          {
            titre: 'Corriger les points bloquants',
            texte: 'Les **Points bloquants** empêchent une IA de lire ou de reprendre la page : robots de recherche interdits par le robots.txt ou refusés par le serveur, page qui ne répond pas 200, balise qui interdit l’indexation ou les extraits, texte presque absent sans JavaScript. Ils se corrigent en premier.',
          },
          {
            titre: 'Revoir le reste',
            texte: 'Les **Points à revoir** ne bloquent pas la lecture, mais rendent la page moins facile à citer : pas de titre principal ou plusieurs, peu de sous-titres, peu de texte sans JavaScript, pas de données structurées, une date absente ou ancienne, une adresse de référence qui pointe ailleurs. D’autres lignes sont données pour information : listes et tableaux, auteur, robots d’entraînement, fichier llms.txt (rien ne prouve que les IA s’en servent).',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'Ce que ça permet de décider' },
      { type: 'p', texte: 'Si le problème est technique, à confier à la personne qui gère le site, ou éditorial, à traiter en réécrivant la page. Bloquer les robots d’entraînement (GPTBot, ClaudeBot, Google-Extended) est un choix possible : cela n’empêche pas d’être cité. Bloquer les robots de recherche, si.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Avant d’agir',
        texte: 'L’audit dit ce qui empêche une page d’être lue, pas si elle sera citée. Il lit une seule page à la fois, sans parcourir le site. Le test de la réponse du serveur part de notre serveur, sous le nom de chaque robot : un pare-feu qui vérifie aussi l’adresse d’origine peut traiter le vrai robot autrement. Les robots d’entraînement ne sont vérifiés que dans le robots.txt.',
      },
      {
        type: 'liens',
        titre: 'Voir aussi',
        items: [
          { page: 'agir/audit' },
          { page: 'reference/ia-suivies' },
          { page: 'cas/page-lue-pas-citee' },
          { page: 'cas/citee-nommee-ou-absente' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'The pricing page on facturo.exemple is never cited, nor even read, although it answers exactly “How much does invoicing software cost?”. Before rewriting it, rule out a simpler cause: AI crawlers may not have access to it, or may find nothing to read there.' },
      { type: 'h2', id: 'what-you-need', texte: 'What you need' },
      {
        type: 'liste',
        items: [
          'The full address of a public page. The audit reads it directly: no paid call, nothing to install.',
          'If the page is yours, access to the site or its host to fix what the audit finds.',
        ],
      },
      { type: 'h2', id: 'steps', texte: 'Steps' },
      {
        type: 'etapes',
        items: [
          {
            titre: 'Run the audit',
            texte: 'Open **Page audit**, paste the address into **Page address**, then **Audit the page**. From **Actions**, the **Audit this page** link and, on **Sources**, tab **Our pages**, the **Audit** link fill in the address for you.',
          },
          {
            titre: 'Read the summary',
            texte: 'Four numbers at the top: **AI crawlers allowed** (out of the twelve crawlers checked), **Words without JavaScript**, **Blocking issues** and **Points to review**. A sentence says whether anything prevents AIs from reading the page.',
            capture: 'audit',
          },
          {
            titre: 'Check crawler by crawler',
            texte: 'The **Crawler by crawler** table gives, for each crawler, what it is for, the **Site rule** taken from robots.txt (allowed or blocked) and the **Server response**. The response is tested for the search crawlers of ChatGPT, Claude, Perplexity and Google, presenting itself under their name. A server that answers 200 to a browser but refuses these crawlers points to a firewall or host blocking them, even if robots.txt allows them.',
          },
          {
            titre: 'Fix the blocking issues',
            texte: '**Blocking issues** prevent an AI from reading or reusing the page: search crawlers disallowed by robots.txt or refused by the server, a page that does not answer 200, a tag forbidding indexing or snippets, almost no text without JavaScript. Fix them first.',
          },
          {
            titre: 'Review the rest',
            texte: '**Points to review** do not block reading, but make the page harder to cite: no main heading or several, few subheadings, little text without JavaScript, no structured data, a missing or old date, a canonical address pointing elsewhere. Other lines are given for information: lists and tables, author, training crawlers, the llms.txt file (nothing proves AIs use it).',
          },
        ],
      },
      { type: 'h2', id: 'decision', texte: 'The decision it supports' },
      { type: 'p', texte: 'Whether the problem is technical, for whoever runs the site, or editorial, to be handled by rewriting the page. Blocking training crawlers (GPTBot, ClaudeBot, Google-Extended) is a legitimate choice: it does not prevent citations. Blocking search crawlers does.' },
      {
        type: 'encadre',
        ton: 'limite',
        titre: 'Before you act',
        texte: 'The audit says what prevents a page from being read, not whether it will be cited. It reads one page at a time, without crawling the site. The server response test runs from our server, under each crawler’s name: a firewall that also checks the source address may treat the real crawler differently. Training crawlers are only checked in robots.txt.',
      },
      {
        type: 'liens',
        titre: 'See also',
        items: [
          { page: 'agir/audit' },
          { page: 'reference/ia-suivies' },
          { page: 'cas/page-lue-pas-citee' },
          { page: 'cas/citee-nommee-ou-absente' },
        ],
      },
    ],
  },
}

export default page
