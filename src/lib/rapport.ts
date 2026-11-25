import { classerMarques, classerMouvements, type Mouvement } from './classements'
import { debutDuMois, lirePlafond } from './couts'
import type { Moteur } from './fournisseurs/types'
import { tr } from './i18n/courante'
import { deCleJour, jourLong, nom, nomCourt, pluriel, usdFin } from './libelles'
import { compter, deMethode, ecart, recus, type Compte, type Ecart, type Mesures, type ReleveLu } from './mesures'
import { prisma } from './prisma'
import type { Ligne } from './travail'

/*
 * Le rapport (fonction R3) : ce qui a changé entre les deux derniers jours de
 * relevé, les trois actions les plus utiles, la dépense de la période. Les
 * alertes (fonction R2) en sont tirées : ce sont les seuls écarts qui
 * dépassent la marge d'erreur.
 *
 * Tout est lu dans la base : aucun appel payant. Interface et API ne sont
 * jamais additionnées : Claude a son propre bloc, avec ses propres dates.
 * Les mesures approfondies n'entrent pas dans la comparaison.
 */

export type Bascule = { question: { id: string; texte: string }; moteur: Moteur; avant: ReleveLu; apres: ReleveLu }

export type Comparaison = {
  methode: 'interface' | 'api'
  jourAvant: string
  jourApres: string
  /** Couples question × IA qui ont une réponse aux deux dates. */
  paires: number
  avant: Compte
  apres: Compte
  e: Ecart | null
  parMoteur: { moteur: Moteur; avant: Compte; apres: Compte; e: Ecart | null }[]
  /** La marque était absente, elle est présente. */
  gagnees: Bascule[]
  /** La marque était présente, elle est absente. */
  perdues: Bascule[]
}

export type MarqueApparue = { nom: string; suivie: boolean; avant: number; apres: number; e: Ecart | null }

export type Alerte = { cle: string; sens: 'hausse' | 'baisse'; titre: string; detail: string; lien: string }

export type Rapport = {
  projet: { id: string; nom: string; marque: string }
  /** Jours de relevé d'interface, dans l'ordre. */
  jours: string[]
  ui: Comparaison | null
  api: Comparaison | null
  /** Aperçus IA de Google : affichés ou non, aux deux dates. */
  apercus: { apparus: { id: string; texte: string }[]; disparus: { id: string; texte: string }[]; avant: { k: number; n: number }; apres: { k: number; n: number } } | null
  /** Marques nommées au dernier relevé et pas au précédent. */
  marques: { apparues: MarqueApparue[]; baseAvant: number; baseApres: number }
  sources: { nouveaux: Mouvement[]; perdus: Mouvement[]; hausse: Mouvement[]; baisse: Mouvement[]; paires: number } | null
  actions: Ligne[]
  depense: { depuis: Date; total: number; parOperation: { operation: string; cout: number; appels: number }[]; mois: number; plafond: number }
  alertes: Alerte[]
}

/** Dernier relevé du jour pour chaque couple question × IA. */
function duJour(rs: ReleveLu[], jour: string) {
  const x = new Map<string, ReleveLu>()
  for (const r of rs) if (r.jour === jour) x.set(`${r.question.id}:${r.moteur}`, r)
  return x
}

/** Compare les deux derniers jours de relevé d'une méthode, sur les couples qui ont une réponse aux deux dates. */
function comparer(m: Mesures, methode: 'interface' | 'api'): Comparaison | null {
  const rs = recus(deMethode(m.tous, methode)).filter((r) => !r.approfondi)
  const jours = [...new Set(rs.map((r) => r.jour))].sort()
  if (jours.length < 2) return null
  const jourAvant = jours.at(-2)!
  const jourApres = jours.at(-1)!
  const a = duJour(rs, jourAvant)
  const b = duJour(rs, jourApres)
  const communs = [...b.keys()].filter((k) => a.has(k))
  if (communs.length === 0) return null
  const avant = communs.map((k) => a.get(k)!)
  const apres = communs.map((k) => b.get(k)!)
  const bascules = communs.map((k) => ({ question: b.get(k)!.question, moteur: b.get(k)!.moteur, avant: a.get(k)!, apres: b.get(k)! }))
  const moteurs = [...new Set(apres.map((r) => r.moteur))]
  return {
    methode, jourAvant, jourApres,
    paires: communs.length,
    avant: compter(avant),
    apres: compter(apres),
    e: ecart(compter(avant), compter(apres)),
    parMoteur: moteurs.map((moteur) => {
      const x = compter(avant.filter((r) => r.moteur === moteur))
      const y = compter(apres.filter((r) => r.moteur === moteur))
      return { moteur, avant: x, apres: y, e: ecart(x, y) }
    }),
    gagnees: bascules.filter((x) => !x.avant.present && x.apres.present),
    perdues: bascules.filter((x) => x.avant.present && !x.apres.present),
  }
}

