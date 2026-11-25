import Link from 'next/link'
import { BarresParJour, Compteur } from '@/components/graphiques/Graphiques'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { Barres, CommentLire, Decoupe, EnTete, Feuille, Tuile, Vide } from '@/components/outil/Blocs'
import { titreOnglet } from '@/lib/contexte'
import { traducteur } from '@/lib/i18n/serveur'
import { depenseParJourEtFournisseur, lireTableauDeBord, type LigneRepartition } from '@/lib/couts'
import { deCleJour, jourCourt, jourLong, nom, nombre, pct, pluriel, usd, usdFin } from '@/lib/libelles'
import { prisma } from '@/lib/prisma'
import { listerProjets } from '@/lib/projets'
import { exigerAdmin } from '@/lib/session'
import { changerPlafond } from './actions'

export const generateMetadata = () => titreOnglet('Coûts')
export const dynamic = 'force-dynamic'

const TEINTES = ['teinte-encre', 'teinte-s2', 'teinte-s3', 'teinte-s5', 'teinte-s6', 'teinte-papier']

function Repartition({ titre, lignes, vide }: { titre: string; lignes: LigneRepartition[]; vide: string }) {
  const total = lignes.reduce((n, l) => n + l.cout, 0)
  return (
    <Feuille titre={titre} droite={usdFin(total)}>
      {lignes.length === 0 ? <p className="second p-4">{vide}</p> : (
        <Barres libelle={titre} colonneNote lignes={lignes.map((l) => ({ cle: l.cle, libelle: nom(l.cle), valeur: l.cout, texte: usdFin(l.cout), note: `${pluriel(l.appels, 'appel')}${total ? ` · ${pct(l.cout / total)}` : ''}` }))} />
      )}
    </Feuille>
  )
}

