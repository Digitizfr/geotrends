import type { Moteur } from './fournisseurs/types'
import { compter, deMethode, ecart, recus, SEUIL_CHIFFRE, simple, type Compte, type Ecart, type Mesures, type QuestionLue, type ReleveLu, type SourceLue } from './mesures'
import { estALaMarque, estDuSite } from './releves'
import { groupeType, libelleType, teinteType, typeCertain, type TypeLu } from './sites'

/*
 * Classements tirés des mesures d'un projet : marques nommées, sites et pages
 * cités, vidéos et chaînes, Aperçus IA comparés à Google, idées de questions.
 * Fonctions pures : elles reçoivent les relevés à compter et ne lisent rien.
 *
 * Partout, l'interface est comptée d'un côté et l'API (Claude) de l'autre.
 */

// ── Marques ─────────────────────────────────────────────────────────────────

export type LigneMarque = {
  cle: string
  nom: string
  description: string | null
  aNous: boolean
  suivie: boolean
  ignoree: boolean
  /** Réponses d'interface qui nomment la marque. */
  reponses: number
  /** Réponses d'interface où elle est la première nommée. */
  premiere: number
  rangs: number[]
  rangMoyen: number | null
  questions: Map<string, string>
  moteurs: Set<Moteur>
  /** Réponses de Claude (API) qui la nomment : jamais ajoutées aux autres. */
  api: number
  positifs: number
  negatifs: number
  neutres: number
  releveIds: string[]
}

export type ClassementMarques = {
  lignes: LigneMarque[]
  /** Réponses d'interface dont les marques sont connues : la base des parts. */
  base: number
  baseApi: number
  /** Réponses reçues dont les marques ne sont pas encore lues. */
  nonLues: number
  /** Mentions de la marque et des concurrents suivis : le dénominateur de la part de voix. */
  mentionsSuivies: number
}

const vide = (cle: string, nom: string, x: Partial<LigneMarque> = {}): LigneMarque => ({
  cle, nom, description: null, aNous: false, suivie: false, ignoree: false, reponses: 0, premiere: 0, rangs: [], rangMoyen: null,
  questions: new Map(), moteurs: new Set(), api: 0, positifs: 0, negatifs: 0, neutres: 0, releveIds: [], ...x,
})

/** Retrouve le concurrent suivi derrière une écriture : « Pennylane Facturation » → « Pennylane ». */
export function concurrentDe(nom: string, m: Mesures) {
  const k = simple(nom)
  return m.concurrents.find((c) => {
    const ck = simple(c.nom)
    return ck.length >= 3 && (k === ck || k.includes(ck))
  })
}

export function estNotreNom(nom: string, m: Mesures) {
  const n = nom.toLowerCase()
  return [m.marque.nom, ...(m.marque.ecritures ?? [])].some((x) => x && n.includes(x.toLowerCase()))
}

