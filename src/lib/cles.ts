import fs from 'node:fs'
import path from 'node:path'

/*
 * Les clés des fournisseurs, lues à un seul endroit. Réservé au serveur.
 *
 * Chaque clé vient d'une variable d'environnement (le fichier .env de
 * l'installation) ou, en développement, d'un fichier <nom>.key.txt posé à la
 * racine et ignoré par git. Aucune clé n'est jamais affichée ni écrite dans la
 * base : l'écran Réglages dit seulement si elle est en place.
 */

export type Service = 'dataforseo' | 'anthropic' | 'deepseek' | 'youtube' | 'resend'

function lire(variable: string, fichier: string): string | null {
  const valeur = process.env[variable]?.trim()
  if (valeur) return valeur
  const chemin = path.join(process.cwd(), fichier)
  if (fs.existsSync(chemin)) return fs.readFileSync(chemin, 'utf8').trim() || null
  return null
}

/**
 * DataForSEO s'authentifie par « identifiant:mot de passe » encodé en base64.
 * On accepte les deux écritures : DATAFORSEO_LOGIN et DATAFORSEO_PASSWORD tels
 * que le compte les affiche (le plus simple), ou DATAFORSEO_AUTH déjà encodé.
 */
function dataforseo(): string | null {
  const identifiant = process.env.DATAFORSEO_LOGIN?.trim()
  const motDePasse = process.env.DATAFORSEO_PASSWORD?.trim()
  if (identifiant && motDePasse) return Buffer.from(`${identifiant}:${motDePasse}`).toString('base64')
  return lire('DATAFORSEO_AUTH', 'dataforseo.key.txt')
}

/** La clé d'un service, ou null si elle n'est pas installée. */
export function cle(service: Service): string | null {
  switch (service) {
    case 'dataforseo': return dataforseo()
    case 'anthropic': return lire('ANTHROPIC_API_KEY', 'anthropic.key.txt')
    case 'deepseek': return lire('DEEPSEEK_API_KEY', 'deepseek.key.txt')
    case 'youtube': return lire('YOUTUBE_API_KEY', 'youtube.key.txt')
    case 'resend': return lire('RESEND_API_KEY', 'resend.key.txt')
  }
}

export const clePresente = (service: Service) => !!cle(service)

/** La clé d'un service dont on ne peut pas se passer pour l'appel en cours : erreur claire si elle manque. */
export function cleRequise(service: Service): string {
  const valeur = cle(service)
  if (valeur) return valeur
  const quoi: Record<Service, string> = {
    dataforseo: 'Identifiants DataForSEO introuvables : renseignez DATAFORSEO_LOGIN et DATAFORSEO_PASSWORD dans le fichier .env',
    anthropic: 'Clé Anthropic introuvable : renseignez ANTHROPIC_API_KEY dans le fichier .env',
    deepseek: 'Clé DeepSeek introuvable : renseignez DEEPSEEK_API_KEY dans le fichier .env',
    youtube: 'Clé YouTube introuvable : renseignez YOUTUBE_API_KEY dans le fichier .env',
    resend: 'Clé Resend introuvable : renseignez RESEND_API_KEY dans le fichier .env',
  }
  throw new Error(quoi[service])
}

/**
 * Le petit modèle qui lit les réponses (marques nommées, rang, ton), étiquette
 * les questions et classe les sites : DeepSeek ou Claude Haiku. ANALYSE_FOURNISSEUR
 * l'impose ; sinon on prend celui dont la clé est en place, DeepSeek d'abord
 * (le moins cher).
 */
export function fournisseurAnalyse(): 'anthropic' | 'deepseek' {
  const impose = process.env.ANALYSE_FOURNISSEUR?.trim()
  if (impose === 'anthropic' || impose === 'deepseek') return impose
  if (clePresente('deepseek')) return 'deepseek'
  if (clePresente('anthropic')) return 'anthropic'
  return 'deepseek'
}

/** Vrai si le petit modèle peut travailler : la clé de son fournisseur est en place. */
export const analysePossible = () => clePresente(fournisseurAnalyse())
