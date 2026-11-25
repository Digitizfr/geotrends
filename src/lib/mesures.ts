import { cache } from 'react'
import { prisma } from './prisma'
import { lireFiltres, type Filtres } from './filtres'
import { MOTEURS, type Moteur } from './fournisseurs/types'
import { cleJour } from './libelles'
import { marqueDe } from './projets'
import { presence, type Marque, type Presence } from './releves'
import { lireSites, type FicheSite } from './sites'

/*
 * Mesures d'un projet : la lecture unique sur laquelle reposent tous les
 * écrans de l'outil. Aucun appel payant : tout vient de la base.
 *
 * Trois règles d'honnêteté sont tenues ici, pas dans les écrans :
 *  1. chaque chiffre se calcule avec son nombre de relevés (k sur n) ;
 *  2. interface et API ne s'additionnent jamais : toute fonction qui compte
 *     reçoit une liste de relevés d'une seule méthode ;
 *  3. un écart n'est « réel » que s'il dépasse la marge d'erreur.
 */

export const METHODE: Record<Moteur, 'interface' | 'api'> = {
  chatgpt: 'interface',
  gemini: 'interface',
  google_ai_mode: 'interface',
  google_ai_overview: 'interface',
  claude: 'api',
}

/** En dessous de ce nombre de relevés, un chiffre n'est pas affiché. */
export const SEUIL_CHIFFRE = 5
/** En dessous de ce nombre de relevés, pas de verdict sur une question. */
export const SEUIL_VERDICT = 3

/** Nom ramené à l'essentiel pour comparer deux écritures : « Sell-Sy » et « sellsy ». */
export const simple = (t: string) => t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '')

export const cleIgnorees = (projetId: string) => `marques_ignorees:${projetId}`

/** Ce qu'on retient d'un relevé pour la marque suivie. */
export type Etat = 'citee' | 'nommee' | 'lue' | 'absente' | 'vide' | 'attente' | 'echec'

const chargerBase = cache(async (projetId: string) => {
  const [projet, questions, ignorees, sites] = await Promise.all([
    prisma.projet.findUnique({
      where: { id: projetId },
      include: { proprietes: { orderBy: [{ type: 'asc' }, { valeur: 'asc' }] }, concurrents: { orderBy: { nom: 'asc' } } },
    }),
    prisma.question.findMany({
      where: { projetId },
      orderBy: { ordre: 'asc' },
      select: {
        id: true, texte: true, langue: true, pays: true, archive: true, createdAt: true, theme: true, intention: true, etiquetteMain: true,
        releves: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true, moteur: true, methode: true, statut: true, createdAt: true, releveLe: true, modele: true, texte: true, erreur: true, urlControle: true, coutUsd: true, analyseLe: true, approfondi: true, faitsLe: true,
            sources: {
              orderBy: { position: 'asc' },
              select: { id: true, position: true, url: true, domaine: true, titre: true, role: true, videoYoutube: { select: { id: true, chaineId: true, chaineNom: true, titre: true, vues: true, publieLe: true } } },
            },
            mentions: { orderBy: { rang: 'asc' }, select: { id: true, nom: true, description: true, rang: true, origine: true, ton: true } },
            recherches: { orderBy: { position: 'asc' }, select: { texte: true } },
            resultatsGoogle: { orderBy: { rang: 'asc' }, select: { rang: true, url: true, domaine: true, titre: true } },
            questionsAssociees: { orderBy: { position: 'asc' }, select: { texte: true } },
          },
        },
      },
    }),
    prisma.reglage.findUnique({ where: { cle: cleIgnorees(projetId) } }),
    lireSites(),
  ])
  return { projet, questions, ignorees, sites }
})

type Base = Awaited<ReturnType<typeof chargerBase>>
type QuestionBase = Base['questions'][number]
type ReleveBase = QuestionBase['releves'][number]
export type SourceLue = ReleveBase['sources'][number]
export type MarqueNommee = { nom: string; ton: string | null; description: string | null }

