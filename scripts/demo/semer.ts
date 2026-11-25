// Remplit la base de démonstration (geotrends_demo) avec des données FICTIVES :
// la marque Facturo, ses concurrents, deux projets (France en français, Royaume-Uni
// en anglais), huit semaines de relevés, la lecture automatique déjà faite, les
// actions, les faits vérifiés et le journal des coûts.
//
//   DATABASE_URL=…/geotrends_demo npx tsx scripts/demo/semer.ts
//
// Aucun appel à une API : tout est écrit directement dans la base, comme si les
// relevés et la lecture automatique avaient eu lieu. Les dates suivent le jour du
// lancement (le dernier relevé est le lundi le plus récent) : les écrans ont
// toujours l'air à jour. Le reste est déterministe : mêmes chiffres à chaque fois.
import 'dotenv/config'
import { auth } from '../../src/lib/auth'
import { prisma } from '../../src/lib/prisma'
import { COMPTE_DEMO, COMPTE_MEMBRE, INVITATION_DEMO, PARTAGES_DEMO } from './compte'
import { clePage } from '../../src/lib/pages-suivies'
import { EN } from './contenu-en'
import { FR } from './contenu-fr'
import { IA, type Marche, type Moteur, type QuestionDemo, type Via } from './types'

// ── Garde-fou : jamais ailleurs que dans la base de démonstration ───────────
const BASE = process.env.DATABASE_URL ?? ''
if (!/\/geotrends_demo(\?|$)/.test(BASE)) {
  console.error('Refus : DATABASE_URL doit désigner la base « geotrends_demo ». Ce script vide la base avant de la remplir.')
  process.exit(1)
}

