import Link from 'next/link'
import { Reponse } from '@/components/Reponse'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { adresse, Choix, EnTete, EtatLu, Feuille, LigneMethode, NomMarque, Tampon } from '@/components/outil/Blocs'
import { Initiale } from '@/components/outil/Initiale'
import { lienReponse, ListeReponses } from '@/components/outil/ListeReponses'
import { PanneauLateral } from '@/components/outil/Panneau'
import { estNotreNom } from '@/lib/classements'
import { exigerMesures, titreOnglet } from '@/lib/contexte'
import { estMoteur, libellePeriode } from '@/lib/filtres'
import { traducteur } from '@/lib/i18n/serveur'
import { adresseCourte, heure, jourLong, nom, nomCourt, pluriel } from '@/lib/libelles'
import { simple } from '@/lib/mesures'
import { estALaMarque } from '@/lib/releves'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Réponses')

type Params = { ia?: string; methode?: string; presence?: string; marque?: string; domaine?: string; page?: string; question?: string; ouvrir?: string }

/** La preuve derrière un chiffre : la liste des réponses qui le composent. */
export default async function Reponses({ searchParams }: { searchParams: Promise<Params> }) {
  const t = await traducteur()
  const [m, sp] = await Promise.all([exigerMesures(), searchParams])
  const marque = sp.marque ? simple(sp.marque) : null
  const filtres: string[] = []
  // La liste suit les chiffres d'ensemble : sans les mesures approfondies, sauf quand on regarde une question précise.
  const question = sp.question ? m.questions.find((x) => x.id === sp.question) : undefined
  let rs = [...(question ? question.releves : m.releves)].reverse()
  if (estMoteur(sp.ia)) {
    rs = rs.filter((r) => r.moteur === sp.ia)
    filtres.push(nomCourt(sp.ia))
  }
  if (sp.methode === 'interface' || sp.methode === 'api') {
    rs = rs.filter((r) => r.methode === sp.methode)
    filtres.push(sp.methode === 'api' ? t('mesurées par l’API') : t('mesurées par l’interface'))
  }
  if (sp.presence === 'oui') {
    rs = rs.filter((r) => r.present)
    filtres.push(t('avec {marque}', { marque: m.marque.nom }))
  }
  if (sp.presence === 'non') {
    rs = rs.filter((r) => r.statut === 'recu' && !r.present)
    filtres.push(t('sans {marque}', { marque: m.marque.nom }))
  }
  if (marque) {
    rs = rs.filter((r) => (estNotreNom(sp.marque!, m) ? r.present : r.marques.some((x) => simple(x.nom) === marque || simple(x.nom).includes(marque))))
    filtres.push(t('qui nomment {marque}', { marque: sp.marque }))
  }
  if (sp.domaine) {
    rs = rs.filter((r) => r.sources.some((s) => s.role === 'citee' && s.domaine === sp.domaine))
    filtres.push(t('qui citent {site}', { site: sp.domaine }))
  }
  if (sp.page) {
    rs = rs.filter((r) => r.sources.some((s) => s.role === 'citee' && s.url === sp.page))
    filtres.push(t('qui citent cette page'))
  }
  if (sp.question) {
    rs = rs.filter((r) => r.question.id === sp.question)
    if (question) filtres.push(t('à la question « {texte} »', { texte: question.texte }))
  }
  const ui = rs.filter((r) => r.methode === 'interface' && r.statut === 'recu').length
  const api = rs.filter((r) => r.methode === 'api' && r.statut === 'recu').length
  const avec = rs.filter((r) => r.present).length
  const recues = rs.filter((r) => r.statut === 'recu').length
  // Interface et API ne s'additionnent jamais : sans filtre de méthode, deux phrases.
  const uiAvec = rs.filter((r) => r.methode === 'interface' && r.statut === 'recu' && r.present).length
  const apiAvec = rs.filter((r) => r.methode === 'api' && r.statut === 'recu' && r.present).length
  const melange = ui > 0 && api > 0
  // La réponse ouverte dans le panneau latéral, sans quitter la liste.
  const ouverte = sp.ouvrir ? (question?.releves ?? m.releves).find((r) => r.id === sp.ouvrir) ?? m.tous.find((r) => r.id === sp.ouvrir) : undefined
  const citees = ouverte ? ouverte.sources.filter((s) => s.role === 'citee') : []

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Suivre') }, { libelle: t('Questions'), href: '/questions' }, { libelle: t('Réponses') }]} m={m} />
      <EnTete
        titre={filtres.length ? t('Réponses {filtres}', { filtres: filtres.join(', ') }) : t('Toutes les réponses')}
        verdict={rs.length === 0 ? t('Aucune réponse ne correspond à cette sélection.') : <>{melange
          ? <>{t('{marque} est dans {k} [k:réponse|réponses] d’interface sur {n}.', { marque: m.marque.nom, k: uiAvec, n: ui })} {t('Claude (API), compté à part : {k} sur {n}.', { k: apiAvec, n: api })}</>
          : t('{marque} est dans {k} [k:réponse|réponses] sur {n}.', { marque: m.marque.nom, k: avec, n: recues })} <span className="second">{t('C’est la preuve derrière chaque chiffre : un clic ouvre le texte entier, avec ses sources.')}</span></>}
      />
      <Feuille
        titre={pluriel(rs.length, 'réponse')}
        droite={<><LigneMethode methode="interface" n={ui} unite="réponse" periode={libellePeriode(m.filtres.periode)} />{api > 0 && <LigneMethode methode="api" n={api} unite="réponse" />}</>}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 border-b border-[var(--filet)] px-4 py-3">
          <Choix
            libelle={t('Présence')}
            actif={sp.presence ?? 'toutes'}
            options={[{ cle: 'toutes', libelle: t('Toutes'), href: adresse('/reponses', sp, { presence: undefined, ouvrir: undefined }) }, { cle: 'oui', libelle: t('Avec {marque}', { marque: m.marque.nom }), href: adresse('/reponses', sp, { presence: 'oui', ouvrir: undefined }) }, { cle: 'non', libelle: t('Sans {marque}', { marque: m.marque.nom }), href: adresse('/reponses', sp, { presence: 'non', ouvrir: undefined }) }]}
          />
          <Choix
            libelle={t('IA')}
            actif={sp.ia ?? 'toutes'}
            options={[{ cle: 'toutes', libelle: t('Toutes'), href: adresse('/reponses', sp, { ia: undefined, ouvrir: undefined }) }, ...m.moteurs.map((x) => ({ cle: x, libelle: nomCourt(x), href: adresse('/reponses', sp, { ia: x, methode: undefined, ouvrir: undefined }) }))]}
          />
          {filtres.length > 0 && <Link href="/reponses" className="lien text-[0.8125rem]">{t('Tout afficher')}</Link>}
        </div>
        <ListeReponses releves={rs.slice(0, 200)} recherche={rs.length > 8} ouvrir={(r) => adresse('/reponses', sp, { ouvrir: r.id })} vide={t('Aucune réponse ne correspond à cette sélection.')} />
        {rs.length > 200 && <p className="second border-t border-[var(--filet)] px-4 py-2.5">{t('Les 200 réponses les plus récentes sont affichées, sur {n}.', { n: rs.length })}</p>}
      </Feuille>

      {ouverte && (
        <PanneauLateral large titre={ouverte.question.texte} sousTitre={`${nom(ouverte.moteur)} · ${jourLong(ouverte.createdAt)}`} fermer={adresse('/reponses', sp, { ouvrir: undefined })}>
          <p className="flex flex-wrap items-center gap-2">
            <Tampon methode={ouverte.methode} />
            <EtatLu r={ouverte} />
            <span className="second">{t('relevée à {heure}', { heure: heure(ouverte.releveLe ?? ouverte.createdAt) })}{ouverte.modele ? <> · <span className="chiffre">{ouverte.modele}</span></> : null}</span>
            <Link href={lienReponse(ouverte)} className="lien-fleche ml-auto text-[0.8125rem]">{t('Ouvrir la question')} <span aria-hidden="true">→</span></Link>
          </p>
          {ouverte.statut === 'recu' && ouverte.texte ? (
            <Reponse texte={ouverte.texte} nous={[m.marque.nom, ...(m.marque.ecritures ?? [])]} concurrents={m.concurrents.map((c) => c.nom)} sources={citees.map((s, i) => ({ url: s.url, numero: i + 1, aNous: estALaMarque(s, m.marque) }))} />
          ) : (
            <p className="second">{ouverte.statut === 'vide' ? t('Aucune réponse affichée pour cette question ce jour-là. Ce n’est pas une absence de la marque.') : ouverte.statut === 'en_attente' ? t('Réponse pas encore revenue.') : `${t('Échec')} : ${ouverte.erreur ?? t('raison inconnue')}`}</p>
          )}
          {ouverte.statut === 'recu' && (
            <>
              <div>
                <p className="sous-titre bloc-titre">{t('Marques nommées, dans l’ordre')}</p>
                {!ouverte.marquesLues ? <p className="second mt-1.5">{t('Pas encore lues pour cette réponse.')}</p> : ouverte.marques.length === 0 ? <p className="second mt-1.5">{t('Aucune marque nommée.')}</p> : (
                  <ol className="mt-1">
                    {ouverte.marques.map((x, i) => (
                      <li key={`${x.nom}-${i}`} className={`flex items-center gap-2 py-1 ${i ? 'ligne-t' : ''}`}>
                        <span className="nb w-4 text-right text-[var(--encre-pale)]">{i + 1}</span>
                        <NomMarque nom={x.nom} nous={ouverte.rang === i + 1} />
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div>
                <p className="sous-titre bloc-titre">{t('Sources citées')} <span className="chiffre">({citees.length})</span></p>
                {citees.length === 0 ? <p className="second mt-1.5">{t('Aucune source affichée avec cette réponse.')}</p> : (
                  <ol className="mt-1">
                    {citees.map((s, i) => (
                      <li key={s.id} className={`grid grid-cols-[1.25rem_auto_minmax(0,1fr)] items-start gap-2 py-1 ${i ? 'ligne-t' : ''}`}>
                        <span className="nb text-[var(--encre-pale)]">{i + 1}</span>
                        <Initiale nom={s.videoYoutube?.chaineNom ?? s.domaine} nous={estALaMarque(s, m.marque)} taille="p" />
                        <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="min-w-0 hover:underline" title={s.url}>
                          <span className="font-semibold">{s.videoYoutube ? `YouTube · ${s.videoYoutube.chaineNom}` : s.domaine}</span>
                          <span className="second block truncate">{s.videoYoutube?.titre ?? s.titre ?? adresseCourte(s.url)}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </>
          )}
        </PanneauLateral>
      )}
    </div>
  )
}