export type ReleveLu = Omit<ReleveBase, 'coutUsd' | 'moteur' | 'methode' | 'mentions' | 'recherches' | 'questionsAssociees'> & {
  moteur: Moteur
  methode: 'interface' | 'api'
  coutUsd: number
  question: { id: string; texte: string }
  /** Jour de l'envoi, à l'heure de Paris. Les relevés d'un même jour forment une vague. */
  jour: string
  /** Présence de la marque, pour une réponse reçue. */
  p: Presence | null
  etat: Etat
  /** La marque est nommée ou citée dans la réponse. */
  present: boolean
  /** Marques nommées, dans l'ordre : lues par l'analyse, sinon renvoyées par le fournisseur. */
  marques: MarqueNommee[]
  /** Vrai quand la liste des marques est connue (analyse faite, ou ChatGPT). */
  marquesLues: boolean
  /** Rang de la marque parmi les marques nommées, quand il est connu. */
  rang: number | null
  recherches: string[]
  questionsAssociees: string[]
}

export type Intention = 'informer' | 'comparer' | 'acheter'
export const INTENTIONS: Record<Intention, string> = { informer: 's’informer', comparer: 'comparer', acheter: 'acheter' }
export const estIntention = (v: unknown): v is Intention => typeof v === 'string' && v in INTENTIONS

export type QuestionLue = {
  id: string
  texte: string
  createdAt: Date
  /** Étiquettes : le thème (quelques mots) et l'intention, ou null tant que la question n'est pas étiquetée. */
  theme: string | null
  intention: Intention | null
  /** Vrai quand les étiquettes ont été posées ou corrigées à la main. */
  etiquetteMain: boolean
  /** La question ne contient pas le nom de la marque. */
  sansMarque: boolean
  /** Relevés retenus par les filtres, du plus ancien au plus récent, mesures approfondies comprises. */
  releves: ReleveLu[]
  /** Tous les relevés de la question, toutes périodes confondues. */
  tous: ReleveLu[]
}

export type Mesures = {
  projet: NonNullable<Base['projet']>
  marque: Marque
  filtres: Filtres
  concurrents: { id: string; nom: string; domaine: string | null }[]
  /** Concurrent choisi dans la barre du haut : seules les réponses qui le nomment sont gardées. */
  face: { id: string; nom: string } | null
  /** Type de chaque site déjà classé (par le petit modèle ou à la main). */
  sites: Map<string, FicheSite>
  /** Marques écartées de la liste des marques repérées (clé simplifiée). */
  ignorees: string[]
  questions: QuestionLue[]
  /** Questions archivées, avec leur historique : elles ne comptent dans aucun chiffre. */
  archivees: QuestionLue[]
  /**
   * Relevés retenus par les filtres (période et IA cochées), sans les mesures
   * approfondies : une question posée vingt-cinq fois de suite pèserait
   * vingt-cinq fois plus dans les chiffres d'ensemble. Elles restent dans les
   * relevés de leur question.
   */
  releves: ReleveLu[]
  /** Relevés de la période d'avant, mêmes IA, sans les mesures approfondies : sert aux écarts. */
  precedents: ReleveLu[]
  /** Tous les relevés des questions suivies, sans filtre. */
  tous: ReleveLu[]
  /** IA relevées au moins une fois dans le projet. */
  moteursProjet: Moteur[]
  /** IA affichées : celles du projet, moins les décochées. */
  moteurs: Moteur[]
  /** Jours de relevé présents dans la sélection, dans l'ordre. */
  vagues: string[]
  premier: Date | null
  dernier: Date | null
  enAttente: number
}

function estNous(nomMarque: string, marque: Marque) {
  const n = nomMarque.toLowerCase()
  return [marque.nom, ...(marque.ecritures ?? [])].some((x) => x && n.includes(x.toLowerCase()))
}