export default async function Couts({ searchParams }: { searchParams: Promise<{ echecs?: string }> }) {
  await exigerAdmin()
  const { echecs } = await searchParams
  const t = await traducteur()
  const tb = await lireTableauDeBord()
  const [parJourFournisseur, projets, enEchec] = await Promise.all([
    depenseParJourEtFournisseur(new Date(tb.maintenant.getTime() - 30 * 86_400_000)),
    listerProjets(),
    echecs === '1' ? prisma.apiCall.findMany({ where: { reussi: false }, orderBy: { createdAt: 'desc' }, take: 40 }) : Promise.resolve(null),
  ])
  const derniers = enEchec ? enEchec.map((d) => ({ ...d, coutUsd: Number(d.coutUsd) })) : tb.derniers
  const moisEnCours = new Intl.DateTimeFormat(t.langue === 'fr' ? 'fr-FR' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'Europe/Paris' }).format(tb.maintenant)

  // Projection de fin de mois, au rythme du mois en cours.
  const ecoule = (tb.maintenant.getTime() - tb.debutMois.getTime()) / 86_400_000
  const fin = new Date(tb.debutMois)
  fin.setUTCMonth(fin.getUTCMonth() + 1)
  const duree = (fin.getTime() - tb.debutMois.getTime()) / 86_400_000
  const projection = tb.depenseMois === 0 ? 0 : ecoule >= 1 ? (tb.depenseMois / ecoule) * duree : null
  const part = tb.plafond > 0 ? Math.min(100, (tb.depenseMois / tb.plafond) * 100) : 100
  const partPrevue = projection !== null && tb.plafond > 0 ? Math.min(100, (projection / tb.plafond) * 100) : part
  const atteint = tb.depenseMois >= tb.plafond
  const nbQuestions = projets.reduce((n, p) => n + p._count.questions, 0)

  // 30 derniers jours, jours sans appel compris.
  const parJour = new Map(tb.parJour.map((j) => [j.jour, j]))
  const jours = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(tb.maintenant.getTime() - (29 - i) * 86_400_000)
    const cle = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(d)
    return { cle, libelle: jourLong(deCleJour(cle)), court: i % 5 === 4 || i === 0 ? jourCourt(deCleJour(cle)) : undefined, centimes: (parJour.get(cle)?.cout ?? 0) * 100 }
  })
  const fournisseurs = [...new Set(parJourFournisseur.map((x) => x.fournisseur))]

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Administration') }, { libelle: t('Coûts') }]} exportCsv="/api/export/appels" />
      <EnTete
        titre={t('Coûts')}
        verdict={<>
          {t('{depense} dépensés ce mois-ci sur {plafond} de plafond : il reste {reste}.', { depense: usd(tb.depenseMois), plafond: usd(tb.plafond), reste: usd(Math.max(tb.plafond - tb.depenseMois, 0)) })}{' '}
          <span className="second">{t('Chaque appel à une API payante est inscrit ici, avec son prix.')}</span>
        </>}
      />

      {/* ── Plafond ─────────────────────────────────────────────────────────── */}
      <section className="ecran" aria-label={t('Plafond du mois')}>
        <div className="grid gap-x-8 gap-y-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="etiquette">{t('Dépense de')} {moisEnCours}</p>
            <p className="mt-1"><span className="grand-chiffre">{usd(tb.depenseMois)}</span> <span className="chiffre text-[var(--encre-douce)]">{t('dépensés sur')} {usd(tb.plafond)}</span></p>
            <div className={`jauge mt-3 !h-3 ${atteint ? 'depasse' : ''}`} role="progressbar" aria-valuenow={Math.round(part)} aria-valuemin={0} aria-valuemax={100} aria-label={t('Part du plafond mensuel utilisée')}>
              <span className="prevu" style={{ width: `${partPrevue}%`, height: '100%' }} />
              <span style={{ width: `${part}%`, position: 'relative' }} />
            </div>
            <p className={`mt-2 ${atteint ? 'font-semibold text-[var(--absent-texte)]' : 'text-[var(--encre-douce)]'}`}>
              {atteint
                ? t('Plafond atteint : les relevés planifiés sont suspendus jusqu’au mois prochain, ou jusqu’à ce que le plafond soit relevé.')
                : `${t('{part} du plafond utilisé (trait plein).', { part: pct(part / 100) })} ${projection === null ? t('Projection disponible après un jour complet.') : projection > tb.plafond ? t('Au rythme actuel, le mois finirait à {montant} (hachures) : au-dessus du plafond.', { montant: usd(projection) }) : t('Au rythme actuel, le mois finirait à {montant} (hachures).', { montant: usd(projection) })} ${t('Quand le plafond est atteint, les relevés planifiés se suspendent d’eux-mêmes.')}`}
            </p>
          </div>
          <form action={changerPlafond} className="flex items-end gap-2">
            <label className="libelle">
              {t('Plafond mensuel (en dollars)')}
              <input name="plafond" type="number" min="0" max="5000" step="1" defaultValue={tb.plafond} className="champ chiffre mt-1 !w-32" />
            </label>
            <button type="submit" className="bouton bouton-creux">{t('Enregistrer')}</button>
          </form>
        </div>
      </section>

      {tb.premierAppel === null ? (
        <Vide titre={t('Aucun appel payant pour l’instant.')}><p>{t('Les premiers chiffres arriveront avec le premier relevé.')}</p></Vide>
      ) : (
        <>
          <section className="ecran" aria-label={t('Chiffres clés')}>
            <div className="tuiles" style={{ '--colonnes': 6 } as React.CSSProperties}>
              <Tuile titre={t('Dépense du mois')} aide={t('Somme des appels payants inscrits au journal depuis le début du mois.')} base={t('sur {plafond} de plafond', { plafond: usd(tb.plafond) })}>{usd(tb.depenseMois)}</Tuile>
              <Tuile titre={t('Projection fin de mois')} aide={t('La dépense du mois prolongée au rythme des jours écoulés.')} base={t('au rythme actuel')}>{projection === null ? <span className="discret">{t('n.c.')}</span> : usd(projection)}</Tuile>
              <Tuile titre={t('Dernières 24 h')} aide={t('Appels payants des vingt-quatre dernières heures.')}>{usdFin(tb.depense24h)}</Tuile>
              <Tuile titre={t('Coût d’un relevé')} aide={t('Coût moyen d’une réponse relevée ce mois-ci, tous fournisseurs confondus.')} base={tb.nbReleves ? t('sur {n} [n:relevé|relevés]', { n: tb.nbReleves }) : t('aucun relevé ce mois-ci')}>{tb.coutMoyenReleve === null ? <span className="discret">{t('n.c.')}</span> : usdFin(tb.coutMoyenReleve)}</Tuile>
              <Tuile titre={t('Coût par question')} aide={t('Dépense du mois rapportée au nombre de questions suivies.')} base={t('{n} [n:question|questions] ce mois-ci', { n: nbQuestions })}>{nbQuestions ? usdFin(tb.depenseMois / nbQuestions) : <span className="discret">{t('n.c.')}</span>}</Tuile>
              <Tuile titre={t('Appels ce mois-ci')} aide={t('Chaque appel à une API payante est inscrit au journal, réussi ou non.')} base={tb.echecsMois ? t('dont {n} en échec', { n: tb.echecsMois }) : t('aucun échec')}><Compteur valeur={tb.totalAppelsMois} /></Tuile>
            </div>
          </section>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <Feuille titre={t('Dépense par jour')} droite={t('30 derniers jours')}>
              <div className="p-4">
                <BarresParJour jours={jours} titre={t('Dépense par jour')} periode={t('Du {debut} au {fin}', { debut: jours[0].libelle, fin: jours[29].libelle })} />
              </div>
            </Feuille>
            <Feuille titre={t('Par fournisseur, sur 30 jours')} droite={pluriel(fournisseurs.length, 'fournisseur')}>
              <div className="p-4">
                <Decoupe libelle={t('Dépense par fournisseur sur 30 jours')} unite={t('centimes')} segments={fournisseurs.map((f, i) => ({ cle: f, libelle: nom(f), n: Math.round(parJourFournisseur.filter((x) => x.fournisseur === f).reduce((n, x) => n + x.cout, 0) * 100), teinte: TEINTES[Math.min(i, 5)] }))} />
                <ul className="mt-4">
                  {fournisseurs.map((f) => {
                    const lignes = parJourFournisseur.filter((x) => x.fournisseur === f)
                    return <li key={f} className="ligne-t flex justify-between gap-3 py-1.5"><span className="font-semibold">{nom(f)}</span><span className="nb">{usdFin(lignes.reduce((n, x) => n + x.cout, 0))} · {pluriel(lignes.reduce((n, x) => n + x.appels, 0), 'appel')} · {pluriel(lignes.length, 'jour')}</span></li>
                  })}
                </ul>
                <p className="second mt-2">{t('Dans la légende, les montants sont en centimes de dollar.')}</p>
              </div>
            </Feuille>
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            <Repartition titre={t('Par fournisseur, ce mois-ci')} lignes={tb.parFournisseur} vide={t('Aucun appel ce mois-ci.')} />
            <Repartition titre={t('Par IA relevée, ce mois-ci')} lignes={tb.parMoteur} vide={t('Aucun relevé ce mois-ci.')} />
            <Repartition titre={t('Par projet, ce mois-ci')} lignes={tb.parProjet} vide={t('Aucun appel ce mois-ci.')} />
            <Repartition titre={t('Par type d’appel, ce mois-ci')} lignes={tb.parOperation} vide={t('Aucun appel ce mois-ci.')} />
          </div>

          <Feuille titre={t('Coût par projet')} droite={moisEnCours}>
            <div className="defile">
              <table className="tableau fiches">
                <thead>
                  <tr>
                    <th scope="col" className="fixe">{t('Projet')}</th>
                    <th scope="col" className="num">{t('Questions')}</th>
                    <th scope="col" className="num">{t('Appels')}</th>
                    <th scope="col" className="num">{t('Dépense du mois')}</th>
                    <th scope="col" className="num">{t('Coût par question')}</th>
                    <th scope="col" className="num">{t('Prévision fin de mois')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tb.parProjet.map((l) => {
                    const p = projets.find((x) => x.nom === l.cle)
                    return (
                      <tr key={l.cle}>
                        <th scope="row" className="fixe font-semibold">{p ? <Link href={`/projets/${p.id}`} className="ligne-lien">{l.cle}</Link> : l.cle}</th>
                        <td className="num">{p ? p._count.questions : <span className="discret">{t('n.c.')}</span>}</td>
                        <td className="num">{l.appels}</td>
                        <td className="num">{usdFin(l.cout)}</td>
                        <td className="num">{p && p._count.questions ? usdFin(l.cout / p._count.questions) : <span className="discret">{t('n.c.')}</span>}</td>
                        <td className="num">{ecoule >= 1 ? usd((l.cout / ecoule) * duree) : <span className="discret">{t('n.c.')}</span>}</td>
                      </tr>
                    )
                  })}
                  {tb.parProjet.length === 0 && <tr><td colSpan={6}><span className="second">{t('Aucun appel payant ce mois-ci.')}</span></td></tr>}
                </tbody>
              </table>
            </div>
          </Feuille>

          <Feuille titre={echecs === '1' ? t('Derniers appels en échec') : t('Derniers appels')} droite={<><Link href={echecs === '1' ? '/admin/couts' : '/admin/couts?echecs=1'} scroll={false} className="underline">{echecs === '1' ? t('Tous les appels') : t('Échecs seulement')}</Link><a href="/api/export/appels" download className="underline">{t('Exporter tous les appels en CSV')}</a></>}>
            {derniers.length === 0 ? <p className="second p-4">{echecs === '1' ? t('Aucun appel en échec.') : t('Aucun appel enregistré.')}</p> : (
              <div className="defile haut">
                <table className="tableau dense fiches">
                  <thead>
                    <tr>
                      <th scope="col" className="fixe">{t('Date')}</th>
                      <th scope="col">{t('Fournisseur')}</th>
                      <th scope="col">{t('Appel')}</th>
                      <th scope="col">{t('Projet')}</th>
                      <th scope="col">{t('IA')}</th>
                      <th scope="col" className="num">{t('Durée')}</th>
                      <th scope="col">{t('État')}</th>
                      <th scope="col" className="num">{t('Prix')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {derniers.map((a) => (
                      <tr key={a.id}>
                        <th scope="row" className="fixe chiffre whitespace-nowrap">{new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).format(a.createdAt)}</th>
                        <td>{nom(a.fournisseur)}</td>
                        <td>{nom(a.operation)}</td>
                        <td className="text-[var(--encre-douce)]">{a.projet ?? ''}</td>
                        <td>{a.moteur ? nom(a.moteur) : ''}</td>
                        <td className="num">{a.dureeMs === null ? '' : `${nombre(Math.round(a.dureeMs / 100) / 10)} s`}</td>
                        <td>{a.reussi ? <span className="pastille nomme"><span className="signe" aria-hidden="true">●</span>{t('Réussi')}</span> : <span className="pastille absent"><span className="signe" aria-hidden="true">!</span>{t('Échec')}</span>}</td>
                        <td className="num font-semibold" title={a.sourcePrix === 'api' ? t('Prix renvoyé par le fournisseur') : t('Prix calculé depuis la grille de tarifs')}>{usdFin(a.coutUsd)}{a.sourcePrix === 'grille' && <span className="discret"> *</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="second border-t border-[var(--filet)] px-4 py-2.5">{t('Heure de Paris. * Prix calculé depuis la grille de tarifs, faute de montant renvoyé par le fournisseur. Les 40 derniers appels sont affichés ; l’export CSV les contient tous, avec le modèle et le message d’erreur.')}</p>
          </Feuille>
        </>
      )}
      <CommentLire>
        <ul>
          <li>{t('Chaque appel à une API payante est inscrit au journal avec son prix : celui que renvoie le fournisseur, sinon celui de la grille de tarifs (marqué d’un astérisque).')}</li>
          <li>{t('Montants en dollars, la devise de facturation des fournisseurs. Quand le plafond du mois est atteint, les relevés planifiés se suspendent d’eux-mêmes.')}</li>
        </ul>
      </CommentLire>
    </div>
  )
}
