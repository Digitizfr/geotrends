import Link from 'next/link'
import { Compteur } from '@/components/graphiques/Graphiques'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { adresse, Decoupe, EnTete, Feuille, LigneMethode, Tuile, Vide } from '@/components/outil/Blocs'
import { classerApercus, classerIdees, DIAGNOSTICS, type Diagnostic } from '@/lib/classements'
import { exigerMesures, titreOnglet } from '@/lib/contexte'
import { PRIX_INTERFACE_USD } from '@/lib/estimation'
import { libellePeriode } from '@/lib/filtres'
import { traducteur } from '@/lib/i18n/serveur'
import { adresseCourte, nomCourt, ordinal, pct, pluriel, usdFin } from '@/lib/libelles'
import { suivreQuestion } from '../_actions/suivi'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Aperçus IA et Google')

const CASES: { cle: Diagnostic; top: boolean; cite: boolean }[] = [
  { cle: 'tenu', top: true, cite: true },
  { cle: 'reformuler', top: true, cite: false },
  { cle: 'rare', top: false, cite: true },
  { cle: 'referencement', top: false, cite: false },
]

export default async function Google({ searchParams }: { searchParams: Promise<{ cas?: string; idees?: string }> }) {
  const t = await traducteur()
  const [m, sp] = await Promise.all([exigerMesures(), searchParams])
  const periode = libellePeriode(m.filtres.periode)
  const toutes = classerApercus(m)
  const relevees = toutes.filter((a) => a.total > 0)
  const affichees = relevees.filter((a) => a.affiches > 0)
  const sources = affichees.reduce((n, a) => n + a.sources, 0)
  const dansTop = affichees.reduce((n, a) => n + a.sourcesDansTop, 0)
  const nousTop = relevees.filter((a) => a.notreRang !== null).length
  const nousCites = affichees.filter((a) => a.nousCites > 0).length
  const nbReleves = relevees.reduce((n, a) => n + a.total, 0)
  const lignes = sp.cas ? toutes.filter((a) => a.diagnostic === sp.cas) : toutes
  const idees = classerIdees(m)
  const liste = sp.idees === 'ia' ? idees.ia : idees.google
  const prixParReleve = m.moteursProjet.filter((x) => x !== 'claude').length * PRIX_INTERFACE_USD

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Comprendre') }, { libelle: t('Aperçus IA et Google') }]} m={m} lancer />
      <EnTete
        titre={t('Aperçus IA et Google')}
        verdict={relevees.length === 0 ? t('Aucun Aperçu IA relevé sur cette période.') : <>
          {t('Google affiche un Aperçu IA sur {k} [k:question|questions] sur {n} ; {marque} est citée dans {nous}.', { k: affichees.length, n: relevees.length, marque: m.marque.nom, nous: nousCites })}{' '}
          <span className="second">{t('Mesuré par l’interface. Une question sans Aperçu IA n’est pas une absence de la marque.')}</span>
        </>}
      />

      {relevees.length === 0 ? (
        <Vide titre={t('Les Aperçus IA n’ont pas encore été relevés pour ce projet.')} action={<Link href={`/projets/${m.projet.id}?onglet=releves`} className="bouton">{t('Préparer un relevé')}</Link>}>
          <p>{m.tous.length > 0 ? t('Aucun relevé des Aperçus IA sur la période et les IA choisies dans la barre du haut.') : t('Cochez « Aperçus IA de Google » au moment de lancer un relevé.')}</p>
        </Vide>
      ) : (
        <>
          <section className="ecran" aria-label={t('Chiffres clés')}>
            <div className="tuiles">
              <Tuile titre={t('Aperçus IA affichés')} aide={t('Nombre de questions pour lesquelles Google affiche un Aperçu IA. Une question sans aperçu n’est pas une absence de la marque.')} methode="interface" note={t('sur {n}', { n: relevees.length })} base={t('{n} [n:relevé|relevés]', { n: nbReleves })}><Compteur valeur={affichees.length} /></Tuile>
              <Tuile titre={t('Aperçus qui nous citent')} aide={t('Nombre de questions dont l’Aperçu IA cite une page ou une vidéo de la marque.')} methode="interface" note={t('sur {n}', { n: affichees.length })} base={t('{n} [n:relevé|relevés]', { n: nbReleves })}><Compteur valeur={nousCites} /></Tuile>
              <Tuile titre={t('Sources dans le top 10')} aide={t('Parmi les sources citées par les Aperçus IA, celles qui figurent aussi dans les dix premiers résultats de Google.')} methode="interface" note={t('sur {n}', { n: sources })} base={sources ? t('{part} des sources citées', { part: pct(dansTop / sources) }) : t('aucune source')}><Compteur valeur={dansTop} /></Tuile>
              <Tuile titre={t('Nos pages dans le top 10')} aide={t('Nombre de questions pour lesquelles une page de la marque est dans les dix premiers résultats de Google.')} methode="interface" note={t('sur {n}', { n: relevees.length })} base={t('{n} [n:relevé|relevés]', { n: nbReleves })}><Compteur valeur={nousTop} /></Tuile>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <Feuille titre={t('Que faire, question par question')} droite={t('{n} [n:question|questions] avec un Aperçu IA', { n: affichees.length })} aide={t('Deux questions suffisent : sommes-nous dans les dix premiers résultats de Google, et l’Aperçu nous cite-t-il ? Un clic sur une case filtre le tableau.')}>
              <div className="defile">
                <table className="tableau fiches">
                  <thead>
                    <tr>
                      <th scope="col"><span className="invisible-lecteur">{t('Notre place chez Google')}</span></th>
                      <th scope="col">{t('Cités dans l’Aperçu')}</th>
                      <th scope="col">{t('Pas cités')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[true, false].map((top) => (
                      <tr key={String(top)}>
                        <th scope="row" className="font-semibold">{top ? t('Dans les 10 premiers') : t('Hors des 10 premiers')}</th>
                        {CASES.filter((c) => c.top === top).map((c) => {
                          const n = toutes.filter((a) => a.diagnostic === c.cle).length
                          return (
                            <td key={c.cle} className={sp.cas === c.cle ? 'bg-[var(--papier)]' : ''}>
                              <Link href={adresse('/google', sp, { cas: sp.cas === c.cle ? undefined : c.cle })} scroll={false} className="block py-1">
                                <span className="grand-chiffre block">{n}</span>
                                <span className="font-semibold">{t(DIAGNOSTICS[c.cle].court)}</span>
                              </Link>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="second border-t border-[var(--filet)] px-4 py-2.5">{t('{n} [n:question|questions] sans Aperçu IA : ce n’est pas une absence de la marque.', { n: toutes.filter((a) => a.diagnostic === 'sans_apercu').length })}</p>
            </Feuille>
            <Feuille titre={t('Les sources des Aperçus viennent-elles des 10 premiers ?')} droite={<LigneMethode methode="interface" n={sources} unite="source" />}>
              <div className="p-4">
                {sources === 0 ? <p className="second">{t('Aucune source d’Aperçu sur cette période.')}</p> : (
                  <>
                    <Decoupe libelle={t('Sources des Aperçus')} unite={t('sources')} segments={[{ cle: 'dans', libelle: t('Dans les 10 premiers de Google'), n: dansTop, teinte: 'teinte-encre' }, { cle: 'hors', libelle: t('Hors des 10 premiers'), n: sources - dansTop, teinte: 'teinte-papier' }]} />
                    <p className="second mt-3">{dansTop / sources >= 0.5 ? t('La majorité des sources vient des dix premiers résultats : le référencement classique reste la porte d’entrée.') : t('La majorité des sources vient d’ailleurs que des dix premiers résultats : être bien classé ne suffit pas.')}</p>
                  </>
                )}
              </div>
            </Feuille>
          </div>

          <Feuille titre={t('Question par question')} droite={<>{sp.cas && <Link href={adresse('/google', sp, { cas: undefined })} scroll={false} className="underline">{t('Tout afficher')}</Link>}<span>{pluriel(lignes.length, 'question')}</span></>}>
            <div className="defile">
              <table className="tableau fiches">
                <thead>
                  <tr>
                    <th scope="col" className="fixe">{t('Question')}</th>
                    <th scope="col">{t('Aperçu IA')}</th>
                    <th scope="col">{t('Nous dans l’Aperçu')}</th>
                    <th scope="col">{t('Notre position chez Google')}</th>
                    <th scope="col">{t('Sources dans les 10 premiers')}</th>
                    <th scope="col">{t('Vidéo')}</th>
                    <th scope="col">{t('Diagnostic')}</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((a) => (
                    <tr key={a.question.id}>
                      <th scope="row" className="fixe max-w-[22rem]"><Link href={`/questions/${a.question.id}?ia=google_ai_overview#reponses`} className="ligne-lien font-semibold">{a.question.texte}</Link></th>
                      <td className="whitespace-nowrap">{a.total === 0 ? <span className="second discret">{t('pas relevé')}</span> : a.affiches > 0 ? <>{t('Affiché')}<span className="second discret block">{t('dans {k} [k:relevé|relevés] sur {n}', { k: a.affiches, n: a.total })}</span></> : <span className="pastille sans">{t('Pas d’aperçu')}</span>}</td>
                      <td>{a.affiches === 0 ? '' : a.nousCites > 0 ? <span className="pastille cite"><span className="signe" aria-hidden="true">◆</span>{t('Cités')}{a.affiches > 1 ? ` ${a.nousCites} sur ${a.affiches}` : ''}</span> : <span className="pastille absent"><span className="signe" aria-hidden="true">○</span>{t('Pas cités')}</span>}</td>
                      <td>
                        {a.total === 0 ? '' : a.notreRang ? (
                          <span className="flex items-center gap-2">
                            <span className="chiffre w-8 font-semibold">{a.notreRang}{a.notreRang === 1 ? 'er' : 'e'}</span>
                            <span className="jauge jaune w-24" role="img" aria-label={t('{rang} sur {n}', { rang: ordinal(a.notreRang), n: a.resultats })}><span style={{ width: `${((a.resultats - a.notreRang + 1) / Math.max(a.resultats, 1)) * 100}%` }} /></span>
                          </span>
                        ) : <span className="second">{t('hors des {n} premiers', { n: a.resultats || 10 })}</span>}
                        {a.notrePage && <a href={a.notrePage} target="_blank" rel="noopener noreferrer" className="second lien block max-w-[14rem] truncate">{adresseCourte(a.notrePage, 40)}</a>}
                      </td>
                      <td>
                        {a.affiches === 0 ? '' : (
                          <span className="flex items-center gap-2">
                            <span className="chiffre whitespace-nowrap">{a.sourcesDansTop} sur {a.sources}</span>
                            <span className="jauge w-20" role="img" aria-label={t('{k} sources sur {n} dans les 10 premiers', { k: a.sourcesDansTop, n: a.sources })}><span style={{ width: `${a.sources ? (a.sourcesDansTop / a.sources) * 100 : 0}%` }} /></span>
                          </span>
                        )}
                      </td>
                      <td>{a.affiches === 0 ? '' : a.video ? 'Oui' : <span className="discret">{t('Non')}</span>}</td>
                      <td className="max-w-[16rem]"><span className={a.diagnostic === 'tenu' ? 'font-semibold text-[var(--vert)]' : a.diagnostic === 'sans_apercu' || a.diagnostic === 'jamais' ? 'second' : 'font-semibold'}>{t(DIAGNOSTICS[a.diagnostic].court)}</span></td>
                    </tr>
                  ))}
                  {lignes.length === 0 && <tr><td colSpan={7}><span className="second">{t('Aucune question dans ce cas.')}</span></td></tr>}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[var(--filet)] px-4 py-2.5"><LigneMethode methode="interface" n={nbReleves} periode={periode} suite={t('détail : dernier relevé de chaque question')} /></div>
          </Feuille>
        </>
      )}

      {/* ── Idées de questions ─────────────────────────────────────────────── */}
      <Feuille
        id="idees"
        titre={t('Idées de questions à suivre')}
        droite={<><Link href={adresse('/google', sp, { idees: undefined })} scroll={false} className={sp.idees === 'ia' ? 'underline' : 'font-bold text-[var(--encre)]'}>{t('Autres questions posées (')}{idees.google.length})</Link><Link href={adresse('/google', sp, { idees: 'ia' })} scroll={false} className={sp.idees === 'ia' ? 'font-bold text-[var(--encre)]' : 'underline'}>{t('Recherches des IA (')}{idees.ia.length})</Link></>}
        aide={sp.idees === 'ia'
          ? t('Ce que l’IA tape elle-même dans un moteur de recherche avant de répondre (connu pour ChatGPT et Claude). Ce sont des sujets pour lesquels écrire.')
          : t('Les « autres questions posées » que Google affiche sous vos questions : de vraies questions d’internautes. Ajouter une question au projet ne coûte rien ; chaque relevé suivant coûtera environ {prix} de plus par question.', { prix: usdFin(prixParReleve) })}
      >
        {liste.length === 0 ? (
          <p className="second p-4">{m.tous.length === 0 ? t('Les idées apparaissent après le premier relevé.') : t('Aucune idée relevée pour l’instant.')}</p>
        ) : (
          <div className="defile haut">
            <table className="tableau dense fiches">
              <thead>
                <tr>
                  <th scope="col" className="fixe">{sp.idees === 'ia' ? t('Recherche lancée par l’IA') : t('Question posée par les internautes')}</th>
                  <th scope="col" className="num">{t('Vue')}</th>
                  <th scope="col">{sp.idees === 'ia' ? 'IA' : t('Sous la question')}</th>
                  <th scope="col"><span className="invisible-lecteur">{t('Ajouter')}</span></th>
                </tr>
              </thead>
              <tbody>
                {liste.slice(0, 120).map((i) => (
                  <tr key={i.texte}>
                    <th scope="row" className="fixe max-w-[30rem] font-semibold">{i.texte}</th>
                    <td className="num">{pluriel(i.fois, 'fois', 'fois')}</td>
                    <td className="second max-w-[22rem]">
                      {sp.idees === 'ia' && <span>{[...i.moteurs].map(nomCourt).join(', ')} · </span>}
                      <Link href={`/questions/${[...i.vuPour.keys()][0]}`} className="lien">{[...i.vuPour.values()][0].slice(0, 60)}{[...i.vuPour.values()][0].length > 60 ? '…' : ''}</Link>
                      {i.vuPour.size > 1 && ` et ${i.vuPour.size - 1} de plus`}
                    </td>
                    <td className="text-right">
                      <form action={suivreQuestion}>
                        <input type="hidden" name="texte" value={i.texte} />
                        <button type="submit" className="bouton bouton-creux bouton-petit" aria-label={t('Ajouter au projet : {texte}', { texte: i.texte })}>{t('Ajouter au projet')}</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Feuille>
    </div>
  )
}
