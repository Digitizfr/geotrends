import Link from 'next/link'
import { Compteur } from '@/components/graphiques/Graphiques'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { adresse, Bandeau, Choix, Classement, CommentLire, Decoupe, EcartLu, EnTete, Feuille, LigneMethode, NomMarque, Onglets, Tuile, Vide } from '@/components/outil/Blocs'
import { Initiale } from '@/components/outil/Initiale'
import { PanneauLateral } from '@/components/outil/Panneau'
import { TableauTriable } from '@/components/outil/TableauTriable'
import { BoutonEnvoi } from '@/components/outil/BoutonEnvoi'
import { lienReponse } from '@/components/outil/ListeReponses'
import { APPARTENANCES, classerMarques, classerMouvements, classerNosPages, classerSources, dureeLisible, estDiscussion, momentDe, teinteDePart, typeEcrit, type Appartenance, type Mouvement } from '@/lib/classements'
import { exigerMesures, titreOnglet } from '@/lib/contexte'
import { libellePeriode } from '@/lib/filtres'
import { tr } from '@/lib/i18n/courante'
import { traducteur } from '@/lib/i18n/serveur'
import { adresseCourte, deCleJour, jourCourt, jourLong, nombre, nomCourt, pct, pluriel, usdFin } from '@/lib/libelles'
import { marqueDe } from '@/lib/projets'
import { classementAuto, estTypeSite, groupeType, libelleType, PRIX_CLASSEMENT_USD, sitesAClasser, TYPES_SITE, type TypeLu, type TypeSite } from '@/lib/sites'
import { lireTravail } from '@/lib/travail'
import { ajouterPageAuTravail } from '../_actions/suivi'
import { classerLesSites, corrigerSite, reglerClassementAuto } from './actions'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Sources')

type Params = { onglet?: string; qui?: string; type?: string; q?: string; manque?: string; fiche?: string; bouge?: string }

const QUI = APPARTENANCES

/** L'écart d'une source entre les deux derniers relevés : coloré seulement hors marge. */
function Evolution({ x }: { x: Mouvement | undefined }) {
  if (!x) return <span className="discret">{tr('n.c.')}</span>
  const d = x.apres - x.avant
  const texte = x.avant === 0 ? tr('nouveau, {n}', { n: x.apres }) : x.apres === 0 ? tr('perdu, −{n}', { n: x.avant }) : d === 0 ? '=' : `${d > 0 ? '+' : '−'}${Math.abs(d)}`
  const reel = x.e?.sens === 'hausse' || x.e?.sens === 'baisse'
  return <span className={reel ? (d > 0 ? 'font-semibold text-[var(--vert)]' : 'font-semibold text-[var(--absent-texte)]') : 'text-[var(--encre-pale)]'} title={reel ? tr('{avant} puis {apres} réponses comparables : écart au-dessus de la marge d’erreur', { avant: x.avant, apres: x.apres }) : tr('{avant} puis {apres} réponses comparables : écart dans la marge d’erreur', { avant: x.avant, apres: x.apres })}>{d > 0 && reel ? '▲ ' : d < 0 && reel ? '▼ ' : ''}{texte}</span>
}

