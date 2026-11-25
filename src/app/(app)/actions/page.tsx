import Link from 'next/link'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { adresse, Choix, CommentLire, EcartLu, EnTete, LigneMethode, Onglets, Vide } from '@/components/outil/Blocs'
import { BoutonEnvoi } from '@/components/outil/BoutonEnvoi'
import { lienReponse } from '@/components/outil/ListeReponses'
import { exigerMesures, titreOnglet } from '@/lib/contexte'
import { tr } from '@/lib/i18n/courante'
import { traducteur } from '@/lib/i18n/serveur'
import { adresseCourte, cleJour, jourLong, maintenant, nomCourt, pluriel } from '@/lib/libelles'
import { compter, deMethode, ecart, type Ecart, type Mesures } from '@/lib/mesures'
import { marqueDe } from '@/lib/projets'
import { libelleType } from '@/lib/sites'
import { DEMARCHES, lireActionsFaites, lireDemarches, lireTravail, REPONSES, type ActionFaite, type Etat, type Famille, type Ligne } from '@/lib/travail'
import { ajouterDemarche, changerEtat, majDemarche, noterAction } from './actions'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Actions')

type Objectif = 'corriger' | 'apparaitre' | 'ecrire' | 'fait'
const OBJECTIF: Record<Famille, Objectif> = { reformuler: 'corriger', apparaitre: 'apparaitre', video: 'ecrire', referencement: 'ecrire', fait: 'fait' }
const OBJECTIFS: Record<Objectif, { titre: string; note: string }> = {
  corriger: { titre: 'Corriger nos pages', note: 'Nos pages déjà trouvées par une IA ou par Google, mais pas citées. Le gain le plus rapide.' },
  apparaitre: { titre: 'Apparaître ailleurs', note: 'Les pages des autres que les IA citent sur nos questions, sans nous. Les sites de marque en sont exclus ; les comparatifs, les médias et les annuaires passent devant.' },
  ecrire: { titre: 'Écrire ou filmer', note: 'Les sujets où il nous manque une page bien classée ou une vidéo.' },
  fait: { titre: 'Corriger un fait faux', note: 'Les réponses qui disent sur la marque autre chose qu’un fait vérifié.' },
}
const ETATS: { etat: Etat; libelle: string; classe: string }[] = [
  { etat: 'a_faire', libelle: 'À faire', classe: 'neutre' },
  { etat: 'en_cours', libelle: 'En cours', classe: 'cite' },
  { etat: 'fait', libelle: 'Fait', classe: 'nomme' },
  { etat: 'ecarte', libelle: 'Écartée', classe: 'sans' },
]
const QUATRE_SEMAINES = 28 * 86_400_000

type Params = { onglet?: string; etat?: string; objectif?: string; question?: string; grouper?: string; action?: string }

function Preuve({ l }: { l: Ligne }) {
  const chiffres = l.nbReponses ? `${pluriel(l.nbReponses, 'réponse')}${l.nbMoteurs ? `, ${pluriel(l.nbMoteurs, 'IA', 'IA')}` : ''}` : l.nbMoteurs ? tr('lue par {n} IA', { n: l.nbMoteurs }) : pluriel(l.preuves.length, 'question')
  return <Link href={l.preuves.length === 1 ? `/questions/${l.preuves[0].id}` : `/actions?action=${encodeURIComponent(l.cle)}#fiche`} className="lien chiffre whitespace-nowrap text-[0.8125rem]">{chiffres}</Link>
}

function ChangerEtat({ l }: { l: Ligne }) {
  return (
    <form action={changerEtat} className="flex flex-wrap gap-1 xl:flex-nowrap">
      <input type="hidden" name="cle" value={l.cle} />
      {l.ajoutee && <input type="hidden" name="ajoutee" value="1" />}
      {ETATS.map((e) => (
        <button key={e.etat} type="submit" name="etat" value={e.etat} aria-pressed={l.etat === e.etat} className="choix !min-h-0 !px-2 !py-0.5 !text-[0.75rem]">{tr(e.libelle)}</button>
      ))}
    </form>
  )
}

