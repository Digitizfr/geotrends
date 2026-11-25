import type { CleEcran } from '../composants/Maquettes'
import type { Famille } from '../i18n'
import { insecables } from '../typo'

/*
 * Les fonctions du produit, rangées par famille, avec leur état réel.
 * « pret: true » = en service aujourd'hui dans l'outil. Tout le reste est en
 * construction et doit être décrit au futur. Mettre à jour ce fichier à chaque
 * étape livrée : le registre, les pages de famille et les compteurs en dépendent.
 */
export const FONCTIONS = [
  { id: 'projets', famille: 'mesurer', pret: true, ecran: 'projet' },
  { id: 'releves', famille: 'mesurer', pret: true, ecran: 'liste' },
  { id: 'reponse', famille: 'mesurer', pret: true, ecran: 'question' },
  { id: 'sources', famille: 'mesurer', pret: true },
  { id: 'presence', famille: 'mesurer', pret: true, ecran: 'proprietes' },
  { id: 'youtube', famille: 'mesurer', pret: true },
  { id: 'reseaux', famille: 'mesurer', pret: true },
  { id: 'apercus', famille: 'mesurer', pret: true },
  { id: 'approfondie', famille: 'mesurer', pret: true },
  { id: 'pagesSuivies', famille: 'mesurer', pret: true },

  { id: 'marques', famille: 'comprendre', pret: true, ecran: 'concurrents' },
  { id: 'sites', famille: 'comprendre', pret: true, ecran: 'sources' },
  { id: 'evolution', famille: 'comprendre', pret: true },
  { id: 'top10', famille: 'comprendre', pret: true, ecran: 'apercus' },
  { id: 'recherches', famille: 'comprendre', pret: true, ecran: 'recherches' },
  { id: 'chaines', famille: 'comprendre', pret: true, ecran: 'chaines' },
  { id: 'idees', famille: 'comprendre', pret: true },
  { id: 'lecture', famille: 'comprendre', pret: true },
  { id: 'themes', famille: 'comprendre', pret: true },
  { id: 'faits', famille: 'comprendre', pret: true, ecran: 'faits' },

  { id: 'perdues', famille: 'agir', pret: true, ecran: 'perdues' },
  { id: 'pages', famille: 'agir', pret: true },
  { id: 'lues', famille: 'agir', pret: true },
  { id: 'video', famille: 'agir', pret: true },
  { id: 'audit', famille: 'agir', pret: true, ecran: 'audit' },
  { id: 'liste', famille: 'agir', pret: true, ecran: 'actions' },
  { id: 'contacts', famille: 'agir', pret: true },
  { id: 'apres', famille: 'agir', pret: true, ecran: 'apres' },

  { id: 'couts', famille: 'piloter', pret: true, ecran: 'couts' },
  { id: 'lancer', famille: 'piloter', pret: true, ecran: 'lancer' },
  { id: 'planifies', famille: 'piloter', pret: true },
  { id: 'marge', famille: 'piloter', pret: true, ecran: 'marge' },
  { id: 'tendances', famille: 'piloter', pret: true, ecran: 'vue' },
  { id: 'alertes', famille: 'piloter', pret: true },
  { id: 'rapport', famille: 'piloter', pret: true, ecran: 'rapport' },
  { id: 'exports', famille: 'piloter', pret: true },
  { id: 'partage', famille: 'piloter', pret: true },
  { id: 'libre', famille: 'piloter', pret: true },
  { id: 'courriel', famille: 'piloter', pret: false },
  { id: 'visites', famille: 'piloter', pret: false },
  { id: 'moteurs', famille: 'piloter', pret: false },
] as const satisfies readonly { id: string; famille: Famille; pret: boolean; ecran?: CleEcran }[]

export type IdFonction = (typeof FONCTIONS)[number]['id']
export type Fonction = { id: IdFonction; famille: Famille; pret: boolean; ecran?: CleEcran }

export const fonctionsDe = (famille: Famille): Fonction[] => FONCTIONS.filter((f) => f.famille === famille)
export const compte = (liste: readonly { pret: boolean }[]) => ({ prets: liste.filter((f) => f.pret).length, total: liste.length })
/** Numéro d'une fonction dans le registre : la numérotation court d'une famille à l'autre. */
export const numero = (id: IdFonction) => String(FONCTIONS.findIndex((f) => f.id === id) + 1).padStart(2, '0')

type Texte = {
  nom: string
  /** Une phrase, pour le registre. */
  quoi: string
  /** Ce que fait la fonction, pour la page de sa famille. */
  detail: string
  /** La décision qu'elle permet de prendre. */
  decision: string
  /** Limite ou précision honnête. */
  limite?: string
  /** Note écrite sous l'écran. */
  noteEcran?: string
}