function enrichir(r: ReleveBase, q: QuestionBase, marque: Marque): ReleveLu {
  const lues = r.mentions.filter((m) => m.origine === 'analyse')
  const marques = (r.analyseLe || lues.length ? lues : r.mentions).map((m) => ({ nom: m.nom, ton: m.ton, description: m.description }))
  const recu = r.statut === 'recu'
  const p = recu ? presence(r.texte, r.sources, marque) : null
  const i = marques.findIndex((m) => estNous(m.nom, marque))
  const rang = recu && i >= 0 ? i + 1 : null
  const present = !!p && (p.mentionnee || p.citeeSite || p.citeeYoutube || rang !== null)
  const etat: Etat =
    r.statut === 'en_attente' ? 'attente'
    : r.statut === 'echec' ? 'echec'
    : r.statut === 'vide' ? 'vide'
    : p && (p.citeeSite || p.citeeYoutube) ? 'citee'
    : present ? 'nommee'
    : p?.consultee ? 'lue'
    : 'absente'
  const moteur = r.moteur as Moteur
  return {
    id: r.id, statut: r.statut, createdAt: r.createdAt, releveLe: r.releveLe, modele: r.modele, texte: r.texte, erreur: r.erreur, urlControle: r.urlControle, analyseLe: r.analyseLe, approfondi: r.approfondi, faitsLe: r.faitsLe,
    sources: r.sources, resultatsGoogle: r.resultatsGoogle,
    moteur,
    methode: r.methode === 'api' ? 'api' : 'interface',
    coutUsd: Number(r.coutUsd),
    question: { id: q.id, texte: q.texte },
    jour: cleJour(r.createdAt),
    p, etat, present, marques,
    marquesLues: recu && (!!r.analyseLe || moteur === 'chatgpt' || marques.length > 0),
    rang,
    recherches: r.recherches.map((x) => x.texte),
    questionsAssociees: r.questionsAssociees.map((x) => x.texte),
  }
}

const SEMAINE = 7 * 86_400_000

/** Relevés d'une période, et ceux de la période d'avant. */
function decouper(tous: ReleveLu[], f: Filtres, maintenant: number) {
  const visibles = tous.filter((r) => !f.masquees.includes(r.moteur))
  if (f.periode === 'tout') return { courants: visibles, precedents: [] as ReleveLu[] }
  if (f.periode === 'dernier') {
    // Le relevé le plus récent de chaque IA pour chaque question (hors mesures approfondies).
    const derniers = new Map<string, ReleveLu>()
    for (const r of visibles) if (!r.approfondi) derniers.set(`${r.question.id}:${r.moteur}`, r)
    return { courants: [...derniers.values()].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()), precedents: [] as ReleveLu[] }
  }
  const duree = Number(f.periode) * SEMAINE
  const debut = maintenant - duree
  return {
    courants: visibles.filter((r) => r.createdAt.getTime() >= debut),
    precedents: visibles.filter((r) => r.createdAt.getTime() < debut && r.createdAt.getTime() >= debut - duree),
  }
}

/** Les mesures du projet, avec les filtres de la barre du haut. Une seule lecture par page. */
export const lireMesures = cache(async (projetId: string): Promise<Mesures | null> => {
  const [base, filtres] = await Promise.all([chargerBase(projetId), lireFiltres()])
  return construire(base, filtres)
})

/**
 * Les mesures du projet sans aucun filtre : tout l'historique, toutes les IA.
 * Sert au rapport, qui ne dépend pas des réglages de la barre du haut, et aux
 * tâches de fond, qui tournent hors de toute page (donc sans cookies).
 */
export async function lireMesuresBrutes(projetId: string): Promise<Mesures | null> {
  return construire(await chargerBase(projetId), { periode: 'tout', masquees: [], concurrent: null, actif: false })
}

