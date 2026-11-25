import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { Actualisation } from '../releves/Actualisation'
import { Bandeau, CommentLire, EnTete, Feuille, Tampon, TeteMoteur, Vide } from '@/components/outil/Blocs'
import { BoutonEnvoi } from '@/components/outil/BoutonEnvoi'
import { PRIX_ANALYSE_USD } from '@/lib/analyse'
import { classerSources } from '@/lib/classements'
import { projetAffiche, titreOnglet } from '@/lib/contexte'
import { debutDuMois, depenseDepuis, lirePlafond, lireSeuilConfirmation } from '@/lib/couts'
import { prixParQuestion } from '@/lib/estimation'
import { MOTEURS } from '@/lib/fournisseurs/types'
import { traducteur } from '@/lib/i18n/serveur'
import { adresseCourte, dateHeure, jourLong, maintenant, nom, nomCourt, pluriel, usd } from '@/lib/libelles'
import { lireMesuresBrutes, METHODE } from '@/lib/mesures'
import { bilanDeLaPage, clePage, type EtatPage } from '@/lib/pages-suivies'
import { prisma } from '@/lib/prisma'
import { exigerSession } from '@/lib/session'
import { LancerReleve } from '../projets/[id]/LancerReleve'
import { ajouterQuestionsPage, lancerPourLaPage, nePlusSuivre, retirerQuestionPage } from './actions'
import { Confirmer } from './Confirmer'
import { SuivreUnePage } from './SuivreUnePage'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Pages suivies')

const JOUR = 86_400_000

const ETATS: Record<EtatPage, { signe: string; mot: string; classe: string; long: string }> = {
  page: { signe: '◆', mot: 'Page citée', classe: 'cite', long: 'cette page figure parmi les sources de la réponse' },
  marque: { signe: '●', mot: 'Marque, pas cette page', classe: 'nomme', long: 'la marque est nommée ou une autre de ses pages est citée, mais pas celle-ci' },
  lue: { signe: '◇', mot: 'Lue, pas citée', classe: 'neutre', long: 'l’IA a ouvert la page sans la retenir comme source' },
  absente: { signe: '○', mot: 'Absente', classe: 'absent', long: 'l’IA a répondu sans la page ni la marque' },
  vide: { signe: '·', mot: 'Sans réponse', classe: 'sans', long: 'l’IA n’a rien affiché : ce n’est pas une absence' },
  attente: { signe: '…', mot: 'En attente', classe: 'sans', long: 'la réponse n’est pas encore revenue' },
  echec: { signe: '!', mot: 'Échec', classe: 'erreur', long: 'le relevé n’a pas abouti' },
}

/**
 * Pages suivies : partir d'une page de la marque plutôt que d'une question.
 * L'outil lit la page, propose les questions auxquelles elle répond (modifiables),
 * puis dit, IA par IA, si les réponses à ces questions citent cette page.
 */
