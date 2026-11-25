import Link from 'next/link'
import { Compteur, Courbe, GrapheLignes, Tendance } from '@/components/graphiques/Graphiques'
import { BandeauLecture } from '@/components/outil/BandeauLecture'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { Carreau, Classement, CommentLire, Decoupe, EcartLu, EnTete, Feuille, LegendeEtats, LigneMethode, NomMarque, Tampon, TeteMoteur, TropTot, Tuile, Vide } from '@/components/outil/Blocs'
import { ListeReponses } from '@/components/outil/ListeReponses'
import { TableauTriable } from '@/components/outil/TableauTriable'
import { classerApercus, classerMarques, classerSources, teinteDePart, typeEcrit } from '@/lib/classements'
import { exigerMesures, titreOnglet } from '@/lib/contexte'
import { courbe, tendance } from '@/lib/courbes'
import { PRIX_INTERFACE_USD } from '@/lib/estimation'
import { libellePeriode } from '@/lib/filtres'
import { mesuresDuGraphe, reperesDuGraphe } from '@/lib/graphe'
import { traducteur } from '@/lib/i18n/serveur'
import { deCleJour, jourLong, nom, nombre, nomCourt, pct, pluriel, usdFin } from '@/lib/libelles'
import { compter, deMethode, deMoteur, derniersParMoteur, ecart, intervalle, lireMesuresBrutes, METHODE, part, rangMoyen, recus, SEUIL_CHIFFRE } from '@/lib/mesures'
import { marqueDe } from '@/lib/projets'
import { estDuProfil } from '@/lib/releves'
import { construireRapport } from '@/lib/rapport'
import { lireActionsFaites, lireTravail } from '@/lib/travail'
import { suivreMarque } from '../_actions/suivi'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Vue d’ensemble')

