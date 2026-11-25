import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { prisma } from './prisma'

// Échouer tôt : sans secret, Better Auth se replierait sur son secret par
// défaut, public dans le code de la lib, donc cookies forgeables.
if (!process.env.BETTER_AUTH_SECRET) throw new Error('BETTER_AUTH_SECRET manquante dans .env')
if (!process.env.BETTER_AUTH_URL) throw new Error('BETTER_AUTH_URL manquante dans .env')

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  rateLimit: {
    enabled: process.env.NODE_ENV === 'production',
    window: 60,
    max: 30,
    customRules: { '/sign-in/email': { window: 60, max: 10 } },
  },
  advanced: {
    // Derrière Caddy, l'IP du client vit dans X-Forwarded-For.
    ipAddress: { ipAddressHeaders: ['x-forwarded-for'] },
  },
  user: {
    // Le rôle se choisit à l'invitation (Réglages › Comptes), jamais depuis le
    // navigateur de la personne (input: false).
    // La langue de l'interface (« fr » ou « en ») se choisit dans Réglages ; vide : français.
    additionalFields: {
      role: { type: 'string', defaultValue: 'membre', input: false },
      langue: { type: 'string', required: false, input: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    // Personne ne s'inscrit seul. Le premier compte se crée au premier lancement
    // (src/lib/premier-compte.ts), les suivants par invitation (src/lib/invitations.ts).
    disableSignUp: true,
  },
  // Pose les cookies de session depuis les actions serveur de Next.
  plugins: [nextCookies()],
})