/** Classement des marques nommées. Notre marque et les concurrents suivis y figurent même à zéro. */
export function classerMarques(m: Mesures, rs: ReleveLu[] = m.releves): ClassementMarques {
  const lignes = new Map<string, LigneMarque>()
  const nous = vide('nous', m.marque.nom, { aNous: true })
  lignes.set('nous', nous)
  for (const c of m.concurrents) lignes.set(`c:${simple(c.nom)}`, vide(`c:${simple(c.nom)}`, c.nom, { suivie: true }))
  let base = 0
  let baseApi = 0

  for (const r of recus(rs)) {
    if (!r.marquesLues) continue
    const api = r.methode === 'api'
    if (api) baseApi++
    else base++
    const vues = new Set<string>()
    let rang = 0
    for (const marque of r.marques) {
      const concurrent = concurrentDe(marque.nom, m)
      const cle = estNotreNom(marque.nom, m) ? 'nous' : concurrent ? `c:${simple(concurrent.nom)}` : simple(marque.nom)
      if (!cle || vues.has(cle)) continue
      vues.add(cle)
      rang++
      const x = lignes.get(cle) ?? vide(cle, marque.nom, { description: marque.description, ignoree: m.ignorees.includes(cle) })
      lignes.set(cle, x)
      if (api) {
        x.api++
        continue
      }
      x.reponses++
      x.rangs.push(rang)
      if (rang === 1) x.premiere++
      x.questions.set(r.question.id, r.question.texte)
      x.moteurs.add(r.moteur)
      x.releveIds.push(r.id)
      if (marque.ton === 'positif') x.positifs++
      else if (marque.ton === 'negatif') x.negatifs++
      else if (marque.ton) x.neutres++
    }
    // Notre nom trouvé dans le texte, même si la liste des marques ne le donne pas.
    if (!vues.has('nous') && r.p?.mentionnee) {
      if (api) nous.api++
      else {
        nous.reponses++
        nous.questions.set(r.question.id, r.question.texte)
        nous.moteurs.add(r.moteur)
        nous.releveIds.push(r.id)
      }
    }
  }
  const liste = [...lignes.values()]
  for (const l of liste) l.rangMoyen = l.rangs.length ? l.rangs.reduce((a, b) => a + b, 0) / l.rangs.length : null
  liste.sort((a, b) => b.reponses - a.reponses || b.api - a.api || (a.rangMoyen ?? 99) - (b.rangMoyen ?? 99) || a.nom.localeCompare(b.nom))
  return {
    lignes: liste,
    base,
    baseApi,
    nonLues: recus(rs).filter((r) => !r.marquesLues).length,
    mentionsSuivies: liste.filter((l) => l.aNous || l.suivie).reduce((n, l) => n + l.reponses, 0),
  }
}

/** Marque nommée en premier dans une réponse, ou null si les marques ne sont pas lues. */
export const premierNomme = (r: ReleveLu) => (r.marquesLues && r.marques.length ? r.marques[0].nom : null)

// ── Carte des thèmes ────────────────────────────────────────────────────────

export type EtatTheme = 'tenu' | 'dispute' | 'reprendre' | 'angle_mort' | 'tot'

export const ETATS_THEME: Record<EtatTheme, { libelle: string; signe: string; classe: string; regle: string }> = {
  tenu: { libelle: 'Tenu', signe: '●', classe: 'nomme', regle: 'la marque est dans 6 réponses sur 10 ou plus, et aucune autre marque n’y est nommée plus souvent' },
  dispute: { libelle: 'Disputé', signe: '◐', classe: 'cite', regle: 'la marque est présente, mais dans moins de 6 réponses sur 10, ou une autre marque y est nommée plus souvent' },
  reprendre: { libelle: 'À reprendre', signe: '○', classe: 'absent', regle: 'la marque est absente, alors qu’une autre marque est nommée dans 3 réponses sur 10 ou plus' },
  angle_mort: { libelle: 'Angle mort', signe: '◇', classe: 'neutre', regle: 'la marque est absente, et aucune marque n’atteint 3 réponses sur 10 : personne ne tient le thème' },
  tot: { libelle: 'Trop tôt pour dire', signe: '·', classe: 'sans', regle: `moins de ${SEUIL_CHIFFRE} réponses lues sur le thème` },
}

export type LigneTheme = {
  /** Le thème, ou null pour les questions sans étiquette. */
  theme: string | null
  questions: QuestionLue[]
  /** Réponses d'interface du thème : la marque y est-elle ? */
  c: Compte
  /** Réponses dont les marques sont lues : la base de la comparaison avec les autres marques. */
  base: number
  /** Nos mentions parmi ces réponses lues. */
  nous: number
  /** La marque la plus nommée après la nôtre, avec son nombre de réponses. */
  meilleure: { nom: string; reponses: number; suivie: boolean } | null
  etat: EtatTheme
}

/**
 * Carte des thèmes : pour chaque thème, où en est la marque face à la marque la
 * plus nommée. Relevés d'interface seulement, hors mesures approfondies. La
 * règle de chaque état est écrite dans ETATS_THEME et affichée sous le tableau.
 */
