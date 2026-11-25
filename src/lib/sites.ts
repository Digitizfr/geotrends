import { demanderJson, MODELE_ANALYSE, quatreDeFront } from './analyse'
import { budgetDisponible } from './couts'
import { prisma } from './prisma'

/*
 * Type de chaque site cité (fonction M8). Un domaine est classé une seule fois
 * par le petit modèle, à partir de son nom et des titres de ses pages citées,
 * puis le classement est gardé : il ne repasse jamais par le modèle. Une
 * correction à la main l'emporte toujours.
 *
 * Le classement est payant (quelques centimes par projet) : il part du bouton
 * « Classer les sites » de l'écran Sources, puis tout seul pour les nouveaux
 * sites, dans la tâche de fond, tant que l'utilisateur ne l'a pas coupé.
 */

export const TYPES_SITE = {
  comparatif: { libelle: 'comparatif', groupe: 'Comparatifs', teinte: 'teinte-encre' },
  media: { libelle: 'média', groupe: 'Médias', teinte: 'teinte-s2' },
  annuaire: { libelle: 'annuaire', groupe: 'Annuaires', teinte: 'teinte-s3' },
  blog: { libelle: 'blog', groupe: 'Blogs', teinte: 'teinte-s5' },
  forum: { libelle: 'forum ou communauté', groupe: 'Forums et communautés', teinte: 'teinte-s6' },
  video: { libelle: 'vidéo', groupe: 'Vidéos', teinte: 'teinte-s4' },
  social: { libelle: 'réseau social', groupe: 'Réseaux sociaux', teinte: 'teinte-papier' },
  officiel: { libelle: 'site officiel ou institution', groupe: 'Sites officiels et institutions', teinte: 'teinte-clair' },
  boutique: { libelle: 'boutique', groupe: 'Boutiques', teinte: 'teinte-papier' },
  marque: { libelle: 'site de marque', groupe: 'Sites de marque', teinte: 'teinte-marque' },
  autre: { libelle: 'autre', groupe: 'Autres sites', teinte: 'teinte-papier' },
} as const

export type TypeSite = keyof typeof TYPES_SITE
/** « a_classer » : le site n'est pas encore classé. Rien n'est deviné. */
export type TypeLu = TypeSite | 'a_classer'

export const estTypeSite = (v: unknown): v is TypeSite => typeof v === 'string' && v in TYPES_SITE
export const libelleType = (t: TypeLu) => (t === 'a_classer' ? 'à classer' : TYPES_SITE[t].libelle)
export const groupeType = (t: TypeLu) => (t === 'a_classer' ? 'À classer' : TYPES_SITE[t].groupe)
export const teinteType = (t: TypeLu) => (t === 'a_classer' ? 'teinte-vide' : TYPES_SITE[t].teinte)

export type FicheSite = { type: TypeSite; marque: string | null; origine: string }

/** Prix moyen du classement d'un site, pour l'estimation affichée sur le bouton. */
export const PRIX_CLASSEMENT_USD = 0.00005
const LOT = 25

// Les plateformes connues de tous se rangent sans le modèle : c'est sûr, et gratuit.
const VIDEO = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv']
const SOCIAL = ['linkedin.com', 'facebook.com', 'instagram.com', 'x.com', 'twitter.com', 'tiktok.com', 'pinterest.com', 'threads.net', 'threads.com', 'snapchat.com', 'bsky.app']
const FORUM = ['reddit.com', 'quora.com', 'stackoverflow.com', 'stackexchange.com', 'trustpilot.com']
const hote = (domaine: string, liste: string[]) => liste.some((d) => domaine === d || domaine.endsWith(`.${d}`))

/** Type certain d'une plateforme connue, ou null : dans ce cas, c'est le classement qui répond. */
export function typeCertain(domaine: string): TypeSite | null {
  if (hote(domaine, VIDEO)) return 'video'
  if (hote(domaine, SOCIAL)) return 'social'
  if (hote(domaine, FORUM) || /(^|\.)forums?\./.test(domaine)) return 'forum'
  if (/\.gouv\.[a-z]+$|\.gov$|\.gov\.[a-z]+$|(^|\.)europa\.eu$/.test(domaine)) return 'officiel'
  return null
}

export const cleClassementAuto = (projetId: string) => `classement_auto:${projetId}`

/** Vrai si les nouveaux sites du projet se classent tout seuls dans la tâche de fond. */
export async function classementAuto(projetId: string) {
  return (await prisma.reglage.findUnique({ where: { cle: cleClassementAuto(projetId) } }))?.valeur === '1'
}

/** Sites vus dans les sources du projet et pas encore classés, avec quelques titres de leurs pages. */
export async function sitesAClasser(projetId: string): Promise<{ domaine: string; titres: string[] }[]> {
  const [sources, classes] = await Promise.all([
    prisma.source.findMany({ where: { releve: { question: { projetId } }, domaine: { not: '' } }, select: { domaine: true, titre: true }, orderBy: { position: 'asc' } }),
    prisma.domaine.findMany({ select: { domaine: true } }),
  ])
  const connus = new Set(classes.map((c) => c.domaine))
  const sites = new Map<string, Set<string>>()
  for (const s of sources) {
    if (connus.has(s.domaine) || typeCertain(s.domaine)) continue
    const titres = sites.get(s.domaine) ?? new Set<string>()
    if (s.titre && titres.size < 4) titres.add(s.titre.replace(/\s+/g, ' ').trim().slice(0, 110))
    sites.set(s.domaine, titres)
  }
  return [...sites].map(([domaine, titres]) => ({ domaine, titres: [...titres] })).sort((a, b) => a.domaine.localeCompare(b.domaine))
}

