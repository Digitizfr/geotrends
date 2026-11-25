import { prisma } from './prisma'
import { domaineDe } from './fournisseurs/types'

/*
 * Extraction : ce que la réponse brute d'un relevé contient déjà, rangé dans
 * des tables faciles à lire. Aucun appel payant : tout vient de la colonne
 * `brut`, et l'extraction se rejoue à volonté.
 *
 * - Marques nommées et recherches lancées : ChatGPT seulement (DataForSEO ne
 *   les renvoie pas pour Gemini ni Google). Claude donne ses recherches.
 * - Résultats classiques de Google et « autres questions posées » : relevés
 *   avec les Aperçus IA.
 */

type Obj = Record<string, unknown>
const obj = (v: unknown): Obj => (v && typeof v === 'object' ? (v as Obj) : {})
const liste = (v: unknown): Obj[] => (Array.isArray(v) ? v.map(obj) : [])
const texte = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null)

export async function extraire(releveId: string) {
  const r = await prisma.releve.findUnique({ where: { id: releveId }, select: { id: true, moteur: true, texte: true, brut: true } })
  if (!r) return
  const brut = obj(r.brut)

  // Marques : le nom est dans « markdown », la description dans « title ».
  // Le rang suit l'ordre d'apparition du nom dans le texte de la réponse.
  const reponse = (r.texte ?? '').toLowerCase()
  const vues = new Set<string>()
  const marques = liste(brut.brand_entities)
    .map((m, i) => ({ nom: texte(m.markdown)?.replace(/[*_`]/g, '') ?? '', description: texte(m.title), categorie: texte(m.category), ordre: i }))
    .filter((m) => m.nom && !vues.has(m.nom.toLowerCase()) && vues.add(m.nom.toLowerCase()))
    .map((m) => ({ ...m, place: reponse.indexOf(m.nom.toLowerCase()) }))
    .sort((a, b) => (a.place < 0 ? Infinity : a.place) - (b.place < 0 ? Infinity : b.place) || a.ordre - b.ordre)

  // Recherches lancées par l'IA : « fan_out_queries » (ChatGPT) ou « requetes » (Claude).
  const recherches = [...new Set([...(Array.isArray(brut.fan_out_queries) ? brut.fan_out_queries : []), ...(Array.isArray(brut.requetes) ? brut.requetes : [])].map(texte).filter((t): t is string => !!t))]

  // Page de résultats Google (relevé des Aperçus IA uniquement).
  const elements = r.moteur === 'google_ai_overview' ? liste(brut.items) : []
  const resultats = elements
    .filter((e) => e.type === 'organic' && texte(e.url))
    .map((e, i) => ({ rang: typeof e.rank_group === 'number' ? e.rank_group : i + 1, url: texte(e.url)!, domaine: texte(e.domain)?.toLowerCase().replace(/^www\./, '') ?? domaineDe(texte(e.url)!), titre: texte(e.title) }))
  const associees = elements
    .filter((e) => e.type === 'people_also_ask')
    .flatMap((e) => liste(e.items).map((q) => texte(q.title)))
    .filter((t): t is string => !!t)

  await prisma.$transaction([
    prisma.mention.deleteMany({ where: { releveId, origine: 'fournisseur' } }),
    prisma.recherche.deleteMany({ where: { releveId } }),
    prisma.resultatGoogle.deleteMany({ where: { releveId } }),
    prisma.questionAssociee.deleteMany({ where: { releveId } }),
    prisma.mention.createMany({ data: marques.map((m, i) => ({ releveId, nom: m.nom, description: m.description, categorie: m.categorie, rang: i + 1, origine: 'fournisseur' })) }),
    prisma.recherche.createMany({ data: recherches.map((t, i) => ({ releveId, texte: t, position: i + 1 })) }),
    prisma.resultatGoogle.createMany({ data: resultats.map((x) => ({ releveId, ...x })) }),
    prisma.questionAssociee.createMany({ data: associees.map((t, i) => ({ releveId, texte: t, position: i + 1 })) }),
  ])
}

/** Rejoue l'extraction sur tous les relevés qui ont une réponse brute. */
export async function extraireTout(): Promise<number> {
  const releves = await prisma.releve.findMany({ where: { statut: { in: ['recu', 'vide'] } }, select: { id: true } })
  for (const r of releves) await extraire(r.id)
  return releves.length
}
