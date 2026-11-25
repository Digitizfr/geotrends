import { fixerLangue } from '@/lib/i18n/courante'
import { traducteur } from '@/lib/i18n/serveur'
import { marqueDe, projetCourant } from '@/lib/projets'
import { prisma } from '@/lib/prisma'
import { estALaMarque, presence } from '@/lib/releves'
import { libelleType, lireSites, typeCertain } from '@/lib/sites'
import { estAdmin, lireSession } from '@/lib/session'
import { lireTravail } from '@/lib/travail'

// Exports CSV du projet affiché : /api/export/questions, /sources, /actions.
// Et /api/export/appels : le journal des coûts entier, pour les administrateurs.
// Les en-têtes et les valeurs fixes (oui, non, états, types) suivent la langue
// de l'interface de la personne qui télécharge ; les données ne sont jamais
// traduites. En français : séparateur point-virgule et virgule décimale, pour
// que le fichier s'ouvre tel quel dans Excel en français. En anglais : virgule
// et point décimal. La marque d'ordre des octets est gardée dans les deux cas.

const cellule = (v: unknown, separateur: string) => {
  const texte = v === null || v === undefined ? '' : String(v)
  return texte.includes('"') || texte.includes(separateur) || /[\n\r]/.test(texte) ? `"${texte.replace(/"/g, '""')}"` : texte
}
const csv = (lignes: unknown[][], separateur: string) => '﻿' + lignes.map((l) => l.map((v) => cellule(v, separateur)).join(separateur)).join('\r\n') + '\r\n'
const date = (d: Date | null) => (d ? d.toISOString().slice(0, 16).replace('T', ' ') : '')

