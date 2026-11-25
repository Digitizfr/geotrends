import { prisma } from './prisma'
import { budgetDisponible, enregistrerAppel } from './couts'
import { anthropic } from './fournisseurs/anthropic'
import { dataforseo } from './fournisseurs/dataforseo'
import type { FournisseurReleves, Moteur, ResultatReleve } from './fournisseurs/types'
import { extraire } from './extraction'
import { rattacherVideos } from './youtube'
import { estSousProfil } from './profils'

// ── Relevés : envoi des questions, puis lecture des réponses ────────────────
// Les relevés sont asynchrones : `lancerReleves` poste les questions (appel
// payant, inscrit au journal des coûts), `collecterReleves` lit plus tard les
// réponses prêtes (gratuit). Entre les deux, la table Releve sert de file
// d'attente.

const FOURNISSEURS: FournisseurReleves[] = [dataforseo, anthropic]

/** Au-delà de ce délai sans réponse, un relevé est considéré comme perdu. */
const DELAI_MAX_MS = 6 * 3_600_000

export type BilanEnvoi = { lances: number; echecs: number; coutUsd: number }

/**
 * Envoie chaque question à chaque IA demandée. Un relevé = une ligne au
 * journal des coûts, avec le prix renvoyé par le fournisseur.
 *
 * « fois » pose la même question plusieurs fois de suite : c'est la mesure
 * approfondie. Ses relevés sont marqués « approfondi » : ils comptent pour le
 * verdict de leur question, pas dans les chiffres d'ensemble du projet.
 */
export async function lancerReleves(questionIds: string[], moteurs: Moteur[], options: { fois?: number; approfondi?: boolean } = {}): Promise<BilanEnvoi> {
  const fois = Math.max(1, Math.min(50, Math.round(options.fois ?? 1)))
  if (!(await budgetDisponible())) throw new Error('Plafond mensuel de dépense atteint : aucun relevé envoyé.')
  const questions = await prisma.question.findMany({ where: { id: { in: questionIds } }, orderBy: { ordre: 'asc' }, include: { projet: { select: { nom: true } } } })
  const bilan: BilanEnvoi = { lances: 0, echecs: 0, coutUsd: 0 }

  for (const f of FOURNISSEURS) {
    const paires = questions.flatMap((q) => moteurs.filter((m) => f.moteurs.includes(m)).flatMap((moteur) => Array.from({ length: fois }, () => ({ q, moteur }))))
    if (paires.length === 0) continue
    const taches = await f.poster(paires.map(({ q, moteur }) => ({ question: q.texte, langue: q.langue, pays: q.pays, moteur })))

    for (const [i, { q, moteur }] of paires.entries()) {
      const t = taches[i]
      // Le journal d'abord : une dépense ne doit jamais rester invisible,
      // même si l'écriture du relevé échoue ensuite.
      await enregistrerAppel({
        fournisseur: f.nom,
        operation: 'releve',
        moteur,
        projet: q.projet.nom,
        unites: t.unites,
        unite: t.unite,
        coutUsd: t.coutUsd,
        sourcePrix: t.sourcePrix ?? 'api',
        reussi: t.reussi,
        dureeMs: t.dureeMs,
        detail: { ...t.detail, questionId: q.id, ...(options.approfondi ? { approfondi: true } : {}), ...(t.erreur ? { erreur: t.erreur } : {}) },
      })
      const releve = await prisma.releve.create({
        data: {
          questionId: q.id,
          moteur,
          methode: f.methode,
          fournisseur: f.nom,
          tacheId: t.tacheId,
          statut: t.reussi ? 'en_attente' : 'echec',
          erreur: t.reussi ? null : (t.erreur ?? 'Envoi refusé'),
          coutUsd: t.coutUsd.toFixed(6),
          approfondi: options.approfondi ?? false,
        },
      })
      // Fournisseur direct (Claude) : la réponse est déjà là, on l'enregistre.
      if (t.reussi && t.resultat && t.resultat.etat !== 'en_attente') await enregistrerResultat(releve.id, t.resultat)
      bilan.coutUsd += t.coutUsd
      if (t.reussi) bilan.lances++
      else bilan.echecs++
    }
  }
  return bilan
}

