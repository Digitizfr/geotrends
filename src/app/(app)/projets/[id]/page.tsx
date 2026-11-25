import Link from 'next/link'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { notFound } from 'next/navigation'
import { adresse, Bandeau, Coches, EnTete, Feuille, LigneMethode, Onglets, Recherche, VerdictLu } from '@/components/outil/Blocs'
import { Confirmer } from '@/components/outil/Confirmer'
import { PRIX_ANALYSE_USD } from '@/lib/analyse'
import { classerIdees, classerMarques } from '@/lib/classements'
import { debutDuMois, depenseDepuis, depenseParProjet, lirePlafond, lireSeuilConfirmation } from '@/lib/couts'
import { PRIX_INTERFACE_USD, prixParQuestion } from '@/lib/estimation'
import { etiquettesAuto, PRIX_ETIQUETTE_USD } from '@/lib/etiquettes'
import { MOTEURS } from '@/lib/fournisseurs/types'
import { traducteur } from '@/lib/i18n/serveur'
import { deuxPoints, entreGuillemets } from '@/lib/i18n/courante'
import { dateHeure, deCleJour, jourLong, langueEtPays, maintenant, nom, nomCourt, pluriel, usd, usdFin } from '@/lib/libelles'
import { LANGUES, nomLangue, nomPays, PAYS } from '@/lib/marches'
import { compter, deMethode, lireMesures, METHODE, recus, verdict } from '@/lib/mesures'
import { lireProjet } from '@/lib/projets'
import { estDeLaChaine, estDuProfil, estDuSite } from '@/lib/releves'
import { ajouterConcurrents, ajouterQuestions, archiverProjet, archiverQuestion, changerMarche, reglerAuto, reglerConcurrent, renommerProjet, retirerConcurrent, retirerPropriete } from '../actions'
import { recupererReponses } from '../../releves/actions'
import { Actualisation } from '../../releves/Actualisation'
import { BoutonCollecte } from '../../releves/BoutonCollecte'
import { AjoutProprietes, AjoutQuestions } from './Ajouts'
import { LancerReleve } from './LancerReleve'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const projet = await lireProjet((await params).id)
  return { title: projet ? `${projet.nom} · GeoTrends` : 'GeoTrends' }
}

const ERREURS: Record<string, string> = {
  vide: 'Cochez au moins une IA, et ajoutez au moins une question.',
  plafond: 'Le plafond de dépense du mois est atteint : aucun relevé n’est parti. Relevez le plafond dans Administration, Coûts.',
  existe: 'Un autre projet porte déjà ce nom.',
}
const JOUR = 86_400_000
const TYPES: Record<string, string> = { site: 'Site', youtube: 'Chaîne YouTube', profil: 'Réseau social', nom: 'Écriture du nom' }
/** Ordre d'affichage des propriétés : sites, chaînes, réseaux, écritures du nom. */
const ORDRE_TYPES = ['site', 'youtube', 'profil', 'nom']

type Params = { onglet?: string; erreur?: string; lance?: string; q?: string; fait?: string }