export async function GET(_requete: Request, { params }: { params: Promise<{ quoi: string }> }) {
  const session = await lireSession()
  const t = await traducteur()
  // Hors d'un rendu de page : la langue est fixée ici pour les phrases écrites par les bibliothèques (titres des actions).
  fixerLangue(t.langue)
  if (!session) return new Response(t('Connexion requise'), { status: 401 })
  const fr = t.langue === 'fr'
  const separateur = fr ? ';' : ','
  const ouiNon = (v: boolean) => (v ? t('oui') : t('non'))
  const montant = (n: number) => (fr ? n.toFixed(6).replace('.', ',') : n.toFixed(6))
  const tetes = (noms: string[]) => noms.map((x) => t(x))
  const { quoi } = await params

  // Journal des coûts : tous les appels payants, tous projets. Réservé aux administrateurs.
  if (quoi === 'appels') {
    if (!estAdmin(session)) return new Response(t('Réservé aux administrateurs'), { status: 403 })
    const appels = await prisma.apiCall.findMany({ orderBy: { createdAt: 'desc' }, take: 50_000 })
    const detail = (d: unknown) => (d && typeof d === 'object' ? (d as Record<string, unknown>) : {})
    const lignesAppels: unknown[][] = [
      tetes(['Date (UTC)', 'Fournisseur', 'Type d’appel', 'IA', 'Projet', 'Volume', 'Unité', 'Prix ($)', 'Origine du prix', 'Réussi', 'Durée (ms)', 'Modèle', 'Erreur']),
      ...appels.map((a) => [date(a.createdAt), a.fournisseur, a.operation, a.moteur, a.projet, a.unites, a.unite, montant(Number(a.coutUsd)), a.sourcePrix === 'api' ? t('renvoyé par le fournisseur') : t('calculé depuis la grille'), ouiNon(a.reussi), a.dureeMs, detail(a.detail).modele, detail(a.detail).erreur]),
    ]
    return new Response(csv(lignesAppels, separateur), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="geotrends-appels-${new Date().toISOString().slice(0, 10)}.csv"`, 'Cache-Control': 'no-store' } })
  }

  const projet = await projetCourant()
  if (!projet) return new Response(t('Aucun projet'), { status: 404 })
  const marque = marqueDe(projet)
  let lignes: unknown[][]

  if (quoi === 'actions') {
    const travail = await lireTravail(projet.id, marque)
    lignes = [tetes(['Famille', 'Action', 'Détail', 'Page visée', 'Type du site', 'Poids (1 à 5)', 'État', 'Faite le', 'Note', 'Questions à l’appui']), ...travail.map((l) => [l.famille, l.titre, l.detail, l.lien, l.type ? t(libelleType(l.type)) : '', l.gain, l.etat, date(l.faitLe), l.note, l.preuves.map((p) => p.texte).join(' | ')])]
  } else if (quoi === 'questions' || quoi === 'sources') {
    const releves = await prisma.releve.findMany({
      where: { question: { projetId: projet.id } },
      orderBy: [{ question: { ordre: 'asc' } }, { moteur: 'asc' }, { createdAt: 'asc' }],
      select: {
        moteur: true, methode: true, statut: true, modele: true, createdAt: true, releveLe: true, texte: true, coutUsd: true, approfondi: true,
        question: { select: { texte: true, theme: true, intention: true } },
        sources: { orderBy: { position: 'asc' }, select: { position: true, url: true, domaine: true, titre: true, role: true, videoYoutube: { select: { chaineId: true, chaineNom: true } } } },
        mentions: { where: { origine: 'analyse' }, orderBy: { rang: 'asc' }, select: { nom: true } },
      },
    })
    if (quoi === 'questions') {
      lignes = [tetes(['Question', 'Thème', 'Intention', 'IA', 'Méthode', 'Envoyé le', 'Relevé le', 'Statut', 'Mesure approfondie', 'Modèle', 'Site cité', 'Vidéo citée', 'Nom dans le texte', 'Sources citées', 'Marques nommées (dans l’ordre)', 'Prix ($)'])]
      for (const r of releves) {
        const p = r.statut === 'recu' ? presence(r.texte, r.sources, marque) : null
        lignes.push([r.question.texte, r.question.theme, r.question.intention, r.moteur, r.methode, date(r.createdAt), date(r.releveLe), r.statut, ouiNon(r.approfondi), r.modele, p ? ouiNon(p.citeeSite) : '', p ? ouiNon(p.citeeYoutube) : '', p ? ouiNon(p.mentionnee) : '', r.sources.filter((s) => s.role === 'citee').length, r.mentions.map((m) => m.nom).join(' | '), Number(r.coutUsd).toFixed(4)])
      }
    } else {
      // Type et propriétaire de chaque site : le classement gardé en base, sinon « à classer ».
      const [sites, concurrents] = await Promise.all([lireSites(), prisma.concurrent.findMany({ where: { projetId: projet.id }, select: { nom: true, domaine: true } })])
      const simple = (t: string) => t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '')
      const aQui = (s: (typeof releves)[number]['sources'][number]) => {
        if (estALaMarque(s, marque)) return t('à nous')
        const fiche = sites.get(s.domaine)
        const proprietaire = fiche?.type === 'marque' && fiche.marque ? simple(fiche.marque) : ''
        const nom = simple(s.domaine.split('.').slice(-2, -1)[0] ?? '')
        if (concurrents.some((c) => (c.domaine && (s.domaine === c.domaine || s.domaine.endsWith(`.${c.domaine}`))) || (simple(c.nom).length >= 3 && (simple(c.nom) === nom || (!!proprietaire && proprietaire.includes(simple(c.nom))))))) return t('concurrent suivi')
        return fiche?.type === 'marque' ? t('autre marque') : t('tiers')
      }
      lignes = [tetes(['Question', 'IA', 'Méthode', 'Relevé le', 'Rôle', 'Rang', 'Domaine', 'Adresse', 'Titre', 'Chaîne YouTube', 'Type du site', 'Marque propriétaire', 'À qui'])]
      for (const r of releves) for (const s of r.sources) {
        const type = s.videoYoutube ? 'video' : (sites.get(s.domaine)?.type ?? typeCertain(s.domaine) ?? 'a_classer')
        lignes.push([r.question.texte, r.moteur, r.methode, date(r.releveLe ?? r.createdAt), s.role === 'citee' ? t('citée') : t('lue sans être citée'), s.position, s.domaine, s.url, s.titre, s.videoYoutube?.chaineNom ?? '', estALaMarque(s, marque) && !s.videoYoutube ? t('site de la marque') : t(libelleType(type)), sites.get(s.domaine)?.marque ?? '', aQui(s)])
      }
    }
  } else return new Response(t('Export inconnu'), { status: 404 })

  const nom = `geotrends-${projet.nom.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${quoi}-${new Date().toISOString().slice(0, 10)}.csv`
  return new Response(csv(lignes, separateur), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${nom}"`, 'Cache-Control': 'no-store' } })
}