function consigne(sites: { domaine: string; titres: string[] }[]) {
  return [
    'Tu classes des sites web cités comme sources par des assistants IA. Pour chaque site, tu reçois son nom de domaine et les titres de quelques-unes de ses pages citées.',
    'Pour chaque site, donne "type", une seule valeur parmi :',
    '- "comparatif" : site dont le métier est de comparer, tester ou classer des produits, des logiciels ou des prestataires ;',
    '- "media" : presse, magazine en ligne, site d’actualité ;',
    '- "blog" : blog d’une personne, d’un indépendant ou d’une agence, qui publie des articles de conseil sans vendre lui-même les produits dont il parle ;',
    '- "forum" : forum, communauté, site de questions et réponses, site d’avis d’utilisateurs ;',
    '- "annuaire" : annuaire ou place de marché qui liste des prestataires, des outils ou des entreprises ;',
    '- "marque" : site d’une entreprise ou d’un produit, qui y présente sa propre offre (y compris le blog et l’aide en ligne de cette marque) ;',
    '- "officiel" : administration, organisme public, institution, université, école, organisation professionnelle ;',
    '- "video" : plateforme de vidéos ;',
    '- "social" : réseau social ;',
    '- "boutique" : site marchand qui vend les produits de plusieurs marques ;',
    '- "autre" : tout le reste, ou quand le domaine et les titres ne suffisent pas pour trancher.',
    'Donne aussi "marque" : quand le type est "marque", le nom courant de la marque ou de l’entreprise à qui appartient le site ; sinon null.',
    'Ne devine pas au hasard : dans le doute, réponds "autre".',
    'Réponds uniquement par un objet JSON de cette forme, avec une entrée par site reçu et le domaine recopié tel quel : {"sites":[{"domaine":"exemple.fr","type":"media","marque":null}]}',
    '',
    '--- SITES À CLASSER ---',
    ...sites.map((s, i) => `${i + 1}. ${s.domaine}${s.titres.length ? ` | titres : ${s.titres.map((t) => `« ${t} »`).join(' ; ')}` : ''}`),
  ].join('\n')
}

export type BilanClassement = { classes: number; echecs: number; coutUsd: number; restants: number }

/**
 * Classe les sites du projet qui ne le sont pas encore, par lots de 25.
 * Appels payants, inscrits au journal des coûts. S'arrête si le plafond du
 * mois est atteint.
 */
export async function classerSites(projetId: string, limite = 1000): Promise<BilanClassement> {
  const projet = await prisma.projet.findUnique({ where: { id: projetId }, select: { nom: true } })
  const bilan: BilanClassement = { classes: 0, echecs: 0, coutUsd: 0, restants: 0 }
  if (!projet) return bilan
  const tous = await sitesAClasser(projetId)
  const sites = tous.slice(0, limite)
  const lots: (typeof sites)[] = []
  for (let i = 0; i < sites.length; i += LOT) lots.push(sites.slice(i, i + LOT))

  await quatreDeFront(lots, async (lot) => {
    if (!(await budgetDisponible())) {
      bilan.echecs += lot.length
      return
    }
    const { json, coutUsd } = await demanderJson(consigne(lot), { operation: 'classement', projet: projet.nom, detail: { sites: lot.length }, valide: (j) => Array.isArray(j.sites) })
    bilan.coutUsd += coutUsd
    const attendus = new Set(lot.map((s) => s.domaine))
    const lus = new Map<string, { type: TypeSite; marque: string | null }>()
    for (const x of Array.isArray(json?.sites) ? json.sites : []) {
      const o = x && typeof x === 'object' ? (x as Record<string, unknown>) : {}
      const domaine = typeof o.domaine === 'string' ? o.domaine.trim().toLowerCase().replace(/^www\./, '') : ''
      if (!attendus.has(domaine) || !estTypeSite(o.type)) continue
      const marque = o.type === 'marque' && typeof o.marque === 'string' && o.marque.trim() ? o.marque.trim().slice(0, 80) : null
      lus.set(domaine, { type: o.type, marque })
    }
    if (lus.size > 0) await prisma.domaine.createMany({ data: [...lus].map(([domaine, x]) => ({ domaine, type: x.type, marque: x.marque, origine: 'modele', modele: MODELE_ANALYSE })), skipDuplicates: true })
    bilan.classes += lus.size
    bilan.echecs += lot.length - lus.size
  })
  bilan.restants = tous.length - bilan.classes
  return bilan
}

/** Classement des sites déjà connus : la lecture que font les écrans. */
export async function lireSites(): Promise<Map<string, FicheSite>> {
  const lignes = await prisma.domaine.findMany({ select: { domaine: true, type: true, marque: true, origine: true } })
  return new Map(lignes.filter((l) => estTypeSite(l.type)).map((l) => [l.domaine, { type: l.type as TypeSite, marque: l.marque, origine: l.origine }]))
}
