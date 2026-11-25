import Link from 'next/link'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { Bandeau, CommentLire, EnTete, Feuille, Tampon, Tuile } from '@/components/outil/Blocs'
import { BoutonEnvoi } from '@/components/outil/BoutonEnvoi'
import { Confirmer } from '@/components/outil/Confirmer'
import { MAX_FAITS, PRIX_FAITS_USD } from '@/lib/analyse'
import { APPARTENANCES, appartenanceDuDomaine, marquesNommees, typeDeDomaine, typeEcrit } from '@/lib/classements'
import { exigerMesures, titreOnglet } from '@/lib/contexte'
import { domaineDe } from '@/lib/fournisseurs/types'
import { traducteur } from '@/lib/i18n/serveur'
import { entreGuillemets } from '@/lib/i18n/courante'
import { adresseCourte, jourLong, nom, pluriel, usdFin } from '@/lib/libelles'
import { prisma } from '@/lib/prisma'
import { ajouterFaits, ecarterContradiction, retirerFait, verifierLesReponses } from './actions'
import { reponsesAVerifier, reponsesQuiNomment } from './lecture'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Faits vérifiés')

const EXEMPLES = ['Le prix de l’offre de départ', 'Ce que l’offre comprend, et ce qu’elle ne comprend pas', 'Le pays et la ville du siège', 'L’année de création', 'Le nom du fondateur', 'Les pays et les langues servis']