export default async function Projet({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Params> }) {
  const t = await traducteur()
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const [projet, m, prix, plafond, depense, seuil, depenses, etiquetageAuto] = await Promise.all([lireProjet(id), lireMesures(id), prixParQuestion(), lirePlafond(), depenseDepuis(debutDuMois()), lireSeuilConfirmation(), depenseParProjet(debutDuMois()), etiquettesAuto(id)])
  if (!projet || !m) notFound()

  const onglet = ['questions', 'marque', 'concurrents', 'reglages'].includes(sp.onglet ?? '') ? sp.onglet! : 'releves'
  const base = `/projets/${id}`
  const lien = (o?: string, autres: Record<string, string | undefined> = {}) => adresse(base, {}, { onglet: o, ...autres })
  const actives = projet.questions.filter((q) => !q.archive)
  const archivees = projet.questions.filter((q) => q.archive)
  const n = actives.length
  const dernier = m.tous.at(-1)?.createdAt
  const instant = maintenant()

  // ── Avancement du dernier envoi ─────────────────────────────────────────────
  const dernierJour = m.tous.at(-1)?.jour
  const vague = m.tous.filter((r) => r.jour === dernierJour)
  const cVague = compter(vague)
  const revenues = cVague.envoyes - cVague.attente

  // ── Journal des envois : une ligne par jour et par IA ───────────────────────
  const journal = new Map<string, { jour: string; moteur: (typeof MOTEURS)[number]; rs: typeof m.tous }>()
  for (const r of m.tous) {
    const cle = `${r.jour}:${r.moteur}`
    const x = journal.get(cle) ?? { jour: r.jour, moteur: r.moteur, rs: [] }
    x.rs.push(r)
    journal.set(cle, x)
  }
  const envois = [...journal.values()].sort((a, b) => b.jour.localeCompare(a.jour) || MOTEURS.indexOf(a.moteur) - MOTEURS.indexOf(b.moteur))

  const marques = classerMarques(m, m.tous)
  const reperees = marques.lignes.filter((l) => !l.aNous && !l.suivie && !l.ignoree && l.reponses > 0).slice(0, 12)
  const idees = classerIdees(m).google.slice(0, 12)
  const recherche = (sp.q ?? '').trim().toLowerCase()
  const ui = recus(deMethode(m.tous, 'interface'))

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Régler') }, { libelle: t('Projets'), href: '/projets' }, { libelle: projet.nom }]} />
      <EnTete
        titre={projet.nom}
        verdict={<>
          {t('Marque {marque}, {marche} : {q} [q:question|questions], {c} [c:concurrent suivi|concurrents suivis].', { marque: projet.marque, marche: langueEtPays(projet.langue, projet.pays), q: n, c: projet.concurrents.length })}{' '}
          <span className="second">{dernier ? t('Dernier relevé : {date}.', { date: jourLong(dernier) }) : t('Aucun relevé pour l’instant.')} {t('Dépense du mois : {montant}.', { montant: usd(depenses.get(projet.nom)?.cout ?? 0) })}</span>
        </>}
      />

      {sp.erreur && ERREURS[sp.erreur] && <Bandeau erreur><p>{t(ERREURS[sp.erreur])}</p></Bandeau>}
      {sp.fait && <Bandeau><p>{sp.fait === 'nom' ? t('Le projet a été renommé. Le journal des coûts a suivi.') : t('Le pays et la langue ont été changés.')}</p></Bandeau>}

      <div>
        <Onglets
          libelle={t('Rubriques du projet')}
          actif={onglet}
          onglets={[
            { cle: 'releves', libelle: t('Relevés'), href: lien() },
            { cle: 'questions', libelle: t('Questions'), href: lien('questions'), n },
            { cle: 'marque', libelle: t('Marque et propriétés'), href: lien('marque'), n: projet.proprietes.length },
            { cle: 'concurrents', libelle: t('Concurrents'), href: lien('concurrents'), n: projet.concurrents.length },
            { cle: 'reglages', libelle: t('Réglages du projet'), href: lien('reglages') },
          ]}
        />

        {/* ══ Relevés ══════════════════════════════════════════════════════════ */}
        {onglet === 'releves' && (
          <div className="space-y-8 pt-6">
            <Actualisation actif={m.enAttente > 0 || sp.lance === '1'} />
            {(sp.lance === '1' || m.enAttente > 0) && vague.length > 0 && (
              <form action={recupererReponses}>
                <Bandeau action={m.enAttente > 0 ? <BoutonCollecte /> : <Link href="/questions" className="bouton">{t('Voir les réponses')}</Link>}>
                  <p><strong className="font-semibold">{sp.lance === '1' ? `${t('Relevé envoyé.')} ` : ''}{t('{k} [k:réponse revenue|réponses revenues] sur {n}.', { k: revenues, n: cVague.envoyes })}</strong> {m.enAttente > 0 ? t('Les autres arrivent en quelques minutes, 45 au plus. Cet écran se met à jour tout seul.') : t('Tout est revenu.')}</p>
                  <div className="jauge mt-2 max-w-md" role="progressbar" aria-valuemin={0} aria-valuemax={cVague.envoyes} aria-valuenow={revenues} aria-label={t('Réponses revenues')}><span style={{ width: `${cVague.envoyes ? (revenues / cVague.envoyes) * 100 : 0}%` }} /></div>
                  {sp.lance === '1' && <p className="second mt-2">{t('Claude répond en une à deux minutes par lot : ses réponses s’ajoutent ensuite.')} <Link href="/questions" className="lien">{t('Voir les questions')}</Link></p>}
                </Bandeau>
              </form>
            )}

            <Feuille titre={t('Lancer un relevé')} droite={t('le prix s’affiche avant l’envoi')} aide={n === 0 ? undefined : t('[n:La question du projet est envoyée|Les {n} questions du projet sont envoyées] aux IA cochées. Chaque envoi est inscrit au journal des coûts.', { n })}>
              {n === 0 ? (
                <div className="p-4">
                  <p>{t('Ce projet n’a pas encore de question : il n’y a rien à envoyer.')}</p>
                  <p className="mt-3"><Link href={lien('questions')} className="bouton">{t('Écrire mes questions')}</Link></p>
                </div>
              ) : (
                <LancerReleve
                  projetId={projet.id}
                  questions={n}
                  depense={depense}
                  plafond={plafond}
                  seuil={seuil}
                  prixLecture={PRIX_ANALYSE_USD}
                  lignes={MOTEURS.map((x) => {
                    const d = m.tous.filter((r) => r.moteur === x).at(-1)?.createdAt
                    return { moteur: x, nom: nom(x), api: METHODE[x] === 'api', prix: prix[x], dernier: d ? jourLong(d) : null, joursDepuis: d ? Math.floor((instant - d.getTime()) / JOUR) : null, rythme: METHODE[x] === 'api' ? 14 : 7 }
                  })}
                />
              )}
            </Feuille>

            <Feuille titre={t('Relevés automatiques')} droite={projet.releveAuto || projet.claudeAuto ? t('activés') : t('aucun pour l’instant')} aide={t('Une fois activés, les relevés partent seuls et les réponses arrivent sans rien faire. Ils s’arrêtent d’eux-mêmes si le plafond du mois est atteint. Le premier part dans la demi-heure qui suit l’activation.')}>
              <form action={reglerAuto} className="space-y-3 p-4">
                <input type="hidden" name="projetId" value={projet.id} />
                <label className="flex items-start gap-3">
                  <input type="checkbox" name="releveAuto" defaultChecked={projet.releveAuto} className="mt-1" />
                  <span>
                    <span className="font-semibold">{t('Chaque semaine : ChatGPT, Gemini, Mode IA et Aperçus IA de Google')}</span> <span className="tampon interface">{t('interface')}</span>
                    <span className="second block">{t('Environ {prix} par mois pour {n} [n:question|questions].', { prix: usd(n * 4 * (prix.chatgpt + PRIX_ANALYSE_USD) * 4.33), n })}{projet.dernierAutoInterface && ` ${t('Dernier envoi : {date}.', { date: dateHeure(projet.dernierAutoInterface) })}`}</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 border-t-[3px] border-double border-[var(--encre)] pt-3">
                  <input type="checkbox" name="claudeAuto" defaultChecked={projet.claudeAuto} className="mt-1" />
                  <span>
                    <span className="font-semibold">{t('Toutes les deux semaines : Claude')}</span> <span className="tampon api">{t('API')}</span>
                    <span className="second block">{t('Environ {prix} par mois pour {n} [n:question|questions].', { prix: usd(n * (prix.claude + PRIX_ANALYSE_USD) * 2.17), n })}{projet.dernierAutoClaude && ` ${t('Dernier envoi : {date}.', { date: dateHeure(projet.dernierAutoClaude) })}`}</span>
                  </span>
                </label>
                <button type="submit" className="bouton bouton-creux">{t('Enregistrer')}</button>
              </form>
            </Feuille>

            <Feuille titre={t('Journal des envois')} droite={`${pluriel(m.tous.length, 'envoi')} · ${usdFin(m.tous.reduce((x, r) => x + r.coutUsd, 0))}`}>
              {envois.length === 0 ? (
                <p className="second p-4">{t('Aucun envoi pour l’instant. Le journal se remplit au premier relevé.')}</p>
              ) : (
                <div className="defile haut">
                  <table className="tableau dense fiches">
                    <thead>
                      <tr>
                        <th scope="col" className="fixe">{t('Date')}</th>
                        <th scope="col">{t('IA')}</th>
                        <th scope="col">{t('Méthode')}</th>
                        <th scope="col" className="num">{t('Questions')}</th>
                        <th scope="col" className="num">{t('Réponses revenues')}</th>
                        <th scope="col" className="num">{t('Sans réponse d’IA')}</th>
                        <th scope="col" className="num">{t('En attente')}</th>
                        <th scope="col" className="num">{t('En échec')}</th>
                        <th scope="col" className="num">{t('Coût')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {envois.map((e) => {
                        const c = compter(e.rs)
                        return (
                          <tr key={`${e.jour}:${e.moteur}`}>
                            <th scope="row" className="fixe chiffre whitespace-nowrap">{jourLong(deCleJour(e.jour))}</th>
                            <td><Link href={`/reponses?ia=${e.moteur}`} className="ligne-lien font-semibold">{nomCourt(e.moteur)}</Link></td>
                            <td><span className={`tampon ${METHODE[e.moteur]}`}>{METHODE[e.moteur] === 'api' ? 'API' : 'interface'}</span></td>
                            <td className="num">{new Set(e.rs.map((r) => r.question.id)).size}{e.rs.length !== new Set(e.rs.map((r) => r.question.id)).size && <span className="discret"> · {t('{n} envois', { n: e.rs.length })}</span>}</td>
                            <td className="num">{c.n}</td>
                            <td className="num">{c.vides || <span className="discret">0</span>}</td>
                            <td className="num">{c.attente || <span className="discret">0</span>}</td>
                            <td className="num">{c.echecs ? <span className="font-semibold text-[var(--absent-texte)]">{c.echecs}</span> : <span className="discret">0</span>}</td>
                            <td className="num">{usdFin(e.rs.reduce((x, r) => x + r.coutUsd, 0))}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Feuille>
          </div>
        )}

        {/* ══ Questions ════════════════════════════════════════════════════════ */}
        {onglet === 'questions' && (
          <div className="grid items-start gap-6 pt-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <Feuille titre={t('Questions suivies')} droite={pluriel(n, 'question')} aide={t('Ce qu’un client demanderait à une IA. Une question déjà relevée ne se modifie plus : on l’archive, son historique reste.')}>
                {n > 6 && <div className="border-b border-[var(--filet)] px-4 py-3"><Recherche valeur={sp.q ?? ''} garde={{ onglet: 'questions' }} libelle={t('Chercher dans les questions')} /></div>}
                {n === 0 ? <p className="second p-4">{t('Aucune question pour l’instant. Ajoutez-en ci-dessous.')}</p> : (
                  <div className="defile">
                    <table className="tableau fiches">
                      <thead>
                        <tr>
                          <th scope="col" className="fixe">{t('Question')}</th>
                          <th scope="col">{t('Verdict (interface)')}</th>
                          <th scope="col" className="num">{t('Relevés')}</th>
                          <th scope="col"><span className="invisible-lecteur">{t('Archiver')}</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {actives.filter((q) => !recherche || q.texte.toLowerCase().includes(recherche)).map((q) => {
                          const lue = m.questions.find((x) => x.id === q.id)
                          const c = compter(deMethode(lue?.releves ?? [], 'interface'))
                          return (
                            <tr key={q.id}>
                              <th scope="row" className="fixe max-w-[30rem]"><Link href={`/questions/${q.id}`} className="ligne-lien font-semibold">{q.texte}</Link></th>
                              <td className="whitespace-nowrap"><VerdictLu v={verdict(c.k, c.n)} />{c.n > 0 && <span className="second discret chiffre ml-2">{c.k} sur {c.n}</span>}{lue && lue.releves.length > 0 && <span className="ml-2 inline-block align-middle"><Coches releves={deMethode(lue.releves, 'interface')} /></span>}</td>
                              <td className="num">{q._count.releves}</td>
                              <td className="text-right">
                                <form action={archiverQuestion}>
                                  <input type="hidden" name="questionId" value={q.id} />
                                  {q._count.releves === 0 ? (
                                    <button type="submit" name="archive" value="1" className="lien text-[0.8125rem]">{t('Retirer')}</button>
                                  ) : (
                                    <Confirmer libelle={t('Archiver')} titre={t('Archiver cette question ?')} confirmer={t('Archiver')} nom="archive" valeur="1" className="lien text-[0.8125rem]">
                                      <p>{entreGuillemets(q.texte)}{deuxPoints()}{t('elle ne sera plus relevée et ne comptera plus dans les chiffres. Son historique ({n} [n:relevé|relevés]) reste, et elle peut être reprise.', { n: q._count.releves })}</p>
                                    </Confirmer>
                                  )}
                                </form>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="border-t border-[var(--encre)] p-4">
                  <AjoutQuestions projetId={projet.id} prixParQuestion={4 * PRIX_INTERFACE_USD} etiquetage={etiquetageAuto ? PRIX_ETIQUETTE_USD : null} />
                </div>
              </Feuille>
              {archivees.length > 0 && (
                <Feuille titre={t('Questions archivées')} droite={pluriel(archivees.length, 'question')}>
                  <ul>
                    {archivees.map((q, i) => (
                      <li key={q.id} className={`flex items-center justify-between gap-3 px-4 py-2 ${i ? 'ligne-t' : ''}`}>
                        <Link href={`/questions/${q.id}`} className="min-w-0 text-[var(--encre-douce)] hover:underline">{q.texte}</Link>
                        <form action={archiverQuestion} className="shrink-0">
                          <input type="hidden" name="questionId" value={q.id} />
                          <button type="submit" name="archive" value="0" className="bouton bouton-creux bouton-petit">{t('Reprendre')}</button>
                        </form>
                      </li>
                    ))}
                  </ul>
                </Feuille>
              )}
            </div>
            <Feuille titre={t('Idées de questions')} droite={t('vues chez Google')} aide={t('Les « autres questions posées » affichées par Google sous vos questions. Suivre une idée ne coûte rien ; chaque relevé d’interface coûtera ensuite {prix} de plus.', { prix: usdFin(4 * PRIX_INTERFACE_USD) })}>
              {idees.length === 0 ? <p className="second p-4">{t('Les idées apparaissent après le premier relevé des Aperçus IA.')}</p> : (
                <ul>
                  {idees.map((i, k) => (
                    <li key={i.texte} className={`flex items-center justify-between gap-3 px-4 py-2 ${k ? 'ligne-t' : ''}`}>
                      <span className="min-w-0">{i.texte}<span className="second discret block">{t('vue')} {pluriel(i.fois, 'fois', 'fois')}</span></span>
                      <form action={ajouterQuestions} className="shrink-0">
                        <input type="hidden" name="projetId" value={projet.id} />
                        <input type="hidden" name="questions" value={i.texte} />
                        <button type="submit" className="bouton bouton-creux bouton-petit" aria-label={t('Suivre la question : {texte}', { texte: i.texte })}>{t('Suivre')}</button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
              <p className="border-t border-[var(--filet)] px-4 py-2.5"><Link href="/google#idees" className="lien-fleche">{t('Toutes les idées, et les recherches des IA')} <span aria-hidden="true">→</span></Link></p>
            </Feuille>
          </div>
        )}

        {/* ══ Marque et propriétés ═════════════════════════════════════════════ */}
        {onglet === 'marque' && (
          <div className="space-y-8 pt-6">
            <Feuille titre={t('Ce qui appartient à la marque')} droite={<LigneMethode methode="interface" n={ui.length} unite="réponse" suite={t('tout l’historique')} />} aide={t('Une page d’un de ces sites ou une vidéo d’une de ces chaînes, citée par une IA, compte comme une citation de {marque}. Les autres écritures du nom sont cherchées dans le texte des réponses.', { marque: projet.marque })}>
              <div className="defile">
                <table className="tableau fiches">
                  <thead>
                    <tr>
                      <th scope="col">{t('Type')}</th>
                      <th scope="col" className="fixe">{t('Propriété')}</th>
                      <th scope="col">{t('Ce qu’elle a rapporté')}</th>
                      <th scope="col"><span className="invisible-lecteur">{t('Retirer')}</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="etiquette">{t('Nom de la marque')}</span></td>
                      <th scope="row" className="fixe"><span className="nous-plein font-semibold">{projet.marque}</span></th>
                      <td>{(() => { const k = ui.filter((r) => r.p?.mentionnee).length; return k ? <Link href="/reponses?presence=oui&methode=interface" className="lien">{t('nommée dans {n} [n:réponse|réponses]', { n: k })}</Link> : <span className="second">{t('nommée dans aucune réponse')}</span> })()}</td>
                      <td />
                    </tr>
                    {[...projet.proprietes].sort((a, b) => ORDRE_TYPES.indexOf(a.type) - ORDRE_TYPES.indexOf(b.type) || (a.libelle ?? a.valeur).localeCompare(b.libelle ?? b.valeur)).map((p) => {
                      const k = p.type === 'site' ? ui.filter((r) => r.sources.some((s) => s.role === 'citee' && estDuSite(s.domaine, { nom: '', domaines: [p.valeur], chainesYoutube: [] }))).length
                        : p.type === 'youtube' ? ui.filter((r) => r.sources.some((s) => s.role === 'citee' && estDeLaChaine(s, { nom: '', domaines: [], chainesYoutube: [{ id: p.valeur, nom: '' }] }))).length
                        : p.type === 'profil' ? ui.filter((r) => r.sources.some((s) => s.role === 'citee' && estDuProfil(s, { nom: '', domaines: [], chainesYoutube: [], profils: [p.valeur] }))).length
                        : ui.filter((r) => (r.texte ?? '').toLowerCase().includes(p.valeur.toLowerCase())).length
                      return (
                        <tr key={p.id}>
                          <td><span className="etiquette">{TYPES[p.type] ? t(TYPES[p.type]) : p.type}</span></td>
                          <th scope="row" className="fixe"><span className="font-semibold">{p.libelle ?? p.valeur}</span>{p.libelle && <span className="second discret chiffre block">{p.valeur}</span>}</th>
                          <td>{k ? <span className="pastille cite">{p.type === 'nom' ? t('écrite dans {n} [n:réponse|réponses]', { n: k }) : t('citée dans {n} [n:réponse|réponses]', { n: k })}</span> : <span className="second">{p.type === 'nom' ? t('écrite dans aucune réponse') : t('citée dans aucune réponse')}</span>}</td>
                          <td className="text-right">
                            <form action={retirerPropriete}>
                              <input type="hidden" name="proprieteId" value={p.id} />
                              <Confirmer libelle={t('Retirer')} titre={`Retirer ${p.libelle ?? p.valeur} ?`} confirmer={t('Retirer')} className="lien text-[0.8125rem]">
                                <p>{p.type === 'nom' ? t('Cette écriture ne sera plus cherchée dans les réponses, y compris dans l’historique.') : (p.type === 'youtube' ? t('Les citations de cette chaîne ne compteront plus pour la marque, y compris dans l’historique.') : p.type === 'profil' ? t('Les citations de ce profil ne compteront plus pour la marque, y compris dans l’historique.') : t('Les citations de ce site ne compteront plus pour la marque, y compris dans l’historique.'))}</p>
                              </Confirmer>
                            </form>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {projet.proprietes.length === 0 && <p className="second border-t border-[var(--filet)] px-4 py-3">{t('Rien de déclaré : seule la mention du nom est repérée.')}</p>}
            </Feuille>
            <Feuille titre={t('Ajouter une propriété')} droite={t('l’outil dit ce qu’il a reconnu')}>
              <div className="p-4"><AjoutProprietes projetId={projet.id} sitesDeclares={projet.proprietes.filter((p) => p.type === 'site').map((p) => p.valeur)} /></div>
            </Feuille>
          </div>
        )}

        {/* ══ Concurrents ══════════════════════════════════════════════════════ */}
        {onglet === 'concurrents' && (
          <div className="grid items-start gap-6 pt-6 xl:grid-cols-2">
            <Feuille titre={t('Concurrents suivis')} droite={pluriel(projet.concurrents.length, 'concurrent')} aide={t('Les marques comparées à {marque}. Déclarer leur site permet de leur attribuer les pages citées.', { marque: projet.marque })}>
              {projet.concurrents.length === 0 ? <p className="second p-4">{t('Aucun concurrent déclaré. Suivez une marque repérée, ou saisissez un nom ci-dessous.')}</p> : (
                <ul>
                  {projet.concurrents.map((c, i) => {
                    const l = marques.lignes.find((x) => x.nom === c.nom)
                    return (
                      <li key={c.id} className={`grid gap-x-4 gap-y-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] ${i ? 'ligne-t' : ''}`}>
                        <div className="min-w-0">
                          <Link href={`/reponses?marque=${encodeURIComponent(c.nom)}`} className="font-semibold hover:underline">{c.nom}</Link>
                          <span className="second block">{l ? t('nommé dans {n} [n:réponse|réponses] d’interface', { n: l.reponses }) : t('pas encore nommé')}</span>
                          <form action={reglerConcurrent} className="mt-2 flex items-end gap-2">
                            <input type="hidden" name="concurrentId" value={c.id} />
                            <label className="second min-w-0 flex-1">{t('Son site')}<input name="domaine" defaultValue={c.domaine ?? ''} placeholder={t('exemple.fr')} className="champ mt-0.5 !py-1 !text-[0.875rem]" /></label>
                            <button type="submit" className="bouton bouton-creux bouton-petit">{t('Enregistrer')}</button>
                          </form>
                        </div>
                        <form action={retirerConcurrent} className="sm:text-right">
                          <input type="hidden" name="concurrentId" value={c.id} />
                          <button type="submit" className="lien text-[0.8125rem]" aria-label={t('Ne plus suivre {nom}', { nom: c.nom })}>{t('Ne plus suivre')}</button>
                        </form>
                      </li>
                    )
                  })}
                </ul>
              )}
              <form action={ajouterConcurrents} className="space-y-2 border-t border-[var(--encre)] p-4">
                <input type="hidden" name="projetId" value={projet.id} />
                <label className="libelle">{t('Ajouter des concurrents')}<span className="aide">{t('Un nom de marque par ligne.')}</span><textarea name="concurrents" rows={2} className="champ mt-1" /></label>
                <button type="submit" className="bouton bouton-creux">{t('Ajouter')}</button>
              </form>
            </Feuille>
            <Feuille titre={t('Marques repérées dans les réponses')} droite={<LigneMethode methode="interface" n={marques.base} unite="réponse lue" />} aide={t('Les marques que les IA nomment le plus sur vos questions : de bonnes candidates.')}>
              {reperees.length === 0 ? <p className="second p-4">{marques.base === 0 ? t('Aucune réponse dont les marques sont connues pour l’instant.') : t('Toutes les marques repérées sont déjà suivies ou écartées.')}</p> : (
                <ul>
                  {reperees.map((l, i) => (
                    <li key={l.cle} className={`flex items-center justify-between gap-3 px-4 py-2 ${i ? 'ligne-t' : ''}`}>
                      <span className="min-w-0"><span className="font-semibold">{l.nom}</span><span className="second block">{pluriel(l.reponses, 'réponse')} · {pluriel(l.questions.size, 'question')}</span></span>
                      <form action={ajouterConcurrents} className="shrink-0">
                        <input type="hidden" name="projetId" value={projet.id} />
                        <input type="hidden" name="concurrents" value={l.nom} />
                        <button type="submit" className="bouton bouton-creux bouton-petit" aria-label={`Suivre ${l.nom}`}>{t('Suivre')}</button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
              <p className="border-t border-[var(--filet)] px-4 py-2.5"><Link href="/concurrents#reperees" className="lien-fleche">{t('Toutes les marques repérées')} <span aria-hidden="true">→</span></Link></p>
            </Feuille>
          </div>
        )}

        {/* ══ Réglages du projet ═══════════════════════════════════════════════ */}
        {onglet === 'reglages' && (
          <div className="grid items-start gap-6 pt-6 xl:grid-cols-2">
            <Feuille titre={t('Nom du projet')}>
              <form action={renommerProjet} className="space-y-3 p-4">
                <input type="hidden" name="projetId" value={projet.id} />
                <label className="libelle">{t('Nom affiché dans l’outil')}<span className="aide">{t('Le nom cherché dans les réponses reste « {marque} ». Ses autres écritures s’ajoutent dans « Marque et propriétés ».', { marque: projet.marque })}</span><input name="nom" defaultValue={projet.nom} required maxLength={80} className="champ mt-1" /></label>
                <button type="submit" className="bouton bouton-creux">{t('Renommer')}</button>
              </form>
            </Feuille>
            <Feuille titre={t('Pays et langue')} droite={m.tous.length > 0 || archivees.length > 0 ? 'en lecture seule' : 'modifiables'}>
              {projet.questions.some((q) => q._count.releves > 0) ? (
                <div className="p-4">
                  <p className="font-semibold">{nomPays(projet.pays)} · {nomLangue(projet.langue)}</p>
                  <p className="second mt-1">{t('Ils ne se changent plus après le premier relevé : les courbes doivent rester comparables. Pour un autre marché, créez un autre projet.')}</p>
                </div>
              ) : (
                <form action={changerMarche} className="space-y-3 p-4">
                  <input type="hidden" name="projetId" value={projet.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="libelle">{t('Pays')}<select name="pays" defaultValue={projet.pays} className="champ mt-1">{[...new Set([projet.pays, ...PAYS])].map((c) => <option key={c} value={c}>{nomPays(c)}</option>)}</select></label>
                    <label className="libelle">{t('Langue')}<select name="langue" defaultValue={projet.langue} className="champ mt-1">{[...new Set([projet.langue, ...LANGUES])].map((c) => <option key={c} value={c}>{nomLangue(c)}</option>)}</select></label>
                  </div>
                  <button type="submit" className="bouton bouton-creux">{t('Enregistrer')}</button>
                </form>
              )}
            </Feuille>
            <Feuille titre={t('Archiver le projet')}>
              <form action={archiverProjet} className="space-y-3 p-4">
                <input type="hidden" name="projetId" value={projet.id} />
                <p>{t('Le projet sort de l’outil et ses relevés automatiques s’arrêtent. Son historique reste en base.')}</p>
                <Confirmer libelle={t('Archiver ce projet')} titre={`Archiver ${projet.nom} ?`} confirmer={t('Archiver le projet')} className="bouton bouton-creux bouton-danger">
                  <p>{t('Le projet ne sera plus affiché et plus aucun relevé ne partira pour lui. Rien n’est effacé.')}</p>
                </Confirmer>
              </form>
            </Feuille>
          </div>
        )}
      </div>
    </div>
  )
}
