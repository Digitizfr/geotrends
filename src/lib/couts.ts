import { prisma } from './prisma'

// ── Journal des coûts ───────────────────────────────────────────────────────
// Tout appel à une API payante passe par ici. Le tableau de bord (/couts) ne
// lit que cette table : un appel non enregistré est une dépense invisible.

export type AppelPayant = {
  fournisseur: string // "dataforseo", "anthropic", "deepseek"…
  operation: string // "releve", "analyse", "suggestion"…
  moteur?: string | null // IA relevée, le cas échéant
  projet?: string | null
  unites?: number
  unite?: string
  coutUsd: number
  sourcePrix: 'api' | 'grille'
  reussi?: boolean
  dureeMs?: number
  detail?: Record<string, unknown>
}

export async function enregistrerAppel(a: AppelPayant) {
  return prisma.apiCall.create({
    data: {
      fournisseur: a.fournisseur,
      operation: a.operation,
      moteur: a.moteur ?? null,
      projet: a.projet ?? null,
      unites: a.unites ?? 1,
      unite: a.unite ?? 'appel',
      coutUsd: a.coutUsd.toFixed(6),
      sourcePrix: a.sourcePrix,
      reussi: a.reussi ?? true,
      dureeMs: a.dureeMs ?? null,
      detail: a.detail ? (a.detail as object) : undefined,
    },
  })
}

// ── Plafond mensuel ─────────────────────────────────────────────────────────
const CLE_PLAFOND = 'plafond_mensuel_usd'
const PLAFOND_PAR_DEFAUT = 20

export async function lirePlafond(): Promise<number> {
  const r = await prisma.reglage.findUnique({ where: { cle: CLE_PLAFOND } })
  const n = r ? Number(r.valeur) : NaN
  return Number.isFinite(n) && n >= 0 ? n : PLAFOND_PAR_DEFAUT
}

export async function ecrirePlafond(montant: number) {
  await prisma.reglage.upsert({
    where: { cle: CLE_PLAFOND },
    create: { cle: CLE_PLAFOND, valeur: String(montant) },
    update: { valeur: String(montant) },
  })
}

/** Premier instant du mois en cours, à l'heure de Paris, exprimé en UTC. */
export function debutDuMois(maintenant = new Date()): Date {
  const [annee, mois] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit' })
    .format(maintenant)
    .split('-')
    .map(Number)
  // Minuit à Paris = 23 h ou 22 h UTC la veille, selon l'heure d'été.
  const minuitUtc = Date.UTC(annee, mois - 1, 1)
  const decalage = decalageParisMs(new Date(minuitUtc))
  return new Date(minuitUtc - decalage)
}

function decalageParisMs(d: Date): number {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(d)
  const v = (t: string) => Number(p.find((x) => x.type === t)!.value)
  return Date.UTC(v('year'), v('month') - 1, v('day'), v('hour'), v('minute'), v('second')) - d.getTime()
}

export async function depenseDepuis(debut: Date): Promise<number> {
  const r = await prisma.apiCall.aggregate({ _sum: { coutUsd: true }, where: { createdAt: { gte: debut } } })
  return Number(r._sum.coutUsd ?? 0)
}

/**
 * À appeler AVANT tout appel payant planifié : renvoie false quand la dépense
 * du mois a atteint le plafond. Les relevés se suspendent alors d'eux-mêmes.
 */
export async function budgetDisponible(): Promise<boolean> {
  const [plafond, depense] = await Promise.all([lirePlafond(), depenseDepuis(debutDuMois())])
  return depense < plafond
}

// ── Lecture pour le tableau de bord ─────────────────────────────────────────
export type LigneRepartition = { cle: string; cout: number; appels: number }

async function repartition(champ: 'fournisseur' | 'moteur' | 'projet' | 'operation', debut: Date): Promise<LigneRepartition[]> {
  const lignes = await prisma.apiCall.groupBy({
    by: [champ],
    where: { createdAt: { gte: debut } },
    _sum: { coutUsd: true },
    _count: { _all: true },
  })
  return lignes
    .map((l) => ({ cle: (l[champ] as string | null) ?? 'Non précisé', cout: Number(l._sum.coutUsd ?? 0), appels: l._count._all }))
    .sort((a, b) => b.cout - a.cout)
}

