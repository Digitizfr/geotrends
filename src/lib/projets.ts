import { cookies } from 'next/headers'
import { prisma } from './prisma'
import type { Marque } from './releves'

// ── Projets ─────────────────────────────────────────────────────────────────
// Un projet = une marque suivie. Le projet affiché est retenu dans un cookie :
// toutes les pages de l'outil (relevés, visibilité) lisent ce projet-là.

export const COOKIE_PROJET = 'gt_projet'

type AvecProprietes = { marque: string; proprietes: { type: string; valeur: string; libelle: string | null }[] }

/** La marque d'un projet, avec toutes ses propriétés (sites et chaînes YouTube). */
export function marqueDe(p: AvecProprietes): Marque {
  return {
    nom: p.marque,
    domaines: p.proprietes.filter((x) => x.type === 'site').map((x) => x.valeur),
    chainesYoutube: p.proprietes.filter((x) => x.type === 'youtube').map((x) => ({ id: x.valeur, nom: x.libelle ?? x.valeur })),
    // Une autre écriture du nom est rangée comme une propriété de type « nom ».
    ecritures: p.proprietes.filter((x) => x.type === 'nom').map((x) => x.valeur),
    profils: p.proprietes.filter((x) => x.type === 'profil').map((x) => x.valeur),
  }
}

export async function listerProjets() {
  return prisma.projet.findMany({
    where: { archive: false },
    orderBy: { createdAt: 'asc' },
    include: { proprietes: true, _count: { select: { questions: { where: { archive: false } }, concurrents: true } } },
  })
}

export async function lireProjet(id: string) {
  return prisma.projet.findUnique({
    where: { id },
    include: {
      proprietes: { orderBy: [{ type: 'asc' }, { valeur: 'asc' }] },
      concurrents: { orderBy: { nom: 'asc' } },
      questions: { orderBy: [{ archive: 'asc' }, { ordre: 'asc' }], include: { _count: { select: { releves: true } } } },
    },
  })
}

/** Le projet affiché : celui du cookie, sinon le plus ancien. Null s'il n'existe aucun projet. */
export async function projetCourant() {
  const id = (await cookies()).get(COOKIE_PROJET)?.value
  const choisi = id ? await prisma.projet.findFirst({ where: { id, archive: false }, include: { proprietes: true } }) : null
  return choisi ?? prisma.projet.findFirst({ where: { archive: false }, orderBy: { createdAt: 'asc' }, include: { proprietes: true } })
}

/** Domaine propre à partir d'une saisie libre : « https://www.exemple.fr/page » → « exemple.fr ». */
export function domaineSaisi(saisie: string): string | null {
  const t = saisie.trim().toLowerCase()
  if (!t) return null
  try {
    const hote = new URL(t.includes('://') ? t : `https://${t}`).hostname.replace(/^www\./, '')
    return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(hote) ? hote : null
  } catch {
    return null
  }
}

/** Lignes non vides d'un champ de texte, sans doublon. */
export function lignes(v: FormDataEntryValue | null): string[] {
  return [...new Set(String(v ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean))]
}

/** Dernier relevé et nombre de relevés de chaque projet : pour le sélecteur du menu et la liste des projets. */
export async function activiteDesProjets(): Promise<Map<string, { dernier: Date; releves: number }>> {
  const lignes = await prisma.$queryRaw<{ id: string; dernier: Date; releves: number }[]>`
    SELECT q."projetId" AS id, MAX(r."createdAt") AS dernier, COUNT(r.id)::int AS releves
    FROM "Question" q JOIN "Releve" r ON r."questionId" = q.id
    GROUP BY 1`
  return new Map(lignes.map((l) => [l.id, { dernier: l.dernier, releves: l.releves }]))
}
