// Captures d'écran de l'outil, en français et en anglais, sur la base de démonstration.
//
//   npx tsx scripts/demo/captures.ts [--sortie <dossier>] [--seulement vue,questions]
//
// Prérequis : la base geotrends_demo remplie (semer.ts) et l'application construite
// (`next build`). Le script démarre l'application sur le port 3020, se connecte avec
// le compte de démonstration, photographie chaque écran avec le navigateur sans
// fenêtre de gstack (browse), convertit en WebP, écrit le manifeste, puis arrête
// l'application. Aucun appel payant : aucune clé n'est présente, et seuls des écrans
// sont ouverts (aucun bouton d'envoi n'est cliqué).
import 'dotenv/config'
import { execFileSync, spawn, type ChildProcess } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { prisma } from '../../src/lib/prisma'
import { COMPTE_DEMO, INVITATION_DEMO, PARTAGES_DEMO } from './compte'

const RACINE = process.cwd()
const PORT = 3020
const BASE = `http://localhost:${PORT}`
const BROWSE = process.env.BROWSE_BIN || path.join(os.homedir(), '.claude/skills/gstack/browse/dist/browse')
const CWEBP = process.env.CWEBP_BIN || (fs.existsSync('/opt/homebrew/bin/cwebp') ? '/opt/homebrew/bin/cwebp' : 'cwebp')
const LARGEUR = 1440
const HAUTEUR = 900
const ECHELLE = 2
/** Poids visé pour chaque image : au-delà, on recompresse un peu plus. */
const POIDS_MAX = 350 * 1024

const arg = (nom: string) => { const i = process.argv.indexOf(nom); return i > 0 ? process.argv[i + 1] : undefined }
const SORTIE = path.resolve(arg('--sortie') ?? path.join(RACINE, 'public/docs/captures'))
const SEULEMENT = arg('--seulement')?.split(',').filter(Boolean)

if (!/\/geotrends_demo(\?|$)/.test(process.env.DATABASE_URL ?? '')) {
  console.error('Refus : DATABASE_URL doit désigner la base « geotrends_demo ».')
  process.exit(1)
}
for (const v of ['DATAFORSEO_AUTH', 'ANTHROPIC_API_KEY', 'DEEPSEEK_API_KEY', 'YOUTUBE_API_KEY', 'RESEND_API_KEY']) delete process.env[v]
const cles = fs.readdirSync(RACINE).filter((f) => f.endsWith('.key.txt'))
if (cles.length) {
  console.error(`Refus : des fichiers de clés sont présents (${cles.join(', ')}). La démonstration ne doit jamais pouvoir appeler une API payante.`)
  process.exit(1)
}
if (!fs.existsSync(BROWSE)) {
  console.error(`Navigateur de gstack introuvable : ${BROWSE} (variable BROWSE_BIN pour l'indiquer).`)
  process.exit(1)
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))
/**
 * Attend la fin du chargement de la page (images comprises). On n'attend pas le
 * calme du réseau : en production, l'outil précharge les écrans de chaque lien
 * visible, ce qui peut durer longtemps sans rien changer à l'affichage.
 */
const calme = () => { try { b('wait', '--load') } catch { /* déjà chargée */ } }
// Un navigateur à part, pour ne jamais toucher à celui d'une autre session.
const ETAT = path.join(RACINE, '.gstack', 'browse-demo.json')
fs.mkdirSync(path.dirname(ETAT), { recursive: true })
function b(...args: string[]): string {
  // Le premier démarrage du navigateur peut dépasser le délai de browse, et un Mac chargé
  // peut faire dépasser le délai d'une capture : dans les deux cas, on réessaie.
  for (let essai = 1; ; essai++) {
    try {
      const t0 = Date.now()
      const sortie = execFileSync(BROWSE, args, { cwd: RACINE, env: { ...process.env, BROWSE_STATE_FILE: ETAT }, encoding: 'utf8', timeout: 90_000, stdio: ['ignore', 'pipe', 'pipe'] }).trim()
      if (process.env.DEMO_LENT && Date.now() - t0 > 3000) console.log(`  (lent : browse ${args[0]} ${args[1] ?? ''} ${Date.now() - t0} ms)`)
      return sortie
    } catch (e) {
      const x = e as { stdout?: string; stderr?: string; message: string }
      const message = `${x.stderr ?? ''}${x.stdout ?? ''}` || x.message
      if (essai < 4 && /failed to start|ECONNREFUSED|not running|timed out/i.test(message)) {
        execFileSync('sleep', [String(3 * essai)])
        continue
      }
      throw new Error(`browse ${args.join(' ')} : ${message}`)
    }
  }
}