export async function lireTableauDeBord() {
  const maintenant = new Date()
  const mois = debutDuMois(maintenant)
  const il_y_a_30j = new Date(maintenant.getTime() - 30 * 86_400_000)
  const debutJour = new Date(maintenant.getTime() - 86_400_000)

  const [plafond, depenseMois, depense24h, totalAppelsMois, echecsMois, releves, parFournisseur, parMoteur, parProjet, parOperation, parJour, derniers, premier] =
    await Promise.all([
      lirePlafond(),
      depenseDepuis(mois),
      depenseDepuis(debutJour),
      prisma.apiCall.count({ where: { createdAt: { gte: mois } } }),
      prisma.apiCall.count({ where: { createdAt: { gte: mois }, reussi: false } }),
      prisma.apiCall.aggregate({ _sum: { coutUsd: true }, _count: { _all: true }, where: { createdAt: { gte: mois }, operation: 'releve', reussi: true } }),
      repartition('fournisseur', mois),
      repartition('moteur', mois),
      repartition('projet', mois),
      repartition('operation', mois),
      prisma.$queryRaw<{ jour: string; cout: number; appels: number }[]>`
        SELECT to_char((("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris')::date, 'YYYY-MM-DD') AS jour,
               SUM("coutUsd")::float8 AS cout, COUNT(*)::int AS appels
        FROM "ApiCall" WHERE "createdAt" >= ${il_y_a_30j}
        GROUP BY 1 ORDER BY 1`,
      prisma.apiCall.findMany({ orderBy: { createdAt: 'desc' }, take: 40 }),
      prisma.apiCall.findFirst({ orderBy: { createdAt: 'asc' }, select: { createdAt: true } }),
    ])

  const nbReleves = releves._count._all
  return {
    plafond,
    depenseMois,
    depense24h,
    totalAppelsMois,
    echecsMois,
    coutMoyenReleve: nbReleves ? Number(releves._sum.coutUsd ?? 0) / nbReleves : null,
    nbReleves,
    parFournisseur,
    parMoteur: parMoteur.filter((l) => l.cle !== 'Non précisé'),
    parProjet,
    parOperation,
    parJour,
    derniers: derniers.map((d) => ({ ...d, coutUsd: Number(d.coutUsd) })),
    premierAppel: premier?.createdAt ?? null,
    debutMois: mois,
    maintenant,
  }
}

// ── Lectures ajoutées pour la refonte de l'interface ────────────────────────

/** Dépense de chaque projet depuis une date (le journal range les appels par nom de projet). */
export async function depenseParProjet(debut: Date): Promise<Map<string, { cout: number; appels: number }>> {
  const lignes = await prisma.apiCall.groupBy({ by: ['projet'], where: { createdAt: { gte: debut } }, _sum: { coutUsd: true }, _count: { _all: true } })
  return new Map(lignes.map((l) => [l.projet ?? '', { cout: Number(l._sum.coutUsd ?? 0), appels: l._count._all }]))
}

/** Dépense par jour et par fournisseur sur 30 jours, à l'heure de Paris. */
export async function depenseParJourEtFournisseur(depuis: Date) {
  return prisma.$queryRaw<{ jour: string; fournisseur: string; cout: number; appels: number }[]>`
    SELECT to_char((("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris')::date, 'YYYY-MM-DD') AS jour,
           "fournisseur", SUM("coutUsd")::float8 AS cout, COUNT(*)::int AS appels
    FROM "ApiCall" WHERE "createdAt" >= ${depuis}
    GROUP BY 1, 2 ORDER BY 1`
}

/** Dernier appel réussi de chaque fournisseur : sert à dire si une connexion fonctionne. */
export async function derniersAppelsReussis(): Promise<Map<string, Date>> {
  const lignes = await prisma.apiCall.groupBy({ by: ['fournisseur'], where: { reussi: true }, _max: { createdAt: true } })
  return new Map(lignes.filter((l) => l._max.createdAt).map((l) => [l.fournisseur, l._max.createdAt!]))
}

// ── Seuil de confirmation d'un envoi ────────────────────────────────────────
const CLE_SEUIL = 'seuil_confirmation_usd'
const SEUIL_PAR_DEFAUT = 1

/** Au-dessus de ce montant, le lancement d'un relevé demande une confirmation. */
export async function lireSeuilConfirmation(): Promise<number> {
  const r = await prisma.reglage.findUnique({ where: { cle: CLE_SEUIL } })
  const n = r ? Number(r.valeur) : NaN
  return Number.isFinite(n) && n >= 0 ? n : SEUIL_PAR_DEFAUT
}

export async function ecrireSeuilConfirmation(montant: number) {
  await prisma.reglage.upsert({ where: { cle: CLE_SEUIL }, create: { cle: CLE_SEUIL, valeur: String(montant) }, update: { valeur: String(montant) } })
}