function construire(base: Base, filtres: Filtres): Mesures | null {
  if (!base.projet) return null
  const marque = marqueDe(base.projet)
  const nomMarque = marque.nom.toLowerCase()
  const actives = base.questions.filter((q) => !q.archive)
  const maintenant = Date.now()

  const lue = (q: QuestionBase) => ({ q, tous: q.releves.map((r) => enrichir(r, q, marque)) })
  const parQuestion = actives.map(lue)
  const tous = parQuestion.flatMap((x) => x.tous).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  // Filtre « réponses qui nomment un concurrent » : il s'applique avant la période.
  const concurrent = filtres.concurrent ? base.projet.concurrents.find((c) => c.id === filtres.concurrent) : undefined
  const face = concurrent ? { id: concurrent.id, nom: concurrent.nom } : null
  const cleFace = concurrent ? simple(concurrent.nom) : ''
  const nommeFace = (r: ReleveLu) => !face || (cleFace.length >= 2 && r.marques.some((x) => simple(x.nom).includes(cleFace)))
  const { courants, precedents } = decouper(tous.filter(nommeFace), filtres, maintenant)
  const retenus = new Set(courants.map((r) => r.id))
  const etiquettes = (q: QuestionBase) => ({ theme: q.theme?.trim() || null, intention: estIntention(q.intention) ? q.intention : null, etiquetteMain: q.etiquetteMain })

  let ignorees: string[] = []
  try {
    const v = base.ignorees ? JSON.parse(base.ignorees.valeur) : []
    if (Array.isArray(v)) ignorees = v.filter((x): x is string => typeof x === 'string')
  } catch {
    ignorees = []
  }

  const moteursProjet = MOTEURS.filter((m) => tous.some((r) => r.moteur === m))
  return {
    projet: base.projet,
    marque,
    filtres,
    concurrents: base.projet.concurrents.map((c) => ({ id: c.id, nom: c.nom, domaine: c.domaine })),
    face,
    sites: base.sites,
    ignorees,
    questions: parQuestion.map(({ q, tous: t }) => ({
      id: q.id,
      texte: q.texte,
      createdAt: q.createdAt,
      ...etiquettes(q),
      sansMarque: !q.texte.toLowerCase().includes(nomMarque),
      releves: t.filter((r) => retenus.has(r.id)),
      tous: t,
    })),
    archivees: base.questions.filter((q) => q.archive).map(lue).map(({ q, tous: t }) => ({
      id: q.id,
      texte: q.texte,
      createdAt: q.createdAt,
      ...etiquettes(q),
      sansMarque: !q.texte.toLowerCase().includes(nomMarque),
      releves: decouper(t.filter(nommeFace), filtres, maintenant).courants,
      tous: t,
    })),
    releves: courants.filter((r) => !r.approfondi),
    precedents: precedents.filter((r) => !r.approfondi),
    tous,
    moteursProjet,
    moteurs: moteursProjet.filter((m) => !filtres.masquees.includes(m)),
    vagues: [...new Set(courants.filter((r) => !r.approfondi).map((r) => r.jour))].sort(),
    premier: courants[0]?.createdAt ?? null,
    dernier: courants.at(-1)?.createdAt ?? null,
    enAttente: tous.filter((r) => r.statut === 'en_attente').length,
  }
}

// ── Compter ─────────────────────────────────────────────────────────────────

export const deMethode = (rs: ReleveLu[], methode: 'interface' | 'api') => rs.filter((r) => r.methode === methode)
export const deMoteur = (rs: ReleveLu[], moteur: Moteur) => rs.filter((r) => r.moteur === moteur)
export const recus = (rs: ReleveLu[]) => rs.filter((r) => r.statut === 'recu')

export type Compte = {
  /** Relevés envoyés. */
  envoyes: number
  /** Réponses reçues : la taille de l'échantillon. */
  n: number
  /** Réponses où la marque est nommée ou citée. */
  k: number
  vides: number
  attente: number
  echecs: number
}

export function compter(rs: ReleveLu[]): Compte {
  const c: Compte = { envoyes: rs.length, n: 0, k: 0, vides: 0, attente: 0, echecs: 0 }
  for (const r of rs) {
    if (r.statut === 'recu') {
      c.n++
      if (r.present) c.k++
    } else if (r.statut === 'vide') c.vides++
    else if (r.statut === 'en_attente') c.attente++
    else c.echecs++
  }
  return c
}

export const part = (k: number, n: number) => (n > 0 ? k / n : null)

/** Intervalle de confiance à 95 % d'une part (méthode de Wilson), entre 0 et 1. */
export function intervalle(k: number, n: number): { bas: number; haut: number } | null {
  if (n <= 0) return null
  const z = 1.96
  const p = k / n
  const d = 1 + (z * z) / n
  const centre = (p + (z * z) / (2 * n)) / d
  const demi = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d
  return { bas: Math.max(0, centre - demi), haut: Math.min(1, centre + demi) }
}

export type Ecart = {
  /** Écart en points de pourcentage (de −100 à 100). */
  points: number
  /** « marge » : l'écart ne dépasse pas la marge d'erreur. « tot » : trop peu de relevés pour le dire. */
  sens: 'hausse' | 'baisse' | 'marge' | 'tot'
}