export default async function Faits() {
  const t = await traducteur()
  const m = await exigerMesures()
  const [faits, contradictions] = await Promise.all([
    prisma.fait.findMany({ where: { projetId: m.projet.id }, orderBy: { createdAt: 'asc' }, include: { _count: { select: { contradictions: { where: { ecartee: false } } } } } }),
    prisma.contradiction.findMany({
      where: { fait: { projetId: m.projet.id } },
      orderBy: { createdAt: 'desc' },
      include: { fait: { select: { texte: true } }, releve: { select: { id: true, moteur: true, methode: true, createdAt: true, question: { select: { id: true, texte: true } } } } },
    }),
  ])
  const nomment = reponsesQuiNomment(m)
  const aVerifier = reponsesAVerifier(m, faits)
  const verifiees = faits.length > 0 ? nomment.length - aVerifier.length : 0
  const ouvertes = contradictions.filter((c) => !c.ecartee)
  const ecartees = contradictions.filter((c) => c.ecartee)
  const total = [...m.questions, ...m.archivees].flatMap((q) => q.tous).filter((r) => r.statut === 'recu').length
  const nommees = marquesNommees(m)
  const lienReponse = (c: (typeof contradictions)[number]) => `/questions/${c.releve.question.id}?releve=${new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(c.releve.createdAt)}&ia=${c.releve.moteur}&r=${c.releve.id}#reponses`

  const ligne = (c: (typeof contradictions)[number]) => {
    const domaine = c.sourceUrl ? domaineDe(c.sourceUrl) : ''
    const qui = domaine ? appartenanceDuDomaine(domaine, m, nommees) : null
    return (
      <tr key={c.id}>
        <th scope="row" className="fixe min-w-[13rem] max-w-[20rem] align-top font-semibold">{c.fait.texte}</th>
        <td className="min-w-[18rem] max-w-[30rem] align-top">
          <span className="block">{entreGuillemets(c.phrase)}</span>
          {c.explication && <span className="second mt-1 block">{c.explication}</span>}
        </td>
        <td className="whitespace-nowrap align-top">
          <span className="font-semibold">{nom(c.releve.moteur)}</span>
          <span className="mt-1 block"><Tampon methode={c.releve.methode === 'api' ? 'api' : 'interface'} /></span>
          <span className="second mt-1 block chiffre">{jourLong(c.releve.createdAt)}</span>
        </td>
        <td className="max-w-[16rem] align-top">
          {c.sourceUrl ? (
            <>
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="lien block break-all text-[0.8125rem]">{adresseCourte(c.sourceUrl, 60)}</a>
              {qui && <span className="second discret mt-1 block">{t(typeEcrit(typeDeDomaine(domaine, m, nommees), qui))} · {t(APPARTENANCES[qui].libelle).toLowerCase()}</span>}
            </>
          ) : <span className="second discret">{t('aucune source citée à l’appui')}</span>}
        </td>
        <td className="max-w-[14rem] align-top">
          <Link href={lienReponse(c)} className="lien-fleche">{t('Ouvrir la réponse')} <span aria-hidden="true">→</span></Link>
          <span className="second mt-1 line-clamp-2">{c.releve.question.texte}</span>
        </td>
        <td className="align-top text-right">
          {!c.ecartee && <Link href={`/actions?action=${encodeURIComponent(`fait:${c.faitId}:${c.releveId}`)}#fiche`} className="bouton bouton-creux bouton-petit mb-1.5">{t('Voir l’action')}</Link>}
          <form action={ecarterContradiction}>
            <input type="hidden" name="id" value={c.id} />
            {c.ecartee && <input type="hidden" name="remettre" value="1" />}
            <BoutonEnvoi className="lien whitespace-nowrap text-[0.8125rem]" enCours="…">{c.ecartee ? t('Remettre dans la liste') : t('Écarter (fausse alerte)')}</BoutonEnvoi>
          </form>
        </td>
      </tr>
    )
  }
  const tete = (
    <thead>
      <tr>
        <th scope="col" className="fixe">{t('Fait vérifié')}</th>
        <th scope="col">{t('Ce que dit la réponse')}</th>
        <th scope="col">{t('IA')}</th>
        <th scope="col">{t('Source citée à l’appui')}</th>
        <th scope="col">{t('Réponse')}</th>
        <th scope="col"><span className="invisible-lecteur">{t('Suite à donner')}</span></th>
      </tr>
    </thead>
  )

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Comprendre') }, { libelle: t('Faits vérifiés') }]} />
      <EnTete
        titre={t('Faits vérifiés')}
        verdict={faits.length === 0 ? t('Écrivez ce qui est vrai sur {marque} : l’outil signalera les réponses des IA qui disent autre chose.', { marque: m.marque.nom }) : ouvertes.length === 0 ? t('{n} [n:fait vérifié|faits vérifiés] : aucune réponse comparée ne dit autre chose.', { n: faits.length }) : t('{k} [k:réponse dit|réponses disent] autre chose que vos {n} [n:fait vérifié|faits vérifiés].', { k: ouvertes.length, n: faits.length })}
      />

      {faits.length > 0 && aVerifier.length > 0 && (
        <form action={verifierLesReponses}>
          <Bandeau action={<BoutonEnvoi enCours={t('Vérification en cours…')}>{t('Vérifier les réponses (environ {prix})', { prix: usdFin(Math.max(aVerifier.length * PRIX_FAITS_USD, 0.0005)) })}</BoutonEnvoi>}>
            <p>
              <strong className="font-semibold">{verifiees > 0 ? t('{n} [n:réponse qui nomme {marque} n’a pas été comparée|réponses qui nomment {marque} n’ont pas été comparées] aux faits depuis le dernier fait ajouté.', { n: aVerifier.length, marque: m.marque.nom }) : t('{n} [n:réponse qui nomme {marque} n’a pas été comparée|réponses qui nomment {marque} n’ont pas été comparées] aux faits.', { n: aVerifier.length, marque: m.marque.nom })}</strong>{' '}
              {t('Le petit modèle relit chacune et relève les phrases qui contredisent un fait. Les réponses qui ne nomment pas la marque ne sont pas relues : elles ne peuvent pas la contredire.')}
            </p>
            <p className="second mt-1">{t('Appel payant, inscrit au journal des coûts. Rien ne part sans votre clic. Les réponses à venir sont comparées aux faits pendant leur lecture automatique, sans appel en plus.')}</p>
          </Bandeau>
        </form>
      )}

      <section className="ecran" aria-label={t('Chiffres clés')}>
        <div className="tuiles">
          <Tuile titre={t('Faits vérifiés')} aide={t('Ce que vous avez écrit comme vrai sur la marque. {max} au plus par projet.', { max: MAX_FAITS })} base={t('{max} au plus', { max: MAX_FAITS })}>{faits.length}</Tuile>
          <Tuile titre={t('Réponses qui nomment la marque')} aide={t('Seules les réponses qui nomment la marque peuvent la contredire. Interface et API sont comptées ici ensemble, parce qu’on ne mesure pas une part : on relit des phrases.')} base={t('sur {n} [n:réponse reçue|réponses reçues]', { n: total })}>{nomment.length}</Tuile>
          <Tuile titre={t('Comparées aux faits')} aide={t('Réponses déjà relues par le petit modèle pour y chercher une contradiction.')} base={faits.length === 0 ? t('aucun fait saisi') : aVerifier.length > 0 ? t('{n} à comparer', { n: aVerifier.length }) : t('toutes')}>{faits.length === 0 ? <span className="discret">{t('n.c.')}</span> : verifiees}</Tuile>
          <Tuile titre={t('Disent autre chose')} aide={t('Réponses où une phrase affirme sur la marque autre chose qu’un fait vérifié.')} base={ecartees.length ? t('{n} [n:écartée|écartées] à la main', { n: ecartees.length }) : undefined}>{faits.length === 0 ? <span className="discret">{t('n.c.')}</span> : ouvertes.length}</Tuile>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Feuille titre={t('Ce qui est vrai sur {marque}', { marque: m.marque.nom })} droite={t('{k} sur {n}', { k: faits.length, n: MAX_FAITS })} aide={t('Une phrase par fait, précise et vérifiable : un prix, une offre, un pays, une date. Cinq à vingt faits suffisent.')}>
          {faits.length === 0 ? <p className="second p-4">{t('Aucun fait pour l’instant. Ajoutez-en ci-dessous : c’est gratuit.')}</p> : (
            <ol>
              {faits.map((f, i) => (
                <li key={f.id} className={`grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-start gap-3 px-4 py-2.5 ${i ? 'ligne-t' : ''}`}>
                  <span className="nb text-[var(--encre-pale)]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">
                    {f.texte}
                    <span className="second block">{f._count.contradictions > 0 ? <span className="font-semibold text-[var(--absent-texte)]">{t('{n} [n:réponse dit|réponses disent] autre chose', { n: f._count.contradictions })}</span> : t('aucune réponse ne dit autre chose')} · {t('ajouté le {date}', { date: jourLong(f.createdAt) })}</span>
                  </span>
                  <form action={retirerFait}>
                    <input type="hidden" name="faitId" value={f.id} />
                    <Confirmer libelle={t('Retirer')} titre={t('Retirer ce fait ?')} confirmer={t('Retirer')} className="lien text-[0.8125rem]">
                      <p>{entreGuillemets(f.texte)} {t('ne sera plus comparé aux réponses.')}{f._count.contradictions > 0 ? ` ${t('Les {n} contradictions relevées contre lui seront retirées aussi.', { n: f._count.contradictions })}` : ''}</p>
                    </Confirmer>
                  </form>
                </li>
              ))}
            </ol>
          )}
          {faits.length < MAX_FAITS ? (
            <form action={ajouterFaits} className="space-y-2 border-t border-[var(--encre)] p-4">
              <label className="libelle">
                {t('Ajouter des faits')}
                <span className="aide">{t('Un fait par ligne, écrit comme une phrase complète. Par exemple : « L’offre de départ coûte 29 € par mois. »')}</span>
                <textarea name="faits" rows={4} className="champ mt-1" placeholder={t('{marque} a été créé en …', { marque: m.marque.nom })} />
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <BoutonEnvoi className="bouton bouton-creux" enCours={t('Ajout…')}>{t('Ajouter')}</BoutonEnvoi>
                <p className="second">{t('Ajouter un fait ne coûte rien.')} {nomment.length > 0 ? t('Comparer ensuite [n:la réponse qui nomme|les {n} réponses qui nomment] la marque coûtera environ {prix}, sur votre clic.', { n: nomment.length, prix: usdFin(nomment.length * PRIX_FAITS_USD) }) : ''}</p>
              </div>
            </form>
          ) : <p className="second border-t border-[var(--encre)] p-4">{t('Vingt faits : c’est le maximum. Retirez-en un pour en ajouter un autre.')}</p>}
        </Feuille>

        <Feuille titre={t('Quels faits écrire')}>
          <ul className="px-4 py-3">
            {EXEMPLES.map((x) => <li key={x} className="ligne-t py-1.5 first:border-t-0">{t(x)}</li>)}
          </ul>
          <div className="space-y-2 border-t border-[var(--filet)] px-4 py-3 text-[var(--encre-douce)]">
            <p><strong className="font-semibold text-[var(--encre)]">{t('Ce que l’outil signale.')}</strong> {t('Une phrase qui affirme sur la marque autre chose qu’un fait. Une information absente d’une réponse n’est pas une contradiction.')}</p>
            <p><strong className="font-semibold text-[var(--encre)]">{t('Ce qu’il faut vérifier.')}</strong> {t('Le petit modèle peut se tromper. Chaque ligne renvoie à la réponse complète : relisez la phrase avant d’écrire à un site, et écartez les fausses alertes.')}</p>
            {nomment.length === 0 && <p><strong className="font-semibold text-[var(--encre)]">{t('Aujourd’hui, aucune réponse ne nomme {marque}.', { marque: m.marque.nom })}</strong> {t('Il n’y a donc rien à comparer : les faits serviront dès qu’une IA parlera de la marque.')}</p>}
          </div>
        </Feuille>
      </div>

      <Feuille
        titre={t('Réponses qui disent autre chose')}
        droite={<><span>{pluriel(ouvertes.length, 'contradiction')}</span><span>{pluriel(verifiees, 'réponse comparée', 'réponses comparées')}</span></>}
        aide={t('Chaque ligne est une phrase relevée par le petit modèle dans une réponse d’IA. La méthode du relevé est écrite : interface (ce que voit l’internaute) ou API (réponse du modèle seul). Chaque contradiction est aussi une ligne de la liste de travail.')}
      >
        {faits.length === 0 ? (
          <p className="second p-4">{t('Saisissez d’abord des faits vérifiés.')}</p>
        ) : ouvertes.length === 0 ? (
          <p className="second p-4">{verifiees === 0 ? t('Aucune réponse n’a encore été comparée aux faits.') : t('Aucune contradiction dans les {n} [n:réponse comparée|réponses comparées].', { n: verifiees })}</p>
        ) : (
          <div className="defile">
            <table className="tableau fiches">{tete}<tbody>{ouvertes.map(ligne)}</tbody></table>
          </div>
        )}
        {ecartees.length > 0 && (
          <details className="border-t border-[var(--filet)]">
            <summary className="etiquette px-4 py-2.5">{t('Écartées à la main')} ({ecartees.length})</summary>
            <div className="defile">
              <table className="tableau fiches">{tete}<tbody>{ecartees.map(ligne)}</tbody></table>
            </div>
          </details>
        )}
      </Feuille>
      <CommentLire>
        <ul>
          <li>{t('Un fait vérifié est une phrase que vous tenez pour vraie sur la marque. L’outil signale les réponses qui affirment autre chose ; une information absente d’une réponse n’est pas une contradiction.')}</li>
          <li>{t('Le petit modèle peut se tromper : chaque ligne renvoie à la réponse complète, et une fausse alerte s’écarte d’un clic.')}</li>
        </ul>
      </CommentLire>
    </div>
  )
}
