'use server'

import { refresh, revalidatePath } from 'next/cache'
import { annoncer } from '@/lib/annonce'
import { traducteur } from '@/lib/i18n/serveur'
import { prisma } from '@/lib/prisma'
import { marqueDe, projetCourant } from '@/lib/projets'
import { exigerSession } from '@/lib/session'
import { DEMARCHES, lireTravail, REPONSES } from '@/lib/travail'

/*
 * Suivi de la liste de travail : état d'une ligne, note libre, date du « fait »,
 * journal des prises de contact. Tout est gratuit : aucun appel payant ici.
 */

const ETATS = ['a_faire', 'en_cours', 'fait', 'ecarte']

/** Date saisie (« 2026-11-14 »), à midi pour ne pas glisser d'un jour. Null si elle est illisible ou dans le futur. */
function dateSaisie(v: FormDataEntryValue | null): Date | null {
  const t = String(v ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null
  const d = new Date(`${t}T12:00:00Z`)
  return Number.isNaN(d.getTime()) || d.getTime() > Date.now() + 86_400_000 ? null : d
}

/**
 * Change l'état d'une ligne de la liste de travail. Quand elle passe à « fait »,
 * on garde la date et une copie de la ligne (titre, questions) : c'est ce qui
 * permet de mesurer « avant / après », même si la ligne sort ensuite de la liste.
 */
export async function changerEtat(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const cle = String(donnees.get('cle') ?? '')
  const etat = String(donnees.get('etat') ?? '')
  if (!projet || !cle || !ETATS.includes(etat)) return
  const [avant, lignes] = await Promise.all([prisma.etatAction.findUnique({ where: { projetId_cle: { projetId: projet.id, cle } } }), lireTravail(projet.id, marqueDe(projet))])
  const ligne = lignes.find((l) => l.cle === cle)
  // Une ligne épinglée à la main garde sa trace quand elle revient à « à faire », sinon elle sortirait de la liste.
  const stocke = etat === 'a_faire' && (donnees.get('ajoutee') === '1' || avant?.etat === 'ajoute') ? 'ajoute' : etat
  const copie = ligne ? { titre: ligne.titre, famille: ligne.famille, lien: ligne.lien, questionIds: ligne.preuves.map((p) => p.id) } : {}
  // La date du « fait » ne bouge pas si la ligne l'était déjà.
  const faitLe = etat === 'fait' ? (avant?.etat === 'fait' && avant.faitLe ? avant.faitLe : new Date()) : null
  await prisma.etatAction.upsert({
    where: { projetId_cle: { projetId: projet.id, cle } },
    create: { projetId: projet.id, cle, etat: stocke, faitLe, ...copie },
    update: { etat: stocke, faitLe, ...copie },
  })
  await annoncer((await traducteur())('État enregistré'))
  refresh()
}

/** Enregistre la note libre d'une ligne, et la date à laquelle l'action a été faite si elle est saisie. */
export async function noterAction(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const cle = String(donnees.get('cle') ?? '')
  if (!projet || !cle) return
  const note = String(donnees.get('note') ?? '').trim().slice(0, 2000) || null
  const date = dateSaisie(donnees.get('faitLe'))
  const avant = await prisma.etatAction.findUnique({ where: { projetId_cle: { projetId: projet.id, cle } } })
  await prisma.etatAction.upsert({
    where: { projetId_cle: { projetId: projet.id, cle } },
    create: { projetId: projet.id, cle, etat: 'a_faire', note },
    update: { note, ...(avant?.etat === 'fait' && date ? { faitLe: date } : {}) },
  })
  await annoncer((await traducteur())('Note enregistrée'))
  refresh()
}

/** Ajoute une prise de contact au journal d'une ligne : à qui, quand, pour demander quoi. */
export async function ajouterDemarche(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const cle = String(donnees.get('cle') ?? '')
  const type = String(donnees.get('type') ?? '')
  const reponse = String(donnees.get('reponse') ?? 'attente')
  if (!projet || !cle || !(type in DEMARCHES) || !(reponse in REPONSES)) return
  await prisma.demarche.create({
    data: {
      projetId: projet.id, cle, type, reponse,
      faiteLe: dateSaisie(donnees.get('faiteLe')) ?? new Date(),
      contact: String(donnees.get('contact') ?? '').trim().slice(0, 200) || null,
      note: String(donnees.get('note') ?? '').trim().slice(0, 1000) || null,
    },
  })
  // La ligne garde une trace : une page contactée reste dans la liste, même si elle n'est plus citée.
  await prisma.etatAction.upsert({ where: { projetId_cle: { projetId: projet.id, cle } }, create: { projetId: projet.id, cle, etat: 'en_cours' }, update: {} })
  await annoncer((await traducteur())('Prise de contact ajoutée au journal'))
  refresh()
}

/** Note la réponse reçue à une prise de contact, ou la retire du journal. */
export async function majDemarche(donnees: FormData) {
  await exigerSession()
  const projet = await projetCourant()
  const id = String(donnees.get('id') ?? '')
  if (!projet) return
  if (donnees.get('retirer') === '1') await prisma.demarche.deleteMany({ where: { id, projetId: projet.id } })
  else {
    const reponse = String(donnees.get('reponse') ?? '')
    if (reponse in REPONSES) await prisma.demarche.updateMany({ where: { id, projetId: projet.id }, data: { reponse } })
  }
  await annoncer((await traducteur())('Journal mis à jour'))
  revalidatePath('/actions')
}