export default async function Sources({ searchParams }: { searchParams: Promise<Params> }) {
  const t = await traducteur()
  const [m, sp] = await Promise.all([exigerMesures(), searchParams])
  const periode = libellePeriode(m.filtres.periode)
  const s = classerSources(m)
  const onglet = ['pages', 'nos-pages', 'discussions'].includes(sp.onglet ?? '') ? sp.onglet! : 'domaines'
  const lien = (change: Record<string, string | undefined>) => adresse('/sources', sp, change)
  const recherche = (sp.q ?? '').trim().toLowerCase()
  const filtreQui = sp.qui ? s.repartition.find((r) => r.cle === sp.qui) : undefined
  const filtreType: TypeLu | undefined = sp.type === 'a_classer' || estTypeSite(sp.type) ? (sp.type as TypeLu) : undefined
  const garde = (qui: Appartenance, type: TypeLu) => (!filtreQui || (filtreQui.qui === qui && (qui !== 'tiers' || filtreQui.cle === `tiers:${type}`))) && (!filtreType || filtreType === type)
  // Types présents parmi les sites cités, pour le filtre.
  const cites = s.domaines.filter((d) => d.reponses.size + d.api.size > 0)
  const typesPresents = [...new Set(cites.map((d) => d.type))].sort((a, b) => cites.filter((d) => d.type === b).length - cites.filter((d) => d.type === a).length)

  const domaines = s.domaines.filter((d) => d.reponses.size + d.api.size > 0).filter((d) => garde(d.qui, d.type)).filter((d) => !recherche || d.domaine.includes(recherche))
  const pages = s.pages.filter((p) => garde(p.qui, p.type)).filter((p) => !recherche || p.url.toLowerCase().includes(recherche) || (p.titre ?? '').toLowerCase().includes(recherche)).filter((p) => sp.manque !== '1' || (p.qui !== 'nous' && p.sansNous > 0))
  const nosPages = classerNosPages(m)
  const discussions = s.pages.filter((p) => estDiscussion(p.domaine, m))
  const aNous = s.repartition.find((r) => r.qui === 'nous')?.n ?? 0
  const [travail, aClasser, auto] = await Promise.all([lireTravail(m.projet.id, marqueDe(m.projet)), sitesAClasser(m.projet.id), classementAuto(m.projet.id)])
  const dansLaListe = new Set(travail.map((l) => l.cle))

  // Ce qui a bougé entre les deux derniers jours de relevé d'interface.
  const bouge = classerMouvements(m)
  const vueBouge = sp.bouge === 'pages' ? 'pages' : 'sites'

  // Fiche d'un site ou d'une page.
  const ficheDomaine = sp.fiche ? s.domaines.find((d) => d.domaine === sp.fiche) : undefined
  const fichePage = sp.fiche ? s.pages.find((p) => p.url === sp.fiche) : undefined
  const relevesFiche = fichePage ? [...fichePage.releves, ...fichePage.api] : ficheDomaine ? m.releves.filter((r) => ficheDomaine.reponses.has(r.id) || ficheDomaine.api.has(r.id)) : []
  const marquesFiche = relevesFiche.length ? classerMarques(m, relevesFiche) : null
  const siteFiche = ficheDomaine ?? (fichePage ? s.domaines.find((d) => d.domaine === fichePage.domaine) : undefined)

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Comprendre') }, { libelle: t('Sources') }]} m={m} exportCsv="/api/export/sources" lancer />
      <EnTete
        titre={t('Sources')}
        verdict={s.citations === 0 ? t('Aucune source citée sur cette période.') : <>
          {t('Les IA d’interface citent {sites} [sites:site|sites] dans {n} [n:réponse|réponses] : {nous} [nous:citation va|citations vont] à {marque}, soit {part}.', { sites: s.domaines.filter((d) => d.reponses.size > 0).length, n: s.base, nous: aNous, marque: m.marque.nom, part: pct(aNous / s.citations) })}{' '}
          <span className="second">{t('{n} [n:citation|citations] en tout.', { n: s.citations })}</span>
        </>}
      />

      {aClasser.length > 0 && (
        <form action={classerLesSites}>
          <Bandeau action={<BoutonEnvoi enCours={t('Classement en cours…')}>{t('Classer les sites (environ {prix})', { prix: usdFin(Math.max(aClasser.length * PRIX_CLASSEMENT_USD, 0.0005)) })}</BoutonEnvoi>}>
            <p>
              <strong className="font-semibold">{t('{n} [n:site n’est pas encore classé|sites ne sont pas encore classés].', { n: aClasser.length })}</strong>{' '}
              {t('Le classement dit pour chacun son type (comparatif, média, blog, forum, annuaire, site de marque, site officiel, boutique) et, pour un site de marque, à qui il appartient. Il se fait une fois par site, puis il est gardé.')}
            </p>
            <p className="second mt-1">{t('Appel payant, inscrit au journal des coûts. Rien ne part sans votre clic.')} {auto ? t('Les nouveaux sites sont ensuite classés tout seuls.') : t('Après ce premier clic, les nouveaux sites seront classés tout seuls ; cela se coupe ici même.')}</p>
          </Bandeau>
        </form>
      )}
      {(m.sites.size > 0 || auto) && (
        <form action={reglerClassementAuto} className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="second">
            <strong className="font-semibold text-[var(--encre)]">{aClasser.length === 0 ? t('Tous les sites vus dans les sources sont classés.') : t('{n} [n:site classé et gardé|sites classés et gardés].', { n: m.sites.size })}</strong>{' '}
            {auto ? t('Les nouveaux sites sont classés tout seuls après chaque relevé (moins d’un centime par relevé).') : t('Le classement automatique des nouveaux sites est coupé : le bouton « Classer les sites » revient quand il y en a.')}
          </p>
          <input type="hidden" name="auto" value={auto ? '0' : '1'} />
          <BoutonEnvoi className="bouton bouton-creux bouton-petit" enCours={t('Enregistrement…')}>{auto ? t('Couper le classement automatique') : t('Activer le classement automatique')}</BoutonEnvoi>
        </form>
      )}

      {s.citations === 0 && s.baseApi === 0 ? (
        <Vide titre={t('Aucune source relevée.')} action={m.tous.length === 0 ? <Link href={`/projets/${m.projet.id}?onglet=releves`} className="bouton">{t('Préparer le premier relevé')}</Link> : undefined}>
          <p>{m.tous.length === 0 ? t('Les sources apparaissent dès le premier relevé.') : t('Aucune source citée sur la période choisie. Élargissez la période dans la barre du haut.')}</p>
        </Vide>
      ) : (
        <>
          <section className="ecran" aria-label={t('Chiffres clés')}>
            <div className="tuiles">
              <Tuile titre={t('Sites cités')} aide={t('Nombre de sites différents cités comme sources par les IA d’interface.')} methode="interface" base={t('{n} [n:réponse|réponses]', { n: s.base })}><Compteur valeur={s.domaines.filter((d) => d.reponses.size > 0).length} /></Tuile>
              <Tuile titre={t('Pages citées')} aide={t('Nombre de pages différentes citées comme sources par les IA d’interface.')} methode="interface" base={t('{n} [n:réponse|réponses]', { n: s.base })}><Compteur valeur={s.pages.filter((p) => p.releves.length > 0).length} /></Tuile>
              <Tuile titre={t('Citations')} aide={t('Nombre total de sources citées, toutes réponses d’interface confondues.')} methode="interface" base={s.base ? t('{moyenne} par réponse en moyenne', { moyenne: nombre(Math.round((s.citations / s.base) * 10) / 10) }) : undefined}><Compteur valeur={s.citations} /></Tuile>
              <Tuile titre={t('Part à nous')} aide={t('Part des citations qui vont à une page du site ou à une vidéo de la marque.')} href={lien({ qui: 'nous', onglet: 'pages', fiche: undefined })} methode="interface" base={t('{k} sur {n} [n:citation|citations]', { k: aNous, n: s.citations })}>
                {s.citations > 0 ? <Compteur valeur={Number(((aNous / s.citations) * 100).toFixed(1))} decimales={aNous > 0 && aNous / s.citations < 0.1 ? 1 : 0} suffixe=" %" /> : <span className="discret">{t('n.c.')}</span>}
              </Tuile>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <Feuille titre={t('À qui profitent les citations')} droite={<LigneMethode methode="interface" n={s.citations} unite="citation" />} aide={t('À nous, aux concurrents suivis, aux autres marques, puis aux tiers, rangés par type de site. Un clic sur une part filtre les tableaux du dessous. Un site pas encore classé reste « à classer » : rien n’est deviné.')}>
              <div className="p-4">
                <Decoupe
                  libelle={t('À qui profitent les citations')}
                  unite={t('citations')}
                  segments={s.repartition.map((r) => ({ cle: r.cle, libelle: t(r.libelle), n: r.n, teinte: teinteDePart(r), href: lien({ qui: r.cle, type: undefined, fiche: undefined }) }))}
                />
                {(filtreQui || filtreType) && <p className="mt-3">{t('Filtre :')} <strong className="font-semibold">{filtreQui ? t(filtreQui.libelle) : t(groupeType(filtreType!))}</strong>. <Link href={lien({ qui: undefined, type: undefined })} scroll={false} className="lien">{t('Tout afficher')}</Link></p>}
              </div>
            </Feuille>
            <Feuille titre={t('Sites les plus cités')} droite={<LigneMethode methode="interface" n={s.base} unite="réponse" />}>
              <Classement
                libelle={t('Sites les plus cités')}
                lignes={s.domaines.filter((d) => d.reponses.size > 0).slice(0, 7).map((d) => ({ cle: d.domaine, nom: d.domaine, valeur: d.reponses.size, texte: `${d.reponses.size} · ${pct(d.reponses.size / Math.max(s.base, 1))}`, nous: d.qui === 'nous', href: lien({ fiche: d.domaine }), note: t(typeEcrit(d.type, d.qui)) }))}
              />
            </Feuille>
          </div>

          {/* ── Fiche d'un site ou d'une page ───────────────────────────────── */}
          {(ficheDomaine || fichePage) && (
            <PanneauLateral
              large
              sousTitre={`${fichePage ? t('Page citée') : t('Site cité')} · ${t(QUI[(fichePage ?? ficheDomaine)!.qui].libelle)} · ${t(typeEcrit((fichePage ?? ficheDomaine)!.type, (fichePage ?? ficheDomaine)!.qui))}${ficheDomaine?.marque ? ` · ${ficheDomaine.marque}` : ''}`}
              titre={fichePage ? (fichePage.titre ?? adresseCourte(fichePage.url)) : ficheDomaine!.domaine}
              fermer={lien({ fiche: undefined })}
            >
              {fichePage && <p><a href={fichePage.url} target="_blank" rel="noopener noreferrer nofollow" className="lien break-all text-[0.875rem]">{adresseCourte(fichePage.url, 110)}</a></p>}
              <div className="fiche-source space-y-5">

                <div>
                  <p className="sous-titre bloc-titre">{t('Réponses qui la citent')} <span className="chiffre">({relevesFiche.length})</span></p>
                  <ul className="mt-1.5">
                    {relevesFiche.slice(0, 12).map((r) => (
                      <li key={r.id} className="ligne-t py-1">
                        <Link href={lienReponse(r)} className="hover:underline"><span className="font-semibold">{nomCourt(r.moteur)}{r.methode === 'api' ? ' (API)' : ''}</span> · {jourCourt(r.createdAt)}</Link>
                        <span className="second block truncate">{r.question.texte}</span>
                      </li>
                    ))}
                  </ul>
                  {relevesFiche.length > 12 && <p className="second mt-1">{t('et {n} de plus.', { n: relevesFiche.length - 12 })}</p>}
                </div>
                <div>
                  <p className="sous-titre bloc-titre">{t('Marques nommées dans ces réponses')}</p>
                  <p className="second mt-1">{t('Ce sont les marques des réponses, pas celles de la page : le contenu de la page n’est pas encore lu.')}</p>
                  <ol className="mt-1.5">
                    {marquesFiche?.lignes.filter((l) => l.reponses + l.api > 0 || l.aNous).slice(0, 8).map((l) => (
                      <li key={l.cle} className="ligne-t flex items-baseline justify-between gap-2 py-1">
                        <NomMarque nom={l.nom} nous={l.aNous} />
                        <span className="nb shrink-0">{l.reponses + l.api}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="sous-titre bloc-titre">{t('Citations par jour de relevé')}</p>
                  <ul className="mt-1.5">
                    {[...new Set(relevesFiche.map((r) => r.jour))].sort().map((j) => (
                      <li key={j} className="ligne-t flex justify-between py-1"><span>{jourLong(deCleJour(j))}</span><span className="nb">{pluriel(relevesFiche.filter((r) => r.jour === j).length, 'réponse')}</span></li>
                    ))}
                  </ul>
                  {ficheDomaine && !fichePage && <p className="mt-3"><Link href={lien({ onglet: 'pages', q: ficheDomaine.domaine, fiche: undefined })} scroll={false} className="lien-fleche">{t('Ses {n} [n:page citée|pages citées]', { n: ficheDomaine.pages.size })} <span aria-hidden="true">→</span></Link></p>}
                  {siteFiche && siteFiche.qui !== 'nous' && (
                    <form action={corrigerSite} className="mt-4 space-y-2 border-t border-[var(--filet)] pt-3">
                      <input type="hidden" name="domaine" value={siteFiche.domaine} />
                      <label className="libelle">
                        {t('Type de {site}', { site: siteFiche.domaine })}
                        <span className="aide">{m.sites.get(siteFiche.domaine)?.origine === 'main' ? t('Corrigé à la main.') : m.sites.has(siteFiche.domaine) ? t('Classé par le petit modèle. Une correction à la main l’emporte, pour tous les projets.') : siteFiche.type === 'a_classer' ? t('Pas encore classé. Vous pouvez le ranger vous-même.') : t('Reconnu sans le modèle. Une correction à la main l’emporte.')}</span>
                        <select name="type" defaultValue={siteFiche.type === 'a_classer' ? 'autre' : siteFiche.type} key={`${siteFiche.domaine}:${siteFiche.type}`} className="champ mt-1 !py-1.5 !text-[0.875rem]">
                          {(Object.keys(TYPES_SITE) as TypeSite[]).map((x) => <option key={x} value={x}>{t(libelleType(x)).charAt(0).toUpperCase() + t(libelleType(x)).slice(1)}</option>)}
                        </select>
                      </label>
                      <label className="libelle">
                        {t('Marque propriétaire')}
                        <span className="aide">{t('Seulement pour un site de marque.')}</span>
                        <input name="marque" defaultValue={siteFiche.marque ?? ''} key={`${siteFiche.domaine}:${siteFiche.marque ?? ''}`} className="champ mt-1 !py-1.5 !text-[0.875rem]" />
                      </label>
                      <BoutonEnvoi className="bouton bouton-creux bouton-petit" enCours={t('Enregistrement…')}>{t('Corriger le type')}</BoutonEnvoi>
                    </form>
                  )}
                  {fichePage && fichePage.qui !== 'nous' && /^https?:\/\//.test(fichePage.url) && (
                    dansLaListe.has(`page:${fichePage.url}`) ? (
                      <p className="mt-3"><Link href={`/actions?action=${encodeURIComponent(`page:${fichePage.url}`)}`} className="lien-fleche">{t('Déjà dans la liste de travail')} <span aria-hidden="true">→</span></Link></p>
                    ) : (
                      <form action={ajouterPageAuTravail} className="mt-3">
                        <input type="hidden" name="url" value={fichePage.url} />
                        <button type="submit" className="bouton bouton-creux bouton-petit">{t('Ajouter à la liste de travail')}</button>
                      </form>
                    )
                  )}
                </div>
              </div>
            </PanneauLateral>
          )}

          {/* ── Tableaux ────────────────────────────────────────────────────── */}
          <div>
            <Onglets
              libelle={t('Tableaux des sources')}
              actif={onglet}
              onglets={[
                { cle: 'domaines', libelle: t('Sites'), href: lien({ onglet: undefined, fiche: undefined, manque: undefined }), n: domaines.length },
                { cle: 'pages', libelle: t('Pages'), href: lien({ onglet: 'pages', fiche: undefined }), n: pages.length },
                { cle: 'nos-pages', libelle: t('Nos pages'), href: lien({ onglet: 'nos-pages', fiche: undefined, manque: undefined }), n: nosPages.length },
                { cle: 'discussions', libelle: t('Discussions'), href: lien({ onglet: 'discussions', fiche: undefined, manque: undefined }), n: discussions.length },
              ]}
            />
            <div className="ecran !border-t-0">
              {(onglet === 'domaines' || onglet === 'pages') && (
                <div className="space-y-3 border-b border-[var(--filet)] px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {sp.q ? <p className="text-[0.8125rem]">{t('Filtre :')} <strong className="font-semibold">{sp.q}</strong>. <Link href={lien({ q: undefined })} scroll={false} className="lien">{t('Tout afficher')}</Link></p> : <span />}
                    {onglet === 'pages' && <Link href={lien({ manque: sp.manque === '1' ? undefined : '1' })} scroll={false} className="choix" aria-current={sp.manque === '1' ? 'true' : undefined}>{t('Seulement les pages citées sans nous')}</Link>}
                  </div>
                  <Choix
                    libelle={t('Type de site')}
                    actif={filtreType ?? 'tous'}
                    options={[{ cle: 'tous', libelle: t('Tous'), href: lien({ type: undefined, fiche: undefined }) }, ...typesPresents.map((x) => ({ cle: x, libelle: `${t(groupeType(x))} (${cites.filter((d) => d.type === x).length})`, href: lien({ type: x, qui: undefined, fiche: undefined }) }))]}
                  />
                </div>
              )}

              {onglet === 'domaines' && (
                <TableauTriable
                  dense
                  libelle={t('Sites cités')}
                  recherche={t('Chercher un site')}
                  vide={t('Aucun site ne correspond.')}
                  triInitial={{ colonne: 3, sens: 'desc' }}
                  colonnes={[
                    { libelle: t('Site') },
                    { libelle: t('Type') },
                    { libelle: t('À qui') },
                    { libelle: t('Réponses'), num: true, aide: t('Réponses d’interface qui citent le site, et leur part des réponses.') },
                    { libelle: t('IA qui le citent'), triable: false },
                    { libelle: t('Questions'), num: true },
                    { libelle: t('Pages'), num: true },
                    { libelle: t('Évolution'), num: true, aide: t('Réponses comparables qui citent le site, au dernier relevé par rapport au précédent. Coloré seulement au-delà de la marge d’erreur.') },
                    { libelle: 'Claude (API)', num: true, api: true },
                  ]}
                  lignes={domaines.map((d) => {
                    const mouvement = bouge?.sites.tous.get(d.domaine)
                    return {
                      cle: d.domaine,
                      nous: d.qui === 'nous',
                      href: lien({ fiche: d.domaine }),
                      surPlace: true,
                      recherche: `${d.domaine} ${d.marque ?? ''} ${t(typeEcrit(d.type, d.qui))}`,
                      tri: [d.domaine, t(typeEcrit(d.type, d.qui)), t(QUI[d.qui].libelle), d.reponses.size, null, d.questions.size, d.pages.size, mouvement ? mouvement.apres - mouvement.avant : null, d.api.size],
                      cellules: [
                        <NomMarque key="s" nom={d.domaine} nous={d.qui === 'nous'} href={lien({ fiche: d.domaine })} />,
                        <span key="t" className="second whitespace-nowrap">{d.type === 'a_classer' ? <span className="discret">{t('à classer')}</span> : t(typeEcrit(d.type, d.qui))}{d.marque && d.qui !== 'nous' && <span className="discret block">{d.marque}</span>}</span>,
                        <span key="q" className={`pastille ${QUI[d.qui].classe}`}>{t(QUI[d.qui].libelle)}</span>,
                        <span key="r"><Link href={`/reponses?domaine=${encodeURIComponent(d.domaine)}`} className="ligne-lien hover:underline">{d.reponses.size}</Link><span className="discret"> · {pct(d.reponses.size / Math.max(s.base, 1))}</span></span>,
                        <span key="ia" className="second">{[...d.moteurs].map(nomCourt).join(', ')}</span>,
                        d.questions.size,
                        d.pages.size,
                        bouge ? <Evolution key="e" x={mouvement} /> : <span key="e" className="discret">{t('1 relevé')}</span>,
                        d.api.size || '',
                      ],
                    }
                  })}
                />
              )}

              {onglet === 'pages' && (
                <TableauTriable
                  dense
                  libelle={t('Pages citées')}
                  recherche={t('Chercher une page')}
                  vide={t('Aucune page ne correspond.')}
                  triInitial={{ colonne: 3, sens: 'desc' }}
                  colonnes={[
                    { libelle: t('Page') },
                    { libelle: t('Type') },
                    { libelle: t('À qui') },
                    { libelle: t('Réponses'), num: true },
                    { libelle: t('Dont sans nous'), num: true, aide: t('Réponses qui citent cette page sans nommer ni citer la marque : là où il faut entrer.') },
                    { libelle: t('IA'), triable: false },
                    { libelle: t('Questions'), num: true },
                    { libelle: t('Publiée le'), num: true },
                    { libelle: 'Claude (API)', num: true, api: true },
                  ]}
                  lignes={pages.map((p) => ({
                    cle: p.url,
                    nous: p.qui === 'nous',
                    href: lien({ fiche: p.url }),
                    surPlace: true,
                    recherche: `${p.url} ${p.titre ?? ''}`,
                    tri: [p.titre ?? p.url, t(typeEcrit(p.type, p.qui)), t(QUI[p.qui].libelle), p.releves.length, p.qui === 'nous' ? null : p.sansNous, null, p.questions.size, p.video?.publieLe?.getTime() ?? null, p.api.length],
                    cellules: [
                      <span key="p" className="flex min-w-[14rem] max-w-[28rem] items-start gap-2">
                        <Initiale nom={p.domaine} nous={p.qui === 'nous'} />
                        <span className="min-w-0">
                          <Link href={lien({ fiche: p.url })} scroll={false} className="ligne-lien line-clamp-1 font-semibold">{p.titre ?? adresseCourte(p.url)}</Link>
                          <span className="second discret block truncate font-normal">{adresseCourte(p.url, 70)}</span>
                        </span>
                      </span>,
                      <span key="t" className="second whitespace-nowrap">{p.type === 'a_classer' ? <span className="discret">{t('à classer')}</span> : t(typeEcrit(p.type, p.qui))}</span>,
                      <span key="q" className={`pastille ${QUI[p.qui].classe}`}>{t(QUI[p.qui].libelle)}</span>,
                      <Link key="r" href={`/reponses?page=${encodeURIComponent(p.url)}`} className="ligne-lien hover:underline">{p.releves.length}</Link>,
                      p.qui === 'nous' ? '' : p.sansNous,
                      <span key="ia" className="second">{[...p.moteurs].map(nomCourt).join(', ')}</span>,
                      p.questions.size,
                      p.video?.publieLe ? jourLong(p.video.publieLe) : <span key="d" className="discret">{t('n.c.')}</span>,
                      p.api.length || '',
                    ],
                  }))}
                />
              )}

              {onglet === 'nos-pages' && (
                nosPages.length === 0 ? (
                  <p className="second p-4">{t('Aucune page ni vidéo de {marque} n’a été citée, lue ou classée chez Google sur cette période.', { marque: m.marque.nom })} {m.marque.domaines.length + m.marque.chainesYoutube.length === 0 && <Link href={`/projets/${m.projet.id}?onglet=marque`} className="lien">{t('Déclarez le site et la chaîne de la marque.')}</Link>}</p>
                ) : (
                  <div className="defile haut">
                    <table className="tableau dense fiches">
                      <thead>
                        <tr>
                          <th scope="col" className="fixe">{t('Notre page')}</th>
                          <th scope="col" className="num">{t('Citée')}</th>
                          <th scope="col" className="num">{t('Lue sans être citée')}</th>
                          <th scope="col">{t('Chez Google')}</th>
                          <th scope="col">{t('Pages citées à sa place')}</th>
                          <th scope="col"><span className="invisible-lecteur">{t('Auditer')}</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {nosPages.map((p) => {
                          const moment = momentDe(p.url)
                          return (
                            <tr key={p.url}>
                              <th scope="row" className="fixe max-w-[26rem]">
                                <a href={p.url} target="_blank" rel="noopener noreferrer" className="ligne-lien line-clamp-1 font-semibold">{p.titre ?? adresseCourte(p.url)}</a>
                                <span className="second discret block truncate">{adresseCourte(p.url, 70)}{moment ? ` · ${t('passage cité à {duree}', { duree: dureeLisible(moment) })}` : ''}</span>
                              </th>
                              <td className="num">{p.citee.length > 0 ? <Link href={`/reponses?page=${encodeURIComponent(p.url)}`} className="pastille cite">{pluriel(p.citee.length, 'réponse')}</Link> : <span className="discret">0</span>}</td>
                              <td className="num">{p.lue.length > 0 ? <span className="pastille neutre">{pluriel(p.lue.length, 'fois', 'fois')}</span> : <span className="discret">0</span>}</td>
                              <td className="second">{p.google.length === 0 ? <span className="discret">{t('hors des 10 premiers')}</span> : p.google.slice(0, 2).map((g) => <span key={g.question.id} className="block"><span className="chiffre font-semibold">{g.rang}e</span> {t('sur')} <Link href={`/questions/${g.question.id}`} className="lien">{g.question.texte.slice(0, 40)}{g.question.texte.length > 40 ? '…' : ''}</Link></span>)}</td>
                              <td className="second max-w-[18rem]">{p.aLaPlace.size === 0 ? <span className="discret">{t('sans objet')}</span> : [...p.aLaPlace.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([url]) => <Link key={url} href={`${lien({ onglet: 'pages', fiche: url })}#fiche`} className="lien block truncate">{adresseCourte(url, 44)}</Link>)}</td>
                              <td className="text-right">{/^https?:\/\//.test(p.url) && !p.url.includes('youtu') && (
                                <span className="inline-flex gap-1.5">
                                  <Link href={`/pages?url=${encodeURIComponent(p.url)}#suivre`} className="bouton bouton-creux bouton-petit" title={t('Lire la page et suivre les questions auxquelles elle répond')}>{t('Suivre')}</Link>
                                  <Link href={`/audit?url=${encodeURIComponent(p.url)}`} className="bouton bouton-creux bouton-petit">{t('Auditer')}</Link>
                                </span>
                              )}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {onglet === 'discussions' && (
                discussions.length === 0 ? (
                  <p className="second p-4">{t('Aucun fil de forum ni publication de réseau social parmi les sources citées sur cette période.')}</p>
                ) : (
                  <div className="defile haut">
                    <table className="tableau dense fiches">
                      <thead>
                        <tr>
                          <th scope="col" className="fixe">{t('Fil ou publication')}</th>
                          <th scope="col">{t('Plateforme')}</th>
                          <th scope="col" className="num">{t('Réponses')}</th>
                          <th scope="col">{t('IA')}</th>
                          <th scope="col">{t('Questions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {discussions.map((p) => (
                          <tr key={p.url}>
                            <th scope="row" className="fixe max-w-[28rem]">
                              <a href={p.url} target="_blank" rel="noopener noreferrer nofollow" className="ligne-lien line-clamp-1 font-semibold">{p.titre ?? adresseCourte(p.url)}</a>
                              <span className="second discret block truncate">{adresseCourte(p.url, 70)}</span>
                            </th>
                            <td>{p.domaine}</td>
                            <td className="num"><Link href={`/reponses?page=${encodeURIComponent(p.url)}`} className="ligne-lien">{p.releves.length + p.api.length}</Link></td>
                            <td className="second">{[...p.moteurs].map(nomCourt).join(', ')}{p.api.length > 0 ? `${p.moteurs.size ? ', ' : ''}Claude (API)` : ''}</td>
                            <td className="second max-w-[18rem]"><span className="line-clamp-1">{[...p.questions.values()].join(' · ')}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
              <div className="border-t border-[var(--filet)] px-4 py-2.5">
                <LigneMethode methode="interface" n={s.base} unite="réponse" periode={periode} suite={s.baseApi ? t('Claude (API) à part : {n} [n:réponse|réponses]', { n: s.baseApi }) : undefined} />
              </div>
            </div>
          </div>

          {/* ── Ce qui a bougé ──────────────────────────────────────────────── */}
          <Feuille
            id="bouge"
            className="scroll-mt-40"
            titre={t('Sources qui montent et qui descendent')}
            droite={bouge ? <><span>{jourCourt(deCleJour(bouge.jourAvant))} → {jourCourt(deCleJour(bouge.jourApres))}</span><LigneMethode methode="interface" n={bouge.paires} unite="réponse comparable" /></> : t('un seul relevé')}
            aide={t('Le dernier jour de relevé comparé au précédent, sur les seuls couples question et IA qui ont une réponse aux deux dates. Chaque nombre est un nombre de réponses qui citent la source. Avec un relevé par date, un écart n’est coloré que s’il dépasse la marge d’erreur : le reste est un indice, pas une tendance.')}
          >
            {!bouge ? (
              <p className="second p-4"><strong className="font-semibold text-[var(--encre)]">{t('Un seul jour de relevé.')}</strong> {t('Les sources nouvelles, en hausse, en baisse et perdues s’afficheront à partir du deuxième relevé.')}</p>
            ) : (
              <>
                <div className="border-b border-[var(--filet)] px-4 py-3">
                  <Choix libelle={t('Comparer')} actif={vueBouge} options={[{ cle: 'sites', libelle: t('Les sites'), href: `${lien({ bouge: undefined })}#bouge` }, { cle: 'pages', libelle: t('Les pages'), href: `${lien({ bouge: 'pages' })}#bouge` }]} />
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-4">
                  {([[t('Nouvelles'), bouge[vueBouge].nouveaux], [t('En hausse'), bouge[vueBouge].hausse], [t('En baisse'), bouge[vueBouge].baisse], [t('Perdues'), bouge[vueBouge].perdus]] as const).map(([titre, liste]) => (
                    <div key={titre} className="border-b border-[var(--filet)] px-4 py-3 md:border-r xl:border-b-0 xl:last:border-r-0">
                      <p className="etiquette">{titre} ({liste.length})</p>
                      {liste.length === 0 ? <p className="second mt-1">{t('Aucune.')}</p> : (
                        <ul className="mt-1.5">
                          {liste.slice(0, 8).map((x) => (
                            <li key={x.cle} className="ligne-t grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 py-1">
                              <Link href={`${lien({ fiche: x.cle, onglet: vueBouge === 'pages' ? 'pages' : undefined })}#fiche`} className="min-w-0 truncate hover:underline" title={vueBouge === 'pages' ? x.cle : undefined}>{vueBouge === 'pages' ? (x.titre ?? adresseCourte(x.cle, 48)) : x.cle}</Link>
                              <span className="nb whitespace-nowrap"><span className="discret">{x.avant} → {x.apres}</span></span>
                              <span className="second discret col-span-2 block truncate">{vueBouge === 'pages' ? x.domaine : (() => { const d = s.domaines.find((y) => y.domaine === x.cle); return d ? `${t(typeEcrit(d.type, d.qui))} · ${t(QUI[d.qui].libelle).toLowerCase()}` : '' })()}</span>
                              <span className="col-span-2 block"><EcartLu e={x.e} vide="" /></span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {liste.length > 8 && <p className="second discret mt-1">{t('et {n} de plus.', { n: liste.length - 8 })}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Feuille>

          <CommentLire>
            <ul>
              <li>{t('Une source est une page citée par une IA pour répondre. Seules les sources citées par les IA d’interface entrent dans les chiffres ; Claude (API) a sa colonne.')}</li>
              <li>{t('Chaque site est rangé par type (comparatif, média, blog…) et par appartenance : à nous, à un concurrent suivi, à une autre marque, ou tiers. Un site pas encore classé reste « à classer » : rien n’est deviné.')}</li>
              <li>{t('Un clic sur une ligne ouvre la fiche du site ou de la page : les réponses qui la citent, les marques nommées avec elle, et son type, que vous pouvez corriger.')}</li>
            </ul>
          </CommentLire>
        </>
      )}
    </div>
  )
}
