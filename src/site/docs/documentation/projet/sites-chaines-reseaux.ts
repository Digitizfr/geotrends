import type { PageDoc } from '../../types'

// Onglet « Marque et propriétés » de /projets/[id] (Ajouts.tsx, Detection.tsx),
// src/lib/profils.ts, src/lib/detection-profils.ts, src/lib/youtube.ts et la
// règle de présence de src/lib/releves.ts (estDuSite, estDeLaChaine, estDuProfil).
const page: PageDoc = {
  id: 'projet/sites-chaines-reseaux',
  rubrique: 'projet',
  slug: { fr: 'projet/sites-chaines-reseaux', en: 'project/sites-channels-profiles' },
  titre: { fr: 'Sites, chaînes YouTube et réseaux sociaux', en: 'Sites, YouTube channels and social profiles' },
  resume: {
    fr: 'Déclarer ce qui appartient à la marque : sites, chaînes YouTube, profils sociaux, autres écritures du nom. Une citation de l’un d’eux compte alors pour elle.',
    en: 'Declare what belongs to the brand: its sites, YouTube channels, social profiles and other spellings of its name. A citation of any of them counts for the brand.',
  },
  ecrans: ['/projets/[id]'],
  maj: '2026-11-18',
  contenu: {
    fr: [
      { type: 'p', texte: 'Une marque ne se limite pas à son site. Quand une IA cite une vidéo de la chaîne Facturo Academy, ou la page LinkedIn de Facturo, c’est une citation de la marque. Encore faut-il que l’outil sache que cette chaîne et ce profil sont les siens : sinon la vidéo compte pour youtube.com, donc pour quelqu’un d’autre. Cet onglet sert à le lui dire.' },
      { type: 'p', texte: 'Pour y aller : l’onglet **Marque et propriétés** de la fiche du projet, ou le lien du même nom sur la carte du projet, dans l’écran Projets. Les boutons **Déclarer une chaîne** et **Gérer les chaînes** de l’écran Vidéos et chaînes y mènent aussi. Les mêmes champs existent à la création du projet.' },
      { type: 'capture', nom: 'projet', legende: 'La fiche du projet Facturo, avec ses onglets : Relevés, Questions, Marque et propriétés, Concurrents, Réglages du projet.' },
      { type: 'h2', id: 'ce-qui-appartient', texte: 'Ce qui appartient à la marque' },
      { type: 'p', texte: 'Le tableau liste tout ce qui est déclaré, avec ce que chaque propriété a rapporté sur tout l’historique des relevés d’interface. La première ligne est toujours le **Nom de la marque**, avec le nombre de réponses qui le nomment.' },
      {
        type: 'tableau',
        colonnes: ['Type', 'Ce qu’il faut saisir', 'Ce qui compte pour la marque'],
        lignes: [
          ['**Site**', 'Un domaine par ligne. Une adresse complète convient : seul le domaine est gardé (« https://www.facturo.exemple/tarifs » devient facturo.exemple).', 'Toute page du domaine et de ses sous-domaines (blog.facturo.exemple) citée comme source.'],
          ['**Chaîne YouTube**', 'L’adresse de la chaîne, ou son nom précédé de @ (« @FacturoAcademy »). L’outil la retrouve sur YouTube et garde son vrai nom.', 'Toute vidéo publiée par la chaîne et citée comme source. Chaque vidéo citée est rattachée à sa chaîne par l’API publique de YouTube, gratuite.'],
          ['**Réseau social**', 'L’adresse du profil : LinkedIn (page d’entreprise ou profil), Instagram, Facebook, X, TikTok, Pinterest, Threads, Bluesky ou GitHub.', 'Le profil et les pages placées sous son adresse. Ils comptent comme une page du site, dans la colonne **Site cité**.'],
          ['**Écriture du nom**', 'Un sigle, le nom sans espace, une ancienne marque. Une par ligne.', 'Le texte des réponses, comme le nom de la marque.'],
        ],
      },
      { type: 'p', texte: 'La colonne **Ce qu’elle a rapporté** dit, pour un site, une chaîne ou un profil, dans combien de réponses il est cité ; pour une écriture du nom, dans combien de réponses elle est écrite. Une propriété qui n’a rien rapporté le dit aussi : « citée dans aucune réponse ». Sans rien de déclaré, l’onglet le rappelle : seule la mention du nom est repérée.' },
      { type: 'encadre', ton: 'savoir', titre: 'Tout se recalcule, y compris le passé', texte: 'Les chiffres sont tirés des réponses gardées en base. Une propriété ajoutée compte aussitôt pour tous les relevés déjà faits, et une propriété retirée cesse de compter partout, historique compris : la fenêtre de confirmation de **Retirer** le dit. Rien n’est repayé.' },
      { type: 'h2', id: 'ajouter', texte: 'Ajouter une propriété' },
      { type: 'p', texte: 'Le bloc **Ajouter une propriété** a quatre champs : **Sites de la marque**, **Chaînes YouTube**, **Réseaux sociaux** et **Autres écritures du nom**, une saisie par ligne. Après **Ajouter**, l’outil dit ce qu’il a compris : **Reconnu et ajouté**, avec le domaine nettoyé et le vrai nom de chaque chaîne ; **Déjà déclaré, écarté** ; **Non reconnu**, avec la saisie à vérifier. Un bouton de partage ou l’adresse d’une publication n’est pas pris pour un profil.' },
      { type: 'h3', id: 'detecter', texte: 'Détecter depuis le site' },
      { type: 'p', texte: 'Le bouton **Détecter depuis le site** lit la page d’accueil des sites saisis, ou des sites déjà déclarés si le champ est vide. Il y cherche les liens vers des profils sociaux et vers des chaînes YouTube, ainsi que le balisage « sameAs », la liste officielle des profils d’un site, dont les profils passent en tête. Ce qui est trouvé s’ajoute aux champs, sans être enregistré : vous relisez, vous retirez ce qui ne va pas, puis vous cliquez sur **Ajouter**. Ce qui est déjà déclaré n’est pas reproposé. La lecture est gratuite.' },
      { type: 'encadre', ton: 'conseil', titre: 'Relire avant d’ajouter', texte: 'Une page d’accueil contient souvent des comptes personnels à côté de ceux de la marque : le profil X du fondateur, la page LinkedIn d’un salarié. Déclarés, ils compteraient comme des citations de la marque. Ne gardez que les comptes de Facturo.' },
      { type: 'h2', id: 'presence', texte: 'Comment la marque est reconnue dans une réponse' },
      {
        type: 'liste',
        items: [
          '**Citée** : une page d’un site déclaré, une page sous un profil déclaré ou une vidéo d’une chaîne déclarée figure parmi les sources citées.',
          '**Nommée** : le nom de la marque, une de ses autres écritures ou un de ses domaines apparaît dans le texte. Le nom est cherché comme un mot entier, sans tenir compte des majuscules.',
          '**Lue** : une de ses pages a été ouverte par l’IA sans être citée. Seuls ChatGPT et Claude donnent ces pages lues.',
        ],
      },
      { type: 'h2', id: 'pas-a-pas', texte: 'Déclarer les propriétés de Facturo' },
      {
        type: 'etapes',
        items: [
          { titre: 'Ouvrir l’onglet Marque et propriétés', texte: 'Depuis la fiche du projet Facturo.' },
          { titre: 'Saisir les sites', texte: 'facturo.exemple, et tout autre domaine de la marque (un site d’aide séparé, par exemple). Un sous-domaine est déjà couvert par son domaine.' },
          { titre: 'Lancer la détection', texte: '**Détecter depuis le site** remplit les champs des chaînes et des réseaux. Gardez la chaîne Facturo, la chaîne Facturo Academy, les profils LinkedIn et Instagram de la marque ; retirez le reste.' },
          { titre: 'Ajouter les autres écritures', texte: 'Par exemple « Facturo.app » ou un ancien nom, si les IA l’emploient encore.' },
          { titre: 'Cliquer sur Ajouter et lire le bilan', texte: 'Vérifiez la ligne **Non reconnu** : une adresse mal copiée ou une chaîne introuvable s’y retrouve.' },
        ],
      },
      { type: 'h2', id: 'limites', texte: 'Limites' },
      { type: 'encadre', ton: 'limite', texte: 'La détection ne lit que la page d’accueil, sans exécuter son JavaScript : un lien affiché après coup lui échappe. Une publication dont l’adresse ne contient pas le nom du profil (instagram.com/p/…, linkedin.com/posts/…) n’est pas reconnue comme une page de la marque. La reconnaissance des chaînes et le rattachement des vidéos passent par l’API publique de YouTube : sans sa clé, une chaîne saisie reste « non reconnue » (l’état de la clé se lit dans Réglages). Les pages lues sans être citées ne sont connues que pour ChatGPT et Claude.' },
      {
        type: 'liens',
        items: [
          { page: 'comprendre/videos' },
          { page: 'comprendre/sources' },
          { page: 'cas/citee-nommee-ou-absente' },
          { page: 'projet/concurrents' },
        ],
      },
    ],
    en: [
      { type: 'p', texte: 'A brand is more than its website. When an AI cites a video from the Facturo Academy channel, or Facturo’s LinkedIn page, that is a citation of the brand. But the tool has to know that this channel and this profile are the brand’s: otherwise the video counts for youtube.com, in other words for someone else. This tab is where you tell it.' },
      { type: 'p', texte: 'To get there: the **Brand and properties** tab of the project page, or the link of the same name on the project card in the Projects screen. The **Declare a channel** and **Manage channels** buttons of the Videos & channels screen lead there too. The same fields exist when creating the project.' },
      { type: 'capture', nom: 'projet', legende: 'The page of the Facturo UK project, with its tabs: Runs, Prompts, Brand and properties, Competitors, Project settings.' },
      { type: 'h2', id: 'what-belongs', texte: 'What belongs to the brand' },
      { type: 'p', texte: 'The table lists everything declared, with what each property brought over the whole history of interface readings. The first row is always the **Brand name**, with the number of answers that mention it.' },
      {
        type: 'tableau',
        colonnes: ['Type', 'What to enter', 'What counts for the brand'],
        lignes: [
          ['**Site**', 'One domain per line. A full address works: only the domain is kept (“https://www.facturo.exemple/pricing” becomes facturo.exemple).', 'Any page of the domain and its subdomains (blog.facturo.exemple) cited as a source.'],
          ['**YouTube channel**', 'The channel’s address, or its handle with @ (“@FacturoAcademy”). The tool looks it up on YouTube and keeps its real name.', 'Any video published by the channel and cited as a source. Each cited video is linked to its channel through YouTube’s public API, which is free.'],
          ['**Social network**', 'The profile address: LinkedIn (company page or profile), Instagram, Facebook, X, TikTok, Pinterest, Threads, Bluesky or GitHub.', 'The profile and the pages under its address. They count as a page of the site, in the **Site cited** column.'],
          ['**Name spelling**', 'An acronym, the name without spaces, a former brand name. One per line.', 'The text of the answers, like the brand name.'],
        ],
      },
      { type: 'p', texte: 'The **What it brought** column says, for a site, a channel or a profile, in how many answers it is cited; for a name spelling, in how many answers it is written. A property that brought nothing says so too: “cited in no answer”. With nothing declared, the tab reminds you: only mentions of the name are detected.' },
      { type: 'encadre', ton: 'savoir', titre: 'Everything is recalculated, the past included', texte: 'The numbers are drawn from the answers kept in the database. An added property counts at once for every run already made, and a removed property stops counting everywhere, history included: the **Remove** confirmation says so. Nothing is paid again.' },
      { type: 'h2', id: 'add', texte: 'Adding a property' },
      { type: 'p', texte: 'The **Add a property** block has four fields: **Brand sites**, **YouTube channels**, **Social networks** and **Other spellings of the name**, one entry per line. After **Add**, the tool says what it understood: **Recognised and added**, with the cleaned domain and the real name of each channel; **Already declared, skipped**; **Not recognised**, with the entry to check. A share button or the address of a post is not taken for a profile.' },
      { type: 'h3', id: 'detect', texte: 'Detect from the site' },
      { type: 'p', texte: 'The **Detect from the site** button reads the home page of the sites you typed, or of the sites already declared if the field is empty. It looks for links to social profiles and YouTube channels, and for the “sameAs” markup, a site’s official list of its profiles, whose entries come first. What it finds is added to the fields without being saved: you review, remove what is wrong, then click **Add**. Anything already declared is not suggested again. Reading is free.' },
      { type: 'encadre', ton: 'conseil', titre: 'Review before adding', texte: 'A home page often carries personal accounts next to the brand’s: the founder’s X profile, an employee’s LinkedIn page. Once declared, they would count as citations of the brand. Keep only Facturo’s accounts.' },
      { type: 'h2', id: 'presence', texte: 'How the brand is recognised in an answer' },
      {
        type: 'liste',
        items: [
          '**Cited**: a page of a declared site, a page under a declared profile or a video of a declared channel is among the cited sources.',
          '**Mentioned**: the brand name, one of its other spellings or one of its domains appears in the text. The name is matched as a whole word, regardless of case.',
          '**Read**: one of its pages was opened by the AI without being cited. Only ChatGPT and Claude expose these pages read.',
        ],
      },
      { type: 'h2', id: 'step-by-step', texte: 'Declaring Facturo’s properties' },
      {
        type: 'etapes',
        items: [
          { titre: 'Open the Brand and properties tab', texte: 'From the Facturo UK project page.' },
          { titre: 'Enter the sites', texte: 'facturo.exemple, and any other domain of the brand (a separate help site, for example). A subdomain is already covered by its domain.' },
          { titre: 'Run the detection', texte: '**Detect from the site** fills the channel and network fields. Keep the Facturo channel, the Facturo Academy channel, the brand’s LinkedIn and Instagram profiles; remove the rest.' },
          { titre: 'Add the other spellings', texte: 'For example “Facturo.app” or a former name, if the AIs still use it.' },
          { titre: 'Click Add and read the summary', texte: 'Check the **Not recognised** line: a badly copied address or a channel that cannot be found ends up there.' },
        ],
      },
      { type: 'h2', id: 'limits', texte: 'Limits' },
      { type: 'encadre', ton: 'limite', texte: 'Detection only reads the home page, without running its JavaScript: a link displayed later escapes it. A post whose address does not contain the profile name (instagram.com/p/…, linkedin.com/posts/…) is not recognised as a page of the brand. Recognising channels and linking videos go through YouTube’s public API: without its key, a channel you enter stays “not recognised” (the key status is shown in Settings). Pages read without being cited are only known for ChatGPT and Claude.' },
      {
        type: 'liens',
        items: [
          { page: 'comprendre/videos' },
          { page: 'comprendre/sources' },
          { page: 'cas/citee-nommee-ou-absente' },
          { page: 'projet/concurrents' },
        ],
      },
    ],
  },
}

export default page