/**
 * Avant et après une action faite : la part des réponses d'interface où la
 * marque apparaît, sur les questions de l'action. Avant : les quatre semaines
 * qui précèdent la date. Après : depuis la date.
 */
function resultat(a: ActionFaite, m: Mesures) {
  const ids = new Set(a.questionIds)
  const rs = deMethode([...m.questions, ...m.archivees].filter((q) => ids.has(q.id)).flatMap((q) => q.tous), 'interface')
  // La journée du « fait » compte dans l'avant : un relevé du même jour a précédé l'effet de l'action.
  const jour = cleJour(a.faitLe)
  const debut = a.faitLe.getTime() - QUATRE_SEMAINES
  const avant = compter(rs.filter((r) => r.jour <= jour && r.createdAt.getTime() >= debut))
  const apres = compter(rs.filter((r) => r.jour > jour))
  return { avant, apres, e: ecart(avant, apres), aQuatreSemaines: new Date(a.faitLe.getTime() + QUATRE_SEMAINES) }
}

/** Le verdict, en clair : l'écart dépasse-t-il la marge d'erreur ? */
function enClair(e: Ecart | null, avant: number, apres: number): string {
  if (apres === 0) return tr('Aucun relevé depuis l’action : rien à comparer pour l’instant.')
  if (avant === 0) return tr('Aucun relevé dans les quatre semaines d’avant : pas de point de comparaison.')
  if (!e || e.sens === 'tot') return tr('Trop peu de relevés pour conclure : il en faut au moins 5 de chaque côté.')
  if (e.sens === 'marge') return tr('L’écart ne dépasse pas la marge d’erreur. On ne peut pas dire que quelque chose a changé.')
  return e.sens === 'hausse'
    ? tr('L’écart dépasse la marge d’erreur : la hausse est réelle. L’action n’en est pas forcément la seule cause.')
    : tr('L’écart dépasse la marge d’erreur : la baisse est réelle. L’action n’en est pas forcément la cause.')
}

