// Commandes d'entretien, pour rejouer à la main ce que l'outil fait tout seul.
//   npm run entretien -- collecter   lit les réponses prêtes des relevés en attente (gratuit)
//   npm run entretien -- extraire    rejoue l'extraction (marques, recherches, résultats Google) depuis les réponses brutes (gratuit)
//   npm run entretien -- videos      rattache les vidéos YouTube citées à leur chaîne (gratuit)
//   npm run entretien -- lire        fait lire par le petit modèle les réponses pas encore lues (PAYANT, moins d'un millième de dollar par réponse)
// Avec Docker : docker compose exec app npm run entretien -- collecter
import 'dotenv/config'
import { analyserEnAttente } from '../src/lib/analyse'
import { extraireTout } from '../src/lib/extraction'
import { prisma } from '../src/lib/prisma'
import { collecterReleves } from '../src/lib/releves'
import { rattacherVideos } from '../src/lib/youtube'

async function main() {
  const [commande] = process.argv.slice(2)
  if (commande === 'collecter') {
    const b = await collecterReleves()
    console.log(`Réponses reçues : ${b.recus}. Sans réponse d'IA : ${b.vides}. Échecs : ${b.echecs}. Encore en attente : ${b.enAttente}.`)
  } else if (commande === 'videos') {
    const v = await rattacherVideos()
    console.log(`Sources rattachées à une vidéo : ${v.rattachees}. Fiches lues sur YouTube : ${v.lues}.`)
  } else if (commande === 'lire') {
    const a = await analyserEnAttente()
    console.log(`Réponses lues : ${a.lues}. Échecs : ${a.echecs}. Prix : ${a.coutUsd.toFixed(4)} $.`)
  } else if (commande === 'extraire') console.log(`Extraction rejouée sur ${await extraireTout()} relevés.`)
  else throw new Error('Usage : npm run entretien -- collecter | extraire | videos | lire')
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