type Langue = 'fr' | 'en'
type Contexte = { langue: Langue; projetId: string; q1: string; action: string; page: string }
type Capture = {
  nom: string
  /** Adresse ouverte ; `ecran` est l'adresse écrite dans le manifeste (sans identifiant). */
  url: (c: Contexte) => string
  ecran: string
  /** Bloc à photographier seul (sinon : la fenêtre entière, 1440 × 900). */
  bloc?: (c: Contexte) => string
  /** Hauteur de la fenêtre, quand le haut de l'écran ne suffit pas. */
  hauteur?: number
  /** Gestes à faire avant la photo (remplir un formulaire…). Jamais un bouton d'envoi. */
  gestes?: (c: Contexte) => void
  horsConnexion?: boolean
  /** Photographiée en dernier, une fois tous les comptes de la base de démonstration effacés (écran du premier lancement). */
  sansCompte?: boolean
  annexe?: boolean
  /** Script lancé dans la page juste avant la photo (voir RETOUCHE_CLES). */
  retouche?: (c: Contexte) => string
}

/**
 * Réglages : la démonstration tourne sans AUCUNE clé (règle de sécurité : elle
 * ne doit jamais pouvoir payer un appel). L'écran afficherait donc « Clé absente »
 * pour chaque fournisseur, à côté de « Dernier appel réussi ». On montre l'état
 * de l'outil en service : clés en place, sauf celle de Resend (l'envoi du rapport
 * par e-mail n'est pas encore branché). Seules ces pastilles sont retouchées.
 */
const RETOUCHE_CLES = (c: Contexte) => {
  const [enPlace, absente] = c.langue === 'fr' ? ['Clé en place', 'Clé absente'] : ['Key in place', 'Key missing']
  return `document.querySelectorAll('span.pastille.absent').forEach((p) => { const ligne = p.closest('li'); if (!ligne || !p.textContent.includes(${JSON.stringify(absente)}) || /Resend/.test(ligne.textContent)) return; p.classList.replace('absent', 'nomme'); ligne.querySelector('.indice-cle')?.remove(); p.innerHTML = '<span class="signe" aria-hidden="true">●</span>' + ${JSON.stringify(enPlace)} })`
}

/**
 * Le navigateur sans fenêtre est réglé en anglais américain : ses champs de date
 * s'écriraient « 10/12/2026 » (mois d'abord). Un navigateur français ou britannique
 * écrit « 12/10/2026 » : on affiche la date du champ dans cet ordre.
 */
const DATES_JJ_MM = `document.querySelectorAll('input[type=date]').forEach((i) => { const v = i.value; i.type = 'text'; i.value = v ? v.split('-').reverse().join('/') : '' })`

const titre = (fr: string, en: string) => (c: Contexte) => `section.ecran:has(h2:has-text("${c.langue === 'fr' ? fr : en}"))`

