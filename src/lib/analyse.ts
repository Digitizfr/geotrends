import Anthropic from '@anthropic-ai/sdk'
import { cleRequise, fournisseurAnalyse } from './cles'
import { enregistrerAppel } from './couts'
import { cleAnthropic } from './fournisseurs/anthropic'
import { prisma } from './prisma'
import { prixAnthropic, prixDeepseek } from './tarifs'

/*
 * Lecture automatique d'une réponse d'IA par un petit modèle : quelles marques
 * sont nommées, dans quel ordre, et sur quel ton. C'est ce qui permet de
 * comparer toutes les IA (DataForSEO ne renvoie les marques que pour ChatGPT).
 *
 * Appel payant (environ 0,001 $ par réponse), inscrit
 * au journal des coûts. Le résultat est rangé dans la table Mention avec
 * l'origine « analyse », et se refait à volonté.
 */

/**
 * Qui fait la lecture : « deepseek » (DeepSeek Flash) ou « anthropic » (Claude
 * Haiku 5.5). ANALYSE_FOURNISSEUR l'impose ; sinon, celui dont la clé est en
 * place, DeepSeek d'abord (voir src/lib/cles.ts).
 */
const FOURNISSEUR = fournisseurAnalyse()
export const MODELE_ANALYSE = process.env.ANALYSE_MODELE || (FOURNISSEUR === 'anthropic' ? 'claude-haiku-5-5' : 'deepseek-flash')
/** Prix moyen d'une lecture, pour les estimations affichées avant un envoi. */
export const PRIX_ANALYSE_USD = 0.0008
/** Prix moyen de la comparaison d'une réponse aux faits vérifiés (la réponse est relue en entier). */
export const PRIX_FAITS_USD = 0.0006
/** Nombre de faits vérifiés qu'un projet peut porter. */
export const MAX_FAITS = 20

const cleDeepseek = () => cleRequise('deepseek')

type Lecture = { texte: string; coutUsd: number; jetons: number; refus: boolean }

async function lireAvecAnthropic(consigne: string): Promise<Lecture> {
  const client = new Anthropic({ apiKey: cleAnthropic() })
  const m = await client.messages.create({ model: MODELE_ANALYSE, max_tokens: 4000, messages: [{ role: 'user', content: consigne }] })
  const volumes = { entree: m.usage.input_tokens, sortie: m.usage.output_tokens, cacheEcriture: m.usage.cache_creation_input_tokens ?? 0, cacheLecture: m.usage.cache_read_input_tokens ?? 0, recherchesWeb: 0 }
  return {
    texte: m.content.map((b) => (b.type === 'text' ? b.text : '')).join(''),
    coutUsd: prixAnthropic(MODELE_ANALYSE, volumes) ?? 0,
    jetons: volumes.entree + volumes.sortie,
    refus: m.stop_reason === 'refusal',
  }
}

async function lireAvecDeepseek(consigne: string): Promise<Lecture> {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cleDeepseek()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODELE_ANALYSE, messages: [{ role: 'user', content: consigne }], response_format: { type: 'json_object' }, max_tokens: 4000,
      // Relever des noms dans un texte ne demande pas de raisonnement : le mode
      // « réflexion », actif par défaut, triplait le prix et vidait parfois la réponse.
      thinking: { type: 'disabled' },
    }),
    signal: AbortSignal.timeout(120_000),
  })
  if (!res.ok) throw new Error(`DeepSeek ${res.status} : ${(await res.text()).slice(0, 200)}`)
  const d = (await res.json()) as { choices?: { message?: { content?: string } }[]; usage?: { prompt_tokens?: number; completion_tokens?: number; prompt_cache_hit_tokens?: number } }
  const v = { entree: d.usage?.prompt_tokens ?? 0, entreeCache: d.usage?.prompt_cache_hit_tokens ?? 0, sortie: d.usage?.completion_tokens ?? 0 }
  return { texte: d.choices?.[0]?.message?.content ?? '', coutUsd: prixDeepseek(MODELE_ANALYSE, v) ?? 0, jetons: v.entree + v.sortie, refus: false }
}

