import { LOCALES, type Langue } from './langues'
import { traduire } from './traduire'

/*
 * Écriture des nombres, des montants et des dates dans la langue de
 * l'interface. Les dates sont toujours à l'heure de Paris : c'est celle des
 * relevés. Utilisable côté serveur comme dans un composant client.
 */
export function formats(langue: Langue) {
  const locale = LOCALES[langue]
  const fr = langue === 'fr'
  const date = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: 'Europe/Paris', ...options })

  const nombre = (n: number, decimales?: number) => n.toLocaleString(locale, decimales === undefined ? undefined : { minimumFractionDigits: decimales, maximumFractionDigits: decimales })
  /** Montant en dollars : « 0,05 $ » en français, « $0.05 » en anglais. */
  const usd = (n: number, decimales = 2) => (fr ? `${nombre(n, decimales)} $` : `${n < 0 ? '−' : ''}$${nombre(Math.abs(n), decimales)}`)
  const pluriel = (n: number, mot: string, auPluriel?: string) => {
    if (!fr) {
      // Le dictionnaire anglais porte les deux formes : « réponse » → « answer|answers ».
      const [un, plusieurs] = traduire('en', mot, {}).split('|')
      return `${nombre(n)} ${n === 1 ? un : (plusieurs ?? `${un}s`)}`
    }
    // Sans pluriel fourni : le premier mot prend un « s », et le second aussi s'il n'y en a que deux (nom et adjectif).
    const mots = mot.split(' ')
    const accorde = mots.map((m, i) => (i === 0 || (i === 1 && mots.length === 2) ? `${m}s` : m)).join(' ')
    return `${nombre(n)} ${n > 1 ? (auPluriel ?? accorde) : mot}`
  }
  return {
    langue,
    locale,
    nombre,
    usd,
    /** Petits montants : 4 décimales sous dix centimes, sinon 2. */
    usdFin: (n: number) => usd(n, n !== 0 && Math.abs(n) < 0.1 ? 4 : 2),
    /** Part en pourcentage, sans décimale : 0,256 → « 26 % » (« 26% » en anglais). */
    pct: (x: number | null | undefined, vide = traduire(langue, 'n.c.')) => (x === null || x === undefined || !Number.isFinite(x) ? vide : fr ? `${Math.round(x * 100)} %` : `${Math.round(x * 100)}%`),
    /** Pourcentage déjà calculé (0 à 100). */
    pc: (v: number) => (fr ? `${Math.round(v)} %` : `${Math.round(v)}%`),
    /** « 12 nov. » / « 12 Nov » */
    jourCourt: (d: Date) => date({ day: 'numeric', month: 'short' }).format(d),
    /** « 12 nov. 2026 » / « 12 Nov 2026 » */
    jourLong: (d: Date) => date({ day: 'numeric', month: 'short', year: 'numeric' }).format(d),
    /** « 12/11 à 07:15 » / « 12/11, 07:15 » */
    dateHeure: (d: Date) => {
      const texte = date({ day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
      return fr ? texte.replace(' ', ' à ') : texte
    },
    /** « 14 h 02 » / « 14:02 » */
    heure: (d: Date) => {
      const texte = date({ hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
      return fr ? texte.replace(':', ' h ') : texte
    },
    /** « 1er », « 2e » / « 1st », « 2nd », « 3rd », « 4th » */
    ordinal: (n: number) => {
      if (fr) return n === 1 ? '1er' : `${n}e`
      const reste = n % 100
      const fin = reste >= 11 && reste <= 13 ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th')
      return `${n}${fin}`
    },
    pluriel,
    /** « fr », « FR » → « français, France » / « French, France ». */
    langueEtPays: (codeLangue: string, pays: string) => {
      const l = new Intl.DisplayNames([langue], { type: 'language' }).of(codeLangue.toLowerCase()) ?? codeLangue
      const p = new Intl.DisplayNames([langue], { type: 'region' }).of(pays.toUpperCase()) ?? pays
      return `${l}, ${p}`
    },
  }
}

export type Formats = ReturnType<typeof formats>