const CAPTURES: Capture[] = [
  { nom: 'connexion', url: () => '/connexion', ecran: '/connexion', horsConnexion: true },
  { nom: 'premier-compte', url: () => '/connexion', ecran: '/connexion', horsConnexion: true, sansCompte: true },
  { nom: 'invitation', url: () => `/invitation/${INVITATION_DEMO.jeton}`, ecran: '/invitation/[jeton]', horsConnexion: true },
  { nom: 'vue', url: () => '/vue', ecran: '/vue' },
  { nom: 'questions', url: () => '/questions', ecran: '/questions' },
  { nom: 'question', url: (c) => `/questions/${c.q1}`, ecran: '/questions/[id]' },
  { nom: 'pages', url: () => '/pages', ecran: '/pages' },
  { nom: 'page-fiche', url: (c) => `/pages?fiche=${c.page}`, ecran: '/pages?fiche=…', bloc: () => '#fiche', annexe: true },
  { nom: 'reponses', url: () => '/reponses', ecran: '/reponses' },
  { nom: 'concurrents', url: () => '/concurrents', ecran: '/concurrents' },
  { nom: 'sources', url: () => '/sources', ecran: '/sources' },
  { nom: 'videos', url: () => '/videos', ecran: '/videos' },
  { nom: 'google', url: () => '/google', ecran: '/google' },
  { nom: 'actions', url: () => '/actions', ecran: '/actions' },
  { nom: 'actions-resultats', url: () => '/actions?onglet=resultats', ecran: '/actions?onglet=resultats' },
  { nom: 'faits', url: () => '/faits', ecran: '/faits' },
  { nom: 'rapport', url: () => '/rapport', ecran: '/rapport' },
  { nom: 'partages', url: () => '/partages?nouveau=1', ecran: '/partages' },
  { nom: 'partage-page', url: (c) => `/partage/${c.langue === 'fr' ? PARTAGES_DEMO.fr : PARTAGES_DEMO.en}`, ecran: '/partage/[jeton]' },
  { nom: 'audit', url: (c) => `/audit?url=${encodeURIComponent(c.langue === 'fr' ? 'https://geotrends.io/methode' : 'https://geotrends.io/en/method')}`, ecran: '/audit?url=…' },
  { nom: 'projets', url: () => '/projets', ecran: '/projets' },
  {
    nom: 'projet-nouveau', url: () => '/projets/nouveau', ecran: '/projets/nouveau',
    gestes: (c) => {
      b('fill', 'input[name=marque]', 'Facturo')
      b('click', 'form ol li:nth-child(2) button')
      b('fill', 'textarea[name=sites]', 'facturo.exemple')
      b('fill', 'textarea[name=chaines]', 'https://www.youtube.com/@facturo-demo\nhttps://www.youtube.com/@facturo-academy-demo')
      b('fill', 'textarea[name=profils]', 'https://www.linkedin.com/company/facturo-demo\nhttps://www.instagram.com/facturo.demo')
      void c
    },
  },
  { nom: 'projet', url: (c) => `/projets/${c.projetId}?onglet=marque`, ecran: '/projets/[id]?onglet=marque' },
  { nom: 'projet-questions', url: (c) => `/projets/${c.projetId}?onglet=questions`, ecran: '/projets/[id]?onglet=questions' },
  { nom: 'projet-releves', url: (c) => `/projets/${c.projetId}`, ecran: '/projets/[id]' },
  { nom: 'reglages', url: () => '/reglages', ecran: '/reglages', retouche: RETOUCHE_CLES },
  { nom: 'couts', url: () => '/admin/couts', ecran: '/admin/couts' },

  // ── Blocs seuls, pour illustrer un point précis ──────────────────────────
  { nom: 'vue-courbe', url: () => '/vue', ecran: '/vue', bloc: () => '#graphique', annexe: true },
  { nom: 'vue-alertes', url: () => '/vue', ecran: '/vue', bloc: titre('Alertes', 'Alerts'), annexe: true },
  { nom: 'question-presence', url: (c) => `/questions/${c.q1}`, ecran: '/questions/[id]', bloc: titre('Présence, IA par IA', 'Presence, AI by AI'), annexe: true },
  { nom: 'question-colonnes', url: (c) => `/questions/${c.q1}?ia=chatgpt`, ecran: '/questions/[id]', bloc: () => '#reponses', annexe: true },
  { nom: 'action-fiche', url: (c) => `/actions?onglet=resultats&action=${encodeURIComponent(c.action)}`, ecran: '/actions?onglet=resultats&action=…', bloc: () => '#fiche', annexe: true },
  { nom: 'faits-contradictions', url: () => '/faits', ecran: '/faits', bloc: titre('Réponses qui disent autre chose', 'Answers that say otherwise'), annexe: true },
  { nom: 'reglages-rythme', url: () => '/reglages', ecran: '/reglages', bloc: titre('Rythme des relevés', 'Run schedule'), annexe: true },
  { nom: 'reglages-comptes', url: () => '/reglages', ecran: '/reglages', bloc: () => '#comptes', annexe: true },
  { nom: 'projet-prix', url: (c) => `/projets/${c.projetId}`, ecran: '/projets/[id]', bloc: titre('Lancer un relevé', 'Start a run'), annexe: true },
  {
    nom: 'projet-nouveau-recap', url: () => '/projets/nouveau', ecran: '/projets/nouveau', annexe: true,
    gestes: (c) => {
      const fr = c.langue === 'fr'
      b('fill', 'input[name=marque]', 'Facturo')
      b('click', 'form ol li:nth-child(2) button')
      b('fill', 'textarea[name=sites]', 'facturo.exemple')
      b('fill', 'textarea[name=profils]', 'https://www.linkedin.com/company/facturo-demo\nhttps://www.instagram.com/facturo.demo')
      // « Suivant » : l'outil vérifie les sites et les profils saisis (lecture locale, gratuite).
      b('click', 'form button.bouton[type=button]:not(.bouton-creux)')
      if (!fr) {
        b('select', 'select[name=pays]', 'GB')
        b('select', 'select[name=langue]', 'en')
      }
      b('click', 'form ol li:nth-child(4) button')
      b('fill', 'textarea[name=concurrents]', 'Comptalis\nDevizo\nTikette\nBillbox')
      b('click', 'form ol li:nth-child(5) button')
      b('fill', 'textarea[name=questions]', fr
        ? 'Quel logiciel de facturation choisir quand on est auto-entrepreneur ?\nQuel est le meilleur logiciel de facturation pour une TPE ?\nFacturo ou Comptalis : lequel choisir ?\nComment relancer un client qui ne paie pas sa facture ?\nLogiciel de facturation avec essai gratuit sans carte bancaire'
        : 'Which invoicing software should a sole trader choose?\nWhat is the best invoicing software for a small business?\nFacturo or Comptalis: which one should I choose?\nHow do I chase a client who hasn’t paid an invoice?\nInvoicing software with a free trial and no credit card')
      b('click', 'form ol li:nth-child(6) button')
    },
  },
]