export default async function Actions({ searchParams }: { searchParams: Promise<Params> }) {
  const t = await traducteur()
  const [m, sp] = await Promise.all([exigerMesures(), searchParams])
  const lignes = await lireTravail(m.projet.id, marqueDe(m.projet))
  const [faites, demarches] = await Promise.all([lireActionsFaites(m.projet.id, lignes), lireDemarches(m.projet.id)])
  const onglet = sp.onglet === 'resultats' ? 'resultats' : 'liste'
  const lien = (change: Record<string, string | undefined>) => adresse('/actions', sp, change)
  const etat = ETATS.some((e) => e.etat === sp.etat) ? (sp.etat as Etat) : sp.etat === 'tous' ? null : 'ouvertes'
  const filtrees = lignes
    .filter((l) => (etat === null ? true : etat === 'ouvertes' ? l.etat === 'a_faire' || l.etat === 'en_cours' : l.etat === etat))
    .filter((l) => !sp.objectif || OBJECTIF[l.famille] === sp.objectif)
    .filter((l) => !sp.question || l.preuves.some((p) => p.id === sp.question))
  const grouper = sp.grouper === 'etat' || sp.grouper === 'aucun' ? sp.grouper : 'objectif'
  const groupes: { cle: string; titre: string; note?: string; lignes: Ligne[] }[] =
    grouper === 'aucun' ? [{ cle: 'tout', titre: t('Toutes les actions'), lignes: filtrees }]
    : grouper === 'etat' ? ETATS.map((e) => ({ cle: e.etat, titre: t(e.libelle), lignes: filtrees.filter((l) => l.etat === e.etat) }))
    : (Object.keys(OBJECTIFS) as Objectif[]).map((o) => ({ cle: o, titre: t(OBJECTIFS[o].titre), note: t(OBJECTIFS[o].note), lignes: filtrees.filter((l) => OBJECTIF[l.famille] === o) }))
  const fiche = sp.action ? lignes.find((l) => l.cle === sp.action) : undefined
  // Une action faite qui est sortie de la liste garde sa fiche : sa note, son journal et son résultat.
  const ficheFaite = sp.action && !fiche ? faites.find((a) => a.cle === sp.action) : undefined
  const question = sp.question ? [...m.questions, ...m.archivees].find((q) => q.id === sp.question) : undefined
  const base = compter(deMethode(m.tous, 'interface')).n
  const preuvesFiche = fiche ? m.tous.filter((r) => (fiche.famille === 'fait' || r.methode === 'interface') && r.statut === 'recu' && fiche.preuves.some((p) => p.id === r.question.id) && (fiche.famille === 'fait' ? fiche.cle.endsWith(`:${r.id}`) : fiche.lien ? r.sources.some((s) => s.url === fiche.lien) : true)) : []
  const instant = maintenant()
  const cleFiche = fiche?.cle ?? ficheFaite?.cle
  const lienFiche = fiche?.lien ?? ficheFaite?.lien ?? null
  const journal = cleFiche ? (demarches.get(cleFiche) ?? []) : []
  const faiteFiche = cleFiche ? faites.find((a) => a.cle === cleFiche) : undefined
  const resultatFiche = faiteFiche ? resultat(faiteFiche, m) : null
  const aujourdhui = cleJour(new Date(instant))
  const texteQuestion = (id: string) => [...m.questions, ...m.archivees].find((q) => q.id === id)?.texte

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Agir') }, { libelle: t('Actions') }]} exportCsv="/api/export/actions" actions={<Link href="/audit" className="bouton bouton-creux bouton-petit">{t('Auditer une page')}</Link>} />
      <EnTete
        titre={t('Actions')}
        verdict={lignes.length === 0 ? t('Rien à proposer pour l’instant : la liste se remplit après chaque relevé.') : <>
          {t('{n} [n:action|actions] à faire, {cours} en cours, {faites} [faites:faite|faites].', { n: lignes.filter((l) => l.etat === 'a_faire').length, cours: lignes.filter((l) => l.etat === 'en_cours').length, faites: faites.length })}{' '}
          <span className="second">{t('Chaque ligne vient des relevés et renvoie à sa preuve : aucune note de gain inventée.')}</span>
        </>}
      />

      {lignes.length === 0 && faites.length === 0 ? (
        <Vide titre={t('La liste se remplit après le premier relevé.')} action={<Link href={`/projets/${m.projet.id}?onglet=releves`} className="bouton">{t('Préparer un relevé')}</Link>}>
          <p>{t('Elle réunit les pages où apparaître, vos pages à corriger, les sujets à couvrir et les faits faux à corriger.')}</p>
        </Vide>
      ) : (
        <>
          <section className="ecran" aria-label={t('Actions par objectif')}>
            <div className="tuiles" style={{ '--colonnes': 4 } as React.CSSProperties}>
              {(Object.keys(OBJECTIFS) as Objectif[]).map((o) => {
                const du = lignes.filter((l) => OBJECTIF[l.famille] === o)
                const ouvertes = du.filter((l) => l.etat === 'a_faire' || l.etat === 'en_cours').length
                return (
                  <Link key={o} href={lien({ objectif: sp.objectif === o ? undefined : o, onglet: undefined, action: undefined })} scroll={false} className={`tuile ${sp.objectif === o ? 'bg-[var(--papier)]' : ''}`} aria-current={sp.objectif === o ? 'true' : undefined}>
                    <p className="etiquette">{t(OBJECTIFS[o].titre)}</p>
                    <p className="grand-chiffre mt-1.5">{ouvertes}<span className="text-[1rem] text-[var(--encre-douce)]"> {t('à faire ou en cours')}</span></p>
                    <p className="second mt-1">{t(OBJECTIFS[o].note)}</p>
                    <p className="machine mt-2">{t('{faites} faites · {ecartees} écartées', { faites: du.filter((l) => l.etat === 'fait').length, ecartees: du.filter((l) => l.etat === 'ecarte').length })}</p>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* ── Fiche d'une action ──────────────────────────────────────────── */}
          {(fiche || ficheFaite) && (
            <section id="fiche" className="panneau scroll-mt-8" aria-label={t('Fiche de l’action')}>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--encre)] px-4 py-3">
                <div className="min-w-0 max-w-3xl">
                  <p className="etiquette">
                    {fiche ? t(OBJECTIFS[OBJECTIF[fiche.famille]].titre) : t('Action faite, sortie de la liste')}
                    {fiche?.type && fiche.type !== 'a_classer' ? ` · ${libelleType(fiche.type)}` : ''}
                    {fiche?.ajoutee ? ` · ${t('ajoutée à la main')}` : ''}
                  </p>
                  <p className="mt-1 text-[1.0625rem] font-bold">{fiche?.titre ?? ficheFaite!.titre}</p>
                  {fiche && <p className="mt-1 text-[var(--encre-douce)]">{fiche.detail}</p>}
                  {ficheFaite && <p className="mt-1 text-[var(--encre-douce)]">{t('Les relevés ne la proposent plus : la page n’est plus citée sans vous, ou la question a changé. Sa note, son journal et son résultat restent ici.')}</p>}
                </div>
                <Link href={lien({ action: undefined })} scroll={false} className="bouton bouton-creux bouton-petit">{t('Fermer')}</Link>
              </div>
              <div className="grid gap-x-8 md:grid-cols-3">
                <div className="px-4 py-3">
                  <p className="etiquette">{t('État')}</p>
                  {fiche ? <div className="mt-1.5"><ChangerEtat l={fiche} /></div> : <p className="mt-1.5"><span className="pastille nomme">{t('Fait')}</span></p>}
                  {faiteFiche ? <p className="second mt-2">{t('Faite le {date}.', { date: jourLong(faiteFiche.faitLe) })}</p> : fiche?.majLe ? <p className="second mt-2">{t('Dernier changement le {date}.', { date: jourLong(fiche.majLe) })}</p> : null}
                  {lienFiche && (
                    <p className="mt-3 space-y-1.5">
                      <span className="etiquette block">{t('Page visée')}</span>
                      <a href={lienFiche} target="_blank" rel="noopener noreferrer nofollow" className="lien block break-all text-[0.875rem]">{adresseCourte(lienFiche, 90)}</a>
                      {fiche?.famille === 'reformuler' && <Link href={`/audit?url=${encodeURIComponent(lienFiche)}`} className="bouton bouton-creux bouton-petit">{t('Auditer cette page')}</Link>}
                    </p>
                  )}
                </div>
                <div className="px-4 py-3">
                  <p className="etiquette">{t('Questions concernées (')}{(fiche?.preuves ?? ficheFaite!.questionIds).length})</p>
                  <ul className="mt-1.5">
                    {(fiche?.preuves ?? ficheFaite!.questionIds.map((id) => ({ id, texte: texteQuestion(id) ?? t('Question retirée du projet') }))).map((p) => <li key={p.id} className="ligne-t py-1"><Link href={`/questions/${p.id}`} className="hover:underline">{p.texte}</Link></li>)}
                  </ul>
                </div>
                <div className="px-4 py-3">
                  {fiche ? (
                    <>
                      <p className="etiquette">{t('Réponses qui font preuve (')}{preuvesFiche.length})</p>
                      <ul className="mt-1.5">
                        {preuvesFiche.slice(0, 10).map((r) => (
                          <li key={r.id} className="ligne-t py-1"><Link href={lienReponse(r)} className="hover:underline"><span className="font-semibold">{nomCourt(r.moteur)}{r.methode === 'api' ? ' (API)' : ''}</span> · {jourLong(r.createdAt)}</Link><span className="second block truncate">{r.question.texte}</span></li>
                        ))}
                      </ul>
                    </>
                  ) : <p className="second">{t('La preuve d’origine n’est plus dans les derniers relevés.')}</p>}
                </div>
              </div>

              {/* Avant / après, dès que l'action est faite */}
              {faiteFiche && resultatFiche && (
                <div className="border-t border-[var(--encre)] px-4 py-3">
                  <p className="etiquette">{t('Avant et après, sur')} {pluriel(faiteFiche.questionIds.length, 'question')} <span className="tampon interface ml-1">{t('interface')}</span></p>
                  <div className="mt-2 grid gap-x-8 gap-y-2 sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:items-center">
                    <p><span className="second block">{t('Les quatre semaines d’avant')}</span><span className="chiffre text-[1.125rem] font-semibold">{resultatFiche.avant.n ? t('{k} sur {n}', { k: resultatFiche.avant.k, n: resultatFiche.avant.n }) : t('aucun relevé')}</span></p>
                    <p><span className="second block">{t('Depuis le {date}', { date: jourLong(faiteFiche.faitLe) })}</span><span className="chiffre text-[1.125rem] font-semibold">{resultatFiche.apres.n ? t('{k} sur {n}', { k: resultatFiche.apres.k, n: resultatFiche.apres.n }) : t('aucun relevé')}</span></p>
                    <p>
                      {resultatFiche.apres.n > 0 && resultatFiche.avant.n > 0 && <span className="block"><EcartLu e={resultatFiche.e} vide="" /></span>}
                      <span className="font-semibold">{enClair(resultatFiche.e, resultatFiche.avant.n, resultatFiche.apres.n)}</span>
                      <span className="second block">{resultatFiche.aQuatreSemaines.getTime() > instant ? t('Mesure à quatre semaines le {date} : avant cette date, le résultat est provisoire.', { date: jourLong(resultatFiche.aQuatreSemaines) }) : t('Quatre semaines sont passées : le résultat peut être lu.')}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-x-8 border-t border-[var(--encre)] md:grid-cols-3">
                {/* Note libre */}
                <form action={noterAction} className="space-y-2 px-4 py-3">
                  <input type="hidden" name="cle" value={cleFiche} />
                  <label className="libelle">
                    {t('Note')}
                    <span className="aide">{t('Ce que vous avez fait, ce qu’il reste à faire, un lien utile.')}</span>
                    <textarea name="note" rows={4} maxLength={2000} defaultValue={fiche?.note ?? ficheFaite?.note ?? ''} key={`note:${cleFiche}:${fiche?.note ?? ficheFaite?.note ?? ''}`} className="champ mt-1 !text-[0.875rem]" />
                  </label>
                  {faiteFiche && (
                    <label className="libelle">
                      {t('Faite le')}
                      <span className="aide">{t('La date sert à comparer avant et après. Corrigez-la si l’action a été faite un autre jour.')}</span>
                      <input type="date" name="faitLe" max={aujourdhui} defaultValue={cleJour(faiteFiche.faitLe)} key={`date:${cleJour(faiteFiche.faitLe)}`} className="champ chiffre mt-1 !w-44 !py-1.5 !text-[0.875rem]" />
                    </label>
                  )}
                  <BoutonEnvoi className="bouton bouton-creux bouton-petit" enCours={t('Enregistrement…')}>{t('Enregistrer')}</BoutonEnvoi>
                </form>

                {/* Journal des prises de contact */}
                <div className="px-4 py-3 md:col-span-2">
                  <p className="etiquette">{t('Prises de contact (')}{journal.length})</p>
                  {journal.length === 0 ? <p className="second mt-1">{t('Aucune pour l’instant. Notez ici chaque message envoyé : vous ne relancerez pas deux fois le même site, et vous verrez ce qui a marché.')}</p> : (
                    <ul className="mt-1.5">
                      {journal.map((d) => (
                        <li key={d.id} className="ligne-t py-2">
                          <form action={majDemarche} className="grid gap-x-3 gap-y-1.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                            <input type="hidden" name="id" value={d.id} />
                            <p className="min-w-0">
                              <span className="font-semibold">{DEMARCHES[d.type] ? t(DEMARCHES[d.type]) : d.type}</span> <span className="chiffre text-[var(--encre-douce)]">· {jourLong(d.faiteLe)}</span>
                              {d.contact && <span className="text-[var(--encre-douce)]"> · {d.contact}</span>}
                              {d.note && <span className="second block">{d.note}</span>}
                            </p>
                            <span className="flex flex-wrap items-center gap-1">
                              {Object.entries(REPONSES).map(([k, r]) => (
                                <button key={k} type="submit" name="reponse" value={k} aria-pressed={d.reponse === k} className="choix !min-h-0 !px-2 !py-0.5 !text-[0.75rem]">{t(r.libelle)}</button>
                              ))}
                              <button type="submit" name="retirer" value="1" className="lien ml-1 text-[0.75rem]" aria-label={t('Retirer cette prise de contact du journal')}>{t('Retirer')}</button>
                            </span>
                          </form>
                        </li>
                      ))}
                    </ul>
                  )}
                  <form action={ajouterDemarche} className="mt-3 grid gap-x-3 gap-y-2 border-t border-[var(--filet)] pt-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,13.5rem)_minmax(0,9.5rem)_minmax(0,1fr)]">
                    <input type="hidden" name="cle" value={cleFiche} />
                    <input type="hidden" name="reponse" value="attente" />
                    <label className="libelle">
                      {t('Type de démarche')}
                      <select name="type" defaultValue={fiche?.famille === 'fait' ? 'correction' : 'ajout'} className="champ mt-1 !py-1.5 !text-[0.875rem]">
                        {Object.entries(DEMARCHES).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
                      </select>
                    </label>
                    <label className="libelle">
                      {t('Date')}
                      <input type="date" name="faiteLe" max={aujourdhui} defaultValue={aujourdhui} className="champ chiffre mt-1 !py-1.5 !text-[0.875rem]" />
                    </label>
                    <label className="libelle">
                      {t('Personne contactée')}
                      <input name="contact" maxLength={200} placeholder={t('Nom, adresse ou formulaire du site')} className="champ mt-1 !py-1.5 !text-[0.875rem]" />
                    </label>
                    <label className="libelle sm:col-span-2 lg:col-span-2">
                      {t('Ce qui a été demandé')}
                      <input name="note" maxLength={1000} className="champ mt-1 !py-1.5 !text-[0.875rem]" />
                    </label>
                    <div className="flex items-end"><BoutonEnvoi className="bouton bouton-creux bouton-petit" enCours={t('Ajout…')}>{t('Ajouter au journal')}</BoutonEnvoi></div>
                  </form>
                </div>
              </div>
            </section>
          )}

          <div>
            <Onglets libelle={t('Vues de la liste de travail')} actif={onglet} onglets={[{ cle: 'liste', libelle: t('Liste de travail'), href: lien({ onglet: undefined }), n: lignes.filter((l) => l.etat === 'a_faire' || l.etat === 'en_cours').length }, { cle: 'resultats', libelle: t('Résultats'), href: lien({ onglet: 'resultats', action: undefined }), n: faites.length }]} />
            <div className="ecran !border-t-0">
              {onglet === 'liste' && (
                <>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[var(--filet)] px-4 py-3">
                    <Choix libelle={t('État')} actif={etat ?? 'tous'} options={[{ cle: 'ouvertes', libelle: t('À faire et en cours'), href: lien({ etat: undefined }) }, ...ETATS.map((e) => ({ cle: e.etat, libelle: `${t(e.libelle)} (${lignes.filter((l) => l.etat === e.etat).length})`, href: lien({ etat: e.etat }) })), { cle: 'tous', libelle: t('Tous'), href: lien({ etat: 'tous' }) }]} />
                    <Choix libelle={t('Grouper par')} actif={grouper} options={[{ cle: 'objectif', libelle: t('Objectif'), href: lien({ grouper: undefined }) }, { cle: 'etat', libelle: t('État'), href: lien({ grouper: 'etat' }) }, { cle: 'aucun', libelle: t('Aucun'), href: lien({ grouper: 'aucun' }) }]} />
                    {(sp.objectif || question) && (
                      <p className="text-[0.875rem]">
                        {t('Filtre :')} {[sp.objectif && OBJECTIFS[sp.objectif as Objectif] && t(OBJECTIFS[sp.objectif as Objectif].titre), question && `« ${question.texte} »`].filter(Boolean).join(', ')}. <Link href={lien({ objectif: undefined, question: undefined })} scroll={false} className="lien">{t('Tout afficher')}</Link>
                      </p>
                    )}
                  </div>
                  {filtrees.length === 0 && <p className="second p-4">{t('Aucune action ne correspond à ces filtres.')}</p>}
                  {groupes.filter((g) => g.lignes.length > 0).map((g) => (
                    <div key={g.cle}>
                      <div className="border-b border-t border-[var(--encre)] bg-[var(--papier)] px-4 py-2 first:border-t-0">
                        <p className="font-bold">{g.titre} <span className="chiffre font-normal text-[var(--encre-douce)]">({g.lignes.length})</span></p>
                        {g.note && <p className="second">{g.note}</p>}
                      </div>
                      <div className="defile">
                        <table className="tableau fiches">
                          <thead>
                            <tr>
                              <th scope="col" className="fixe">{t('Action')}</th>
                              {grouper !== 'objectif' && <th scope="col">{t('Objectif')}</th>}
                              <th scope="col">{t('Preuve')}</th>
                              <th scope="col">{t('Questions concernées')}</th>
                              <th scope="col">{t('Suivi')}</th>
                              <th scope="col">{t('État')}</th>
                              <th scope="col" className="num">{t('Depuis le')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {g.lignes.map((l) => {
                              const contacts = demarches.get(l.cle) ?? []
                              return (
                                <tr key={l.cle}>
                                  <th scope="row" className="fixe min-w-[16rem] max-w-[30rem] align-top">
                                    <Link href={`${lien({ action: l.cle })}#fiche`} scroll className={`ligne-lien font-semibold ${l.etat === 'fait' || l.etat === 'ecarte' ? 'text-[var(--encre-pale)] line-through' : ''}`}>{l.titre}</Link>
                                    {l.lien && <span className="second discret block truncate">{adresseCourte(l.lien, 64)}</span>}
                                    {l.famille === 'apparaitre' && <span className="mt-1 block"><span className={`puce ${l.type === 'a_classer' ? 'discret' : ''}`}>{libelleType(l.type ?? 'a_classer')}</span></span>}
                                    {l.famille === 'reformuler' && l.lien && <Link href={`/audit?url=${encodeURIComponent(l.lien)}`} className="lien text-[0.8125rem]">{t('Auditer cette page')}</Link>}
                                  </th>
                                  {grouper !== 'objectif' && <td className="second align-top">{t(OBJECTIFS[OBJECTIF[l.famille]].titre)}</td>}
                                  <td className="align-top"><Preuve l={l} /></td>
                                  <td className="second max-w-[18rem] align-top">
                                    <Link href={`/questions/${l.preuves[0]?.id}`} className="line-clamp-1 hover:underline">{l.preuves[0]?.texte}</Link>
                                    {l.preuves.length > 1 && <span className="discret">{t('et')} {pluriel(l.preuves.length - 1, 'autre', 'autres')}</span>}
                                  </td>
                                  <td className="second whitespace-nowrap align-top">
                                    {contacts.length === 0 && !l.note ? <Link href={`${lien({ action: l.cle })}#fiche`} className="discret hover:underline">{t('noter')}</Link> : (
                                      <Link href={`${lien({ action: l.cle })}#fiche`} className="hover:underline">
                                        {contacts.length > 0 && <span className="block">{pluriel(contacts.length, 'contact')} · {REPONSES[contacts[0].reponse] ? t(REPONSES[contacts[0].reponse].libelle).toLowerCase() : ''}</span>}
                                        {l.note && <span className="block">{t('1 note')}</span>}
                                      </Link>
                                    )}
                                  </td>
                                  <td className="align-top"><ChangerEtat l={l} /></td>
                                  <td className="num align-top">{l.faitLe ? jourLong(l.faitLe) : l.majLe ? jourLong(l.majLe) : <span className="discret">{t('nouveau')}</span>}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-[var(--filet)] px-4 py-2.5">
                    <LigneMethode methode="interface" n={base} unite="réponse" suite={t('dernier relevé de chaque IA d’interface ; Claude (API) n’entre dans cette liste que pour les faits faux, et la ligne le dit')} />
                  </div>
                </>
              )}

              {onglet === 'resultats' && (
                faites.length === 0 ? (
                  <p className="second p-4">{t('Aucune action n’est encore passée à « fait ». Quand ce sera le cas, cet onglet comparera la présence de la marque avant et après, sur les questions concernées, et dira si l’écart dépasse la marge d’erreur.')}</p>
                ) : (
                  <>
                    <div className="defile">
                      <table className="tableau fiches">
                        <thead>
                          <tr>
                            <th scope="col" className="fixe">{t('Action')}</th>
                            <th scope="col" className="num">{t('Faite le')}</th>
                            <th scope="col" className="num">{t('Avant')}</th>
                            <th scope="col" className="num">{t('Après')}</th>
                            <th scope="col">{t('Écart')}</th>
                            <th scope="col">{t('Ce qu’on peut en dire')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {faites.map((a) => {
                            const r = resultat(a, m)
                            return (
                              <tr key={a.cle}>
                                <th scope="row" className="fixe min-w-[14rem] max-w-[26rem] align-top">
                                  <Link href={`${lien({ action: a.cle, onglet: 'resultats' })}#fiche`} className="ligne-lien font-semibold">{a.titre}</Link>
                                  <span className="second discret block">{pluriel(a.questionIds.length, 'question')}{!lignes.some((l) => l.cle === a.cle) ? ` · ${t('sortie de la liste')}` : ''}</span>
                                </th>
                                <td className="num align-top">{jourLong(a.faitLe)}</td>
                                <td className="num align-top">{r.avant.n ? t('{k} sur {n}', { k: r.avant.k, n: r.avant.n }) : <span className="discret">{t('aucun relevé')}</span>}</td>
                                <td className="num align-top">{r.apres.n ? t('{k} sur {n}', { k: r.apres.k, n: r.apres.n }) : <span className="discret">{t('aucun relevé')}</span>}</td>
                                <td className="whitespace-nowrap align-top">{r.apres.n > 0 && r.avant.n > 0 ? <EcartLu e={r.e} vide="" /> : <span className="discret">n.c.</span>}</td>
                                <td className="max-w-[26rem] align-top">
                                  {enClair(r.e, r.avant.n, r.apres.n)}
                                  <span className="second block">{r.aQuatreSemaines.getTime() > instant ? t('Provisoire : mesure à quatre semaines le {date}.', { date: jourLong(r.aQuatreSemaines) }) : t('Quatre semaines sont passées.')}</span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="space-y-1 border-t border-[var(--filet)] px-4 py-2.5">
                      <LigneMethode methode="interface" n={base} unite="réponse" suite={t('réponses où la marque apparaît, sur les questions de chaque action')} />
                      <p className="second">{t('Avant : les quatre semaines qui précèdent le jour de l’action, ce jour compris. Après : tous les relevés des jours suivants. Un écart n’est dit « réel » que s’il dépasse la marge d’erreur des deux échantillons ; il en faut au moins 5 de chaque côté. Chaque action faite porte aussi un repère sur la courbe de la vue d’ensemble.')}</p>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </>
      )}
      <CommentLire>
        <ul>
          <li>{t('La liste vient des relevés : pages de la marque trouvées mais pas citées, pages des autres citées à notre place, sujets sans page ni vidéo, réponses qui contredisent un fait vérifié.')}</li>
          <li>{t('Une action « faite » est suivie : on compare la présence de la marque sur ses questions, quatre semaines avant et après. L’écart n’est coloré que s’il dépasse la marge d’erreur, et l’action n’en est pas forcément la cause.')}</li>
        </ul>
      </CommentLire>
    </div>
  )
}
