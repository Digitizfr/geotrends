import { tr } from './i18n/courante'
import { prisma } from './prisma'
import { nom as nomIA } from './libelles'
import { estALaMarque, estDuSite, type Marque } from './releves'
import { libelleType, lireSites, typeCertain, type TypeLu } from './sites'

/*
 * Liste de travail d'un projet (page Actions) : ce qu'il faut faire pour
 * entrer dans les réponses des IA, tiré des relevés. Aucun appel payant.
 *
 * Cinq familles de lignes :
 *  - « reformuler » : une page à nous, déjà trouvée (lue par l'IA, ou classée
 *    dans les dix premiers de Google) mais pas citée. Le gain le plus rapide.
 *  - « apparaitre » : une page d'un autre site, citée par les IA sur nos
 *    questions, où il faut obtenir une place.
 *  - « video » : une question où les IA citent des vidéos, aucune de nous.
 *  - « referencement » : une question avec un Aperçu IA où notre site n'est
 *    pas dans les dix premiers résultats de Google.
 *  - « fait » : une réponse qui contredit un fait vérifié sur la marque.
 *
 * Seuls les relevés d'interface comptent ici (ce que voit l'internaute), sauf
 * pour les faits faux : une erreur dite par l'API de Claude est signalée aussi,
 * et la ligne le précise.
 */

export type Famille = 'reformuler' | 'apparaitre' | 'video' | 'referencement' | 'fait'
export type Etat = 'a_faire' | 'en_cours' | 'fait' | 'ecarte'

export type Ligne = {
  cle: string
  famille: Famille
  titre: string
  detail: string
  /** Adresse à ouvrir (la page visée), le cas échéant. */
  lien: string | null
  /** Questions qui servent de preuve : un clic ouvre les réponses relevées. */
  preuves: { id: string; texte: string }[]
  /** Poids de 1 à 5 : nombre de réponses et d'IA concernées. */
  gain: number
  etat: Etat
  /** La preuve en chiffres, quand elle se compte : réponses et IA concernées. */
  nbReponses?: number
  nbMoteurs?: number
  /** Ligne ajoutée à la main depuis l'écran Sources : elle reste dans la liste hors de la sélection automatique. */
  ajoutee: boolean
  /** Date du dernier changement d'état, s'il y en a eu un. */
  majLe: Date | null
  /** Jour où la ligne est passée à « fait ». */
  faitLe: Date | null
  /** Note libre de l'utilisateur. */
  note: string | null
  /** Type du site visé, pour une page « où apparaître ». */
  type?: TypeLu
}

/** Les sites où une place se demande : ils passent devant les autres. */
const RECHERCHES: TypeLu[] = ['comparatif', 'media', 'annuaire']
const PEU_UTILES: TypeLu[] = ['officiel', 'boutique', 'autre']

function consigneDe(type: TypeLu, domaine: string) {
  switch (type) {
    case 'comparatif': return { titre: tr('Entrer dans le comparatif de {site}', { site: domaine }), conseil: tr('Écrivez à son auteur pour y figurer, ou proposez-lui de tester votre offre.') }
    case 'annuaire': return { titre: tr('Se faire référencer sur l’annuaire {site}', { site: domaine }), conseil: tr('Créez ou complétez votre fiche sur cet annuaire.') }
    case 'media': return { titre: tr('Obtenir une mention dans {site}', { site: domaine }), conseil: tr('Proposez à la rédaction un avis d’expert, un chiffre ou un test de votre offre.') }
    case 'blog': return { titre: tr('Proposer un ajout à l’article de {site}', { site: domaine }), conseil: tr('Écrivez à son auteur : une mise à jour de l’article peut vous y faire entrer.') }
    case 'forum':
    case 'social': return { titre: tr('Répondre dans la discussion citée sur {site}', { site: domaine }), conseil: tr('Répondez dans le fil s’il est encore ouvert, avec un avis utile et signé.') }
    default: return { titre: tr('Obtenir une place sur {site}', { site: domaine }), conseil: tr('Demandez à y figurer, ou proposez un test de votre offre à son auteur.') }
  }
}

