import { langueActive } from './i18n/courante'
import { formats } from './i18n/formats'
import { traduire } from './i18n/traduire'

// Noms affichés des fournisseurs, des IA et des types d'appel.
const NOMS: Record<string, string> = {
  dataforseo: 'DataForSEO', anthropic: 'Anthropic', deepseek: 'DeepSeek', openai: 'OpenAI',
  chatgpt: 'ChatGPT', gemini: 'Gemini', google_ai_mode: 'Mode IA de Google', google_ai_overview: 'Aperçus IA de Google',
  claude: 'Claude', perplexity: 'Perplexity', copilot: 'Copilot',
  releve: 'Relevés', analyse: 'Analyse des réponses', suggestion: 'Suggestion de questions',
  classement: 'Classement des sites', etiquettes: 'Étiquettes des questions', faits: 'Vérification des faits', rapport: 'Rapport par e-mail',
  interface: 'Interface', api: 'API',
}

/** Nom affiché d'un fournisseur, d'une IA ou d'un type d'appel, dans la langue de l'interface. */
export const nom = (cle: string) => (NOMS[cle] ? traduire(langueActive(), NOMS[cle]) : cle)

// Les écritures ci-dessous suivent la langue de l'interface (src/lib/i18n) :
// « 0,05 $ » et « 12 nov. » en français, « $0.05 » et « 12 Nov » en anglais.
const f = () => formats(langueActive())

/** Montant en dollars. Tous les fournisseurs facturent en dollars. */
export const usd = (n: number, decimales = 2) => f().usd(n, decimales)

/** Petits montants : 4 décimales sous dix centimes, sinon 2. */
export const usdFin = (n: number) => f().usdFin(n)

/** Nombre écrit dans la langue de l'interface : « 1 234,5 » ou « 1,234.5 ». */
export const nombre = (n: number, decimales?: number) => f().nombre(n, decimales)

/** Date et heure de Paris, ex. « 12/11 à 07:15 ». */
export const dateHeure = (d: Date) => f().dateHeure(d)

/** « fr », « FR » → « français, France ». */
export const langueEtPays = (langue: string, pays: string) => f().langueEtPays(langue, pays)

// ── Écritures courtes, pour les colonnes et les étiquettes de l'outil ───────
const COURTS: Record<string, string> = { google_ai_mode: 'Mode IA', google_ai_overview: 'Aperçus IA' }

/** Nom court d'une IA, pour une tête de colonne : « Mode IA », « Aperçus IA ». */
export const nomCourt = (cle: string) => (COURTS[cle] ? traduire(langueActive(), COURTS[cle]) : nom(cle))

/** Part en pourcentage, sans décimale : 0,256 → « 26 % ». */
export const pct = (x: number | null | undefined, vide?: string) => f().pct(x, vide)

/** Clé du jour à l'heure de Paris : « 2026-11-12 ». */
export function cleJour(d: Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(d)
}

/** Date d'une clé de jour, à midi, pour l'afficher sans glisser d'un jour. */
export const deCleJour = (cle: string) => new Date(`${cle}T12:00:00Z`)

/** « 12 nov. » */
export const jourCourt = (d: Date) => f().jourCourt(d)

/** « 12 nov. 2026 » */
export const jourLong = (d: Date) => f().jourLong(d)

/** « 14 h 02 », à l'heure de Paris. */
export const heure = (d: Date) => f().heure(d)

/** « 1er », « 2e », « 3e »… */
export const ordinal = (n: number) => f().ordinal(n)

/** « 1 relevé », « 3 relevés ». Le pluriel irrégulier se passe en troisième. En anglais, le dictionnaire donne les deux formes. */
export const pluriel = (n: number, mot: string, auPluriel?: string) => f().pluriel(n, mot, auPluriel)

/** Adresse sans protocole ni « www. », coupée si elle est longue. */
export function adresseCourte(url: string, max = 64) {
  const t = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}

/** L'instant présent, en millisecondes. À lire ici plutôt que dans le rendu d'un écran. */
export const maintenant = () => Date.now()