const fr: Record<IdFonction, Texte> = {
  // ── Mesurer ──
  projets: {
    nom: 'Création de projets',
    quoi: 'Un projet par marque : son nom, ses sites, ses chaînes YouTube, ses concurrents, ses questions, le pays et la langue.',
    detail: 'Un projet suit une marque. On y déclare son nom, ses sites, ses chaînes YouTube, ses concurrents et les questions de ses clients, avec le pays d’où elles sont posées et leur langue. Seul le nom est obligatoire, le reste se complète ensuite. Une question déjà relevée ne se modifie plus : on l’archive, et son historique reste.',
    decision: 'Dire à l’outil ce qui appartient à la marque. Sans cela, une vidéo de sa chaîne compterait pour youtube.com, donc pour quelqu’un d’autre.',
    limite: 'Les profils de la marque sur les réseaux sociaux peuvent être détectés depuis son site. Les marques que les IA nomment à votre place sont proposées sur l’écran des concurrents, et les « autres questions posées » de Google sur l’écran Google : un clic suffit pour les suivre.',
  },
  releves: {
    nom: 'Relevés sur cinq IA',
    quoi: 'ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google sont relevés dans leur interface. Claude est interrogé par son API, et c’est écrit à côté de chaque chiffre.',
    detail: 'L’outil pose chaque question du projet à cinq IA. Quatre sont relevées dans leur interface : un service ouvre la vraie page, pose la question depuis le pays visé et renvoie ce qui s’affiche. Claude n’a pas de relevé d’interface. Il est interrogé par l’API d’Anthropic, recherche web activée.',
    decision: 'Savoir sur quelles IA la marque existe, question par question, sans confondre ce que voit l’internaute avec ce que répond un modèle seul.',
    limite: 'ChatGPT est relevé sans forcer la recherche web. On veut ce qu’un internaute obtient, pas une réponse provoquée.',
  },
  reponse: {
    nom: 'Réponse complète conservée',
    quoi: 'Chaque réponse est gardée telle quelle, avec sa date et le modèle qui l’a écrite. Chaque question ouvre les réponses complètes, avec leurs sources.',
    detail: 'Chaque relevé garde le texte entier de la réponse, sa date, le nom du modèle quand l’IA le donne, et la réponse brute du fournisseur. Un chiffre s’ouvre toujours sur les réponses qui le composent.',
    decision: 'Vérifier soi-même avant d’agir, et montrer la réponse exacte à un rédacteur ou à un partenaire. La réponse brute permet aussi de refaire une analyse sans repayer le relevé.',
  },
  sources: {
    nom: 'Sources citées et pages lues',
    quoi: 'Les pages que l’IA cite, et celles qu’elle a ouvertes sans les retenir. Les deux ne se corrigent pas de la même façon.',
    detail: 'L’outil tient deux listes séparées. Les sources citées sont les pages que l’IA affiche à l’appui de sa réponse, avec leur rang. Les pages lues sont celles qu’elle a ouvertes pendant sa recherche sans les retenir.',
    decision: 'Une page lue mais pas citée est déjà trouvée : il faut la reformuler. Une page jamais lue a d’abord un problème de référencement.',
    limite: 'Les pages lues sont connues pour ChatGPT et pour Claude. Gemini et Google ne les donnent pas.',
  },
  presence: {
    nom: 'Trois niveaux de présence',
    quoi: 'Votre site est cité, une de vos vidéos est citée, ou seul votre nom apparaît dans le texte.',
    detail: 'Pour chaque réponse, l’outil dit comment la marque apparaît. Son site est cité comme source, une vidéo de sa chaîne est citée, ou son nom figure dans le texte sans aucun lien. Les trois ne valent pas la même chose et ne se travaillent pas pareil.',
    decision: 'Savoir d’où vient la visibilité, donc où mettre l’effort : écrire, filmer, ou faire parler de la marque ailleurs.',
  },
  youtube: {
    nom: 'Chaînes YouTube comptées',
    quoi: 'Une vidéo de votre chaîne citée par une IA compte pour votre marque, pas pour youtube.com.',
    detail: 'Chaque vidéo YouTube citée par une IA est rattachée à sa chaîne, avec son titre et son audience. Si la chaîne appartient à la marque, la citation compte pour la marque. L’outil garde aussi le moment précis de la vidéo que l’IA a retenu, quand l’adresse le porte.',
    decision: 'Ne pas croire la marque absente alors qu’une de ses vidéos est citée. Et refaire ce qui marche : même sujet, même format, en soignant le passage retenu.',
  },
  reseaux: {
    nom: 'Réseaux sociaux de la marque',
    quoi: 'LinkedIn, Instagram, X, TikTok… Une page citée sous un profil de la marque compte pour la marque.',
    detail: 'Un projet déclare aussi les profils de la marque : LinkedIn, Instagram, Facebook, X, TikTok, Pinterest, Threads, Bluesky, GitHub. Un bouton les détecte en lisant la page d’accueil du site (ses liens et son balisage sameAs), chaînes YouTube comprises. Il propose, vous choisissez : un site affiche souvent aussi des comptes personnels. Une page citée sous l’un de ces profils compte ensuite comme une page de la marque.',
    decision: 'Ne pas compter pour un tiers une citation qui vient de votre propre page LinkedIn.',
    limite: 'La détection écarte les boutons de partage et les liens vers une publication isolée.',
  },
  apercus: {
    nom: 'Suivi des Aperçus IA',
    quoi: 'Google affiche-t-il un aperçu pour la question ? Y figurez-vous ? Une question sans aperçu n’est pas comptée comme une absence.',
    detail: 'Pour chaque question, l’outil note si Google affiche un Aperçu IA et si la marque y figure. Une question sans aperçu revient en statut « vide » : elle sort du calcul au lieu de compter comme une absence. Le Mode IA est suivi à part.',
    decision: 'Ne pas travailler une question où Google n’affiche jamais d’aperçu, et ne pas noircir un chiffre avec des absences qui n’en sont pas.',
  },

  approfondie: {
    nom: 'Mesure approfondie',
    quoi: 'Une question posée 5, 10 ou 25 fois de suite, pour trancher un doute dans l’heure.',
    detail: 'Sur la fiche d’une question, un bouton la repose plusieurs fois de suite sur les IA choisies, prix affiché avant l’envoi. Ces relevés comptent pour le verdict de la question, pas dans les chiffres d’ensemble : sinon une question posée 25 fois pèserait 25 fois plus que les autres.',
    decision: 'Savoir si une présence est solide ou occasionnelle avant d’y passer du temps.',
    limite: 'Environ 0,12 $ pour 25 relevés sur les quatre IA d’interface.',
  },

  // ── Comprendre ──
  pagesSuivies: {
    nom: 'Pages suivies',
    quoi: 'Partir d’un article ou d’une page produit : les IA la citent-elles, et sur quelles questions ?',
    detail: 'Vous collez l’adresse d’une page de la marque. L’outil la lit, propose les questions qu’un internaute poserait et auxquelles elle répond (à garder, retoucher ou compléter à la main), puis, après le relevé, dit IA par IA si les réponses la citent, et quelles pages sont citées à sa place.',
    decision: 'Savoir si un article sponsorisé ou une page clé ressort dans les IA, et ce qu’il faut battre.',
    limite: 'Une page n’est mesurée que sur les questions qu’on lui donne.',
  },
  marques: {
    nom: 'Marques nommées à votre place',
    quoi: 'Qui les IA recommandent sur vos questions, et dans quel ordre, pour les cinq IA.',
    detail: 'L’outil liste les marques que les IA nomment sur vos questions, compte les réponses où chacune apparaît et note l’ordre dans lequel elles sont citées. Les marques souvent nommées que vous n’aviez pas en tête ressortent d’elles-mêmes.',
    decision: 'Découvrir le concurrent que les IA recommandent vraiment, et distinguer « absent » de « nommé en dernier ».',
    limite: 'ChatGPT donne lui-même les marques de sa réponse. Pour les autres IA, elles sont tirées du texte par la lecture automatique. Une marque souvent nommée se suit d’un clic : elle entre alors dans la part de voix.',
  },
  sites: {
    nom: 'Sites les plus cités',
    quoi: 'Les comparatifs, médias et annuaires qui reviennent d’une question à l’autre : ce sont eux qui écrivent la réponse.',
    detail: 'Tous les relevés sont réunis pour classer les sites qui reviennent d’une question à l’autre. Chaque site cité est rangé une fois par un petit modèle : comparatif, média, blog, forum, annuaire, site de marque, site officiel, boutique. L’outil dit aussi à qui profite chaque citation : à vous, à un concurrent suivi, à une autre marque ou à un tiers. Un type se corrige à la main.',
    decision: 'Savoir où il faut figurer avant de savoir quoi écrire.',
  },
  evolution: {
    nom: 'Sources qui montent et qui descendent',
    quoi: 'D’un relevé à l’autre : les sources nouvelles, perdues, en hausse et en baisse.',
    detail: 'L’écran des sources compare le dernier jour de relevé au précédent, sur les mêmes questions : sites et pages cités pour la première fois, perdus, en plus forte hausse et en plus forte baisse. Une source n’est pas déclarée perdue parce qu’une question n’a pas été reposée.',
    decision: 'Repérer le nouveau comparatif qui prend la place, avant qu’il s’installe.',
  },
  top10: {
    nom: 'Aperçu IA contre les dix premiers de Google',
    quoi: 'Hors des dix premiers résultats, le frein est le référencement. Dedans mais pas cité, c’est la page qu’il faut reformuler.',
    detail: 'Le relevé d’un Aperçu IA contient aussi les résultats classiques de la même recherche. L’outil compare les deux : quelles sources de l’aperçu sont dans les dix premiers, et où se trouve votre page.',
    decision: 'Hors des dix premiers, le frein est le référencement. Dans les dix premiers mais pas cité, c’est la page qu’il faut reformuler.',
  },
  recherches: {
    nom: 'Recherches lancées par les IA',
    quoi: 'Ce que l’IA tape elle-même dans un moteur avant de répondre. Ce sont les sujets pour lesquels écrire.',
    detail: 'Avant de répondre, une IA lance souvent ses propres recherches dans un moteur. L’outil les relève telles quelles et compte leur fréquence. Elles sont souvent plus précises que la question posée : une année, un type de comparatif, un métier.',
    decision: 'Écrire pour ces recherches. Ce sont elles qui décident des pages lues, donc des pages citées.',
    limite: 'Disponible pour ChatGPT et pour Claude. Gemini et Google ne donnent pas leurs recherches.',
  },
  chaines: {
    nom: 'Chaînes citées à votre place',
    quoi: 'Les vidéos que les IA retiennent sur vos sujets, avec leur chaîne et leurs vues.',
    detail: 'Les vidéos citées sur vos questions sont regroupées par chaîne, avec leurs vues et le nombre de réponses où elles apparaissent. Vos chaînes sont mises à part : une carte par chaîne déclarée, même jamais citée, puis les autres chaînes.',
    decision: 'Voir si la vidéo compte sur votre marché, et repérer un créateur à contacter pour un test ou une vidéo commune.',
  },
  idees: {
    nom: 'Idées de questions',
    quoi: 'Les « autres questions posées » que Google affiche sous les vôtres, à ajouter au suivi.',
    detail: 'Sous ses résultats, Google affiche les « autres questions posées » et des recherches associées. L’outil les récupère avec chaque relevé et les propose comme questions à suivre.',
    decision: 'Suivre les questions que les gens posent vraiment, pas celles qu’on imagine.',
  },
  lecture: {
    nom: 'Lecture automatique de chaque réponse',
    quoi: 'Rang de chaque marque et ton employé, pour toutes les IA.',
    detail: 'Un petit modèle de langage lit chaque réponse relevée et en tire la même fiche sur toutes les IA : les marques nommées, leur rang et le ton employé pour chacune. Le même modèle range chaque site cité par type. Les nouvelles réponses sont lues d’elles-mêmes, les anciennes d’un clic, et la réponse brute reste gardée : une lecture se refait sans repayer le relevé.',
    decision: 'Comparer les cinq IA sur les mêmes critères, au lieu de ne lire que celle qui donne ses marques.',
    limite: 'Environ 0,001 $ par réponse lue, inscrit au journal des coûts comme tout appel payant.',
  },
  themes: {
    nom: 'Thèmes et carte des thèmes',
    quoi: 'Chaque question reçoit un thème et une intention. La carte dit quels thèmes vous tenez, et lesquels vous échappent.',
    detail: 'Le petit modèle donne à chaque question un thème et une intention : s’informer, comparer, acheter. « Avec ou sans nom de marque » se déduit du texte de la question, sans modèle. Les questions se groupent par thème, et une carte range chacun : tenu, disputé, à reprendre, ou angle mort quand personne ne le tient. Un thème se corrige à la main.',
    decision: 'Choisir où mettre l’effort du mois, et lire la visibilité sur les questions sans nom de marque : ce sont elles qui amènent de nouveaux clients.',
  },
  faits: {
    nom: 'Faits faux sur la marque',
    quoi: 'Vous écrivez vos faits vérifiés (prix, offre, pays). L’outil signale les réponses qui disent autre chose, et la source en cause.',
    detail: 'Vous écrivez cinq à vingt faits vérifiés par marque : un prix, une offre, une date, un pays. Un petit modèle compare à cette liste chaque réponse qui nomme la marque, et signale celles qui disent autre chose : la phrase en cause, et la source citée à l’appui quand il y en a une. Chaque contradiction devient une ligne de la liste de travail. Une fausse alerte s’écarte d’un clic.',
    decision: 'Savoir quelle page corriger chez vous, ou quel site prévenir.',
  },

  // ── Agir ──
  perdues: {
    nom: 'Questions perdues',
    quoi: 'Pour chaque question où vous êtes absent : qui est cité, et grâce à quelles pages.',
    detail: 'L’écran des questions isole celles où la marque est absente. La fiche de chacune montre qui est cité à sa place, sur quelles IA, et grâce à quelles pages : les marques les plus nommées, les pages citées par deux IA ou plus, et vos pages lues sans être citées.',
    decision: 'Comprendre pourquoi on perd, question par question, au lieu de regarder une moyenne.',
  },
  pages: {
    nom: 'Pages où apparaître',
    quoi: 'Les pages tierces citées sur vos questions, sans vous, classées par nombre de réponses.',
    detail: 'L’outil classe les pages tierces citées sur vos questions, sans vous, par nombre de réponses et d’IA où elles apparaissent. Chaque ligne porte le type du site. Les sites de marque sont écartés : on ne demande pas une place chez un rival. Les comparatifs, les médias et les annuaires passent devant.',
    decision: 'Savoir à qui écrire en premier : ce comparatif, cet annuaire, ce média.',
  },
  lues: {
    nom: 'Vos pages lues mais pas citées',
    quoi: 'L’IA les a déjà trouvées : il leur manque la bonne réponse. Les corrections les plus rentables.',
    detail: 'La liste de vos pages qu’une IA a ouvertes sans les retenir, ou que Google classe dans ses dix premiers résultats sans que l’Aperçu IA les cite. Elles arrivent en tête de la liste de travail.',
    decision: 'Commencer par les corrections les plus rentables : la page est déjà trouvée, il lui manque la bonne réponse.',
  },
  video: {
    nom: 'Occasions vidéo',
    quoi: 'Les questions où les IA citent des vidéos alors que vous n’en avez aucune sur le sujet.',
    detail: 'L’outil liste les questions où les IA citent des vidéos alors qu’aucune ne vient de vos chaînes, avec les vidéos citées à votre place, leur chaîne et leur audience.',
    decision: 'Choisir les prochains sujets de tournage sur des faits, pas sur une intuition.',
  },
  audit: {
    nom: 'Audit d’une page',
    quoi: 'Les robots des IA peuvent-ils la lire ? Texte présent sans JavaScript, données structurées, date, auteur.',
    detail: 'Vous saisissez l’adresse d’une page. L’outil la lit comme le font les robots des IA : règles du fichier robots.txt pour douze robots, réponse réelle du serveur aux robots de recherche, texte présent sans JavaScript, balise robots, titres, listes et tableaux, données structurées, date et auteur. Chaque point est classé bon, à revoir ou bloquant.',
    decision: 'Savoir si le blocage est technique avant de réécrire le contenu.',
  },
  liste: {
    nom: 'Liste de travail unique',
    quoi: 'Tout ce qui précède dans une seule liste, classée selon le nombre de réponses et d’IA concernées, avec un état et une preuve par ligne.',
    detail: 'Pages à reformuler, pages où apparaître, vidéos à tourner, référencement à travailler, faits faux à corriger : tout est dans une seule liste, classée selon le nombre de réponses et d’IA concernées. Chaque ligne a un état (à faire, en cours, fait, écarté) et renvoie aux réponses qui la justifient. Elle garde aussi une note libre et le journal des prises de contact : à qui vous avez écrit, quand, et ce qui est revenu.',
    decision: 'Savoir quoi faire lundi matin.',
  },
  contacts: {
    nom: 'Suivi des prises de contact',
    quoi: 'Pour chaque page visée : à qui vous avez écrit, quand, et ce qui est revenu.',
    detail: 'Chaque ligne de la liste de travail garde une note libre et un journal des démarches : demande d’ajout, proposition de test, réponse dans un fil, demande de correction, relance. Chaque démarche porte sa date et la réponse reçue : en attente, favorable, refus ou sans réponse.',
    decision: 'Ne pas relancer deux fois le même site, et voir quelles démarches marchent.',
  },
  apres: {
    nom: 'Mesure après action',
    quoi: 'Quatre semaines après une correction, l’outil compare avant et après et dit si l’écart dépasse le bruit.',
    detail: 'Quand une action passe à « fait », l’outil garde la date et pose un repère sur la courbe. Il compare ensuite la présence de la marque sur les questions concernées, avant et après cette date, et dit en clair si l’écart dépasse la marge d’erreur ou non. Le résultat se lit à tout moment ; il est marqué provisoire avant quatre semaines.',
    decision: 'Savoir ce qui marche vraiment, et arrêter ce qui ne marche pas.',
    limite: 'L’outil dira si l’écart est réel, pas s’il vient de l’action. Un changement de modèle ou un concurrent peuvent jouer aussi.',
  },

  // ── Piloter ──
  couts: {
    nom: 'Coût de chaque appel',
    quoi: 'Chaque relevé est inscrit avec son prix, par IA et par projet, sous un plafond mensuel qui suspend les envois.',
    detail: 'Chaque appel à une API payante est inscrit au moment où il part : fournisseur, IA, projet, prix, durée, réussite ou échec. Le tableau de bord en tire la dépense du jour et du mois, par IA et par projet. Un plafond mensuel suspend les relevés quand il est atteint.',
    decision: 'Régler le nombre de questions et le rythme en connaissant le prix, et ne jamais découvrir une facture.',
  },
  lancer: {
    nom: 'Lancer un relevé depuis l’outil',
    quoi: 'Un bouton sur la page du projet. Le prix de chaque IA est affiché avant l’envoi, et le plafond du mois est vérifié.',
    detail: 'Sur la page du projet, un tableau liste les cinq IA avec leur méthode, le prix d’une question et le prix pour toutes les questions du projet. On coche les IA voulues, puis on lance. Claude, plus cher, est décoché par défaut. La dépense du mois et le plafond sont rappelés sous le tableau, et rien ne part si le plafond est atteint.',
    decision: 'Décider d’un relevé en voyant son prix, IA par IA, avant de payer.',
  },
  planifies: {
    nom: 'Relevés automatiques',
    quoi: 'Chaque semaine pour ChatGPT, Gemini et Google. Toutes les deux semaines pour Claude, plus cher à interroger.',
    detail: 'Les relevés partent seuls dès qu’on les active dans la page du projet : chaque semaine pour ChatGPT, Gemini, le Mode IA et les Aperçus IA, toutes les deux semaines pour Claude, plus cher à interroger. Ils s’arrêtent d’eux-mêmes quand le plafond du mois est atteint.',
    decision: 'Avoir des séries régulières, donc des courbes qui veulent dire quelque chose.',
  },
  marge: {
    nom: 'Marge d’erreur affichée',
    quoi: 'Pour une question seule, l’écran dit « solide », « occasionnelle » ou « absente » plutôt qu’un pourcentage trompeur.',
    detail: 'Chaque chiffre porte sa méthode et son nombre de relevés. La visibilité affiche sa marge d’erreur, la courbe la trace en bande grise, et un écart n’est coloré que s’il la dépasse. Pour une question seule, où les relevés sont peu nombreux, l’écran dit « solide », « occasionnelle » ou « absente » plutôt qu’un pourcentage. Pour trancher, une mesure approfondie pose la question 5, 10 ou 25 fois de suite, au prix affiché avant l’envoi.',
    decision: 'Ne pas réagir à un écart qui n’est que du bruit.',
  },
  tendances: {
    nom: 'Tendances',
    quoi: 'La visibilité par IA et les marques nommées, relevé après relevé, avec un repère le jour où une IA change de modèle.',
    detail: 'La vue d’ensemble trace la visibilité de chaque IA dans le temps, avec la bande de la marge d’erreur. L’écran des concurrents trace les marques nommées. Chaque courbe porte un repère le jour où une IA change de modèle, le jour où une action est terminée et le jour d’une mesure approfondie. La courbe de Claude est tracée à part.',
    decision: 'Ne pas attribuer à votre travail une hausse ou une chute due à un nouveau modèle.',
    limite: 'Le rang moyen se lit sur la période choisie : il n’a pas encore sa courbe.',
  },
  alertes: {
    nom: 'Alertes au-dessus du bruit',
    quoi: 'Une alerte quand une présence disparaît ou qu’une marque s’installe. Jamais pour le bruit du jour.',
    detail: 'La vue d’ensemble signale ce qui a changé entre les deux derniers jours de relevé : questions gagnées ou perdues, IA qui décroche, marque qui apparaît. Seuls les écarts qui dépassent la marge d’erreur deviennent une alerte. Avec une réponse par question et par IA à chaque date, il y en a peu, et c’est voulu.',
    decision: 'Réagir vite, sans être dérangé par ce qui n’est que du bruit.',
  },
  rapport: {
    nom: 'Rapport de la semaine',
    quoi: 'Ce qui a bougé, les trois actions à faire et la dépense de la période, sur une seule page.',
    detail: 'L’écran Rapport compare les deux derniers jours de relevé : questions gagnées et perdues, IA par IA, marques qui apparaissent. Suivent les trois actions les plus utiles de la liste de travail et la dépense de la période. Claude a son propre bloc, avec ses propres dates.',
    decision: 'Faire le point du lundi en cinq minutes, sans parcourir tous les écrans.',
  },
  exports: {
    nom: 'Exports CSV',
    quoi: 'Les questions, les sources, la liste de travail et le journal des appels, en fichier CSV.',
    detail: 'Un bouton de la barre du haut télécharge le tableau de l’écran en CSV : les questions depuis la vue d’ensemble, les sources, la liste de travail depuis les actions, et le journal des appels depuis les coûts.',
    decision: 'Travailler les chiffres dans un tableur, ou les transmettre à un rédacteur sans lui ouvrir l’outil.',
  },
  partage: {
    nom: 'Page de partage pour un client',
    quoi: 'Un lien privé, sans compte, qui montre à un client où en est sa marque sur une série de questions.',
    detail: 'Vous cochez les questions à montrer, les IA, la langue de la page et ce qu’elle affiche (extraits des réponses, marques nommées à la place). Le client ouvre un simple lien : la marque IA par IA, avec le nombre de réponses et la marge d’erreur, l’évolution, puis le détail question par question avec les pages citées. La page se met à jour à chaque relevé ; vous voyez combien de fois elle a été ouverte, et vous la coupez d’un clic.',
    decision: 'Rendre compte à un client sans lui ouvrir l’outil, ni lui montrer le reste du projet.',
    limite: 'Pas de mot de passe propre à un lien : quiconque a l’adresse ouvre la page tant qu’elle est active.',
  },
  libre: {
    nom: 'Logiciel libre, à installer chez soi',
    quoi: 'Le code est ouvert et gratuit : vous l’installez sur votre machine et vous y branchez vos propres clés d’API.',
    detail: 'Un script d’installation pose les questions, écrit le fichier de réglages et lance l’outil avec Docker : l’outil, sa base de données et la tâche de fond des relevés automatiques. Le premier écran crée le compte administrateur. Vos questions, les réponses relevées et vos chiffres restent dans votre base ; les clés ne servent qu’à appeler le fournisseur concerné.',
    decision: 'Payer les relevés à leur prix, sans abonnement, et garder ses données chez soi.',
    limite: 'Pas d’assistance ni d’hébergement fourni : l’installation et les mises à jour sont à votre charge.',
  },
  courriel: {
    nom: 'Rapport du lundi par e-mail',
    quoi: 'Le rapport de la semaine et ses alertes, envoyés chaque lundi.',
    detail: 'Le rapport de la semaine partira par e-mail chaque lundi, alertes comprises. Il est déjà écrit, et l’envoi se règle sur l’écran Rapport avec une clé du service Resend : il n’a pas encore servi en conditions réelles.',
    decision: 'Suivre sans ouvrir l’outil.',
  },
  visites: {
    nom: 'Visites venues des IA',
    quoi: 'Google Analytics et la Search Console reliés aux relevés : la visibilité en face des visites réelles.',
    detail: 'Google Analytics et la Search Console seront reliés aux relevés : les visites arrivées depuis une IA, leurs pages d’arrivée, et les pages bien classées chez Google que les IA ne citent jamais.',
    decision: 'Mettre la visibilité en face de visites réelles, et trouver les pages solides à adapter en premier.',
  },
  moteurs: {
    nom: 'Perplexity et Copilot',
    quoi: 'Les deux IA qui manquent, par un second fournisseur de relevés.',
    detail: 'Les deux IA qui manquent passeront par un second fournisseur de relevés d’interface, choisi sur un essai réel : qualité des sources renvoyées et relevé depuis le pays visé.',
    decision: 'Couvrir les IA que vos clients utilisent, sans en suivre quinze pour le plaisir du nombre.',
  },
}