/**
 * Pose une consigne au petit modèle et lit l'objet JSON qu'il renvoie. L'appel
 * est payant : il est inscrit au journal des coûts ici même, réussi ou non.
 * C'est le seul chemin vers le petit modèle : étiquettes, types de sites et
 * faits vérifiés passent par lui, comme la lecture des réponses.
 */
export async function demanderJson(
  texte: string,
  journal: { operation: string; projet?: string | null; detail?: Record<string, unknown>; valide?: (json: Record<string, unknown>) => boolean },
): Promise<{ json: Record<string, unknown> | null; coutUsd: number; erreur?: string }> {
  const t0 = Date.now()
  let lecture: Lecture | null = null
  let json: Record<string, unknown> | null = null
  let erreur: string | undefined
  try {
    lecture = FOURNISSEUR === 'anthropic' ? await lireAvecAnthropic(texte) : await lireAvecDeepseek(texte)
    if (lecture.refus) erreur = 'Le modèle a décliné la lecture.'
    else {
      const debut = lecture.texte.indexOf('{')
      const fin = lecture.texte.lastIndexOf('}')
      try {
        const brut: unknown = debut >= 0 && fin > debut ? JSON.parse(lecture.texte.slice(debut, fin + 1)) : null
        if (brut && typeof brut === 'object' && !Array.isArray(brut)) json = brut as Record<string, unknown>
      } catch {
        json = null
      }
      if (json && journal.valide && !journal.valide(json)) json = null
      if (!json) erreur = 'Réponse du modèle illisible.'
    }
  } catch (e) {
    if (e instanceof Anthropic.APIError) erreur = `Anthropic ${e.status ?? ''} : ${e.message}`.slice(0, 300)
    else erreur = e instanceof Error ? e.message : String(e)
  }
  const coutUsd = lecture?.coutUsd ?? 0
  await enregistrerAppel({
    fournisseur: FOURNISSEUR,
    operation: journal.operation,
    projet: journal.projet ?? null,
    unites: lecture?.jetons ?? 0,
    unite: 'jeton',
    coutUsd,
    sourcePrix: 'grille',
    reussi: !!json,
    dureeMs: Date.now() - t0,
    detail: { modele: MODELE_ANALYSE, ...(journal.detail ?? {}), ...(erreur ? { erreur } : {}) },
  })
  return { json, coutUsd, erreur }
}

const TONS = ['positif', 'neutre', 'negatif']

type FaitALire = { id: string; texte: string }

function consigne(question: string, marque: string, concurrents: string[], reponse: string, lireMarques: boolean, faits: FaitALire[]): string {
  const aReperer = [marque, ...concurrents].filter(Boolean).join(', ')
  const lignes = [`Voici la réponse d'un assistant IA à la question : « ${question} ».`]
  const forme: string[] = []
  if (lireMarques) {
    lignes.push(
      'Relève toutes les marques, tous les produits et toutes les entreprises nommés dans cette réponse, dans l’ordre de leur première apparition.',
      'Pour chacun, indique le ton employé à son égard : "positif" (recommandé, mis en avant), "neutre" (simplement cité) ou "negatif" (déconseillé, critiqué).',
      'Ne retiens que les noms réellement écrits dans le texte. N’en invente aucun. Ignore les noms de sites cités seulement comme sources.',
      `Noms à repérer en priorité s'ils apparaissent, en gardant exactement cette écriture : ${aReperer}.`,
    )
    forme.push('"marques":[{"nom":"…","ton":"positif"}]')
  }
  if (faits.length) {
    lignes.push(
      '',
      `${lireMarques ? 'Par ailleurs, voici' : 'Voici'} des faits vérifiés sur ${marque}, numérotés :`,
      ...faits.map((f, i) => `${i + 1}. ${f.texte}`),
      `Cherche dans la réponse les phrases qui affirment sur ${marque} autre chose que l’un de ces faits (un autre prix, une autre offre, un autre pays, une autre date…).`,
      'Pour chaque contradiction, donne : "fait" (le numéro du fait), "phrase" (la phrase de la réponse, copiée mot pour mot), "explication" (en une phrase courte et sans citer le numéro du fait : ce que dit la réponse, et ce qui est vrai), et "source" (l’adresse de la page citée à l’appui de cette phrase si elle est donnée dans le texte, sinon null).',
      'Donne une entrée par fait contredit : si une même phrase contredit plusieurs faits, répète-la dans une entrée pour chacun.',
      'Une information simplement absente de la réponse n’est pas une contradiction. Une phrase qui dit la même chose que le fait avec d’autres mots non plus. Dans le doute, ne signale rien.',
    )
    forme.push('"contradictions":[{"fait":1,"phrase":"…","explication":"…","source":null}]')
  }
  lignes.push(`Réponds uniquement par un objet JSON de cette forme, sans aucun autre texte : {${forme.join(',')}}`, '', '--- RÉPONSE À LIRE ---', reponse)
  return lignes.join('\n')
}