const YOUTUBE = ['youtube.com', 'm.youtube.com', 'youtu.be']
const gainDe = (reponses: number, moteurs: number) => Math.max(1, Math.min(5, Math.round(reponses / 2 + moteurs / 2)))

export async function lireTravail(projetId: string, marque: Marque): Promise<Ligne[]> {
  const [questions, etats, nommees, concurrents, sites, contradictions] = await Promise.all([
    prisma.question.findMany({
      where: { projetId, archive: false },
      orderBy: { ordre: 'asc' },
      select: {
        id: true,
        texte: true,
        releves: {
          where: { methode: 'interface', statut: { in: ['recu', 'vide'] } },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, moteur: true, statut: true,
            sources: { select: { url: true, domaine: true, titre: true, role: true, videoYoutube: { select: { chaineId: true, chaineNom: true, titre: true, vues: true } } } },
            resultatsGoogle: { orderBy: { rang: 'asc' }, select: { rang: true, domaine: true, url: true } },
          },
        },
      },
    }),
    prisma.etatAction.findMany({ where: { projetId } }),
    prisma.mention.findMany({ where: { releve: { question: { projetId } } }, distinct: ['nom'], select: { nom: true } }),
    prisma.concurrent.findMany({ where: { projetId }, select: { nom: true, domaine: true } }),
    lireSites(),
    prisma.contradiction.findMany({
      where: { ecartee: false, fait: { projetId }, releve: { question: { archive: false } } },
      orderBy: { createdAt: 'desc' },
      select: { faitId: true, releveId: true, phrase: true, explication: true, sourceUrl: true, fait: { select: { texte: true } }, releve: { select: { moteur: true, methode: true, question: { select: { id: true, texte: true } } } } },
    }),
  ])
  // Le site d'une marque concurrente n'est pas une page « où apparaître » : on
  // ne demande pas une place sur le site d'un rival. On le reconnaît quand le
  // nom du domaine est celui d'une marque nommée dans les réponses.
  const simple = (t: string) => t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '')
  const marquesConnues = new Set([...nommees.map((m) => simple(m.nom)), ...concurrents.map((c) => simple(c.nom))].filter((n) => n.length >= 3))
  const domainesConcurrents = new Set(concurrents.map((c) => c.domaine).filter(Boolean))
  // Le type classé du site l'emporte : un site de marque n'entre jamais dans la
  // liste. Tant qu'un site n'est pas classé, on le reconnaît à son nom.
  const typeDe = (domaine: string): TypeLu => sites.get(domaine)?.type ?? typeCertain(domaine) ?? 'a_classer'
  const estSiteDeMarque = (domaine: string) => {
    const parties = domaine.split('.')
    const nom = parties.length >= 2 ? parties[parties.length - 2] : parties[0]
    if (domainesConcurrents.has(domaine)) return true
    const fiche = sites.get(domaine)
    return fiche ? fiche.type === 'marque' : marquesConnues.has(simple(nom))
  }
  const etatDe = new Map(etats.map((e) => [e.cle, e]))
  const lignes: Omit<Ligne, 'etat' | 'ajoutee' | 'majLe' | 'faitLe' | 'note'>[] = []

  const pages = new Map<string, { url: string; domaine: string; titre: string | null; reponses: Set<string>; moteurs: Set<string>; questions: Map<string, string> }>()
  const lues = new Map<string, { url: string; moteurs: Set<string>; questions: Map<string, string> }>()

  for (const q of questions) {
    // Dernier relevé de chaque IA pour la question.
    const vus = new Set<string>()
    const derniers = q.releves.filter((r) => !vus.has(r.moteur) && vus.add(r.moteur))
    const recus = derniers.filter((r) => r.statut === 'recu')
    const citeNous = recus.some((r) => r.sources.some((s) => s.role === 'citee' && estALaMarque(s, marque)))

    for (const r of recus) {
      for (const s of r.sources) {
        if (estALaMarque(s, marque)) {
          // Une page à nous, lue sans être citée.
          if (s.role === 'consultee') {
            const x = lues.get(s.url) ?? { url: s.url, moteurs: new Set<string>(), questions: new Map<string, string>() }
            x.moteurs.add(r.moteur)
            x.questions.set(q.id, q.texte)
            lues.set(s.url, x)
          }
          continue
        }
        if (s.role !== 'citee' || YOUTUBE.includes(s.domaine) || !s.domaine || estSiteDeMarque(s.domaine)) continue
        const x = pages.get(s.url) ?? { url: s.url, domaine: s.domaine, titre: s.titre, reponses: new Set<string>(), moteurs: new Set<string>(), questions: new Map<string, string>() }
        x.reponses.add(r.id)
        x.moteurs.add(r.moteur)
        x.questions.set(q.id, q.texte)
        pages.set(s.url, x)
      }
    }

    // Vidéos citées sur cette question, aucune de nos chaînes.
    const videos = recus.flatMap((r) => r.sources.filter((s) => s.role === 'citee' && s.videoYoutube).map((s) => s.videoYoutube!))
    const aNous = videos.some((v) => marque.chainesYoutube.some((c) => c.id === v.chaineId))
    if (videos.length > 0 && !aNous) {
      const uniques = [...new Map(videos.map((v) => [v.titre, v])).values()]
      lignes.push({
        cle: `video:${q.id}`,
        famille: 'video',
        titre: tr('Tourner une vidéo sur « {question} »', { question: q.texte }),
        detail: tr('Les IA citent {n} [n:vidéo|vidéos] sur cette question, aucune de vos chaînes : {videos}.', { n: uniques.length, videos: uniques.slice(0, 3).map((v) => `« ${v.titre} » (${v.chaineNom}${v.vues !== null ? `, ${tr('{n} vues', { n: v.vues })}` : ''})`).join(' ; ') }),
        lien: null,
        preuves: [{ id: q.id, texte: q.texte }],
        gain: gainDe(uniques.length + 1, 2),
        nbReponses: recus.filter((r) => r.sources.some((s) => s.role === 'citee' && s.videoYoutube)).length,
        nbMoteurs: new Set(recus.filter((r) => r.sources.some((s) => s.role === 'citee' && s.videoYoutube)).map((r) => r.moteur)).size,
      })
    }

    // Aperçu IA affiché sans nous : reformuler si on est dans les dix premiers, référencement sinon.
    const apercu = derniers.find((r) => r.moteur === 'google_ai_overview' && r.statut === 'recu')
    if (apercu && !apercu.sources.some((s) => s.role === 'citee' && estALaMarque(s, marque))) {
      const nous = apercu.resultatsGoogle.find((g) => estDuSite(g.domaine, marque))
      if (nous) {
        lignes.push({
          cle: `reformuler:${nous.url}:${q.id}`,
          famille: 'reformuler',
          titre: tr('Reformuler la page classée n° {rang} sur Google, absente de l’Aperçu IA', { rang: nous.rang }),
          detail: tr('Sur « {question} », votre page est dans les dix premiers résultats mais l’Aperçu IA ne la cite pas. La page est trouvée : il lui manque une réponse nette à la question, en tête de page.', { question: q.texte }),
          lien: nous.url,
          preuves: [{ id: q.id, texte: q.texte }],
          gain: 5,
        })
      } else if (marque.domaines.length > 0 && !citeNous) {
        const top = new Set(apercu.resultatsGoogle.map((g) => g.domaine))
        const sources = [...new Set(apercu.sources.filter((s) => s.role === 'citee').map((s) => s.domaine))]
        lignes.push({
          cle: `seo:${q.id}`,
          famille: 'referencement',
          titre: tr('Travailler le référencement sur « {question} »', { question: q.texte }),
          detail: tr('Votre site n’est pas dans les {n} premiers résultats de Google pour cette question, et {k} des {sources} sources de l’Aperçu IA en font partie. Tant que la page n’est pas mieux classée, l’aperçu a peu de chances de la reprendre.', { n: apercu.resultatsGoogle.length, k: sources.filter((d) => top.has(d)).length, sources: sources.length }),
          lien: null,
          preuves: [{ id: q.id, texte: q.texte }],
          gain: 2,
        })
      }
    }
  }

  for (const p of lues.values()) {
    lignes.push({
      cle: `lue:${p.url}`,
      famille: 'reformuler',
      titre: tr('Reformuler une page lue par l’IA mais pas citée'),
      detail: tr('{n} IA [n:a ouvert|ont ouvert] cette page sans la retenir. Elle est déjà trouvée : regardez les pages citées à sa place et donnez la même réponse, plus nettement.', { n: [...p.moteurs].length }),
      lien: p.url,
      preuves: [...p.questions].map(([id, texte]) => ({ id, texte })),
      gain: 5,
      nbMoteurs: p.moteurs.size,
    })
  }

  // Une ligne par réponse qui contredit un fait vérifié.
  const vuesFaits = new Set<string>()
  for (const c of contradictions) {
    const cle = `fait:${c.faitId}:${c.releveId}`
    if (vuesFaits.has(cle)) continue
    vuesFaits.add(cle)
    const api = c.releve.methode === 'api'
    lignes.push({
      cle,
      famille: 'fait',
      titre: tr('Corriger un fait faux : « {fait} »', { fait: c.fait.texte.length > 90 ? `${c.fait.texte.slice(0, 88)}…` : c.fait.texte }),
      detail: `${tr('{ia} écrit : « {phrase} »', { ia: `${nomIA(c.releve.moteur)}${api ? ` ${tr('(par son API)')}` : ''}`, phrase: c.phrase })}${c.explication ? ` ${c.explication}` : ''} ${c.sourceUrl ? tr('La phrase s’appuie sur la page ci-dessous : corrigez-la si elle est à vous, sinon prévenez son auteur.') : tr('Aucune source n’est citée à l’appui : vérifiez que vos propres pages disent ce fait clairement.')}`,
      lien: c.sourceUrl,
      preuves: [{ id: c.releve.question.id, texte: c.releve.question.texte }],
      gain: 4,
      nbReponses: 1,
      nbMoteurs: 1,
    })
  }

  // Pages des autres : on garde celles citées au moins deux fois, sinon les quinze premières.
  // Les comparatifs, les médias et les annuaires passent devant : c'est là qu'une place se demande.
  const poids = (p: { domaine: string; reponses: Set<string>; moteurs: Set<string> }) => p.reponses.size + p.moteurs.size / 2 + (RECHERCHES.includes(typeDe(p.domaine)) ? 1.5 : PEU_UTILES.includes(typeDe(p.domaine)) ? -1 : 0)
  const tierces = [...pages.values()].sort((a, b) => poids(b) - poids(a) || b.reponses.size - a.reponses.size)
  const retenues = tierces.filter((p) => p.reponses.size >= 2)
  const choisies = (retenues.length >= 5 ? retenues : tierces.slice(0, 15)).slice(0, 40)
  // Les pages épinglées à la main restent dans la liste, même citées une seule fois.
  const epinglees = tierces.filter((p) => etatDe.has(`page:${p.url}`) && !choisies.includes(p))
  // (une ligne qui porte un état, une note ou une prise de contact reste dans la liste)
  for (const p of [...choisies, ...epinglees]) {
    const type = typeDe(p.domaine)
    const { titre, conseil } = consigneDe(type, p.domaine)
    const gain = gainDe(p.reponses.size, p.moteurs.size) + (RECHERCHES.includes(type) ? 1 : PEU_UTILES.includes(type) ? -1 : 0)
    lignes.push({
      cle: `page:${p.url}`,
      famille: 'apparaitre',
      titre,
      detail: `${p.titre ? `« ${p.titre} ». ` : ''}${tr('Page citée dans {n} [n:réponse|réponses] par {ia} IA, sans vous.', { n: p.reponses.size, ia: p.moteurs.size })} ${type === 'a_classer' ? tr('Type du site pas encore classé.') : tr('Type du site : {type}.', { type: tr(libelleType(type)) })} ${conseil}`,
      lien: p.url,
      preuves: [...p.questions].map(([id, texte]) => ({ id, texte })),
      gain: Math.max(1, Math.min(5, gain)),
      nbReponses: p.reponses.size,
      nbMoteurs: p.moteurs.size,
      type,
    })
  }

  return lignes
    .map((l) => {
      const e = etatDe.get(l.cle)
      // « ajoute » : ligne épinglée à la main, encore à faire.
      const etat: Etat = e && e.etat !== 'ajoute' ? (e.etat as Etat) : 'a_faire'
      return {
        ...l, etat,
        ajoutee: e?.etat === 'ajoute' || (!!e && l.cle.startsWith('page:') && epinglees.some((p) => `page:${p.url}` === l.cle)),
        majLe: e && e.etat !== 'a_faire' && e.etat !== 'ajoute' ? e.majLe : null,
        faitLe: etat === 'fait' ? (e?.faitLe ?? e?.majLe ?? null) : null,
        note: e?.note ?? null,
      }
    })
    .sort((a, b) => b.gain - a.gain || (b.nbReponses ?? 0) - (a.nbReponses ?? 0) || a.titre.localeCompare(b.titre))
}