const en: Record<IdFonction, Texte> = {
  // ── Measure ──
  projets: {
    nom: 'Project creation',
    quoi: 'One project per brand: its name, websites, YouTube channels, competitors, questions, country and language.',
    detail: 'A project tracks one brand. You declare its name, its websites, its YouTube channels, its competitors and its customers’ questions, with the country they are asked from and their language. Only the name is required; the rest can be filled in later. A question that has been read can no longer be edited: you archive it, and its history stays.',
    decision: 'Tell the tool what belongs to the brand. Without that, a video from its channel would count for youtube.com, which means for someone else.',
    limite: 'The brand’s social profiles can be detected from its website. Brands the engines name instead of you are suggested on the competitors screen, and Google’s “People also ask” questions on the Google screen: one click is enough to track them.',
  },
  releves: {
    nom: 'Readings on five AI engines',
    quoi: 'ChatGPT, Gemini, Google AI Mode and AI Overviews are read in their real interface. Claude is queried through its API, and every number says so.',
    detail: 'The tool asks each question in the project to five AI engines. Four are read in their interface: a service opens the real page, asks the question from the target country and returns what is displayed. Claude has no interface reading. It is queried through the Anthropic API with web search turned on.',
    decision: 'Know which engines mention the brand, question by question, without confusing what a person sees with what a bare model returns.',
    limite: 'ChatGPT is read without forcing web search. We want what a real user gets, not an answer we provoked.',
  },
  reponse: {
    nom: 'Full answer kept',
    quoi: 'Every answer is stored as is, with its date and the model that wrote it. Each question opens the full answers and their sources.',
    detail: 'Each reading keeps the full text of the answer, its date, the model name when the engine gives it, and the provider’s raw response. Any number opens onto the answers behind it.',
    decision: 'Check for yourself before acting, and show the exact answer to a writer or a partner. The raw response also lets us rerun an analysis without paying for the reading again.',
  },
  sources: {
    nom: 'Cited sources and pages read',
    quoi: 'The pages the engine cites, and the ones it opened but did not keep. The two are not fixed the same way.',
    detail: 'The tool keeps two separate lists. Cited sources are the pages the engine shows in support of its answer, with their rank. Pages read are the ones it opened during its search and then left out.',
    decision: 'A page that was read but not cited has already been found: it needs rewriting. A page that was never read has a search ranking problem first.',
    limite: 'Pages read are known for ChatGPT and Claude. Gemini and Google do not expose them.',
  },
  presence: {
    nom: 'Three levels of presence',
    quoi: 'Your website is cited, one of your videos is cited, or only your name appears in the text.',
    detail: 'For each answer, the tool says how the brand shows up. Its website is cited as a source, a video from its channel is cited, or its name appears in the text with no link. The three are not worth the same and are not earned the same way.',
    decision: 'Know where visibility comes from, and so where to put the effort: writing, filming, or getting talked about elsewhere.',
  },
  youtube: {
    nom: 'YouTube channels counted',
    quoi: 'A video from your channel cited by an AI engine counts for your brand, not for youtube.com.',
    detail: 'Every YouTube video cited by an engine is matched to its channel, with its title and audience. If the channel belongs to the brand, the citation counts for the brand. The tool also keeps the exact moment of the video the engine pointed to, when the link carries it.',
    decision: 'Stop reading the brand as absent when one of its videos is cited. And repeat what works: same topic, same format, with care for the passage that was picked.',
  },
  reseaux: {
    nom: 'The brand’s social profiles',
    quoi: 'LinkedIn, Instagram, X, TikTok… A page cited under one of the brand’s profiles counts for the brand.',
    detail: 'A project also declares the brand’s profiles: LinkedIn, Instagram, Facebook, X, TikTok, Pinterest, Threads, Bluesky, GitHub. A button detects them by reading the site’s home page (its links and its sameAs markup), YouTube channels included. It suggests, you choose: a site often shows personal accounts too. A page cited under one of these profiles then counts as a page of the brand.',
    decision: 'Avoid crediting a third party with a citation that comes from your own LinkedIn page.',
    limite: 'Detection leaves out share buttons and links to a single post.',
  },
  apercus: {
    nom: 'AI Overviews tracking',
    quoi: 'Does Google show an overview for the question? Are you in it? A question with no overview is not counted as an absence.',
    detail: 'For each question, the tool records whether Google shows an AI Overview and whether the brand is in it. A question with no overview comes back as “empty”: it leaves the calculation instead of counting as an absence. AI Mode is tracked separately.',
    decision: 'Skip questions where Google never shows an overview, and keep absences that are not absences out of the number.',
  },

  approfondie: {
    nom: 'Deep measurement',
    quoi: 'One question asked 5, 10 or 25 times in a row, to settle a doubt within the hour.',
    detail: 'On a question’s page, a button asks it again several times in a row on the engines you pick, with the price shown before sending. These readings count for the question’s verdict, not in the overall numbers: otherwise a question asked 25 times would weigh 25 times more than the others.',
    decision: 'Know whether a presence is solid or occasional before spending time on it.',
    limite: 'About $0.12 for 25 readings on the four interface engines.',
  },

  // ── Understand ──
  pagesSuivies: {
    nom: 'Tracked pages',
    quoi: 'Start from an article or a product page: do AIs cite it, and on which prompts?',
    detail: 'You paste the address of a page of the brand. The tool reads it, suggests the prompts a user would ask that it answers (keep, edit or add your own by hand), then, after the run, tells you AI by AI whether the answers cite it, and which pages are cited instead.',
    decision: 'Know whether a sponsored article or a key page shows up in AI answers, and what it has to beat.',
    limite: 'A page is only measured on the prompts you give it.',
  },
  marques: {
    nom: 'Brands named instead of you',
    quoi: 'Who the engines recommend on your questions, and in what order, for all five engines.',
    detail: 'The tool lists the brands the engines name on your questions, counts the answers each one appears in and records the order they come in. Brands that come up often and were not on your radar surface on their own.',
    decision: 'Find the competitor the engines actually recommend, and tell “absent” apart from “named last”.',
    limite: 'ChatGPT returns the brands of its answer itself. For the other engines, they are drawn from the text by automatic reading. A brand that is named often can be tracked in one click: it then counts in the share of voice.',
  },
  sites: {
    nom: 'Most cited sites',
    quoi: 'The comparison sites, media and directories that come back from one question to the next: they are the ones writing the answer.',
    detail: 'All readings are pooled to rank the sites that come back from one question to the next. Each cited site is classified once by a small model: comparison site, media, blog, forum, directory, brand site, official site, shop. The tool also says who each citation benefits: you, a tracked competitor, another brand or a third party. A type can be corrected by hand.',
    decision: 'Know where you need to appear before deciding what to write.',
  },
  evolution: {
    nom: 'Sources rising and falling',
    quoi: 'From one reading to the next: new, lost, rising and falling sources.',
    detail: 'The sources screen compares the last reading day with the one before, on the same questions: sites and pages cited for the first time, lost, rising most and falling most. A source is not declared lost just because a question was not asked again.',
    decision: 'Spot the new comparison page taking the spot before it settles in.',
  },
  top10: {
    nom: 'AI Overview against Google’s top ten',
    quoi: 'Outside the top ten results, the blocker is search ranking. Inside but not cited, the page itself needs rewriting.',
    detail: 'An AI Overview reading also contains the classic results for the same search. The tool compares the two: which overview sources sit in the top ten, and where your page stands.',
    decision: 'Outside the top ten, the blocker is search ranking. In the top ten but not cited, the page itself needs rewriting.',
  },
  recherches: {
    nom: 'Searches run by the engines',
    quoi: 'What the engine types into a search engine before it answers. These are the topics to write for.',
    detail: 'Before answering, an engine often runs its own searches. The tool records them as they are and counts how often each one comes up. They tend to be more specific than the question asked: a year, a type of comparison, a trade.',
    decision: 'Write for these searches. They decide which pages get read, and so which pages get cited.',
    limite: 'Available for ChatGPT and Claude. Gemini and Google do not expose their searches.',
  },
  chaines: {
    nom: 'Channels cited instead of you',
    quoi: 'The videos the engines pick on your topics, with their channel and views.',
    detail: 'Videos cited on your questions are grouped by channel, with their views and the number of answers they appear in. Your channels are set apart: one card per declared channel, even if never cited, then the other channels.',
    decision: 'See whether video matters in your market, and spot a creator worth contacting for a review or a joint video.',
  },
  idees: {
    nom: 'Question ideas',
    quoi: 'The “People also ask” questions Google shows under yours, ready to add to tracking.',
    detail: 'Under its results, Google shows “People also ask” questions and related searches. The tool collects them with each reading and suggests them as questions to track.',
    decision: 'Track the questions people really ask, not the ones you imagine.',
  },
  lecture: {
    nom: 'Automatic reading of every answer',
    quoi: 'Rank of each brand and tone used, for all engines.',
    detail: 'A small language model reads every recorded answer and fills in the same sheet for all engines: brands named, their rank and the tone used for each. The same model classifies each cited site by type. New answers are read on their own, older ones in one click, and the raw answer is kept: a reading can be redone without paying for the reading again.',
    decision: 'Compare the five engines on the same criteria, instead of only reading the one that returns its brands.',
    limite: 'About $0.001 per answer read, logged in the cost log like every paid call.',
  },
  themes: {
    nom: 'Topics and topic map',
    quoi: 'Each question gets a topic and an intent. The map says which topics you hold and which ones escape you.',
    detail: 'The small model gives each question a topic and an intent: learn, compare, buy. “With or without the brand name” is deduced from the text of the question, without a model. Questions are grouped by topic, and a map ranks each one: held, contested, to win back, or blind spot when nobody holds it. A topic can be corrected by hand.',
    decision: 'Choose where to put the month’s effort, and read visibility on unbranded questions: they are the ones that bring in new customers.',
  },
  faits: {
    nom: 'Wrong facts about the brand',
    quoi: 'You write down your verified facts (price, plan, country). The tool flags answers that say otherwise, and the source at fault.',
    detail: 'You write five to twenty verified facts per brand: a price, a plan, a date, a country. A small model compares every answer that names the brand with that list and flags the ones that say something else: the sentence at fault, and the source cited in support when there is one. Each contradiction becomes a line in the work list. A false alarm is dismissed in one click.',
    decision: 'Know which page of yours to fix, or which site to contact.',
  },

  // ── Act ──
  perdues: {
    nom: 'Lost questions',
    quoi: 'For each question where you are absent: who is cited, and thanks to which pages.',
    detail: 'The questions screen isolates the ones where the brand is absent. Each question’s page shows who is cited instead, on which engines and thanks to which pages: the brands named most, the pages cited by two engines or more, and your pages read but not cited.',
    decision: 'Understand why you lose, question by question, instead of staring at an average.',
  },
  pages: {
    nom: 'Pages to appear on',
    quoi: 'Third-party pages cited on your questions, without you, ranked by number of answers.',
    detail: 'The tool ranks the third-party pages cited on your questions, without you, by the number of answers and engines they appear in. Each line shows the type of site. Brand sites are left out: you do not ask a rival for a mention. Comparison sites, media and directories come first.',
    decision: 'Know who to write to first: this comparison, this directory, this publication.',
  },
  lues: {
    nom: 'Your pages read but not cited',
    quoi: 'The engine already found them: they lack the right answer. The fixes with the best return.',
    detail: 'The list of your pages that an engine opened and left out, or that Google ranks in its top ten while the AI Overview does not cite them. They come first in the work list.',
    decision: 'Start with the fixes that pay best: the page has been found, it lacks the right answer.',
  },
  video: {
    nom: 'Video opportunities',
    quoi: 'Questions where engines cite videos and you have none on the topic.',
    detail: 'The tool lists the questions where engines cite videos and none comes from your channels, along with the videos cited in your place, their channel and their audience.',
    decision: 'Pick your next video topics from facts, not from a hunch.',
  },
  audit: {
    nom: 'Page audit',
    quoi: 'Can AI crawlers read it? Text present without JavaScript, structured data, date, author.',
    detail: 'You enter a page address. The tool reads it the way AI crawlers do: robots.txt rules for twelve crawlers, the server’s real response to search crawlers, text present without JavaScript, robots meta tag, headings, lists and tables, structured data, date and author. Each point is rated good, to review or blocking.',
    decision: 'Know whether the blocker is technical before rewriting the content.',
  },
  liste: {
    nom: 'One work list',
    quoi: 'Everything above in a single list, ranked by the number of answers and engines concerned, with a status and evidence on each line.',
    detail: 'Pages to rewrite, pages to appear on, videos to record, search rankings to work on, wrong facts to correct: everything sits in one list, ranked by the number of answers and engines concerned. Each line has a status (to do, in progress, done, dismissed) and links to the answers that justify it. It also keeps a free note and a contact log: who you wrote to, when, and what came back.',
    decision: 'Know what to do on Monday morning.',
  },
  contacts: {
    nom: 'Outreach log',
    quoi: 'For each target page: who you wrote to, when, and what came back.',
    detail: 'Each line of the work list keeps a free note and a log of outreach: request to be added, test offer, reply in a thread, correction request, follow-up. Each step has its date and the answer received: pending, positive, refusal or no answer.',
    decision: 'Never chase the same site twice, and see which kinds of outreach work.',
  },
  apres: {
    nom: 'Measurement after an action',
    quoi: 'Four weeks after a fix, the tool compares before and after and says whether the gap is larger than the noise.',
    detail: 'When an action is marked done, the tool keeps the date and puts a marker on the curve. It then compares the brand’s presence on the questions concerned, before and after that date, and says plainly whether the gap is larger than the margin of error or not. The result can be read at any time; it is marked provisional before four weeks.',
    decision: 'Know what really works, and stop what does not.',
    limite: 'The tool will say whether the gap is real, not whether the action caused it. A model change or a competitor can play a part too.',
  },

  // ── Steer ──
  couts: {
    nom: 'Cost of every call',
    quoi: 'Every reading is logged with its price, by engine and by project, under a monthly cap that pauses sending.',
    detail: 'Every call to a paid API is logged as it leaves: provider, engine, project, price, duration, success or failure. The dashboard turns that into spend per day and per month, by engine and by project. A monthly cap pauses readings once it is reached.',
    decision: 'Set the number of questions and the schedule knowing the price, and never be surprised by a bill.',
  },
  lancer: {
    nom: 'Launch a reading from the tool',
    quoi: 'One button on the project page. The price of each engine is shown before sending, and the monthly cap is checked.',
    detail: 'On the project page, a table lists the five engines with their method, the price of one question and the price for all the questions in the project. You tick the engines you want, then launch. Claude, which costs more, is unticked by default. The month’s spend and the cap are shown under the table, and nothing is sent once the cap is reached.',
    decision: 'Decide on a reading with its price in front of you, engine by engine, before paying.',
  },
  planifies: {
    nom: 'Scheduled readings',
    quoi: 'Weekly for ChatGPT, Gemini and Google. Every two weeks for Claude, which costs more to query.',
    detail: 'Readings run on their own once switched on in the project page: weekly for ChatGPT, Gemini, AI Mode and AI Overviews, every two weeks for Claude, which costs more to query. They stop by themselves when the monthly cap is reached.',
    decision: 'Get regular series, and so curves that mean something.',
  },
  marge: {
    nom: 'Margin of error shown',
    quoi: 'For a single question, the screen says “solid”, “occasional” or “absent” instead of a misleading percentage.',
    detail: 'Every number carries its method and its number of readings. Visibility shows its margin of error, the curve draws it as a grey band, and a gap is only coloured when it exceeds it. For a single question, where readings are few, the screen says “solid”, “occasional” or “absent” instead of a percentage. To settle a doubt, an in-depth measurement asks the question 5, 10 or 25 times in a row, at the price shown before sending.',
    decision: 'Avoid reacting to a gap that is only noise.',
  },
  tendances: {
    nom: 'Trends',
    quoi: 'Visibility by engine and brands named, reading after reading, with a marker on the day an engine changes model.',
    detail: 'The overview plots each engine’s visibility over time, with the margin-of-error band. The competitors screen plots the brands named. Each curve carries a marker on the day an engine changes model, the day an action is completed and the day of a deep measurement. Claude’s curve is drawn separately.',
    decision: 'Avoid crediting your work for a rise or a drop caused by a new model.',
    limite: 'Average rank is read over the chosen period: it does not have its own curve yet.',
  },
  alertes: {
    nom: 'Alerts above the noise',
    quoi: 'An alert when a presence disappears or a brand settles in. Never for the noise of the day.',
    detail: 'The overview flags what changed between the last two reading days: questions won or lost, an engine dropping off, a brand appearing. Only gaps larger than the margin of error become alerts. With one answer per question and per engine on each date, there are few of them, by design.',
    decision: 'React quickly without being bothered by what is only noise.',
  },
  rapport: {
    nom: 'Weekly report',
    quoi: 'What moved, the three actions to take and the period’s spend, on a single page.',
    detail: 'The Report screen compares the last two reading days: questions won and lost, engine by engine, brands appearing. Then come the three most useful actions of the work list and the period’s spend. Claude has its own block, with its own dates.',
    decision: 'Run the Monday check-in in five minutes, without going through every screen.',
  },
  exports: {
    nom: 'CSV exports',
    quoi: 'Questions, sources, the work list and the call log, as CSV files.',
    detail: 'A button in the top bar downloads the screen’s table as CSV: questions from the overview, sources, the work list from the actions screen, and the call log from the costs screen.',
    decision: 'Work on the numbers in a spreadsheet, or hand them to a writer without giving them access to the tool.',
  },
  partage: {
    nom: 'Share page for a client',
    quoi: 'A private link, with no account, that shows a client where their brand stands on a set of prompts.',
    detail: 'You tick the prompts to show, the AIs, the page language and what it displays (answer excerpts, brands named instead). The client opens a plain link: the brand AI by AI, with the number of answers and the margin of error, the trend, then prompt-by-prompt detail with the pages cited. The page updates with every run; you see how many times it was opened, and you turn it off in one click.',
    decision: 'Report to a client without opening the tool to them, or showing them the rest of the project.',
    limite: 'No per-link password: anyone with the address opens the page while it is active.',
  },
  libre: {
    nom: 'Open-source software you install yourself',
    quoi: 'The code is open and free: you install it on your own machine and plug in your own API keys.',
    detail: 'An install script asks the questions, writes the settings file and starts the tool with Docker: the tool, its database and the background task for automatic runs. The first screen creates the admin account. Your prompts, the recorded answers and your numbers stay in your own database; the keys are only used to call the provider concerned.',
    decision: 'Pay for readings at their price, with no subscription, and keep your data on your own machine.',
    limite: 'No support and no hosting provided: installing and updating are up to you.',
  },
  courriel: {
    nom: 'Monday report by email',
    quoi: 'The weekly report and its alerts, sent every Monday.',
    detail: 'The weekly report will go out by email every Monday, alerts included. It is already written, and sending is set up on the Report screen with a Resend key: it has not been used in real conditions yet.',
    decision: 'Follow along without opening the tool.',
  },
  visites: {
    nom: 'Visits coming from AI engines',
    quoi: 'Google Analytics and Search Console linked to readings: visibility set against real visits.',
    detail: 'Google Analytics and Search Console will be linked to the readings: visits arriving from an AI engine, their landing pages, and the pages that rank well on Google but are never cited by the engines.',
    decision: 'Set visibility against real visits, and find the strong pages to adapt first.',
  },
  moteurs: {
    nom: 'Perplexity and Copilot',
    quoi: 'The two missing engines, through a second reading provider.',
    detail: 'The two missing engines will go through a second interface-reading provider, chosen after a real trial: quality of the sources returned, and reading from the target country.',
    decision: 'Cover the engines your customers use, without tracking fifteen for the sake of the count.',
  },
}