const points = (e: Ecart) => `${e.points > 0 ? '+' : '−'}${Math.abs(e.points)} pt${Math.abs(e.points) > 1 ? 's' : ''}`

/** Construit le rapport d'un projet à partir de ses mesures sans filtre et de sa liste de travail. */
export async function construireRapport(m: Mesures, travail: Ligne[]): Promise<Rapport> {
  const ui = comparer(m, 'interface')
  const api = comparer(m, 'api')
  const tousUi = deMethode(m.tous, 'interface').filter((r) => !r.approfondi)
  const jours = [...new Set(recus(tousUi).map((r) => r.jour))].sort()

  // Aperçus IA : affichés ou non, sur les questions relevées aux deux dates.
  let apercus: Rapport['apercus'] = null
  if (ui) {
    const aboutis = tousUi.filter((r) => r.moteur === 'google_ai_overview' && (r.statut === 'recu' || r.statut === 'vide'))
    const a = duJour(aboutis, ui.jourAvant)
    const b = duJour(aboutis, ui.jourApres)
    const communs = [...b.keys()].filter((k) => a.has(k))
    if (communs.length > 0) {
      apercus = {
        apparus: communs.filter((k) => a.get(k)!.statut === 'vide' && b.get(k)!.statut === 'recu').map((k) => b.get(k)!.question),
        disparus: communs.filter((k) => a.get(k)!.statut === 'recu' && b.get(k)!.statut === 'vide').map((k) => b.get(k)!.question),
        avant: { k: communs.filter((k) => a.get(k)!.statut === 'recu').length, n: communs.length },
        apres: { k: communs.filter((k) => b.get(k)!.statut === 'recu').length, n: communs.length },
      }
    }
  }

  // Marques nommées au dernier relevé et pas au précédent.
  const marques: Rapport['marques'] = { apparues: [], baseAvant: 0, baseApres: 0 }
  if (ui) {
    const avant = classerMarques(m, recus(tousUi).filter((r) => r.jour === ui.jourAvant))
    const apres = classerMarques(m, recus(tousUi).filter((r) => r.jour === ui.jourApres))
    const vues = new Map(avant.lignes.map((l) => [l.cle, l.reponses]))
    marques.baseAvant = avant.base
    marques.baseApres = apres.base
    marques.apparues = apres.lignes
      .filter((l) => !l.aNous && !l.ignoree && l.reponses > 0 && !(vues.get(l.cle) ?? 0))
      .map((l) => ({ nom: l.nom, suivie: l.suivie, avant: 0, apres: l.reponses, e: ecart({ k: 0, n: avant.base }, { k: l.reponses, n: apres.base }) }))
      .sort((x, y) => y.apres - x.apres || x.nom.localeCompare(y.nom))
  }

  const mouvements = classerMouvements(m, m.tous)
  const sources = mouvements ? { nouveaux: mouvements.sites.nouveaux, perdus: mouvements.sites.perdus, hausse: mouvements.sites.hausse, baisse: mouvements.sites.baisse, paires: mouvements.paires } : null

  // Dépense depuis le relevé précédent (ou sur 7 jours s'il n'y en a qu'un).
  const depuis = ui ? new Date(deCleJour(ui.jourAvant).getTime() + 12 * 3_600_000) : new Date(Date.now() - 7 * 86_400_000)
  const [parOperation, mois, plafond] = await Promise.all([
    prisma.apiCall.groupBy({ by: ['operation'], where: { projet: m.projet.nom, createdAt: { gte: depuis } }, _sum: { coutUsd: true }, _count: { _all: true } }),
    prisma.apiCall.aggregate({ _sum: { coutUsd: true }, where: { createdAt: { gte: debutDuMois() } } }),
    lirePlafond(),
  ])
  const depense = {
    depuis,
    parOperation: parOperation.map((l) => ({ operation: l.operation, cout: Number(l._sum.coutUsd ?? 0), appels: l._count._all })).sort((a, b) => b.cout - a.cout),
    total: parOperation.reduce((n, l) => n + Number(l._sum.coutUsd ?? 0), 0),
    mois: Number(mois._sum.coutUsd ?? 0),
    plafond,
  }

  // ── Alertes : seulement les écarts qui dépassent la marge d'erreur ─────────
  const alertes: Alerte[] = []
  const reel = (e: Ecart | null): e is Ecart & { sens: 'hausse' | 'baisse' } => !!e && (e.sens === 'hausse' || e.sens === 'baisse')
  const dates = ui ? tr('entre le {avant} et le {apres}', { avant: jourLong(deCleJour(ui.jourAvant)), apres: jourLong(deCleJour(ui.jourApres)) }) : ''
  const pts = (e: Ecart) => points(e).replace(/^[+−]/, '')
  if (ui && reel(ui.e)) {
    alertes.push({ cle: 'visibilite', sens: ui.e.sens, titre: ui.e.sens === 'hausse' ? tr('La visibilité de {marque} monte : {points}', { marque: m.marque.nom, points: points(ui.e) }) : tr('La visibilité de {marque} baisse : {points}', { marque: m.marque.nom, points: points(ui.e) }), detail: tr('{k1} sur {n1}, puis {k2} sur {n2}, {dates}. Interface, mêmes questions et mêmes IA.', { k1: ui.avant.k, n1: ui.avant.n, k2: ui.apres.k, n2: ui.apres.n, dates }), lien: '/rapport#presence' })
  }
  for (const x of ui?.parMoteur ?? []) {
    if (reel(x.e)) alertes.push({ cle: `ia:${x.moteur}`, sens: x.e.sens, titre: x.e.sens === 'hausse' ? tr('{ia} : la marque gagne {points}', { ia: nom(x.moteur), points: pts(x.e) }) : tr('{ia} : la marque perd {points}', { ia: nom(x.moteur), points: pts(x.e) }), detail: tr('{k1} sur {n1}, puis {k2} sur {n2}, {dates}.', { k1: x.avant.k, n1: x.avant.n, k2: x.apres.k, n2: x.apres.n, dates }), lien: '/rapport#presence' })
  }
  if (api && reel(api.e)) {
    alertes.push({ cle: 'api', sens: api.e.sens, titre: api.e.sens === 'hausse' ? tr('{ia} : la marque gagne {points}', { ia: 'Claude (API)', points: pts(api.e) }) : tr('{ia} : la marque perd {points}', { ia: 'Claude (API)', points: pts(api.e) }), detail: tr('{k1} sur {n1}, puis {k2} sur {n2}. Réponse du modèle seul, comptée à part de l’interface.', { k1: api.avant.k, n1: api.avant.n, k2: api.apres.k, n2: api.apres.n }), lien: '/rapport#api' })
  }
  for (const x of marques.apparues) {
    if (reel(x.e)) alertes.push({ cle: `marque:${x.nom}`, sens: 'baisse', titre: tr('{nom} s’installe dans les réponses', { nom: x.nom }), detail: `${tr('Nommée dans {k} [k:réponse|réponses] sur {n} au dernier relevé, dans aucune sur {avant} au précédent.', { k: x.apres, n: marques.baseApres, avant: marques.baseAvant })}${x.suivie ? '' : ` ${tr('Ce n’est pas encore un concurrent suivi.')}`}`, lien: `/reponses?marque=${encodeURIComponent(x.nom)}` })
  }
  for (const x of [...(sources?.nouveaux ?? []), ...(sources?.hausse ?? []), ...(sources?.perdus ?? []), ...(sources?.baisse ?? [])]) {
    if (reel(x.e)) alertes.push({ cle: `source:${x.cle}`, sens: x.e.sens, titre: `${x.cle} ${x.avant === 0 ? tr('entre dans les sources citées') : x.apres === 0 ? tr('sort des sources citées') : x.e.sens === 'hausse' ? tr('est cité plus souvent') : tr('est cité moins souvent')}`, detail: tr('Cité dans {avant} [avant:réponse|réponses], puis {apres}, sur {n} réponses comparables.', { avant: x.avant, apres: x.apres, n: sources!.paires }), lien: `/sources?fiche=${encodeURIComponent(x.cle)}#fiche` })
  }
  if (apercus) {
    const e = ecart(apercus.avant, apercus.apres)
    if (reel(e)) alertes.push({ cle: 'apercus', sens: e.sens, titre: e.sens === 'hausse' ? tr('Google affiche plus d’Aperçus IA sur vos questions') : tr('Google affiche moins d’Aperçus IA sur vos questions'), detail: tr('{k1} [k1:question|questions] sur {n1}, puis {k2} sur {n2}.', { k1: apercus.avant.k, n1: apercus.avant.n, k2: apercus.apres.k, n2: apercus.apres.n }), lien: '/google' })
  }
  // Une question seule : l'écart ne se juge qu'avec assez de relevés de chaque côté (mesure approfondie).
  if (ui) {
    for (const q of m.questions) {
      const rs = recus(deMethode(q.tous, 'interface'))
      const e = ecart(compter(rs.filter((r) => r.jour < ui.jourApres)), compter(rs.filter((r) => r.jour >= ui.jourApres)))
      if (reel(e)) alertes.push({ cle: `question:${q.id}`, sens: e.sens, titre: e.sens === 'hausse' ? tr('« {question} » : la présence monte de {points}', { question: q.texte, points: pts(e) }) : tr('« {question} » : la présence baisse de {points}', { question: q.texte, points: pts(e) }), detail: tr('Écart mesuré sur tous les relevés de la question, avant et depuis le dernier jour de relevé.'), lien: `/questions/${q.id}` })
    }
  }

  return {
    projet: { id: m.projet.id, nom: m.projet.nom, marque: m.marque.nom },
    jours, ui, api, apercus, marques, sources,
    actions: travail.filter((l) => l.etat === 'a_faire' || l.etat === 'en_cours').slice(0, 3),
    depense, alertes,
  }
}