/** Écrit dans la base la réponse (ou l'absence de réponse) d'un relevé. */
async function enregistrerResultat(releveId: string, res: Exclude<ResultatReleve, { etat: 'en_attente' }>) {
  const recuLe = new Date()
  if (res.etat === 'echec') {
    await prisma.releve.update({ where: { id: releveId }, data: { statut: 'echec', recuLe, erreur: res.erreur, brut: (res.brut ?? undefined) as object | undefined } })
    return
  }
  if (res.etat === 'vide') {
    await prisma.releve.update({
      where: { id: releveId },
      data: { statut: 'vide', recuLe, releveLe: res.releveLe, urlControle: res.urlControle, erreur: res.raison, brut: res.brut as object },
    })
    // Même sans aperçu IA, la page Google relevée garde ses résultats classiques.
    await extraire(releveId)
    return
  }
  await prisma.$transaction([
    prisma.source.deleteMany({ where: { releveId } }),
    prisma.releve.update({
      where: { id: releveId },
      data: {
        statut: 'recu',
        recuLe,
        releveLe: res.releveLe,
        modele: res.modele,
        texte: res.texte,
        urlControle: res.urlControle,
        erreur: null,
        brut: res.brut as object,
        sources: { create: res.sources.map((s, i) => ({ position: i + 1, url: s.url, domaine: s.domaine, titre: s.titre, extrait: s.extrait, role: s.role })) },
      },
    }),
  ])
  await extraire(releveId)
}

export type BilanCollecte = { recus: number; vides: number; echecs: number; enAttente: number }

/** Lit les réponses prêtes des relevés en attente. Appels gratuits. */
export async function collecterReleves(): Promise<BilanCollecte> {
  const attente = await prisma.releve.findMany({ where: { statut: 'en_attente', tacheId: { not: null } }, orderBy: { createdAt: 'asc' } })
  const bilan: BilanCollecte = { recus: 0, vides: 0, echecs: 0, enAttente: 0 }

  async function traiter(r: (typeof attente)[number]) {
    const f = FOURNISSEURS.find((x) => x.nom === r.fournisseur)
    if (!f) return void bilan.enAttente++
    let res: ResultatReleve
    try {
      res = await f.recuperer(r.moteur as Moteur, r.tacheId!)
    } catch {
      // Coupure passagère : on réessaiera à la prochaine collecte.
      return void bilan.enAttente++
    }
    if (res.etat === 'en_attente') {
      if (Date.now() - r.createdAt.getTime() < DELAI_MAX_MS) return void bilan.enAttente++
      res = { etat: 'echec', erreur: 'Réponse jamais arrivée (plus de 6 heures d’attente).' }
    }
    await enregistrerResultat(r.id, res)
    if (res.etat === 'recu') bilan.recus++
    else if (res.etat === 'vide') bilan.vides++
    else bilan.echecs++
  }

  // Cinq lectures de front : assez pour aller vite, sans marteler l'API.
  const file = [...attente]
  await Promise.all(Array.from({ length: 5 }, async () => {
    for (let r = file.shift(); r; r = file.shift()) await traiter(r)
  }))
  // Fiches des vidéos YouTube citées (chaîne, titre). En cas de panne de
  // YouTube, elles se rattraperont à la collecte suivante.
  await rattacherVideos().catch(() => undefined)
  return bilan
}

// ── Lecture pour les pages ──────────────────────────────────────────────────
/**
 * Une marque ne se limite pas à son site : elle possède plusieurs propriétés
 * (sites, chaînes YouTube), et une citation de l'une d'elles compte pour elle.
 */
export type Marque = {
  nom: string
  /** Sites de la marque, en minuscules et sans « www. ». */
  domaines: string[]
  /** Chaînes YouTube de la marque (identifiant « UC… »). */
  chainesYoutube: { id: string; nom: string }[]
  /** Autres écritures du nom, cherchées elles aussi dans le texte des réponses. */
  ecritures?: string[]
  /** Profils sociaux de la marque (ex. « linkedin.com/company/facturo »). */
  profils?: string[]
}

export type SourceLue = { domaine: string; role: string; url?: string; videoYoutube?: { chaineId: string } | null }

export type Presence = {
  /** Le nom de la marque apparaît dans le texte de la réponse. */
  mentionnee: boolean
  /** Une page d'un site de la marque figure parmi les sources citées. */
  citeeSite: boolean
  /** Une vidéo d'une chaîne YouTube de la marque figure parmi les sources citées. */
  citeeYoutube: boolean
  /** Une page ou une vidéo de la marque a été lue par l'IA sans être citée. */
  consultee: boolean
}