function lireMarques(json: Record<string, unknown>): { nom: string; ton: string | null }[] | null {
  if (!Array.isArray(json.marques)) return null
  const vues = new Set<string>()
  return json.marques
    .map((m) => (m && typeof m === 'object' ? (m as Record<string, unknown>) : {}))
    .map((m) => ({ nom: typeof m.nom === 'string' ? m.nom.trim() : '', ton: typeof m.ton === 'string' && TONS.includes(m.ton) ? m.ton : null }))
    .filter((m) => m.nom && m.nom.length <= 80 && !vues.has(m.nom.toLowerCase()) && vues.add(m.nom.toLowerCase()))
}

type ContradictionLue = { faitId: string; phrase: string; explication: string | null; sourceUrl: string | null }

function lireContradictions(json: Record<string, unknown>, faits: FaitALire[]): ContradictionLue[] {
  if (!Array.isArray(json.contradictions)) return []
  const vues = new Set<string>()
  return json.contradictions
    .map((c) => (c && typeof c === 'object' ? (c as Record<string, unknown>) : {}))
    .map((c) => ({
      faitId: faits[Number(c.fait) - 1]?.id ?? '',
      // La phrase est gardée en texte simple : sans la mise en forme Markdown de la réponse.
      phrase: typeof c.phrase === 'string' ? c.phrase.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`#>]+/g, '').replace(/\s+/g, ' ').replace(/\s+([.,;])/g, '$1').replace(/\(\s*\)/g, '').trim().slice(0, 600) : '',
      explication: typeof c.explication === 'string' && c.explication.trim() ? c.explication.trim().slice(0, 300) : null,
      sourceUrl: typeof c.source === 'string' && /^https?:\/\//.test(c.source.trim()) ? c.source.trim().slice(0, 500) : null,
    }))
    .filter((c) => c.faitId && c.phrase && !vues.has(`${c.faitId}:${c.phrase}`) && vues.add(`${c.faitId}:${c.phrase}`))
}

/** Vrai si le texte nomme la marque (son nom, une autre écriture, ou l'un de ses sites). */
function nomme(texte: string, noms: string[], domaines: string[]) {
  const t = texte.toLowerCase()
  return [...noms, ...domaines].some((n) => n && t.includes(n.toLowerCase()))
}

/**
 * Lit une réponse. Deux lectures possibles, dans le même appel :
 *  - les marques nommées, leur rang et le ton (« marques ») ;
 *  - les phrases qui contredisent un fait vérifié du projet (« faits »),
 *    seulement si le projet a des faits et si la réponse nomme la marque.
 * Renvoie le prix de l'appel.
 */
async function lire(releveId: string, quoi: { marques: boolean; faits: boolean }): Promise<{ reussi: boolean; coutUsd: number; contradictions: number }> {
  const rien = { reussi: false, coutUsd: 0, contradictions: 0 }
  const r = await prisma.releve.findUnique({
    where: { id: releveId },
    select: {
      texte: true,
      question: { select: { texte: true, projet: { select: { nom: true, marque: true, concurrents: { select: { nom: true } }, proprietes: { select: { type: true, valeur: true } }, faits: { orderBy: { createdAt: 'asc' }, select: { id: true, texte: true } } } } } },
    },
  })
  if (!r?.texte) return rien
  const projet = r.question.projet
  const noms = [projet.marque, ...projet.proprietes.filter((p) => p.type === 'nom').map((p) => p.valeur)]
  const domaines = projet.proprietes.filter((p) => p.type === 'site').map((p) => p.valeur)
  // Une réponse qui ne parle pas de la marque ne peut pas la contredire : on ne paie pas pour le vérifier.
  const faits = quoi.faits && projet.faits.length > 0 && nomme(r.texte, noms, domaines) ? projet.faits : []
  if (!quoi.marques && faits.length === 0) {
    if (quoi.faits) await prisma.releve.update({ where: { id: releveId }, data: { faitsLe: new Date() } })
    return { reussi: true, coutUsd: 0, contradictions: 0 }
  }

  const { json, coutUsd } = await demanderJson(consigne(r.question.texte, projet.marque, projet.concurrents.map((c) => c.nom), r.texte, quoi.marques, faits), {
    operation: quoi.marques ? 'analyse' : 'faits',
    projet: projet.nom,
    detail: { releveId, ...(faits.length ? { faits: faits.length } : {}) },
    valide: (j) => !quoi.marques || Array.isArray(j.marques),
  })
  if (!json) return { ...rien, coutUsd }
  const marques = quoi.marques ? lireMarques(json) : null
  const contradictions = faits.length ? lireContradictions(json, faits) : []
  const maintenant = new Date()

  // Une contradiction écartée à la main ne revient pas à la lecture suivante.
  const ecartees = quoi.faits ? await prisma.contradiction.findMany({ where: { releveId, ecartee: true }, select: { faitId: true, phrase: true } }) : []
  const nouvelles = contradictions.filter((c) => !ecartees.some((e) => e.faitId === c.faitId && e.phrase === c.phrase))
  await prisma.$transaction([
    ...(marques
      ? [
          prisma.mention.deleteMany({ where: { releveId, origine: 'analyse' } }),
          prisma.mention.createMany({ data: marques.map((m, i) => ({ releveId, nom: m.nom, ton: m.ton, rang: i + 1, origine: 'analyse' })) }),
        ]
      : []),
    ...(quoi.faits
      ? [
          prisma.contradiction.deleteMany({ where: { releveId, ecartee: false } }),
          prisma.contradiction.createMany({ data: nouvelles.map((c) => ({ releveId, ...c })) }),
        ]
      : []),
    prisma.releve.update({ where: { id: releveId }, data: { ...(marques ? { analyseLe: maintenant } : {}), ...(quoi.faits ? { faitsLe: maintenant } : {}) } }),
  ])
  return { reussi: true, coutUsd, contradictions: nouvelles.length }
}

/** Lit une réponse et enregistre les marques nommées, et les faits contredits s'il y en a. Renvoie le prix de l'appel. */
export async function analyserReleve(releveId: string): Promise<{ reussi: boolean; coutUsd: number }> {
  return lire(releveId, { marques: true, faits: true })
}

/** Compare aux faits vérifiés une réponse déjà lue. Gratuit quand la réponse ne nomme pas la marque. */
export async function verifierFaits(releveId: string): Promise<{ reussi: boolean; coutUsd: number; contradictions: number }> {
  return lire(releveId, { marques: false, faits: true })
}

/** Lance une fonction sur une liste, quatre de front. */
export async function quatreDeFront<T>(liste: T[], faire: (x: T) => Promise<void>) {
  const file = [...liste]
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let x = file.shift(); x !== undefined; x = file.shift()) await faire(x)
    }),
  )
}

/** Réponses reçues et pas encore lues, pour un projet ou pour tous. */
export function aAnalyser(projetId?: string, depuis?: Date) {
  return { statut: 'recu', analyseLe: null, texte: { not: null }, ...(projetId ? { question: { projetId } } : {}), ...(depuis ? { createdAt: { gte: depuis } } : {}) }
}

/** Lit les réponses en attente de lecture, quatre de front. */
export async function analyserEnAttente(projetId?: string, depuis?: Date, limite = 300): Promise<{ lues: number; echecs: number; coutUsd: number }> {
  const releves = await prisma.releve.findMany({ where: aAnalyser(projetId, depuis), select: { id: true }, orderBy: { createdAt: 'asc' }, take: limite })
  const bilan = { lues: 0, echecs: 0, coutUsd: 0 }
  if (releves.length === 0) return bilan
  const file = [...releves]
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let r = file.shift(); r; r = file.shift()) {
        const res = await analyserReleve(r.id)
        bilan.coutUsd += res.coutUsd
        if (res.reussi) bilan.lues++
        else bilan.echecs++
      }
    }),
  )
  return bilan
}
