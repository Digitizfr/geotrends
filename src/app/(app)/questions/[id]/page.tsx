import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Reponse } from '@/components/Reponse'
import { Courbe } from '@/components/graphiques/Graphiques'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { Bandeau, Carreau, CommentLire, EtatLu, Feuille, LegendeEtats, LigneMethode, NomMarque, Tampon, TeteMoteur, VerdictLu, Vide } from '@/components/outil/Blocs'
import { BoutonEnvoi } from '@/components/outil/BoutonEnvoi'
import { Confirmer } from '@/components/outil/Confirmer'
import { Initiale } from '@/components/outil/Initiale'
import { PRIX_ANALYSE_USD } from '@/lib/analyse'
import { APPARTENANCES, appartenance, classerMarques, typeDeDomaine, typeEcrit } from '@/lib/classements'
import { courbe } from '@/lib/courbes'
import { debutDuMois, depenseDepuis, lirePlafond, lireSeuilConfirmation } from '@/lib/couts'
import { PRIX_INTERFACE_USD } from '@/lib/estimation'
import { libellePeriode } from '@/lib/filtres'
import { MOTEURS } from '@/lib/fournisseurs/types'
import { entreGuillemets, tr } from '@/lib/i18n/courante'
import { traducteur } from '@/lib/i18n/serveur'
import { adresseCourte, deCleJour, heure, jourCourt, jourLong, langueEtPays, nom, nomCourt, ordinal, pct, pluriel, usdFin } from '@/lib/libelles'
import { compter, deMethode, deMoteur, INTENTIONS, intervalle, lireMesures, METHODE, SEUIL_CHIFFRE, SEUIL_VERDICT, simple, verdict, type Intention, type Mesures, type ReleveLu } from '@/lib/mesures'
import { prisma } from '@/lib/prisma'
import { marqueDe } from '@/lib/projets'
import { estALaMarque } from '@/lib/releves'
import { lireTravail } from '@/lib/travail'
import { archiverQuestion } from '../../projets/actions'
import { recupererReponses } from '../../releves/actions'
import { Actualisation } from '../../releves/Actualisation'
import { BoutonCollecte } from '../../releves/BoutonCollecte'
import { corrigerEtiquettes } from '../actions'
import { Colonnes } from './Colonnes'
import { MesureApprofondie } from './MesureApprofondie'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [t, q] = await Promise.all([traducteur(), prisma.question.findUnique({ where: { id }, select: { texte: true, projet: { select: { nom: true } } } })])
  return { title: q ? `${q.texte} · ${q.projet.nom} · GeoTrends` : `${t('Question')} · GeoTrends` }
}

const etatEcrit = (x: ReleveLu) => (x.present ? tr('présente') : x.statut === 'recu' ? tr('absente') : tr('sans réponse'))

