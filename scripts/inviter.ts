// Donne accès à une personne : crée son compte s'il n'existe pas et affiche un lien
// personnel, valable sept jours, pour choisir son mot de passe. Aucun mot de passe
// n'est généré ni transmis. Même chose depuis l'écran : Réglages › Comptes.
//   npm run inviter -- <email> "<Nom>" [--admin]
// Pour un compte existant, le lien sert à choisir un nouveau mot de passe.
import 'dotenv/config'
import { preparerInvitation } from '../src/lib/invitations'
import { prisma } from '../src/lib/prisma'

async function main() {
  const args = process.argv.slice(2)
  const admin = args.includes('--admin')
  const [email, nom] = args.filter((a) => a !== '--admin')
  if (!email) throw new Error('Usage : npm run inviter -- <email> "<Nom>" [--admin]')
  const r = await preparerInvitation({ email, nom, role: admin ? 'admin' : 'membre' })
  console.log(r.nouveau ? `Compte créé pour ${r.compte.email} (${r.compte.role === 'admin' ? 'administrateur' : 'membre'})` : `Compte existant : ${r.compte.email}`)
  console.log(`Lien valable jusqu'au ${r.expire.toLocaleString('fr-FR')} :`)
  console.log(r.lien)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
