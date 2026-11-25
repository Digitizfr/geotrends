'use server'

import { cookies } from 'next/headers'
import { refresh, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { budgetDisponible } from '@/lib/couts'
import { etiqueterQuestions, etiquettesAuto } from '@/lib/etiquettes'
import { MOTEURS, type Moteur } from '@/lib/fournisseurs/types'
import { prisma } from '@/lib/prisma'
import { COOKIE_PROJET, domaineSaisi, lignes } from '@/lib/projets'
import { lancerReleves } from '@/lib/releves'
import { exigerSession } from '@/lib/session'
import { detecterDepuisSites } from '@/lib/detection-profils'
import { profilDepuisUrl } from '@/lib/profils'
import { resoudreChaine } from '@/lib/youtube'

const UN_AN = 60 * 60 * 24 * 365

async function retenir(projetId: string) {
  ;(await cookies()).set(COOKIE_PROJET, projetId, { path: '/', maxAge: UN_AN, sameSite: 'lax', httpOnly: true })
}

/** Change le projet affiché dans tout l'outil. */
export async function choisirProjet(donnees: FormData) {
  await exigerSession()
  const id = String(donnees.get('projetId') ?? '')
  if (await prisma.projet.findFirst({ where: { id, archive: false }, select: { id: true } })) await retenir(id)
  refresh()
}

/** Sites et chaînes saisis en texte libre → propriétés prêtes à enregistrer. Les saisies illisibles sont ignorées. */
async function proprietesDe(sites: string[], chaines: string[], profils: string[] = []) {
  const proprietes: { type: string; valeur: string; libelle: string | null }[] = []
  for (const s of sites) {
    const d = domaineSaisi(s)
    if (d) proprietes.push({ type: 'site', valeur: d, libelle: null })
  }
  for (const c of chaines) {
    const chaine = await resoudreChaine(c)
    if (chaine) proprietes.push({ type: 'youtube', valeur: chaine.id, libelle: chaine.nom })
  }
  for (const u of profils) {
    const profil = profilDepuisUrl(u)
    if (profil) proprietes.push({ type: 'profil', valeur: profil.valeur, libelle: profil.reseau })
  }
  // Une même propriété saisie deux fois ne compte qu'une fois.
  return proprietes.filter((p, i) => proprietes.findIndex((x) => x.type === p.type && x.valeur === p.valeur) === i)
}

export async function creerProjet(donnees: FormData) {
  await exigerSession()
  const marque = String(donnees.get('marque') ?? '').trim()
  const langue = String(donnees.get('langue') ?? 'fr').trim().toLowerCase().slice(0, 2) || 'fr'
  const pays = String(donnees.get('pays') ?? 'FR').trim().toUpperCase().slice(0, 2) || 'FR'
  if (!marque) redirect('/projets?erreur=marque')
  if (await prisma.projet.findUnique({ where: { nom: marque }, select: { id: true } })) redirect('/projets?erreur=existe')

  const proprietes = await proprietesDe(lignes(donnees.get('sites')), lignes(donnees.get('chaines')), lignes(donnees.get('profils')))
  const projet = await prisma.projet.create({
    data: {
      nom: marque,
      marque,
      langue,
      pays,
      proprietes: { create: proprietes },
      concurrents: { create: lignes(donnees.get('concurrents')).map((nom) => ({ nom })) },
      questions: { create: lignes(donnees.get('questions')).map((texte, i) => ({ texte, langue, pays, ordre: i + 1 })) },
    },
  })
  await retenir(projet.id)
  refresh()
  redirect(`/projets/${projet.id}`)
}

export async function ajouterQuestions(donnees: FormData) {
  await exigerSession()
  const projetId = String(donnees.get('projetId') ?? '')
  const projet = await prisma.projet.findUnique({ where: { id: projetId }, include: { questions: { select: { texte: true, ordre: true } } } })
  if (!projet) return
  const connues = new Set(projet.questions.map((q) => q.texte.toLowerCase()))
  let ordre = Math.max(0, ...projet.questions.map((q) => q.ordre))
  const nouvelles = lignes(donnees.get('questions')).filter((t) => !connues.has(t.toLowerCase()))
  if (nouvelles.length) {
    await prisma.question.createMany({ data: nouvelles.map((texte) => ({ projetId, texte, langue: projet.langue, pays: projet.pays, ordre: ++ordre })) })
    // Étiquettes des nouvelles questions : seulement si l'utilisateur a déjà lancé l'étiquetage (et ne l'a pas coupé).
    if ((await etiquettesAuto(projetId)) && (await budgetDisponible())) after(() => etiqueterQuestions(projetId).catch(() => undefined))
  }
  revalidatePath(`/projets/${projetId}`)
}

/** Une question lancée ne se supprime pas : on l'archive, son historique reste. */
export async function archiverQuestion(donnees: FormData) {
  await exigerSession()
  const id = String(donnees.get('questionId') ?? '')
  const archive = donnees.get('archive') === '1'
  const q = await prisma.question.findUnique({ where: { id }, select: { projetId: true, _count: { select: { releves: true } } } })
  if (!q) return
  // Jamais relevée : rien à garder, on la retire vraiment.
  if (archive && q._count.releves === 0) await prisma.question.delete({ where: { id } })
  else await prisma.question.update({ where: { id }, data: { archive } })
  revalidatePath(`/projets/${q.projetId}`)
}

export async function ajouterProprietes(donnees: FormData) {
  await exigerSession()
  const projetId = String(donnees.get('projetId') ?? '')
  if (!(await prisma.projet.findUnique({ where: { id: projetId }, select: { id: true } }))) return
  const proprietes = await proprietesDe(lignes(donnees.get('sites')), lignes(donnees.get('chaines')), lignes(donnees.get('profils')))
  await prisma.propriete.createMany({ data: proprietes.map((p) => ({ ...p, projetId })), skipDuplicates: true })
  revalidatePath(`/projets/${projetId}`)
}

export async function retirerPropriete(donnees: FormData) {
  await exigerSession()
  const p = await prisma.propriete.delete({ where: { id: String(donnees.get('proprieteId') ?? '') } }).catch(() => null)
  if (p) revalidatePath(`/projets/${p.projetId}`)
}

export async function ajouterConcurrents(donnees: FormData) {
  await exigerSession()
  const projetId = String(donnees.get('projetId') ?? '')
  if (!(await prisma.projet.findUnique({ where: { id: projetId }, select: { id: true } }))) return
  await prisma.concurrent.createMany({ data: lignes(donnees.get('concurrents')).map((nom) => ({ projetId, nom })), skipDuplicates: true })
  revalidatePath(`/projets/${projetId}`)
}

export async function retirerConcurrent(donnees: FormData) {
  await exigerSession()
  const c = await prisma.concurrent.delete({ where: { id: String(donnees.get('concurrentId') ?? '') } }).catch(() => null)
  if (c) revalidatePath(`/projets/${c.projetId}`)
}

/** Active ou coupe les relevés automatiques d'un projet. C'est l'utilisateur qui décide : rien n'est activé par défaut. */
export async function reglerAuto(donnees: FormData) {
  await exigerSession()
  const projetId = String(donnees.get('projetId') ?? '')
  await prisma.projet.update({ where: { id: projetId }, data: { releveAuto: donnees.get('releveAuto') === 'on', claudeAuto: donnees.get('claudeAuto') === 'on' } }).catch(() => null)
  revalidatePath(`/projets/${projetId}`)
}

/**
 * Lance un relevé : toutes les questions actives du projet sont envoyées aux
 * IA cochées. C'est un appel payant, déclenché par la personne connectée et
 * inscrit au journal des coûts. Le plafond mensuel est vérifié avant l'envoi.
 */
export async function lancerReleve(donnees: FormData) {
  await exigerSession()
  const projetId = String(donnees.get('projetId') ?? '')
  const moteurs = MOTEURS.filter((m) => donnees.get(`moteur_${m}`) === 'on') as Moteur[]
  const questions = await prisma.question.findMany({ where: { projetId, archive: false }, select: { id: true } })
  if (moteurs.length === 0 || questions.length === 0) redirect(`/projets/${projetId}?erreur=vide`)
  if (!(await budgetDisponible())) redirect(`/projets/${projetId}?erreur=plafond`)

  const ids = questions.map((q) => q.id)
  const interfaces = moteurs.filter((m) => m !== 'claude')
  // Les IA relevées par l'interface : l'envoi est immédiat, les réponses reviennent plus tard.
  if (interfaces.length) await lancerReleves(ids, interfaces)
  // Claude répond en direct, en une à deux minutes par lot : on le laisse finir après avoir rendu la main.
  if (moteurs.includes('claude')) after(() => lancerReleves(ids, ['claude']).catch(() => undefined))

  await retenir(projetId)
  refresh()
  redirect('/releves?lance=1')
}

// ── Ajouts de la refonte de l'interface (14/11/2026) : tous gratuits ────────

export type BilanProprietes = {
  /** Ce qui a été reconnu et ajouté : domaine nettoyé, vrai nom de la chaîne. */
  ajoutees: { type: string; valeur: string; libelle: string | null }[]
  /** Déjà déclarées pour ce projet : écartées. */
  doublons: string[]
  /** Saisies que l'outil n'a pas su lire. */
  illisibles: string[]
} | null

/**
 * Ajoute des propriétés à la marque et dit ce qui a été compris : domaine
 * nettoyé, nom réel de la chaîne, doublons écartés, saisies illisibles.
 */
export async function ajouterProprietesAvecBilan(_avant: BilanProprietes, donnees: FormData): Promise<BilanProprietes> {
  await exigerSession()
  const projetId = String(donnees.get('projetId') ?? '')
  const projet = await prisma.projet.findUnique({ where: { id: projetId }, include: { proprietes: true } })
  if (!projet) return null
  const sites = lignes(donnees.get('sites'))
  const chaines = lignes(donnees.get('chaines'))
  const profils = lignes(donnees.get('profils'))
  const noms = lignes(donnees.get('noms')).map((n) => n.slice(0, 80))
  const illisibles: string[] = []
  const trouvees: { type: string; valeur: string; libelle: string | null }[] = []
  for (const s of sites) {
    const d = domaineSaisi(s)
    if (d) trouvees.push({ type: 'site', valeur: d, libelle: null })
    else illisibles.push(s)
  }
  for (const c of chaines) {
    const chaine = await resoudreChaine(c)
    if (chaine) trouvees.push({ type: 'youtube', valeur: chaine.id, libelle: chaine.nom })
    else illisibles.push(c)
  }
  for (const u of profils) {
    const profil = profilDepuisUrl(u)
    if (profil) trouvees.push({ type: 'profil', valeur: profil.valeur, libelle: profil.reseau })
    else illisibles.push(u)
  }
  for (const n of noms) if (n.toLowerCase() !== projet.marque.toLowerCase()) trouvees.push({ type: 'nom', valeur: n, libelle: null })
  const connue = (p: { type: string; valeur: string }) => projet.proprietes.some((x) => x.type === p.type && x.valeur.toLowerCase() === p.valeur.toLowerCase())
  const uniques = trouvees.filter((p, i) => trouvees.findIndex((x) => x.type === p.type && x.valeur === p.valeur) === i)
  const ajoutees = uniques.filter((p) => !connue(p))
  await prisma.propriete.createMany({ data: ajoutees.map((p) => ({ ...p, projetId })), skipDuplicates: true })
  refresh()
  return { ajoutees, doublons: uniques.filter(connue).map((p) => p.libelle ?? p.valeur), illisibles }
}

/** Vérifie des saisies sans rien enregistrer : sert à la création d'un projet, pour montrer ce qui est reconnu. */
export async function verifierProprietes(sites: string[], chaines: string[], profils: string[] = []) {
  await exigerSession()
  const lus = { profils: [] as { saisie: string; valeur: string | null; reseau: string | null }[], sites: [] as { saisie: string; domaine: string | null }[], chaines: [] as { saisie: string; id: string | null; nom: string | null }[] }
  for (const s of sites.slice(0, 20)) lus.sites.push({ saisie: s, domaine: domaineSaisi(s) })
  for (const c of chaines.slice(0, 10)) {
    const chaine = await resoudreChaine(c)
    lus.chaines.push({ saisie: c, id: chaine?.id ?? null, nom: chaine?.nom ?? null })
  }
  for (const u of profils.slice(0, 20)) {
    const p = profilDepuisUrl(u)
    lus.profils.push({ saisie: u, valeur: p?.valeur ?? null, reseau: p?.reseau ?? null })
  }
  return lus
}

/**
 * Cherche les réseaux sociaux et les chaînes YouTube d'une marque en lisant la
 * page d'accueil de ses sites. Gratuit : rien n'est enregistré, la personne
 * garde ce qu'elle veut dans les champs avant d'ajouter.
 */
export async function detecterProfils(sites: string[], projetId?: string) {
  await exigerSession()
  const trouve = await detecterDepuisSites(sites)
  if (!projetId) return { ...trouve, dejaDeclares: 0 }
  // Sur la fiche d'un projet : on ne repropose pas ce qui est déjà déclaré.
  const connues = await prisma.propriete.findMany({ where: { projetId }, select: { type: true, valeur: true } })
  const a = (type: string, valeur: string) => connues.some((p) => p.type === type && p.valeur.toLowerCase() === valeur.toLowerCase())
  const profils = trouve.profils.filter((p) => !a('profil', p.valeur))
  const chaines: string[] = []
  for (const c of trouve.chaines) {
    const id = (await resoudreChaine(c))?.id
    if (!id || !a('youtube', id)) chaines.push(c)
  }
  return { ...trouve, profils, chaines, dejaDeclares: trouve.profils.length - profils.length + trouve.chaines.length - chaines.length }
}

/** Déclare le site d'un concurrent suivi : ses pages citées lui seront attribuées. */
export async function reglerConcurrent(donnees: FormData) {
  await exigerSession()
  const id = String(donnees.get('concurrentId') ?? '')
  const saisie = String(donnees.get('domaine') ?? '').trim()
  const c = await prisma.concurrent.update({ where: { id }, data: { domaine: saisie ? domaineSaisi(saisie) : null } }).catch(() => null)
  if (c) refresh()
}

/** Renomme un projet. Le journal des coûts suit : ses lignes portent le nom du projet. */
export async function renommerProjet(donnees: FormData) {
  await exigerSession()
  const id = String(donnees.get('projetId') ?? '')
  const nom = String(donnees.get('nom') ?? '').trim().slice(0, 80)
  const projet = await prisma.projet.findUnique({ where: { id }, select: { nom: true } })
  if (!projet || !nom || nom === projet.nom) redirect(`/projets/${id}?onglet=reglages`)
  if (await prisma.projet.findUnique({ where: { nom }, select: { id: true } })) redirect(`/projets/${id}?onglet=reglages&erreur=existe`)
  await prisma.$transaction([
    prisma.projet.update({ where: { id }, data: { nom } }),
    prisma.apiCall.updateMany({ where: { projet: projet.nom }, data: { projet: nom } }),
  ])
  refresh()
  redirect(`/projets/${id}?onglet=reglages&fait=nom`)
}

/** Change le pays et la langue d'un projet, tant qu'aucun relevé n'est parti : ensuite, les courbes ne seraient plus comparables. */
export async function changerMarche(donnees: FormData) {
  await exigerSession()
  const id = String(donnees.get('projetId') ?? '')
  const langue = String(donnees.get('langue') ?? '').trim().toLowerCase().slice(0, 2)
  const pays = String(donnees.get('pays') ?? '').trim().toUpperCase().slice(0, 2)
  const releves = await prisma.releve.count({ where: { question: { projetId: id } } })
  if (!langue || !pays || releves > 0) redirect(`/projets/${id}?onglet=reglages`)
  await prisma.$transaction([
    prisma.projet.update({ where: { id }, data: { langue, pays } }),
    prisma.question.updateMany({ where: { projetId: id }, data: { langue, pays } }),
  ])
  refresh()
  redirect(`/projets/${id}?onglet=reglages&fait=marche`)
}

/** Archive un projet : il sort de l'outil, ses relevés automatiques s'arrêtent, son historique reste en base. */
export async function archiverProjet(donnees: FormData) {
  await exigerSession()
  const id = String(donnees.get('projetId') ?? '')
  await prisma.projet.update({ where: { id }, data: { archive: true, releveAuto: false, claudeAuto: false } }).catch(() => null)
  refresh()
  redirect('/projets')
}