export function classerThemes(m: Mesures): LigneTheme[] {
  const groupes = new Map<string, QuestionLue[]>()
  for (const q of m.questions) groupes.set(q.theme ?? '', [...(groupes.get(q.theme ?? '') ?? []), q])
  return [...groupes.entries()]
    .map(([theme, questions]) => {
      const rs = deMethode(questions.flatMap((q) => q.releves), 'interface').filter((r) => !r.approfondi)
      const c = compter(rs)
      const marques = classerMarques(m, rs)
      const nous = marques.lignes.find((l) => l.aNous)?.reponses ?? 0
      const autre = marques.lignes.find((l) => !l.aNous && !l.ignoree && l.reponses > 0)
      const partNous = c.n ? c.k / c.n : 0
      const partAutre = autre && marques.base ? autre.reponses / marques.base : 0
      const etat: EtatTheme =
        c.n < SEUIL_CHIFFRE || marques.base < SEUIL_CHIFFRE ? 'tot'
        : c.k === 0 ? (partAutre >= 0.3 ? 'reprendre' : 'angle_mort')
        : partNous >= 0.6 && partNous >= partAutre ? 'tenu' : 'dispute'
      return { theme: theme || null, questions, c, base: marques.base, nous, meilleure: autre ? { nom: autre.nom, reponses: autre.reponses, suivie: autre.suivie } : null, etat }
    })
    .sort((a, b) => (a.theme === null ? 1 : 0) - (b.theme === null ? 1 : 0) || b.questions.length - a.questions.length || (a.theme ?? '').localeCompare(b.theme ?? ''))
}

// ── Sources ─────────────────────────────────────────────────────────────────

/** À qui profite une citation : à nous, à un concurrent suivi, à une autre marque, ou à un tiers. */
export type Appartenance = 'nous' | 'concurrent' | 'marque' | 'tiers'

export const APPARTENANCES: Record<Appartenance, { libelle: string; groupe: string; classe: string }> = {
  nous: { libelle: 'À nous', groupe: 'À nous', classe: 'cite' },
  concurrent: { libelle: 'Concurrent suivi', groupe: 'Concurrents suivis', classe: 'absent' },
  marque: { libelle: 'Autre marque', groupe: 'Autres marques', classe: 'sans' },
  tiers: { libelle: 'Tiers', groupe: 'Tiers', classe: 'neutre' },
}

const DISCUSSION = ['linkedin.com', 'facebook.com', 'instagram.com', 'x.com', 'twitter.com', 'tiktok.com', 'threads.net', 'threads.com', 'medium.com', 'reddit.com', 'quora.com', 'stackoverflow.com', 'stackexchange.com', 'trustpilot.com']
const hote = (domaine: string, liste: string[]) => liste.some((d) => domaine === d || domaine.endsWith(`.${d}`))
const nomDuDomaine = (domaine: string) => {
  const parties = domaine.split('.')
  return simple(parties.length >= 2 ? parties[parties.length - 2] : parties[0])
}

/**
 * Type d'un site. Dans l'ordre : le classement gardé en base (petit modèle, ou
 * correction à la main), puis les plateformes connues de tous, puis le site
 * dont le nom est celui d'une marque nommée dans les réponses. Tout le reste
 * s'affiche « à classer », jamais deviné.
 */
export function typeDeDomaine(domaine: string, m: Mesures, marquesNommees: Set<string>): TypeLu {
  if (estDuSite(domaine, m.marque)) return 'marque'
  const fiche = m.sites.get(domaine)
  if (fiche) return fiche.type
  const certain = typeCertain(domaine)
  if (certain) return certain
  const nom = nomDuDomaine(domaine)
  if (nom.length >= 3 && marquesNommees.has(nom)) return 'marque'
  return 'a_classer'
}

/** Fil de forum ou publication de réseau social : un endroit où l'on peut répondre. */
export const estDiscussion = (domaine: string, m?: Mesures) => hote(domaine, DISCUSSION) || /(^|\.)forums?\./.test(domaine) || ['forum', 'social'].includes(m?.sites.get(domaine)?.type ?? '')

function concurrentDuDomaine(domaine: string, m: Mesures) {
  const nom = nomDuDomaine(domaine)
  const fiche = m.sites.get(domaine)
  // La marque propriétaire relevée par le classement : « Brevo » pour brevo.com, help.brevo.com…
  const proprietaire = fiche?.type === 'marque' && fiche.marque ? simple(fiche.marque) : ''
  return m.concurrents.find((c) => {
    const k = simple(c.nom)
    return (c.domaine && (domaine === c.domaine || domaine.endsWith(`.${c.domaine}`))) || (k.length >= 3 && (k === nom || (!!proprietaire && (proprietaire === k || proprietaire.includes(k)))))
  })
}