export const estDuSite = (domaine: string, marque: Marque) => marque.domaines.some((d) => domaine === d || domaine.endsWith(`.${d}`))
export const estDeLaChaine = (s: SourceLue, marque: Marque) => !!s.videoYoutube && marque.chainesYoutube.some((c) => c.id === s.videoYoutube!.chaineId)
/** La source est une page d'un profil social de la marque (LinkedIn, Instagram…). Demande l'adresse complète de la source. */
export const estDuProfil = (s: { url?: string | null }, marque: Marque) => !!marque.profils?.length && marque.profils.some((p) => estSousProfil(s.url, p))
export const estALaMarque = (s: SourceLue, marque: Marque) => estDuSite(s.domaine, marque) || estDeLaChaine(s, marque) || estDuProfil(s, marque)

/**
 * Repérage simple, par recherche du nom, des domaines et des chaînes.
 * L'analyse fine (rang, ton, concurrents) arrive à l'étape 4.
 */
export function presence(texte: string | null, sources: SourceLue[], marque: Marque): Presence {
  // Le nom de la marque et ses autres écritures, s'il y en a.
  const noms = [marque.nom, ...(marque.ecritures ?? [])].filter(Boolean).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const motif = new RegExp(`(^|[^\\p{L}\\p{N}])(${noms.join('|')})([^\\p{L}\\p{N}]|$)`, 'iu')
  const citees = sources.filter((s) => s.role === 'citee')
  return {
    mentionnee: !!texte && (motif.test(texte) || marque.domaines.some((d) => texte.toLowerCase().includes(d))),
    // Un profil social de la marque compte comme une page de la marque.
    citeeSite: citees.some((s) => estDuSite(s.domaine, marque) || estDuProfil(s, marque)),
    citeeYoutube: citees.some((s) => estDeLaChaine(s, marque)),
    consultee: sources.some((s) => s.role === 'consultee' && estALaMarque(s, marque)),
  }
}

/** Questions d'un projet, chacune avec son dernier relevé par IA. */
export async function lireQuestions(projetId: string) {
  const questions = await prisma.question.findMany({
    where: { projetId, archive: false },
    orderBy: { ordre: 'asc' },
    include: {
      releves: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, moteur: true, methode: true, statut: true, createdAt: true, releveLe: true, texte: true, erreur: true, coutUsd: true,
          sources: { select: { url: true, domaine: true, role: true, videoYoutube: { select: { chaineId: true } } } },
        },
      },
    },
  })
  return questions.map((q) => {
    const derniers = new Map<string, (typeof q.releves)[number]>()
    for (const r of q.releves) if (!derniers.has(r.moteur)) derniers.set(r.moteur, r)
    return { ...q, nbReleves: q.releves.length, derniers }
  })
}

/** Une question avec tous ses relevés et leurs sources, du plus récent au plus ancien. */
export async function lireQuestion(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      projet: { include: { proprietes: true } },
      releves: {
        orderBy: { createdAt: 'desc' },
        omit: { brut: true },
        include: {
          sources: { orderBy: { position: 'asc' }, include: { videoYoutube: true } },
          mentions: { orderBy: { rang: 'asc' } },
          recherches: { orderBy: { position: 'asc' } },
        },
      },
    },
  })
}

/** Vidéos YouTube citées par les IA pour un projet, regroupées par chaîne, la plus citée d'abord. */
export async function lireChainesCitees(projetId: string) {
  const sources = await prisma.source.findMany({
    where: { role: 'citee', videoYoutubeId: { not: null }, releve: { question: { projetId } } },
    select: {
      videoYoutube: true,
      releve: { select: { moteur: true, question: { select: { id: true, texte: true } } } },
    },
  })
  type Citation = { moteur: string; questionId: string; question: string }
  type Video = { id: string; titre: string; vues: number | null; publieLe: Date | null; citations: Citation[] }
  const chaines = new Map<string, { id: string; nom: string; videos: Map<string, Video> }>()
  for (const s of sources) {
    const v = s.videoYoutube!
    const chaine = chaines.get(v.chaineId) ?? { id: v.chaineId, nom: v.chaineNom, videos: new Map<string, Video>() }
    const video = chaine.videos.get(v.id) ?? { id: v.id, titre: v.titre, vues: v.vues, publieLe: v.publieLe, citations: [] }
    video.citations.push({ moteur: s.releve.moteur, questionId: s.releve.question.id, question: s.releve.question.texte })
    chaine.videos.set(v.id, video)
    chaines.set(v.chaineId, chaine)
  }
  return [...chaines.values()]
    .map((c) => ({ id: c.id, nom: c.nom, videos: [...c.videos.values()], citations: [...c.videos.values()].reduce((n, v) => n + v.citations.length, 0) }))
    .sort((a, b) => b.citations - a.citations || a.nom.localeCompare(b.nom))
}
