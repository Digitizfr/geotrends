import { cle as cleDe } from './cles'
import { lireMesuresBrutes } from './mesures'
import { prisma } from './prisma'
import { construireRapport, rapportEnCourriel } from './rapport'
import { lireTravail } from './travail'

/*
 * Envoi d'e-mails par Resend. Il faut deux choses, toutes deux dans le fichier
 * .env : une clé (RESEND_API_KEY) et une adresse d'expédition sur un domaine
 * vérifié chez Resend (RAPPORT_EXPEDITEUR, par exemple
 * « GeoTrends <rapport@exemple.fr> »). L'offre gratuite de Resend suffit
 * (3 000 e-mails par mois) : l'envoi n'est pas un appel payant.
 *
 * Sans ces deux réglages, l'envoi est simplement indisponible, et l'écran le dit.
 */

/** Adresse d'expédition : elle doit appartenir à un domaine vérifié chez Resend. */
export const EXPEDITEUR = process.env.RAPPORT_EXPEDITEUR?.trim() || ''

const cleResend = () => cleDe('resend')

/** Vrai si la clé d'envoi et l'adresse d'expédition sont en place. */
export const envoiPossible = () => !!cleResend() && !!EXPEDITEUR

export async function envoyerCourriel(c: { a: string[]; sujet: string; texte: string; html: string }): Promise<{ reussi: boolean; erreur?: string }> {
  const cle = cleResend()
  if (!cle) return { reussi: false, erreur: 'Clé Resend absente.' }
  if (!EXPEDITEUR) return { reussi: false, erreur: 'Adresse d’expédition absente (RAPPORT_EXPEDITEUR).' }
  if (c.a.length === 0) return { reussi: false, erreur: 'Aucun destinataire.' }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: EXPEDITEUR, to: c.a, subject: c.sujet, text: c.texte, html: c.html }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return { reussi: false, erreur: `Resend ${res.status} : ${(await res.text()).slice(0, 200)}` }
    return { reussi: true }
  } catch (e) {
    return { reussi: false, erreur: e instanceof Error ? e.message : String(e) }
  }
}

// ── Le rapport du lundi ─────────────────────────────────────────────────────

export const cleRapportAuto = (projetId: string) => `rapport_email:${projetId}`
export const cleRapportEnvoye = (projetId: string) => `rapport_envoye:${projetId}`

/** Réglage de l'envoi hebdomadaire d'un projet : coupé par défaut. */
export async function lireEnvoiRapport(projetId: string): Promise<{ actif: boolean; dernier: Date | null }> {
  const lignes = await prisma.reglage.findMany({ where: { cle: { in: [cleRapportAuto(projetId), cleRapportEnvoye(projetId)] } } })
  const dernier = lignes.find((l) => l.cle === cleRapportEnvoye(projetId))?.valeur
  return { actif: lignes.find((l) => l.cle === cleRapportAuto(projetId))?.valeur === '1', dernier: dernier && !Number.isNaN(Date.parse(dernier)) ? new Date(dernier) : null }
}

/** Les destinataires du rapport : tous les comptes de l'outil. */
export async function destinatairesDuRapport(): Promise<string[]> {
  return (await prisma.user.findMany({ orderBy: { createdAt: 'asc' }, select: { email: true } })).map((u) => u.email)
}

/** Construit le rapport d'un projet et l'envoie aux adresses données. */
export async function envoyerRapport(projetId: string, a: string[]): Promise<{ reussi: boolean; erreur?: string }> {
  const m = await lireMesuresBrutes(projetId)
  if (!m) return { reussi: false, erreur: 'Projet introuvable.' }
  const rapport = await construireRapport(m, await lireTravail(projetId, m.marque))
  const base = process.env.BETTER_AUTH_URL || 'https://geotrends.io'
  return envoyerCourriel({ a, ...rapportEnCourriel(rapport, base) })
}

const JOUR = 86_400_000

/**
 * Tâche de fond : envoie le rapport des projets qui l'ont demandé, le lundi à
 * partir de 8 h (heure de Paris), une fois par semaine. Si un lundi a été
 * manqué, l'envoi part au passage suivant.
 */
export async function envoyerRapportsDus(maintenant = new Date()): Promise<string[]> {
  const journal: string[] = []
  if (!envoiPossible()) return journal
  const paris = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', hourCycle: 'h23' }).formatToParts(maintenant)
  const lundi = paris.find((p) => p.type === 'weekday')?.value === 'Mon' && Number(paris.find((p) => p.type === 'hour')?.value) >= 8
  for (const p of await prisma.projet.findMany({ where: { archive: false }, select: { id: true, nom: true } })) {
    const { actif, dernier } = await lireEnvoiRapport(p.id)
    if (!actif) continue
    const ecoule = dernier ? maintenant.getTime() - dernier.getTime() : Infinity
    // Le lundi, si rien n'est parti depuis six jours ; sinon, seulement si un lundi a été manqué.
    if (!((lundi && ecoule > 6 * JOUR) || (dernier && ecoule > 8 * JOUR))) continue
    const res = await envoyerRapport(p.id, await destinatairesDuRapport())
    if (res.reussi) await prisma.reglage.upsert({ where: { cle: cleRapportEnvoye(p.id) }, create: { cle: cleRapportEnvoye(p.id), valeur: maintenant.toISOString() }, update: { valeur: maintenant.toISOString() } })
    journal.push(res.reussi ? `${p.nom} : rapport de la semaine envoyé.` : `${p.nom} : envoi du rapport en échec (${res.erreur}).`)
  }
  return journal
}