export const textes = { fr: insecables(fr), en }

// ── Les quatre familles ─────────────────────────────────────────────────────
type TexteFamille = {
  /** La question à laquelle la famille répond. */
  question: string
  /** Résumé d'une ligne (registre, liens). */
  resume: string
  /** Titre de la page de la famille. */
  titre: string
  chapo: string
  /** Notes de marge, en plus des compteurs. */
  marge: string[]
  meta: { titre: string; description: string }
}

const famillesFr: Record<Famille, TexteFamille> = {
  mesurer: {
    question: 'Votre marque est-elle citée ?',
    resume: 'Relever ce qu’un internaute voit vraiment, et le garder.',
    titre: 'Relever ce qu’un internaute voit vraiment, [[et le garder.]]',
    chapo: 'Avant d’expliquer ou de corriger, il faut une mesure qui tienne. Ces neuf fonctions sont toutes en service : le projet qui décrit la marque et ses propriétés, les réponses de cinq IA, leurs sources, les trois façons dont une marque peut y figurer, et la mesure approfondie pour trancher un doute.',
    marge: ['4 IA par l’interface', 'Claude par son API'],
    meta: { titre: 'Mesurer : les réponses de cinq IA, relevées et gardées', description: 'Relevés de ChatGPT, Gemini, du Mode IA et des Aperçus IA de Google dans leur interface, Claude par son API. Réponse complète, sources citées, pages lues, chaînes YouTube comptées.' },
  },
  comprendre: {
    question: 'Qui est cité à votre place, et pourquoi ?',
    resume: 'Savoir qui est cité à votre place, et pourquoi.',
    titre: 'Savoir qui est cité à votre place, [[et pourquoi.]]',
    chapo: 'Une absence ne dit rien tant qu’on ne sait pas qui occupe la place. Ces fonctions lisent les réponses de près : les marques nommées, les sites qui reviennent et ceux qui montent, les recherches que l’IA lance elle-même, les thèmes que vous tenez et les faits qu’elle déforme.',
    marge: ['Marques nommées : les cinq IA', 'Recherches : ChatGPT et Claude'],
    meta: { titre: 'Comprendre : qui les IA citent à votre place', description: 'Marques nommées, sites les plus cités et sources qui montent, Aperçu IA comparé aux dix premiers de Google, recherches des IA, chaînes YouTube, thèmes, faits faux.' },
  },
  agir: {
    question: 'Que faire lundi matin ?',
    resume: 'Une liste de travail, pas un tableau de plus.',
    titre: 'Une liste de travail, [[pas un tableau de plus.]]',
    chapo: 'Mesurer ne sert à rien si l’on ne sait pas quoi faire ensuite. La liste de travail est en service : elle est tirée des relevés, classée selon le nombre de réponses et d’IA concernées, et chaque ligne renvoie aux réponses qui la justifient. Les huit fonctions de la famille sont en service, du constat de départ à la mesure qui suit la correction.',
    marge: ['Chaque action a sa preuve', 'Mesure refaite après 4 semaines'],
    meta: { titre: 'Agir : la liste de travail tirée des relevés', description: 'Questions perdues, pages où obtenir une mention, pages lues mais pas citées, occasions vidéo, audit d’une page, suivi des prises de contact, mesure après action.' },
  },
  piloter: {
    question: 'Peut-on se fier au chiffre, et que coûte-t-il ?',
    resume: 'Des chiffres qui disent d’où ils viennent, et ce qu’ils coûtent.',
    titre: 'Des chiffres qui disent d’où ils viennent, [[et ce qu’ils coûtent.]]',
    chapo: 'Un chiffre de visibilité bouge d’un essai à l’autre, et chaque relevé se paie. Piloter, c’est connaître la marge d’erreur de l’un et le prix de l’autre. Coûts, relevés automatiques, marge d’erreur, tendances, alertes, rapport et exports sont en service. Trois fonctions restent en construction : l’envoi du rapport par e-mail, les visites venues des IA, et Perplexity et Copilot.',
    marge: ['Plafond mensuel réglable', 'Aucun appel hors du journal'],
    meta: { titre: 'Piloter : coûts, marge d’erreur, tendances et alertes', description: 'Journal des coûts, prix affiché avant chaque relevé, plafond mensuel, relevés automatiques, marge d’erreur, tendances, alertes, rapport de la semaine et exports CSV.' },
  },
}

