// Crée (ou réinitialise) un compte interne. L'inscription publique est fermée :
// c'est le seul moyen d'ouvrir un accès.
//   npm run creer-compte -- <email> "<Nom>" [--admin]
// --admin donne accès à la rubrique Administration (coûts).
// Le mot de passe est généré et écrit dans un fichier local ignoré par git.
import 'dotenv/config'
import { randomBytes } from 'node:crypto'
import { writeFileSync, chmodSync } from 'node:fs'
import { auth } from '../src/lib/auth'
import { prisma } from '../src/lib/prisma'

async function main() {
  const args = process.argv.slice(2)
  const admin = args.includes('--admin')
  const [email, nom] = args.filter((a) => a !== '--admin')
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Usage : npm run creer-compte -- <email> "<Nom>"')
  const motDePasse = randomBytes(15).toString('base64url')
  const ctx = await auth.$context
  const hash = await ctx.password.hash(motDePasse)

  const existant = await ctx.internalAdapter.findUserByEmail(email, { includeAccounts: false })
  if (existant) {
    await ctx.internalAdapter.updatePassword(existant.user.id, hash)
    console.log(`Compte existant : mot de passe réinitialisé pour ${email}`)
  } else {
    const user = await ctx.internalAdapter.createUser({ email, name: nom || email.split('@')[0], emailVerified: true }, { method: 'admin' })
    await ctx.internalAdapter.linkAccount({ userId: user.id, providerId: 'credential', accountId: user.id, password: hash })
    console.log(`Compte créé pour ${email}`)
  }
  await prisma.user.update({ where: { email }, data: { role: admin ? 'admin' : 'membre' } })
  console.log(admin ? 'Rôle : administrateur' : 'Rôle : membre')
  const fichier = `compte-${email.split('@')[0].replace(/[^a-z0-9]/gi, '-')}.key.txt`
  writeFileSync(fichier, `Adresse : ${email}\nMot de passe : ${motDePasse}\n`)
  chmodSync(fichier, 0o600)
  console.log(`Identifiants écrits dans ${fichier} (hors dépôt)`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
