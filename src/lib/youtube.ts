import { cle as cleDe } from './cles'
import { prisma } from './prisma'

/*
 * Vidéos YouTube citées par les IA.
 *
 * Une marque ne se limite pas à son site : quand une IA cite une vidéo de la
 * chaîne de la marque, c'est une citation de la marque. Pour le savoir, on lit
 * la fiche de chaque vidéo citée (chaîne, titre, date, vues) par l'API
 * publique de YouTube. Elle est gratuite (quota quotidien de 10 000 unités,
 * une unité pour 50 vidéos) : rien à inscrire au journal des coûts.
 */

const DOMAINES_YOUTUBE = ['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'youtube-nocookie.com']

const cle = () => cleDe('youtube')

/** Identifiant de la vidéo dans une adresse YouTube, ou null (chaîne, liste, autre site). */
export function idVideoDe(url: string): string | null {
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return null
  }
  const hote = u.hostname.toLowerCase().replace(/^www\./, '')
  if (!DOMAINES_YOUTUBE.includes(hote)) return null
  const valide = (id: string | null | undefined) => (id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null)
  if (hote === 'youtu.be') return valide(u.pathname.split('/')[1])
  if (u.pathname === '/watch') return valide(u.searchParams.get('v'))
  const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?]+)/)
  return valide(m?.[1])
}

type FicheApi = {
  id: string
  snippet?: { channelId?: string; channelTitle?: string; title?: string; publishedAt?: string }
  statistics?: { viewCount?: string }
}

/**
 * Rattache chaque source YouTube à la fiche de sa vidéo, en lisant sur YouTube
 * les fiches encore inconnues. Sans clé YouTube, ne fait rien.
 */
export async function rattacherVideos(): Promise<{ rattachees: number; lues: number }> {
  const sources = await prisma.source.findMany({
    where: { videoYoutubeId: null, domaine: { in: DOMAINES_YOUTUBE } },
    select: { id: true, url: true },
  })
  const parVideo = new Map<string, string[]>()
  for (const s of sources) {
    const id = idVideoDe(s.url)
    if (id) parVideo.set(id, [...(parVideo.get(id) ?? []), s.id])
  }
  if (parVideo.size === 0) return { rattachees: 0, lues: 0 }

  const connues = new Set((await prisma.videoYoutube.findMany({ where: { id: { in: [...parVideo.keys()] } }, select: { id: true } })).map((v) => v.id))
  const aLire = [...parVideo.keys()].filter((id) => !connues.has(id))
  const k = cle()
  let lues = 0
  if (k) {
    for (let i = 0; i < aLire.length; i += 50) {
      const lot = aLire.slice(i, i + 50)
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${lot.join(',')}&key=${k}`, { signal: AbortSignal.timeout(30_000) })
      if (!res.ok) throw new Error(`YouTube : HTTP ${res.status} ${(await res.text()).slice(0, 200)}`)
      const fiches = ((await res.json()) as { items?: FicheApi[] }).items ?? []
      for (const f of fiches) {
        if (!f.snippet?.channelId) continue
        const vues = Number(f.statistics?.viewCount)
        await prisma.videoYoutube.upsert({
          where: { id: f.id },
          create: {
            id: f.id,
            chaineId: f.snippet.channelId,
            chaineNom: f.snippet.channelTitle ?? '',
            titre: f.snippet.title ?? '',
            publieLe: f.snippet.publishedAt ? new Date(f.snippet.publishedAt) : null,
            vues: Number.isFinite(vues) ? vues : null,
          },
          update: {},
        })
        connues.add(f.id)
        lues++
      }
    }
  }

  let rattachees = 0
  for (const [videoId, ids] of parVideo) {
    // Vidéo supprimée, privée, ou clé absente : la source reste sans fiche.
    if (!connues.has(videoId)) continue
    const r = await prisma.source.updateMany({ where: { id: { in: ids } }, data: { videoYoutubeId: videoId } })
    rattachees += r.count
  }
  return { rattachees, lues }
}

/**
 * Retrouve une chaîne YouTube à partir de ce que l'utilisateur a saisi : une
 * adresse (youtube.com/@nom, youtube.com/channel/UC…), un « @nom » ou un
 * identifiant « UC… ». Renvoie null si la chaîne est introuvable ou sans clé.
 */
export async function resoudreChaine(saisie: string): Promise<{ id: string; nom: string } | null> {
  const k = cle()
  const texte = saisie.trim()
  if (!k || !texte) return null
  const id = texte.match(/UC[A-Za-z0-9_-]{22}/)?.[0]
  const pseudo = texte.match(/@([A-Za-z0-9._-]+)/)?.[1] ?? (/^[A-Za-z0-9._-]+$/.test(texte) ? texte : null)
  const filtre = id ? `id=${id}` : pseudo ? `forHandle=${encodeURIComponent('@' + pseudo)}` : null
  if (!filtre) return null
  const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&${filtre}&key=${k}`, { signal: AbortSignal.timeout(20_000) })
  if (!res.ok) return null
  const c = ((await res.json()) as { items?: { id: string; snippet?: { title?: string } }[] }).items?.[0]
  return c ? { id: c.id, nom: c.snippet?.title ?? c.id } : null
}