/** À qui appartient un site : à nous, à un concurrent suivi, à une autre marque, ou à un tiers. */
export function appartenanceDuDomaine(domaine: string, m: Mesures, marquesNommees?: Set<string>): Appartenance {
  if (estDuSite(domaine, m.marque)) return 'nous'
  if (concurrentDuDomaine(domaine, m)) return 'concurrent'
  const fiche = m.sites.get(domaine)
  if (fiche) return fiche.type === 'marque' ? 'marque' : 'tiers'
  if (typeCertain(domaine)) return 'tiers'
  return marquesNommees && nomDuDomaine(domaine).length >= 3 && marquesNommees.has(nomDuDomaine(domaine)) ? 'marque' : 'tiers'
}

/** À qui profite une citation. Une vidéo de YouTube appartient à la chaîne qui l'a publiée. */
export function appartenance(s: Pick<SourceLue, 'domaine' | 'role' | 'videoYoutube' | 'url'>, m: Mesures, marquesNommees?: Set<string>): Appartenance {
  if (estALaMarque(s, m.marque)) return 'nous'
  return appartenanceDuDomaine(s.domaine, m, marquesNommees)
}

/** Marques nommées dans les réponses du projet, en écriture simplifiée : sert à reconnaître un site de marque pas encore classé. */
export function marquesNommees(m: Mesures): Set<string> {
  const nommees = new Set<string>()
  for (const r of m.tous) for (const x of r.marques) nommees.add(simple(x.nom))
  for (const c of m.concurrents) nommees.add(simple(c.nom))
  return nommees
}

export type LignePage = {
  url: string
  domaine: string
  titre: string | null
  qui: Appartenance
  type: TypeLu
  video: SourceLue['videoYoutube']
  /** Réponses d'interface qui citent la page. */
  releves: ReleveLu[]
  /** Dont celles où la marque est absente. */
  sansNous: number
  moteurs: Set<Moteur>
  questions: Map<string, string>
  /** Réponses de Claude (API) qui la citent. */
  api: ReleveLu[]
}

export type LigneDomaine = {
  domaine: string
  qui: Appartenance
  type: TypeLu
  /** Marque propriétaire relevée par le classement, pour un site de marque. */
  marque: string | null
  reponses: Set<string>
  moteurs: Set<Moteur>
  questions: Map<string, string>
  api: Set<string>
  pages: Set<string>
  citations: number
}

export type ClassementSources = {
  domaines: LigneDomaine[]
  pages: LignePage[]
  /** Citations d'interface (une par source affichée), réparties par bénéficiaire puis par type. */
  citations: number
  repartition: { cle: string; libelle: string; qui: Appartenance; type: TypeLu | null; n: number }[]
  /** Sites cités dont le type n'est pas encore connu. */
  aClasser: number
  /** Réponses d'interface comptées. */
  base: number
  baseApi: number
}

