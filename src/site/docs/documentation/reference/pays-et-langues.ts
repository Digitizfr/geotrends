import type { PageDoc } from '../../types'

// Pays et langues : src/lib/marches.ts (listes proposées), src/lib/fournisseurs/
// dataforseo.ts (CODES_PAYS : pays où partent les relevés d'interface),
// src/lib/i18n (langue de l'interface), onglet Réglages du projet.
const page: PageDoc = {
  id: 'reference/pays-et-langues',
  rubrique: 'reference',
  slug: { fr: 'reference/pays-et-langues', en: 'reference/countries-and-languages' },
  titre: { fr: 'Pays et langues', en: 'Countries and languages' },
  resume: {
    fr: 'Chaque projet pose ses questions depuis un pays et dans une langue, fixés au premier relevé. Les pays et langues proposés, et la langue de l’interface, à part.',
    en: 'Each project asks its prompts from one country and in one language, fixed at the first run. The countries and languages offered, and the interface language.',
  },
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Une IA ne répond pas la même chose à Paris et à Londres, en français et en anglais. Chaque projet a donc un pays et une langue : ses questions sont posées depuis ce pays, dans cette langue. Rien n’est écrit en dur pour la France : le premier marché suivi est français, mais l’outil sert pour d’autres marchés, un projet par marché.' },
      { type: 'h2', id: 'proposes', texte: 'Les pays et les langues proposés' },
      { type: 'p', texte: 'À la création d’un projet, l’étape **Le marché** propose dix pays et quatorze langues : les pays sont ceux où les cinq IA peuvent être relevées. Leurs noms s’écrivent dans la langue de l’interface ; la France et le français viennent en tête.' },
      {
        type: 'tableau',
        colonnes: ['', 'Liste'],
        lignes: [
          ['Pays', 'France, Belgique, Suisse, Canada, Luxembourg, États-Unis, Royaume-Uni, Allemagne, Espagne, Italie.'],
          ['Langues', 'Français, anglais, allemand, espagnol, italien, portugais, néerlandais, suédois, danois, norvégien, finnois, polonais, arabe, japonais.'],
        ],
      },
      { type: 'h2', id: 'releves', texte: 'Les pays où partent les relevés d’interface' },
      { type: 'p', texte: 'Le fournisseur des relevés d’interface est réglé pour ces **dix pays** : ChatGPT, Gemini, le Mode IA et les Aperçus IA de Google y sont interrogés depuis le pays du projet. Claude, lui, reçoit le pays du projet comme lieu approximatif. Un pays ne figure dans la liste qu’une fois vérifié chez le fournisseur : l’outil ne propose jamais un marché où ses relevés échoueraient.' },
      { type: 'encadre', ton: 'conseil', texte: 'Pour suivre un marché hors de ces dix pays, demandez qu’il soit ajouté : c’est un réglage de l’outil, fait après vérification chez le fournisseur.' },
      { type: 'h2', id: 'fixes', texte: 'Fixés au premier relevé' },
      { type: 'p', texte: 'Le pays et la langue se changent dans la fiche du projet, onglet **Réglages du projet**, bloc **Pays et langue**, tant qu’aucun relevé n’a été fait. Ensuite, le bloc passe en lecture seule : les courbes doivent rester comparables d’un relevé à l’autre. Pour un autre marché, créez un autre projet : par exemple Facturo pour la France, et Facturo UK pour le Royaume-Uni, en anglais.' },
      { type: 'h2', id: 'interface', texte: 'La langue de l’interface est à part' },
      {
        type: 'liste',
        items: [
          'L’interface de l’outil existe en **français** et en **anglais**. Le choix se fait dans Réglages, compte par compte, et vaut pour tous les écrans, les dates, les montants et les exports.',
          'Elle ne change pas la langue des questions d’un projet : un projet en anglais se lit très bien avec une interface en français.',
          'Le texte des réponses des IA n’est jamais traduit ni corrigé : il s’affiche tel que l’IA l’a écrit.',
          'Avant la connexion, la page de connexion suit la langue du navigateur.',
        ],
      },
      { type: 'h2', id: 'deuxieme-marche', texte: 'Suivre une marque sur un deuxième marché' },
      {
        type: 'etapes',
        items: [
          { titre: 'Créer un projet pour ce marché', texte: 'Nouveau projet, même marque, avec le pays et la langue du marché : Facturo UK, Royaume-Uni, anglais.' },
          { titre: 'Écrire les questions dans la langue du marché', texte: 'Comme un client local les poserait, pas comme une traduction mot à mot des questions françaises.' },
          { titre: 'Déclarer ce qui appartient à la marque', texte: 'Le même site s’il sert les deux marchés, les chaînes et les profils locaux, et les concurrents de ce marché.' },
          { titre: 'Lancer le premier relevé', texte: 'Le pays et la langue se figent. Passez d’un marché à l’autre par le choix du projet, en haut du menu.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Une langue proposée ne garantit pas que l’IA réponde dans cette langue, ni qu’elle cite des sources du pays. Les deux marchés d’une même marque se comparent projet par projet : l’outil ne fait pas de total entre projets.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/creer-un-projet' },
          { page: 'piloter/reglages' },
          { page: 'reference/ia-suivies' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'An AI does not answer the same way in Paris and in London, in French and in English. Each project therefore has one country and one language: its prompts are asked from that country, in that language. Nothing is hard-coded for France: the first market tracked is French, but the tool serves other markets, one project per market.' },
      { type: 'h2', id: 'offered', texte: 'Countries and languages offered' },
      { type: 'p', texte: 'When a project is created, **The market** step offers ten countries and fourteen languages: the countries are those where all five engines can be recorded. Their names are written in the interface language; France and French come first.' },
      {
        type: 'tableau',
        colonnes: ['', 'List'],
        lignes: [
          ['Countries', 'France, Belgium, Switzerland, Canada, Luxembourg, United States, United Kingdom, Germany, Spain, Italy.'],
          ['Languages', 'French, English, German, Spanish, Italian, Portuguese, Dutch, Swedish, Danish, Norwegian, Finnish, Polish, Arabic, Japanese.'],
        ],
      },
      { type: 'h2', id: 'readings', texte: 'Countries where interface readings go out' },
      { type: 'p', texte: 'The interface-reading provider is set up for these **ten countries**: ChatGPT, Gemini, Google AI Mode and AI Overviews are asked from the project’s country. Claude, for its part, receives the project’s country as an approximate location. A country only appears in the list once checked with the provider: the tool never offers a market where its readings would fail.' },
      { type: 'encadre', ton: 'conseil', texte: 'To track a market outside these ten countries, ask for it to be added: it is a setting of the tool, made after checking with the provider.' },
      { type: 'h2', id: 'fixed', texte: 'Fixed at the first run' },
      { type: 'p', texte: 'Country and language can be changed on the project page, **Project settings** tab, **Country and language** block, as long as no run has been made. After that, the block becomes read-only: the charts must stay comparable from one run to the next. For another market, create another project: for example Facturo for France, and Facturo UK for the United Kingdom, in English.' },
      { type: 'h2', id: 'interface', texte: 'The interface language is separate' },
      {
        type: 'liste',
        items: [
          'The tool’s interface exists in **French** and **English**. The choice is made in Settings, account by account, and applies to every screen, dates, amounts and exports.',
          'It does not change the language of a project’s prompts: a project in French reads perfectly well with an English interface.',
          'AI answers are never translated or corrected: they are shown as the AI wrote them.',
          'Before sign-in, the sign-in page follows the browser language.',
        ],
      },
      { type: 'h2', id: 'second-market', texte: 'Tracking a brand on a second market' },
      {
        type: 'etapes',
        items: [
          { titre: 'Create a project for that market', texte: 'New project, same brand, with the market’s country and language: Facturo UK, United Kingdom, English.' },
          { titre: 'Write the prompts in the market’s language', texte: 'As a local customer would ask them, not as a word-for-word translation of the French prompts.' },
          { titre: 'Declare what belongs to the brand', texte: 'The same site if it serves both markets, the local channels and profiles, and that market’s competitors.' },
          { titre: 'Start the first run', texte: 'Country and language are now fixed. Switch from one market to the other with the project switcher, at the top of the menu.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'A language offered does not guarantee that the AI answers in that language, nor that it cites sources from that country. Two markets of the same brand are compared project by project: the tool makes no total across projects.' },
      {
        type: 'liens',
        items: [
          { page: 'projet/creer-un-projet' },
          { page: 'piloter/reglages' },
          { page: 'reference/ia-suivies' },
        ],
      },
    ],
  },
}

export default page