/** Liste numérotée de sources : le numéro est celui de la pastille dans le texte de la réponse. */
function Sources({ sources, m, nommees }: { sources: ReleveLu['sources']; m: Mesures; nommees: Set<string> }) {
  return (
    <ol className="mt-1.5">
      {sources.map((s, i) => {
        const qui = appartenance(s, m, nommees)
        const nomSource = s.videoYoutube ? s.videoYoutube.chaineNom : s.domaine
        return (
          <li key={s.id} className="ligne-t grid grid-cols-[1.25rem_auto_minmax(0,1fr)] items-start gap-2 py-1.5">
            <span className="nb text-[var(--encre-pale)]">{i + 1}</span>
            <Initiale nom={nomSource} nous={qui === 'nous'} taille="p" />
            <span className="min-w-0">
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="block hover:underline" title={s.url}>
                <span className="font-semibold">{s.videoYoutube ? `YouTube · ${nomSource}` : nomSource}</span>
                {qui === 'nous' && <span className="etiquette-nous ml-1.5">{tr('à nous')}</span>}
                {(s.videoYoutube?.titre ?? s.titre) && <span className="second block truncate">{s.videoYoutube?.titre ?? s.titre}</span>}
              </a>
              <span className="second discret block">
                {tr(typeEcrit(s.videoYoutube ? 'video' : typeDeDomaine(s.domaine, m, nommees), qui))}{qui !== 'nous' && ` · ${tr(APPARTENANCES[qui].libelle).toLowerCase()}`}
                {s.videoYoutube?.publieLe && ` · ${tr('publiée le {date}', { date: jourLong(s.videoYoutube.publieLe) })}`}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** La réponse d'une IA un jour donné : son texte à gauche, et à droite ce qu'on en tire (marques, sources, pages lues, recherches). */
function Colonne({ moteur, r, m, nommees, questionId, duJour }: { moteur: ReleveLu['moteur']; r: ReleveLu | undefined; m: Mesures; nommees: Set<string>; questionId: string; duJour: ReleveLu[] }) {
  const place = r ? duJour.findIndex((x) => x.id === r.id) : -1
  const versReleve = (x: ReleveLu) => `/questions/${questionId}?releve=${x.jour}&ia=${moteur}&r=${x.id}#reponses`
  const tete = (
    <div className="border-b border-[var(--encre)] px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <h3 className="text-[1rem] font-bold">{nom(moteur)}</h3>
        <Tampon methode={METHODE[moteur]} />
        {r && <EtatLu r={r} />}
        {r?.approfondi && <span className="puce">{tr('mesure approfondie')}</span>}
        {r?.urlControle && <a href={r.urlControle} target="_blank" rel="noopener noreferrer nofollow" className="lien ml-auto text-[0.8125rem]">{tr('Reposer la question dans l’interface')}</a>}
      </div>
      {r && (
        <p className="second mt-1">
          {r.releveLe ? tr('Relevée le {date} à {heure}', { date: jourLong(r.releveLe), heure: heure(r.releveLe) }) : tr('Envoyée le {date} à {heure}', { date: jourLong(r.createdAt), heure: heure(r.createdAt) })}
          {r.modele && <> · <span className="chiffre">{r.modele}</span></>} · <span className="chiffre">{usdFin(r.coutUsd)}</span>
        </p>
      )}
      {r && duJour.length > 1 && (
        <p className="second mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="chiffre">{tr('Réponse {i} sur {n} ce jour-là', { i: place + 1, n: duJour.length })}</span>
          {place > 0 ? <Link href={versReleve(duJour[place - 1])} scroll={false} className="lien">← {tr('précédente')}</Link> : <span className="discret">← {tr('précédente')}</span>}
          {place < duJour.length - 1 ? <Link href={versReleve(duJour[place + 1])} scroll={false} className="lien">{tr('suivante')} →</Link> : <span className="discret">{tr('suivante')} →</span>}
        </p>
      )}
    </div>
  )
  if (!r) {
    return (
      <>
        {tete}
        <div className="px-4 py-4">
          <p className="second">{tr('Cette question n’a pas été posée à {ia} ce jour-là.', { ia: nom(moteur) })}</p>
          <p className="mt-2"><Link href={`/projets/${m.projet.id}?onglet=releves`} className="lien text-[0.875rem]">{tr('Préparer un relevé')}</Link></p>
        </div>
      </>
    )
  }
  const citees = r.sources.filter((s) => s.role === 'citee')
  const consultees = r.sources.filter((s) => s.role === 'consultee')
  const citeesGoogle = new Set(citees.map((s) => s.domaine))
  return (
    <>
      {tete}
      {r.statut === 'en_attente' && (
        <form action={recupererReponses} className="space-y-3 px-4 py-4">
          <p>{tr('Envoyée à {heure}. Les réponses reviennent en quelques minutes, 45 au plus.', { heure: heure(r.createdAt) })}</p>
          <BoutonCollecte />
        </form>
      )}
      {r.statut === 'echec' && (
        <div className="px-4 py-4">
          <Bandeau erreur>
            <p><strong className="font-semibold">{tr('Le relevé n’a pas abouti.')}</strong> {r.erreur ?? tr('Le fournisseur n’a pas donné de raison.')}</p>
            <p className="second mt-1"><Link href={`/projets/${m.projet.id}?onglet=releves`} className="lien">{tr('Préparer un relevé')}</Link> : {tr('le prix s’affiche avant l’envoi.')}</p>
          </Bandeau>
        </div>
      )}
      {r.statut === 'vide' && (
        <p className="px-4 py-4 text-[var(--encre-douce)]">
          {moteur === 'google_ai_overview' ? tr('Google n’a pas affiché d’Aperçu IA pour cette question ce jour-là. Ce n’est pas une absence de la marque.') : (r.erreur ?? tr('L’IA n’a rien affiché pour cette question ce jour-là.'))}
        </p>
      )}
      <div className="reponse-grille">
        <div className="interieur">
          {r.statut === 'recu' && r.texte && (
            <div className="min-w-0 px-4 py-4">
              <Reponse
                texte={r.texte}
                nous={[m.marque.nom, ...(m.marque.ecritures ?? [])]}
                concurrents={m.concurrents.map((c) => c.nom)}
                sources={citees.map((s, i) => ({ url: s.url, numero: i + 1, aNous: estALaMarque(s, m.marque) }))}
              />
            </div>
          )}
          {(r.statut === 'recu' || (moteur === 'google_ai_overview' && r.resultatsGoogle.length > 0)) && (
            <aside className="reponse-details" aria-label={tr('Ce que dit cette réponse')}>
              {r.statut === 'recu' && r.texte && (
                <>
                  <div>
                    <p className="sous-titre bloc-titre">{tr('Marques nommées, dans l’ordre')}</p>
                    {!r.marquesLues ? (
                      <p className="second">{tr('Pas encore lues pour cette réponse. La lecture automatique se lance depuis la vue d’ensemble.')}</p>
                    ) : r.marques.length === 0 ? (
                      <p className="second">{tr('Aucune marque nommée.')}</p>
                    ) : (
                      <ol>
                        {r.marques.map((x, i) => {
                          const nous = r.rang === i + 1
                          const suivi = m.concurrents.some((c) => simple(x.nom).includes(simple(c.nom)))
                          return (
                            <li key={`${x.nom}-${i}`} className={`flex items-center gap-2 py-1 ${i ? 'ligne-t' : ''}`} title={x.description ?? undefined}>
                              <span className="nb w-4 text-right text-[var(--encre-pale)]">{i + 1}</span>
                              <NomMarque nom={x.nom} nous={nous} />
                              {suivi && <span className="puce">{tr('suivi')}</span>}
                              {x.ton === 'positif' && <span className="pastille nomme ml-auto" title={tr('Ton positif : la marque est recommandée')}>+</span>}
                              {x.ton === 'negatif' && <span className="pastille absent ml-auto" title={tr('Ton négatif : la marque est déconseillée')}>−</span>}
                            </li>
                          )
                        })}
                        {!r.present && <li className="ligne-t py-1.5"><span className="pastille absent"><span className="signe" aria-hidden="true">○</span>{tr('{marque} : absente', { marque: m.marque.nom })}</span></li>}
                      </ol>
                    )}
                  </div>
                  <div>
                    <p className="sous-titre bloc-titre">{tr('Sources citées')} <span className="chiffre">({citees.length})</span></p>
                    {citees.length === 0 ? <p className="second">{tr('Aucune source affichée avec cette réponse.')}</p> : <Sources sources={citees} m={m} nommees={nommees} />}
                  </div>
                  {consultees.length > 0 && (
                    <details>
                      <summary className="sous-titre bloc-titre">{tr('Pages lues sans être citées')} <span className="chiffre">({consultees.length})</span></summary>
                      <Sources sources={consultees} m={m} nommees={nommees} />
                    </details>
                  )}
                  {r.recherches.length > 0 && (
                    <div>
                      <p className="sous-titre bloc-titre">{tr('Recherches lancées par l’IA')} <span className="chiffre">({r.recherches.length})</span></p>
                      <ul>
                        {r.recherches.map((x) => <li key={x} className="py-0.5 text-[var(--encre-douce)]">{entreGuillemets(x)}</li>)}
                      </ul>
                    </div>
                  )}
                  {r.questionsAssociees.length > 0 && (
                    <div>
                      <p className="sous-titre bloc-titre">{tr('Questions associées')} <span className="chiffre">({r.questionsAssociees.length})</span></p>
                      <ul>
                        {r.questionsAssociees.map((x) => <li key={x} className="py-0.5 text-[var(--encre-douce)]">{x}</li>)}
                      </ul>
                    </div>
                  )}
                </>
              )}
              {moteur === 'google_ai_overview' && r.resultatsGoogle.length > 0 && (
                <div>
                  <p className="sous-titre bloc-titre">{tr('Les {n} premiers résultats de Google', { n: r.resultatsGoogle.length })}</p>
                  <ol>
                    {r.resultatsGoogle.map((g) => {
                      const cite = r.statut === 'recu' && citeesGoogle.has(g.domaine)
                      const aNous = m.marque.domaines.some((d) => g.domaine === d || g.domaine.endsWith(`.${d}`))
                      return (
                        <li key={`${g.rang}-${g.url}`} className="ligne-t grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-2 py-1">
                          <span className="nb text-[var(--encre-pale)]">{g.rang}</span>
                          <a href={g.url} target="_blank" rel="noopener noreferrer nofollow" className="min-w-0 truncate hover:underline" title={g.titre ?? g.url}>
                            <span className={`font-semibold ${aNous ? 'nous-plein' : ''}`}>{g.domaine}</span>
                          </a>
                          {cite ? <span className="pastille nomme"><span className="signe" aria-hidden="true">✓</span>{tr('cité par l’Aperçu')}</span> : <span className="second discret">{tr('pas cité')}</span>}
                        </li>
                      )
                    })}
                  </ol>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </>
  )
}

export default async function DetailQuestion({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ releve?: string; ia?: string; r?: string; lance?: string; erreur?: string }> }) {
  const t = await traducteur()
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const fiche = await prisma.question.findUnique({ where: { id }, select: { projetId: true } })
  if (!fiche) notFound()
  const m = await lireMesures(fiche.projetId)
  if (!m) notFound()
  const q = m.questions.find((x) => x.id === id) ?? m.archivees.find((x) => x.id === id)
  if (!q) notFound()
  const archivee = !m.questions.some((x) => x.id === id)
  const rang = m.questions.findIndex((x) => x.id === id)
  const avant = rang > 0 ? m.questions[rang - 1] : null
  const apres = rang >= 0 && rang < m.questions.length - 1 ? m.questions[rang + 1] : null

  // Les jours de relevé de la question, et celui qu'on regarde (le dernier par défaut).
  const jours = [...new Set(q.releves.map((r) => r.jour))].sort()
  const jour = sp.releve && jours.includes(sp.releve) ? sp.releve : jours.at(-1)
  // Une IA peut avoir plusieurs relevés le même jour (mesure approfondie) : on montre le dernier, ou celui qu'on a choisi.
  const tousDuJour = (moteur: ReleveLu['moteur']) => deMoteur(q.releves, moteur).filter((r) => r.jour === jour)
  const duJour = (moteur: ReleveLu['moteur']) => tousDuJour(moteur).find((r) => r.id === sp.r) ?? tousDuJour(moteur).at(-1)
  const nommees = new Set<string>(m.tous.flatMap((r) => r.marques.map((x) => simple(x.nom))))
  const enAttente = q.tous.filter((r) => r.statut === 'en_attente').length
  const ui = deMethode(q.releves, 'interface')
  const api = deMethode(q.releves, 'api')
  const cUi = compter(ui)
  const interfaces = m.moteurs.filter((x) => METHODE[x] === 'interface')
  const moteursApi = m.moteurs.filter((x) => METHODE[x] === 'api')
  const periode = libellePeriode(m.filtres.periode)

  // Panneau « Sur cette question » : toutes les réponses d'interface de la sélection.
  const marques = classerMarques(m, ui)
  const pages = new Map<string, { url: string; domaine: string; titre: string | null; moteurs: Set<string>; aNous: boolean }>()
  for (const r of ui) {
    if (r.statut !== 'recu') continue
    for (const s of r.sources) {
      if (s.role !== 'citee') continue
      const x = pages.get(s.url) ?? { url: s.url, domaine: s.domaine, titre: s.videoYoutube?.titre ?? s.titre, moteurs: new Set<string>(), aNous: estALaMarque(s, m.marque) }
      x.moteurs.add(r.moteur)
      pages.set(s.url, x)
    }
  }
  const gagnantes = [...pages.values()].filter((p) => p.moteurs.size >= 2 && !p.aNous).sort((a, b) => b.moteurs.size - a.moteurs.size).slice(0, 8)
  const nosPages = new Map<string, { url: string; citee: number; lue: number }>()
  for (const r of q.releves) {
    for (const s of r.sources) {
      if (!estALaMarque(s, m.marque)) continue
      const x = nosPages.get(s.url) ?? { url: s.url, citee: 0, lue: 0 }
      if (s.role === 'citee') x.citee++
      else x.lue++
      nosPages.set(s.url, x)
    }
  }
  const actions = (await lireTravail(m.projet.id, marqueDe(m.projet))).filter((l) => l.preuves.some((p) => p.id === id))
  const lien = (j: string, ia?: string, r?: string) => `/questions/${id}?releve=${j}${ia ? `&ia=${ia}` : ''}${r ? `&r=${r}` : ''}#reponses`
  const [plafond, depense, seuil] = await Promise.all([lirePlafond(), depenseDepuis(debutDuMois()), lireSeuilConfirmation()])
  const themes = [...new Set([...m.questions, ...m.archivees].map((x) => x.theme).filter((x): x is string => !!x))].sort()
  const approfondis = q.tous.filter((r) => r.approfondi).length
  const iUi = intervalle(cUi.k, cUi.n)
  const v = verdict(cUi.k, cUi.n)
  const courbeUi = courbe([
    { cle: 'ensemble', nom: t('Toutes les IA d’interface'), releves: ui, bande: true },
    ...interfaces.map((x) => ({ cle: x, nom: nomCourt(x), releves: deMoteur(ui, x) })),
  ])
  const courbeApi = courbe(moteursApi.map((x) => ({ cle: x, nom: `${nomCourt(x)} (API)`, releves: deMoteur(api, x), pointille: true })))
  const fichier = `geotrends-question-${id.slice(-6)}`

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Suivre') }, { libelle: t('Questions'), href: '/questions' }, { libelle: q.texte }]} m={m} lancer />

      {/* ── La question : son texte et son verdict restent visibles quand on fait défiler ── */}
      <header className="question-tete">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0 flex-1">
            <p className="sous-titre">{rang >= 0 ? t('Question {i} sur {n}', { i: rang + 1, n: m.questions.length }) : t('Question archivée')}</p>
            <h1 className="question-texte">{q.texte}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <VerdictLu v={v} />
            {cUi.n > 0 && <span className="chiffre text-[0.8125rem]">{t('{k} sur {n}', { k: cUi.k, n: cUi.n })} · <span className="text-[var(--encre-douce)]">{t('interface')}</span></span>}
            <span className="flex items-center gap-1.5">
              {avant ? <Link href={`/questions/${avant.id}`} className="bouton bouton-creux bouton-petit" title={avant.texte} aria-label={t('Question précédente')}>←</Link> : <span className="bouton bouton-creux bouton-petit opacity-40" aria-hidden="true">←</span>}
              {apres ? <Link href={`/questions/${apres.id}`} className="bouton bouton-creux bouton-petit" title={apres.texte} aria-label={t('Question suivante')}>→</Link> : <span className="bouton bouton-creux bouton-petit opacity-40" aria-hidden="true">→</span>}
            </span>
          </div>
        </div>
      </header>

      <div className="!mt-3">
        <p className="phrase">
          {q.tous.length === 0 ? t('Cette question n’a jamais été relevée.')
            : cUi.n < SEUIL_VERDICT ? t('Trop tôt pour dire : il faut au moins {seuil} réponses d’interface, il y en a {n}.', { seuil: SEUIL_VERDICT, n: cUi.n })
            : <>{t('La marque est dans {k} [k:réponse|réponses] d’interface sur {n}', { k: cUi.k, n: cUi.n })}{iUi && cUi.n >= SEUIL_CHIFFRE ? t(', soit entre {bas} et {haut} avec la marge d’erreur.', { bas: pct(iUi.bas), haut: pct(iUi.haut) }) : '.'}</>}
          {cUi.n >= SEUIL_VERDICT && cUi.n < 20 && <span className="second"> {t('Avec moins de 20 réponses, la marge reste large : la mesure approfondie la resserre.')}</span>}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex flex-wrap gap-1">
            {q.theme ? <Link href={`/questions?theme=${encodeURIComponent(q.theme)}`} className="puce hover:border-[var(--encre)]" title={t('Voir les questions de ce thème')}>{q.theme}</Link> : <span className="puce discret">{t('sans thème')}</span>}
            {q.intention ? <span className="puce">{t(INTENTIONS[q.intention])}</span> : <span className="puce discret">{t('intention non classée')}</span>}
            <span className="puce">{q.sansMarque ? t('sans nom de marque') : t('avec le nom de la marque')}</span>
          </span>
          <span className="second">{langueEtPays(m.projet.langue, m.projet.pays)} · {t('suivie depuis le {date}', { date: jourLong(q.createdAt) })} · {pluriel(q.tous.length, 'relevé')}{approfondis > 0 ? ` (${t('dont {n} de mesure approfondie', { n: approfondis })})` : ''}</span>
          <form action={archiverQuestion} className="ml-auto">
            <input type="hidden" name="questionId" value={id} />
            {archivee ? (
              <button type="submit" name="archive" value="0" className="bouton bouton-creux bouton-petit">{t('Reprendre le suivi')}</button>
            ) : (
              <Confirmer libelle={t('Archiver')} titre={t('Archiver cette question ?')} confirmer={t('Archiver')} nom="archive" valeur="1">
                <p>{t('Elle ne sera plus relevée et ne comptera plus dans les chiffres. Son historique reste, et elle peut être reprise à tout moment.')}</p>
              </Confirmer>
            )}
          </form>
        </div>
        <details className="mt-3">
          <summary className="lien inline text-[0.8125rem]">{t('Modifier les étiquettes')}</summary>
          <form action={corrigerEtiquettes} className="mt-3 flex flex-wrap items-end gap-3">
            <input type="hidden" name="questionId" value={id} />
            <label className="libelle">
              {t('Thème')}
              <input name="theme" list="themes-du-projet" defaultValue={q.theme ?? ''} key={`theme:${q.theme ?? ''}`} maxLength={40} placeholder={t('en un à trois mots')} className="champ mt-1 !w-56 !py-1.5 !text-[0.875rem]" />
              <datalist id="themes-du-projet">{themes.map((x) => <option key={x} value={x} />)}</datalist>
            </label>
            <label className="libelle">
              {t('Intention')}
              <select name="intention" defaultValue={q.intention ?? ''} key={`intention:${q.intention ?? ''}`} className="champ mt-1 !w-44 !py-1.5 !text-[0.875rem]">
                <option value="">{t('Non classée')}</option>
                {(Object.keys(INTENTIONS) as Intention[]).map((i) => <option key={i} value={i}>{t(INTENTIONS[i]).charAt(0).toUpperCase() + t(INTENTIONS[i]).slice(1)}</option>)}
              </select>
            </label>
            <BoutonEnvoi className="bouton bouton-creux" enCours={t('Enregistrement…')}>{t('Enregistrer')}</BoutonEnvoi>
            <p className="second basis-full">{q.etiquetteMain ? t('Étiquettes posées à la main : le modèle n’y touche plus.') : q.theme ? t('Étiquettes posées par le petit modèle. Une correction à la main l’emporte.') : t('Pas encore d’étiquette. Vous pouvez les poser vous-même : c’est gratuit.')}</p>
          </form>
        </details>
        <div className="regle mt-4" aria-hidden="true" />
      </div>

      <Actualisation actif={enAttente > 0} />
      {sp.lance && (
        <Bandeau><p><strong className="font-semibold">{t('{n} [n:envoi parti|envois partis] pour la mesure approfondie.', { n: Number(sp.lance) || 0 })}</strong> {t('Les réponses reviennent en quelques minutes : cette page se met à jour toute seule, et le verdict se recalcule avec elles.')}</p></Bandeau>
      )}
      {sp.erreur && (
        <Bandeau erreur><p><strong className="font-semibold">{sp.erreur === 'plafond' ? t('Le plafond de dépense du mois est atteint.') : t('Cochez au moins une IA.')}</strong> {t('Aucun relevé n’est parti.')}</p></Bandeau>
      )}

      {q.tous.length === 0 ? (
        <Vide titre={t('Cette question n’a jamais été relevée.')} action={<Link href={`/projets/${m.projet.id}?onglet=releves`} className="bouton">{t('Préparer un relevé')}</Link>}>
          <p>{t('Lancez un relevé du projet : le prix de chaque IA s’affiche avant l’envoi.')}</p>
        </Vide>
      ) : q.releves.length === 0 ? (
        <Bandeau><p><strong className="font-semibold">{t('Aucun relevé de cette question sur la période choisie.')}</strong> {t('Élargissez la période dans la barre du haut : la question compte {n} [n:relevé|relevés] en tout.', { n: q.tous.length })}</p></Bandeau>
      ) : (
        <>
          {/* ── Présence par IA : l'état du jour, le verdict et la frise des relevés. Claude à part. ── */}
          <Feuille
            titre={t('Présence, IA par IA')}
            aide={t('Pour chaque IA : l’état du relevé affiché, le verdict sur la période, puis une frise avec un trait par relevé, surligné quand la marque est là. Un clic sur un trait ouvre la réponse de ce jour-là.')}
            droite={<LigneMethode methode="interface" n={cUi.n} unite="réponse" periode={periode} />}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ '--n': m.moteurs.length } as React.CSSProperties}>
              {m.moteurs.map((moteur) => {
                const rs = deMoteur(q.releves, moteur)
                const c = compter(rs)
                const r = duJour(moteur)
                const rangs = rs.map((x) => x.rang).filter((x): x is number => x !== null)
                const i = intervalle(c.k, c.n)
                return (
                  <div key={moteur} className={`tuile !border-b ${METHODE[moteur] === 'api' ? 'api' : ''}`}>
                    <p className="flex flex-wrap items-center gap-2"><span className="font-semibold">{nomCourt(moteur)}</span><Tampon methode={METHODE[moteur]} /></p>
                    <p className="mt-2 flex flex-wrap items-center gap-1.5">{r ? <EtatLu r={r} /> : <span className="pastille sans">{t('Pas relevée ce jour-là')}</span>}{c.n >= SEUIL_VERDICT && <VerdictLu v={verdict(c.k, c.n)} />}</p>
                    <p className="second mt-2" title={i && c.n >= SEUIL_CHIFFRE ? t('Entre {bas} et {haut} avec la marge d’erreur.', { bas: pct(i.bas), haut: pct(i.haut) }) : undefined}>
                      {c.n === 0 ? (c.vides ? t('{n} [n:relevé|relevés] sans réponse d’IA', { n: c.vides }) : t('aucune réponse reçue')) : t('{k} sur {n} [n:réponse|réponses]', { k: c.k, n: c.n })}
                      {rangs.length > 0 && ` · ${t('{rang} en moyenne', { rang: ordinal(Math.round(rangs.reduce((a, b) => a + b, 0) / rangs.length)) })}`}
                    </p>
                    <div className={`frise mt-2 ${rs.length > 14 ? 'longue' : ''}`} role="group" aria-label={t('Relevés de {ia}', { ia: nomCourt(moteur) })}>
                      {rs.map((x) => (
                        <Link key={x.id} href={lien(x.jour, moteur, x.id)} scroll={false} className={x.present ? 'la' : x.statut === 'recu' ? 'absente' : 'rien'} aria-current={rs.length > 1 && x.id === r?.id ? 'true' : undefined} aria-label={`${nomCourt(moteur)}, ${jourLong(x.createdAt)} : ${etatEcrit(x)}`} title={`${jourLong(x.createdAt)} : ${etatEcrit(x)}`} />
                      ))}
                    </div>
                    <p className="second discret mt-1">{rs.length <= 1 ? t('1 relevé : un échantillon') : t('{n} relevés, un trait chacun', { n: rs.length })}</p>
                  </div>
                )
              })}
            </div>
          </Feuille>

          {/* ── Choix du relevé ─────────────────────────────────────────────── */}
          <nav className="flex flex-wrap items-center gap-2" aria-label={t('Choisir le jour du relevé')}>
            <span className="etiquette">{t('Relevé du')}</span>
            {jours.map((j) => {
              const present = q.releves.some((r) => r.jour === j && r.present)
              return (
                <Link key={j} href={lien(j, sp.ia)} scroll={false} className="choix" aria-current={j === jour ? 'true' : undefined}>
                  <span className={`carreau ${present ? 'cite' : 'absent'}`} style={{ width: '0.75rem' }} aria-hidden="true" />
                  {jourLong(deCleJour(j))}
                </Link>
              )
            })}
            {jours.length === 1 && <span className="second">{t('Un seul jour de relevé pour l’instant.')}</span>}
          </nav>

          {/* ── Les réponses, en onglets ou côte à côte ─────────────────────── */}
          <div id="reponses" className="scroll-mt-44">
            <Colonnes
              depart={sp.ia}
              colonnes={m.moteurs.map((moteur) => {
                const r = duJour(moteur)
                return {
                  cle: moteur,
                  libelle: nomCourt(moteur),
                  api: METHODE[moteur] === 'api',
                  etat: !r ? 'rien' : r.present ? 'la' : r.statut === 'recu' ? 'absente' : 'rien',
                  contenu: <Colonne moteur={moteur} r={r} m={m} nommees={nommees} questionId={id} duJour={tousDuJour(moteur)} />,
                }
              })}
            />
          </div>

          {/* ── Sur cette question : qui gagne, les pages qui font gagner, nos pages, les actions ── */}
          <Feuille titre={t('Sur cette question')} aide={t('Toutes les réponses d’interface de la période pour cette question : les marques les plus nommées, les pages citées par deux IA ou plus, les pages de la marque lues ou citées, et les actions qui en découlent.')} droite={<LigneMethode methode="interface" n={marques.base} unite="réponse lue" />}>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4">
              <div className="border-b border-[var(--filet)] px-4 py-3 sm:border-r xl:border-b-0">
                <p className="sous-titre bloc-titre">{t('Qui gagne')}</p>
                {marques.lignes.filter((l) => l.reponses > 0 || l.aNous).length === 0 ? <p className="second mt-1">{t('Marques pas encore lues.')}</p> : (
                  <ol className="mt-1.5">
                    {marques.lignes.filter((l) => l.reponses > 0 || l.aNous).slice(0, 8).map((l, i) => (
                      <li key={l.cle} className={`flex items-center justify-between gap-2 py-1 ${i ? 'ligne-t' : ''}`}>
                        <NomMarque nom={l.nom} nous={l.aNous} href={l.aNous ? undefined : `/reponses?marque=${encodeURIComponent(l.nom)}&question=${id}`} />
                        <span className="nb shrink-0">{t('{k} sur {n}', { k: l.reponses, n: marques.base })}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div className="border-b border-[var(--filet)] px-4 py-3 xl:border-b-0 xl:border-r">
                <p className="sous-titre bloc-titre">{t('Les pages qui font gagner')}</p>
                {gagnantes.length === 0 ? <p className="second mt-1">{t('Aucune page citée par deux IA ou plus.')}</p> : (
                  <ul className="mt-1.5">
                    {gagnantes.map((p, i) => (
                      <li key={p.url} className={`py-1 ${i ? 'ligne-t' : ''}`}>
                        <Link href={`/sources?onglet=pages&fiche=${encodeURIComponent(p.url)}`} className="block truncate font-semibold hover:underline" title={p.titre ?? p.url}>{p.domaine}</Link>
                        <span className="second discret block truncate">{pluriel(p.moteurs.size, 'IA', 'IA')} · {p.titre ?? adresseCourte(p.url)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="border-b border-[var(--filet)] px-4 py-3 sm:border-b-0 sm:border-r">
                <p className="sous-titre bloc-titre">{t('Nos pages')}</p>
                {nosPages.size === 0 ? <p className="second mt-1">{t('Aucune page ni vidéo de la marque n’a été lue ou citée sur cette question.')}</p> : (
                  <ul className="mt-1.5">
                    {[...nosPages.values()].map((p, i) => (
                      <li key={p.url} className={`py-1 ${i ? 'ligne-t' : ''}`}>
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="block truncate hover:underline">{adresseCourte(p.url)}</a>
                        <span className="second">{[p.citee > 0 ? t('citée {n} fois', { n: p.citee }) : '', p.lue > 0 ? t('lue {n} fois sans être citée', { n: p.lue }) : ''].filter(Boolean).join(' · ')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="px-4 py-3">
                <p className="sous-titre bloc-titre">{t('Actions liées')} <span className="chiffre">({actions.length})</span></p>
                {actions.length === 0 ? <p className="second mt-1">{t('Aucune action née de cette question.')}</p> : (
                  <ul className="mt-1.5">
                    {actions.slice(0, 5).map((a, i) => (
                      <li key={a.cle} className={`py-1 ${i ? 'ligne-t' : ''}`}><Link href={`/actions?action=${encodeURIComponent(a.cle)}`} className="hover:underline">{a.titre}</Link></li>
                    ))}
                  </ul>
                )}
                <p className="mt-2"><Link href={`/actions?question=${id}`} className="lien-fleche">{t('Voir dans la liste de travail')} <span aria-hidden="true">→</span></Link></p>
              </div>
            </div>
          </Feuille>

          {/* ── Évolution de la question : l'interface, puis Claude sur son propre graphique ── */}
          <Feuille titre={t('Évolution de la question')} aide={t('Part des réponses où la marque est présente, par jour de relevé. Sur une seule question l’échantillon est petit : la marge d’erreur est large.')} droite={<LigneMethode methode="interface" n={cUi.n} unite="réponse" periode={periode} />}>
            <Courbe titre={t('Présence de la marque sur cette question')} points={courbeUi.points} series={courbeUi.series} bande={courbeUi.bande} csv={fichier} mesure={t('Présence')} vide={t('Aucune réponse d’interface sur cette période.')} />
          </Feuille>
          {moteursApi.length > 0 && compter(api).n > 0 && (
            <Feuille className="feuille-api" titre={t('Claude, mesuré par son API')} aide={t('Réponse du modèle seul, pas ce que voit un internaute. Sa courbe n’est jamais tracée avec celles de l’interface.')} droite={<LigneMethode methode="api" n={compter(api).n} unite="réponse" periode={periode} />}>
              <Courbe titre={t('Présence chez Claude (API)')} points={courbeApi.points} series={courbeApi.series} csv={`${fichier}-claude-api`} mesure={t('Présence')} />
            </Feuille>
          )}

          {/* ── Mesure approfondie (appel payant : prix affiché, confirmation au-dessus du seuil) ── */}
          {!archivee && (
            <Feuille
              id="approfondie"
              className="scroll-mt-44"
              titre={t('Mesure approfondie')}
              aide={t('Une réponse d’IA est un échantillon. Pour trancher sur cette question avant d’y passer du temps, posez-la plusieurs fois de suite : le verdict et la marge d’erreur se recalculent avec toutes les réponses de la période. Ces relevés comptent pour cette question seulement, pas dans les chiffres d’ensemble du projet.')}
              droite={<><Tampon methode="interface" /><span>{approfondis > 0 ? t('{n} [n:relevé déjà fait|relevés déjà faits] ainsi', { n: approfondis }) : t('jamais lancée')}</span></>}
            >
              <MesureApprofondie
                questionId={id}
                moteurs={MOTEURS.filter((x) => METHODE[x] === 'interface').map((x) => ({ cle: x, nom: nomCourt(x), recus: deMoteur(q.releves, x).filter((r) => r.statut === 'recu').length }))}
                prix={PRIX_INTERFACE_USD}
                depense={depense}
                plafond={plafond}
                seuil={seuil}
                prixLecture={PRIX_ANALYSE_USD}
              />
            </Feuille>
          )}

          {/* ── Historique ──────────────────────────────────────────────────── */}
          <Feuille titre={t('Historique des relevés')} droite={t('{n} [n:jour|jours] de relevé', { n: jours.length })}>
            <div className="defile">
              <table className="tableau dense">
                <thead>
                  <tr>
                    <th scope="col" className="fixe">{t('Jour')}</th>
                    {m.moteurs.map((x) => <th key={x} scope="col" className={METHODE[x] === 'api' ? 'api' : ''}><TeteMoteur moteur={x} /></th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...jours].reverse().map((j) => (
                    <tr key={j} className={j === jour ? 'nous' : ''}>
                      <th scope="row" className="fixe whitespace-nowrap"><Link href={lien(j)} scroll={false} className="ligne-lien chiffre">{jourLong(deCleJour(j))}</Link>{j === jour && <span className="second discret"> · {t('affiché')}</span>}</th>
                      {m.moteurs.map((x) => {
                        const rs = deMoteur(q.releves, x).filter((r) => r.jour === j)
                        return (
                          <td key={x} className={METHODE[x] === 'api' ? 'api' : ''}>
                            {rs.length === 0 ? <Carreau etat={null} /> : (
                              <Link href={lien(j, x)} scroll={false} className="inline-flex flex-wrap items-center gap-1.5" aria-label={`${nomCourt(x)}, ${jourCourt(deCleJour(j))} : ${t('ouvrir la réponse')}`}>
                                <EtatLu r={rs.at(-1)!} />
                                {rs.length > 1 && <span className="second chiffre">{t('{k} sur {n}', { k: rs.filter((r) => r.present).length, n: rs.length })}</span>}
                              </Link>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[var(--filet)] px-4 py-3"><LegendeEtats /></div>
          </Feuille>

          <CommentLire>
            <ul>
              <li>{t('Verdict de la question : il se calcule sur toutes les réponses d’interface de la période, mesures approfondies comprises. Claude, mesuré par son API, n’y entre pas.')}</li>
              <li>{t('Dans le texte d’une réponse, la marque est surlignée, un concurrent suivi est souligné, et chaque source citée porte son numéro. Le texte est celui que l’IA a écrit : il n’est jamais traduit ni corrigé.')}</li>
              <li>{t('« Avec ou sans nom de marque » se déduit du texte de la question.')}</li>
            </ul>
          </CommentLire>
        </>
      )}
    </div>
  )
}