/** Sites et pages cités. Une page de YouTube appartient à la chaîne qui l'a publiée. */
export function classerSources(m: Mesures, rs: ReleveLu[] = m.releves): ClassementSources {
  const nommees = marquesNommees(m)

  const domaines = new Map<string, LigneDomaine>()
  const pages = new Map<string, LignePage>()
  const parts = new Map<string, { cle: string; libelle: string; qui: Appartenance; type: TypeLu | null; n: number }>()
  let citations = 0
  const ok = recus(rs)

  for (const r of ok) {
    const api = r.methode === 'api'
    for (const s of r.sources) {
      if (s.role !== 'citee' || !s.domaine) continue
      const qui = appartenance(s, m, nommees)
      // Une vidéo de YouTube reste une vidéo, quelle que soit la chaîne.
      const type: TypeLu = s.videoYoutube ? 'video' : typeDeDomaine(s.domaine, m, nommees)
      const d = domaines.get(s.domaine) ?? {
        domaine: s.domaine, type: typeDeDomaine(s.domaine, m, nommees), marque: m.sites.get(s.domaine)?.marque ?? null,
        qui: appartenanceDuDomaine(s.domaine, m, nommees),
        reponses: new Set<string>(), moteurs: new Set<Moteur>(), questions: new Map<string, string>(), api: new Set<string>(), pages: new Set<string>(), citations: 0,
      }
      domaines.set(s.domaine, d)
      const p = pages.get(s.url) ?? {
        url: s.url, domaine: s.domaine, titre: s.videoYoutube?.titre ?? s.titre, qui, type, video: s.videoYoutube,
        releves: [], sansNous: 0, moteurs: new Set<Moteur>(), questions: new Map<string, string>(), api: [],
      }
      pages.set(s.url, p)
      d.pages.add(s.url)
      if (api) {
        d.api.add(r.id)
        if (!p.api.includes(r)) p.api.push(r)
        continue
      }
      citations++
      d.citations++
      d.reponses.add(r.id)
      d.moteurs.add(r.moteur)
      d.questions.set(r.question.id, r.question.texte)
      if (!p.releves.includes(r)) {
        p.releves.push(r)
        if (!r.present) p.sansNous++
      }
      p.moteurs.add(r.moteur)
      p.questions.set(r.question.id, r.question.texte)
      const cle = qui === 'tiers' ? `tiers:${type}` : qui
      const libelle = qui === 'tiers' ? groupeType(type) : APPARTENANCES[qui].groupe
      const x = parts.get(cle) ?? { cle, libelle, qui, type: qui === 'tiers' ? type : null, n: 0 }
      x.n++
      parts.set(cle, x)
    }
  }
  const ordre = { nous: 0, concurrent: 1, marque: 2, tiers: 3 }
  return {
    domaines: [...domaines.values()].sort((a, b) => b.reponses.size - a.reponses.size || b.api.size - a.api.size || a.domaine.localeCompare(b.domaine)),
    pages: [...pages.values()].sort((a, b) => b.releves.length - a.releves.length || b.moteurs.size - a.moteurs.size || b.api.length - a.api.length || a.url.localeCompare(b.url)),
    citations,
    repartition: [...parts.values()].sort((a, b) => ordre[a.qui] - ordre[b.qui] || (a.cle === 'tiers:a_classer' ? 1 : 0) - (b.cle === 'tiers:a_classer' ? 1 : 0) || b.n - a.n),
    aClasser: [...domaines.values()].filter((d) => d.type === 'a_classer').length,
    base: deMethode(ok, 'interface').length,
    baseApi: deMethode(ok, 'api').length,
  }
}

/** Type écrit pour l'écran : « site de la marque » pour nos propres sites. */
export const typeEcrit = (type: TypeLu, qui: Appartenance) => (qui === 'nous' && type !== 'video' ? 'site de la marque' : libelleType(type))

/** Teinte d'une part de la barre « à qui profitent les citations » : la même sur tous les écrans. */
export const teinteDePart = (r: { qui: Appartenance; type: TypeLu | null }) =>
  r.qui === 'nous' ? 'teinte-nous' : r.qui === 'concurrent' ? 'teinte-concurrent' : r.qui === 'marque' ? 'teinte-marque' : teinteType(r.type ?? 'a_classer')

// ── Sources qui montent et qui descendent ───────────────────────────────────

export type Mouvement = {
  cle: string
  titre: string | null
  domaine: string
  /** Réponses comparables qui citent la source, à l'avant-dernier puis au dernier relevé. */
  avant: number
  apres: number
  /** L'écart, jugé contre la marge d'erreur des deux échantillons. */
  e: Ecart | null
}

export type Mouvements = {
  jourAvant: string
  jourApres: string
  /** Couples question × IA qui ont une réponse aux deux dates : la base de la comparaison. */
  paires: number
  sites: { nouveaux: Mouvement[]; perdus: Mouvement[]; hausse: Mouvement[]; baisse: Mouvement[]; tous: Map<string, Mouvement> }
  pages: { nouveaux: Mouvement[]; perdus: Mouvement[]; hausse: Mouvement[]; baisse: Mouvement[]; tous: Map<string, Mouvement> }
}

/**
 * Compare le dernier jour de relevé au précédent : sources nouvelles, perdues,
 * en hausse, en baisse. Relevés d'interface seulement. On ne compare que les
 * couples question × IA qui ont une réponse aux deux dates : sinon, une source
 * paraîtrait « perdue » parce qu'une question n'a pas été reposée.
 */
