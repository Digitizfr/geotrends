import Link from 'next/link'
import { Courbe } from '@/components/graphiques/Graphiques'
import { BandeauLecture } from '@/components/outil/BandeauLecture'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { adresse, Choix, Classement, CommentLire, EcartLu, EnTete, Feuille, LigneMethode, NomMarque, TeteMoteur, Vide } from '@/components/outil/Blocs'
import { TableauTriable } from '@/components/outil/TableauTriable'
import { classerMarques, premierNomme, type LigneMarque } from '@/lib/classements'
import { exigerMesures, titreOnglet } from '@/lib/contexte'
import { courbe } from '@/lib/courbes'
import { libellePeriode } from '@/lib/filtres'
import { traducteur } from '@/lib/i18n/serveur'
import { nombre, nomCourt, ordinal, pct } from '@/lib/libelles'
import { deMethode, derniersParMoteur, ecart, METHODE, simple } from '@/lib/mesures'
import { ignorerMarque, suivreMarque } from '../_actions/suivi'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Concurrents')

type Params = { grille?: string; face?: string; q?: string; ignorees?: string }

export default async function Concurrents({ searchParams }: { searchParams: Promise<Params> }) {
  const t = await traducteur()
  const [m, sp] = await Promise.all([exigerMesures(), searchParams])
  const decimal = (n: number | null) => (n === null ? t('n.c.') : nombre(n, 1))
  const periode = libellePeriode(m.filtres.periode)
  const ui = deMethode(m.releves, 'interface').filter((r) => r.statut === 'recu')
  const lues = ui.filter((r) => r.marquesLues)
  const c = classerMarques(m)
  const avant = classerMarques(m, m.precedents)
  const nous = c.lignes.find((l) => l.aNous)!
  const suivies = c.lignes.filter((l) => l.suivie)
  const classement = [...suivies, nous].sort((a, b) => b.reponses - a.reponses || a.nom.localeCompare(b.nom))
  const reperees = c.lignes.filter((l) => !l.aNous && !l.suivie && l.reponses + l.api > 0)
  const visibles = reperees.filter((l) => (sp.ignorees === '1' ? l.ignoree : !l.ignoree))
  const interfaces = m.moteurs.filter((x) => METHODE[x] === 'interface')
  const lien = (change: Record<string, string | undefined>) => adresse('/concurrents', sp, change)
  const evolution = (l: LigneMarque) => {
    const a = avant.lignes.find((x) => x.cle === l.cle)
    return ecart({ k: a?.reponses ?? 0, n: avant.base }, { k: l.reponses, n: c.base })
  }
  const presentDans = (l: LigneMarque) => {
    const ids = new Set(l.releveIds)
    return (r: { id: string }) => ids.has(r.id)
  }

  // Courbe : nous et les cinq premiers (suivis d'abord, sinon les plus nommés).
  const compares = (suivies.length ? suivies : reperees.filter((l) => !l.ignoree)).filter((l) => l.reponses > 0).slice(0, 5)
  const donneesCourbe = courbe([
    { cle: 'nous', nom: nous.nom, releves: lues, present: presentDans(nous) },
    ...compares.map((l) => ({ cle: l.cle, nom: l.nom, releves: lues, present: presentDans(l) })),
  ])

  // Grille questions × IA.
  const vue = sp.grille === 'premier' || sp.grille === 'face' ? sp.grille : 'nous'
  const rival = vue === 'face' ? (suivies.find((l) => l.cle === sp.face) ?? suivies[0] ?? compares[0]) : undefined
  const rangDe = (r: { marques: { nom: string }[] }, l: LigneMarque) => {
    const i = r.marques.findIndex((x) => (l.cle.startsWith('c:') ? simple(x.nom).includes(l.cle.slice(2)) : simple(x.nom) === l.cle))
    return i < 0 ? null : i + 1
  }

  // Face-à-face : nous et quatre concurrents au plus.
  const colonnes = [nous, ...(suivies.length ? suivies : compares).filter((l) => !l.aNous).slice(0, 4)]
  const mesures: { cle: string; libelle: string; valeur: (l: LigneMarque) => number | null; texte: (l: LigneMarque) => string; mieux: 'haut' | 'bas' }[] = [
    { cle: 'vis', libelle: t('Nommée dans (part des réponses lues)'), valeur: (l) => (c.base ? l.reponses / c.base : null), texte: (l) => (c.base ? `${pct(l.reponses / c.base)} · ${t('{k} sur {n}', { k: l.reponses, n: c.base })}` : t('n.c.')), mieux: 'haut' },
    { cle: 'premiere', libelle: t('Nommée en premier'), valeur: (l) => l.premiere, texte: (l) => t('{n} fois', { n: l.premiere }), mieux: 'haut' },
    { cle: 'rang', libelle: t('Rang moyen quand nommée'), valeur: (l) => l.rangMoyen, texte: (l) => decimal(l.rangMoyen), mieux: 'bas' },
    { cle: 'questions', libelle: t('Questions où elle apparaît'), valeur: (l) => l.questions.size, texte: (l) => t('{k} sur {n}', { k: l.questions.size, n: m.questions.length }), mieux: 'haut' },
    { cle: 'ia', libelle: t('IA d’interface qui la nomment'), valeur: (l) => l.moteurs.size, texte: (l) => t('{k} sur {n}', { k: l.moteurs.size, n: interfaces.length }), mieux: 'haut' },
    { cle: 'ton', libelle: t('Mentions positives'), valeur: (l) => (l.positifs + l.negatifs + l.neutres > 0 ? l.positifs : null), texte: (l) => (l.positifs + l.negatifs + l.neutres > 0 ? t('{k} sur {n}', { k: l.positifs, n: l.positifs + l.negatifs + l.neutres }) : t('ton pas encore lu')), mieux: 'haut' },
  ]

  const blocReperees = (
    <Feuille
      id="reperees"
      titre={sp.ignorees === '1' ? t('Marques écartées') : t('Marques repérées, pas encore suivies')}
      droite={<LigneMethode methode="interface" n={c.base} unite="réponse lue" periode={periode} />}
      aide={t('Les marques que les IA nomment sur vos questions. « Suivre » en fait un concurrent du projet : elle entre dans le classement et la part de voix. « Ignorer » la retire de cette liste, sans rien changer aux chiffres.')}
    >
      <TableauTriable
        libelle={t('Marques repérées')}
        recherche={t('Chercher une marque')}
        vide={c.base === 0 ? t('Aucune réponse dont les marques sont connues pour l’instant.') : sp.ignorees === '1' ? t('Aucune marque écartée.') : t('Aucune marque à proposer.')}
        outils={<Link href={lien({ ignorees: sp.ignorees === '1' ? undefined : '1' })} scroll={false} className="lien text-[0.8125rem]">{sp.ignorees === '1' ? t('Revenir aux marques repérées') : t('Voir les marques écartées ({n})', { n: reperees.filter((l) => l.ignoree).length })}</Link>}
        triInitial={{ colonne: 1, sens: 'desc' }}
        colonnes={[
          { libelle: t('Marque') },
          { libelle: t('Réponses'), num: true, aide: t('Réponses d’interface qui nomment la marque, et leur part des réponses lues.') },
          { libelle: t('En premier'), num: true },
          { libelle: t('Rang moyen'), num: true },
          { libelle: t('Questions'), num: true },
          { libelle: 'Claude (API)', num: true, api: true },
          { libelle: <span className="invisible-lecteur">{t('Suivre ou ignorer')}</span>, texte: t('Action'), triable: false },
        ]}
        lignes={visibles.map((l) => ({
          cle: l.cle,
          recherche: `${l.nom} ${l.description ?? ''}`,
          tri: [l.nom, l.reponses, l.premiere, l.rangMoyen, l.questions.size, l.api, null],
          panneau: {
            sousTitre: t('Marque repérée'),
            titre: l.nom,
            contenu: (
              <>
                {l.description && <p className="text-[var(--encre-douce)]">{l.description}</p>}
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div><dt className="sous-titre">{t('Réponses')}</dt><dd className="chiffre mt-0.5">{l.reponses} · {pct(c.base ? l.reponses / c.base : null)}</dd></div>
                  <div><dt className="sous-titre">{t('En premier')}</dt><dd className="chiffre mt-0.5">{t('{n} fois', { n: l.premiere })}</dd></div>
                  <div><dt className="sous-titre">{t('Rang moyen')}</dt><dd className="chiffre mt-0.5">{decimal(l.rangMoyen)}</dd></div>
                  <div><dt className="sous-titre">{t('IA')}</dt><dd className="mt-0.5">{[...l.moteurs].map(nomCourt).join(', ') || t('aucune')}</dd></div>
                </dl>
                <div>
                  <p className="sous-titre bloc-titre">{t('Questions où elle est nommée')} <span className="chiffre">({l.questions.size})</span></p>
                  <ul className="mt-1">
                    {[...l.questions.entries()].map(([id, texte], i) => <li key={id} className={`py-1 ${i ? 'ligne-t' : ''}`}><Link href={`/questions/${id}`} className="hover:underline">{texte}</Link></li>)}
                  </ul>
                </div>
                <p><Link href={`/reponses?marque=${encodeURIComponent(l.nom)}`} className="lien-fleche">{t('Voir les réponses qui la nomment')} <span aria-hidden="true">→</span></Link></p>
              </>
            ),
          },
          cellules: [
            <span key="n"><NomMarque nom={l.nom} href={`/reponses?marque=${encodeURIComponent(l.nom)}`} />{l.description && <span className="second discret block max-w-[22rem] truncate pl-8 font-normal">{l.description}</span>}</span>,
            <span key="r">{l.reponses}<span className="discret"> · {pct(c.base ? l.reponses / c.base : null)}</span></span>,
            l.premiere,
            decimal(l.rangMoyen),
            l.questions.size,
            l.api || '',
            sp.ignorees === '1' ? (
              <form key="a" action={ignorerMarque}><input type="hidden" name="nom" value={l.cle} /><input type="hidden" name="remettre" value="1" /><button type="submit" className="bouton bouton-creux bouton-petit">{t('Remettre')}</button></form>
            ) : (
              <span key="a" className="inline-flex items-center gap-2 whitespace-nowrap">
                <form action={suivreMarque}><input type="hidden" name="nom" value={l.nom} /><button type="submit" className="bouton bouton-creux bouton-petit" aria-label={t('Suivre {nom} comme concurrent', { nom: l.nom })}>{t('Suivre')}</button></form>
                <form action={ignorerMarque}><input type="hidden" name="nom" value={l.cle} /><button type="submit" className="lien text-[0.8125rem]" aria-label={t('Ignorer {nom}', { nom: l.nom })}>{t('Ignorer')}</button></form>
              </span>
            ),
          ],
        }))}
      />
    </Feuille>
  )

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Suivre') }, { libelle: t('Concurrents') }]} m={m} lancer />
      <EnTete
        titre={t('Concurrents')}
        verdict={c.base === 0 ? t('Aucune réponse dont les marques sont connues pour l’instant.') : <>
          {c.lignes[0] && !c.lignes[0].aNous ? t('{nom} est la marque la plus nommée : {k} [k:réponse|réponses] sur {n}.', { nom: c.lignes[0].nom, k: c.lignes[0].reponses, n: c.base }) : t('{nom} est la marque la plus nommée.', { nom: nous.nom })}{' '}
          {t('{marque} est dans {k} sur {n}.', { marque: nous.nom, k: nous.reponses, n: c.base })}{' '}
          <span className="second">{m.concurrents.length === 0 ? t('Aucun concurrent suivi pour l’instant.') : t('{n} [n:concurrent suivi|concurrents suivis].', { n: m.concurrents.length })}</span>
        </>}
        actions={<Link href={`/projets/${m.projet.id}?onglet=concurrents`} className="bouton bouton-creux">{t('Gérer les concurrents suivis')}</Link>}
      />

      <BandeauLecture projetId={m.projet.id} />

      {m.tous.length === 0 ? (
        <Vide titre={t('Aucun relevé pour ce projet.')} action={<Link href={`/projets/${m.projet.id}?onglet=releves`} className="bouton">{t('Préparer le premier relevé')}</Link>}>
          <p>{t('Les marques nommées par les IA apparaissent dès le premier relevé.')}</p>
        </Vide>
      ) : (
        <>
          {m.concurrents.length === 0 && (
            <>
              <Vide titre={t('Suivez vos premiers concurrents')} action={<a href="#reperees" className="bouton">{t('Choisir parmi les marques repérées')}</a>}>
                <p>{t('Voici les marques que les IA nomment le plus sur vos questions. Suivez celles qui comptent : le classement, la part de voix et le face-à-face se rempliront.')}</p>
              </Vide>
              {blocReperees}
            </>
          )}

          {/* ── Classement ──────────────────────────────────────────────────── */}
          <Feuille titre={t('Classement')} droite={<LigneMethode methode="interface" n={c.base} unite="réponse lue" periode={periode} />} aide={t('Part des réponses d’interface qui nomment chaque marque, parmi celles dont les marques sont connues. Claude (API) est compté dans sa colonne.')}>
            <TableauTriable
              libelle={t('Classement')}
              triInitial={{ colonne: 1, sens: 'desc' }}
              colonnes={[
                { libelle: t('Marque') },
                { libelle: t('Nommée dans'), num: true },
                { libelle: t('Part de voix'), num: true, aide: t('Mentions de la marque rapportées à celles de la marque et des concurrents suivis.') },
                { libelle: t('Rang moyen'), num: true },
                { libelle: t('En premier'), num: true },
                { libelle: t('Questions'), num: true },
                { libelle: t('IA'), triable: false },
                { libelle: t('Écart'), num: true, aide: t('Écart avec la période d’avant, coloré seulement au-delà de la marge d’erreur.') },
                { libelle: 'Claude (API)', num: true, api: true },
              ]}
              lignes={classement.map((l) => ({
                cle: l.cle,
                nous: l.aNous,
                tri: [l.nom, l.reponses, l.reponses, l.rangMoyen, l.premiere, l.questions.size, null, evolution(l)?.points ?? null, l.api],
                cellules: [
                  <NomMarque key="n" nom={l.nom} nous={l.aNous} href={l.aNous ? '/reponses?presence=oui&methode=interface' : `/reponses?marque=${encodeURIComponent(l.nom)}`} />,
                  c.base ? <span key="v">{pct(l.reponses / c.base)}<span className="second discret block">{t('{k} sur {n}', { k: l.reponses, n: c.base })}</span></span> : t('n.c.'),
                  c.mentionsSuivies ? pct(l.reponses / c.mentionsSuivies) : t('n.c.'),
                  decimal(l.rangMoyen),
                  l.premiere,
                  l.questions.size,
                  <span key="ia" className="second">{[...l.moteurs].map(nomCourt).join(', ') || <span className="discret">{t('aucune')}</span>}</span>,
                  <EcartLu key="e" e={evolution(l)} vide="—" />,
                  c.baseApi ? t('{k} sur {n}', { k: l.api, n: c.baseApi }) : <span key="a" className="discret">{t('pas lu')}</span>,
                ],
              }))}
            />
          </Feuille>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <Feuille titre={t('Part de voix')} droite={<LigneMethode methode="interface" n={c.mentionsSuivies} unite="mention" />} aide={t('Nos mentions rapportées à celles des concurrents suivis.')}>
              {c.mentionsSuivies === 0 ? <p className="second p-4">{t('Aucune mention de la marque ni d’un concurrent suivi pour l’instant.')}</p> : (
                <Classement libelle={t('Part de voix')} max={Math.max(...classement.map((l) => l.reponses), 1)} lignes={classement.map((l) => ({ cle: l.cle, nom: l.nom, valeur: l.reponses, texte: `${pct(l.reponses / c.mentionsSuivies)} · ${l.reponses}`, nous: l.aNous }))} />
              )}
            </Feuille>
            <Feuille titre={t('Dans le temps : nous et les cinq premiers')} droite={<LigneMethode methode="interface" n={c.base} unite="réponse lue" periode={periode} />} aide={t('Part des réponses lues qui nomment chaque marque, relevé après relevé.')}>
              <Courbe titre={t('Marques nommées dans le temps')} points={donneesCourbe.points} series={donneesCourbe.series} csv="geotrends-marques" mesure={t('Nommée dans')} echantillon={t('réponses lues')} vide={t('Aucune réponse dont les marques sont connues sur cette période.')} />
          </Feuille>
          </div>

          {/* ── Répartition des rangs ───────────────────────────────────────── */}
          <Feuille titre={t('À quel rang chaque marque est nommée')} droite={<LigneMethode methode="interface" n={c.base} unite="réponse lue" />} aide={t('Nombre de réponses où la marque est la première nommée, la deuxième, la troisième, ou plus loin. Plus la case est foncée, plus le nombre est grand.')}>
            <div className="defile">
              <table className="tableau dense">
                <thead>
                  <tr>
                    <th scope="col" className="fixe">{t('Marque')}</th>
                    {[ordinal(1), ordinal(2), ordinal(3), t('4e et plus')].map((x) => <th key={x} scope="col" className="text-center">{x}</th>)}
                    <th scope="col" className="num">{t('Jamais nommée')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[nous, ...compares].map((l) => {
                    const cases = [1, 2, 3].map((r) => l.rangs.filter((x) => x === r).length).concat(l.rangs.filter((x) => x >= 4).length)
                    const max = Math.max(...[nous, ...compares].flatMap((x) => [1, 2, 3].map((r) => x.rangs.filter((y) => y === r).length).concat(x.rangs.filter((y) => y >= 4).length)), 1)
                    return (
                      <tr key={l.cle} className={l.aNous ? 'nous' : ''}>
                        <th scope="row" className="fixe"><NomMarque nom={l.nom} nous={l.aNous} /></th>
                        {cases.map((n, i) => <td key={i} className={`case ${n === 0 ? '' : `g${Math.max(1, Math.ceil((n / max) * 6))}`}`}>{n === 0 ? <span className="discret">·</span> : n}</td>)}
                        <td className="num">{t('{k} sur {n}', { k: c.base - l.reponses, n: c.base })}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Feuille>

          {m.concurrents.length > 0 && blocReperees}

          {/* ── Grille questions × IA ───────────────────────────────────────── */}
          <Feuille titre={t('Question par question, IA par IA')} aide={t('Un point : pas de réponse à lire (question pas encore relevée, ou pas d’Aperçu IA). « Pas lu » : les marques de cette réponse ne sont pas encore connues. La couverture compte les IA d’interface.')} droite={t('dernier relevé de chaque IA')}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[var(--filet)] px-4 py-3">
              <Choix libelle={t('Voir')} actif={vue} options={[{ cle: 'nous', libelle: t('Notre rang'), href: lien({ grille: undefined, face: undefined }) }, { cle: 'premier', libelle: t('Premier nommé'), href: lien({ grille: 'premier', face: undefined }) }, { cle: 'face', libelle: t('Face à un concurrent'), href: lien({ grille: 'face' }) }]} />
              {vue === 'face' && (suivies.length ? suivies : compares).length > 0 && (
                <Choix libelle={t('Face à')} actif={rival?.cle ?? ''} options={(suivies.length ? suivies : compares).slice(0, 8).map((l) => ({ cle: l.cle, libelle: l.nom, href: lien({ grille: 'face', face: l.cle }) }))} />
              )}
            </div>
            <div className="defile">
              <table className="tableau dense">
                <thead>
                  <tr>
                    <th scope="col" className="fixe">{t('Question')}</th>
                    {m.moteurs.map((x) => <th key={x} scope="col" className={`${METHODE[x] === 'api' ? 'api' : ''} text-center`}><TeteMoteur moteur={x} /></th>)}
                    <th scope="col" className="num">{t('Couverture')}</th>
                  </tr>
                </thead>
                <tbody>
                  {m.questions.map((q) => {
                    const d = derniersParMoteur(q.releves)
                    const lus = interfaces.filter((x) => d.get(x)?.statut === 'recu')
                    return (
                      <tr key={q.id}>
                        <th scope="row" className="fixe max-w-[20rem]"><Link href={`/questions/${q.id}`} className="ligne-lien line-clamp-1">{q.texte}</Link></th>
                        {m.moteurs.map((x) => {
                          const r = d.get(x)
                          const api = METHODE[x] === 'api' ? 'api' : ''
                          if (!r || r.statut !== 'recu') return <td key={x} className={`case ${api}`}><span className="discret" title={!r ? t('Pas encore relevée') : r.statut === 'vide' ? t('Pas d’aperçu : ce n’est pas une absence') : t('Réponse pas encore revenue')}>·</span></td>
                          if (vue === 'premier') {
                            const p = premierNomme(r)
                            return <td key={x} className={`case ${api} ${p && r.rang === 1 ? 'g2' : ''}`}>{p ? <span className={r.rang === 1 ? 'nous-plein' : ''}>{p}</span> : <span className="discret font-normal">{t('pas lu')}</span>}</td>
                          }
                          if (vue === 'face' && rival) {
                            if (!r.marquesLues) return <td key={x} className={`case ${api}`}><span className="discret font-normal">{t('pas lu')}</span></td>
                            const eux = rangDe(r, rival)
                            const texte = r.rang && eux ? (r.rang < eux ? t('Nous devant ({a} et {b})', { a: ordinal(r.rang), b: ordinal(eux) }) : t('{nom} devant ({a} et {b})', { nom: rival.nom, a: ordinal(eux), b: ordinal(r.rang) })) : r.rang || r.present ? t('Nous seuls') : eux ? t('{nom} seul', { nom: rival.nom }) : t('Aucun des deux')
                            return <td key={x} className={`case ${api} ${(r.rang && (!eux || r.rang < eux)) || (r.present && !eux) ? 'g3' : eux ? 'absente' : ''}`}><span className="font-normal">{texte}</span></td>
                          }
                          return <td key={x} className={`case ${api} ${r.rang ? `g${Math.max(1, 7 - Math.min(r.rang, 6))}` : r.present ? 'g2' : 'absente'}`}><Link href={`/questions/${q.id}?ia=${x}#reponses`}>{r.rang ? ordinal(r.rang) : r.present ? t('présente') : t('absente')}</Link></td>
                        })}
                        <td className="num">{lus.length ? `${lus.filter((x) => d.get(x)!.present).length}/${lus.length}` : <span className="discret">{t('n.c.')}</span>}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Feuille>

          {/* ── Face-à-face ─────────────────────────────────────────────────── */}
          {colonnes.length > 1 && (
            <Feuille titre={t('Face-à-face')} droite={<LigneMethode methode="interface" n={c.base} unite="réponse lue" periode={periode} />} aide={t('Les mesures en lignes, les marques en colonnes. La meilleure case de chaque ligne est marquée d’un trait vert.')}>
              <div className="defile">
                <table className="tableau">
                  <thead>
                    <tr>
                      <th scope="col" className="fixe">{t('Mesure')}</th>
                      {colonnes.map((l) => <th key={l.cle} scope="col" className="num">{l.nom}{l.aNous && <span className="etiquette-nous ml-1.5">{t('à nous')}</span>}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {mesures.map((x) => {
                      const valeurs = colonnes.map((l) => x.valeur(l)).filter((v): v is number => v !== null)
                      const meilleur = valeurs.length > 1 && new Set(valeurs).size > 1 ? (x.mieux === 'haut' ? Math.max(...valeurs) : Math.min(...valeurs)) : null
                      return (
                        <tr key={x.cle}>
                          <th scope="row" className="fixe">{x.libelle}</th>
                          {colonnes.map((l) => <td key={l.cle} className={`num ${l.aNous ? 'bg-[var(--papier)]' : ''} ${meilleur !== null && x.valeur(l) === meilleur ? 'meilleure' : ''}`}>{x.texte(l)}</td>)}
                        </tr>
                      )
                    })}
                    <tr className="a-part">
                      <th scope="row" className="fixe">{t('Claude (API) : réponses qui la nomment')}</th>
                      {colonnes.map((l) => <td key={l.cle} className={`num ${l.aNous ? 'bg-[var(--papier)]' : ''}`}>{c.baseApi ? t('{k} sur {n}', { k: l.api, n: c.baseApi }) : t('pas lu')}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Feuille>
          )}

          <CommentLire>
            <ul>
              <li>{t('Tout est compté sur les réponses d’interface dont les marques sont lues. Claude, mesuré par son API, a sa propre colonne et n’entre dans aucun total.')}</li>
              <li>{t('La part de voix rapporte les mentions de la marque à celles de la marque et des concurrents suivis : elle n’existe qu’avec au moins un concurrent suivi.')}</li>
              <li>{t('Un écart n’est coloré que s’il dépasse la marge d’erreur.')}</li>
            </ul>
          </CommentLire>
        </>
      )}
    </div>
  )
}