// ── Suivi : actions faites, prises de contact ───────────────────────────────

export type ActionFaite = { cle: string; titre: string; famille: string | null; lien: string | null; questionIds: string[]; faitLe: Date; note: string | null }

/**
 * Les actions passées à « fait », avec leur date. Elles sont lues dans la
 * table des états, pas dans la liste recalculée : une action qui a réussi sort
 * de la liste, et c'est justement son résultat qu'on veut voir.
 */
export async function lireActionsFaites(projetId: string, lignes: Ligne[] = []): Promise<ActionFaite[]> {
  const etats = await prisma.etatAction.findMany({ where: { projetId, etat: 'fait' }, orderBy: { faitLe: 'desc' } })
  const parCle = new Map(lignes.map((l) => [l.cle, l]))
  return etats.map((e) => {
    const l = parCle.get(e.cle)
    return {
      cle: e.cle,
      titre: e.titre ?? l?.titre ?? e.cle.replace(/^[a-z]+:/, ''),
      famille: e.famille ?? l?.famille ?? null,
      lien: e.lien ?? l?.lien ?? null,
      questionIds: e.questionIds.length ? e.questionIds : (l?.preuves.map((p) => p.id) ?? []),
      faitLe: e.faitLe ?? e.majLe,
      note: e.note,
    }
  })
}

export const DEMARCHES: Record<string, string> = {
  ajout: 'Demande d’ajout',
  test: 'Proposition de test',
  reponse: 'Réponse dans un fil',
  correction: 'Demande de correction',
  relance: 'Relance',
  autre: 'Autre démarche',
}
export const REPONSES: Record<string, { libelle: string; classe: string }> = {
  attente: { libelle: 'En attente', classe: 'sans' },
  oui: { libelle: 'Réponse favorable', classe: 'nomme' },
  non: { libelle: 'Refus', classe: 'absent' },
  sans: { libelle: 'Sans réponse', classe: 'neutre' },
}

/** Journal des prises de contact du projet, rangé par ligne de travail, la plus récente d'abord. */
export async function lireDemarches(projetId: string) {
  const liste = await prisma.demarche.findMany({ where: { projetId }, orderBy: [{ faiteLe: 'desc' }, { createdAt: 'desc' }] })
  const parCle = new Map<string, typeof liste>()
  for (const d of liste) parCle.set(d.cle, [...(parCle.get(d.cle) ?? []), d])
  return parCle
}
