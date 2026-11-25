import Anthropic from '@anthropic-ai/sdk'
import { cleRequise } from '../cles'
import { prixAnthropic, type VolumesAnthropic } from '../tarifs'
import { domaineDe, type DemandeReleve, type FournisseurReleves, type ResultatReleve, type SourceRelevee, type TachePostee } from './types'

/*
 * Claude, par l'API officielle d'Anthropic avec la recherche web activée.
 *
 * Aucun service ne relève l'interface de claude.ai : la méthode est donc
 * « api » (réponse du modèle seul, sans les réglages de l'application grand
 * public). Ces relevés ne se mélangent jamais avec ceux de la méthode
 * « interface » dans un même indicateur.
 *
 * L'appel est direct : la réponse revient dans la foulée, il n'y a pas de
 * tâche à relire plus tard. Le prix est calculé depuis la grille de tarifs
 * (jetons + recherches web), Anthropic ne le renvoyant pas.
 */

/** Modèle interrogé. Se change par la variable CLAUDE_MODELE, sans toucher au code. */
export const MODELE_CLAUDE = process.env.CLAUDE_MODELE || 'claude-sonnet-5-5'
/**
 * Version de l'outil de recherche web. On garde volontairement la version de
 * base : elle rattache à chaque phrase les pages citées, ce qui est exactement
 * ce qu'on mesure. La version plus récente (web_search_20260209) filtre les
 * résultats par un programme et ne renvoie plus aucune citation (constaté le
 * 12/11/2026 : 18 pages lues, 0 citée).
 */
const OUTIL_RECHERCHE = 'web_search_20250305' as const
/** Le repli automatique en cas de refus n'existe pas sur les modèles Haiku. */
const AVEC_REPLI = !MODELE_CLAUDE.includes('haiku')
/** Recherches web autorisées par question : borne la dépense. */
const RECHERCHES_MAX = 5
/** Une longue recherche peut se mettre en pause : on la reprend, trois fois au plus. */
const REPRISES_MAX = 3

export const cleAnthropic = () => cleRequise('anthropic')

type Bloc = Anthropic.Beta.BetaContentBlock

/** Retire des données brutes les champs chiffrés : lourds, illisibles, inutiles à l'analyse. */
function allegees(blocs: Bloc[]): unknown {
  return JSON.parse(JSON.stringify(blocs, (k, v) => (k === 'encrypted_content' || k === 'encrypted_index' || k === 'signature' ? undefined : v)))
}

function lire(blocs: Bloc[], modele: string, arret: string | null, volumes: VolumesAnthropic): ResultatReleve {
  const morceaux: string[] = []
  let suiteDeTexte = false
  const citees: SourceRelevee[] = []
  const consultees: SourceRelevee[] = []
  const requetes: string[] = []
  const vues = new Set<string>()

  for (const b of blocs) {
    if (b.type === 'text') {
      // Une même phrase arrive en plusieurs blocs quand elle porte des
      // citations : on les recolle sans séparateur.
      if (suiteDeTexte) morceaux[morceaux.length - 1] += b.text
      else morceaux.push(b.text)
      suiteDeTexte = true
      for (const c of b.citations ?? []) {
        if (c.type !== 'web_search_result_location' || vues.has(c.url)) continue
        vues.add(c.url)
        citees.push({ url: c.url, domaine: domaineDe(c.url), titre: c.title, extrait: c.cited_text?.slice(0, 500) ?? null, role: 'citee' })
      }
      continue
    }
    suiteDeTexte = false
    if (b.type === 'server_tool_use' && b.name === 'web_search') {
      const q = (b.input as { query?: unknown } | null)?.query
      if (typeof q === 'string') requetes.push(q)
    }
  }
  // Pages trouvées par les recherches et non citées : lues, mais pas retenues.
  for (const b of blocs) {
    if (b.type !== 'web_search_tool_result' || !Array.isArray(b.content)) continue
    for (const r of b.content) {
      if (vues.has(r.url)) continue
      vues.add(r.url)
      consultees.push({ url: r.url, domaine: domaineDe(r.url), titre: r.title, extrait: null, role: 'consultee' })
    }
  }

  const brut = { modele, arret, volumes, requetes, blocs: allegees(blocs) }
  const texte = morceaux.map((m) => m.trim()).filter(Boolean).join('\n\n')
  if (arret === 'refusal') return { etat: 'vide', raison: 'Claude a décliné cette question.', releveLe: new Date(), urlControle: null, brut }
  if (!texte) return { etat: 'vide', raison: 'Claude n’a renvoyé aucun texte.', releveLe: new Date(), urlControle: null, brut }
  return { etat: 'recu', texte, sources: [...citees, ...consultees], modele, releveLe: new Date(), urlControle: null, brut }
}

