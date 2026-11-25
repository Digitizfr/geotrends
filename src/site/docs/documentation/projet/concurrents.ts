import type { PageDoc } from '../../types'

// Onglet « Concurrents » de /projets/[id], actions ajouterConcurrents,
// reglerConcurrent, retirerConcurrent (src/app/(app)/projets/actions.ts) et la
// reconnaissance des concurrents (concurrentDe, concurrentDuDomaine dans src/lib/classements.ts).
const page: PageDoc = {
  id: 'projet/concurrents',
  rubrique: 'projet',
  slug: { fr: 'projet/concurrents', en: 'project/competitors' },
  titre: { fr: 'Choisir ses concurrents', en: 'Choose your competitors' },
  resume: {
    fr: 'Suivre trois à six marques face à la vôtre : c’est ce qui rend la part de voix calculable et leur attribue les pages citées. Suivre une marque est gratuit.',
    en: 'Track three to six brands against yours: that is what makes share of voice computable, and what attributes cited pages to them. Tracking a brand is free.',
  },
  ecrans: ['/projets/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Un concurrent suivi est une marque que l’outil compare à la vôtre, écran par écran. Sans concurrent suivi, la **Part de voix** ne se calcule pas (elle vaudrait toujours 100 %), le face-à-face reste vide et le filtre **Face à** de la barre du haut n’a rien à proposer. Suivre une marque ne coûte rien et ne lance aucun relevé : les chiffres se calculent sur les réponses déjà relevées.' },
      { type: 'p', texte: 'Pour y aller : l’onglet **Concurrents** de la fiche du projet, ou le bouton **Gérer les concurrents suivis** de l’écran Concurrents. Une marque se suit aussi d’un clic sur **Suivre**, partout où l’outil liste des marques nommées : sur la vue d’ensemble (**Nommés à notre place**), sur l’écran Concurrents (**Marques repérées, pas encore suivies**) et dans le rapport (**Marques nommées pour la première fois**).' },
      { type: 'h2', id: 'suivis', texte: 'Les concurrents suivis' },
      { type: 'p', texte: 'Une ligne par concurrent. Son nom ouvre les réponses qui le nomment ; dessous, le nombre de réponses d’interface où il est nommé, ou « pas encore nommé ». Le champ **Son site** déclare le domaine du concurrent, avec **Enregistrer**. **Ne plus suivre** le retire de la comparaison, sans rien effacer des réponses.' },
      { type: 'p', texte: 'Le bloc du bas, **Ajouter des concurrents**, prend un nom de marque par ligne. Un nom déjà suivi n’est pas ajouté deux fois.' },
      { type: 'h2', id: 'site', texte: 'Pourquoi déclarer le site d’un concurrent' },
      {
        type: 'liste',
        items: [
          'Ses pages citées lui sont attribuées : sur l’écran Sources, la colonne **À qui** les range en « concurrent suivi », et le bloc **À qui profitent les citations** les compte à part.',
          'Ses pages ne sont jamais proposées dans la liste de travail comme des pages « où apparaître » : on ne demande pas une place sur le site d’un rival.',
          'Sans site déclaré, l’outil reconnaît quand même un domaine dont le nom est celui du concurrent (comptalis.exemple pour Comptalis), ou un site classé comme site de marque appartenant à Comptalis. Déclarer le domaine lève le doute, sous-domaines compris.',
        ],
      },
      { type: 'h2', id: 'reperees', texte: 'Les marques repérées dans les réponses' },
      { type: 'p', texte: 'À droite, **Marques repérées dans les réponses** liste les douze marques que les IA d’interface nomment le plus sur vos questions, parmi celles qui ne sont ni suivies ni écartées. Pour chacune : le nombre de réponses et de questions où elle apparaît, et un bouton **Suivre**. Le compte porte sur tout l’historique, et sur les seules réponses dont les marques sont connues. **Toutes les marques repérées** ouvre l’écran Concurrents, où une marque sans intérêt s’écarte d’un clic sur **Ignorer**.' },
      { type: 'encadre', ton: 'savoir', titre: 'Une marque, plusieurs écritures', texte: 'Les IA n’écrivent pas toujours une marque de la même façon. L’outil compare les noms sans majuscules, accents ni ponctuation, et rattache au concurrent toute marque nommée qui contient son nom : « Devizo Facturation » compte pour Devizo. Il faut au moins trois lettres pour ce rapprochement.' },
      { type: 'h2', id: 'pas-a-pas', texte: 'Choisir les concurrents de Facturo' },
      {
        type: 'etapes',
        items: [
          { titre: 'Partir de ce que disent les IA', texte: 'Après le premier relevé, ouvrez l’onglet **Concurrents** et lisez **Marques repérées dans les réponses**. Ce sont les marques qui prennent la place de Facturo, pas celles qu’on imagine.' },
          { titre: 'Suivre trois à six marques', texte: 'Par exemple Comptalis, Devizo et Tikette, nommées sur beaucoup de questions. Une marque nommée une seule fois n’apprend pas grand-chose.' },
          { titre: 'Déclarer leurs sites', texte: 'Saisissez comptalis.exemple dans **Son site**, puis **Enregistrer**. Faites de même pour chacun.' },
          { titre: 'Écarter le bruit', texte: 'Sur l’écran Concurrents, **Ignorer** retire de la liste des marques repérées les noms sans rapport (un outil générique, un média). Elles restent comptées dans les réponses.' },
          { titre: 'Lire la comparaison', texte: 'La part de voix, le classement et le face-à-face se remplissent tout de suite. Voir [Concurrents et part de voix](doc:comprendre/concurrents).' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'Les marques nommées sont lues dans le texte par un petit modèle, sauf pour ChatGPT qui les renvoie lui-même : tant que les réponses ne sont pas lues, aucune marque n’est repérée. Un concurrent au nom très court ou très courant peut être rapproché à tort d’une autre marque. La part de voix ne compte que les concurrents suivis : une marque très citée mais non suivie n’y entre pas.' },
      {
        type: 'liens',
        items: [
          { page: 'comprendre/concurrents' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/concurrent-qui-s-installe' },
          { page: 'projet/questions' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'A tracked competitor is a brand the tool compares with yours, screen by screen. Without a tracked competitor, **Share of voice** cannot be computed (it would always be 100%), the head-to-head stays empty and the **Versus** filter of the top bar has nothing to offer. Tracking a brand costs nothing and starts no run: the numbers are computed from the answers already recorded.' },
      { type: 'p', texte: 'To get there: the **Competitors** tab of the project page, or the **Manage tracked competitors** button of the Competitors screen. A brand can also be tracked with one click on **Track**, wherever the tool lists brands mentioned: on the overview (**Mentioned instead of us**), on the Competitors screen (**Brands spotted, not tracked yet**) and in the report (**Brands mentioned for the first time**).' },
      { type: 'h2', id: 'tracked', texte: 'Tracked competitors' },
      { type: 'p', texte: 'One row per competitor. Its name opens the answers that mention it; below, the number of interface answers it is mentioned in, or “not mentioned yet”. The **Its site** field declares the competitor’s domain, with **Save**. **Stop tracking** removes it from the comparison, without deleting anything from the answers.' },
      { type: 'p', texte: 'The block at the bottom, **Add competitors**, takes one brand name per line. A name already tracked is not added twice.' },
      { type: 'h2', id: 'site', texte: 'Why declare a competitor’s site' },
      {
        type: 'liste',
        items: [
          'Its cited pages are attributed to it: on the Sources screen, the **Owner** column files them as “tracked competitor”, and the **Who gets the citations** block counts them separately.',
          'Its pages are never suggested in the work list as pages “to appear on”: you do not ask a rival for a spot on its own site.',
          'Without a declared site, the tool still recognises a domain named after the competitor (comptalis.exemple for Comptalis), or a site classified as a brand site owned by Comptalis. Declaring the domain removes the doubt, subdomains included.',
        ],
      },
      { type: 'h2', id: 'spotted', texte: 'Brands spotted in the answers' },
      { type: 'p', texte: 'On the right, **Brands spotted in the answers** lists the twelve brands the interface AIs mention most on your prompts, among those neither tracked nor dismissed. For each: the number of answers and prompts it appears in, and a **Track** button. The count covers the whole history, and only the answers whose brands are known. **All spotted brands** opens the Competitors screen, where an irrelevant brand is set aside with one click on **Dismiss**.' },
      { type: 'encadre', ton: 'savoir', titre: 'One brand, several spellings', texte: 'AIs do not always write a brand the same way. The tool compares names without case, accents or punctuation, and attaches to the competitor any brand mentioned that contains its name: “Devizo Invoicing” counts for Devizo. At least three letters are needed for this match.' },
      { type: 'h2', id: 'step-by-step', texte: 'Choosing Facturo’s competitors' },
      {
        type: 'etapes',
        items: [
          { titre: 'Start from what the AIs say', texte: 'After the first run, open the **Competitors** tab and read **Brands spotted in the answers**. These are the brands taking Facturo’s place, not the ones you imagine.' },
          { titre: 'Track three to six brands', texte: 'For example Comptalis, Devizo and Tikette, mentioned on many prompts. A brand mentioned only once tells you little.' },
          { titre: 'Declare their sites', texte: 'Enter comptalis.exemple in **Its site**, then **Save**. Do the same for each one.' },
          { titre: 'Set the noise aside', texte: 'On the Competitors screen, **Dismiss** removes unrelated names (a generic tool, a media outlet) from the list of spotted brands. They are still counted in the answers.' },
          { titre: 'Read the comparison', texte: 'Share of voice, the ranking and the head-to-head fill in at once. See [Competitors and share of voice](doc:comprendre/concurrents).' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'Brands mentioned are read from the text by a small model, except for ChatGPT, which returns them itself: until the answers are read, no brand is spotted. A competitor with a very short or very common name may be matched to another brand by mistake. Share of voice only counts tracked competitors: a brand that is often mentioned but not tracked does not enter it.' },
      {
        type: 'liens',
        items: [
          { page: 'comprendre/concurrents' },
          { page: 'cas/qui-est-cite-a-ma-place' },
          { page: 'cas/concurrent-qui-s-installe' },
          { page: 'projet/questions' },
        ],
      },
    ],
  },
}

export default page
