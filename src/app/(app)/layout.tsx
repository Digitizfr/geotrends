import { cookies } from 'next/headers'
import { Gloock, Hanken_Grotesk } from 'next/font/google'
import { lireAnnonce } from '@/lib/annonce'
import { classerMarques, classerSources } from '@/lib/classements'
import { mesuresAffichees, projetAffiche } from '@/lib/contexte'
import { debutDuMois, depenseDepuis, lirePlafond } from '@/lib/couts'
import { FournisseurLangue } from '@/lib/i18n/client'
import { traducteur } from '@/lib/i18n/serveur'
import { jourLong, langueEtPays, usd } from '@/lib/libelles'
import { prisma } from '@/lib/prisma'
import { activiteDesProjets, listerProjets, marqueDe } from '@/lib/projets'
import { estAdmin, exigerSession } from '@/lib/session'
import { lireTravail } from '@/lib/travail'
import { Cadre, COOKIE_MENU, type Depense } from './Cadre'
import { COOKIE_GROUPES } from './Navigation'
import type { EntreeRecherche } from './Palette'
// La feuille du site d'abord (jetons, classes communes), puis ce que l'outil y ajoute.
import '../vitrine.css'
import './outil.css'
import './interface.css'

// Les mêmes polices que le site public : Gloock pour les titres et le logo,
// Hanken Grotesk pour le texte. JetBrains Mono vient de la racine.
const titre = Gloock({ subsets: ['latin'], weight: '400', variable: '--font-titre' })
const corps = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-corps' })

// L'outil est derrière une connexion : jamais proposé aux moteurs de recherche.
export const metadata = { robots: { index: false, follow: false } }

export default async function EspaceInterne({ children }: { children: React.ReactNode }) {
  const session = await exigerSession()
  const t = await traducteur()
  const admin = estAdmin(session)
  const [projets, courant, activite, mesures, c, annonce] = await Promise.all([listerProjets(), projetAffiche(), activiteDesProjets(), mesuresAffichees(), cookies(), lireAnnonce()])
  const travail = courant ? await lireTravail(courant.id, marqueDe(courant)) : []
  const contradictions = courant ? await prisma.contradiction.count({ where: { ecartee: false, fait: { projetId: courant.id } } }) : 0
  const duMenu = projets.map((p) => ({
    id: p.id,
    nom: p.nom,
    marche: langueEtPays(p.langue, p.pays).split(', ').reverse().join(' · '),
    dernier: activite.get(p.id) ? jourLong(activite.get(p.id)!.dernier) : null,
  }))

  // Le plafond de dépense du mois : une ligne en bas du menu, pour les administrateurs (les coûts leur sont réservés).
  let depense: Depense | null = null
  if (admin) {
    const [depuis, plafond] = await Promise.all([depenseDepuis(debutDuMois()), lirePlafond()])
    depense = { texte: `${usd(depuis)} / ${usd(plafond, 0)}`, part: plafond > 0 ? depuis / plafond : 0, depasse: depuis > plafond, lien: true }
  }

  // Ce que la recherche rapide sait trouver : les questions, les marques nommées et les sites cités du projet affiché.
  const recherche: EntreeRecherche[] = []
  if (mesures) {
    for (const q of mesures.questions) recherche.push({ genre: 'question', libelle: q.texte, href: `/questions/${q.id}` })
    const marques = classerMarques(mesures, mesures.tous).lignes.filter((l) => !l.aNous && (l.reponses > 0 || l.suivie))
    for (const l of marques.slice(0, 60)) recherche.push({ genre: 'marque', libelle: l.nom, href: `/reponses?marque=${encodeURIComponent(l.nom)}`, note: l.suivie ? t('concurrent suivi') : undefined })
    const sources = classerSources(mesures, mesures.tous)
    for (const d of sources.domaines.slice(0, 120)) recherche.push({ genre: 'site', libelle: d.domaine, href: `/sources?fiche=${encodeURIComponent(d.domaine)}`, note: d.qui === 'nous' ? t('à nous') : undefined })
    // Les pages : celles qu'on suit (leur fiche), puis les pages citées, celles de la marque en premier.
    const suivies = await prisma.pageSuivie.findMany({ where: { projetId: mesures.projet.id }, select: { id: true, url: true, titre: true } })
    for (const p of suivies) recherche.push({ genre: 'page', libelle: p.titre ?? p.url, href: `/pages?fiche=${p.id}#fiche`, note: `${t('page suivie')} · ${p.url.replace(/^https?:\/\/(www\.)?/, '')}` })
    const citees = [...sources.pages.filter((p) => p.qui === 'nous'), ...sources.pages.filter((p) => p.qui !== 'nous')].filter((p) => !suivies.some((s) => s.url === p.url)).slice(0, 200)
    for (const p of citees) recherche.push({ genre: 'page', libelle: p.titre ?? p.url, href: `/sources?onglet=pages&fiche=${encodeURIComponent(p.url)}#fiche`, note: `${p.qui === 'nous' ? `${t('à nous')} · ` : ''}${p.url.replace(/^https?:\/\/(www\.)?/, '')}` })
  }

  return (
    <div className={`site outil ${titre.variable} ${corps.variable}`} lang={t.langue}>
      <FournisseurLangue langue={t.langue}>
        <Cadre
          admin={admin}
          compteurs={{ aFaire: travail.filter((l) => l.etat === 'a_faire').length, enAttente: mesures?.enAttente ?? 0, contradictions }}
          projets={duMenu}
          courant={courant?.id ?? ''}
          reduitInitial={c.get(COOKIE_MENU)?.value === 'reduit'}
          fermesInitial={(c.get(COOKIE_GROUPES)?.value ?? '').split(',').filter(Boolean)}
          compte={{ nom: session.user.name, email: session.user.email }}
          depense={depense}
          recherche={recherche}
          annonce={annonce}
        >
          {children}
        </Cadre>
      </FournisseurLangue>
    </div>
  )
}
