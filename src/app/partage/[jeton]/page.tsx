import { Gloock, Hanken_Grotesk } from 'next/font/google'
import { EtatLu, Feuille, LigneMethode, Tampon, TeteMoteur, VerdictLu } from '@/components/outil/Blocs'
import { Courbe, Tendance } from '@/components/graphiques/Graphiques'
import { courbe } from '@/lib/courbes'
import { FournisseurLangue } from '@/lib/i18n/client'
import { fixerLangue } from '@/lib/i18n/courante'
import { estLangue, type Langue } from '@/lib/i18n/langues'
import { creerTraducteur } from '@/lib/i18n/traduire'
import { dateHeure, jourLong, langueEtPays, nomCourt, pct } from '@/lib/libelles'
import { deMoteur, SEUIL_CHIFFRE } from '@/lib/mesures'
import { compterVue, contenuDuPartage, etatDuLien, extrait, trouverPartage } from '@/lib/partages'
import { lireSession } from '@/lib/session'
import { LogoSite, Signe } from '@/site/composants/LogoSite'
// Les feuilles de l'outil : la page reprend ses briques (feuilles, pastilles, tampons, courbes).
import '../../vitrine.css'
import '../../(app)/outil.css'
import '../../(app)/interface.css'

const titre = Gloock({ subsets: ['latin'], weight: '400', variable: '--font-titre' })
const corps = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-corps' })

export const dynamic = 'force-dynamic'

const langueDe = (l: string): Langue => (estLangue(l) ? l : 'fr')