const famillesEn: Record<Famille, TexteFamille> = {
  mesurer: {
    question: 'Is your brand cited?',
    resume: 'Record what a real user sees, and keep it.',
    titre: 'Record what a real user sees, [[and keep it.]]',
    chapo: 'Before explaining or fixing anything, you need a measurement that holds. These nine features are all live: the project that describes the brand and its properties, the answers of five AI engines, their sources, the three ways a brand can show up in them, and the deep measurement that settles a doubt.',
    marge: ['4 engines through the interface', 'Claude through its API'],
    meta: { titre: 'Measure: the answers of five AI engines, recorded and kept', description: 'Readings of ChatGPT, Gemini, Google AI Mode and AI Overviews in their interface, Claude through its API. Full answer, cited sources, pages read, YouTube channels counted.' },
  },
  comprendre: {
    question: 'Who is cited instead of you, and why?',
    resume: 'Know who is cited instead of you, and why.',
    titre: 'Know who is cited instead of you, [[and why.]]',
    chapo: 'An absence tells you nothing until you know who holds the spot. These features read the answers closely: the brands named, the sites that keep coming back and the ones rising, the searches the engine runs itself, the topics you hold and the facts it gets wrong.',
    marge: ['Brands named: all five engines', 'Searches: ChatGPT and Claude'],
    meta: { titre: 'Understand: who AI engines cite instead of you', description: 'Brands named, most cited and rising sources, AI Overview compared with Google’s top ten, searches run by the engines, YouTube channels, topics, wrong facts.' },
  },
  agir: {
    question: 'What do we do on Monday morning?',
    resume: 'A work list, not one more dashboard.',
    titre: 'A work list, [[not one more dashboard.]]',
    chapo: 'Measuring is pointless if you do not know what to do next. The work list is live: it is built from the readings, ranked by the number of answers and engines concerned, and every line links to the answers that justify it. All eight features of the family are live, from the first finding to the measurement that follows the fix.',
    marge: ['Every action has its evidence', 'Measured again after 4 weeks'],
    meta: { titre: 'Act: the work list drawn from the readings', description: 'Lost questions, pages to get mentioned on, pages read but not cited, video opportunities, page audit, outreach log, measurement after an action.' },
  },
  piloter: {
    question: 'Can the number be trusted, and what does it cost?',
    resume: 'Numbers that say where they come from, and what they cost.',
    titre: 'Numbers that say where they come from, [[and what they cost.]]',
    chapo: 'A visibility number moves from one try to the next, and every reading has a price. Steering means knowing the margin of error of the first and the cost of the second. Costs, scheduled readings, margin of error, trends, alerts, report and exports are live. Three features are still being built: the report by email, visits from AI engines, and Perplexity and Copilot.',
    marge: ['Adjustable monthly cap', 'No call outside the log'],
    meta: { titre: 'Steer: costs, margin of error, trends and alerts', description: 'Cost log, price shown before each reading, monthly cap, scheduled readings, margin of error, trends, alerts, weekly report and CSV exports.' },
  },
}

