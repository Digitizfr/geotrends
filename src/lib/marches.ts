import { langueActive } from './i18n/courante'

// ── Pays et langues proposés à la création d'un projet ──────────────────────
// Le produit est multi-pays : les noms viennent du navigateur (Intl), seuls
// les codes sont listés ici. La France et le français restent en tête.

// Seulement les pays que le fournisseur des relevés d'interface sait viser
// (CODES_PAYS dans fournisseurs/dataforseo.ts) : un autre pays ferait échouer
// ChatGPT, Gemini et Google à l'envoi. Ajouter un pays ici ET dans CODES_PAYS,
// après vérification chez le fournisseur.
export const PAYS = ['FR', 'BE', 'CH', 'CA', 'LU', 'US', 'GB', 'DE', 'ES', 'IT']
export const LANGUES = ['fr', 'en', 'de', 'es', 'it', 'pt', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'ar', 'ja']

const majuscule = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)
// Les noms s'écrivent dans la langue de l'interface (pas dans celle du projet).
export const nomPays = (code: string) => new Intl.DisplayNames([langueActive()], { type: 'region' }).of(code.toUpperCase()) ?? code
export const nomLangue = (code: string) => majuscule(new Intl.DisplayNames([langueActive()], { type: 'language' }).of(code.toLowerCase()) ?? code)