export async function generateMetadata({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params
  const p = await trouverPartage(jeton)
  const t = creerTraducteur(langueDe(p?.langue ?? 'fr'))
  return {
    title: p && etatDuLien(p) === 'actif' ? `${p.titre} · GeoTrends` : `${t('Lien de partage')} · GeoTrends`,
    robots: { index: false, follow: false, nocache: true },
    referrer: 'no-referrer' as const,
  }
}

/**
 * Page de partage : ce qu'un client ou un partenaire voit, sans compte, d'une
 * série de questions d'un projet. Rien d'autre : ni les autres questions, ni les
 * coûts, ni le menu de l'outil. Chiffres lus en direct, à chaque ouverture.
 */
export default async function PagePartage({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params
  const partage = await trouverPartage(jeton)
  const langue = langueDe(partage?.langue ?? 'fr')
  // La page parle la langue choisie pour le partage, quel que soit le navigateur.
  fixerLangue(langue)
  const t = creerTraducteur(langue)
  const etat = partage ? etatDuLien(partage) : null
  const contenu = partage && etat === 'actif' ? await contenuDuPartage(partage) : null
  // Une ouverture compte quand elle ne vient pas de quelqu'un de connecté à l'outil.
  if (partage && contenu && !(await lireSession().catch(() => null))) await compterVue(partage.id)

  const cadre = (enfants: React.ReactNode) => (
    <div className={`site outil ${titre.variable} ${corps.variable}`} lang={langue}>
      <FournisseurLangue langue={langue}>{enfants}</FournisseurLangue>
    </div>
  )

  if (!partage || !contenu) {
    return cadre(
      <main className="connexion">
        <div className="connexion-feuille">
          <LogoSite taille={30} />
          <div className="regle mt-6" aria-hidden="true" />
          <h1 className="titre-page mt-6">{t('Ce lien n’est plus actif')}</h1>
          <p className="mt-2 text-[var(--encre-douce)]">
            {etat === 'expire' ? t('Sa date de fin est passée.') : etat === 'coupe' ? t('La personne qui l’a partagé l’a coupé.') : t('Il n’existe pas, ou il a été remplacé.')}{' '}
            {t('Demandez un nouveau lien à la personne qui vous l’a envoyé.')}
          </p>
        </div>
      </main>,
    )
  }

  const { marque, projet, resumes, questions, moteurs } = contenu
  const ui = resumes.filter((r) => r.methode === 'interface')
  const api = resumes.filter((r) => r.methode === 'api')
  const kUi = ui.reduce((s, r) => s + r.k, 0)
  const nUi = ui.reduce((s, r) => s + r.n, 0)
  const courbeUi = courbe(ui.map((r) => ({ cle: r.moteur, nom: nomCourt(r.moteur), releves: deMoteur(contenu.releves, r.moteur) })))
  const courbeApi = courbe(api.map((r) => ({ cle: r.moteur, nom: `${nomCourt(r.moteur)} (API)`, releves: deMoteur(contenu.releves, r.moteur), pointille: true })))
  const periode = contenu.premier && contenu.dernier ? t('du {debut} au {fin}', { debut: jourLong(contenu.premier), fin: jourLong(contenu.dernier) }) : t('aucune réponse pour l’instant')

  return cadre(
    <div className="partage-page mx-auto max-w-[76rem] px-4 pb-16 pt-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <LogoSite taille={26} />
        <span className="etiquette">{t('Lien privé · ne le transférez qu’aux personnes concernées')}</span>
      </header>

      <header className="tete-ecran">
        <p className="etiquette">{t('Visibilité dans les réponses des IA')} · {langueEtPays(projet.langue, projet.pays)}</p>
        <h1 className="titre-page mt-1">{partage.titre}</h1>
        <p className="phrase">
          {nUi > 0
            ? t('{marque} est nommée ou citée dans {k} [k:réponse|réponses] sur {n} relevées dans l’interface des IA, sur {q} [q:question|questions].', { marque: marque.nom, k: kUi, n: nUi, q: questions.length })
            : t('Pas encore de réponse relevée dans l’interface des IA pour ces questions.')}
        </p>
        <p className="largeur-lecture mt-2 text-[var(--encre-douce)]">
          {partage.destinataire ? `${t('Pour {qui}.', { qui: partage.destinataire })} ` : ''}
          {partage.auteur ? `${t('Préparé par {qui}.', { qui: partage.auteur })} ` : ''}
          {t('Réponses relevées {periode}, mises à jour à chaque nouveau relevé. Dernière mise à jour : {date}.', { periode, date: contenu.dernier ? dateHeure(contenu.dernier) : t('aucune') })}
        </p>
        <div className="regle mt-4" aria-hidden="true" />
      </header>

      {/* ── Chiffres, IA par IA ─────────────────────────────────────────────── */}
      <section className="ecran mt-6" aria-label={t('Chiffres, IA par IA')}>
        <div className="tuiles" style={{ '--colonnes': Math.max(1, resumes.length) } as React.CSSProperties}>
          {resumes.map((r) => (
            <div key={r.moteur} className={`tuile ${r.methode === 'api' ? 'api' : ''}`}>
              <div className="tuile-tete"><p className="etiquette"><TeteMoteur moteur={r.moteur} /></p></div>
              <div className="tuile-valeur">
                <div className="grand-chiffre">{r.n >= SEUIL_CHIFFRE ? pct(r.k / r.n) : r.n > 0 ? t('{k} sur {n}', { k: r.k, n: r.n }) : '—'}</div>
                {r.n >= SEUIL_CHIFFRE && r.bas !== null && r.haut !== null && (
                  <span className="second">{t('entre {bas} et {haut}', { bas: pct(r.bas), haut: pct(r.haut) })}</span>
                )}
                {r.points.length >= 2 && (
                  <div className="tuile-tendance">
                    <Tendance titre={nomCourt(r.moteur)} valeurs={r.points.map((p) => (p.k / p.n) * 100)} libelles={r.points.map((p) => p.jour)} />
                  </div>
                )}
              </div>
              <p className="tuile-pied">
                <Tampon methode={r.methode} />
                <span>{t('{k} sur {n} [n:réponse|réponses]', { k: r.k, n: r.n })}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
      <p className="second mt-2">
        {t('Part des réponses où la marque est nommée ou citée parmi les sources. En dessous de {seuil} réponses, le compte est donné tel quel : un pourcentage serait trompeur. « Entre … et … » : la marge d’erreur à 95 %.', { seuil: SEUIL_CHIFFRE })}
      </p>

      {/* ── Évolution ───────────────────────────────────────────────────────── */}
      {(courbeUi.points.length >= 2 || courbeApi.points.length >= 2) && (
        <div className="mt-6 grid gap-6">
          {courbeUi.points.length >= 2 && (
            <Feuille titre={t('Évolution, relevé après relevé')} droite={<LigneMethode methode="interface" n={nUi} unite="réponse" />}>
              <Courbe titre={t('Évolution, relevé après relevé')} points={courbeUi.points} series={courbeUi.series} />
            </Feuille>
          )}
          {courbeApi.points.length >= 2 && (
            <Feuille titre={t('Claude, par son API')} droite={<LigneMethode methode="api" n={api.reduce((s, r) => s + r.n, 0)} unite="réponse" />}>
              <Courbe titre={t('Claude, par son API')} points={courbeApi.points} series={courbeApi.series} />
            </Feuille>
          )}
        </div>
      )}

      {/* ── Question par question ───────────────────────────────────────────── */}
      <h2 className="titre mt-10 text-[1.75rem]">{t('Question par question')}</h2>
      <p className="second mt-1 largeur-lecture">{t('Pour chaque IA : sa dernière réponse, le bilan de toutes ses réponses à cette question, puis les pages qu’elle cite. Les pages de la marque sont surlignées.')}</p>
      <ol className="mt-4 grid gap-6">
        {questions.map((q, i) => (
          <li key={q.id}>
            <Feuille titre={<><span className="chiffre mr-2">{String(i + 1).padStart(2, '0')}</span>{q.texte}</>}>
              <ul>
                {q.lignes.map((l, j) => {
                  const lu = l.dernier?.statut === 'recu' ? l.dernier : null
                  const texte = partage.reponses && lu ? extrait(lu.texte) : ''
                  return (
                    <li key={l.moteur} className={`px-4 py-3 ${j ? 'ligne-t' : ''}`}>
                      <div className="grid gap-x-6 gap-y-2 md:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1.2fr)]">
                        <div>
                          <p className="font-semibold"><TeteMoteur moteur={l.moteur} /></p>
                          <p className="second">{l.dernier ? jourLong(l.dernier.releveLe ?? l.dernier.createdAt) : t('pas encore relevée')}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {l.dernier ? <EtatLu r={l.dernier} /> : <span className="second">—</span>}
                          {l.n > 1 && (
                            <span className="flex items-center gap-2">
                              <VerdictLu v={l.verdict} />
                              <span className="second">{t('{k} sur {n} [n:réponse|réponses]', { k: l.k, n: l.n })}</span>
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          {l.sources.length > 0 ? (
                            <ul className="flex flex-wrap gap-1.5" aria-label={t('Pages citées')}>
                              {l.sources.map((s) => (
                                <li key={s.url}>
                                  <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className={`source-partage ${s.nous ? 'nous' : ''}`} title={s.titre ?? s.url}>
                                    {s.domaine}{s.lue ? ` · ${t('lue')}` : ''}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            lu && <span className="second">{t('Aucune page citée')}</span>
                          )}
                          {partage.concurrents && l.marques.length > 0 && (
                            <p className="second mt-1.5">
                              {t('Marques nommées')}{' : '}
                              {l.marques.map((x, k) => (
                                <span key={x.nom}>{k ? ', ' : ''}<span className={x.nous ? 'surligne font-semibold text-[var(--encre)]' : ''}>{x.nom}</span></span>
                              ))}
                            </p>
                          )}
                        </div>
                      </div>
                      {texte && (
                        <blockquote className="extrait-partage mt-2">
                          <span className="etiquette mb-1 block">{t('Extrait de la réponse')}</span>
                          {texte}
                        </blockquote>
                      )}
                    </li>
                  )
                })}
              </ul>
            </Feuille>
          </li>
        ))}
      </ol>

      {/* ── Méthode ─────────────────────────────────────────────────────────── */}
      <Feuille className="mt-10" titre={t('Comment ces chiffres sont mesurés')}>
        <div className="largeur-lecture space-y-2 p-4 text-[0.9375rem]">
          {ui.length > 0 && (
            <p>
              <Tampon methode="interface" />{' '}
              {t('{ia} : chaque question est posée dans l’interface de l’IA, depuis {marche}, comme le ferait un internaute. On relève la réponse affichée et ses sources.', { ia: ui.map((r) => nomCourt(r.moteur)).join(', '), marche: langueEtPays(projet.langue, projet.pays) })}
            </p>
          )}
          {api.length > 0 && (
            <p>
              <Tampon methode="api" />{' '}
              {t('Claude est interrogé par son API, avec la recherche sur le web. Ses chiffres sont toujours donnés à part, jamais additionnés aux autres.')}
            </p>
          )}
          <p>{t('Une réponse d’IA est un échantillon : la même question peut recevoir une autre réponse le lendemain. C’est pourquoi chaque chiffre donne son nombre de réponses, et pourquoi une tendance compte plus qu’un relevé isolé.')}</p>
          <p>{t('« Citée » : une page ou une vidéo de la marque figure parmi les sources. « Nommée » : le nom de la marque est dans la réponse. « Lue » : l’IA a lu une page de la marque sans la citer.')}</p>
          {moteurs.length === 0 && <p>{t('Aucune IA n’a encore été relevée pour ces questions.')}</p>}
        </div>
      </Feuille>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--filet)] pt-4">
        <span className="flex items-center gap-2 text-[0.875rem]"><Signe taille={18} /> {t('Mesuré avec GeoTrends')}</span>
        <a href="https://geotrends.io" className="lien text-[0.875rem]">geotrends.io</a>
      </footer>
    </div>,
  )
}
