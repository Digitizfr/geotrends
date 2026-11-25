import { lireMesuresBrutes } from '@/lib/mesures'
import { projetCourant } from '@/lib/projets'
import { construireRapport, rapportEnCourriel } from '@/lib/rapport'
import { lireSession } from '@/lib/session'
import { lireTravail } from '@/lib/travail'

// Aperçu de l'e-mail du lundi, tel qu'il part : la même fonction construit
// l'envoi et cet aperçu. Rien n'est envoyé ici.
export async function GET() {
  if (!(await lireSession())) return new Response('Connexion requise', { status: 401 })
  const projet = await projetCourant()
  const m = projet ? await lireMesuresBrutes(projet.id) : null
  if (!projet || !m) return new Response('Aucun projet', { status: 404 })
  const rapport = await construireRapport(m, await lireTravail(projet.id, m.marque))
  const { html } = rapportEnCourriel(rapport, process.env.BETTER_AUTH_URL || 'https://geotrends.io')
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}
