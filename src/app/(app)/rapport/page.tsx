import Link from 'next/link'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { redirect } from 'next/navigation'
import { Bandeau, EcartLu, EnTete, Feuille, LigneMethode, Tampon, Tuile, Vide } from '@/components/outil/Blocs'
import { BoutonEnvoi } from '@/components/outil/BoutonEnvoi'
import { lienReponse } from '@/components/outil/ListeReponses'
import { projetAffiche, titreOnglet } from '@/lib/contexte'
import { destinatairesDuRapport, envoiPossible, EXPEDITEUR, lireEnvoiRapport } from '@/lib/courriel'
import { tr } from '@/lib/i18n/courante'
import { traducteur } from '@/lib/i18n/serveur'
import { deCleJour, jourLong, nom, nomCourt, pluriel, usdFin } from '@/lib/libelles'
import { lireMesuresBrutes, type Ecart } from '@/lib/mesures'
import { construireRapport, type Bascule, type Comparaison } from '@/lib/rapport'
import { estAdmin, exigerSession } from '@/lib/session'
import { lireTravail } from '@/lib/travail'
import { suivreMarque } from '../_actions/suivi'
import { envoyerRapportMaintenant, reglerEnvoiRapport } from './actions'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Rapport')

const part = (c: { k: number; n: number }) => (c.n ? tr('{k} sur {n}', { k: c.k, n: c.n }) : tr('aucune réponse'))

function Bascules({ titre, liste, vide, classe }: { titre: string; liste: Bascule[]; vide: string; classe: string }) {
  return (
    <div className="border-b border-[var(--filet)] px-4 py-3 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="etiquette">{titre} ({liste.length})</p>
      {liste.length === 0 ? <p className="second mt-1">{vide}</p> : (
        <ul className="mt-1.5">
          {liste.slice(0, 12).map((x) => (
            <li key={`${x.question.id}:${x.moteur}`} className="ligne-t grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-1.5">
              <Link href={lienReponse(x.apres)} className="min-w-0 hover:underline">{x.question.texte}</Link>
              <span className={`pastille ${classe} whitespace-nowrap`}>{nomCourt(x.moteur)}</span>
            </li>
          ))}
        </ul>
      )}
      {liste.length > 12 && <p className="second discret mt-1">{tr('et {n} de plus.', { n: liste.length - 12 })}</p>}
    </div>
  )
}

function LigneComparaison({ libelle, c, e, api = false, dates }: { libelle: React.ReactNode; c: { avant: Comparaison['avant']; apres: Comparaison['apres'] }; e: Ecart | null; api?: boolean; dates?: string }) {
  return (
    <tr className={api ? 'a-part' : ''}>
      <th scope="row" className="fixe font-semibold min-[640px]:whitespace-nowrap">{libelle}{dates && <span className="second discret block font-normal">{dates}</span>}</th>
      <td><Tampon methode={api ? 'api' : 'interface'} /></td>
      <td className="num">{part(c.avant)}</td>
      <td className="num">{part(c.apres)}</td>
      <td className="whitespace-nowrap"><EcartLu e={e} vide={tr('Rien à comparer')} /></td>
    </tr>
  )
}