/** Écart entre deux parts. Il n'est « réel » que s'il dépasse la marge d'erreur des deux échantillons. */
export function ecart(avant: { k: number; n: number }, apres: { k: number; n: number }): Ecart | null {
  if (avant.n === 0 || apres.n === 0) return null
  const a = avant.k / avant.n
  const b = apres.k / apres.n
  const points = Math.round((b - a) * 100)
  if (Math.min(avant.n, apres.n) < SEUIL_CHIFFRE) return { points, sens: 'tot' }
  const marge = 1.96 * Math.sqrt((a * (1 - a)) / avant.n + (b * (1 - b)) / apres.n)
  if (Math.abs(b - a) <= marge || b === a) return { points, sens: 'marge' }
  return { points, sens: b > a ? 'hausse' : 'baisse' }
}

// ── Verdict d'une question ──────────────────────────────────────────────────

export type Verdict = 'solide' | 'occasionnelle' | 'absente' | 'tot' | 'jamais'

/** Pour une question seule, un verdict et non un pourcentage. */
export function verdict(k: number, n: number): Verdict {
  if (n === 0) return 'jamais'
  if (n < SEUIL_VERDICT) return 'tot'
  if (k === 0) return 'absente'
  return k / n >= 0.6 ? 'solide' : 'occasionnelle'
}

export const VERDICTS: Record<Verdict, { libelle: string; signe: string; classe: string }> = {
  solide: { libelle: 'solide', signe: '●', classe: 'present' },
  occasionnelle: { libelle: 'occasionnelle', signe: '◐', classe: 'present' },
  absente: { libelle: 'absente', signe: '○', classe: 'absent' },
  tot: { libelle: 'trop tôt pour dire', signe: '·', classe: 'neutre' },
  jamais: { libelle: 'pas encore relevée', signe: '·', classe: 'neutre' },
}

// ── Vagues et séries ────────────────────────────────────────────────────────

export type Point = { jour: string; k: number; n: number; bas: number; haut: number }

/** Part des réponses où la marque est présente, vague par vague. Les vagues sans réponse sont sautées. */
export function serie(rs: ReleveLu[], present: (r: ReleveLu) => boolean = (r) => r.present): Point[] {
  const parJour = new Map<string, { k: number; n: number }>()
  for (const r of rs) {
    if (r.statut !== 'recu') continue
    const x = parJour.get(r.jour) ?? { k: 0, n: 0 }
    x.n++
    if (present(r)) x.k++
    parJour.set(r.jour, x)
  }
  return [...parJour.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([jour, { k, n }]) => ({ jour, k, n, ...intervalle(k, n)! }))
}

/** Changements de modèle d'une IA d'un jour de relevé au suivant : des repères sur la courbe. */
export function changementsDeModele(rs: ReleveLu[]): { jour: string; moteur: Moteur; avant: string; apres: string }[] {
  const reperes: { jour: string; moteur: Moteur; avant: string; apres: string }[] = []
  for (const moteur of MOTEURS) {
    const parJour = new Map<string, Set<string>>()
    for (const r of rs) {
      if (r.moteur !== moteur || !r.modele || r.statut !== 'recu') continue
      parJour.set(r.jour, (parJour.get(r.jour) ?? new Set<string>()).add(r.modele))
    }
    const jours = [...parJour.keys()].sort()
    for (let i = 1; i < jours.length; i++) {
      const avant = [...parJour.get(jours[i - 1])!].sort().join(', ')
      const apres = [...parJour.get(jours[i])!].sort().join(', ')
      if (avant !== apres) reperes.push({ jour: jours[i], moteur, avant, apres })
    }
  }
  return reperes.sort((x, y) => x.jour.localeCompare(y.jour))
}

/** Dernier relevé de chaque IA, dans une liste de relevés d'une même question. */
export function derniersParMoteur(rs: ReleveLu[]): Map<Moteur, ReleveLu> {
  const m = new Map<Moteur, ReleveLu>()
  for (const r of rs) m.set(r.moteur, r)
  return m
}

/** Moyenne des rangs connus, ou null. */
export function rangMoyen(rs: ReleveLu[]): { moyenne: number; n: number } | null {
  const rangs = rs.map((r) => r.rang).filter((x): x is number => x !== null)
  return rangs.length ? { moyenne: rangs.reduce((a, b) => a + b, 0) / rangs.length, n: rangs.length } : null
}
