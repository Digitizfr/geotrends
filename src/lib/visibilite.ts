import { prisma } from './prisma'
import { MOTEURS } from './fournisseurs/types'
import { estALaMarque, estDuSite, presence, type Marque } from './releves'

/*
 * Synthèse d'un projet, calculée sur le dernier relevé de chaque question par
 * chaque IA. Aucun appel payant : tout vient de la base.
 *
 * Règle d'honnêteté : les relevés d'interface et ceux d'API (Claude) ne sont
 * jamais additionnés. Chaque ligne « par IA » ne porte qu'une méthode, et les
 * classements de sources comptent Claude dans une colonne à part.
 */
export async function lireVisibilite(projetId: string, marque: Marque) {
  const questions = await prisma.question.findMany({
    where: { projetId, archive: false },
    orderBy: { ordre: 'asc' },
    select: {
      id: true,
      texte: true,
      releves: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, moteur: true, methode: true, statut: true, texte: true, modele: true, analyseLe: true,
          sources: { select: { url: true, domaine: true, role: true, titre: true, videoYoutube: { select: { chaineId: true } } } },
          mentions: { orderBy: { rang: 'asc' }, select: { nom: true, description: true, rang: true, origine: true, ton: true } },
          recherches: { orderBy: { position: 'asc' }, select: { texte: true } },
          resultatsGoogle: { orderBy: { rang: 'asc' }, select: { rang: true, domaine: true, url: true } },
          questionsAssociees: { orderBy: { position: 'asc' }, select: { texte: true } },
        },
      },
    },
  })
  // Dernier relevé de chaque IA pour chaque question.
  const releves = questions.flatMap((q) => {
    const vus = new Set<string>()
    return q.releves.filter((r) => !vus.has(r.moteur) && vus.add(r.moteur)).map((r) => ({ ...r, question: { id: q.id, texte: q.texte } }))
  })
  const recus = releves.filter((r) => r.statut === 'recu')

  // Marques d'une réponse : celles lues par notre analyse quand elle a eu
  // lieu (toutes les IA), sinon celles renvoyées par le fournisseur (ChatGPT).
  const marquesDe = (r: (typeof releves)[number]) => {
    const lues = r.mentions.filter((m) => m.origine === 'analyse')
    return r.analyseLe || lues.length ? lues : r.mentions
  }
  const nomMarque = marque.nom.toLowerCase()
  const rangDe = (r: (typeof releves)[number]) => {
    const i = marquesDe(r).findIndex((m) => m.nom.toLowerCase().includes(nomMarque))
    return i < 0 ? null : i + 1
  }

  // ── Par IA ────────────────────────────────────────────────────────────────
  const parMoteur = MOTEURS.map((moteur) => {
    const tous = releves.filter((r) => r.moteur === moteur)
    const reponses = tous.filter((r) => r.statut === 'recu')
    const p = reponses.map((r) => presence(r.texte, r.sources, marque))
    return {
      moteur,
      methode: tous[0]?.methode ?? null,
      modeles: [...new Set(reponses.map((r) => r.modele).filter(Boolean))] as string[],
      envoyes: tous.length,
      reponses: reponses.length,
      vides: tous.filter((r) => r.statut === 'vide').length,
      site: p.filter((x) => x.citeeSite).length,
      video: p.filter((x) => !x.citeeSite && x.citeeYoutube).length,
      nom: p.filter((x) => !x.citeeSite && !x.citeeYoutube && x.mentionnee).length,
      lues: p.filter((x) => x.consultee).length,
      sourcesCitees: reponses.reduce((n, r) => n + r.sources.filter((s) => s.role === 'citee').length, 0),
      rangs: reponses.map(rangDe).filter((x): x is number => x !== null),
      analysees: reponses.filter((r) => r.analyseLe).length,
    }
  }).filter((m) => m.envoyes > 0)

  // ── Marques nommées (repérées par le fournisseur : ChatGPT seulement) ─────
  const marques = new Map<string, { nom: string; description: string | null; reponses: number; api: number; rangs: number[]; premiere: number; tons: string[]; questions: Set<string> }>()
  for (const r of recus) {
    for (const [i, m] of marquesDe(r).entries()) {
      const cle = m.nom.toLowerCase()
      const x = marques.get(cle) ?? { nom: m.nom, description: m.description, reponses: 0, api: 0, rangs: [], premiere: 0, tons: [], questions: new Set<string>() }
      // Interface et API ne s'additionnent jamais : Claude est compté à part.
      if (r.methode === 'api') x.api++
      else {
        x.reponses++
        x.rangs.push(i + 1)
        if (i === 0) x.premiere++
        if (m.ton) x.tons.push(m.ton)
        x.questions.add(r.question.texte)
      }
      marques.set(cle, x)
    }
  }
  const marquesNommees = [...marques.values()]
    .map((m) => ({
      nom: m.nom,
      description: m.description,
      reponses: m.reponses,
      api: m.api,
      premiere: m.premiere,
      rangMoyen: m.rangs.length ? m.rangs.reduce((a, b) => a + b, 0) / m.rangs.length : null,
      positifs: m.tons.filter((t) => t === 'positif').length,
      negatifs: m.tons.filter((t) => t === 'negatif').length,
      questions: [...m.questions],
      aNous: m.nom.toLowerCase().includes(nomMarque),
    }))
    .sort((a, b) => b.reponses - a.reponses || b.api - a.api || (a.rangMoyen ?? 99) - (b.rangMoyen ?? 99) || a.nom.localeCompare(b.nom))
  const reponsesAvecMarques = recus.filter((r) => r.methode !== 'api' && marquesDe(r).length > 0).length
  const nonAnalysees = recus.filter((r) => !r.analyseLe).length

  // ── Sources les plus citées ───────────────────────────────────────────────
  const domaines = new Map<string, { domaine: string; interface: Set<string>; api: Set<string>; moteurs: Set<string>; aNous: boolean }>()
  for (const r of recus) {
    for (const s of r.sources) {
      if (s.role !== 'citee' || !s.domaine) continue
      const x = domaines.get(s.domaine) ?? { domaine: s.domaine, interface: new Set<string>(), api: new Set<string>(), moteurs: new Set<string>(), aNous: estDuSite(s.domaine, marque) }
      if (r.methode === 'api') x.api.add(r.id)
      else {
        x.interface.add(r.id)
        x.moteurs.add(r.moteur)
      }
      domaines.set(s.domaine, x)
    }
  }
  const sourcesCitees = [...domaines.values()]
    .map((d) => ({ domaine: d.domaine, reponses: d.interface.size, moteurs: [...d.moteurs], api: d.api.size, aNous: d.aNous }))
    .sort((a, b) => b.reponses - a.reponses || b.api - a.api || a.domaine.localeCompare(b.domaine))

  // ── Aperçus IA comparés aux 10 premiers résultats de Google ───────────────
  const apercus = releves
    .filter((r) => r.moteur === 'google_ai_overview' && (r.statut === 'recu' || r.statut === 'vide'))
    .map((r) => {
      const top = r.resultatsGoogle
      const domainesTop = new Set(top.map((t) => t.domaine))
      const citees = [...new Set(r.sources.filter((s) => s.role === 'citee').map((s) => s.domaine))]
      const nous = top.find((t) => estDuSite(t.domaine, marque))
      return {
        question: r.question,
        affiche: r.statut === 'recu',
        sources: citees.length,
        sourcesDansTop: citees.filter((d) => domainesTop.has(d)).length,
        resultats: top.length,
        notreRang: nous?.rang ?? null,
        notrePage: nous?.url ?? null,
        cites: r.statut === 'recu' && r.sources.some((s) => s.role === 'citee' && estALaMarque(s, marque)),
      }
    })

  // ── Recherches lancées par les IA ─────────────────────────────────────────
  const recherches = recus.flatMap((r) => r.recherches.map((x) => ({ texte: x.texte, moteur: r.moteur, question: r.question })))

  // ── Autres questions posées (Google) : idées de questions à suivre ────────
  const suivies = new Set(questions.map((q) => q.texte.toLowerCase()))
  const idees = new Map<string, { texte: string; vuPour: string[] }>()
  for (const r of releves) {
    for (const q of r.questionsAssociees) {
      const cle = q.texte.toLowerCase()
      if (suivies.has(cle)) continue
      const x = idees.get(cle) ?? { texte: q.texte, vuPour: [] }
      x.vuPour.push(r.question.texte)
      idees.set(cle, x)
    }
  }

  return { nbQuestions: questions.length, parMoteur, marquesNommees, reponsesAvecMarques, nonAnalysees, analysees: recus.length - nonAnalysees, sourcesCitees, apercus, recherches, questionsAssociees: [...idees.values()] }
}
