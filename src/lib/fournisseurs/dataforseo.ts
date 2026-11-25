import { cleRequise } from '../cles'
import { domaineDe, type DemandeReleve, type FournisseurReleves, type Moteur, type ResultatReleve, type SourceRelevee, type TachePostee } from './types'

/*
 * DataForSEO : relevé de l'interface réelle de ChatGPT, de Gemini, du Mode IA
 * et des Aperçus IA de Google. Réservé au serveur (node:fs).
 *
 * Fonctionnement en deux temps : on poste une tâche (c'est le seul appel
 * facturé, 0,0012 $ en file normale), puis on lit le résultat quand il est
 * prêt (gratuit, jusqu'à 45 minutes plus tard).
 *
 * Authentification Basic, « identifiant:mot de passe » encodé en base64 : voir
 * src/lib/cles.ts (DATAFORSEO_LOGIN et DATAFORSEO_PASSWORD, ou DATAFORSEO_AUTH
 * déjà encodé, à ne pas ré-encoder : l'API répondrait 401).
 */

const BASE = 'https://api.dataforseo.com/v3'

// Chemins de l'API par IA. Les Aperçus IA n'ont pas d'adresse propre : ils se
// lisent dans la page de résultats classique de Google.
const CHEMINS: Partial<Record<Moteur, string>> = {
  chatgpt: 'ai_optimization/chat_gpt/llm_scraper',
  gemini: 'ai_optimization/gemini/llm_scraper',
  google_ai_mode: 'serp/google/ai_mode',
  google_ai_overview: 'serp/google/organic',
}

// Codes de pays DataForSEO : 2000 + code numérique ISO 3166-1. La liste
// complète se lit sur /v3/<chemin>/locations ; on ne garde ici que les pays
// vérifiés, à compléter à mesure des besoins.
const CODES_PAYS: Record<string, number> = {
  FR: 2250, BE: 2056, CH: 2756, CA: 2124, LU: 2442,
  US: 2840, GB: 2826, DE: 2276, ES: 2724, IT: 2380,
}

function chemin(moteur: Moteur): string {
  const c = CHEMINS[moteur]
  if (!c) throw new Error(`DataForSEO ne relève pas « ${moteur} ».`)
  return c
}

const entete = () => cleRequise('dataforseo')

type Tache = {
  id?: string
  status_code?: number
  status_message?: string
  cost?: number
  result?: unknown[] | null
}
type Reponse = { status_code?: number; status_message?: string; tasks?: Tache[] }

async function appeler(chemin: string, corps?: unknown): Promise<Reponse> {
  const res = await fetch(`${BASE}/${chemin}`, {
    method: corps ? 'POST' : 'GET',
    headers: { Authorization: `Basic ${entete()}`, 'Content-Type': 'application/json' },
    body: corps ? JSON.stringify(corps) : undefined,
    signal: AbortSignal.timeout(60_000),
  })
  if (!res.ok) throw new Error(`DataForSEO ${chemin} : HTTP ${res.status} ${(await res.text()).slice(0, 200)}`)
  return (await res.json()) as Reponse
}

function tacheDe(d: DemandeReleve) {
  const code = CODES_PAYS[d.pays.toUpperCase()]
  if (!code) throw new Error(`Pays « ${d.pays} » non géré par le fournisseur DataForSEO : l'ajouter dans CODES_PAYS après vérification.`)
  const base = { keyword: d.question, location_code: code, language_code: d.langue.toLowerCase() }
  // Pour les Aperçus IA : charger aussi ceux que Google affiche en différé
  // (supplément de 0,0006 $, remboursé s'il n'y a pas d'aperçu).
  return d.moteur === 'google_ai_overview' ? { ...base, device: 'desktop', depth: 10, load_async_ai_overview: true } : base
}

async function poster(demandes: DemandeReleve[]): Promise<TachePostee[]> {
  const sorties = new Array<TachePostee>(demandes.length)
  // Un envoi par IA, 100 tâches au plus par envoi (limite de l'API).
  const groupes = new Map<Moteur, number[]>()
  demandes.forEach((d, i) => groupes.set(d.moteur, [...(groupes.get(d.moteur) ?? []), i]))

  for (const [moteur, indices] of groupes) {
    for (let debut = 0; debut < indices.length; debut += 100) {
      const lot = indices.slice(debut, debut + 100)
      const t0 = Date.now()
      try {
        const r = await appeler(`${chemin(moteur)}/task_post`, lot.map((i) => tacheDe(demandes[i])))
        const dureeMs = Date.now() - t0
        lot.forEach((i, rang) => {
          const t = r.tasks?.[rang]
          // 20100 = tâche créée. Tout autre code est un refus, non facturé.
          const reussi = t?.status_code === 20100 && !!t.id
          sorties[i] = {
            reussi,
            tacheId: t?.id ?? null,
            coutUsd: Number(t?.cost ?? 0),
            dureeMs,
            erreur: reussi ? undefined : `${t?.status_code ?? r.status_code} ${t?.status_message ?? r.status_message ?? 'réponse vide'}`,
            detail: { tacheId: t?.id ?? null, code: t?.status_code ?? null },
          }
        })
      } catch (e) {
        // Échec de l'envoi lui-même (réseau, 401…) : en principe rien n'est
        // facturé. Seul un délai dépassé laisse un doute, visible au journal
        // comme un échec à 0 $.
        const dureeMs = Date.now() - t0
        for (const i of lot) sorties[i] = { reussi: false, tacheId: null, coutUsd: 0, dureeMs, erreur: e instanceof Error ? e.message : String(e) }
      }
    }
  }
  return sorties
}

