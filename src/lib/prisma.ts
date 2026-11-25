import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

// Un seul client pour toute l'app : en dev, le rechargement à chaud de Next
// recrée les modules à chaque modification — sans ce cache global, chaque
// sauvegarde ouvrirait une nouvelle connexion Postgres jusqu'à épuisement.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function makeClient() {
  // Échouer tôt et clairement : sans ce garde, pg se replierait en silence
  // sur ses défauts (localhost, utilisateur courant) et l'erreur n'arriverait
  // qu'à la première requête, incompréhensible.
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquante dans .env')
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? makeClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
