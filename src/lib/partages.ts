// Pages de partage : ce qu'un client ou un partenaire voit, par un lien privé et
// sans compte, d'une série de questions d'un projet (/partage/[jeton]).
//
// Règles :
//  - rien d'autre que les questions choisies : ni les autres questions, ni les
//    autres projets, ni les coûts, ni le menu de l'outil ;
//  - les chiffres sont lus en direct dans la base à chaque ouverture (aucun appel
//    payant) et suivent les règles de l'outil : k sur n, marge d'erreur, interface
//    et API jamais additionnées ;
//  - un lien coupé ou expiré ne montre plus rien.
import { randomBytes } from 'node:crypto'
import { MOTEURS, type Moteur } from './fournisseurs/types'
import { compter, deMoteur, intervalle, lireMesuresBrutes, METHODE, recus, serie, verdict, type QuestionLue, type ReleveLu } from './mesures'
import { prisma } from './prisma'
import { estALaMarque, type Marque } from './releves'

export const nouveauJeton = () => randomBytes(18).toString('base64url')

export const estMoteur = (m: string): m is Moteur => (MOTEURS as readonly string[]).includes(m)

export type EtatLien = 'actif' | 'coupe' | 'expire'
export function etatDuLien(p: { coupeLe: Date | null; expireLe: Date | null }, maintenant = new Date()): EtatLien {
  if (p.coupeLe) return 'coupe'
  if (p.expireLe && p.expireLe < maintenant) return 'expire'
  return 'actif'
}

/** Le partage que désigne un jeton, s'il existe (actif ou non). */
export async function trouverPartage(jeton: string) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(jeton)) return null
  return prisma.partage.findUnique({ where: { jeton }, include: { projet: { select: { id: true, nom: true, marque: true, langue: true, pays: true } } } })
}

/** Une ouverture par quelqu'un qui n'est pas connecté à l'outil. */
export async function compterVue(id: string) {
  await prisma.partage.update({ where: { id }, data: { vues: { increment: 1 }, derniereVue: new Date() } }).catch(() => undefined)
}

// ── Ce que montre la page ───────────────────────────────────────────────────

/** Extrait lisible d'une réponse : le Markdown est retiré, le texte coupé à un mot entier. */
export function extrait(texte: string | null, max = 420): string {
  if (!texte) return ''
  const plat = texte
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // Renvois de citation : « [[1]](https://…) », « [1](https://…) », « ([source](https://…)) ».
    .replace(/\(?\[\[?\d+\]?\]\([^)]*\)\)?/g, '')
    .replace(/\[([^[\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\(\s*https?:\/\/[^)\s]*\s*\)/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\[\d+\]/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (plat.length <= max) return plat
  const coupe = plat.slice(0, max)
  return `${coupe.slice(0, Math.max(coupe.lastIndexOf(' '), max - 40))}…`
}

export type LigneIA = {
  moteur: Moteur
  methode: 'interface' | 'api'
  /** Réponses reçues et réponses où la marque est nommée ou citée, tout l'historique de la question. */
  k: number
  n: number
  verdict: ReturnType<typeof verdict>
  dernier: ReleveLu | null
  /** Sources de la dernière réponse : la marque en premier, cinq au plus. */
  sources: { domaine: string; url: string; titre: string | null; nous: boolean; /** Lue par l'IA sans être citée (pages de la marque seulement). */ lue: boolean }[]
  /** Marques nommées dans la dernière réponse, dans l'ordre, cinq au plus. */
  marques: { nom: string; nous: boolean }[]
}

export type QuestionPartagee = { id: string; texte: string; lignes: LigneIA[] }

export type Resume = {
  moteur: Moteur
  methode: 'interface' | 'api'
  k: number
  n: number
  bas: number | null
  haut: number | null
  points: { jour: string; k: number; n: number }[]
}

function estNous(nomMarque: string, marque: Marque) {
  const n = nomMarque.toLowerCase()
  return [marque.nom, ...(marque.ecritures ?? [])].some((x) => x && n.includes(x.toLowerCase()))
}

/** Tout ce que la page montre, calculé sur les seules questions choisies. */
export async function contenuDuPartage(p: { projetId: string; questions: string[]; moteurs: string[] }) {
  const m = await lireMesuresBrutes(p.projetId)
  if (!m) return null
  const index = new Map(m.questions.map((q) => [q.id, q] as const))
  const questions = p.questions.map((id) => index.get(id)).filter((q): q is QuestionLue => !!q)
  const voulus = p.moteurs.filter(estMoteur)
  const moteurs = (voulus.length ? voulus : m.moteursProjet).filter((x) => m.moteursProjet.includes(x) || questions.some((q) => q.tous.some((r) => r.moteur === x)))
  // Les chiffres d'ensemble laissent de côté les mesures approfondies, comme dans l'outil.
  const releves = questions.flatMap((q) => q.tous).filter((r) => !r.approfondi && moteurs.includes(r.moteur))

  const resumes: Resume[] = moteurs.map((moteur) => {
    const rs = deMoteur(releves, moteur)
    const c = compter(rs)
    const ic = intervalle(c.k, c.n)
    return { moteur, methode: METHODE[moteur], k: c.k, n: c.n, bas: ic?.bas ?? null, haut: ic?.haut ?? null, points: serie(rs).map(({ jour, k, n }) => ({ jour, k, n })) }
  })

  const parQuestion: QuestionPartagee[] = questions.map((q) => ({
    id: q.id,
    texte: q.texte,
    lignes: moteurs.map((moteur) => {
      const tous = deMoteur(q.tous, moteur)
      const c = compter(tous)
      const lus = recus(tous)
      const dernier = tous.filter((r) => r.statut !== 'en_attente').at(-1) ?? null
      const dernierLu = lus.at(-1) ?? null
      const sources = (dernierLu?.sources ?? [])
        .filter((s) => s.role !== 'consultee' || estALaMarque(s, m.marque))
        .map((s) => ({ domaine: s.domaine, url: s.url, titre: s.titre, nous: estALaMarque(s, m.marque), lue: s.role !== 'citee' }))
      const vus = new Set<string>()
      const sourcesUniques = [...sources.filter((s) => s.nous), ...sources.filter((s) => !s.nous)].filter((s) => (vus.has(s.url) ? false : (vus.add(s.url), true))).slice(0, 5)
      return {
        moteur,
        methode: METHODE[moteur],
        k: c.k,
        n: c.n,
        verdict: verdict(c.k, c.n),
        dernier,
        sources: sourcesUniques,
        marques: (dernierLu?.marques ?? []).slice(0, 5).map((x) => ({ nom: x.nom, nous: estNous(x.nom, m.marque) })),
      }
    }),
  }))

  const jours = releves.filter((r) => r.statut === 'recu').map((r) => r.releveLe ?? r.createdAt)
  return {
    marque: m.marque,
    projet: m.projet,
    moteurs,
    resumes,
    /** Relevés retenus (questions et IA du partage, sans les mesures approfondies) : sert aux courbes. */
    releves,
    questions: parQuestion,
    premier: jours.length ? new Date(Math.min(...jours.map((d) => d.getTime()))) : null,
    dernier: jours.length ? new Date(Math.max(...jours.map((d) => d.getTime()))) : null,
    vagues: new Set(releves.filter((r) => r.statut === 'recu').map((r) => r.jour)).size,
    manquantes: p.questions.length - questions.length,
  }
}

export type ContenuPartage = NonNullable<Awaited<ReturnType<typeof contenuDuPartage>>>