async function interroger(client: Anthropic, d: DemandeReleve): Promise<TachePostee> {
  const t0 = Date.now()
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: d.question }]
  const blocs: Bloc[] = []
  const volumes: VolumesAnthropic = { entree: 0, sortie: 0, cacheEcriture: 0, cacheLecture: 0, recherchesWeb: 0 }
  let dernier: Anthropic.Beta.BetaMessage | null = null
  let erreur: string | undefined

  try {
    for (let tour = 0; tour <= REPRISES_MAX; tour++) {
      const m = await client.beta.messages
        .stream({
          model: MODELE_CLAUDE,
          max_tokens: 16000,
          // Si le modèle décline une question, l'API la confie à un modèle de
          // repli. Le modèle qui a réellement répondu est noté dans le relevé.
          ...(AVEC_REPLI ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
          tools: [{ type: OUTIL_RECHERCHE, name: 'web_search', max_uses: RECHERCHES_MAX, user_location: { type: 'approximate', country: d.pays.toUpperCase() } }],
          messages,
        })
        .finalMessage()
      dernier = m
      blocs.push(...m.content)
      volumes.entree += m.usage.input_tokens
      volumes.sortie += m.usage.output_tokens
      volumes.cacheEcriture += m.usage.cache_creation_input_tokens ?? 0
      volumes.cacheLecture += m.usage.cache_read_input_tokens ?? 0
      volumes.recherchesWeb += m.usage.server_tool_use?.web_search_requests ?? 0
      if (m.stop_reason !== 'pause_turn') break
      messages.push({ role: 'assistant', content: m.content as Anthropic.Beta.BetaContentBlockParam[] })
    }
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) erreur = 'Limite de débit Anthropic atteinte (429).'
    else if (e instanceof Anthropic.AuthenticationError) erreur = 'Clé Anthropic refusée (401).'
    else if (e instanceof Anthropic.APIError) erreur = `Anthropic ${e.status ?? ''} : ${e.message}`.slice(0, 300)
    else erreur = e instanceof Error ? e.message : String(e)
  }

  const modele = dernier?.model ?? MODELE_CLAUDE
  // Des jetons ont pu être consommés avant une erreur : on les compte quand même.
  const coutUsd = prixAnthropic(modele, volumes) ?? prixAnthropic(MODELE_CLAUDE, volumes) ?? 0
  const commun = {
    coutUsd,
    dureeMs: Date.now() - t0,
    sourcePrix: 'grille' as const,
    unites: volumes.entree + volumes.sortie + volumes.cacheEcriture + volumes.cacheLecture,
    unite: 'jeton',
    detail: { modele, modeleDemande: MODELE_CLAUDE, ...volumes },
  }
  if (!dernier || erreur) return { ...commun, reussi: false, tacheId: dernier?.id ?? null, erreur: erreur ?? 'Réponse vide' }
  return { ...commun, reussi: true, tacheId: dernier.id, resultat: lire(blocs, modele, dernier.stop_reason, volumes) }
}

async function poster(demandes: DemandeReleve[]): Promise<TachePostee[]> {
  const client = new Anthropic({ apiKey: cleAnthropic() })
  const sorties = new Array<TachePostee>(demandes.length)
  // Trois questions de front : un appel dure d'une demi-minute à deux minutes.
  let suivant = 0
  await Promise.all(
    Array.from({ length: 3 }, async () => {
      for (let i = suivant++; i < demandes.length; i = suivant++) sorties[i] = await interroger(client, demandes[i])
    }),
  )
  return sorties
}

export const anthropic: FournisseurReleves = {
  nom: 'anthropic',
  methode: 'api',
  moteurs: ['claude'],
  poster,
  // La réponse revient avec l'envoi : rien n'est jamais en attente.
  recuperer: async () => ({ etat: 'echec', erreur: 'Les relevés de Claude sont directs : il n’y a pas de tâche à relire.' }),
}