export const familles = { fr: insecables(famillesFr), en: famillesEn }

// ── La page qui réunit tout ─────────────────────────────────────────────────
const hubFr = {
  meta: { titre: 'Fonctionnalités : ce que l’outil fait, et ce qu’il ne fait pas encore', description: `Les ${FONCTIONS.length} fonctions de GeoTrends, rangées en quatre familles (mesurer, comprendre, agir, piloter), chacune avec son état réel : en service ou en construction.` },
  fil: 'Fonctionnalités',
  titre: 'Tout ce que fait l’outil, [[et tout ce qu’il ne fait pas encore.]]',
  chapo: `Quatre familles, ${FONCTIONS.length} fonctions. Chacune porte son état réel, sans arrondir : en service aujourd’hui, ou en construction. Une fonction en construction n’est jamais présentée comme disponible.`,
  familles: { numero: 'Famille', titre: 'Quatre questions, quatre familles', voir: 'Voir la famille' },
  registre: {
    titre: 'Le registre complet',
    phrase: `${FONCTIONS.length} lignes, dans l’ordre où elles servent.`,
    detail: 'Le détail',
  },
  appel: { nom: 'Lire la méthode' },
}

const hubEn: typeof hubFr = {
  meta: { titre: 'Features: what the tool does, and what it does not do yet', description: `The ${FONCTIONS.length} features of GeoTrends, in four families (measure, understand, act, steer), each with its real status: live or in progress.` },
  fil: 'Features',
  titre: 'Everything the tool does, [[and everything it does not do yet.]]',
  chapo: `Four families, ${FONCTIONS.length} features. Each one carries its real status, with no rounding up: live today, or in progress. A feature in progress is never presented as available.`,
  familles: { numero: 'Family', titre: 'Four questions, four families', voir: 'See the family' },
  registre: {
    titre: 'The full ledger',
    phrase: `${FONCTIONS.length} lines, in the order you would use them.`,
    detail: 'Details',
  },
  appel: { nom: 'Read the method' },
}

export const hub = { fr: insecables(hubFr), en: hubEn }

// ── Textes communs aux pages de famille ─────────────────────────────────────
const pageFamilleFr = {
  sommaire: 'Dans cette famille',
  autres: 'Les autres familles',
}
const pageFamilleEn: typeof pageFamilleFr = {
  sommaire: 'In this family',
  autres: 'The other families',
}
export const pageFamille = { fr: insecables(pageFamilleFr), en: pageFamilleEn }