export function classerMouvements(m: Mesures, rs: ReleveLu[] = m.releves): Mouvements | null {
  const ui = recus(deMethode(rs, 'interface')).filter((r) => !r.approfondi)
  const jours = [...new Set(ui.map((r) => r.jour))].sort()
  if (jours.length < 2) return null
  const jourAvant = jours.at(-2)!
  const jourApres = jours.at(-1)!
  // Dernier relevé du jour pour chaque couple question × IA.
  const duJour = (jour: string) => {
    const x = new Map<string, ReleveLu>()
    for (const r of ui) if (r.jour === jour) x.set(`${r.question.id}:${r.moteur}`, r)
    return x
  }
  const avant = duJour(jourAvant)
  const apres = duJour(jourApres)
  const communs = [...apres.keys()].filter((k) => avant.has(k))
  const paires = communs.length
  if (paires === 0) return null

  const compter = (cleDe: (s: SourceLue) => string) => {
    const lignes = new Map<string, Mouvement>()
    const noter = (r: ReleveLu, cote: 'avant' | 'apres') => {
      const vues = new Set<string>()
      for (const s of r.sources) {
        if (s.role !== 'citee' || !s.domaine) continue
        const cle = cleDe(s)
        if (vues.has(cle)) continue
        vues.add(cle)
        const x = lignes.get(cle) ?? { cle, titre: s.videoYoutube?.titre ?? s.titre, domaine: s.domaine, avant: 0, apres: 0, e: null }
        x[cote]++
        lignes.set(cle, x)
      }
    }
    for (const k of communs) {
      noter(avant.get(k)!, 'avant')
      noter(apres.get(k)!, 'apres')
    }
    for (const x of lignes.values()) x.e = ecart({ k: x.avant, n: paires }, { k: x.apres, n: paires })
    const liste = [...lignes.values()]
    const tri = (a: Mouvement, b: Mouvement) => Math.abs(b.apres - b.avant) - Math.abs(a.apres - a.avant) || Math.max(b.apres, b.avant) - Math.max(a.apres, a.avant) || a.cle.localeCompare(b.cle)
    return {
      nouveaux: liste.filter((x) => x.avant === 0 && x.apres > 0).sort(tri),
      perdus: liste.filter((x) => x.avant > 0 && x.apres === 0).sort(tri),
      hausse: liste.filter((x) => x.avant > 0 && x.apres > x.avant).sort(tri),
      baisse: liste.filter((x) => x.apres > 0 && x.apres < x.avant).sort(tri),
      tous: lignes,
    }
  }
  return { jourAvant, jourApres, paires, sites: compter((s) => s.domaine), pages: compter((s) => s.url) }
}

/** Nos pages : citées, lues sans être citées, et ce qui a été cité à leur place. */
export function classerNosPages(m: Mesures, rs: ReleveLu[] = m.releves) {
  type Ligne = { url: string; titre: string | null; citee: ReleveLu[]; lue: ReleveLu[]; google: { rang: number; question: { id: string; texte: string } }[]; aLaPlace: Map<string, number> }
  const pages = new Map<string, Ligne>()
  const ligne = (url: string, titre: string | null) => {
    const x = pages.get(url) ?? { url, titre, citee: [], lue: [], google: [], aLaPlace: new Map<string, number>() }
    pages.set(url, x)
    return x
  }
  for (const r of deMethode(rs, 'interface')) {
    if (r.statut !== 'recu' && r.statut !== 'vide') continue
    for (const g of r.resultatsGoogle) {
      if (estDuSite(g.domaine, m.marque)) ligne(g.url, g.titre).google.push({ rang: g.rang, question: r.question })
    }
    if (r.statut !== 'recu') continue
    const citees = r.sources.filter((s) => s.role === 'citee')
    for (const s of r.sources) {
      if (!estALaMarque(s, m.marque)) continue
      const x = ligne(s.url, s.videoYoutube?.titre ?? s.titre)
      if (s.role === 'citee') x.citee.push(r)
      else {
        x.lue.push(r)
        // Ce que l'IA a cité à la place de notre page, dans la même réponse.
        for (const c of citees.slice(0, 5)) x.aLaPlace.set(c.url, (x.aLaPlace.get(c.url) ?? 0) + 1)
      }
    }
  }
  return [...pages.values()].sort((a, b) => b.citee.length - a.citee.length || b.lue.length - a.lue.length || a.url.localeCompare(b.url))
}