// ── Lecture des résultats ───────────────────────────────────────────────────
type Obj = Record<string, unknown>
const obj = (v: unknown): Obj => (v && typeof v === 'object' ? (v as Obj) : {})
const liste = (v: unknown): Obj[] => (Array.isArray(v) ? v.map(obj) : [])
const texte = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null)

/** « 2026-11-12 06:15:02 +00:00 » → Date. */
function dateDe(v: unknown): Date | null {
  const s = texte(v)
  if (!s) return null
  const d = new Date(s.replace(' ', 'T').replace(' ', ''))
  return Number.isNaN(d.getTime()) ? null : d
}

function sourcesDe(lignes: Obj[], role: SourceRelevee['role'], dejaVues: Set<string>): SourceRelevee[] {
  const sorties: SourceRelevee[] = []
  for (const l of lignes) {
    const url = texte(l.url)
    if (!url || dejaVues.has(url)) continue
    dejaVues.add(url)
    sorties.push({
      url,
      domaine: texte(l.domain)?.toLowerCase().replace(/^www\./, '') ?? domaineDe(url),
      titre: texte(l.title),
      extrait: texte(l.snippet) ?? texte(l.text) ?? texte(l.description),
      role,
    })
  }
  return sorties
}

/** ChatGPT et Gemini : la réponse est à la racine du résultat. */
function lireAssistant(r: Obj): ResultatReleve {
  const releveLe = dateDe(r.datetime)
  const urlControle = texte(r.check_url)
  const reponse = texte(r.markdown) ?? liste(r.items).map((i) => texte(i.markdown) ?? texte(i.text)).filter(Boolean).join('\n\n')
  if (!reponse) return { etat: 'vide', raison: 'Le fournisseur n’a renvoyé aucun texte de réponse.', releveLe, urlControle, brut: r }
  const vues = new Set<string>()
  // « sources » : ce que l'IA cite. « search_results » : tout ce qu'elle a lu.
  const citees = sourcesDe(liste(r.sources), 'citee', vues)
  const consultees = sourcesDe(liste(r.search_results), 'consultee', vues)
  return { etat: 'recu', texte: reponse, sources: [...citees, ...consultees], modele: texte(r.model), releveLe, urlControle, brut: r }
}

/** Mode IA et Aperçus IA : la réponse est un bloc « ai_overview » de la page Google. */
function lireGoogle(r: Obj, moteur: Moteur): ResultatReleve {
  const releveLe = dateDe(r.datetime)
  const urlControle = texte(r.check_url)
  const bloc = liste(r.items).find((i) => i.type === 'ai_overview')
  const reponse = bloc ? texte(bloc.markdown) ?? liste(bloc.items).map((i) => texte(i.markdown) ?? texte(i.text)).filter(Boolean).join('\n\n') : null
  if (!bloc || !reponse) {
    const raison = moteur === 'google_ai_overview' ? 'Google n’a pas affiché d’aperçu IA pour cette question.' : 'Google n’a pas affiché de réponse en Mode IA pour cette question.'
    return { etat: 'vide', raison, releveLe, urlControle, brut: r }
  }
  const vues = new Set<string>()
  const references = [...liste(bloc.references), ...liste(bloc.items).flatMap((i) => liste(i.references))]
  return { etat: 'recu', texte: reponse, sources: sourcesDe(references, 'citee', vues), modele: null, releveLe, urlControle, brut: r }
}

async function recuperer(moteur: Moteur, tacheId: string): Promise<ResultatReleve> {
  const r = await appeler(`${chemin(moteur)}/task_get/advanced/${tacheId}`)
  const t = r.tasks?.[0]
  const code = t?.status_code ?? r.status_code ?? 0
  // 40601 = tâche transmise, 40602 = tâche en file : pas encore prête.
  if (code === 40601 || code === 40602) return { etat: 'en_attente' }
  if (code !== 20000) {
    // 40102 = aucun résultat : la tâche a abouti, sans rien à montrer.
    if (code === 40102) return { etat: 'vide', raison: 'Aucun résultat renvoyé pour cette question.', releveLe: null, urlControle: null, brut: t ?? r }
    return { etat: 'echec', erreur: `${code} ${t?.status_message ?? r.status_message ?? ''}`.trim(), brut: t ?? r }
  }
  const resultat = obj(t?.result?.[0])
  if (!t?.result?.length) return { etat: 'vide', raison: 'Aucun résultat renvoyé pour cette question.', releveLe: null, urlControle: null, brut: t }
  return moteur === 'chatgpt' || moteur === 'gemini' ? lireAssistant(resultat) : lireGoogle(resultat, moteur)
}

export const dataforseo: FournisseurReleves = {
  nom: 'dataforseo',
  methode: 'interface',
  moteurs: ['chatgpt', 'gemini', 'google_ai_mode', 'google_ai_overview'],
  poster,
  recuperer,
}
