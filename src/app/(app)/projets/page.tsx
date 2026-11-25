import Link from 'next/link'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { redirect } from 'next/navigation'
import { EnTete, LigneMethode, Vide } from '@/components/outil/Blocs'
import { projetAffiche, titreOnglet } from '@/lib/contexte'
import { debutDuMois, depenseParProjet } from '@/lib/couts'
import { traducteur } from '@/lib/i18n/serveur'
import { jourLong, langueEtPays, maintenant, pct, pluriel, usdFin } from '@/lib/libelles'
import { compter, deMethode, lireMesures, SEUIL_CHIFFRE } from '@/lib/mesures'
import { listerProjets } from '@/lib/projets'
import { choisirProjet } from './actions'

export const generateMetadata = () => titreOnglet('Projets')
export const dynamic = 'force-dynamic'

const JOUR = 86_400_000

export default async function Projets({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const t = await traducteur()
  const { erreur } = await searchParams
  // Une erreur de création renvoie ici : on la montre dans le formulaire de création.
  if (erreur) redirect(`/projets/nouveau?erreur=${encodeURIComponent(erreur)}`)
  const [projets, courant, depenses] = await Promise.all([listerProjets(), projetAffiche(), depenseParProjet(debutDuMois())])
  const mesures = await Promise.all(projets.map((p) => lireMesures(p.id)))
  const instant = maintenant()

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Régler') }, { libelle: t('Projets') }]} actions={projets.length > 0 ? <Link href="/projets/nouveau" className="bouton bouton-petit">{t('Nouveau projet')}</Link> : undefined} />
      <EnTete
        titre={t('Projets')}
        verdict={projets.length === 0 ? t('Aucun projet pour l’instant : un projet suit une marque, ses sites, ses chaînes, ses concurrents et les questions de ses clients.') : t('{n} [n:projet|projets]. Le projet affiché dans tout l’outil est {nom}.', { n: projets.length, nom: courant?.nom ?? projets[0].nom })}
      />

      {projets.length === 0 ? (
        <Vide titre={t('Créez votre première marque à suivre.')} action={<Link href="/projets/nouveau" className="bouton">{t('Nouveau projet')}</Link>}>
          <ul className="puces mt-3 max-w-xl">
            <li>{t('Le nom de la marque, tel que les IA l’écrivent.')}</li>
            <li>{t('Son site et sa chaîne YouTube, pour que leurs citations comptent pour elle.')}</li>
            <li>{t('Une dizaine de questions que vos clients posent aux IA.')}</li>
          </ul>
          <p className="mt-3">{t('Créer un projet ne coûte rien : la dépense commence quand vous lancez un relevé.')}</p>
        </Vide>
      ) : (
        <ul className="grid gap-6 xl:grid-cols-2">
          {projets.map((p, i) => {
            const m = mesures[i]
            const ui = m ? compter(deMethode(m.releves, 'interface')) : null
            const dernierUi = m ? deMethode(m.tous, 'interface').at(-1)?.createdAt : undefined
            const prochain = dernierUi ? new Date(dernierUi.getTime() + 7 * JOUR) : null
            const depense = depenses.get(p.nom)?.cout ?? 0
            const sites = p.proprietes.filter((x) => x.type === 'site').length
            const chaines = p.proprietes.filter((x) => x.type === 'youtube').length
            const profils = p.proprietes.filter((x) => x.type === 'profil').length
            return (
              <li key={p.id} className="ecran">
                <div className="ecran-barre">
                  <Link href={`/projets/${p.id}`} className="titre text-[1.5rem] hover:underline">{p.nom}</Link>
                  {courant?.id === p.id ? <span className="etiquette-nous">{t('affiché dans l’outil')}</span> : (
                    <form action={choisirProjet}><input type="hidden" name="projetId" value={p.id} /><button type="submit" className="bouton bouton-creux bouton-petit">{t('Afficher ce projet')}</button></form>
                  )}
                </div>
                <p className="second border-b border-[var(--filet)] px-4 py-2">{langueEtPays(p.langue, p.pays)} · {pluriel(p._count.questions, 'question')} · {pluriel(sites, 'site')} · {pluriel(chaines, 'chaîne')}{profils > 0 && <> · {pluriel(profils, 'réseau', 'réseaux')}</>} · {pluriel(p._count.concurrents, 'concurrent')}</p>
                <dl className="tuiles" style={{ '--colonnes': 4 } as React.CSSProperties}>
                  <div className="tuile">
                    <dt className="etiquette">{t('Dernier relevé')}</dt>
                    <dd className="mt-1 font-semibold">{m?.tous.at(-1) ? jourLong(m.tous.at(-1)!.createdAt) : 'aucun'}</dd>
                    {m && m.enAttente > 0 && <dd className="second">{t('{n} [n:réponse|réponses] en attente', { n: m.enAttente })}</dd>}
                  </div>
                  <div className="tuile">
                    <dt className="etiquette">{t('Visibilité')}</dt>
                    <dd className="chiffre mt-1 font-semibold">{!ui || ui.n === 0 ? t('n.c.') : ui.n >= SEUIL_CHIFFRE ? `${pct(ui.k / ui.n)} · ${t('{k} sur {n}', { k: ui.k, n: ui.n })}` : t('{k} sur {n}', { k: ui.k, n: ui.n })}</dd>
                    <dd className="mt-1.5"><LigneMethode methode="interface" n={ui?.n ?? 0} unite="réponse" /></dd>
                  </div>
                  <div className="tuile">
                    <dt className="etiquette">{t('Dépense du mois')}</dt>
                    <dd className="chiffre mt-1 font-semibold">{usdFin(depense)}</dd>
                    <dd className="second">{pluriel(depenses.get(p.nom)?.appels ?? 0, 'appel')}</dd>
                  </div>
                  <div className="tuile">
                    <dt className="etiquette">{t('Prochain relevé conseillé')}</dt>
                    <dd className="mt-1 font-semibold">{!prochain || prochain.getTime() <= instant ? t('dès maintenant') : t('le {date}', { date: jourLong(prochain) })}</dd>
                    <dd className="second">{p.releveAuto ? t('Relevé hebdomadaire automatique') : t('Relevés lancés à la main')}</dd>
                  </div>
                </dl>
                <p className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--filet)] px-4 py-2.5">
                  <Link href={`/projets/${p.id}?onglet=releves`} className="lien-fleche">{t('Lancer un relevé')} <span aria-hidden="true">→</span></Link>
                  <Link href={`/projets/${p.id}?onglet=questions`} className="lien-fleche">{t('Questions')} <span aria-hidden="true">→</span></Link>
                  <Link href={`/projets/${p.id}?onglet=marque`} className="lien-fleche">{t('Marque et propriétés')} <span aria-hidden="true">→</span></Link>
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