export default async function VueDEnsemble() {
  const t = await traducteur()
  const m = await exigerMesures()
  const fiche = `/projets/${m.projet.id}`
  const fil = [{ libelle: t('Suivre') }, { libelle: t('Vue d’ensemble') }]

  // ── Projet sans relevé : pas de tuiles à zéro, une phrase et une action ─────
  if (m.tous.length === 0) {
    const n = m.questions.length
    return (
      <div className="space-y-6">
        <BarreHaut fil={fil} />
        <EnTete titre={t('Vue d’ensemble')} verdict={n === 0 ? t('Ce projet n’a pas encore de question.') : t('Aucun relevé pour ce projet.')} />
        <Vide
          titre={n === 0 ? t('Commencez par écrire vos questions') : t('Lancez le premier relevé')}
          action={<Link href={n === 0 ? `${fiche}?onglet=questions` : `${fiche}?onglet=releves`} className="bouton">{n === 0 ? t('Écrire mes questions') : t('Préparer le premier relevé')}</Link>}
        >
          {n === 0 ? (
            <p>{t('Ce sont les questions que vos clients posent aux IA. Elles seront posées à ChatGPT, à Gemini et à Google.')}</p>
          ) : (
            <p>{t('Un relevé pose {n} [n:question|questions] à 4 IA par l’interface, pour environ {prix}. Rien ne part sans votre clic.', { n, prix: usdFin(n * 4 * PRIX_INTERFACE_USD) })}</p>
          )}
        </Vide>
      </div>
    )
  }

  const ui = deMethode(m.releves, 'interface')
  const api = deMethode(m.releves, 'api')
  const cUi = compter(ui)
  const cApi = compter(api)
  const avantUi = compter(deMethode(m.precedents, 'interface'))
  const avantApi = compter(deMethode(m.precedents, 'api'))
  const interfaces = m.moteurs.filter((x) => METHODE[x] === 'interface')
  const moteursApi = m.moteurs.filter((x) => METHODE[x] === 'api')
  const periode = libellePeriode(m.filtres.periode)
  const marques = classerMarques(m)
  const marquesAvant = classerMarques(m, m.precedents)
  const sources = classerSources(m)
  const apercus = classerApercus(m).filter((a) => a.total > 0)
  const toutLeTravail = await lireTravail(m.projet.id, marqueDe(m.projet))
  const travail = toutLeTravail.filter((l) => l.etat === 'a_faire' || l.etat === 'en_cours')
  // Le rapport compare les deux derniers jours de relevé, sans les filtres de la barre du haut : ses alertes aussi.
  const brutes = await lireMesuresBrutes(m.projet.id)
  const [rapport, faites] = await Promise.all([brutes ? construireRapport(brutes, toutLeTravail) : null, lireActionsFaites(m.projet.id, toutLeTravail)])
  const nous = marques.lignes.find((l) => l.aNous)!
  const rang = rangMoyen(ui)
  const tUi = tendance(ui)
  const tApi = tendance(api)
  const vaguesUi = new Set(recus(ui).map((r) => r.jour)).size
  const dates = m.premier && m.dernier ? (jourLong(m.premier) === jourLong(m.dernier) ? t('le {date}', { date: jourLong(m.dernier) }) : t('du {debut} au {fin}', { debut: jourLong(m.premier), fin: jourLong(m.dernier) })) : ''

  // D'où vient la visibilité : par le site, par la chaîne, par le seul nom.
  const presents = recus(ui).filter((r) => r.present)
  const parSite = presents.filter((r) => r.p?.citeeSite).length
  const parChaine = presents.filter((r) => !r.p?.citeeSite && r.p?.citeeYoutube).length
  const parNom = presents.length - parSite - parChaine

  // Nos pages et vidéos citées (interface).
  const citationsSite = recus(ui).reduce((n, r) => n + r.sources.filter((s) => s.role === 'citee' && m.marque.domaines.some((d) => s.domaine === d || s.domaine.endsWith(`.${d}`))).length, 0)
  const citationsVideo = recus(ui).reduce((n, r) => n + r.sources.filter((s) => s.role === 'citee' && !!s.videoYoutube && m.marque.chainesYoutube.some((c) => c.id === s.videoYoutube!.chaineId)).length, 0)
  // Pages citées sous un profil de la marque (LinkedIn, Instagram…) : elles comptent pour elle, comme sur l'écran des sources.
  const citationsProfils = recus(ui).reduce((n, r) => n + r.sources.filter((s) => s.role === 'citee' && !m.marque.domaines.some((d) => s.domaine === d || s.domaine.endsWith(`.${d}`)) && !(s.videoYoutube && m.marque.chainesYoutube.some((c) => c.id === s.videoYoutube!.chaineId)) && estDuProfil(s, m.marque)).length, 0)

  // Par IA.
  const parMoteur = m.moteurs.map((moteur) => {
    const rs = deMoteur(m.releves, moteur)
    const c = compter(rs)
    const ok = recus(rs)
    return {
      moteur, c, rang: rangMoyen(rs),
      site: ok.filter((r) => r.p?.citeeSite).length,
      video: ok.filter((r) => !r.p?.citeeSite && r.p?.citeeYoutube).length,
      nom: ok.filter((r) => r.present && !r.p?.citeeSite && !r.p?.citeeYoutube).length,
      lues: ok.filter((r) => r.p?.consultee).length,
      t: tendance(rs),
      e: ecart(compter(deMoteur(m.precedents, moteur)), c),
      modeles: [...new Set(ok.map((r) => r.modele).filter(Boolean))] as string[],
    }
  })
  const classables = parMoteur.filter((x) => METHODE[x.moteur] === 'interface' && x.c.n >= SEUIL_CHIFFRE)
  const forte = classables.length > 1 ? classables.reduce((a, b) => (part(b.c.k, b.c.n)! > part(a.c.k, a.c.n)! ? b : a)) : null
  const faible = classables.length > 1 ? classables.reduce((a, b) => (part(b.c.k, b.c.n)! < part(a.c.k, a.c.n)! ? b : a)) : null
  const departage = forte && faible && part(forte.c.k, forte.c.n) !== part(faible.c.k, faible.c.n)

  const iUi = intervalle(cUi.k, cUi.n)
  const courbeApi = courbe(moteursApi.map((x) => ({ cle: x, nom: `${nomCourt(x)} (API)`, releves: deMoteur(api, x), pointille: true })))

  const autres = marques.lignes.filter((l) => !l.aNous && !l.ignoree && l.reponses > 0)
  const tons = nous.positifs + nous.negatifs + nous.neutres
  const dernieres = [...recus(m.releves)].reverse().slice(0, 6)
  const ecartMarque = (cle: string, reponses: number) => {
    const avant = marquesAvant.lignes.find((l) => l.cle === cle)
    return marquesAvant.base > 0 ? ecart({ k: avant?.reponses ?? 0, n: marquesAvant.base }, { k: reponses, n: marques.base }) : undefined
  }
  const un = (x: number) => nombre(x, 1)

  return (
    <div className="space-y-6">
      <BarreHaut fil={fil} m={m} exportCsv="/api/export/questions" lancer />

      <EnTete
        grand
        titre={
          m.releves.length === 0 ? t('Aucun relevé sur cette période.')
          : cUi.n === 0 && cApi.n === 0 ? t('Les réponses ne sont pas encore revenues.')
          : cUi.n > 0 ? <>{t('{marque} apparaît dans', { marque: m.marque.nom })} <Link href="/reponses?presence=oui&methode=interface" className="surligne">{pluriel(cUi.k, 'réponse')}</Link> {t('sur {n}.', { n: cUi.n })}</>
          : <>{t('Par l’API de Claude, {marque} apparaît dans', { marque: m.marque.nom })} <Link href="/reponses?presence=oui&methode=api" className="surligne">{pluriel(cApi.k, 'réponse')}</Link> {t('sur {n}.', { n: cApi.n })}</>
        }
        verdict={
          m.releves.length === 0 ? t('Élargissez la période dans la barre du haut, ou lancez un relevé.')
          : cUi.n > 0 ? (
            <span className="text-[0.9375rem] text-[var(--encre-douce)]">
              {t('Interface, {n} IA, {dates}.', { n: interfaces.length, dates })}
              {cApi.n > 0 && <> {t('Claude (API), compté à part : {k} sur {n}.', { k: cApi.k, n: cApi.n })}</>}
              {vaguesUi <= 1 && <> {t('Un seul jour de relevé : un échantillon, pas encore une tendance.')}</>}
            </span>
          )
          : cApi.n > 0 ? t('Réponse du modèle seul, pas ce que voit un internaute. Aucun relevé d’interface sur cette sélection.')
          : t('{n} [n:réponse|réponses] en attente. Elles reviennent en quelques minutes.', { n: m.enAttente })
        }
      />

      <BandeauLecture projetId={m.projet.id} />

      {m.releves.length > 0 && (
        <>
          {/* ── Chiffres clés ─────────────────────────────────────────────── */}
          <section className="ecran" aria-label={t('Chiffres clés')}>
            <div className="tuiles" style={{ '--colonnes': 5 + (cApi.envoyes > 0 ? 1 : 0) } as React.CSSProperties}>
              <Tuile
                titre={t('Visibilité')}
                aide={<>{t('Part des réponses d’interface où la marque est nommée ou citée.')}{iUi && cUi.n >= SEUIL_CHIFFRE && <> {t('Marge d’erreur : entre {bas} et {haut}.', { bas: pct(iUi.bas), haut: pct(iUi.haut) })}</>} {t('L’écart compare à la période d’avant ; il n’est coloré que s’il dépasse la marge.')}</>}
                href="#graphique"
                ecart={cUi.n > 0 ? ecart(avantUi, cUi) : undefined}
                methode="interface"
                base={cUi.n > 0 ? t('{k} sur {n} [n:réponse|réponses]', { k: cUi.k, n: cUi.n }) : t('aucune réponse reçue')}
                tendance={<Tendance valeurs={tUi.valeurs} libelles={tUi.libelles} titre={t('Visibilité')} largeur={84} hauteur={24} court />}
              >
                {cUi.n >= SEUIL_CHIFFRE ? <Compteur valeur={Math.round((cUi.k / cUi.n) * 100)} suffixe=" %" /> : <TropTot seuil={SEUIL_CHIFFRE} />}
              </Tuile>
              <Tuile
                titre={t('Part de voix')}
                aide={t('Mentions de la marque rapportées à celles de la marque et des concurrents suivis. Sans concurrent suivi, elle ne se calcule pas.')}
                href="/concurrents"
                methode="interface"
                base={m.concurrents.length === 0 ? t('aucun concurrent suivi') : t('{k} sur {n} [n:mention|mentions]', { k: nous.reponses, n: marques.mentionsSuivies })}
              >
                {m.concurrents.length === 0 ? <span className="discret">{t('n.c.')}</span> : marques.mentionsSuivies >= SEUIL_CHIFFRE ? <Compteur valeur={Math.round((nous.reponses / marques.mentionsSuivies) * 100)} suffixe=" %" /> : <TropTot seuil={SEUIL_CHIFFRE} />}
              </Tuile>
              <Tuile
                titre={t('Rang moyen')}
                aide={t('Place moyenne de la marque parmi les marques nommées, dans les réponses où elle a un rang. Plus le chiffre est petit, mieux c’est.')}
                methode="interface"
                base={rang ? t('rang connu dans {n} [n:réponse|réponses]', { n: rang.n }) : t('jamais nommée avec un rang')}
              >
                {rang ? <Compteur valeur={Number(rang.moyenne.toFixed(1))} decimales={1} /> : <span className="discret">{t('n.c.')}</span>}
              </Tuile>
              <Tuile
                titre={t('Sources à nous')}
                aide={t('Nombre de fois où une page du site, une vidéo de la chaîne ou une page d’un profil de la marque est citée comme source par une IA d’interface.')}
                href="/sources?onglet=nos-pages"
                methode="interface"
                base={citationsProfils > 0 ? t('site {site} · YouTube {video} · réseaux {reseaux}', { site: citationsSite, video: citationsVideo, reseaux: citationsProfils }) : t('site {site} · YouTube {video}', { site: citationsSite, video: citationsVideo })}
              >
                <Compteur valeur={citationsSite + citationsVideo + citationsProfils} />
              </Tuile>
              <Tuile
                titre={t('Aperçus IA')}
                aide={t('Nombre de questions pour lesquelles Google affiche un Aperçu IA. Une question sans aperçu n’est pas une absence de la marque.')}
                href="/google"
                methode="interface"
                note={apercus.length ? t('sur {n}', { n: apercus.length }) : undefined}
                base={apercus.length ? t('{n} [n:relevé|relevés]', { n: apercus.reduce((n, a) => n + a.total, 0) }) : t('pas encore relevés')}
              >
                {apercus.length ? <Compteur valeur={apercus.filter((a) => a.affiches > 0).length} /> : <span className="discret">{t('n.c.')}</span>}
              </Tuile>
              {cApi.envoyes > 0 && (
                <Tuile
                  api
                  titre="Claude (API)"
                  aide={t('Visibilité dans les réponses de Claude, relevées par son API : la réponse du modèle seul, pas ce que voit un internaute. Jamais additionnée aux relevés d’interface.')}
                  href="/reponses?presence=oui&methode=api"
                  ecart={cApi.n > 0 ? ecart(avantApi, cApi) : undefined}
                  methode="api"
                  base={cApi.n > 0 ? t('{k} sur {n} [n:réponse|réponses]', { k: cApi.k, n: cApi.n }) : t('aucune réponse reçue')}
                  tendance={<Tendance valeurs={tApi.valeurs} libelles={tApi.libelles} titre={t('Visibilité chez Claude')} largeur={84} hauteur={24} court />}
                >
                  {cApi.n >= SEUIL_CHIFFRE ? <Compteur valeur={Math.round((cApi.k / cApi.n) * 100)} suffixe=" %" /> : <TropTot seuil={SEUIL_CHIFFRE} />}
                </Tuile>
              )}
            </div>
          </section>

          {/* ── Grand graphique et classement ─────────────────────────────── */}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <Feuille id="graphique" titre={t('Évolution, relevé après relevé')} droite={<LigneMethode methode="interface" n={cUi.n} unite="réponse" periode={periode} />}>
              <GrapheLignes
                titre={t('Évolution par IA d’interface')}
                mesures={mesuresDuGraphe(m)}
                reperes={reperesDuGraphe(m, 'interface', faites)}
                hauteur={320}
                csv={`geotrends-${m.projet.nom.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                optionPrecedente
                optionConcurrents
                lienConcurrents="/concurrents"
                vide={t('Aucune réponse d’interface sur cette période.')}
              />
            </Feuille>

            <Feuille
              titre={t('Marques les plus nommées')}
              aide={<>{t('Nombre de réponses d’interface qui nomment chaque marque, et part des réponses lues.')}{marques.nonLues > 0 && <> {t('{n} [n:réponse n’est|réponses ne sont] pas encore [n:lue|lues].', { n: marques.nonLues })}</>}</>}
              droite={<LigneMethode methode="interface" n={marques.base} unite="réponse lue" />}
            >
              {marques.base === 0 ? (
                <p className="second p-4">{t('Aucune réponse dont les marques sont connues pour l’instant.')}</p>
              ) : (
                <Classement
                  libelle={t('Marques les plus nommées')}
                  max={Math.max(...marques.lignes.map((l) => l.reponses), 1)}
                  lignes={[...autres.slice(0, 7).map((l) => ({ cle: l.cle, nom: l.nom, valeur: l.reponses, texte: `${l.reponses} · ${pct(l.reponses / marques.base)}`, href: `/reponses?marque=${encodeURIComponent(l.nom)}`, ecart: ecartMarque(l.cle, l.reponses) !== undefined ? <EcartLu e={ecartMarque(l.cle, l.reponses)!} /> : undefined })), { cle: 'nous', nom: nous.nom, valeur: nous.reponses, texte: `${nous.reponses} · ${pct(nous.reponses / marques.base)}`, nous: true, href: '/reponses?presence=oui&methode=interface', ecart: ecartMarque('nous', nous.reponses) !== undefined ? <EcartLu e={ecartMarque('nous', nous.reponses)!} /> : undefined }].sort((a, b) => b.valeur - a.valeur)}
                />
              )}
              <p className="border-t border-[var(--filet)] px-4 py-2.5"><Link href="/concurrents" className="lien-fleche">{t('Tout le classement')} <span aria-hidden="true">→</span></Link></p>
            </Feuille>
          </div>

          {/* ── Claude, mesuré par son API : toujours son propre graphique ─── */}
          {moteursApi.length > 0 && cApi.n > 0 && (
            <Feuille
              className="feuille-api"
              titre={t('Claude, mesuré par son API')}
              aide={t('Réponse du modèle seul, pas ce que voit un internaute. Sa courbe n’est jamais tracée avec celles de l’interface.')}
              droite={<LigneMethode methode="api" n={cApi.n} unite="réponse" periode={periode} />}
            >
              <Courbe titre={t('Visibilité chez Claude (API)')} points={courbeApi.points} series={courbeApi.series} reperes={reperesDuGraphe(m, 'api')} csv={`geotrends-${m.projet.nom.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-claude-api`} />
            </Feuille>
          )}

          {/* ── Alertes : seulement les écarts qui dépassent la marge d'erreur ── */}
          {rapport?.ui && (
            rapport.alertes.length > 0 ? (
              <Feuille
                titre={t('Alertes')}
                aide={t('Ce qui a changé entre les deux derniers relevés, quand l’écart dépasse la marge d’erreur. Le reste n’est pas signalé : ce serait du bruit. Les alertes ne dépendent pas des filtres de la barre du haut.')}
                droite={<span>{jourLong(deCleJour(rapport.ui.jourAvant))} → {jourLong(deCleJour(rapport.ui.jourApres))}</span>}
              >
                <ul>
                  {rapport.alertes.slice(0, 4).map((a, i) => (
                    <li key={a.cle} className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-4 py-2.5 ${i ? 'ligne-t' : ''}`}>
                      <span className={`chiffre font-semibold ${a.sens === 'hausse' ? 'text-[var(--vert)]' : 'text-[var(--absent-texte)]'}`} aria-hidden="true">{a.sens === 'hausse' ? '▲' : '▼'}</span>
                      <span className="min-w-0"><span className="font-semibold">{a.titre}</span><span className="second block">{a.detail}</span></span>
                      <Link href={a.lien} className="lien-fleche">{t('Voir')} <span aria-hidden="true">→</span></Link>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-[var(--filet)] px-4 py-2.5">
                  {rapport.alertes.length > 4 && <span className="second mr-3">{t('et {n} de plus.', { n: rapport.alertes.length - 4 })}</span>}
                  <Link href="/rapport" className="lien-fleche">{t('Tout ce qui a changé')} <span aria-hidden="true">→</span></Link>
                </p>
              </Feuille>
            ) : (
              <p className="second">
                <strong className="font-semibold text-[var(--encre)]">{t('Aucune alerte.')}</strong> {t('Entre le {avant} et le {apres}, aucun écart ne dépasse la marge d’erreur.', { avant: jourLong(deCleJour(rapport.ui.jourAvant)), apres: jourLong(deCleJour(rapport.ui.jourApres)) })} <Link href="/rapport" className="lien">{t('Voir le rapport')}</Link>
              </p>
            )
          )}

          {/* ── Tableau par IA ────────────────────────────────────────────── */}
          <Feuille titre={t('Présence, IA par IA')} aide={t('Une ligne par IA, jamais d’addition entre elles. Claude, mesuré par son API, est séparé par un filet double.')} droite={periode}>
            <TableauTriable
              libelle={t('Présence, IA par IA')}
              colonnes={[
                { libelle: t('IA') },
                { libelle: t('Méthode'), triable: false },
                { libelle: t('Relevés'), num: true, aide: t('Réponses reçues. Une question sans aperçu IA n’est pas comptée comme une absence.') },
                { libelle: t('Visibilité'), num: true },
                { libelle: t('Écart'), num: true, aide: t('Écart avec la période d’avant, coloré seulement au-delà de la marge d’erreur.') },
                { libelle: t('Rang moyen'), num: true },
                { libelle: t('Site cité'), num: true },
                { libelle: t('Vidéo citée'), num: true },
                { libelle: t('Nom seul'), num: true, aide: t('La marque est nommée dans le texte, sans qu’une de ses pages soit citée.') },
                { libelle: t('Lu, non cité'), num: true, aide: t('Une page de la marque a été lue par l’IA, sans être citée comme source.') },
                { libelle: t('Tendance'), triable: false },
              ]}
              lignes={parMoteur.map((x) => {
                const estApi = METHODE[x.moteur] === 'api'
                return {
                  cle: x.moteur,
                  classe: estApi ? 'a-part' : '',
                  tri: [nom(x.moteur), null, x.c.n, x.c.n >= SEUIL_CHIFFRE ? part(x.c.k, x.c.n) : null, x.e?.points ?? null, x.rang?.moyenne ?? null, x.site, x.video, x.nom, x.lues, null],
                  cellules: [
                    <span key="ia">
                      <span className="flex flex-wrap items-center gap-2">
                        <Link href={`/reponses?ia=${x.moteur}`} className="ligne-lien font-semibold">{nom(x.moteur)}</Link>
                        {departage && forte === x && <span className="pastille nomme">{t('la plus forte')}</span>}
                        {departage && faible === x && <span className="pastille absent">{t('la plus faible')}</span>}
                      </span>
                      {x.modeles.length > 0 && <span className="second discret chiffre block font-normal">{x.modeles.join(', ')}</span>}
                    </span>,
                    <Tampon key="m" methode={estApi ? 'api' : 'interface'} />,
                    <span key="n">{x.c.n}{x.c.envoyes !== x.c.n && <span className="discret"> / {x.c.envoyes}</span>}{x.c.vides > 0 && <span className="second discret block">{t('{n} sans aperçu', { n: x.c.vides })}</span>}</span>,
                    x.c.n >= SEUIL_CHIFFRE ? <span key="v"><Link href={`/reponses?ia=${x.moteur}&presence=oui`} className="ligne-lien font-semibold">{pct(part(x.c.k, x.c.n))}</Link><span className="second discret block">{t('{k} sur {n}', { k: x.c.k, n: x.c.n })}</span></span> : x.c.n > 0 ? <span key="v" className="second">{t('{k} sur {n}', { k: x.c.k, n: x.c.n })}</span> : '',
                    x.c.n > 0 ? <EcartLu key="e" e={x.e} vide="—" /> : '',
                    x.rang ? un(x.rang.moyenne) : <span key="r" className="discret">{t('n.c.')}</span>,
                    x.site,
                    x.video,
                    x.nom,
                    x.lues,
                    <Tendance key="t" valeurs={x.t.valeurs} libelles={x.t.libelles} titre={t('Visibilité, {ia}', { ia: nomCourt(x.moteur) })} largeur={96} hauteur={26} court />,
                  ],
                }
              })}
            />
          </Feuille>

          {/* ── Barres découpées ──────────────────────────────────────────── */}
          <div className="grid gap-6 xl:grid-cols-2">
            <Feuille titre={t('D’où vient la visibilité')} aide={t('Parmi les réponses où la marque apparaît : par une page de son site citée, par une vidéo de sa chaîne citée, ou par son seul nom dans le texte.')} droite={<LigneMethode methode="interface" n={presents.length} unite="réponse avec la marque" />}>
              <div className="p-4">
                {presents.length === 0 ? (
                  <p className="second">{t('La marque n’apparaît dans aucune réponse d’interface sur cette période : rien à répartir.')}</p>
                ) : (
                  <Decoupe
                    libelle={t('D’où vient la visibilité')}
                    unite={t('réponses')}
                    segments={[
                      { cle: 'site', libelle: t('Par le site'), n: parSite, teinte: 'teinte-encre' },
                      { cle: 'chaine', libelle: t('Par la chaîne YouTube'), n: parChaine, teinte: 'teinte-nous' },
                      { cle: 'nom', libelle: t('Par le seul nom'), n: parNom, teinte: 'teinte-papier' },
                    ]}
                  />
                )}
              </div>
            </Feuille>
            <Feuille titre={t('À qui profitent les citations')} aide={t('Répartition des sources citées par les IA d’interface : la marque, ses concurrents, les autres marques, les sites tiers par type.')} droite={<LigneMethode methode="interface" n={sources.citations} unite="citation" />}>
              <div className="p-4">
                {sources.citations === 0 ? (
                  <p className="second">{t('Aucune source citée sur cette période.')}</p>
                ) : (
                  <>
                    <Decoupe
                      libelle={t('À qui profitent les citations')}
                      unite={t('citations')}
                      segments={sources.repartition.map((r) => ({ cle: r.cle, libelle: t(r.libelle), n: r.n, teinte: teinteDePart(r), href: `/sources?qui=${encodeURIComponent(r.cle)}` }))}
                    />
                    {sources.aClasser > 0 && <p className="second mt-3">{t('{n} [n:site cité n’est pas encore classé|sites cités ne sont pas encore classés] : à lancer depuis l’écran Sources.', { n: sources.aClasser })}</p>}
                    <p className="mt-3"><Link href="/sources" className="lien-fleche">{t('Toutes les sources')} <span aria-hidden="true">→</span></Link></p>
                  </>
                )}
              </div>
            </Feuille>
          </div>

          {tons > 0 && (
            <Feuille titre={t('Le ton employé pour {marque}', { marque: m.marque.nom })} aide={t('Ton relevé par l’analyse automatique dans chaque réponse qui nomme la marque.')} droite={<LigneMethode methode="interface" n={tons} unite="mention lue" />}>
              <div className="p-4">
                <Decoupe
                  libelle={t('Ton employé')}
                  unite={t('mentions')}
                  segments={[
                    { cle: 'positif', libelle: t('Positif (recommandée)'), n: nous.positifs, teinte: 'teinte-vert' },
                    { cle: 'neutre', libelle: t('Neutre (simplement citée)'), n: nous.neutres, teinte: 'teinte-papier' },
                    { cle: 'negatif', libelle: t('Négatif (déconseillée)'), n: nous.negatifs, teinte: 'teinte-concurrent' },
                  ]}
                />
              </div>
            </Feuille>
          )}

          {/* ── Grille questions × IA ─────────────────────────────────────── */}
          <Feuille titre={t('Couverture : question par IA')} aide={t('Le dernier relevé de chaque IA pour chaque question. Un clic sur un carreau ouvre la réponse.')} droite={t('{n} [n:question|questions]', { n: m.questions.length })}>
            <div className="defile">
              <table className="tableau dense">
                <thead>
                  <tr>
                    <th scope="col" className="fixe">{t('Question')}</th>
                    {m.moteurs.map((x) => <th key={x} scope="col" className={METHODE[x] === 'api' ? 'api' : ''}><TeteMoteur moteur={x} /></th>)}
                    <th scope="col" className="num">{t('Couverture')}</th>
                  </tr>
                </thead>
                <tbody>
                  {m.questions.map((q) => {
                    const d = derniersParMoteur(q.releves)
                    const lus = interfaces.filter((x) => d.get(x)?.statut === 'recu')
                    const la = lus.filter((x) => d.get(x)!.present)
                    return (
                      <tr key={q.id}>
                        <th scope="row" className="fixe max-w-[13rem] sm:max-w-[24rem]"><Link href={`/questions/${q.id}`} className="ligne-lien line-clamp-1" title={q.texte}>{q.texte}</Link></th>
                        {m.moteurs.map((x) => {
                          const r = d.get(x)
                          const tous = deMoteur(q.releves, x).filter((y) => y.statut === 'recu')
                          return (
                            <td key={x} className={METHODE[x] === 'api' ? 'api' : ''}>
                              {r ? <Link href={`/questions/${q.id}?ia=${x}#reponses`} aria-label={t('{ia} : ouvrir la réponse', { ia: nomCourt(x) })}><Carreau etat={r.etat} /></Link> : <Carreau etat={null} />}
                              {tous.length > 1 && <span className="second chiffre ml-2">{tous.filter((y) => y.present).length}/{tous.length}</span>}
                            </td>
                          )
                        })}
                        <td className="num">{lus.length ? `${la.length}/${lus.length}` : <span className="discret">{t('n.c.')}</span>}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[var(--filet)] px-4 py-3"><LegendeEtats carreaux /></div>
          </Feuille>

          {/* ── Deux listes ───────────────────────────────────────────────── */}
          <div className="grid gap-6 xl:grid-cols-2">
            <Feuille titre={t('Nommés à notre place')} aide={t('Les autres marques nommées par les IA d’interface. « Suivre » en fait un concurrent : gratuit, cela ne lance aucun relevé.')} droite={<LigneMethode methode="interface" n={marques.base} unite="réponse lue" />}>
              {autres.length === 0 ? (
                <p className="second p-4">{t('Aucune autre marque repérée pour l’instant.')}</p>
              ) : (
                <ul>
                  {autres.slice(0, 5).map((l, i) => (
                    <li key={l.cle} className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 ${i ? 'ligne-t' : ''}`}>
                      <span className="min-w-0">
                        <NomMarque nom={l.nom} href={`/reponses?marque=${encodeURIComponent(l.nom)}`} />
                        <span className="second block pl-8">{pluriel(l.reponses, 'réponse')} · {l.premiere > 0 ? t('{n} fois en premier', { n: l.premiere }) : t('jamais en premier')}{l.rangMoyen ? ` · ${t('rang moyen {rang}', { rang: un(l.rangMoyen) })}` : ''}</span>
                      </span>
                      {l.suivie ? <span className="pastille neutre">{t('Suivie')}</span> : (
                        <form action={suivreMarque}>
                          <input type="hidden" name="nom" value={l.nom} />
                          <button type="submit" className="bouton bouton-creux bouton-petit" aria-label={t('Suivre {nom} comme concurrent', { nom: l.nom })}>{t('Suivre')}</button>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <p className="border-t border-[var(--filet)] px-4 py-2.5"><Link href="/concurrents" className="lien-fleche">{t('Tous les concurrents')} <span aria-hidden="true">→</span></Link></p>
            </Feuille>
            <Feuille titre={t('Les sites que les IA citent')} aide={t('Les sites le plus souvent cités comme sources par les IA d’interface, avec leur type.')} droite={<LigneMethode methode="interface" n={sources.base} unite="réponse" />}>
              {sources.domaines.length === 0 ? (
                <p className="second p-4">{t('Aucune source citée sur cette période.')}</p>
              ) : (
                <Classement
                  libelle={t('Les sites que les IA citent')}
                  lignes={sources.domaines.filter((d) => d.reponses.size > 0).slice(0, 6).map((d) => ({ cle: d.domaine, nom: d.domaine, valeur: d.reponses.size, texte: pluriel(d.reponses.size, 'réponse'), nous: d.qui === 'nous', href: `/sources?fiche=${encodeURIComponent(d.domaine)}`, note: t(typeEcrit(d.type, d.qui)) }))}
                />
              )}
              <p className="border-t border-[var(--filet)] px-4 py-2.5"><Link href="/sources" className="lien-fleche">{t('Toutes les sources')} <span aria-hidden="true">→</span></Link></p>
            </Feuille>
          </div>

          {/* ── À faire cette semaine ─────────────────────────────────────── */}
          <Feuille titre={t('À faire cette semaine')} droite={t('{n} à faire ou en cours', { n: travail.length })}>
            {travail.length === 0 ? (
              <p className="second p-4">{t('Rien à proposer pour l’instant. La liste se remplit après chaque relevé.')}</p>
            ) : (
              <ol>
                {travail.slice(0, 3).map((l, i) => (
                  <li key={l.cle} className={`grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-start gap-3 px-4 py-3 ${i ? 'ligne-t' : ''}`}>
                    <span className="nb text-[var(--encre-pale)]">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <Link href={`/actions?action=${encodeURIComponent(l.cle)}`} className="font-semibold hover:underline">{l.titre}</Link>
                      <span className="second mt-0.5 block">
                        {t('Preuve')} : {l.nbReponses ? `${pluriel(l.nbReponses, 'réponse')}${l.nbMoteurs ? `, ${pluriel(l.nbMoteurs, 'IA', 'IA')}` : ''} · ` : ''}
                        <Link href={`/questions/${l.preuves[0]?.id}`} className="lien">{l.preuves[0]?.texte}</Link>
                        {l.preuves.length > 1 && ` ${t('et {n} [n:autre question|autres questions]', { n: l.preuves.length - 1 })}`}
                      </span>
                    </span>
                    <span className={`pastille ${l.etat === 'en_cours' ? 'cite' : 'neutre'}`}>{l.etat === 'en_cours' ? t('En cours') : t('À faire')}</span>
                  </li>
                ))}
              </ol>
            )}
            <p className="border-t border-[var(--filet)] px-4 py-2.5"><Link href="/actions" className="lien-fleche">{t('Toute la liste de travail')} <span aria-hidden="true">→</span></Link></p>
          </Feuille>

          {/* ── Dernières réponses ────────────────────────────────────────── */}
          <Feuille titre={t('Dernières réponses')} droite={<Link href="/reponses" className="underline">{t('Toutes les réponses')}</Link>}>
            <ListeReponses releves={dernieres} vide={t('Aucune réponse reçue sur cette période.')} />
          </Feuille>

          <CommentLire>
            <ul>
              <li>{t('Chaque chiffre porte sa méthode (interface ou API) et son nombre de réponses. Les deux méthodes ne sont jamais additionnées.')}</li>
              <li>{t('Une réponse d’IA est un échantillon : la même question donne des réponses différentes d’un essai à l’autre. Un écart n’est coloré que s’il dépasse la marge d’erreur.')}</li>
              <li>{t('Sur le graphique, un point vaut un jour de relevé. Les segments sont droits, jamais lissés ; un jour sans relevé laisse un trou, pas un zéro.')}</li>
              <li>{t('Une question pour laquelle Google n’affiche pas d’Aperçu IA n’est pas comptée comme une absence de la marque.')}</li>
            </ul>
          </CommentLire>
        </>
      )}
    </div>
  )
}
