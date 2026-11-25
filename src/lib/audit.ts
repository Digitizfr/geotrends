/*
 * Audit d'une page : une IA peut-elle la lire, et y trouve-t-elle une réponse ?
 * Tout se fait par lecture directe de la page (gratuit) : règles du robots.txt
 * pour chaque robot d'IA, réponse réelle du serveur à ces robots, texte présent
 * sans JavaScript, titres, données structurées, date, auteur.
 *
 * Ce que l'audit ne dit pas : si la page sera citée. Il dit seulement si
 * quelque chose l'en empêche techniquement.
 */
import { tr } from './i18n/courante'

export type Etat = 'ok' | 'attention' | 'bloquant' | 'info'
export type Controle = { famille: 'Accès des robots' | 'Lecture de la page' | 'Contenu' | 'Repères pour les IA'; libelle: string; etat: Etat; detail: string }
export type Audit = { url: string; controles: Controle[]; robots: { robot: string; role: string; regle: 'autorisé' | 'bloqué'; reponse: number | null }[]; resume: { bloquants: number; attentions: number; mots: number; titre: string | null } }

/** Les robots des IA, avec ce à quoi ils servent. */
const ROBOTS: { nom: string; role: string; teste?: boolean }[] = [
  { nom: 'OAI-SearchBot', role: 'ChatGPT : recherche et citations', teste: true },
  { nom: 'ChatGPT-User', role: 'ChatGPT : page ouverte à la demande d’un utilisateur', teste: true },
  { nom: 'GPTBot', role: 'OpenAI : entraînement des modèles' },
  { nom: 'Claude-SearchBot', role: 'Claude : recherche et citations', teste: true },
  { nom: 'Claude-User', role: 'Claude : page ouverte à la demande d’un utilisateur' },
  { nom: 'ClaudeBot', role: 'Anthropic : entraînement des modèles' },
  { nom: 'PerplexityBot', role: 'Perplexity : recherche et citations', teste: true },
  { nom: 'Googlebot', role: 'Google : résultats, Aperçus IA et Mode IA', teste: true },
  { nom: 'Google-Extended', role: 'Google : entraînement de Gemini' },
  { nom: 'Bingbot', role: 'Bing : résultats et Copilot' },
  { nom: 'Applebot-Extended', role: 'Apple : entraînement des modèles' },
  { nom: 'CCBot', role: 'Common Crawl : base réutilisée par de nombreux modèles' },
]

const NAVIGATEUR = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

/** Refuse les adresses locales ou privées : l'audit ne sert qu'à lire des pages publiques. */
export function adressePublique(saisie: string): URL | null {
  try {
    const u = new URL(saisie.trim().includes('://') ? saisie.trim() : `https://${saisie.trim()}`)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    const h = u.hostname.toLowerCase()
    if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal') || !h.includes('.')) return null
    if (/^(\d+\.){3}\d+$/.test(h) || h.includes(':')) return null
    return u
  } catch {
    return null
  }
}

async function lire(url: string, agent: string): Promise<{ statut: number | null; corps: string; type: string }> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': agent, Accept: 'text/html,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(15_000) })
    const type = res.headers.get('content-type') ?? ''
    const corps = /text|html|xml|json/.test(type) || !type ? (await res.text()).slice(0, 1_500_000) : ''
    return { statut: res.status, corps, type }
  } catch {
    return { statut: null, corps: '', type: '' }
  }
}

