import Link from 'next/link'
import { Tendance } from '@/components/graphiques/Graphiques'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { adresse, Bandeau, Choix, Coches, CommentLire, EnTete, EtatLu, Feuille, LegendeEtats, LigneMethode, NomMarque, TeteMoteur, VerdictLu, Vide } from '@/components/outil/Blocs'
import { BoutonEnvoi } from '@/components/outil/BoutonEnvoi'
import { IcoFiltres } from '@/components/outil/Icones'
import { TableauTriable, type Ligne } from '@/components/outil/TableauTriable'
import { classerThemes, ETATS_THEME, premierNomme, type EtatTheme } from '@/lib/classements'
import { exigerMesures, titreOnglet } from '@/lib/contexte'
import { budgetDisponible, lireSeuilConfirmation } from '@/lib/couts'
import { tendance } from '@/lib/courbes'
import { PRIX_INTERFACE_USD } from '@/lib/estimation'
import { etiquettesAuto, PRIX_ETIQUETTE_USD } from '@/lib/etiquettes'
import { libellePeriode } from '@/lib/filtres'
import { MOTEURS } from '@/lib/fournisseurs/types'
import { traducteur } from '@/lib/i18n/serveur'
import { jourCourt, nomCourt, pluriel, usdFin } from '@/lib/libelles'
import { compter, deMethode, deMoteur, INTENTIONS, METHODE, verdict, VERDICTS, type Intention, type QuestionLue, type Verdict } from '@/lib/mesures'
import { recupererReponses } from '../releves/actions'
import { Actualisation } from '../releves/Actualisation'
import { BoutonCollecte } from '../releves/BoutonCollecte'
import { agirSurSelection, etiqueterLesQuestions, reglerEtiquettesAuto } from './actions'
import { Selection } from './Selection'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Questions')

type Params = { q?: string; verdict?: string; archivees?: string; tri?: string; theme?: string; intention?: string; marque?: string; grouper?: string; fait?: string; n?: string; erreur?: string }

const SANS_THEME = 'sans-etiquette'
const majuscule = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

