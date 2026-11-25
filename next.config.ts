import type { NextConfig } from 'next'

// Premiers segments des adresses de l'outil interne (src/app/(app)), de la connexion et de l'API.
const OUTIL = ['vue', 'questions', 'reponses', 'concurrents', 'sources', 'videos', 'google', 'actions', 'faits', 'rapport', 'audit', 'projets', 'reglages', 'admin', 'releves', 'visibilite', 'couts', 'connexion', 'invitation', 'partage', 'api']

const nextConfig: NextConfig = {
  // En-têtes de durcissement. HSTS ne s'active qu'en production (HTTPS
  // derrière Caddy) : en dev, il empoisonnerait localhost dans le navigateur.
  // Les coûts ont déménagé dans la rubrique Administration (12/11/2026).
  async redirects() {
    return [{ source: '/couts', destination: '/admin/couts', permanent: false }]
  },
  async headers() {
    const base = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]
    const prod = [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
    return [
      { source: '/(.*)', headers: process.env.NODE_ENV === 'production' ? [...base, ...prod] : base },
      // Le site public est indexé (18/11/2026) ; l'outil interne, la connexion et l'API ne le sont jamais.
      { source: `/:outil(${OUTIL.join('|')})/:reste*`, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ]
  },
}

export default nextConfig