export default async function EcranRapport({ searchParams }: { searchParams: Promise<{ envoi?: string }> }) {
  const t = await traducteur()
  const [session, projet, sp] = await Promise.all([exigerSession(), projetAffiche(), searchParams])
  if (!projet) redirect('/projets')
  const m = await lireMesuresBrutes(projet.id)
  if (!m) redirect('/projets')
  const [r, envoi, destinataires] = await Promise.all([construireRapport(m, await lireTravail(projet.id, m.marque)), lireEnvoiRapport(projet.id), destinatairesDuRapport()])
  const possible = envoiPossible()
  const ui = r.ui
  const du = ui ? jourLong(deCleJour(ui.jourAvant)) : ''
  const au = ui ? jourLong(deCleJour(ui.jourApres)) : ''

  const courriel = (
    <Feuille id="courriel" className="scroll-mt-8" titre={t('Recevoir ce rapport par e-mail')} droite={envoi.actif && possible ? t('chaque lundi') : t('envoi coupé')} aide={t('Chaque lundi matin, le même rapport, en version courte, avec un lien vers cette page. L’envoi est gratuit. Il est coupé tant que vous ne l’activez pas.')}>
      <div className="grid gap-x-10 gap-y-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="space-y-2">
          {sp.envoi === 'fait' && <p className="font-semibold text-[var(--vert)]">{t('Rapport envoyé à')} {session.user.email}.</p>}
          {sp.envoi === 'echec' && <p className="font-semibold text-[var(--absent-texte)]">{t('L’envoi n’a pas abouti. Réessayez dans un moment.')}</p>}
          {possible ? (
            <>
              <p><strong className="font-semibold">{envoi.actif ? t('Envoi activé.') : t('Envoi coupé.')}</strong> {envoi.actif ? `${t('Le rapport part chaque lundi à partir de 8 h, heure de Paris.')} ${envoi.dernier ? t('Dernier envoi : le {date}.', { date: jourLong(envoi.dernier) }) : t('Aucun envoi pour l’instant.')}` : t('Personne ne reçoit ce rapport par e-mail.')}</p>
              <p className="second">{t('Destinataires : les')} {pluriel(destinataires.length, 'compte')} de l’outil ({destinataires.join(', ')}). Expéditeur : {EXPEDITEUR.replace(/[<>]/g, '')}.</p>
            </>
          ) : (
            <>
              <p><strong className="font-semibold">{t('L’envoi n’est pas encore possible depuis cet outil.')}</strong> {t('Il faut deux réglages dans le fichier .env de l’installation : une clé du service d’envoi Resend (RESEND_API_KEY) et une adresse d’expédition sur un domaine vérifié chez Resend (RAPPORT_EXPEDITEUR). L’offre gratuite de Resend suffit.')}</p>
              <p className="second">{t('Une fois ces réglages faits, cette rubrique proposera l’envoi chaque lundi aux {n} [n:compte|comptes] de l’outil.', { n: destinataires.length })}</p>
            </>
          )}
          <p><a href="/rapport/courriel" target="_blank" rel="noopener" className="lien-fleche">{t('Voir l’e-mail tel qu’il sera envoyé')} <span aria-hidden="true">→</span></a></p>
        </div>
        {possible && (
          <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-stretch">
            <form action={reglerEnvoiRapport}>
              <input type="hidden" name="actif" value={envoi.actif ? '0' : '1'} />
              <BoutonEnvoi className={envoi.actif ? 'bouton bouton-creux' : 'bouton'} enCours={t('Enregistrement…')}>{envoi.actif ? t('Couper l’envoi du lundi') : t('Activer l’envoi du lundi')}</BoutonEnvoi>
            </form>
            <form action={envoyerRapportMaintenant}>
              <BoutonEnvoi className="bouton bouton-creux" enCours={t('Envoi…')}>{t('Me l’envoyer maintenant')}</BoutonEnvoi>
            </form>
          </div>
        )}
      </div>
    </Feuille>
  )

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Suivre') }, { libelle: t('Rapport') }]} actions={ui ? <a href="#courriel" className="bouton bouton-creux bouton-petit">{t('Recevoir par e-mail')}</a> : undefined} />
      <EnTete
        titre={t('Rapport')}
        verdict={!ui ? t('Le rapport compare les deux derniers jours de relevé du projet : il lui en faut deux.') : <>
          {r.alertes.length === 0 ? t('Du {du} au {au}, aucun écart ne dépasse la marge d’erreur.', { du, au }) : t('Du {du} au {au}, {n} [n:écart dépasse|écarts dépassent] la marge d’erreur.', { du, au, n: r.alertes.length })}{' '}
          <span className="second">{t('Le rapport ne dépend pas des filtres des autres écrans.')}</span>
        </>}
      />

      {!ui ? (
        <>
          <Vide titre={r.jours.length === 0 ? t('Aucun relevé pour ce projet.') : t('Un seul jour de relevé pour l’instant.')} action={<Link href={`/projets/${projet.id}?onglet=releves`} className="bouton">{t('Préparer un relevé')}</Link>}>
            <p>{r.jours.length === 0 ? t('Le rapport se remplit à partir du deuxième relevé.') : t('Le projet a été relevé le {date}. Le rapport comparera deux dates dès le prochain relevé. Une seule date est un échantillon, pas une évolution.', { date: jourLong(deCleJour(r.jours[0])) })}</p>
          </Vide>
          {courriel}
        </>
      ) : (
        <>
          {/* ── Alertes : seulement hors marge ─────────────────────────────── */}
          <Feuille titre={t('Au-dessus de la marge d’erreur')} droite={pluriel(r.alertes.length, 'écart')} aide={t('Les seuls changements qu’on peut tenir pour réels : ceux qui dépassent la marge d’erreur des deux relevés comparés. Tout le reste, plus bas, est un indice.')}>
            {r.alertes.length === 0 ? (
              <p className="second p-4">{t('Aucun écart ne dépasse la marge d’erreur entre ces deux relevés. Avec une réponse par question et par IA à chaque date, c’est le cas le plus courant.')}</p>
            ) : (
              <ul>
                {r.alertes.map((a, i) => (
                  <li key={a.cle} className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-4 py-2.5 ${i ? 'ligne-t' : ''}`}>
                    <span className={`chiffre font-semibold ${a.sens === 'hausse' ? 'text-[var(--vert)]' : 'text-[var(--absent-texte)]'}`} aria-hidden="true">{a.sens === 'hausse' ? '▲' : '▼'}</span>
                    <span className="min-w-0"><span className="font-semibold">{a.titre}</span><span className="second block">{a.detail}</span></span>
                    <Link href={a.lien} className="lien-fleche">{t('Voir')} <span aria-hidden="true">→</span></Link>
                  </li>
                ))}
              </ul>
            )}
          </Feuille>

          <section className="ecran" aria-label={t('Chiffres clés')}>
            <div className="tuiles" style={{ '--colonnes': 5 } as React.CSSProperties}>
              <Tuile titre={t('Présence de la marque')} aide={t('Réponses où la marque est nommée ou citée, sur les couples question et IA qui ont une réponse aux deux dates.')} ecart={ui.e} methode="interface" base={t('{n} [n:réponse comparable|réponses comparables]', { n: ui.paires })}>
                <span>{ui.avant.k} <span className="text-[var(--encre-pale)]">→</span> {ui.apres.k}</span>
              </Tuile>
              <Tuile titre={t('Présences gagnées')} aide={t('Couples question et IA où la marque est entrée entre les deux relevés.')}>{ui.gagnees.length}</Tuile>
              <Tuile titre={t('Présences perdues')} aide={t('Couples question et IA où la marque est sortie entre les deux relevés.')}>{ui.perdues.length}</Tuile>
              <Tuile titre={t('Nouvelles marques')} aide={t('Marques nommées au dernier relevé et dans aucune réponse du précédent.')} base={t('sur {n} [n:réponse lue|réponses lues]', { n: r.marques.baseApres })}>{r.marques.apparues.length}</Tuile>
              <Tuile titre={t('Dépense de la période')} aide={t('Appels payants du projet depuis le relevé précédent, tels qu’ils sont inscrits au journal des coûts.')} base={t('depuis le {date}', { date: jourLong(r.depense.depuis) })}>{usdFin(r.depense.total)}</Tuile>
            </div>
          </section>

          <Feuille id="presence" className="scroll-mt-8" titre={t('Présence de la marque, IA par IA')} droite={`${du} → ${au}`} aide={t('Réponses où la marque est nommée ou citée, sur les couples question et IA qui ont une réponse aux deux dates. Les mesures approfondies n’entrent pas dans cette comparaison.')}>
            <div className="defile">
              <table className="tableau fiches">
                <thead>
                  <tr>
                    <th scope="col" className="fixe">{t('IA')}</th>
                    <th scope="col">{t('Méthode')}</th>
                    <th scope="col" className="num">{du}</th>
                    <th scope="col" className="num">{au}</th>
                    <th scope="col">{t('Écart')}</th>
                  </tr>
                </thead>
                <tbody>
                  <LigneComparaison libelle={t('Toutes les IA d’interface')} c={ui} e={ui.e} />
                  {ui.parMoteur.map((x) => <LigneComparaison key={x.moteur} libelle={nom(x.moteur)} c={x} e={x.e} />)}
                  {r.api && <LigneComparaison api libelle={t('Claude')} c={r.api} e={r.api.e} dates={`${jourLong(deCleJour(r.api.jourAvant))} → ${jourLong(deCleJour(r.api.jourApres))}`} />}
                </tbody>
              </table>
            </div>
            {!r.api && m.tous.some((x) => x.methode === 'api') && <p id="api" className="second border-t border-[var(--filet)] px-4 py-2.5">{t('Claude, mesuré par son API, n’a été relevé qu’à une seule date : rien à comparer. Il n’est jamais ajouté aux relevés d’interface.')}</p>}
          </Feuille>

          <Feuille titre={t('Présence gagnée ou perdue, question par question')} droite={<LigneMethode methode="interface" n={ui.paires} unite="réponse comparable" />} aide={t('Une seule réponse par date et par IA : la même question donne des réponses différentes d’un essai à l’autre. Une présence gagnée ou perdue ici est un indice. Pour trancher, lancez une mesure approfondie depuis la page de la question.')}>
            <div className="grid md:grid-cols-2">
              <Bascules titre={t('Présence gagnée')} liste={ui.gagnees} vide={t('La marque n’est entrée dans aucune réponse où elle manquait.')} classe="nomme" />
              <Bascules titre={t('Présence perdue')} liste={ui.perdues} vide={t('La marque n’est sortie d’aucune réponse où elle était.')} classe="absent" />
            </div>
            {r.apercus && (r.apercus.apparus.length > 0 || r.apercus.disparus.length > 0) && (
              <p className="second border-t border-[var(--filet)] px-4 py-2.5">
                {t('Aperçus IA de Google :')} {r.apercus.apparus.length > 0 && <>{t('affiché pour la première fois sur')} {r.apercus.apparus.map((q) => `« ${q.texte} »`).join(', ')}. </>}
                {r.apercus.disparus.length > 0 && <>{t('Plus affiché sur')} {r.apercus.disparus.map((q) => `« ${q.texte} »`).join(', ')}. </>}
                {t('Un Aperçu qui ne s’affiche pas n’est pas une absence de la marque.')}
              </p>
            )}
          </Feuille>

          <div className="grid items-start gap-6 xl:grid-cols-2">
            <Feuille titre={t('Marques nommées pour la première fois')} droite={<LigneMethode methode="interface" n={r.marques.baseApres} unite="réponse lue" />} aide={t('Marques nommées le {au} et dans aucune réponse du {du}.', { au, du })}>
              {r.marques.apparues.length === 0 ? <p className="second p-4">{t('Aucune marque nouvelle au dernier relevé.')}</p> : (
                <ul>
                  {r.marques.apparues.slice(0, 10).map((x, i) => (
                    <li key={x.nom} className={`grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-2 ${i ? 'ligne-t' : ''}`}>
                      <span className="min-w-0">
                        <Link href={`/reponses?marque=${encodeURIComponent(x.nom)}`} className="font-semibold hover:underline">{x.nom}</Link>
                        <span className="second block"><EcartLu e={x.e} vide="" /></span>
                      </span>
                      <span className="nb whitespace-nowrap">{pluriel(x.apres, 'réponse')}</span>
                      {x.suivie ? <span className="pastille neutre">{t('Suivie')}</span> : (
                        <form action={suivreMarque}>
                          <input type="hidden" name="nom" value={x.nom} />
                          <button type="submit" className="bouton bouton-creux bouton-petit" aria-label={t('Suivre {nom} comme concurrent', { nom: x.nom })}>{t('Suivre')}</button>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {r.marques.apparues.length > 10 && <p className="second border-t border-[var(--filet)] px-4 py-2.5">{t('et {n} de plus.', { n: r.marques.apparues.length - 10 })} <Link href="/concurrents" className="lien">{t('Tous les concurrents')}</Link></p>}
            </Feuille>

            <Feuille titre={t('Sources gagnées et perdues')} droite={r.sources ? <LigneMethode methode="interface" n={r.sources.paires} unite="réponse comparable" /> : undefined} aide={t('Sites cités au dernier relevé et pas au précédent, et l’inverse. Le nombre est celui des réponses qui citent le site.')}>
              {!r.sources ? <p className="second p-4">{t('Rien à comparer.')}</p> : (
                <div className="grid sm:grid-cols-2">
                  {([[t('Nouveaux sites'), r.sources.nouveaux], [t('Sites perdus'), r.sources.perdus]] as const).map(([titre, liste]) => (
                    <div key={titre} className="border-b border-[var(--filet)] px-4 py-3 sm:border-b-0 sm:border-r sm:last:border-r-0">
                      <p className="etiquette">{titre} ({liste.length})</p>
                      {liste.length === 0 ? <p className="second mt-1">{t('Aucun.')}</p> : (
                        <ul className="mt-1.5">
                          {liste.slice(0, 8).map((x) => (
                            <li key={x.cle} className="ligne-t flex items-baseline justify-between gap-2 py-1">
                              <Link href={`/sources?fiche=${encodeURIComponent(x.cle)}#fiche`} className="min-w-0 truncate hover:underline">{x.cle}</Link>
                              <span className={`nb whitespace-nowrap ${x.e?.sens === 'hausse' ? 'font-semibold text-[var(--vert)]' : x.e?.sens === 'baisse' ? 'font-semibold text-[var(--absent-texte)]' : 'discret'}`} title={x.e?.sens === 'hausse' || x.e?.sens === 'baisse' ? t('Écart au-dessus de la marge d’erreur') : t('Écart dans la marge d’erreur')}>{x.avant} → {x.apres}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {liste.length > 8 && <p className="second discret mt-1">{t('et {n} de plus.', { n: liste.length - 8 })}</p>}
                    </div>
                  ))}
                </div>
              )}
              <p className="border-t border-[var(--filet)] px-4 py-2.5"><Link href="/sources#bouge" className="lien-fleche">{t('Sources en hausse et en baisse, pages comprises')} <span aria-hidden="true">→</span></Link></p>
            </Feuille>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-2">
            <Feuille titre={t('Les trois actions les plus utiles')} droite={t('tirées de la liste de travail')}>
              {r.actions.length === 0 ? <p className="second p-4">{t('Rien à proposer pour l’instant.')}</p> : (
                <ol>
                  {r.actions.map((l, i) => (
                    <li key={l.cle} className={`grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-3 px-4 py-3 ${i ? 'ligne-t' : ''}`}>
                      <span className="nb text-[var(--encre-pale)]">{String(i + 1).padStart(2, '0')}</span>
                      <span className="min-w-0">
                        <Link href={`/actions?action=${encodeURIComponent(l.cle)}#fiche`} className="font-semibold hover:underline">{l.titre}</Link>
                        <span className="second mt-0.5 block">{t('Preuve :')} {l.nbReponses ? `${pluriel(l.nbReponses, 'réponse')}${l.nbMoteurs ? `, ${pluriel(l.nbMoteurs, 'IA', 'IA')}` : ''} · ` : ''}{l.preuves[0]?.texte}{l.preuves.length > 1 ? ` ${t('et {n} [n:autre question|autres questions]', { n: l.preuves.length - 1 })}` : ''}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              <p className="border-t border-[var(--filet)] px-4 py-2.5"><Link href="/actions" className="lien-fleche">{t('Toute la liste de travail')} <span aria-hidden="true">→</span></Link></p>
            </Feuille>

            <Feuille titre={t('Dépense de la période')} droite={t('depuis le {date}', { date: jourLong(r.depense.depuis) })} aide={t('Appels payants du projet depuis le relevé précédent, tels qu’ils sont inscrits au journal des coûts.')}>
              {r.depense.parOperation.length === 0 ? <p className="second p-4">{t('Aucun appel payant sur la période.')}</p> : (
                <ul>
                  {r.depense.parOperation.map((o, i) => (
                    <li key={o.operation} className={`flex items-baseline justify-between gap-3 px-4 py-2 ${i ? 'ligne-t' : ''}`}><span>{nom(o.operation)} <span className="second discret">· {pluriel(o.appels, 'appel')}</span></span><span className="nb">{usdFin(o.cout)}</span></li>
                  ))}
                  <li className="flex items-baseline justify-between gap-3 border-t border-[var(--encre)] px-4 py-2 font-semibold"><span>{t('Total de la période')}</span><span className="nb">{usdFin(r.depense.total)}</span></li>
                </ul>
              )}
              <p className="second border-t border-[var(--filet)] px-4 py-2.5">{t('Ce mois-ci, tous projets :')} <span className="chiffre">{usdFin(r.depense.mois)}</span> {t('sur')} <span className="chiffre">{usdFin(r.depense.plafond)}</span> {t('de plafond.')}{estAdmin(session) && <> <Link href="/admin/couts" className="lien">{t('Le détail des coûts')}</Link></>}</p>
            </Feuille>
          </div>

          {courriel}
        </>
      )}
      {sp.envoi === 'echec' && !possible && <Bandeau erreur><p>{t('La clé d’envoi est absente : aucun e-mail n’est parti.')}</p></Bandeau>}
    </div>
  )
}