function dimensionsPng(fichier: string) {
  const t = fs.readFileSync(fichier)
  return { largeur: t.readUInt32BE(16), hauteur: t.readUInt32BE(20) }
}

function enWebp(png: string, webp: string): number {
  for (const q of [80, 72, 64, 56]) {
    execFileSync(CWEBP, ['-quiet', '-q', String(q), '-m', '6', '-sharp_yuv', png, '-o', webp])
    const poids = fs.statSync(webp).size
    if (poids <= POIDS_MAX || q === 56) return poids
  }
  return fs.statSync(webp).size
}

async function attendreServeur(ms: number) {
  const fin = Date.now() + ms
  while (Date.now() < fin) {
    try {
      const r = await fetch(`${BASE}/connexion`, { signal: AbortSignal.timeout(5000) })
      if (r.ok) return
    } catch {
      // pas encore prêt
    }
    await pause(500)
  }
  throw new Error('L’application ne répond pas sur le port 3020.')
}

async function main() {
  const t0 = Date.now()
  try {
    await fetch(`${BASE}/connexion`, { signal: AbortSignal.timeout(2000) })
    console.error(`Le port ${PORT} est déjà pris : arrêtez l’application qui l’occupe, puis relancez.`)
    process.exit(1)
  } catch {
    // libre : c'est ce qu'on veut
  }
  if (!fs.existsSync(path.join(RACINE, '.next', 'BUILD_ID'))) throw new Error('Application non construite : lancez `npx next build` d’abord (tout.sh le fait).')

  // Les identifiants du projet affiché, de la question et de l'action montrées.
  const contextes = new Map<Langue, Contexte>()
  for (const [langue, nom] of [['fr', 'Facturo'], ['en', 'Facturo UK']] as const) {
    const projet = await prisma.projet.findUniqueOrThrow({ where: { nom } })
    const q1 = await prisma.question.findFirstOrThrow({ where: { projetId: projet.id, ordre: 1 } })
    const action = await prisma.etatAction.findFirstOrThrow({ where: { projetId: projet.id, etat: 'fait' }, orderBy: { faitLe: 'asc' } })
    const page = await prisma.pageSuivie.findFirstOrThrow({ where: { projetId: projet.id } })
    contextes.set(langue, { langue, projetId: projet.id, q1: q1.id, action: action.cle, page: page.id })
  }

  // L'application, en production (pas de bandeau de développement), sans aucune clé.
  console.log('Démarrage de l’application sur le port 3020…')
  const serveur: ChildProcess = spawn(path.join(RACINE, 'node_modules/.bin/next'), ['start', '-p', String(PORT)], { cwd: RACINE, env: { ...process.env, NODE_ENV: 'production' }, stdio: ['ignore', 'pipe', 'pipe'], detached: true })
  const journal: string[] = []
  serveur.stdout?.on('data', (d) => journal.push(String(d)))
  serveur.stderr?.on('data', (d) => journal.push(String(d)))
  const arreter = () => { try { if (serveur.pid) process.kill(-serveur.pid, 'SIGTERM') } catch { /* déjà arrêté */ } }
  process.on('exit', arreter)
  // Interrompu (Ctrl-C) : on arrête quand même l'application et le navigateur.
  for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => { try { b('stop') } catch { /* déjà arrêté */ } arreter(); process.exit(130) })

  const brouillon = fs.mkdtempSync(path.join(RACINE, '.captures-'))
  const manifeste: { genere: string; captures: Record<Langue, Record<string, { fichier: string; largeur: number; hauteur: number; ecran: string }>> } = { genere: new Date().toISOString(), captures: { fr: {}, en: {} } }
  const ancien = fs.existsSync(path.join(SORTIE, 'manifeste.json')) ? JSON.parse(fs.readFileSync(path.join(SORTIE, 'manifeste.json'), 'utf8')) : null
  try {
    await attendreServeur(60_000)
    const photographier = async (liste: Capture[]) => {
    if (liste.length === 0) return
    for (const langue of ['fr', 'en'] as Langue[]) {
      const c = contextes.get(langue)!
      fs.mkdirSync(path.join(SORTIE, langue), { recursive: true })
      // Navigateur neuf pour chaque langue : aucune session ni aucun cookie d'avant.
      try { b('stop') } catch { /* pas lancé */ }
      b('viewport', `${LARGEUR}x${HAUTEUR}`, '--scale', String(ECHELLE))
      b('header', `Accept-Language:${langue === 'fr' ? 'fr-FR,fr;q=0.9' : 'en-GB,en;q=0.9'}`)
      let connecte = false

      for (const cap of liste) {
        if (!cap.horsConnexion && !connecte) {
          b('goto', `${BASE}/connexion`)
          b('fill', 'input[name=email]', COMPTE_DEMO.email)
          b('fill', 'input[name=motdepasse]', COMPTE_DEMO.motDePasse)
          b('click', 'button[type=submit]')
          calme()
          await pause(1500)
          // Langue de l'interface et projet affiché : les deux cookies de l'outil.
          b('cookie', `gt_langue=${langue}`)
          b('cookie', `gt_projet=${c.projetId}`)
          connecte = true
        }
        const hauteur = cap.hauteur ?? HAUTEUR
        if (hauteur !== HAUTEUR) b('viewport', `${LARGEUR}x${hauteur}`)
        b('goto', `${BASE}${cap.url(c)}`)
        calme()
        if (cap.gestes) cap.gestes(c)
        if (cap.bloc) b('scroll', cap.bloc(c))
        // Les compteurs et les courbes s'animent à l'affichage : on attend la fin.
        await pause(2500)
        calme()
        const png = path.join(brouillon, `${langue}-${cap.nom}.png`)
        // Pas de champ en surbrillance, dates dans l'ordre jour/mois, retouche éventuelle.
        b('js', `(() => { document.activeElement?.blur?.(); ${DATES_JJ_MM}; ${cap.retouche ? cap.retouche(c) : ''}; return true })()`)
        if (cap.bloc) {
          // La barre du haut reste collée en haut de l'écran : sur un gros plan, elle masquerait le haut du bloc.
          b('js', `(() => { document.querySelectorAll('.barre-haut').forEach((x) => { x.style.position = 'static' }); return true })()`)
          b('scroll', cap.bloc(c))
          await pause(800)
          b('screenshot', '--selector', cap.bloc(c), png)
        }
        else {
          b('js', 'window.scrollTo(0, 0)')
          await pause(400)
          b('screenshot', '--viewport', png)
        }
        if (hauteur !== HAUTEUR) b('viewport', `${LARGEUR}x${HAUTEUR}`)
        const { largeur, hauteur: h } = dimensionsPng(png)
        const webp = path.join(SORTIE, langue, `${cap.nom}.webp`)
        const poids = enWebp(png, webp)
        manifeste.captures[langue][cap.nom] = { fichier: `/docs/captures/${langue}/${cap.nom}.webp`, largeur, hauteur: h, ecran: cap.ecran }
        console.log(`${langue} ${cap.nom.padEnd(22)} ${largeur}×${h} ${(poids / 1024).toFixed(0)} Ko`)
      }
    }
    }
    const voulues = CAPTURES.filter((c) => !SEULEMENT || SEULEMENT.includes(c.nom))
    await photographier(voulues.filter((c) => !c.sansCompte))
    // L'écran du premier lancement ne s'affiche que sans aucun compte : on vide les comptes de la
    // base de démonstration (elle est remplie de nouveau à chaque série), puis on le photographie.
    const premierLancement = voulues.filter((c) => c.sansCompte)
    if (premierLancement.length) {
      await prisma.user.deleteMany()
      await photographier(premierLancement)
    }
  } catch (e) {
    console.error(e instanceof Error ? e.message : e)
    console.error('--- journal de l’application ---\n' + journal.join('').slice(-4000))
    process.exitCode = 1
  } finally {
    try { b('stop') } catch { /* déjà arrêté */ }
    arreter()
    fs.rmSync(brouillon, { recursive: true, force: true })
    await prisma.$disconnect()
  }

  // Une capture partielle (--seulement) complète l'ancien manifeste au lieu de l'écraser.
  if (SEULEMENT && ancien) for (const l of ['fr', 'en'] as Langue[]) manifeste.captures[l] = { ...ancien.captures[l], ...manifeste.captures[l] }
  fs.writeFileSync(path.join(SORTIE, 'manifeste.json'), `${JSON.stringify(manifeste, null, 2)}\n`)
  console.log(`Manifeste : ${path.join(SORTIE, 'manifeste.json')} · ${((Date.now() - t0) / 1000).toFixed(0)} s`)
  if (process.exitCode) process.exit(process.exitCode)
}

main()