export default async function PagesSuivies({ searchParams }: { searchParams: Promise<{ fiche?: string; url?: string; lance?: string; erreur?: string }> }) {
  const t = await traducteur()
  const [, projet, sp] = await Promise.all([exigerSession(), projetAffiche(), searchParams])
  if (!projet) redirect('/projets')
  const [m, pages, prix, plafond, depense, seuil] = await Promise.all([
    lireMesuresBrutes(projet.id),
    prisma.pageSuivie.findMany({ where: { projetId: projet.id }, orderBy: { createdAt: 'desc' } }),
    prixParQuestion(), lirePlafond(), depenseDepuis(debutDuMois()), lireSeuilConfirmation(),
  ])
  if (!m) redirect('/projets')

  const bilans = new Map(pages.map((p) => [p.id, bilanDeLaPage(m, p)]))
  const fiche = sp.fiche ? pages.find((p) => p.id === sp.fiche) : undefined
  const bilan = fiche ? bilans.get(fiche.id)! : undefined
  const existantes = m.questions.map((q) => ({ id: q.id, texte: q.texte, theme: q.theme }))
  // Les pages de la marque déjà citées par les IA, qu'on peut suivre d'un clic.
  const suivies = new Set(pages.map((p) => p.cle))
  const nosPages = classerSources(m, m.tous).pages.filter((p) => p.qui === 'nous' && /^https?:\/\//.test(p.url) && !p.url.includes('youtu') && !suivies.has(clePage(p.url))).slice(0, 8)
  const citees = pages.filter((p) => bilans.get(p.id)!.parIA.some((x) => x.page > 0)).length
  const instant = maintenant()
  const enAttente = bilan ? bilan.questions.some((q) => Object.values(q.derniers).some((d) => d?.etat === 'attente')) : false

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Suivre') }, { libelle: t('Pages suivies'), href: fiche ? '/pages' : undefined }, ...(fiche ? [{ libelle: fiche.titre ?? adresseCourte(fiche.url, 40) }] : [])]} />
      <EnTete
        titre={t('Pages suivies')}
        verdict={pages.length === 0
          ? t('Aucune page suivie pour {projet}.', { projet: projet.nom })
          : t('{n} [n:page suivie|pages suivies] pour {projet}, dont {k} [k:citée|citées] au moins une fois par une IA.', { n: pages.length, k: citees, projet: projet.nom })}
      >
        {t('Partez d’une page de la marque, un article ou une page produit. L’outil la lit, propose les questions auxquelles elle répond, puis dit si les IA la citent en y répondant, et ce qu’elles citent à sa place.')}
      </EnTete>

      {/* ── Fiche d'une page ──────────────────────────────────────────────── */}
      {fiche && bilan && (
        <Feuille
          id="fiche"
          titre={fiche.titre ?? adresseCourte(fiche.url, 60)}
          droite={bilan.dernier ? t('dernier relevé le {date}', { date: jourLong(bilan.dernier) }) : t('pas encore relevée')}
        >
          <Actualisation actif={enAttente || !!sp.lance} />
          <div className="space-y-5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <a href={fiche.url} target="_blank" rel="noopener noreferrer" className="lien break-all text-[0.875rem]">{adresseCourte(fiche.url, 110)}</a>
              <div className="flex flex-wrap gap-2">
                <Link href={`/audit?url=${encodeURIComponent(fiche.url)}`} className="bouton bouton-creux bouton-petit">{t('Auditer la page')}</Link>
                {fiche.questions.length > 0 && <Link href={`/partages?nouveau=1&q=${fiche.questions.join(',')}#formulaire`} className="bouton bouton-creux bouton-petit">{t('Partager')}</Link>}
                <Confirmer action={nePlusSuivre} champs={{ pageId: fiche.id }} libelle={t('Ne plus suivre')} question={t('Ne plus suivre cette page ? Ses questions restent dans le projet.')} oui={t('Oui, ne plus suivre')} />
              </div>
            </div>

            {sp.lance && <Bandeau><p><strong className="font-semibold">{t('Relevé envoyé pour les questions de la page.')}</strong> {t('Les réponses reviennent en quelques minutes ; cette fiche se met à jour toute seule.')}</p></Bandeau>}
            {sp.erreur === 'plafond' && <Bandeau erreur><p>{t('Plafond du mois atteint : aucun envoi possible.')}</p></Bandeau>}
            {sp.erreur === 'vide' && <Bandeau erreur><p>{t('Rien à envoyer : cochez au moins une IA, et rattachez au moins une question à la page.')}</p></Bandeau>}

            {/* Chiffres, IA par IA */}
            {bilan.parIA.length > 0 ? (
              <section className="ecran" aria-label={t('La page, IA par IA')}>
                <div className="tuiles" style={{ '--colonnes': bilan.parIA.length } as React.CSSProperties}>
                  {bilan.parIA.map((x) => (
                    <div key={x.moteur} className={`tuile ${x.methode === 'api' ? 'api' : ''}`}>
                      <div className="tuile-tete"><p className="etiquette"><TeteMoteur moteur={x.moteur} /></p></div>
                      <div className="tuile-valeur">
                        <div className="grand-chiffre">{t('{k} sur {n}', { k: x.page, n: x.n })}</div>
                        <span className="second">{t('réponses qui citent la page')}</span>
                      </div>
                      <p className="tuile-pied"><Tampon methode={x.methode} /><span>{t('marque présente : {k} sur {n}', { k: x.marque, n: x.n })}</span></p>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <p className="second">{fiche.questions.length ? t('Ces questions n’ont pas encore été posées aux IA : lancez le relevé ci-dessous.') : t('Aucune question rattachée : ajoutez-en ci-dessous, ou faites-en proposer.')}</p>
            )}

            {/* Question par question */}
            <div id="questions-page">
              <h3 className="t4 mb-2">{t('Ses questions')} <span className="second font-normal">· {pluriel(bilan.questions.length, 'question')}</span></h3>
              {bilan.questions.length > 0 && (
                <div className="defile">
                  <table className="tableau">
                    <thead>
                      <tr>
                        <th scope="col" className="fixe">{t('Question')}</th>
                        {MOTEURS.filter((x) => bilan.moteurs.includes(x)).map((x) => <th key={x} scope="col"><TeteMoteur moteur={x} /></th>)}
                        <th scope="col" className="text-right"><span className="invisible-lecteur">{t('Retirer')}</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {bilan.questions.map((q) => (
                        <tr key={q.id}>
                          <th scope="row" className="fixe font-normal">
                            <Link href={`/questions/${q.id}`} className="ligne-lien hover:underline">{q.texte}</Link>
                            {q.archive && <span className="second block">{t('archivée : elle n’est plus relevée')}</span>}
                          </th>
                          {MOTEURS.filter((x) => bilan.moteurs.includes(x)).map((x) => {
                            const d = q.derniers[x]
                            if (!d) return <td key={x}><span className="discret">{t('pas relevée')}</span></td>
                            const e = ETATS[d.etat]
                            return (
                              <td key={x}>
                                <Link href={`/questions/${q.id}?ia=${x}#reponses`} className={`pastille ${e.classe}`} title={`${t(e.mot)} : ${t(e.long)} · ${jourLong(d.releve.createdAt)}`}>
                                  <span className="signe" aria-hidden="true">{e.signe}</span>{t(e.mot)}
                                </Link>
                              </td>
                            )
                          })}
                          <td className="text-right">
                            <form action={retirerQuestionPage}>
                              <input type="hidden" name="pageId" value={fiche.id} />
                              <input type="hidden" name="questionId" value={q.id} />
                              <BoutonEnvoi className="bouton bouton-creux bouton-petit">{t('Retirer')}</BoutonEnvoi>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="second mt-2">{t('Chaque case montre la dernière réponse de l’IA. « Retirer » détache la question de la page ; elle reste dans le projet.')}</p>

              <form action={ajouterQuestionsPage} className="mt-4 grid gap-2">
                <input type="hidden" name="pageId" value={fiche.id} />
                <label className="libelle">
                  {t('Ajouter des questions à la main')} <span className="second font-normal">· {t('une par ligne')}</span>
                  <textarea name="lignes" rows={2} className="champ mt-1" placeholder={t('Quelle application de contrôle parental choisir ?')} />
                </label>
                <div><BoutonEnvoi className="bouton bouton-creux bouton-petit">{t('Ajouter à la page')}</BoutonEnvoi></div>
              </form>
              <div className="mt-4">
                <SuivreUnePage pageId={fiche.id} existantes={[]} prix={usd(0.01)} />
              </div>
            </div>

            {/* Lancer un relevé pour les seules questions de la page */}
            {fiche.questions.length > 0 && (
              <Feuille titre={t('Lancer un relevé pour ces questions')} droite={t('le prix s’affiche avant l’envoi')}>
                <LancerReleve
                  projetId={projet.id}
                  questions={bilan.questions.filter((q) => !q.archive).length}
                  depense={depense}
                  plafond={plafond}
                  seuil={seuil}
                  prixLecture={PRIX_ANALYSE_USD}
                  action={lancerPourLaPage}
                  champs={{ pageId: fiche.id }}
                  lignes={MOTEURS.map((x) => {
                    const d = m.tous.filter((r) => r.moteur === x && fiche.questions.includes(r.question.id)).at(-1)?.createdAt
                    return { moteur: x, nom: nom(x), api: METHODE[x] === 'api', prix: prix[x], dernier: d ? jourLong(d) : null, joursDepuis: d ? Math.floor((instant - d.getTime()) / JOUR) : null, rythme: METHODE[x] === 'api' ? 14 : 7 }
                  })}
                />
              </Feuille>
            )}

            {/* Ce qui est cité à sa place, et ailleurs */}
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <h3 className="t4 mb-2">{t('Cité à sa place')}</h3>
                {bilan.aSaPlace.length === 0 ? <p className="second">{t('Rien pour l’instant : il faut des réponses qui ne citent pas la page.')}</p> : (
                  <ul className="grid gap-1.5">
                    {bilan.aSaPlace.map((s) => (
                      <li key={s.url} className="flex items-baseline justify-between gap-3">
                        <Link href={`/sources?onglet=pages&fiche=${encodeURIComponent(s.url)}#fiche`} className={`lien min-w-0 truncate ${s.nous ? 'surligne' : ''}`} title={s.url}>{s.titre ?? adresseCourte(s.url, 60)}</Link>
                        <span className="second whitespace-nowrap">{s.nous ? `${t('à nous')} · ` : ''}{pluriel(s.reponses, 'réponse')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="t4 mb-2">{t('Citée sur d’autres questions')}</h3>
                {bilan.ailleurs.length === 0 ? <p className="second">{t('Aucune autre question du projet ne fait citer cette page.')}</p> : (
                  <p>{t('{n} [n:réponse|réponses] à d’autres questions du projet la [n:cite|citent].', { n: bilan.ailleurs.length })} <Link href={`/reponses?page=${encodeURIComponent(fiche.url)}`} className="lien">{t('Voir les réponses')}</Link></p>
                )}
              </div>
            </div>
          </div>
        </Feuille>
      )}

      {/* ── Suivre une page ───────────────────────────────────────────────── */}
      {!fiche && (
        <Feuille id="suivre" titre={t('Suivre une page')} droite={t('lecture gratuite · questions proposées : moins de {prix}', { prix: usd(0.01) })}>
          <div className="p-4">
            <SuivreUnePage urlDepart={sp.url ?? ''} existantes={existantes} prix={usd(0.01)} />
          </div>
        </Feuille>
      )}

      {/* ── Les pages suivies ─────────────────────────────────────────────── */}
      {pages.length > 0 ? (
        <Feuille titre={t('Les pages suivies')} droite={pluriel(pages.length, 'page')}>
          <div className="defile">
            <table className="tableau">
              <thead>
                <tr>
                  <th scope="col" className="fixe">{t('Page')}</th>
                  <th scope="col" className="num">{t('Questions')}</th>
                  <th scope="col">{t('Interface')}</th>
                  <th scope="col">{t('Claude (API)')}</th>
                  <th scope="col">{t('Dernier relevé')}</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => {
                  const b = bilans.get(p.id)!
                  const ui = b.parIA.filter((x) => x.methode === 'interface')
                  const api = b.parIA.filter((x) => x.methode === 'api')
                  const somme = (xs: typeof ui) => ({ k: xs.reduce((s, x) => s + x.page, 0), n: xs.reduce((s, x) => s + x.n, 0) })
                  const su = somme(ui)
                  const sa = somme(api)
                  return (
                    <tr key={p.id} className={fiche?.id === p.id ? 'a-nous' : ''}>
                      <th scope="row" className="fixe">
                        <Link href={`/pages?fiche=${p.id}#fiche`} className="ligne-lien line-clamp-1 font-semibold hover:underline">{p.titre ?? adresseCourte(p.url, 60)}</Link>
                        <span className="second discret block truncate font-normal">{adresseCourte(p.url, 70)}</span>
                      </th>
                      <td className="num">{p.questions.length}</td>
                      <td>{su.n === 0 ? <span className="discret">{t('pas encore relevée')}</span> : <span className={`pastille ${su.k > 0 ? 'cite' : 'absent'}`}>{t('citée {k} sur {n}', { k: su.k, n: su.n })}</span>}</td>
                      <td>{sa.n === 0 ? <span className="discret">—</span> : <span className={`pastille ${sa.k > 0 ? 'cite' : 'absent'}`}>{t('citée {k} sur {n}', { k: sa.k, n: sa.n })}</span>}</td>
                      <td>{b.dernier ? dateHeure(b.dernier) : <span className="discret">{t('jamais')}</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="second border-t border-[var(--filet)] px-4 py-2.5">{t('« Citée 3 sur 12 » : 3 réponses sur 12 aux questions de la page la citent parmi leurs sources. Interface et API sont comptées à part.')}</p>
        </Feuille>
      ) : (
        !fiche && <Vide titre={t('Aucune page suivie')}>{t('Collez ci-dessus l’adresse d’un article ou d’une page de la marque.')}</Vide>
      )}

      {/* ── Pages de la marque déjà citées ───────────────────────────────── */}
      {!fiche && nosPages.length > 0 && (
        <Feuille titre={t('Pages de la marque déjà citées par les IA')} droite={t('à suivre d’un clic')}>
          <ul>
            {nosPages.map((p, i) => (
              <li key={p.url} className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 ${i ? 'ligne-t' : ''}`}>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{p.titre ?? adresseCourte(p.url, 60)}</span>
                  <span className="second block truncate">{adresseCourte(p.url, 80)} · {pluriel(p.releves.length + p.api.length, 'réponse')} · {[...[...p.moteurs].map((x) => nomCourt(x)), ...(p.api.length ? [`${nomCourt('claude')} (API)`] : [])].join(', ')}</span>
                </span>
                <Link href={`/pages?url=${encodeURIComponent(p.url)}#suivre`} className="bouton bouton-creux bouton-petit">{t('Suivre')}</Link>
              </li>
            ))}
          </ul>
        </Feuille>
      )}

      <CommentLire titre={t('Comment lire cet écran')}>
        <p>{t('L’outil part toujours des questions : il les pose aux IA et note les pages qu’elles citent. Suivre une page, c’est lui donner les questions auxquelles elle devrait répondre. Une page n’est « citée » que si elle figure parmi les sources d’une réponse ; « Marque, pas cette page » veut dire que la marque est présente autrement (nommée, ou une autre de ses pages citée).')}</p>
        <p>{t('La lecture de la page est gratuite. La proposition de questions coûte moins d’un centime ; le relevé se paie au prix affiché sur son bouton, comme partout. Les questions gardées rejoignent le projet : elles comptent ensuite dans ses chiffres et ses relevés automatiques.')}</p>
      </CommentLire>
    </div>
  )
}
