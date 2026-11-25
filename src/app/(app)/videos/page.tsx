import Link from 'next/link'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { EnTete, Feuille, LigneMethode, Vide } from '@/components/outil/Blocs'
import { lienReponse } from '@/components/outil/ListeReponses'
import { classerVideos, dureeLisible, type LigneVideo } from '@/lib/classements'
import { exigerMesures, titreOnglet } from '@/lib/contexte'
import { libellePeriode } from '@/lib/filtres'
import { traducteur } from '@/lib/i18n/serveur'
import { entreGuillemets } from '@/lib/i18n/courante'
import { jourLong, nom, nomCourt } from '@/lib/libelles'
import { deMethode, recus } from '@/lib/mesures'
import { marqueDe } from '@/lib/projets'
import { lireTravail } from '@/lib/travail'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Vidéos et chaînes')

/** Miniature publique de YouTube (gratuite, sans appel d'API). */
function Miniature({ id, petite = false }: { id: string; petite?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`} alt="" loading="lazy" width={petite ? 96 : 128} height={petite ? 54 : 72} className="miniature" />
  )
}

/**
 * Vidéos et chaînes, en trois questions simples :
 * 1. Nos chaînes sont-elles citées ? (une carte par chaîne déclarée, même jamais citée)
 * 2. Question par question : quelle vidéo l'IA cite-t-elle, la nôtre ou une autre ?
 * 3. Quelles autres chaînes sont citées ?
 * Une seule unité de compte : la réponse relevée.
 */
export default async function Videos() {
  const t = await traducteur()
  const m = await exigerMesures()
  const periode = libellePeriode(m.filtres.periode)
  // Interface seulement : les vidéos citées par Claude (API) ne sont pas ce que voit un internaute.
  const ui = deMethode(m.releves, 'interface')
  const reponses = recus(ui)
  const { videos, chaines } = classerVideos(m, ui)
  const travail = await lireTravail(m.projet.id, marqueDe(m.projet))

  // Réponses (relevés) qui citent au moins une vidéo : c'est l'unité de compte de tout l'écran.
  const avecVideo = new Set(videos.flatMap((v) => v.citations.map((c) => c.releve.id)))
  const reponsesDe = (vs: LigneVideo[]) => new Set(vs.flatMap((v) => v.citations.map((c) => c.releve.id))).size
  const moteursVideo = [...new Set(videos.flatMap((v) => [...v.moteurs]))]
  const seulGoogle = moteursVideo.length > 0 && moteursVideo.every((x) => x.startsWith('google'))

  // 1. Nos chaînes, une par une : les plus citées d'abord, celles jamais citées ensuite.
  const nosChaines = m.marque.chainesYoutube
    .map((c) => {
      const vs = videos.filter((v) => v.chaineId === c.id)
      return { id: c.id, nom: chaines.find((x) => x.id === c.id)?.nom ?? c.nom, videos: vs, reponses: reponsesDe(vs) }
    })
    .sort((a, b) => b.reponses - a.reponses || a.nom.localeCompare(b.nom))
  const reponsesNous = reponsesDe(videos.filter((v) => v.aNous))

  // 2. Question par question : d'abord celles où une autre chaîne est citée à notre place.
  const parQuestion = m.questions
    .map((q) => {
      const vs = videos.filter((v) => v.questions.has(q.id))
      const total = reponses.filter((r) => r.question.id === q.id).length
      const citant = new Set(vs.flatMap((v) => v.citations.filter((c) => c.releve.question.id === q.id).map((c) => c.releve.id))).size
      return { q, videos: vs, nous: vs.some((v) => v.aNous), total, citant }
    })
    .filter((x) => x.videos.length > 0)
    .sort((a, b) => Number(a.nous) - Number(b.nous) || b.citant - a.citant || b.videos.length - a.videos.length)
  const aPrendre = parQuestion.filter((x) => !x.nous).length

  // 3. Les autres chaînes.
  const autres = chaines.filter((c) => !c.aNous)

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Comprendre') }, { libelle: t('Vidéos et chaînes') }]} m={m} lancer />
      <EnTete
        titre={t('Vidéos et chaînes')}
        verdict={reponses.length === 0 ? undefined : videos.length === 0 ? t('Aucune des {n} [n:réponse relevée|réponses relevées] ne cite de vidéo YouTube.', { n: reponses.length }) : <>
          {t('Sur {n} [n:réponse relevée|réponses relevées], {k} [k:cite|citent] une vidéo YouTube.', { n: reponses.length, k: avecVideo.size })}{' '}
          {m.marque.chainesYoutube.length > 0 && (reponsesNous > 0
            ? t('Une vidéo de {marque} apparaît dans {k} [k:réponse|réponses].', { marque: m.marque.nom, k: reponsesNous })
            : t('Aucune vidéo de {marque} n’apparaît.', { marque: m.marque.nom }))}{' '}
          {seulGoogle && <span className="second">{t('Seul Google cite des vidéos ({ia}).', { ia: moteursVideo.map(nomCourt).join(', ') })}</span>}
        </>}
      />

      {m.tous.length === 0 && (
        <Vide titre={t('Aucun relevé pour ce projet.')} action={<Link href={`/projets/${m.projet.id}?onglet=releves`} className="bouton">{t('Préparer le premier relevé')}</Link>}>
          <p>{t('Les vidéos citées apparaissent dès le premier relevé.')}</p>
        </Vide>
      )}

      {/* 1. Nos chaînes */}
      {m.marque.chainesYoutube.length === 0 ? (
        <Vide titre={t('Aucune chaîne YouTube n’est déclarée pour la marque.')} action={<Link href={`/projets/${m.projet.id}?onglet=marque`} className="bouton">{t('Déclarer une chaîne')}</Link>}>
          <p>{t('Déclarez la chaîne YouTube de la marque pour que ses vidéos comptent pour elle. Les vidéos citées par les IA restent listées ci-dessous.')}</p>
        </Vide>
      ) : m.tous.length > 0 && (
        <Feuille titre={t('Vos chaînes')} aide={t('Une vidéo citée par une IA compte pour la chaîne qui l’a publiée. Chaque chaîne déclarée a sa carte, même si elle n’est jamais citée.')} droite={<Link href={`/projets/${m.projet.id}?onglet=marque`} className="lien">{t('Gérer les chaînes')}</Link>}>
          <div className="grid gap-px bg-[var(--filet)] md:grid-cols-2">
            {nosChaines.map((c) => (
              <article key={c.id} className="bg-[var(--papier)] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <a href={`https://www.youtube.com/channel/${c.id}`} target="_blank" rel="noopener noreferrer" className="ligne-lien t4 font-semibold">{c.nom}</a>
                  {c.reponses > 0
                    ? <span className="pastille cite">{t('citée dans {n} [n:réponse|réponses]', { n: c.reponses })}</span>
                    : <span className="pastille absent">{t('jamais citée')}</span>}
                </div>
                {c.videos.length === 0 ? (
                  <p className="second mt-2">{t('Aucune de ses vidéos n’apparaît dans les {n} [n:réponse relevée|réponses relevées] sur cette période.', { n: reponses.length })}{aPrendre > 0 && <> {t('Les questions ci-dessous montrent où une vidéo d’une autre chaîne est citée.')}</>}</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {c.videos.map((v) => (
                      <li key={v.id} className="flex gap-3">
                        <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="shrink-0"><Miniature id={v.id} /></a>
                        <div className="min-w-0">
                          <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="ligne-lien font-semibold"><span className="nous-plein">{v.titre}</span></a>
                          <p className="second">
                            {[...v.moteurs].map(nom).join(', ')} · {t('{n} [n:fois|fois]', { n: v.citations.length })}
                            {v.vues !== null && <> · {t('{n} vues', { n: v.vues })}</>}
                            {v.publieLe && <> · {t('publiée le {date}', { date: jourLong(v.publieLe) })}</>}
                          </p>
                          {[...v.questions].map(([id, texte]) => <Link key={id} href={`/questions/${id}`} className="second block truncate hover:underline">{entreGuillemets(texte)}</Link>)}
                          {v.citations.some((x) => x.moment) && <p className="second">{t('Passage cité :')} {[...new Map(v.citations.filter((x) => x.moment).map((x) => [x.url, x.moment!])).entries()].map(([url, moment]) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="lien chiffre mr-2">{dureeLisible(moment)}</a>)}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </Feuille>
      )}

      {/* 2. Question par question */}
      {videos.length > 0 && (
        <Feuille
          titre={t('Question par question')}
          aide={t('Les questions pour lesquelles une IA cite au moins une vidéo YouTube. En haut, celles où la vidéo citée n’est pas la vôtre : une vidéo sur le même sujet a des chances d’y entrer.')}
          droite={aPrendre > 0 ? t('{n} [n:question|questions] où une autre chaîne est citée', { n: aPrendre }) : undefined}
        >
          <div className="defile haut">
            <table className="tableau fiches">
              <thead>
                <tr>
                  <th scope="col" className="fixe">{t('Question')}</th>
                  <th scope="col">{t('Vidéo citée par l’IA')}</th>
                  <th scope="col">{t('Pour qui')}</th>
                </tr>
              </thead>
              <tbody>
                {parQuestion.map(({ q, videos: vs, nous, total, citant }) => (
                  <tr key={q.id} className={nous ? 'nous' : ''}>
                    <th scope="row" className="fixe max-w-[20rem] align-top">
                      <Link href={`/questions/${q.id}`} className="ligne-lien font-semibold">{q.texte}</Link>
                      <span className="second block">{t('vidéo citée dans {k} [k:réponse|réponses] sur {n}', { k: citant, n: total })}</span>
                    </th>
                    <td className="align-top">
                      <ul className="space-y-2">
                        {vs.slice(0, 3).map((v) => {
                          const ici = v.citations.filter((c) => c.releve.question.id === q.id)
                          return (
                            <li key={v.id} className="flex gap-3">
                              <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer nofollow" className="shrink-0"><Miniature id={v.id} petite /></a>
                              <div className="min-w-0 max-w-[26rem]">
                                <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer nofollow" className="line-clamp-2 hover:underline">{v.aNous ? <span className="nous-plein">{v.titre}</span> : v.titre}</a>
                                <span className="second block">
                                  {v.chaineNom}
                                  {' · '}
                                  {[...new Set(ici.map((c) => c.releve.moteur))].map((mo, i) => {
                                    const c = ici.find((x) => x.releve.moteur === mo)!
                                    return <span key={mo}>{i > 0 && ', '}<Link href={lienReponse(c.releve)} className="hover:underline">{nomCourt(mo)}</Link></span>
                                  })}
                                </span>
                              </div>
                            </li>
                          )
                        })}
                        {vs.length > 3 && <li className="second discret">{t('et {n} [n:autre vidéo|autres vidéos]', { n: vs.length - 3 })}</li>}
                      </ul>
                    </td>
                    <td className="whitespace-nowrap align-top">
                      {nous ? <span className="pastille cite">{t('vous')}</span> : <span className="pastille neutre">{t('une autre chaîne')}</span>}
                      {!nous && travail.some((l) => l.cle === `video:${q.id}`) && (
                        <Link href={`/actions?action=${encodeURIComponent(`video:${q.id}`)}`} className="lien mt-2 block text-[0.8125rem]">{t('Voir l’action')}</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Feuille>
      )}

      {/* 3. Les autres chaînes */}
      {autres.length > 0 && (
        <Feuille titre={t('Les autres chaînes citées')} aide={t('Chaînes d’autres créateurs ou marques dont une vidéo est citée. Celles qui reviennent souvent sont vos concurrents sur YouTube pour ces questions.')} droite={t('{n} [n:chaîne|chaînes]', { n: autres.length })}>
          <div className="defile haut">
            <table className="tableau fiches">
              <thead>
                <tr>
                  <th scope="col" className="fixe">{t('Chaîne')}</th>
                  <th scope="col" className="num">{t('Réponses')}</th>
                  <th scope="col" className="num">{t('Vidéos')}</th>
                  <th scope="col" className="num">{t('Questions')}</th>
                  <th scope="col">{t('Citée par')}</th>
                  <th scope="col">{t('Vidéo la plus citée')}</th>
                </tr>
              </thead>
              <tbody>
                {autres.map((c) => (
                  <tr key={c.id}>
                    <th scope="row" className="fixe"><a href={`https://www.youtube.com/channel/${c.id}`} target="_blank" rel="noopener noreferrer nofollow" className="ligne-lien font-semibold">{c.nom}</a></th>
                    <td className="num">{reponsesDe(c.videos)}</td>
                    <td className="num">{c.videos.length}</td>
                    <td className="num">{c.questions.size}</td>
                    <td className="second">{[...c.moteurs].map(nomCourt).join(', ')}</td>
                    <td className="max-w-[22rem]"><a href={`https://www.youtube.com/watch?v=${c.videos[0].id}`} target="_blank" rel="noopener noreferrer nofollow" className="line-clamp-1 hover:underline">{c.videos[0].titre}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Feuille>
      )}

      {reponses.length > 0 && (
        <LigneMethode methode="interface" n={reponses.length} unite="réponse" periode={periode} suite={t('{n} [n:réponse cite|réponses citent] une vidéo', { n: avecVideo.size })} />
      )}
    </div>
  )
}