/** Règle du robots.txt pour un robot et un chemin : le groupe du robot, sinon le groupe « * ». La règle la plus longue l'emporte. */
function regleRobots(robotsTxt: string, robot: string, chemin: string): boolean {
  const groupes: { agents: string[]; regles: { permis: boolean; motif: string }[] }[] = []
  let courant: (typeof groupes)[number] | null = null
  let dernierEstAgent = false
  for (const brute of robotsTxt.split(/\r?\n/)) {
    const ligne = brute.replace(/#.*/, '').trim()
    const m = ligne.match(/^([A-Za-z-]+)\s*:\s*(.*)$/)
    if (!m) continue
    const cle = m[1].toLowerCase()
    const valeur = m[2].trim()
    if (cle === 'user-agent') {
      if (!courant || !dernierEstAgent) {
        courant = { agents: [], regles: [] }
        groupes.push(courant)
      }
      courant.agents.push(valeur.toLowerCase())
      dernierEstAgent = true
    } else if ((cle === 'allow' || cle === 'disallow') && courant) {
      courant.regles.push({ permis: cle === 'allow', motif: valeur })
      dernierEstAgent = false
    } else dernierEstAgent = false
  }
  const groupe = groupes.find((g) => g.agents.includes(robot.toLowerCase())) ?? groupes.find((g) => g.agents.includes('*'))
  if (!groupe) return true
  let meilleure: { permis: boolean; longueur: number } = { permis: true, longueur: -1 }
  for (const r of groupe.regles) {
    if (r.motif === '') continue
    const motif = new RegExp('^' + r.motif.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'))
    if (motif.test(chemin) && (r.motif.length > meilleure.longueur || (r.motif.length === meilleure.longueur && r.permis))) meilleure = { permis: r.permis, longueur: r.motif.length }
  }
  return meilleure.permis
}

const sansBalises = (html: string) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>|<svg[\s\S]*?<\/svg>|<!--[\s\S]*?-->/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim()
const attribut = (html: string, motif: RegExp) => html.match(motif)?.[1]?.trim() ?? null

export async function auditer(saisie: string): Promise<Audit | null> {
  const u = adressePublique(saisie)
  if (!u) return null
  const url = u.toString()
  const chemin = u.pathname + u.search

  const [page, robotsTxt, llms] = await Promise.all([lire(url, NAVIGATEUR), lire(`${u.origin}/robots.txt`, NAVIGATEUR), lire(`${u.origin}/llms.txt`, NAVIGATEUR)])
  const aTester = ROBOTS.filter((r) => r.teste)
  const reponses = await Promise.all(aTester.map((r) => lire(url, `Mozilla/5.0 (compatible; ${r.nom}/1.0)`)))
  const html = page.corps
  const controles: Controle[] = []
  const ajoute = (famille: Controle['famille'], libelle: string, etat: Etat, detail: string) => controles.push({ famille, libelle, etat, detail })

  // ── Accès des robots ──
  const aRobots = robotsTxt.statut === 200 && !/<html/i.test(robotsTxt.corps)
  const robots = ROBOTS.map((r) => ({
    robot: r.nom,
    role: r.role,
    regle: (aRobots ? regleRobots(robotsTxt.corps, r.nom, chemin) : true) ? ('autorisé' as const) : ('bloqué' as const),
    reponse: r.teste ? (reponses[aTester.findIndex((x) => x.nom === r.nom)]?.statut ?? null) : null,
    teste: !!r.teste,
  }))
  const bloquesRecherche = robots.filter((r) => r.regle === 'bloqué' && /recherche|résultats/.test(r.role))
  if (bloquesRecherche.length) ajoute('Accès des robots', 'Robots de recherche des IA', 'bloquant', tr('Le fichier robots.txt interdit cette page à {robots}. Ces IA ne peuvent ni la lire ni la citer.', { robots: bloquesRecherche.map((r) => r.robot).join(', ') }))
  else ajoute('Accès des robots', 'Robots de recherche des IA', 'ok', aRobots ? tr('Le fichier robots.txt laisse passer les robots de recherche de ChatGPT, Claude, Perplexity et Google.') : tr('Aucun fichier robots.txt : rien n’est interdit.'))
  const refuses = robots.filter((r) => r.reponse !== null && r.reponse !== 200)
  const injoignables = robots.filter((r) => r.teste && r.reponse === null)
  if (page.statut === 200 && refuses.length) ajoute('Accès des robots', 'Réponse du serveur aux robots', 'bloquant', tr('Le serveur répond 200 à un navigateur mais {refus}. Un pare-feu ou l’hébergeur bloque ces robots, même si le robots.txt les autorise.', { refus: refuses.map((r) => tr('{code} à {robot}', { code: String(r.reponse), robot: r.robot })).join(', ') }))
  else if (page.statut === 200 && injoignables.length === 0) ajoute('Accès des robots', 'Réponse du serveur aux robots', 'ok', tr('Le serveur répond 200 aux robots des IA comme à un navigateur.'))
  const entrainement = robots.filter((r) => r.regle === 'bloqué' && /entraînement/.test(r.role))
  if (entrainement.length) ajoute('Accès des robots', 'Robots d’entraînement', 'info', tr('{robots} sont interdits. C’est un choix : cela n’empêche pas d’être cité, mais les modèles n’apprennent pas de cette page.', { robots: entrainement.map((r) => r.robot).join(', ') }))

  // ── Lecture de la page ──
  if (page.statut !== 200) ajoute('Lecture de la page', 'Réponse de la page', 'bloquant', page.statut === null ? tr('La page ne répond pas (délai dépassé ou adresse injoignable).') : tr('La page répond {code} au lieu de 200.', { code: String(page.statut) }))
  else ajoute('Lecture de la page', 'Réponse de la page', 'ok', tr('La page répond 200.'))
  const metaRobots = attribut(html, /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i) ?? attribut(html, /<meta[^>]+content=["']([^"']+)["'][^>]*name=["']robots["']/i)
  if (metaRobots && /noindex|nosnippet/i.test(metaRobots)) ajoute('Lecture de la page', 'Balise robots', 'bloquant', tr('La page porte la balise « {balise} » : elle demande à ne pas être indexée ou à ne pas être reprise en extrait.', { balise: metaRobots }))
  else ajoute('Lecture de la page', 'Balise robots', 'ok', tr('Aucune balise n’interdit l’indexation ni la reprise d’extraits.'))
  const texte = sansBalises(html.replace(/<(header|nav|footer)[\s\S]*?<\/\1>/gi, ' '))
  const mots = texte ? texte.split(' ').length : 0
  if (page.statut === 200) {
    if (mots < 150) ajoute('Lecture de la page', 'Texte lisible sans JavaScript', 'bloquant', tr('Seulement {mots} mots dans la page telle que le serveur l’envoie. Les robots des IA n’exécutent pas le JavaScript : si le contenu s’affiche après coup, ils ne le voient pas.', { mots }))
    else if (mots < 400) ajoute('Lecture de la page', 'Texte lisible sans JavaScript', 'attention', tr('{mots} mots lisibles sans JavaScript. C’est peu pour répondre à une question en détail.', { mots }))
    else ajoute('Lecture de la page', 'Texte lisible sans JavaScript', 'ok', tr('{mots} mots lisibles dans la page telle que le serveur l’envoie.', { mots }))
  }
  const canonique = attribut(html, /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
  if (canonique && adressePublique(canonique)?.toString().replace(/\/$/, '') !== url.replace(/\/$/, '')) ajoute('Lecture de la page', 'Adresse de référence', 'attention', tr('La page désigne une autre adresse comme référence : {adresse}. C’est elle que les moteurs retiennent.', { adresse: canonique }))

  // ── Contenu ──
  const titre = attribut(html, /<title[^>]*>([\s\S]*?)<\/title>/i)?.replace(/\s+/g, ' ') ?? null
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => sansBalises(m[1]))
  const h2 = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => sansBalises(m[1]))
  if (page.statut === 200) {
    ajoute('Contenu', 'Titre de la page', titre ? 'ok' : 'attention', titre ? `« ${titre.slice(0, 140)} »` : tr('La page n’a pas de balise de titre.'))
    ajoute('Contenu', 'Titre principal', h1.length === 1 ? 'ok' : 'attention', h1.length === 1 ? tr('Un seul titre principal : « {titre} ».', { titre: h1[0].slice(0, 120) }) : h1.length === 0 ? tr('Aucun titre principal (h1) : la page n’annonce pas son sujet.') : tr('{n} titres principaux (h1) : un seul suffit.', { n: h1.length }))
    const questions = h2.filter((t) => /\?\s*$/.test(t)).length
    if (h2.length < 3) ajoute('Contenu', 'Découpage en parties', 'attention', tr('{n} [n:sous-titre|sous-titres] seulement. Une page découpée en parties nettes se cite plus facilement, passage par passage.', { n: h2.length }))
    else ajoute('Contenu', 'Découpage en parties', 'ok', tr('{n} sous-titres, dont {questions} en forme de question. Les IA reprennent volontiers un passage qui répond à une question posée telle quelle.', { n: h2.length, questions }))
    const listes = (html.match(/<(ul|ol|table)[\s>]/gi) ?? []).length
    ajoute('Contenu', 'Listes et tableaux', listes >= 2 ? 'ok' : 'info', listes >= 2 ? tr('{n} listes ou tableaux : une comparaison en tableau se reprend bien.', { n: listes }) : tr('Peu ou pas de listes ni de tableaux. Pour une comparaison, un tableau aide les IA à reprendre l’information.'))
  }

  // ── Repères pour les IA ──
  const blocs = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1])
  const types = [...new Set(blocs.flatMap((b) => [...b.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1])))]
  if (page.statut === 200) {
    ajoute('Repères pour les IA', 'Données structurées', types.length ? 'ok' : 'attention', types.length ? tr('Types déclarés : {types}.', { types: types.slice(0, 10).join(', ') }) : tr('Aucune donnée structurée (JSON-LD). Elles disent sans ambiguïté qui publie la page, quand, et de quoi elle parle.'))
    const modifiee = attribut(html, /"dateModified"\s*:\s*"([^"]+)"/) ?? attribut(html, /<meta[^>]+property=["']article:modified_time["'][^>]*content=["']([^"']+)["']/i)
    const publiee = attribut(html, /"datePublished"\s*:\s*"([^"]+)"/) ?? attribut(html, /<meta[^>]+property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i)
    const date = modifiee ?? publiee
    if (!date) ajoute('Repères pour les IA', 'Date de la page', 'attention', tr('Aucune date de publication ni de mise à jour lisible. Les IA citent de préférence une page dont elles connaissent la fraîcheur.'))
    else {
      const mois = Math.round((Date.now() - new Date(date).getTime()) / (30 * 86_400_000))
      ajoute('Repères pour les IA', 'Date de la page', Number.isFinite(mois) && mois > 18 ? 'attention' : 'ok', `${modifiee ? tr('Mise à jour le {date}', { date: date.slice(0, 10) }) : tr('Publiée le {date}', { date: date.slice(0, 10) })}${Number.isFinite(mois) && mois > 18 ? tr(' : il y a plus de {mois} mois, la page peut passer pour dépassée.', { mois }) : '.'}`)
    }
    const auteur = attribut(html, /<meta[^>]+name=["']author["'][^>]*content=["']([^"']+)["']/i) ?? attribut(html, /"author"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/)
    // Dans les données structurées, les accents peuvent être écrits sous forme de codes (« Lo\\u00efc ») : on les remet en clair.
    const enClair = (t: string) => t.replace(/\\u([0-9a-fA-F]{4})/g, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
    ajoute('Repères pour les IA', 'Auteur', auteur ? 'ok' : 'info', auteur ? tr('Auteur déclaré : {auteur}.', { auteur: enClair(auteur) }) : tr('Aucun auteur déclaré.'))
    ajoute('Repères pour les IA', 'Fichier llms.txt', 'info', llms.statut === 200 && !/<html/i.test(llms.corps) ? tr('Le site a un fichier llms.txt. Rien ne prouve que les IA s’en servent : c’est noté pour information.') : tr('Pas de fichier llms.txt. Ce n’est pas un manque : rien ne prouve que les IA s’en servent.'))
  }

  return { url, controles, robots, resume: { bloquants: controles.filter((c) => c.etat === 'bloquant').length, attentions: controles.filter((c) => c.etat === 'attention').length, mots, titre } }
}

const entites = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&rsquo;|&lsquo;/g, '’').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export type PageLue = { url: string; statut: number | null; titre: string | null; description: string | null; intertitres: string[]; texte: string; mots: number; langue: string | null }

/**
 * Ce qu'il faut d'une page pour proposer les questions auxquelles elle répond :
 * titre, description, intertitres et texte, tels que le serveur les envoie (sans
 * JavaScript, comme les robots des IA). Lecture directe et gratuite.
 */
export async function lirePage(saisie: string): Promise<PageLue | null> {
  const u = adressePublique(saisie)
  if (!u) return null
  const page = await lire(u.toString(), NAVIGATEUR)
  const html = page.corps
  const titre = attribut(html, /<title[^>]*>([\s\S]{1,400}?)<\/title>/i)
  const description = attribut(html, /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i) ?? attribut(html, /<meta[^>]+content=["']([^"']+)["'][^>]*name=["']description["']/i)
  const intertitres = [...html.matchAll(/<h([1-3])[^>]*>([\s\S]{1,600}?)<\/h\1>/gi)].map((m) => entites(m[2].replace(/<[^>]+>/g, ' '))).filter((x) => x.length > 2).slice(0, 30)
  const texte = entites(sansBalises(html.replace(/<(header|nav|footer|aside)[\s\S]*?<\/\1>/gi, ' ')))
  return {
    url: u.toString(),
    statut: page.statut,
    titre: titre ? entites(titre) : null,
    description: description ? entites(description) : null,
    intertitres,
    texte: texte.slice(0, 7000),
    mots: texte ? texte.split(' ').length : 0,
    langue: attribut(html, /<html[^>]+lang=["']([a-zA-Z-]{2,10})["']/i),
  }
}
