// Pages suivies : partir d'une page de la marque (un article, une page produit)
// plutôt que d'une question.
//
//  1. L'outil lit la page, gratuitement (lirePage, src/lib/audit.ts).
//  2. Le petit modèle propose les questions qu'un internaute poserait à une IA et
//     auxquelles cette page répond (moins d'un centime, inscrit au journal des coûts).
//  3. Les questions gardées, retouchées ou ajoutées à la main rejoignent le projet ;
//     la page est rattachée à ses questions.
//  4. Après un relevé, la fiche de la page dit, IA par IA, si les réponses à ses
//     questions la citent, et ce qui est cité à sa place.
// Les chiffres suivent les règles de l'outil : k sur n, interface et API à part.
import { lirePage, type PageLue } from './audit'
import { demanderJson } from './analyse'
import { MOTEURS, type Moteur } from './fournisseurs/types'
import { compter, deMoteur, METHODE, type Mesures, type ReleveLu } from './mesures'
import { prisma } from './prisma'
import { estALaMarque } from './releves'

/** Prix d'une proposition de questions (une page lue par le petit modèle), en dollars. */
export const PRIX_PROPOSITION_USD = 0.0008
export const MAX_PROPOSITIONS = 6

/** Clé de comparaison d'une adresse : domaine sans « www. », chemin sans barre finale, sans paramètres ni ancre. */
export function clePage(url: string): string {
  try {
    const u = new URL(url.includes('://') ? url : `https://${url}`)
    const hote = u.hostname.toLowerCase().replace(/^www\./, '')
    let chemin = u.pathname
    try {
      chemin = decodeURI(chemin)
    } catch {
      /* adresse mal encodée : on garde telle quelle */
    }
    chemin = chemin.replace(/\/+$/, '').toLowerCase()
    return `${hote}${chemin}`
  } catch {
    return url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[?#].*$/, '').replace(/\/+$/, '')
  }
}

const nomLangueFr = (code: string) => new Intl.DisplayNames(['fr'], { type: 'language' }).of(code.toLowerCase()) ?? code
const nomPaysFr = (code: string) => new Intl.DisplayNames(['fr'], { type: 'region' }).of(code.toUpperCase()) ?? code

function consigne(page: PageLue, projet: { marque: string; langue: string; pays: string }, existantes: string[]) {
  return [
    `Voici une page web de la marque « ${projet.marque} ».`,
    `Adresse : ${page.url}`,
    page.titre ? `Titre : ${page.titre}` : '',
    page.description ? `Description : ${page.description}` : '',
    page.intertitres.length ? `Intertitres :\n- ${page.intertitres.join('\n- ')}` : '',
    `Texte (début) :\n${page.texte.slice(0, 6000)}`,
    '',
    `Propose ${MAX_PROPOSITIONS} questions qu’un internaute de ce pays (${nomPaysFr(projet.pays)}) poserait à un assistant IA comme ChatGPT, en ${nomLangueFr(projet.langue)}, et auxquelles cette page répond bien.`,
    'Règles :',
    '- des questions naturelles et courtes, comme on les tape vraiment (moins de 120 signes), une idée par question ;',
    `- sans le nom « ${projet.marque} » dans au moins ${MAX_PROPOSITIONS - 1} d’entre elles : on veut savoir si l’IA cite la page sans qu’on la nomme ;`,
    '- variées : s’informer, comparer des solutions, choisir ou acheter ;',
    '- pas de question qui reprenne une question déjà suivie, même tournée autrement.',
    existantes.length ? `Questions déjà suivies :\n- ${existantes.slice(0, 60).join('\n- ')}` : '',
    '',
    'Réponds uniquement en JSON : {"sujet": "le sujet de la page en quelques mots", "questions": [{"texte": "…", "intention": "informer" | "comparer" | "acheter"}]}',
  ].filter(Boolean).join('\n')
}

export type Proposition = { texte: string; intention: 'informer' | 'comparer' | 'acheter' | null }
export type Lecture = { url: string; cle: string; titre: string | null; sujet: string | null; mots: number; propositions: Proposition[]; coutUsd: number; /** Le petit modèle n'a pas répondu (clé absente, panne, réponse illisible). */ echecModele: boolean }

/** Lit la page et fait proposer les questions. null si la page est illisible ; propositions vides si le modèle échoue. */
export async function proposerQuestions(saisie: string, projet: { nom: string; marque: string; langue: string; pays: string }, existantes: string[]): Promise<Lecture | { erreur: 'adresse' | 'illisible' | 'vide' }> {
  const page = await lirePage(saisie)
  if (!page) return { erreur: 'adresse' }
  if (page.statut !== 200) return { erreur: 'illisible' }
  if (page.mots < 60 && !page.titre) return { erreur: 'vide' }
  const { json, coutUsd, erreur } = await demanderJson(consigne(page, projet, existantes), {
    operation: 'suggestion',
    projet: projet.nom,
    detail: { page: page.url, mots: page.mots },
    valide: (j) => Array.isArray(j.questions),
  })
  const connues = new Set(existantes.map((q) => q.toLowerCase().trim()))
  const vues = new Set<string>()
  const propositions: Proposition[] = []
  for (const x of Array.isArray(json?.questions) ? json.questions : []) {
    const o = x && typeof x === 'object' ? (x as Record<string, unknown>) : {}
    const texte = typeof o.texte === 'string' ? o.texte.replace(/\s+/g, ' ').trim().slice(0, 200) : ''
    const cle = texte.toLowerCase()
    if (texte.length < 8 || connues.has(cle) || vues.has(cle)) continue
    vues.add(cle)
    const intention = o.intention === 'informer' || o.intention === 'comparer' || o.intention === 'acheter' ? o.intention : null
    propositions.push({ texte, intention })
  }
  return {
    url: page.url,
    cle: clePage(page.url),
    titre: page.titre,
    sujet: typeof json?.sujet === 'string' ? json.sujet.slice(0, 120) : null,
    mots: page.mots,
    propositions: propositions.slice(0, MAX_PROPOSITIONS),
    coutUsd,
    echecModele: !json || !!erreur,
  }
}

/**
 * Ajoute des questions au projet et rend leurs identifiants, dans l'ordre donné.
 * Une question qui existe déjà (même texte) est reprise telle quelle, et sortie
 * des archives si elle y était.
 */
export async function questionsDuProjet(projet: { id: string; langue: string; pays: string }, textes: string[]): Promise<string[]> {
  const propres = [...new Map(textes.map((x) => x.replace(/\s+/g, ' ').trim()).filter((x) => x.length >= 3).map((x) => [x.toLowerCase(), x.slice(0, 300)] as const)).values()]
  if (propres.length === 0) return []
  const existantes = await prisma.question.findMany({ where: { projetId: projet.id }, select: { id: true, texte: true, archive: true, ordre: true } })
  const parTexte = new Map(existantes.map((q) => [q.texte.toLowerCase(), q]))
  let ordre = Math.max(0, ...existantes.map((q) => q.ordre))
  const ids: string[] = []
  for (const texte of propres) {
    const deja = parTexte.get(texte.toLowerCase())
    if (deja) {
      if (deja.archive) await prisma.question.update({ where: { id: deja.id }, data: { archive: false } })
      ids.push(deja.id)
    } else {
      const q = await prisma.question.create({ data: { projetId: projet.id, texte, langue: projet.langue, pays: projet.pays, ordre: ++ordre } })
      ids.push(q.id)
    }
  }
  return ids
}

// ── Ce que montre la fiche d'une page ──────────────────────────────────────

/** La réponse cite-t-elle cette page (parmi ses sources citées) ? */
export const citeLaPage = (r: ReleveLu, cle: string) => r.statut === 'recu' && r.sources.some((s) => s.role === 'citee' && clePage(s.url) === cle)
/** L'IA a-t-elle lu la page sans la citer ? */
export const litLaPage = (r: ReleveLu, cle: string) => r.statut === 'recu' && !citeLaPage(r, cle) && r.sources.some((s) => s.role !== 'citee' && clePage(s.url) === cle)

/** État d'une réponse pour la page : citée, marque présente autrement, lue, absente, ou pas de réponse. */
export type EtatPage = 'page' | 'marque' | 'lue' | 'absente' | 'vide' | 'attente' | 'echec'
export function etatPourLaPage(r: ReleveLu, cle: string): EtatPage {
  if (r.statut === 'en_attente') return 'attente'
  if (r.statut === 'echec') return 'echec'
  if (r.statut === 'vide') return 'vide'
  if (citeLaPage(r, cle)) return 'page'
  if (r.present) return 'marque'
  if (litLaPage(r, cle)) return 'lue'
  return 'absente'
}

export type BilanPage = {
  moteurs: Moteur[]
  /** IA par IA, sur les questions de la page (mesures approfondies comprises : elles portent sur ces questions). */
  parIA: { moteur: Moteur; methode: 'interface' | 'api'; n: number; page: number; marque: number }[]
  /** Une ligne par question : la dernière réponse de chaque IA. */
  questions: { id: string; texte: string; archive: boolean; derniers: Partial<Record<Moteur, { etat: EtatPage; releve: ReleveLu }>> }[]
  /** Réponses à d'autres questions du projet qui citent aussi la page. */
  ailleurs: ReleveLu[]
  /** Pages citées dans les réponses à ses questions qui ne la citent pas : ce qui prend sa place. */
  aSaPlace: { url: string; domaine: string; titre: string | null; reponses: number; nous: boolean }[]
  dernier: Date | null
}

export function bilanDeLaPage(m: Mesures, page: { cle: string; questions: string[] }): BilanPage {
  const toutes = [...m.questions, ...m.archivees]
  const ids = new Set(page.questions)
  const siennes = page.questions.map((id) => toutes.find((q) => q.id === id)).filter((q): q is NonNullable<typeof q> => !!q)
  const releves = siennes.flatMap((q) => q.tous)
  const moteurs = MOTEURS.filter((x) => releves.some((r) => r.moteur === x))
  const parIA = moteurs.map((moteur) => {
    const rs = deMoteur(releves, moteur).filter((r) => r.statut === 'recu')
    return { moteur, methode: METHODE[moteur], n: compter(rs).n, page: rs.filter((r) => citeLaPage(r, page.cle)).length, marque: rs.filter((r) => r.present).length }
  })
  const questions = siennes.map((q) => {
    const derniers: Partial<Record<Moteur, { etat: EtatPage; releve: ReleveLu }>> = {}
    for (const r of q.tous) derniers[r.moteur] = { etat: etatPourLaPage(r, page.cle), releve: r }
    return { id: q.id, texte: q.texte, archive: m.archivees.some((a) => a.id === q.id), derniers }
  })
  const ailleurs = m.tous.filter((r) => !ids.has(r.question.id) && citeLaPage(r, page.cle))
  const place = new Map<string, { url: string; domaine: string; titre: string | null; reponses: number; nous: boolean }>()
  for (const r of releves) {
    if (r.statut !== 'recu' || citeLaPage(r, page.cle)) continue
    const vues = new Set<string>()
    for (const s of r.sources) {
      if (s.role !== 'citee' || vues.has(s.url)) continue
      vues.add(s.url)
      const x = place.get(s.url) ?? { url: s.url, domaine: s.domaine, titre: s.titre, reponses: 0, nous: estALaMarque(s, m.marque) }
      x.reponses++
      place.set(s.url, x)
    }
  }
  const lus = releves.filter((r) => r.statut === 'recu')
  return {
    moteurs,
    parIA,
    questions,
    ailleurs,
    aSaPlace: [...place.values()].sort((a, b) => b.reponses - a.reponses).slice(0, 8),
    dernier: lus.length ? lus.reduce((d, r) => (r.createdAt > d ? r.createdAt : d), lus[0].createdAt) : null,
  }
}
