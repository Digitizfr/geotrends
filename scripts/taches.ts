// Tâches de fond de GeoTrends, lancées toutes les demi-heures (service « taches » de docker-compose.yml) :
// collecte des réponses, relevés automatiques, lecture des réponses.
//   npm run taches
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { executerTaches } from '../src/lib/taches'

executerTaches()
  .then((journal) => {
    const quand = new Date().toISOString().slice(0, 16).replace('T', ' ')
    for (const ligne of journal) console.log(`${quand} ${ligne}`)
  })
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
