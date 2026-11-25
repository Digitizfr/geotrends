/*
 * Profils de réseaux sociaux d'une marque.
 *
 * Un profil est une propriété de type « profil » : valeur = adresse normalisée
 * sans protocole ni « www. » (ex. « linkedin.com/company/facturo »), libellé =
 * nom du réseau. Une page citée par une IA dont l'adresse est ce profil, ou
 * une page placée dessous, compte pour la marque.
 *
 * La détection lit la page d'accueil du site (gratuit) : liens de la page et
 * balisage « sameAs », qui est la liste officielle des profils d'un site.
 */

export type Profil = { reseau: string; valeur: string }

type Reseau = { nom: string; domaines: string[]; /** Premiers segments qui désignent une page, pas un profil. */ refus: string[]; /** Segments qui précèdent le nom du profil. */ prefixes: string[]; /** Le nom du profil est le premier segment, sans préfixe. */ direct: boolean }

const AUCUN: string[] = []
const RESEAUX: Reseau[] = [
  { nom: 'LinkedIn', domaines: ['linkedin.com'], refus: AUCUN, prefixes: ['company', 'in', 'school', 'showcase'], direct: false },
  { nom: 'Instagram', domaines: ['instagram.com'], refus: ['p', 'reel', 'reels', 'explore', 'accounts', 'stories', 'tv', 'direct'], prefixes: AUCUN, direct: true },
  { nom: 'Facebook', domaines: ['facebook.com', 'fb.com'], refus: ['sharer', 'sharer.php', 'share', 'share.php', 'dialog', 'plugins', 'tr', 'login', 'groups', 'events', 'watch', 'photo', 'photo.php', 'permalink.php', 'story.php', 'hashtag', 'policies', 'help', 'privacy', 'pages', 'people'], prefixes: AUCUN, direct: true },
  { nom: 'X', domaines: ['x.com', 'twitter.com'], refus: ['intent', 'share', 'home', 'i', 'search', 'hashtag', 'login', 'explore', 'settings', 'privacy', 'tos', 'about'], prefixes: AUCUN, direct: true },
  { nom: 'TikTok', domaines: ['tiktok.com'], refus: ['embed', 'discover', 'tag', 'music', 'video', 'search', 'login', 'legal', 'about'], prefixes: AUCUN, direct: true },
  { nom: 'Pinterest', domaines: ['pinterest.com', 'pinterest.fr'], refus: ['pin', 'search', 'ideas', 'login', 'business', 'today'], prefixes: AUCUN, direct: true },
  { nom: 'Threads', domaines: ['threads.net', 'threads.com'], refus: ['search', 'login', 'about'], prefixes: AUCUN, direct: true },
  { nom: 'Bluesky', domaines: ['bsky.app'], refus: AUCUN, prefixes: ['profile'], direct: false },
  { nom: 'GitHub', domaines: ['github.com'], refus: ['features', 'pricing', 'login', 'join', 'about', 'sponsors', 'topics', 'marketplace', 'orgs', 'enterprise', 'security', 'collections'], prefixes: AUCUN, direct: true },
]

export const NOMS_RESEAUX = RESEAUX.map((r) => r.nom)

const sansWww = (h: string) => h.toLowerCase().replace(/^www\./, '').replace(/^(m|fr|en|mobile|business)\./, '')

/**
 * Reconnaît une adresse de profil, ou null si l'adresse n'en est pas une
 * (bouton de partage, publication, page du réseau lui-même…).
 */
export function profilDepuisUrl(saisie: string): Profil | null {
  let u: URL
  try {
    const t = saisie.trim()
    u = new URL(t.includes('://') ? t : `https://${t}`)
  } catch {
    return null
  }
  const hote = sansWww(u.hostname)
  const reseau = RESEAUX.find((r) => r.domaines.some((d) => hote === d))
  if (!reseau) return null
  const segments = u.pathname.split('/').map((s) => decodeURIComponent(s).trim()).filter(Boolean)
  let nom: string | undefined
  let racine: string[] = []
  if (reseau.direct) {
    // Facebook : « profile.php?id=… » désigne un profil par son numéro.
    if (reseau.nom === 'Facebook' && segments[0]?.toLowerCase() === 'profile.php' && u.searchParams.get('id')) return { reseau: reseau.nom, valeur: `${reseau.domaines[0]}/profile.php?id=${u.searchParams.get('id')}` }
    nom = segments[0]
    if (!nom || reseau.refus.includes(nom.toLowerCase())) return null
    racine = [nom]
  } else {
    const [prefixe, n] = [segments[0]?.toLowerCase(), segments[1]]
    if (!prefixe || !reseau.prefixes.includes(prefixe) || !n) return null
    nom = n
    racine = [prefixe, n]
  }
  if (!/^[@\p{L}\p{N}._%-]+$/u.test(nom)) return null
  return { reseau: reseau.nom, valeur: `${reseau.domaines[0]}/${racine.join('/')}`.toLowerCase() }
}

/** Vrai si l'adresse d'une source est celle du profil, ou une page placée sous ce profil. */
export function estSousProfil(urlSource: string | null | undefined, valeur: string): boolean {
  if (!urlSource) return false
  const p = profilDepuisUrl(urlSource)
  return !!p && p.valeur === valeur.toLowerCase()
}