// ── Hasard déterministe ─────────────────────────────────────────────────────
function hacher(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
/** Nombre entre 0 et 1, toujours le même pour les mêmes clés. */
function rnd(...cles: (string | number)[]): number {
  let t = (hacher(cles.join('|')) + 0x6d2b79f5) >>> 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const choix = <T>(liste: T[], ...cles: (string | number)[]): T => liste[Math.floor(rnd(...cles) * liste.length)]
/** Identifiant stable (même forme qu'un cuid) : les adresses des écrans restent les mêmes d'une fois sur l'autre. */
const ident = (...cles: (string | number)[]) => {
  const k = cles.join('|')
  return `c${[hacher(`a|${k}`), hacher(`b|${k}`), hacher(`c|${k}`)].map((h) => h.toString(36).padStart(7, '0')).join('')}`.slice(0, 22)
}
const hex = (n: number, ...cles: (string | number)[]) => Array.from({ length: n }, (_, i) => Math.floor(rnd(...cles, 'hex', i) * 16).toString(16)).join('')

// ── Dates, à l'heure de Paris ───────────────────────────────────────────────
function decalageParis(d: Date): number {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(d)
  const v = (t: string) => Number(p.find((x) => x.type === t)!.value)
  return Date.UTC(v('year'), v('month') - 1, v('day'), v('hour'), v('minute'), v('second')) - d.getTime()
}
const cleJour = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(d)
const plusJours = (jour: string, n: number) => new Date(Date.parse(`${jour}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10)
function instant(jour: string, h: number, m: number, s = 0): Date {
  const [a, mo, j] = jour.split('-').map(Number)
  const utc = Date.UTC(a, mo - 1, j, h, m, s)
  return new Date(utc - decalageParis(new Date(utc)))
}
const plus = (d: Date, ms: number) => new Date(d.getTime() + ms)
const MIN = 60_000

const MAINTENANT = new Date()
const aujourdhui = cleJour(MAINTENANT)
let lundi = plusJours(aujourdhui, -((new Date(`${aujourdhui}T12:00:00Z`).getUTCDay() + 6) % 7))
// Le dernier relevé doit dater d'au moins six heures : tout ce qui le suit (lecture, démarches) est déjà passé.
if (instant(lundi, 6, 15).getTime() > MAINTENANT.getTime() - 6 * 3_600_000) lundi = plusJours(lundi, -7)
/** Les huit lundis de relevé, du plus ancien au plus récent. */
const SEMAINES = Array.from({ length: 8 }, (_, i) => plusJours(lundi, -7 * (7 - i)))
/** Claude : un relevé toutes les deux semaines (semaines 2, 4, 6 et 8). */
const SEMAINES_CLAUDE = [1, 3, 5, 7]

// ── Lignes à écrire ─────────────────────────────────────────────────────────
type Ligne = Record<string, unknown>
const L = {
  projets: [] as Ligne[], proprietes: [] as Ligne[], concurrents: [] as Ligne[], questions: [] as Ligne[],
  releves: [] as Ligne[], sources: [] as Ligne[], mentions: [] as Ligne[], recherches: [] as Ligne[], resultats: [] as Ligne[], associees: [] as Ligne[],
  videos: new Map<string, Ligne>(), domaines: new Map<string, Ligne>(), faits: [] as Ligne[], contradictions: [] as Ligne[],
  etats: [] as Ligne[], demarches: [] as Ligne[], appels: [] as Ligne[], reglages: [] as Ligne[],
}
const domaineDe = (url: string) => new URL(url).hostname.toLowerCase().replace(/^www\./, '')

type SourceGen = { cle: string; url: string; domaine: string; titre: string; video?: string; role: 'citee' | 'consultee' }

/** Une page ou une vidéo du catalogue, prête à devenir une source. */
function source(M: Marche, cle: string, role: 'citee' | 'consultee'): SourceGen {
  const v = M.videos[cle]
  if (v) return { cle, url: `https://www.youtube.com/watch?v=${v.id}${v.moment ? `&t=${v.moment}s` : ''}`, domaine: 'youtube.com', titre: v.titre, video: v.id, role }
  const p = M.pages[cle]
  if (!p) throw new Error(`Page inconnue : ${cle}`)
  return { cle, url: p.url, domaine: domaineDe(p.url), titre: p.titre, role }
}

/** À quelle marque appartient une source (pour accrocher son lien à la bonne ligne de la réponse). */
function proprietaire(M: Marche, s: SourceGen): string | null {
  if (s.video) {
    const v = Object.values(M.videos).find((x) => x.id === s.video)!
    if (v.chaine === 'facturo' || v.chaine === 'academy') return M.projet.marque
    const nomChaine = M.chaines[v.chaine].nom
    return Object.keys(M.marques).find((n) => n === nomChaine) ?? null
  }
  if (s.domaine === 'facturo.exemple' || s.domaine === 'linkedin.com') return M.projet.marque
  return Object.keys(M.marques).find((n) => s.domaine === `${n.toLowerCase()}.exemple`) ?? null
}

const NOMS_MOTEURS: Record<Moteur, number> = { chatgpt: 1, gemini: 2, google_ai_mode: 3, google_ai_overview: 4, claude: 5 }

function liste(M: Marche, noms: string[]) {
  const et = M.projet.langue === 'fr' ? ' et ' : ' and '
  return noms.length <= 1 ? noms.join('') : `${noms.slice(0, -1).join(', ')}${et}${noms.at(-1)}`
}

type Releve = {
  M: Marche; projetId: string; q: QuestionDemo; qid: string; moteur: Moteur; s: number; cle: string
  present: boolean; quand: Date; approfondi?: boolean; tikette?: boolean; sourceTikette?: boolean; faux?: boolean; hebergement?: boolean; echec?: boolean
}

/** Texte de la réponse, sources citées et lues, à partir de ce qu'on veut y trouver. */
function composer(r: Releve) {
  const { M, q, moteur, s, cle, present } = r
  const fr = M.projet.langue === 'fr'
  // Français : « Marque : description ». Anglais : « Brand — description ».
  const deux = fr ? ' : ' : ' — '
  const via: Via | null = present ? (() => { const v = q.via?.[moteur]; return typeof v === 'function' ? v(s) : (v ?? 'nom') })() : null

  // Marques prévues dans la réponse (la liste finale se relit dans le texte).
  let noms = [...q.marques]
  if (q.genre === 'explication') noms = rnd('expl', cle) < (q.frequenceMarques ?? 0) ? noms.slice(0, 2) : []
  if (q.genre === 'liste') {
    if (noms.length >= 3 && rnd('echange', cle) < 0.3) [noms[1], noms[2]] = [noms[2], noms[1]]
    if (noms.length >= 4 && rnd('retire', cle) < 0.25) noms.pop()
  }
  if (q.genre === 'prix') noms = rnd('comparaison', cle) < 0.2 ? ['Comptalis'] : []
  if (q.genre === 'duel') noms = ['Comptalis', ...(rnd('devizo', cle) < 0.3 ? ['Devizo'] : [])]
  noms = noms.filter((n) => !M.marquesRares.includes(n) || rnd('rare', cle) < 0.35)
  if (r.tikette && !noms.includes('Tikette')) noms.splice(Math.min(noms.length, 1 + Math.floor(rnd('placeT', cle) * 2)), 0, 'Tikette')
  if (present && !noms.includes(M.projet.marque)) {
    const marque = M.projet.marque
    if (q.genre === 'prix') noms.unshift(marque)
    else if (q.genre === 'duel') noms.splice(['chatgpt', 'google_ai_overview', 'claude'].includes(moteur) ? 0 : 1, 0, marque)
    else noms.splice(Math.min(noms.length, 2 + Math.floor(rnd('placeF', cle) * 2)), 0, marque)
  }
  const negatif = r.M.projet.marque && q.cle === 'q11' && moteur === 'gemini' && (s === 1 || s === 4)
  const desc = (nom: string) => (nom === M.projet.marque && negatif ? M.marques[nom].neg![0] : choix(M.marques[nom].desc, cle, nom))

  // Sources citées.
  let cles = [...(q.sources[moteur] ?? [])]
  if (s === 7) cles = cles.filter((c) => c !== 'ann')
  if (cles.length >= 3 && rnd('perte', cle) < 0.12) cles.splice(1 + Math.floor(rnd('quelle', cle) * (cles.length - 1)), 1)
  if (via === 'site' && q.pageMarque) cles.splice(1, 0, q.pageMarque)
  if (via === 'video' && q.videoMarque) cles.unshift(q.videoMarque)
  if (via === 'profil') cles.push('f_li')
  if (r.sourceTikette) cles.push('tikette')
  const citees = [...new Set(cles)].map((c) => source(M, c, 'citee'))

  // Pages lues sans être citées (ChatGPT ; Claude aussi, par ses recherches).
  const lues: SourceGen[] = []
  if (moteur === 'chatgpt' || moteur === 'claude') for (const c of q.lues ?? []) if (!cles.includes(c)) lues.push(source(M, c, 'consultee'))
  if (moteur === 'chatgpt' && !present && q.lueMarque && s >= q.lueMarque.depuis) lues.push(source(M, q.lueMarque.page, 'consultee'))

  // Liens : chaque source citée est accrochée à la ligne de sa marque, sinon à la suite.
  const avecLiens = moteur !== 'claude'
  const lien = (x: SourceGen) => (avecLiens ? ` ([${x.video ? M.ph.video : x.domaine}](${x.url}))` : '')
  const parMarque = new Map<string, SourceGen[]>()
  const libres: SourceGen[] = []
  for (const x of citees) {
    const p = proprietaire(M, x)
    if (p && noms.includes(p)) parMarque.set(p, [...(parMarque.get(p) ?? []), x])
    else libres.push(x)
  }
  const liensDe = (nom: string) => (parMarque.get(nom) ?? []).map(lien).join('')
  const prendre = () => { const x = libres.shift(); return x ? lien(x) : '' }

  const intro = choix(q.intros, cle, 'intro')
  const conclusion = choix(q.conclusions, cle, 'conclusion')
  let texte = ''

  if (q.genre === 'liste') {
    const l0 = prendre()
    const lignes = noms.map((n) => `**${n}**${deux}${desc(n)}${liensDe(n) || prendre()}`)
    const reste = libres.map(lien).join('')
    if (moteur === 'chatgpt') texte = `${intro}${l0}\n\n### ${M.ph.titreListe}\n\n${lignes.map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n${conclusion}${reste}`
    else if (moteur === 'gemini') texte = `${intro}${l0}\n\n${lignes.map((x) => `* ${x}`).join('\n')}\n\n${conclusion}${reste}`
    else if (moteur === 'google_ai_mode') texte = `${intro}${l0}\n\n${lignes.map((x) => `* ${x}`).join('\n')}\n\n**${M.ph.aRetenir}**${deux}${conclusion}${reste}`
    else if (moteur === 'google_ai_overview') texte = `${intro}${l0}\n\n${lignes.map((x) => `* ${x}`).join('\n')}${reste ? `\n\n${M.ph.enBref}${deux}${conclusion}${reste}` : ''}`
    else texte = `${intro}\n\n${noms.map((n) => `**${n}**${deux}${desc(n)}.`).join('\n\n')}\n\n${conclusion}`
  } else if (q.genre === 'explication') {
    const etapes = (q.etapes ?? []).slice(0, moteur === 'google_ai_overview' ? 3 : 4)
    const l0 = prendre()
    const lignes = etapes.map((e, i) => `${moteur === 'chatgpt' ? `${i + 1}.` : '*'} **${e.titre}**${deux}${e.texte}${prendre()}`)
    const phraseMarques = noms.length ? `\n\n${(moteur === 'google_ai_overview' ? M.ph.aussiCourt : M.ph.aussi)(liste(M, noms.map((n) => `**${n}**`)))}` : ''
    const reste = libres.map(lien).join('')
    if (moteur === 'claude') texte = `${intro}\n\n${etapes.map((e) => `**${e.titre}**${deux}${e.texte}`).join('\n\n')}${phraseMarques}\n\n${conclusion}`
    else if (moteur === 'google_ai_mode') texte = `${intro}${l0}\n\n${lignes.join('\n')}${phraseMarques}\n\n**${M.ph.aRetenir}**${deux}${conclusion}${reste}`
    else if (moteur === 'google_ai_overview') texte = `${intro}${l0}\n\n${lignes.join('\n')}${phraseMarques}${reste}`
    else texte = `${intro}${l0}\n\n${lignes.join('\n')}${phraseMarques}\n\n${conclusion}${reste}`
  } else if (q.genre === 'prix') {
    const p = M.ph.prix
    const faux = !!r.faux
    const lienPrix = faux ? (() => { const i = libres.findIndex((x) => x.cle === 'opm'); return i >= 0 ? lien(libres.splice(i, 1)[0]) : '' })() : ''
    const lienMarque = liensDe(M.projet.marque)
    const lignes = [faux ? p.soloFaux : p.solo, p.equipe, p.entreprise].map((x, i) => `* ${x}${i === 0 ? lienMarque : prendre()}`)
    const comparaison = noms.includes('Comptalis') ? `\n\n${p.comparaison}${liensDe('Comptalis')}` : ''
    const reste = libres.map(lien).join('')
    texte = moteur === 'claude'
      ? `${intro} ${faux ? p.faux : p.juste}\n\n${[faux ? p.soloFaux : p.solo, p.equipe, p.entreprise].join('\n\n')}${comparaison}\n\n${p.essai} ${conclusion}`
      : `${intro} ${faux ? p.faux : p.juste}${lienPrix}\n\n${lignes.join('\n')}${comparaison}\n\n${p.essai} ${conclusion}${reste}`
  } else {
    const d = M.ph.duel
    const l0 = prendre()
    const paragraphes = noms.filter((n) => n !== 'Devizo').map((n) => `**${n}**${deux}${desc(n)}.${liensDe(n) || prendre()}${n === M.projet.marque && r.hebergement ? ` ${M.ph.hebergement}` : ''}`)
    const tableau = `| ${d.critere} | ${M.projet.marque} | Comptalis |\n|---|---|---|\n| ${d.prise} | ${d.facile} | ${d.complet} |\n| ${d.compta} | ${d.non} | ${d.oui} |\n| ${d.prixLigne} | ${d.prixF} | ${d.prixC} |\n| ${d.mobile} | ${d.oui} | ${d.partiel} |`
    const troisieme = noms.includes('Devizo') ? `\n\n${d.troisieme}${liensDe('Devizo')}` : ''
    const reste = libres.map(lien).join('')
    if (moteur === 'claude') texte = `${intro}\n\n${paragraphes.join('\n\n')}${troisieme}\n\n${conclusion}`
    else if (moteur === 'google_ai_overview') texte = `${intro}${l0}\n\n${paragraphes.map((x) => `* ${x}`).join('\n')}${troisieme}${reste}`
    else texte = `${intro}${l0}\n\n${paragraphes.join('\n\n')}\n\n**${d.tableau}**\n\n${tableau}${troisieme}\n\n${conclusion}${reste}`
  }

  // Les marques nommées se relisent dans le texte, dans l'ordre : exactement ce que ferait la lecture automatique.
  const connues = Object.keys(M.marques)
  const lues2 = connues
    .map((nom) => ({ nom, i: texte.search(new RegExp(`(?<![\\p{L}\\p{N}])${nom}(?![\\p{L}\\p{N}])`, 'u')) }))
    .filter((x) => x.i >= 0)
    .sort((a, b) => a.i - b.i)
  const ton = (nom: string): string => {
    if (q.genre === 'explication') return 'neutre'
    if (nom === M.projet.marque) return negatif ? 'negatif' : rnd('ton', cle, nom) < 0.18 ? 'neutre' : 'positif'
    if (nom === 'Comptalis') return rnd('ton', cle, nom) < 0.7 ? 'positif' : 'neutre'
    if (nom === 'Billbox') return rnd('ton', cle, nom) < 0.15 ? 'negatif' : rnd('ton2', cle, nom) < 0.6 ? 'neutre' : 'positif'
    if (nom === 'Tikette') return 'positif'
    if (M.marquesRares.includes(nom)) return 'neutre'
    return rnd('ton', cle, nom) < 0.5 ? 'positif' : 'neutre'
  }
  const marques = lues2.map((x) => ({ nom: x.nom, ton: ton(x.nom), description: desc(x.nom) }))
  if (present !== marques.some((m) => m.nom === M.projet.marque)) throw new Error(`Incohérence de présence : ${cle}`)

  // Ordre des sources citées : celui de leurs liens dans le texte.
  const ordre = (x: SourceGen) => { const i = texte.indexOf(x.url); return i < 0 ? Infinity : i }
  const citeesOrdonnees = avecLiens ? [...citees].sort((a, b) => ordre(a) - ordre(b)) : citees
  return { texte, marques, citees: citeesOrdonnees, lues, via }
}

const CODES_PAYS: Record<string, { google: string; hl: string; gl: string }> = { FR: { google: 'www.google.fr', hl: 'fr', gl: 'fr' }, GB: { google: 'www.google.co.uk', hl: 'en', gl: 'gb' } }

/** Écrit un relevé reçu, avec tout ce que l'extraction et la lecture automatique en auraient tiré. */
function ecrireReleve(r: Releve) {
  const { M, q, qid, moteur, s, cle, quand } = r
  const id = ident(M.projet.nom, 'releve', cle)
  const methode = moteur === 'claude' ? 'api' : 'interface'
  const fournisseur = moteur === 'claude' ? 'anthropic' : 'dataforseo'
  const g = CODES_PAYS[M.projet.pays]
  const qEnc = encodeURIComponent(q.texte)
  const urlControle = moteur === 'chatgpt' ? `https://chatgpt.com/?q=${qEnc}` : moteur === 'gemini' ? `https://gemini.google.com/app?q=${qEnc}` : moteur === 'google_ai_mode' ? `https://${g.google}/search?q=${qEnc}&udm=50&hl=${g.hl}&gl=${g.gl}` : moteur === 'google_ai_overview' ? `https://${g.google}/search?q=${qEnc}&hl=${g.hl}&gl=${g.gl}` : null
  const tacheId = moteur === 'claude' ? `msg_01${hex(22, M.projet.nom, cle)}` : `${quand.toISOString().slice(5, 10).replace('-', '')}${quand.toISOString().slice(11, 16).replace(':', '')}-1535-0${NOMS_MOTEURS[moteur]}${Math.floor(rnd('t', cle) * 90 + 10)}-0000-${hex(12, M.projet.nom, cle)}`
  const modele = moteur === 'chatgpt' ? (s >= 5 ? 'gpt-6.1' : 'gpt-6') : moteur === 'gemini' ? 'gemini-3-pro' : moteur === 'claude' ? 'claude-sonnet-5-5' : null
  const releveLe = plus(quand, (moteur === 'claude' ? 0.6 : 2 + rnd('rl', cle) * 7) * MIN)
  const recuLe = moteur === 'claude' ? releveLe : plus(quand, (28 + rnd('rc', cle) * 4) * MIN)
  const analyseLe = plus(recuLe, (1 + rnd('al', cle) * 3) * MIN)
  const coutReleve = moteur === 'claude' ? Number((0.045 + rnd('cc', cle) * 0.03).toFixed(6)) : 0.0012

  // Pas d'Aperçu IA : un relevé « vide », avec la page de résultats classique.
  const vide = moteur === 'google_ai_overview' && q.sansApercu
  const echec = !!r.echec
  const top = moteur === 'google_ai_overview' ? (() => {
    const t = [...q.top10]
    const i = 4 + (s % 3)
    if (rnd('rang', cle) < 0.5 && i + 1 < t.length) [t[i], t[i + 1]] = [t[i + 1], t[i]]
    return t.map((k, n) => ({ rang: n + 1, ...source(M, k, 'citee') }))
  })() : []

  // Journal des coûts : l'envoi.
  L.appels.push({
    id: ident(M.projet.nom, 'appel', cle), createdAt: quand, fournisseur, operation: 'releve', moteur, projet: M.projet.nom,
    unites: moteur === 'claude' ? Math.round(16000 + rnd('j', cle) * 9000) : 1, unite: moteur === 'claude' ? 'jeton' : 'appel',
    coutUsd: echec ? 0 : coutReleve, sourcePrix: moteur === 'claude' ? 'grille' : 'api', reussi: !echec, dureeMs: moteur === 'claude' ? Math.round(30000 + rnd('d', cle) * 60000) : Math.round(400 + rnd('d', cle) * 900),
    detail: moteur === 'claude' ? { modele: 'claude-sonnet-5-5', recherchesWeb: 2 + Math.floor(rnd('rw', cle) * 3), questionId: qid } : { tacheId: echec ? null : tacheId, code: echec ? 50301 : 20100, questionId: qid, ...(r.approfondi ? { approfondi: true } : {}), ...(echec ? { erreur: '50301 Service temporarily unavailable' } : {}) },
  })

  if (echec) {
    L.releves.push({ id, createdAt: quand, questionId: qid, moteur, methode, fournisseur, tacheId: null, statut: 'echec', recuLe: quand, erreur: '50301 Service temporarily unavailable', coutUsd: 0, approfondi: false })
    return { id, present: false }
  }
  if (vide) {
    L.releves.push({
      id, createdAt: quand, questionId: qid, moteur, methode, fournisseur, tacheId, statut: 'vide', releveLe, recuLe, urlControle, coutUsd: coutReleve, approfondi: false,
      erreur: M.projet.langue === 'fr' ? 'Google n’a pas affiché d’aperçu IA pour cette question.' : 'Google did not show an AI Overview for this question.',
      brut: { datetime: releveLe.toISOString(), check_url: urlControle, items: top.map((x) => ({ type: 'organic', rank_group: x.rang, url: x.url, domain: x.domaine, title: x.titre })) },
    })
    top.forEach((x) => L.resultats.push({ id: ident(id, 'g', x.rang), releveId: id, rang: x.rang, url: x.url, domaine: x.domaine, titre: x.titre }))
    return { id, present: false }
  }

  const c = composer(r)
  const recherches = moteur === 'chatgpt' ? [q.recherches[s % 3], q.recherches[(s + 1) % 3]] : moteur === 'claude' ? q.recherches.slice(0, 2) : []
  // « Autres questions posées » : les deux premières à chaque relevé, la troisième apparaît en cours de route.
  const associees = moteur === 'google_ai_overview' ? q.associees.filter((_, i) => i < 2 || s >= 1 + Math.floor(rnd('pa', q.cle) * 6)) : []
  const brut =
    moteur === 'claude' ? { modele, arret: 'end_turn', volumes: { recherchesWeb: 3 }, requetes: recherches, blocs: [{ type: 'text', text: c.texte }] }
    : moteur === 'chatgpt' || moteur === 'gemini' ? { model: modele, datetime: releveLe.toISOString(), check_url: urlControle, markdown: c.texte, sources: c.citees.map((x) => ({ url: x.url, domain: x.domaine, title: x.titre })), search_results: c.lues.map((x) => ({ url: x.url, domain: x.domaine, title: x.titre })), ...(moteur === 'chatgpt' ? { brand_entities: c.marques.map((m) => ({ markdown: `**${m.nom}**`, title: m.description, category: M.projet.langue === 'fr' ? 'Logiciel de facturation' : 'Invoicing software' })), fan_out_queries: recherches } : {}) }
    : { datetime: releveLe.toISOString(), check_url: urlControle, items: [{ type: 'ai_overview', markdown: c.texte, references: c.citees.map((x) => ({ url: x.url, domain: x.domaine, title: x.titre })) }, ...top.map((x) => ({ type: 'organic', rank_group: x.rang, url: x.url, domain: x.domaine, title: x.titre })), ...(associees.length ? [{ type: 'people_also_ask', items: associees.map((t) => ({ title: t })) }] : [])] }

  L.releves.push({
    id, createdAt: quand, questionId: qid, moteur, methode, fournisseur, tacheId, statut: 'recu', releveLe, recuLe, modele, texte: c.texte, urlControle, brut, coutUsd: coutReleve,
    analyseLe, approfondi: !!r.approfondi, faitsLe: analyseLe,
  })
  ;[...c.citees, ...c.lues].forEach((x, i) => {
    L.sources.push({ id: ident(id, 's', i), releveId: id, position: i + 1, url: x.url, domaine: x.domaine, titre: x.titre, extrait: null, role: x.role, videoYoutubeId: x.video ?? null })
    if (x.video) {
      const v = Object.values(M.videos).find((y) => y.id === x.video)!
      L.videos.set(v.id, { id: v.id, chaineId: M.chaines[v.chaine].id, chaineNom: M.chaines[v.chaine].nom, titre: v.titre, publieLe: new Date(`${v.publie}T10:00:00Z`), vues: v.vues })
    }
  })
  c.marques.forEach((m, i) => {
    L.mentions.push({ id: ident(id, 'ma', i), releveId: id, nom: m.nom, description: null, categorie: null, rang: i + 1, ton: m.ton, origine: 'analyse' })
    if (moteur === 'chatgpt') L.mentions.push({ id: ident(id, 'mf', i), releveId: id, nom: m.nom, description: m.description, categorie: M.projet.langue === 'fr' ? 'Logiciel de facturation' : 'Invoicing software', rang: i + 1, ton: null, origine: 'fournisseur' })
  })
  recherches.forEach((t, i) => L.recherches.push({ id: ident(id, 'r', i), releveId: id, texte: t, position: i + 1 }))
  top.forEach((x) => L.resultats.push({ id: ident(id, 'g', x.rang), releveId: id, rang: x.rang, url: x.url, domaine: x.domaine, titre: x.titre }))
  associees.forEach((t, i) => L.associees.push({ id: ident(id, 'qa', i), releveId: id, texte: t, position: i + 1 }))

  // Journal des coûts : la lecture automatique (marques, rang, ton, faits).
  L.appels.push({
    id: ident(M.projet.nom, 'analyse', cle), createdAt: analyseLe, fournisseur: 'deepseek', operation: 'analyse', moteur: null, projet: M.projet.nom,
    unites: Math.round(1300 + rnd('ja', cle) * 1500), unite: 'jeton', coutUsd: Number((0.0006 + rnd('ca', cle) * 0.0005).toFixed(6)), sourcePrix: 'grille', reussi: true, dureeMs: Math.round(1500 + rnd('da', cle) * 3000),
    detail: { modele: 'deepseek-flash', releveId: id },
  })
  return { id, present: c.marques.some((m) => m.nom === M.projet.marque) || c.via !== null, texte: c.texte }
}

// ── Un projet entier ────────────────────────────────────────────────────────
function semerProjet(M: Marche) {
  const fr = M.projet.langue === 'fr'
  const projetId = ident(M.projet.nom, 'projet')
  const cree = instant(plusJours(SEMAINES[0], -3), 16, 0)
  L.projets.push({ id: projetId, createdAt: cree, nom: M.projet.nom, marque: M.projet.marque, langue: M.projet.langue, pays: M.projet.pays, releveAuto: true, claudeAuto: true, dernierAutoInterface: instant(SEMAINES[7], 6, 15), dernierAutoClaude: instant(SEMAINES[7], 5, 45) })
  M.proprietes.forEach((p, i) => L.proprietes.push({ id: ident(projetId, 'prop', i), projetId, type: p.type, valeur: p.valeur, libelle: p.libelle ?? null }))
  M.concurrents.forEach((c, i) => L.concurrents.push({ id: ident(projetId, 'conc', i), projetId, nom: c.nom, domaine: c.domaine }))

  // Vérifie que les plans de présence donnent bien les cibles annoncées.
  for (const m of [...IA, 'claude' as const]) {
    const n = m === 'claude' ? 4 : 8
    for (let s = 0; s < n; s++) {
      const somme = M.questions.filter((q) => !q.marquee).reduce((x, q) => x + (q.plan?.[m]?.[s] === '1' ? 1 : 0), 0)
      if (somme !== M.cibles[m][s]) throw new Error(`${M.projet.nom} : ${m}, semaine ${s + 1} : ${somme} présences au lieu de ${M.cibles[m][s]}`)
    }
  }

  const qids = new Map<string, string>()
  M.questions.forEach((q, i) => {
    const qid = ident(projetId, 'question', q.cle)
    qids.set(q.cle, qid)
    L.questions.push({ id: qid, createdAt: plus(cree, (i + 1) * 1000), texte: q.texte, langue: M.projet.langue, pays: M.projet.pays, projetId, ordre: i + 1, archive: false, theme: q.theme, intention: q.intention, etiqueteLe: plus(cree, 2 * MIN), etiquetteMain: q.cle === 'q11' })
  })
  const archId = ident(projetId, 'question', 'archivee')
  L.questions.push({ id: archId, createdAt: plus(cree, 13_000), texte: M.archivee.texte, langue: M.projet.langue, pays: M.projet.pays, projetId, ordre: 13, archive: true, theme: M.archivee.theme, intention: M.archivee.intention, etiqueteLe: plus(cree, 2 * MIN), etiquetteMain: false })

  // Qui nomme Tikette : toujours les mêmes couples question × IA d'abord, pour une montée régulière.
  const couples = M.questions.filter((q) => q.genre === 'liste' || q.genre === 'duel').flatMap((q) => IA.filter((m) => !(m === 'google_ai_overview' && q.sansApercu) && !(q.cle === M.echec && m === 'gemini')).map((m) => `${q.cle}:${m}`))
  couples.sort((a, b) => rnd('tik', a) - rnd('tik', b))

  const faitIds = M.faits.map((_, i) => ident(projetId, 'fait', i))
  const releveFaux: { cle: string; id: string }[] = []
  let ecarteeId = ''

  // ── Relevés hebdomadaires d'interface ─────────────────────────────────────
  for (let s = 0; s < 8; s++) {
    const tik = new Set(couples.slice(0, M.tikette[s]))
    const tikSource = new Set(s === 7 ? couples.slice(0, 6) : [])
    M.questions.forEach((q, qi) => {
      IA.forEach((moteur, mi) => {
        const cle = `${q.cle}:${moteur}:${s}`
        const present = !!q.marquee || q.plan?.[moteur]?.[s] === '1'
        const faux = q.genre === 'prix' && ((moteur === 'chatgpt' && s === 7) || (moteur === 'gemini' && s === 6))
        const echec = s === 4 && moteur === 'gemini' && q.cle === M.echec
        const r = ecrireReleve({ M, projetId, q, qid: qids.get(q.cle)!, moteur, s, cle, present, quand: plus(instant(SEMAINES[s], 6, 15), (qi * 4 + mi) * 1500), tikette: tik.has(`${q.cle}:${moteur}`), sourceTikette: tikSource.has(`${q.cle}:${moteur}`), faux, echec })
        if (faux) releveFaux.push({ cle, id: r.id })
      })
    })
  }

  // ── Claude, par son API, toutes les deux semaines (envoyé juste avant les IA d’interface) ──
  SEMAINES_CLAUDE.forEach((s, c) => {
    M.questions.forEach((q, qi) => {
      const cle = `${q.cle}:claude:${s}`
      const present = !!q.marquee || q.plan?.claude?.[c] === '1'
      const hebergement = q.genre === 'duel' && c === 2
      const r = ecrireReleve({ M, projetId, q, qid: qids.get(q.cle)!, moteur: 'claude', s, cle, present, quand: plus(instant(SEMAINES[s], 5, 45), qi * 50_000), hebergement })
      if (hebergement) ecarteeId = r.id
    })
  })

  // ── Mesure approfondie : q1 posée 25 fois à ChatGPT, le mercredi suivant la semaine 7 ──
  const q1 = M.questions.find((q) => q.cle === 'q1')!
  const ordreApp = Array.from({ length: 25 }, (_, i) => i).sort((a, b) => rnd('app', M.projet.nom, a) - rnd('app', M.projet.nom, b))
  const presentsApp = new Set(ordreApp.slice(0, M.approfondiPresents))
  const jourApp = plusJours(SEMAINES[6], 2)
  for (let i = 0; i < 25; i++) {
    const q = { ...q1, via: { chatgpt: (rnd('appvia', i) < 0.5 ? 'site' : 'nom') as Via } }
    ecrireReleve({ M, projetId, q, qid: qids.get('q1')!, moteur: 'chatgpt', s: 6, cle: `q1:chatgpt:app${i}`, present: presentsApp.has(i), quand: instant(jourApp, 10, 5, i * 35), approfondi: true })
  }

  // ── Question archivée : deux semaines de relevés, puis remplacée ─────────
  for (let s = 0; s < 2; s++) {
    IA.forEach((moteur, mi) => {
      const q: QuestionDemo = {
        cle: 'archivee', texte: M.archivee.texte, theme: M.archivee.theme, intention: M.archivee.intention, genre: 'prix', marquee: true,
        via: { chatgpt: 'site', google_ai_overview: 'site' }, pageMarque: 'f_essai', intros: [M.archivee.intro], conclusions: [M.ph.prix.essai.split('.')[0] + '.'],
        marques: [], sources: { chatgpt: ['x_aide'], gemini: ['x_aide'], google_ai_mode: ['x_aide'], google_ai_overview: ['x_aide'] }, top10: q1.top10, associees: [], recherches: q1.recherches,
      }
      ecrireReleve({ M, projetId, q, qid: archId, moteur, s, cle: `archivee:${moteur}:${s}`, present: true, quand: plus(instant(SEMAINES[s], 6, 15), (48 + mi) * 1500) })
    })
  }

  // ── Faits vérifiés et contradictions ──────────────────────────────────────
  const faitsLe = instant(plusJours(SEMAINES[1], 1), 14, 0)
  M.faits.forEach((texte, i) => L.faits.push({ id: faitIds[i], createdAt: plus(faitsLe, i * 40_000), projetId, texte }))
  const dernierFait = plus(faitsLe, (M.faits.length - 1) * 40_000)
  // Les réponses d'avant les faits ont été comparées d'un clic (« Vérifier les réponses »).
  for (const r of L.releves) {
    if (!String(r.id).length || (r as { faitsLe?: Date }).faitsLe === undefined) continue
    if (!L.questions.some((q) => q.id === r.questionId && q.projetId === projetId)) continue
    const f = r.faitsLe as Date
    if (f < dernierFait) {
      r.faitsLe = plus(dernierFait, 20 * MIN)
      if (typeof r.texte === 'string' && r.texte.includes(M.projet.marque)) {
        L.appels.push({ id: ident(String(r.id), 'faits'), createdAt: plus(dernierFait, 20 * MIN + 2000), fournisseur: 'deepseek', operation: 'faits', moteur: null, projet: M.projet.nom, unites: Math.round(900 + rnd('jf', String(r.id)) * 700), unite: 'jeton', coutUsd: Number((0.0004 + rnd('cf', String(r.id)) * 0.0003).toFixed(6)), sourcePrix: 'grille', reussi: true, dureeMs: 1800, detail: { modele: 'deepseek-flash', releveId: r.id, faits: M.faits.length } })
      }
    }
  }
  const phraseFausse = M.ph.prix.faux.replace(/\*\*/g, '')
  for (const x of releveFaux) {
    const r = L.releves.find((y) => y.id === x.id)!
    L.contradictions.push({ id: ident(x.id, 'contradiction'), createdAt: r.analyseLe, releveId: x.id, faitId: faitIds[0], phrase: phraseFausse, explication: M.contradiction.explication, sourceUrl: M.pages.opm.url, ecartee: false })
  }
  if (ecarteeId) {
    const r = L.releves.find((y) => y.id === ecarteeId)!
    L.contradictions.push({ id: ident(ecarteeId, 'contradiction'), createdAt: r.analyseLe, releveId: ecarteeId, faitId: faitIds[3], phrase: M.ph.hebergement, explication: M.ecartee.explication, sourceUrl: null, ecartee: true })
  }

  // ── Actions : une faite avec gain, une faite sans écart réel, deux en cours, une écartée ──
  const n = M.notes
  const cmp = M.pages.cmp.url
  const forum = M.pages.for.url
  const media = M.pages.jdt.url
  const officiel = M.pages.off_mentions.url
  const faitCmp = instant(SEMAINES[2], 17, 30)
  const faitForum = instant(SEMAINES[4], 17, 0)
  const domCmp = domaineDe(cmp)
  const domForum = domaineDe(forum)
  L.etats.push(
    { projetId, cle: `page:${cmp}`, etat: 'fait', majLe: faitCmp, note: n.comparatif, faitLe: faitCmp, titre: fr ? `Entrer dans le comparatif de ${domCmp}` : `Get into the comparison on ${domCmp}`, famille: 'apparaitre', lien: cmp, questionIds: ['q1', 'q2', 'q3'].map((k) => qids.get(k)!) },
    { projetId, cle: `page:${forum}`, etat: 'fait', majLe: faitForum, note: n.forum, faitLe: faitForum, titre: fr ? `Répondre dans la discussion citée sur ${domForum}` : `Reply in the discussion cited on ${domForum}`, famille: 'apparaitre', lien: forum, questionIds: [qids.get('q4')!] },
    { projetId, cle: `page:${media}`, etat: 'en_cours', majLe: instant(plusJours(SEMAINES[5], 2), 11, 20), note: n.media, faitLe: null, titre: null, famille: null, lien: null, questionIds: [] },
    { projetId, cle: `fait:${faitIds[0]}:${releveFaux.find((x) => x.cle.includes(':chatgpt:'))!.id}`, etat: 'en_cours', majLe: instant(SEMAINES[7], 9, 40), note: n.correction, faitLe: null, titre: null, famille: null, lien: null, questionIds: [] },
    { projetId, cle: `page:${officiel}`, etat: 'ecarte', majLe: instant(plusJours(SEMAINES[3], 1), 15, 5), note: n.officiel, faitLe: null, titre: null, famille: null, lien: null, questionIds: [] },
  )
  const dem = (cle: string, i: number, type: string, faiteLe: Date, contact: string, reponse: string, note: string) =>
    L.demarches.push({ id: ident(projetId, 'demarche', cle, i), createdAt: faiteLe, projetId, cle, type, faiteLe, contact, reponse, note })
  dem(`page:${cmp}`, 0, 'ajout', instant(plusJours(SEMAINES[0], 3), 11, 0), n.contacts.comparatif, 'sans', n.demarches.ajout)
  dem(`page:${cmp}`, 1, 'relance', instant(plusJours(SEMAINES[1], 3), 10, 0), n.contacts.comparatifRelance, 'oui', n.demarches.relance)
  dem(`page:${forum}`, 0, 'reponse', instant(SEMAINES[4], 16, 40), n.contacts.forum, 'oui', n.demarches.reponse)
  dem(`page:${media}`, 0, 'test', instant(plusJours(SEMAINES[5], 2), 11, 15), n.contacts.media, 'attente', n.demarches.test)
  dem(`fait:${faitIds[0]}:${releveFaux.find((x) => x.cle.includes(':chatgpt:'))!.id}`, 0, 'correction', instant(SEMAINES[7], 9, 35), n.contacts.correction, 'attente', n.demarches.correction)

  // ── Autres appels payants : étiquettes des questions, classement des sites ──
  L.appels.push({ id: ident(projetId, 'etiquettes'), createdAt: plus(cree, 2 * MIN), fournisseur: 'deepseek', operation: 'etiquettes', moteur: null, projet: M.projet.nom, unites: 2140, unite: 'jeton', coutUsd: 0.00091, sourcePrix: 'grille', reussi: true, dureeMs: 4200, detail: { modele: 'deepseek-flash', questions: 13 } })
  L.appels.push({ id: ident(projetId, 'classement'), createdAt: instant(SEMAINES[0], 9, 10), fournisseur: 'deepseek', operation: 'classement', moteur: null, projet: M.projet.nom, unites: 4870, unite: 'jeton', coutUsd: 0.00124, sourcePrix: 'grille', reussi: true, dureeMs: 6100, detail: { modele: 'deepseek-flash', sites: Object.keys(M.domaines).length - 1 } })

  // ── Réglages du projet ────────────────────────────────────────────────────
  L.reglages.push(
    { cle: `classement_auto:${projetId}`, valeur: '1' },
    { cle: `etiquettes_auto:${projetId}`, valeur: '1' },
    { cle: `marques_ignorees:${projetId}`, valeur: JSON.stringify(['kontivo']) },
  )
  for (const [domaine, d] of Object.entries(M.domaines)) {
    if (L.domaines.has(domaine)) continue
    L.domaines.set(domaine, { domaine, type: d.type, marque: d.marque ?? null, origine: d.main ? 'main' : 'modele', modele: d.main ? null : 'deepseek-flash', classeLe: domaine === 'tikette.exemple' ? instant(SEMAINES[7], 7, 5) : instant(SEMAINES[0], 9, 10) })
  }
  return projetId
}

// ── Écriture ────────────────────────────────────────────────────────────────
async function main() {
  const t0 = Date.now()
  console.log(`Dernier relevé : lundi ${SEMAINES[7]} · premier : lundi ${SEMAINES[0]}`)
  const ids = [semerProjet(FR), semerProjet(EN)]
  // Le nouveau site de Tikette, vu pour la première fois au dernier relevé, a été classé tout seul.
  L.appels.push({ id: ident('classement-tikette'), createdAt: instant(SEMAINES[7], 7, 5), fournisseur: 'deepseek', operation: 'classement', moteur: null, projet: FR.projet.nom, unites: 310, unite: 'jeton', coutUsd: 0.00008, sourcePrix: 'grille', reussi: true, dureeMs: 1200, detail: { modele: 'deepseek-flash', sites: 1 } })

  // Chaque domaine cité doit être classé (ou reconnu sans modèle) : sinon l'écran Sources proposerait un appel payant.
  const certains = ['youtube.com', 'linkedin.com']
  const inconnus = [...new Set(L.sources.map((s) => String(s.domaine)))].filter((d) => !L.domaines.has(d) && !certains.includes(d))
  if (inconnus.length) throw new Error(`Domaines cités sans classement : ${inconnus.join(', ')}`)

  // On vide la base de démonstration (et elle seule), puis on écrit.
  const tables = ['PageSuivie', 'Partage', 'Contradiction', 'Fait', 'Demarche', 'EtatAction', 'Mention', 'Recherche', 'ResultatGoogle', 'QuestionAssociee', 'Source', 'VideoYoutube', 'Releve', 'Question', 'Concurrent', 'Propriete', 'Projet', 'Domaine', 'ApiCall', 'Reglage', 'Session', 'Account', 'Verification', 'User']
  await prisma.$executeRawUnsafe(`TRUNCATE ${tables.map((t) => `"${t}"`).join(', ')} CASCADE`)

  // Comptes de démonstration (mot de passe public, base locale seulement).
  const ctx = await auth.$context
  const debutComptes = instant(plusJours(SEMAINES[0], -10), 9, 0)
  for (const [i, c] of [COMPTE_DEMO, COMPTE_MEMBRE].entries()) {
    const user = await ctx.internalAdapter.createUser({ email: c.email, name: c.nom, emailVerified: true }, { method: 'admin' } as never)
    await ctx.internalAdapter.linkAccount({ userId: user.id, providerId: 'credential', accountId: user.id, password: await ctx.password.hash(c.motDePasse) })
    await prisma.user.update({ where: { id: user.id }, data: { role: i === 0 ? 'admin' : 'membre', langue: null, createdAt: plus(debutComptes, i * 3 * 86_400_000) } })
  }
  // Une invitation en cours : compte créé, mot de passe pas encore choisi.
  const invite = await ctx.internalAdapter.createUser({ email: INVITATION_DEMO.email, name: INVITATION_DEMO.nom, emailVerified: true }, { method: 'admin' } as never)
  await prisma.user.update({ where: { id: invite.id }, data: { role: 'membre', langue: null, createdAt: plus(debutComptes, 9 * 86_400_000) } })
  await ctx.internalAdapter.createVerificationValue({ identifier: `reset-password:${INVITATION_DEMO.jeton}`, value: invite.id, expiresAt: new Date(Date.now() + 7 * 86_400_000) })

  const lot = async <T>(nom: string, lignes: Ligne[], ecrire: (data: T[]) => Promise<unknown>) => {
    for (let i = 0; i < lignes.length; i += 1000) await ecrire(lignes.slice(i, i + 1000) as T[])
    console.log(`  ${nom.padEnd(20)} ${lignes.length}`)
  }
  await lot('projets', L.projets, (d) => prisma.projet.createMany({ data: d as never }))
  await lot('propriétés', L.proprietes, (d) => prisma.propriete.createMany({ data: d as never }))
  await lot('concurrents', L.concurrents, (d) => prisma.concurrent.createMany({ data: d as never }))
  await lot('questions', L.questions, (d) => prisma.question.createMany({ data: d as never }))
  await lot('vidéos', [...L.videos.values()], (d) => prisma.videoYoutube.createMany({ data: d as never }))
  await lot('relevés', L.releves, (d) => prisma.releve.createMany({ data: d as never }))
  await lot('sources', L.sources, (d) => prisma.source.createMany({ data: d as never }))
  await lot('mentions', L.mentions, (d) => prisma.mention.createMany({ data: d as never }))
  await lot('recherches', L.recherches, (d) => prisma.recherche.createMany({ data: d as never }))
  await lot('résultats Google', L.resultats, (d) => prisma.resultatGoogle.createMany({ data: d as never }))
  await lot('questions associées', L.associees, (d) => prisma.questionAssociee.createMany({ data: d as never }))
  await lot('domaines', [...L.domaines.values()], (d) => prisma.domaine.createMany({ data: d as never }))
  await lot('faits', L.faits, (d) => prisma.fait.createMany({ data: d as never }))
  await lot('contradictions', L.contradictions, (d) => prisma.contradiction.createMany({ data: d as never }))
  await lot('états d’actions', L.etats, (d) => prisma.etatAction.createMany({ data: d as never }))
  await lot('démarches', L.demarches, (d) => prisma.demarche.createMany({ data: d as never }))
  await lot('appels (coûts)', L.appels, (d) => prisma.apiCall.createMany({ data: d as never }))
  L.reglages.push({ cle: 'plafond_mensuel_usd', valeur: '20' }, { cle: 'analyse_auto_depuis', valeur: instant(plusJours(SEMAINES[0], -1), 12, 0).toISOString() })
  await lot('réglages', L.reglages, (d) => prisma.reglage.createMany({ data: d as never }))

  // Pages de partage : une active (celle de la capture), une coupée, pour chaque projet.
  for (const [i, M] of [FR, EN].entries()) {
    const projetId = ids[i]
    const qs = L.questions.filter((q) => q.projetId === projetId && !q.archive).sort((x, y) => Number(x.ordre) - Number(y.ordre)).map((q) => q.id as string)
    const fr = M.projet.langue === 'fr'
    const cree = instant(plusJours(SEMAINES.at(-1)!, -3), 10, 0)
    await prisma.partage.create({ data: {
      jeton: fr ? PARTAGES_DEMO.fr : PARTAGES_DEMO.en, projetId, questions: qs.slice(0, 5), moteurs: [], langue: fr ? 'fr' : 'en', reponses: true, concurrents: true,
      titre: fr ? `${M.projet.marque} dans les réponses des IA` : `${M.projet.marque} in AI answers`,
      destinataire: fr ? `Équipe marketing de ${M.projet.marque}` : `${M.projet.marque} marketing team`,
      auteur: COMPTE_DEMO.nom, vues: 7, derniereVue: plus(cree, 2 * 86_400_000), createdAt: cree,
    } })
    await prisma.partage.create({ data: {
      jeton: `${fr ? PARTAGES_DEMO.fr : PARTAGES_DEMO.en}-ancien`, projetId, questions: qs.slice(5, 8), moteurs: ['chatgpt', 'gemini'], langue: fr ? 'fr' : 'en', reponses: false, concurrents: false,
      titre: fr ? 'Comparatifs de logiciels de facturation' : 'Invoicing software comparisons',
      destinataire: fr ? 'Agence partenaire' : 'Partner agency',
      auteur: COMPTE_MEMBRE.nom, vues: 2, derniereVue: plus(cree, -9 * 86_400_000), createdAt: plus(cree, -20 * 86_400_000), coupeLe: plus(cree, -5 * 86_400_000),
    } })
  }
  console.log(`  ${'partages'.padEnd(20)} 4`)

  // Pages suivies : la page de la marque la plus citée, avec trois questions où elle l'est et une où elle ne l'est pas.
  let suivies = 0
  for (const projetId of ids.slice(0, 2)) {
    const qs = L.questions.filter((q) => q.projetId === projetId && !q.archive).sort((x, y) => Number(x.ordre) - Number(y.ordre))
    const duProjet = new Map(L.releves.filter((r) => qs.some((q) => q.id === r.questionId)).map((r) => [r.id as string, r.questionId as string]))
    const parPage = new Map<string, { titre: string | null; questions: Set<string> }>()
    for (const s of L.sources) {
      const q = duProjet.get(s.releveId as string)
      if (!q || s.role !== 'citee' || s.domaine !== 'facturo.exemple') continue
      const x = parPage.get(s.url as string) ?? { titre: (s.titre as string | null) ?? null, questions: new Set<string>() }
      x.questions.add(q)
      parPage.set(s.url as string, x)
    }
    const meilleure = [...parPage.entries()].sort((a, b) => b[1].questions.size - a[1].questions.size)[0]
    if (!meilleure) continue
    const [url, { titre, questions }] = meilleure
    const avec = qs.map((q) => q.id as string).filter((id) => questions.has(id)).slice(0, 3)
    const sans = qs.map((q) => q.id as string).filter((id) => !questions.has(id)).slice(0, 1)
    await prisma.pageSuivie.create({ data: { projetId, url, cle: clePage(url), titre, questions: [...avec, ...sans], luLe: instant(plusJours(SEMAINES[0], -2), 11, 0), auteur: COMPTE_DEMO.nom, createdAt: instant(plusJours(SEMAINES[0], -2), 11, 0) } })
    suivies++
  }
  console.log(`  ${'pages suivies'.padEnd(20)} ${suivies}`)

  // Résumé : les chiffres de la vue d'ensemble (période par défaut : 8 semaines, interface).
  for (const [i, M] of [FR, EN].entries()) {
    const projetId = ids[i]
    const qs = new Set(L.questions.filter((q) => q.projetId === projetId && !q.archive).map((q) => q.id))
    const rs = L.releves.filter((r) => qs.has(r.questionId as string) && !r.approfondi)
    const ui = rs.filter((r) => r.methode === 'interface' && r.statut === 'recu')
    const api = rs.filter((r) => r.methode === 'api' && r.statut === 'recu')
    const nomme = (r: Ligne) => L.mentions.some((m) => m.releveId === r.id && m.origine === 'analyse' && m.nom === M.projet.marque) || L.sources.some((s) => s.releveId === r.id && s.role === 'citee' && (s.domaine === 'facturo.exemple' || String(s.url).includes('facturo-demo') || ['fctrDemoV01', 'fctrDemoV02', 'fctrDemoE01', 'fctrDemoE02'].includes(String(s.videoYoutubeId))))
    console.log(`${M.projet.nom} : interface ${ui.filter(nomme).length} sur ${ui.length} · Claude (API) ${api.filter(nomme).length} sur ${api.length}`)
  }
  console.log(`Base de démonstration remplie en ${((Date.now() - t0) / 1000).toFixed(1)} s. Compte : ${COMPTE_DEMO.email} / ${COMPTE_DEMO.motDePasse}`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
