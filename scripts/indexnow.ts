/*
 * Signale les pages du site public aux moteurs qui suivent le protocole IndexNow
 * (Bing, Yandex, Seznam, Naver…). Gratuit, sans compte. Google ne le suit pas :
 * pour lui, c'est le plan du site déclaré dans la Search Console.
 *
 * À lancer après chaque mise en ligne qui change des pages :
 *   npx tsx scripts/indexnow.ts
 * La clé est publique par nature : le fichier public/<clé>.txt prouve que le
 * site nous appartient.
 */
const CLE = '38ca8a0627792e897e58b3cb76e1524d'
const SITE = 'https://geotrends.io'

async function main() {
  const plan = await (await fetch(`${SITE}/sitemap.xml`)).text()
  const adresses = [...plan.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (adresses.length === 0) throw new Error('Plan du site vide ou injoignable')
  const reponse = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: 'geotrends.io', key: CLE, keyLocation: `${SITE}/${CLE}.txt`, urlList: adresses }),
  })
  console.log(`${adresses.length} adresses envoyées à IndexNow : réponse ${reponse.status} ${reponse.statusText}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