export default async function Questions({ searchParams }: { searchParams: Promise<Params> }) {
  const t = await traducteur()
  const [m, sp] = await Promise.all([exigerMesures(), searchParams])
  const fiche = `/projets/${m.projet.id}`
  const interfaces = m.moteurs.filter((x) => METHODE[x] === 'interface')
  const periode = libellePeriode(m.filtres.periode)
  const lien = (change: Record<string, string | undefined>) => adresse('/questions', { ...sp, fait: undefined, n: undefined, erreur: undefined }, change)
  const [auto, seuil, budget] = await Promise.all([etiquettesAuto(m.projet.id), lireSeuilConfirmation(), budgetDisponible()])
  // Les IA d'interface qu'un relevé de la sélection interroge : toutes, cochées ou non dans la barre du haut.
  const aLancer = MOTEURS.filter((x) => METHODE[x] === 'interface')

  const lire = (q: QuestionLue) => {
    const ui = deMethode(q.releves, 'interface')
    const c = compter(ui)
    const premiers = new Map<string, number>()
    for (const r of ui) {
      const p = premierNomme(r)
      if (p) premiers.set(p, (premiers.get(p) ?? 0) + 1)
    }
    const premier = [...premiers.entries()].sort((a, b) => b[1] - a[1])[0]
    // Réponses reçues dont les marques sont lues : sans elles, « aucune marque » voudrait dire « pas encore lu ».
    const marquesLues = ui.filter((r) => r.statut === 'recu' && r.marquesLues).length
    const lus = interfaces.filter((x) => deMoteur(ui, x).some((r) => r.statut === 'recu'))
    return {
      q, c,
      v: verdict(c.k, c.n),
      premier: premier ? { nom: premier[0], fois: premier[1] } : null,
      marquesLues,
      couverture: { la: lus.filter((x) => deMoteur(ui, x).some((r) => r.present)).length, sur: lus.length },
      evolution: tendance(ui),
      dernier: q.releves.at(-1)?.createdAt ?? null,
    }
  }
  const toutes = m.questions.map(lire)
  const recherche = (sp.q ?? '').trim().toLowerCase()
  const themes = [...new Set(m.questions.map((q) => q.theme).filter((x): x is string => !!x))].sort()
  const sansEtiquette = m.questions.filter((q) => !q.etiquetteMain && (!q.theme || !q.intention)).length
  const carte = classerThemes(m)
  const filtrees = toutes
    .filter((x) => !recherche || x.q.texte.toLowerCase().includes(recherche))
    .filter((x) => !sp.verdict || x.v === sp.verdict)
    .filter((x) => !sp.theme || (sp.theme === SANS_THEME ? !x.q.theme : x.q.theme === sp.theme))
    .filter((x) => !sp.intention || x.q.intention === sp.intention)
    .filter((x) => !sp.marque || (sp.marque === 'sans') === x.q.sansMarque)
  const grouper = sp.grouper === 'theme' || sp.grouper === 'intention' ? sp.grouper : 'aucun'
  const cleGroupe = (x: (typeof toutes)[number]) => (grouper === 'theme' ? (x.q.theme ?? '') : grouper === 'intention' ? (x.q.intention ?? '') : '')
  const groupes = grouper === 'aucun' ? [{ cle: '', titre: '', lignes: filtrees }] : [...new Set(filtrees.map(cleGroupe))]
    .sort((a, b) => (a === '' ? 1 : 0) - (b === '' ? 1 : 0) || a.localeCompare(b))
    .map((cle) => ({ cle, titre: cle === '' ? (grouper === 'theme' ? t('Sans thème') : t('Sans intention')) : grouper === 'theme' ? majuscule(cle) : majuscule(t(INTENTIONS[cle as Intention])), lignes: filtrees.filter((x) => cleGroupe(x) === cle) }))
  const filtreActif = !!(sp.q || sp.verdict || sp.theme || sp.intention || sp.marque)
  const ordre: Record<Verdict, number> = { solide: 0, occasionnelle: 1, absente: 2, tot: 3, jamais: 4 }
  if (sp.tri === 'verdict') filtrees.sort((a, b) => ordre[a.v] - ordre[b.v])
  if (sp.tri === 'releves') filtrees.sort((a, b) => b.q.releves.length - a.q.releves.length)
  if (sp.tri === 'date') filtrees.sort((a, b) => (b.dernier?.getTime() ?? 0) - (a.dernier?.getTime() ?? 0))
  const jamais = toutes.filter((x) => x.q.tous.length === 0).length
  const archivees = sp.archivees === '1' ? m.archivees.map(lire) : []

  const nb = (v: Verdict) => toutes.filter((x) => x.v === v).length
  const cUi = compter(deMethode(m.releves, 'interface'))

  // Une ligne du tableau : la question et ses étiquettes, l'état chez chaque IA, le verdict, la tendance.
  const ligne = (x: ReturnType<typeof lire>, archivee = false): Ligne => ({
    cle: x.q.id,
    classe: archivee ? 'opacity-70' : '',
    recherche: `${x.q.texte} ${x.q.theme ?? ''} ${x.premier?.nom ?? ''}`,
    tri: [x.q.texte, ...m.moteurs.map((moteur) => { const ok = deMoteur(x.q.releves, moteur).filter((r) => r.statut === 'recu'); return ok.length ? ok.filter((r) => r.present).length / ok.length : null }), ordre[x.v], x.premier?.nom ?? null, null, x.dernier?.getTime() ?? null],
    cellules: [
      <span key="q" className="flex min-w-[15rem] items-start gap-2.5">
        {!archivee && <input type="checkbox" name="q" value={x.q.id} className="mt-1" aria-label={t('Cocher la question « {texte} »', { texte: x.q.texte })} />}
        <span className="min-w-0">
          <Link href={`/questions/${x.q.id}`} className="ligne-lien line-clamp-3 font-semibold">{x.q.texte}</Link>
          <span className="mt-1 flex flex-wrap gap-1 font-normal">
            {x.q.theme ? <Link href={lien({ theme: x.q.theme })} scroll={false} className="puce hover:border-[var(--encre)]" title={t('Filtrer sur ce thème')}>{x.q.theme}</Link> : <span className="puce discret">{t('sans thème')}</span>}
            {x.q.intention && <span className="puce">{t(INTENTIONS[x.q.intention])}</span>}
            {!x.q.sansMarque && <span className="puce" title={t('La question contient le nom de la marque')}>{t('avec le nom de la marque')}</span>}
            {archivee && <span className="puce">{t('archivée')}</span>}
          </span>
        </span>
      </span>,
      ...m.moteurs.map((moteur) => {
        const rs = deMoteur(x.q.releves, moteur)
        const dernier = rs.at(-1)
        const ok = rs.filter((r) => r.statut === 'recu')
        return !dernier ? <span key={moteur} className="second discret">{x.q.tous.some((r) => r.moteur === moteur) ? t('hors période') : t('pas encore relevée')}</span> : (
          <Link key={moteur} href={`/questions/${x.q.id}?ia=${moteur}#reponses`} aria-label={t('{ia} : ouvrir la réponse', { ia: nomCourt(moteur) })} className="inline-block whitespace-nowrap">
            <EtatLu r={dernier} />
            {ok.length > 1 && (
              <span className="mt-1 flex items-center gap-2">
                <span className="chiffre text-[0.75rem]">{t('{k} sur {n}', { k: ok.filter((r) => r.present).length, n: ok.length })}</span>
                <Coches releves={rs} />
              </span>
            )}
          </Link>
        )
      }),
      <span key="v" className="whitespace-nowrap"><VerdictLu v={x.v} />{x.c.n > 0 && <span className="second discret chiffre mt-1 block">{t('{k} sur {n}', { k: x.c.k, n: x.c.n })}{x.couverture.sur ? ` · ${t('{k}/{n} IA', { k: x.couverture.la, n: x.couverture.sur })}` : ''}</span>}</span>,
      x.premier ? <span key="p"><NomMarque nom={x.premier.nom} href={`/reponses?marque=${encodeURIComponent(x.premier.nom)}&question=${x.q.id}`} /><span className="second discret block pl-8">{t('{n} fois en tête', { n: x.premier.fois })}</span></span> : <span key="p" className="second discret">{x.marquesLues === 0 ? t('marques pas encore lues') : t('aucune marque nommée')}</span>,
      <Tendance key="t" valeurs={x.evolution.valeurs} libelles={x.evolution.libelles} titre={t('Présence dans le temps')} largeur={96} hauteur={26} court />,
      x.dernier ? <span key="d" className="whitespace-nowrap">{jourCourt(x.dernier)}<span className="second discret block">{pluriel(x.q.releves.length, 'relevé')}</span></span> : '',
    ],
  })
  const colonnes = [
    { libelle: t('Question') },
    ...m.moteurs.map((x) => ({ libelle: <TeteMoteur key={x} moteur={x} />, texte: `${nomCourt(x)}${METHODE[x] === 'api' ? ' (API)' : ''}`, api: METHODE[x] === 'api' })),
    { libelle: t('Verdict'), aide: t('« Solide » si la marque est dans 6 réponses d’interface sur 10 ou plus, « occasionnelle » en dessous, « absente » à zéro. Avec moins de 3 réponses, il est trop tôt pour dire. Dessous : le nombre d’IA d’interface où la marque apparaît, sur celles qui ont répondu.') },
    { libelle: t('Premier nommé'), aide: t('La marque le plus souvent nommée en premier dans les réponses à cette question.') },
    { libelle: t('Tendance'), triable: false },
    { libelle: t('Dernier relevé'), num: true },
  ]
  const totaux = (
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem]">
      <span className="etiquette">{t('Présente dans')}</span>
      {m.moteurs.map((moteur) => {
        const c = compter(deMoteur(m.releves, moteur))
        return (
          <span key={moteur} className={METHODE[moteur] === 'api' ? 'trait-double pl-3' : ''}>
            {nomCourt(moteur)}{METHODE[moteur] === 'api' ? ' (API)' : ''} <Link href={`/reponses?ia=${moteur}&presence=oui`} className="ligne-lien chiffre font-semibold hover:underline">{t('{k} sur {n}', { k: c.k, n: c.n })}</Link>
            {c.vides > 0 && <span className="second discret"> · {t('{n} sans aperçu', { n: c.vides })}</span>}
          </span>
        )
      })}
    </span>
  )

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Suivre') }, { libelle: t('Questions') }]} m={m} exportCsv="/api/export/questions" lancer />
      <EnTete
        titre={t('Questions')}
        verdict={m.questions.length === 0 ? t('Ce projet n’a pas encore de question.') : cUi.n === 0 ? t('{n} [n:question suivie|questions suivies], aucune réponse d’interface sur cette période.', { n: m.questions.length }) : <>
          {t('Sur {n} [n:question|questions], la marque est solide sur {solide}, occasionnelle sur {occasionnelle}, absente sur {absente}.', { n: m.questions.length, solide: nb('solide'), occasionnelle: nb('occasionnelle'), absente: nb('absente') })}{' '}
          <span className="second">{t('Interface, {n} [n:réponse|réponses], {periode}.', { n: cUi.n, periode })}{m.archivees.length > 0 ? ` ${t('{n} [n:question archivée|questions archivées].', { n: m.archivees.length })}` : ''}</span>
        </>}
        actions={<>
          <Link href="/pages#suivre" className="bouton bouton-creux">{t('Partir d’une page')}</Link>
          <Link href={`${fiche}?onglet=questions`} className="bouton bouton-creux">{t('Ajouter des questions')}</Link>
        </>}
      />

      <Actualisation actif={m.enAttente > 0} />
      {m.enAttente > 0 && (
        <form action={recupererReponses}>
          <Bandeau action={<BoutonCollecte />}>
            <p><strong className="font-semibold">{t('{n} [n:réponse|réponses] en attente.', { n: m.enAttente })}</strong> {t('Une réponse revient en quelques minutes, 45 au plus. Cette page se met à jour toute seule. La lecture est gratuite.')}</p>
          </Bandeau>
        </form>
      )}
      {jamais > 0 && m.questions.length > 0 && (
        <Bandeau action={<Link href={`${fiche}?onglet=releves`} className="bouton bouton-creux">{t('Préparer un relevé')}</Link>}>
          <p><strong className="font-semibold">{t('{n} [n:question n’a jamais été relevée|questions n’ont jamais été relevées].', { n: jamais })}</strong> {t('Le prix s’affiche avant l’envoi.')}</p>
        </Bandeau>
      )}

      {sp.fait && (
        <Bandeau>
          <p>
            <strong className="font-semibold">
              {sp.fait === 'archive' ? t('{n} [n:question archivée|questions archivées].', { n: Number(sp.n) || 0 }) : sp.fait === 'theme' ? t('Thème changé pour {n} [n:question|questions].', { n: Number(sp.n) || 0 }) : t('{n} [n:envoi parti|envois partis].', { n: Number(sp.n) || 0 })}
            </strong>{' '}
            {sp.fait === 'lance' ? t('Les réponses reviennent en quelques minutes : cette page se met à jour toute seule.') : sp.fait === 'archive' ? t('Une question déjà relevée garde son historique et se reprend depuis les questions archivées. Une question jamais relevée est simplement retirée.') : t('Une étiquette posée à la main n’est plus changée par le modèle.')}
          </p>
        </Bandeau>
      )}
      {sp.erreur === 'plafond' && (
        <Bandeau erreur><p><strong className="font-semibold">{t('Le plafond de dépense du mois est atteint.')}</strong> {t('Aucun relevé n’est parti. Le plafond se change dans Administration, Coûts.')}</p></Bandeau>
      )}
      {sansEtiquette > 0 ? (
        <form action={etiqueterLesQuestions}>
          <Bandeau action={<BoutonEnvoi enCours={t('Étiquetage en cours…')}>{t('Étiqueter les questions (environ {prix})', { prix: usdFin(Math.max(sansEtiquette * PRIX_ETIQUETTE_USD, 0.0003)) })}</BoutonEnvoi>}>
            <p>
              <strong className="font-semibold">{t('{n} [n:question n’a|questions n’ont] pas encore d’étiquette.', { n: sansEtiquette })}</strong>{' '}
              {t('L’étiquetage donne à chacune un thème et une intention (s’informer, comparer, acheter). Il sert à grouper les questions et à dresser la carte des thèmes. Une étiquette se corrige ensuite à la main, sur la page de la question.')}
            </p>
            <p className="second mt-1">{t('Appel payant, inscrit au journal des coûts. Rien ne part sans votre clic.')} {auto ? t('Les questions ajoutées ensuite sont étiquetées toutes seules.') : t('Après ce premier clic, les questions ajoutées seront étiquetées toutes seules ; cela se coupe ici même.')}</p>
          </Bandeau>
        </form>
      ) : themes.length > 0 ? (
        <form action={reglerEtiquettesAuto} className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="second">
            <strong className="font-semibold text-[var(--encre)]">{t('Toutes les questions sont étiquetées.')}</strong>{' '}
            {auto ? t('Une question ajoutée est étiquetée toute seule (moins d’un dixième de centime).') : t('L’étiquetage automatique des questions ajoutées est coupé.')}
          </p>
          <input type="hidden" name="auto" value={auto ? '0' : '1'} />
          <BoutonEnvoi className="bouton bouton-creux bouton-petit" enCours={t('Enregistrement…')}>{auto ? t('Couper l’étiquetage automatique') : t('Activer l’étiquetage automatique')}</BoutonEnvoi>
        </form>
      ) : null}

      {m.questions.length === 0 ? (
        <Vide
          titre={t('Écrivez vos premières questions')}
          action={<><Link href={`${fiche}?onglet=questions`} className="bouton">{t('Écrire mes questions')}</Link><Link href="/google#idees" className="bouton bouton-creux">{t('Voir des idées de questions')}</Link></>}
        >
          <p>{t('Une question est ce qu’un client demanderait à une IA, avec ses mots. Écrivez-en dix pour commencer.')}</p>
        </Vide>
      ) : (
        <Feuille
          id="tableau"
          className="scroll-mt-40"
          titre={t('Par question et par IA')}
          aide={t('Le dernier état chez chaque IA, puis le verdict sur toute la période. Un clic sur un état ouvre la réponse. Claude, mesuré par son API, est dans sa propre colonne.')}
          droite={<><span>{filtrees.length === toutes.length ? pluriel(toutes.length, 'question') : t('{k} sur {n} [n:question|questions]', { k: filtrees.length, n: toutes.length })}</span><span>{periode}</span></>}
        >
          <details className="filtres-tableau border-b border-[var(--filet)]" open={filtreActif || grouper !== 'aucun'}>
            <summary className="flex items-center gap-2 px-4 py-2.5 text-[0.8125rem] font-semibold"><IcoFiltres taille={14} />{t('Filtrer et grouper')}{filtreActif && <span className="pastille cite">{t('filtre actif')}</span>}</summary>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 px-4 pb-3">
            <Choix
              libelle={t('Verdict')}
              actif={sp.verdict ?? 'tous'}
              options={[{ cle: 'tous', libelle: t('Tous'), href: lien({ verdict: undefined }) }, ...(['solide', 'occasionnelle', 'absente', 'tot'] as Verdict[]).map((v) => ({ cle: v, libelle: `${majuscule(t(VERDICTS[v].libelle))} (${nb(v)})`, href: lien({ verdict: v }) }))]}
            />
            {themes.length > 0 && (
              <>
                <Choix
                  libelle={t('Thème')}
                  actif={sp.theme ?? 'tous'}
                  options={[{ cle: 'tous', libelle: t('Tous'), href: lien({ theme: undefined }) }, ...themes.map((x) => ({ cle: x, libelle: `${majuscule(x)} (${m.questions.filter((q) => q.theme === x).length})`, href: lien({ theme: x }) })), ...(m.questions.some((q) => !q.theme) ? [{ cle: SANS_THEME, libelle: t('Sans thème'), href: lien({ theme: SANS_THEME }) }] : [])]}
                />
                <Choix
                  libelle={t('Intention')}
                  actif={sp.intention ?? 'toutes'}
                  options={[{ cle: 'toutes', libelle: t('Toutes'), href: lien({ intention: undefined }) }, ...(Object.keys(INTENTIONS) as Intention[]).map((i) => ({ cle: i, libelle: `${majuscule(t(INTENTIONS[i]))} (${m.questions.filter((q) => q.intention === i).length})`, href: lien({ intention: i }) }))]}
                />
                <Choix
                  libelle={t('Grouper par')}
                  actif={grouper}
                  options={[{ cle: 'aucun', libelle: t('Aucun'), href: lien({ grouper: undefined }) }, { cle: 'theme', libelle: t('Thème'), href: lien({ grouper: 'theme' }) }, { cle: 'intention', libelle: t('Intention'), href: lien({ grouper: 'intention' }) }]}
                />
              </>
            )}
            <Choix
              libelle={t('Nom de la marque')}
              actif={sp.marque ?? 'toutes'}
              options={[{ cle: 'toutes', libelle: t('Toutes'), href: lien({ marque: undefined }) }, { cle: 'sans', libelle: `${t('Sans')} (${m.questions.filter((q) => q.sansMarque).length})`, href: lien({ marque: 'sans' }) }, { cle: 'avec', libelle: `${t('Avec')} (${m.questions.filter((q) => !q.sansMarque).length})`, href: lien({ marque: 'avec' }) }]}
            />
            {filtreActif && <Link href="/questions" className="lien text-[0.8125rem]">{t('Tout afficher')}</Link>}
          </div>
          </details>
          <form action={agirSurSelection}>
            <Selection prix={PRIX_INTERFACE_USD} moteurs={aLancer.map(nomCourt)} seuil={seuil} themes={themes} plafondAtteint={!budget} />
            {filtrees.length === 0 && archivees.length === 0 ? (
              <p className="second px-4 py-4">{t('Aucune question ne correspond.')} <Link href="/questions" className="lien">{t('Tout afficher')}</Link></p>
            ) : (
              groupes.filter((g) => g.lignes.length > 0).map((g, i) => (
                <div key={g.cle || 'tout'}>
                  {g.titre && <p className="border-y border-[var(--encre)] bg-[var(--papier)] px-4 py-2"><span className="font-bold">{g.titre}</span> <span className="chiffre text-[var(--encre-douce)]">({g.lignes.length})</span></p>}
                  <TableauTriable
                    libelle={g.titre ? `${t('Par question et par IA')} : ${g.titre}` : t('Par question et par IA')}
                    recherche={i === 0 && toutes.length > 5 ? t('Chercher une question, un thème, une marque') : undefined}
                    colonnes={colonnes}
                    lignes={g.lignes.map((x) => ligne(x))}
                    dense
                    triInitial={sp.tri === 'verdict' ? { colonne: m.moteurs.length + 1, sens: 'asc' } : sp.tri === 'date' ? { colonne: m.moteurs.length + 4, sens: 'desc' } : undefined}
                  />
                </div>
              ))
            )}
            {archivees.length > 0 && (
              <div>
                <p className="border-y border-[var(--encre)] bg-[var(--papier)] px-4 py-2"><span className="font-bold">{t('Archivées')}</span> <span className="chiffre text-[var(--encre-douce)]">({archivees.length})</span></p>
                <TableauTriable dense libelle={t('Questions archivées')} colonnes={colonnes} lignes={archivees.map((x) => ligne(x, true))} />
              </div>
            )}
          </form>
          <div className="space-y-2.5 border-t border-[var(--filet)] px-4 py-3">
            {totaux}
            <LigneMethode methode="interface" n={cUi.n} unite="réponse" periode={periode} suite={t('Claude (API) compté à part')} />
            <LegendeEtats />
            {m.archivees.length > 0 && (
              <p><Link href={lien({ archivees: sp.archivees === '1' ? undefined : '1' })} className="lien text-[0.8125rem]">{sp.archivees === '1' ? t('Masquer les questions archivées') : t('Afficher les {n} [n:question archivée|questions archivées]', { n: m.archivees.length })}</Link></p>
            )}
          </div>
        </Feuille>
      )}

      {/* ── Carte des thèmes ──────────────────────────────────────────────── */}
      {themes.length > 0 && (
        <Feuille
          id="carte"
          className="scroll-mt-40"
          titre={t('Carte des thèmes')}
          aide={t('Où mettre l’effort : pour chaque thème, la présence de la marque face à la marque la plus nommée. Un clic sur un thème filtre le tableau des questions.')}
          droite={<LigneMethode methode="interface" n={cUi.n} unite="réponse" periode={periode} />}
        >
          <TableauTriable
            libelle={t('Carte des thèmes')}
            colonnes={[
              { libelle: t('Thème') },
              { libelle: t('Questions'), num: true },
              { libelle: m.marque.nom, aide: t('Réponses d’interface où la marque apparaît, sur les réponses reçues du thème.') },
              { libelle: t('Marque la plus nommée'), aide: t('Comptée sur les réponses dont les marques sont lues.') },
              { libelle: t('État'), aide: <ul className="space-y-1">{(Object.keys(ETATS_THEME) as EtatTheme[]).map((k) => <li key={k}><strong>{t(ETATS_THEME[k].libelle)}</strong> : {t(ETATS_THEME[k].regle)}.</li>)}</ul> },
            ]}
            lignes={carte.map((x) => {
              const e = ETATS_THEME[x.etat]
              return {
                cle: x.theme ?? SANS_THEME,
                tri: [x.theme ?? 'zzz', x.questions.length, x.c.n ? x.c.k / x.c.n : null, x.meilleure && x.base ? x.meilleure.reponses / x.base : null, Object.keys(ETATS_THEME).indexOf(x.etat)],
                cellules: [
                  <Link key="t" href={`${lien({ theme: x.theme ?? SANS_THEME })}#tableau`} className="ligne-lien font-semibold">{x.theme ? majuscule(x.theme) : t('Sans thème')}</Link>,
                  x.questions.length,
                  x.c.n === 0 ? <span key="n" className="second discret">{t('aucune réponse')}</span> : (
                    <span key="n" className="flex items-center gap-2 whitespace-nowrap">
                      <span className={`chiffre ${x.c.k > 0 ? 'nous-plein font-semibold' : ''}`}>{t('{k} sur {n}', { k: x.c.k, n: x.c.n })}</span>
                      <span className="jauge jaune w-20"><span style={{ width: `${(x.c.k / x.c.n) * 100}%` }} /></span>
                    </span>
                  ),
                  x.meilleure ? (
                    <span key="m" className="flex flex-wrap items-center gap-2">
                      <NomMarque nom={x.meilleure.nom} href={`/reponses?marque=${encodeURIComponent(x.meilleure.nom)}`} />
                      <span className="chiffre text-[var(--encre-douce)]">{t('{k} sur {n}', { k: x.meilleure.reponses, n: x.base })}</span>
                      <span className="jauge w-20"><span style={{ width: `${x.base ? (x.meilleure.reponses / x.base) * 100 : 0}%` }} /></span>
                      {x.meilleure.suivie && <span className="puce">{t('suivie')}</span>}
                    </span>
                  ) : <span key="m" className="second discret">{x.base === 0 ? t('marques pas encore lues') : t('aucune marque nommée')}</span>,
                  <span key="e" className={`pastille ${e.classe}`}><span className="signe" aria-hidden="true">{e.signe}</span>{t(e.libelle)}</span>,
                ],
              }
            })}
          />
        </Feuille>
      )}

      <CommentLire>
        <ul>
          <li>{t('Verdict d’une question : « solide » si la marque est dans 6 réponses d’interface sur 10 ou plus, « occasionnelle » en dessous, « absente » à zéro. Avec moins de 3 réponses, il est trop tôt pour dire.')}</li>
          <li>{t('Une question sans Aperçu IA n’est pas comptée comme une absence.')}</li>
          <li>{t('Le verdict compte tous les relevés de la période, mesures approfondies comprises ; la ligne « Présente dans », elle, ne les compte pas.')}</li>
          <li>{t('Carte des thèmes : la part de la marque se compte sur toutes les réponses reçues, celle des autres marques sur les réponses dont les marques sont lues. Avec un ou deux relevés par question, l’état est une photographie, pas une tendance.')}</li>
        </ul>
      </CommentLire>
    </div>
  )
}
