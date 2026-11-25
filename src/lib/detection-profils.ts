/*
 * Détection des profils sociaux d'une marque depuis son site : lecture de la
 * page d'accueil (gratuite). Côté serveur seulement (accès réseau).
 */
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { adressePublique } from './audit'
import { profilDepuisUrl, type Profil } from './profils'

const NAVIGATEUR = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

const privee = (ip: string) =>
  /^(10\.|127\.|169\.254\.|192\.168\.|0\.)/.test(ip) || /^172\.(1[6-9]|2\d|3[01])\./.test(ip) || ip === '::1' || /^(fc|fd|fe80)/i.test(ip)

/** Refuse un site dont le nom pointe vers une adresse interne. */
async function hotePublic(hote: string): Promise<boolean> {
  if (isIP(hote)) return !privee(hote)
  try {
    const adresses = await lookup(hote, { all: true })
    return adresses.length > 0 && adresses.every((a) => !privee(a.address))
  } catch {
    return false
  }
}

async function lirePage(url: URL): Promise<string> {
  if (!(await hotePublic(url.hostname))) return ''
  try {
    const res = await fetch(url, { headers: { 'User-Agent': NAVIGATEUR, Accept: 'text/html,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(10_000) })
    if (!(res.headers.get('content-type') ?? 'text/html').includes('html')) return ''
    return (await res.text()).slice(0, 1_500_000)
  } catch {
    return ''
  }
}

/** Toutes les adresses http(s) d'une page : liens, balisage « sameAs », métadonnées. */
function adressesDe(html: string): string[] {
  const trouvees = new Set<string>()
  for (const m of html.matchAll(/(?:href|content)\s*=\s*["']([^"']+)["']/gi)) trouvees.add(m[1].replace(/&amp;/g, '&'))
  // Le JSON-LD « sameAs » liste les profils officiels, parfois sans lien visible.
  for (const bloc of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const m of bloc[1].matchAll(/https?:\\?\/\\?\/[^"'\s,\]]+/g)) trouvees.add(m[0].replace(/\\\//g, '/'))
  }
  return [...trouvees].filter((a) => /^https?:\/\//i.test(a))
}

export type Detection = {
  profils: (Profil & { origine: 'sameAs' | 'lien' })[]
  /** Adresses de chaînes YouTube trouvées : elles passent ensuite par la résolution habituelle. */
  chaines: string[]
  /** Sites lus et sites illisibles. */
  lus: string[]
  illisibles: string[]
}

/** Lit la page d'accueil des sites donnés (gratuit) et en tire les profils sociaux et les chaînes YouTube. */
export async function detecterDepuisSites(sites: string[]): Promise<Detection> {
  const bilan: Detection = { profils: [], chaines: [], lus: [], illisibles: [] }
  const vus = new Set<string>()
  const chaines = new Set<string>()
  for (const site of sites.slice(0, 10)) {
    const adresse = adressePublique(site)
    if (!adresse) {
      bilan.illisibles.push(site)
      continue
    }
    let html = await lirePage(new URL('/', adresse))
    if (!html && !adresse.hostname.startsWith('www.')) html = await lirePage(new URL(`https://www.${adresse.hostname}/`))
    if (!html) {
      bilan.illisibles.push(site)
      continue
    }
    bilan.lus.push(adresse.hostname)
    const sameAs = new Set<string>()
    for (const bloc of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
      for (const m of bloc[1].matchAll(/https?:\\?\/\\?\/[^"'\s,\]]+/g)) sameAs.add(m[0].replace(/\\\//g, '/'))
    }
    for (const a of adressesDe(html)) {
      const p = profilDepuisUrl(a)
      if (p) {
        if (!vus.has(p.valeur)) {
          vus.add(p.valeur)
          bilan.profils.push({ ...p, origine: sameAs.has(a) ? 'sameAs' : 'lien' })
        }
        continue
      }
      // Chaîne YouTube : « @nom » ou « /channel/UC… » (les vidéos et listes ne désignent pas la chaîne).
      const y = a.match(/^https?:\/\/(?:www\.|m\.)?youtube\.com\/(@[\p{L}\p{N}._-]+|channel\/UC[\w-]{22})\/?(?:[?#].*)?$/iu)
      if (y) chaines.add(`https://www.youtube.com/${y[1]}`)
    }
  }
  bilan.chaines = [...chaines]
  // Les profils annoncés en « sameAs » d'abord : ce sont les officiels.
  bilan.profils.sort((a, b) => (a.origine === b.origine ? 0 : a.origine === 'sameAs' ? -1 : 1))
  return bilan
}