// ── Le rapport par e-mail ───────────────────────────────────────────────────

const echapper = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const part = (c: { k: number; n: number }) => `${c.k} sur ${c.n}`
const verdict = (e: Ecart | null) => (!e ? 'rien à comparer' : e.sens === 'hausse' ? `hausse réelle, ${points(e)}` : e.sens === 'baisse' ? `baisse réelle, ${points(e)}` : e.sens === 'tot' ? 'trop peu de relevés pour le dire' : e.points === 0 ? 'aucun écart' : `${points(e)}, dans la marge d’erreur`)

/** Le rapport en texte simple et en HTML, pour l'e-mail du lundi. `base` est l'adresse de l'outil. */
export function rapportEnCourriel(r: Rapport, base: string): { sujet: string; texte: string; html: string } {
  const lignes: { titre: string; corps: string[] }[] = []
  const lien = (chemin: string) => `${base.replace(/\/$/, '')}${chemin}`
  if (!r.ui) {
    lignes.push({ titre: 'Pas encore de comparaison', corps: [r.jours.length === 0 ? 'Aucun relevé d’interface pour ce projet.' : `Un seul jour de relevé (${jourLong(deCleJour(r.jours[0]))}). Le rapport comparera deux dates dès le prochain relevé.`] })
  } else {
    lignes.push({
      titre: `Présence de ${r.projet.marque} (interface)`,
      corps: [
        `Du ${jourLong(deCleJour(r.ui.jourAvant))} au ${jourLong(deCleJour(r.ui.jourApres))}, sur ${r.ui.paires} réponses comparables : ${part(r.ui.avant)}, puis ${part(r.ui.apres)}. Verdict : ${verdict(r.ui.e)}.`,
        ...r.ui.parMoteur.map((x) => `${nomCourt(x.moteur)} : ${part(x.avant)}, puis ${part(x.apres)} : ${verdict(x.e)}.`),
        r.ui.gagnees.length ? `Présence gagnée : ${r.ui.gagnees.slice(0, 6).map((x) => `« ${x.question.texte} » chez ${nomCourt(x.moteur)}`).join(' ; ')}${r.ui.gagnees.length > 6 ? `, et ${r.ui.gagnees.length - 6} de plus` : ''}.` : 'Aucune présence gagnée.',
        r.ui.perdues.length ? `Présence perdue : ${r.ui.perdues.slice(0, 6).map((x) => `« ${x.question.texte} » chez ${nomCourt(x.moteur)}`).join(' ; ')}${r.ui.perdues.length > 6 ? `, et ${r.ui.perdues.length - 6} de plus` : ''}.` : 'Aucune présence perdue.',
        'Une réponse par date et par IA : une présence gagnée ou perdue est un indice, pas une tendance.',
      ],
    })
    if (r.api) lignes.push({ titre: 'Claude, mesuré par son API (compté à part)', corps: [`Du ${jourLong(deCleJour(r.api.jourAvant))} au ${jourLong(deCleJour(r.api.jourApres))} : ${part(r.api.avant)}, puis ${part(r.api.apres)}. Verdict : ${verdict(r.api.e)}.`] })
    lignes.push({
      titre: 'Marques nommées pour la première fois',
      corps: [r.marques.apparues.length ? r.marques.apparues.slice(0, 8).map((x) => `${x.nom} (${pluriel(x.apres, 'réponse')}${x.suivie ? ', suivie' : ''})`).join(', ') + (r.marques.apparues.length > 8 ? `, et ${r.marques.apparues.length - 8} de plus.` : '.') : 'Aucune nouvelle marque au dernier relevé.'],
    })
    if (r.sources) {
      const liste = (xs: Mouvement[]) => (xs.length ? xs.slice(0, 5).map((x) => `${x.cle} (${x.avant} → ${x.apres})`).join(', ') + (xs.length > 5 ? `, et ${xs.length - 5} de plus` : '') : 'aucun')
      lignes.push({ titre: 'Sources citées', corps: [`Nouveaux sites : ${liste(r.sources.nouveaux)}.`, `Sites perdus : ${liste(r.sources.perdus)}.`, `Sur ${r.sources.paires} réponses comparables.`] })
    }
  }
  if (r.alertes.length) lignes.unshift({ titre: 'Au-dessus de la marge d’erreur', corps: r.alertes.slice(0, 8).map((a) => `${a.titre}. ${a.detail}`) })
  lignes.push({ titre: 'Les trois actions les plus utiles', corps: r.actions.length ? r.actions.map((a, i) => `${i + 1}. ${a.titre}${a.lien ? ` (${a.lien})` : ''}`) : ['Rien à proposer pour l’instant.'] })
  lignes.push({
    titre: 'Dépense',
    corps: [
      `Depuis le ${jourLong(r.depense.depuis)} : ${usdFin(r.depense.total)}${r.depense.parOperation.length ? ` (${r.depense.parOperation.map((o) => `${nom(o.operation).toLowerCase()} ${usdFin(o.cout)}`).join(', ')})` : ''}.`,
      `Ce mois-ci, tous projets : ${usdFin(r.depense.mois)} sur ${usdFin(r.depense.plafond)} de plafond.`,
    ],
  })
  const sujet = `GeoTrends · ${r.projet.nom} : ${r.ui ? `${part(r.ui.apres)} réponses avec la marque, ${r.alertes.length ? pluriel(r.alertes.length, 'écart') + ' hors marge' : 'aucun écart hors marge'}` : 'rapport de la semaine'}`
  const pied = `Rapport complet : ${lien('/rapport')}. Pour ne plus le recevoir, coupez l’envoi sur cette page.`
  const texte = [`Rapport GeoTrends, projet ${r.projet.nom}`, '', ...lignes.flatMap((l) => [l.titre.toUpperCase(), ...l.corps, '']), pied].join('\n')
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#f2eee3;color:#14201b;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5">
<div style="max-width:640px;margin:0 auto;padding:24px 16px">
<p style="font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#4d5a54;margin:0">Rapport GeoTrends</p>
<h1 style="font-family:Georgia,serif;font-weight:400;font-size:26px;line-height:1.15;margin:6px 0 18px">${echapper(r.projet.nom)}</h1>
${lignes.map((l) => `<div style="background:#fffdf8;border:1px solid #14201b;margin:0 0 14px;padding:14px 16px"><p style="font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#4d5a54;margin:0 0 8px">${echapper(l.titre)}</p>${l.corps.map((c) => `<p style="margin:0 0 6px">${echapper(c)}</p>`).join('')}</div>`).join('\n')}
<p style="margin:18px 0 0"><a href="${echapper(lien('/rapport'))}" style="display:inline-block;background:#14201b;color:#f2eee3;padding:10px 16px;text-decoration:none;font-weight:600">Ouvrir le rapport complet</a></p>
<p style="color:#4d5a54;font-size:13px;margin:16px 0 0">Chaque chiffre vient des relevés d’interface, sauf mention « API ». Pour ne plus recevoir ce rapport, coupez l’envoi sur la page du rapport.</p>
</div></body></html>`
  return { sujet, texte, html }
}