// ── Vidéos et chaînes ───────────────────────────────────────────────────────

/** Moment cité dans une adresse YouTube (« t=153s », « t=2m33s »), en secondes. */
export function momentDe(url: string): number | null {
  try {
    const t = new URL(url).searchParams.get('t') ?? new URL(url).searchParams.get('start')
    if (!t) return null
    if (/^\d+s?$/.test(t)) return Number.parseInt(t, 10)
    const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
    if (!m) return null
    const s = Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0)
    return s > 0 ? s : null
  } catch {
    return null
  }
}

export const dureeLisible = (s: number) => (s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min` : s >= 60 ? `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')}` : `${s} s`)

export type LigneVideo = {
  id: string
  titre: string
  chaineId: string
  chaineNom: string
  aNous: boolean
  vues: number | null
  publieLe: Date | null
  citations: { releve: ReleveLu; url: string; moment: number | null }[]
  questions: Map<string, string>
  moteurs: Set<Moteur>
}

/** Vidéos YouTube citées, toutes méthodes confondues mais chaque citation garde son IA. */
export function classerVideos(m: Mesures, rs: ReleveLu[] = m.releves) {
  const videos = new Map<string, LigneVideo>()
  for (const r of recus(rs)) {
    for (const s of r.sources) {
      if (s.role !== 'citee' || !s.videoYoutube) continue
      const v = s.videoYoutube
      const x = videos.get(v.id) ?? {
        id: v.id, titre: v.titre, chaineId: v.chaineId, chaineNom: v.chaineNom, aNous: m.marque.chainesYoutube.some((c) => c.id === v.chaineId),
        vues: v.vues, publieLe: v.publieLe, citations: [], questions: new Map<string, string>(), moteurs: new Set<Moteur>(),
      }
      videos.set(v.id, x)
      x.citations.push({ releve: r, url: s.url, moment: momentDe(s.url) })
      x.questions.set(r.question.id, r.question.texte)
      x.moteurs.add(r.moteur)
    }
  }
  const liste = [...videos.values()].sort((a, b) => b.citations.length - a.citations.length || a.titre.localeCompare(b.titre))
  const chaines = new Map<string, { id: string; nom: string; aNous: boolean; videos: LigneVideo[]; citations: number; questions: Map<string, string>; moteurs: Set<Moteur> }>()
  for (const v of liste) {
    const c = chaines.get(v.chaineId) ?? { id: v.chaineId, nom: v.chaineNom, aNous: v.aNous, videos: [], citations: 0, questions: new Map<string, string>(), moteurs: new Set<Moteur>() }
    chaines.set(v.chaineId, c)
    c.videos.push(v)
    c.citations += v.citations.length
    for (const [id, texte] of v.questions) c.questions.set(id, texte)
    for (const x of v.moteurs) c.moteurs.add(x)
  }
  return { videos: liste, chaines: [...chaines.values()].sort((a, b) => b.citations - a.citations || a.nom.localeCompare(b.nom)) }
}

// ── Aperçus IA comparés aux résultats de Google ─────────────────────────────

export type Diagnostic = 'tenu' | 'reformuler' | 'rare' | 'referencement' | 'sans_apercu' | 'jamais'

export const DIAGNOSTICS: Record<Diagnostic, { court: string; consigne: string }> = {
  tenu: { court: 'Tenu, à surveiller', consigne: 'Dans les 10 premiers et cité par l’Aperçu.' },
  reformuler: { court: 'Page à reformuler', consigne: 'Dans les 10 premiers, mais pas cité : la page est trouvée, il lui manque une réponse nette.' },
  rare: { court: 'Rare, à comprendre', consigne: 'Cité par l’Aperçu sans être dans les 10 premiers.' },
  referencement: { court: 'D’abord du référencement classique', consigne: 'Ni dans les 10 premiers, ni cité.' },
  sans_apercu: { court: 'Pas d’Aperçu : à ne pas travailler pour Google', consigne: 'Google n’affiche pas d’Aperçu IA sur cette question.' },
  jamais: { court: 'Pas encore relevé', consigne: 'Les Aperçus IA n’ont pas été relevés pour cette question.' },
}

export type LigneApercu = {
  question: { id: string; texte: string }
  /** Relevés des Aperçus IA aboutis (affichés ou non). */
  total: number
  affiches: number
  /** Aperçus affichés qui citent une page ou une vidéo à nous. */
  nousCites: number
  /** Détail du dernier relevé abouti. */
  dernier: ReleveLu | null
  notreRang: number | null
  notrePage: string | null
  resultats: number
  sources: number
  sourcesDansTop: number
  video: boolean
  diagnostic: Diagnostic
}

export function classerApercus(m: Mesures): LigneApercu[] {
  return m.questions.map((q) => {
    const rs = q.releves.filter((r) => r.moteur === 'google_ai_overview' && (r.statut === 'recu' || r.statut === 'vide'))
    const affiches = rs.filter((r) => r.statut === 'recu')
    const dernier = rs.at(-1) ?? null
    const top = dernier?.resultatsGoogle ?? []
    const domainesTop = new Set(top.map((t) => t.domaine))
    const citees = dernier?.statut === 'recu' ? [...new Set(dernier.sources.filter((s) => s.role === 'citee').map((s) => s.domaine))] : []
    const nous = top.find((t) => estDuSite(t.domaine, m.marque))
    const nousCites = affiches.filter((r) => r.p?.citeeSite || r.p?.citeeYoutube).length
    const cite = dernier?.statut === 'recu' && !!(dernier.p?.citeeSite || dernier.p?.citeeYoutube)
    const diagnostic: Diagnostic =
      !dernier ? 'jamais'
      : dernier.statut !== 'recu' ? 'sans_apercu'
      : nous ? (cite ? 'tenu' : 'reformuler')
      : cite ? 'rare' : 'referencement'
    return {
      question: { id: q.id, texte: q.texte },
      total: rs.length,
      affiches: affiches.length,
      nousCites,
      dernier,
      notreRang: nous?.rang ?? null,
      notrePage: nous?.url ?? null,
      resultats: top.length,
      sources: citees.length,
      sourcesDansTop: citees.filter((d) => domainesTop.has(d)).length,
      video: dernier?.statut === 'recu' && dernier.sources.some((s) => s.role === 'citee' && !!s.videoYoutube),
      diagnostic,
    }
  })
}

// ── Idées de questions ──────────────────────────────────────────────────────

export type Idee = { texte: string; origine: 'google' | 'ia'; fois: number; vuPour: Map<string, string>; moteurs: Set<Moteur> }

/** « Autres questions posées » de Google et recherches lancées par les IA, les plus fréquentes d'abord. */
export function classerIdees(m: Mesures, rs: ReleveLu[] = m.tous) {
  const suivies = new Set([...m.questions.map((q) => q.texte), ...m.archivees.map((q) => q.texte)].map((t) => t.toLowerCase().trim()))
  const idees = new Map<string, Idee>()
  const noter = (texte: string, origine: 'google' | 'ia', r: ReleveLu) => {
    const cle = `${origine}:${texte.toLowerCase().trim()}`
    if (suivies.has(texte.toLowerCase().trim())) return
    const x = idees.get(cle) ?? { texte: texte.trim(), origine, fois: 0, vuPour: new Map<string, string>(), moteurs: new Set<Moteur>() }
    idees.set(cle, x)
    x.fois++
    x.vuPour.set(r.question.id, r.question.texte)
    x.moteurs.add(r.moteur)
  }
  for (const r of rs) {
    for (const t of r.questionsAssociees) noter(t, 'google', r)
    for (const t of r.recherches) noter(t, 'ia', r)
  }
  const tri = (a: Idee, b: Idee) => b.fois - a.fois || b.vuPour.size - a.vuPour.size || a.texte.localeCompare(b.texte)
  const toutes = [...idees.values()]
  return { google: toutes.filter((i) => i.origine === 'google').sort(tri), ia: toutes.filter((i) => i.origine === 'ia').sort(tri) }
}
