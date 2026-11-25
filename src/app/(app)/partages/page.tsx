import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { CommentLire, EnTete, Feuille, Vide } from '@/components/outil/Blocs'
import { BoutonEnvoi } from '@/components/outil/BoutonEnvoi'
import { projetAffiche, titreOnglet } from '@/lib/contexte'
import { traducteur } from '@/lib/i18n/serveur'
import { dateHeure, jourLong, nomCourt, pluriel } from '@/lib/libelles'
import { lireMesuresBrutes, METHODE } from '@/lib/mesures'
import { etatDuLien, estMoteur } from '@/lib/partages'
import { prisma } from '@/lib/prisma'
import { exigerSession } from '@/lib/session'
import { changerAdresse, couperPartage, rouvrirPartage, supprimerPartage } from './actions'
import { CopierLien, SupprimerPartage } from './Gestes'
import { FormulairePartage, type Valeurs } from './FormulairePartage'

export const dynamic = 'force-dynamic'
export const generateMetadata = () => titreOnglet('Partages')

const base = () => (process.env.BETTER_AUTH_URL || 'https://geotrends.io').replace(/\/+$/, '')
const jourISO = (d: Date | null) => (d ? new Date(d.getTime() + 3_600_000).toISOString().slice(0, 10) : '')

/**
 * Partages : des pages privées, sans compte, qu'un client ou un partenaire
 * consulte pour une série de questions du projet affiché. Créer, copier,
 * modifier, couper un lien. Rien de payant.
 */
export default async function EcranPartages({ searchParams }: { searchParams: Promise<{ nouveau?: string; q?: string; modifier?: string; cree?: string }> }) {
  const t = await traducteur()
  const [, projet, sp] = await Promise.all([exigerSession(), projetAffiche(), searchParams])
  if (!projet) redirect('/projets')
  const [m, partages] = await Promise.all([
    lireMesuresBrutes(projet.id),
    prisma.partage.findMany({ where: { projetId: projet.id }, orderBy: { createdAt: 'desc' } }),
  ])
  if (!m) redirect('/projets')

  const questions = m.questions.map((q) => ({ id: q.id, texte: q.texte, theme: q.theme, reponses: q.tous.filter((r) => r.statut === 'recu').length }))
  const textes = new Map(questions.map((q) => [q.id, q.texte]))
  const ias = m.moteursProjet.map((x) => ({ cle: x, nom: nomCourt(x), api: METHODE[x] === 'api' }))
  const enModification = sp.modifier ? partages.find((p) => p.id === sp.modifier) : undefined
  const preselection = (sp.q ?? '').split(',').filter((id) => textes.has(id))
  const ouvert = !!enModification || sp.nouveau === '1' || partages.length === 0
  const valeurs: Valeurs = enModification
    ? {
        id: enModification.id, titre: enModification.titre, destinataire: enModification.destinataire ?? '', questions: enModification.questions, moteurs: enModification.moteurs,
        langue: enModification.langue === 'en' ? 'en' : 'fr', reponses: enModification.reponses, concurrents: enModification.concurrents, expireLe: jourISO(enModification.expireLe),
      }
    : {
        titre: t('{marque} dans les réponses des IA', { marque: m.marque.nom }), destinataire: '', questions: preselection, moteurs: [],
        langue: projet.langue === 'en' ? 'en' : 'fr', reponses: true, concurrents: true, expireLe: '',
      }
  const actifs = partages.filter((p) => etatDuLien(p) === 'actif').length

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Suivre') }, { libelle: t('Partages') }]} />
      <EnTete
        titre={t('Partages')}
        verdict={partages.length === 0
          ? t('Aucun lien de partage pour {projet}.', { projet: projet.nom })
          : t('{n} [n:lien actif|liens actifs] sur {total} pour {projet}.', { n: actifs, total: partages.length, projet: projet.nom })}
      >
        {t('Une page privée, sans compte ni mot de passe, qu’un client ou un partenaire ouvre pour voir où en est la marque sur une série de questions. Elle se met à jour à chaque relevé et ne montre rien d’autre.')}
      </EnTete>

      {ouvert ? (
        <Feuille id="formulaire" titre={enModification ? t('Modifier « {titre} »', { titre: enModification.titre }) : t('Nouveau partage')} droite={t('gratuit')}>
          {questions.length === 0
            ? <p className="second p-4">{t('Ce projet n’a pas encore de question.')} <Link href={`/projets/${projet.id}?onglet=questions`} className="lien">{t('Écrire des questions')}</Link></p>
            : <FormulairePartage questions={questions} ias={ias} valeurs={valeurs} annuler={partages.length ? '/partages' : undefined} />}
        </Feuille>
      ) : (
        <p><Link href="/partages?nouveau=1#formulaire" className="bouton">{t('Nouveau partage')}</Link></p>
      )}

      {partages.length > 0 ? (
        <Feuille titre={t('Liens de partage')} droite={pluriel(partages.length, 'lien')}>
          <ul>
            {partages.map((p, i) => {
              const etat = etatDuLien(p)
              const lien = `${base()}/partage/${p.jeton}`
              const montrees = p.questions.filter((id) => textes.has(id))
              const moteurs = p.moteurs.filter(estMoteur)
              return (
                <li key={p.id} id={`partage-${p.id}`} className={`px-4 py-4 ${i ? 'ligne-t' : ''} ${sp.cree === p.id ? 'bg-[var(--clair)]' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{p.titre}</p>
                      <p className="second">
                        {p.destinataire ? `${t('Pour {qui}', { qui: p.destinataire })} · ` : ''}
                        {pluriel(montrees.length, 'question')} · {moteurs.length ? moteurs.map((x) => nomCourt(x)).join(', ') : t('toutes les IA')} · {p.langue === 'en' ? 'English' : 'Français'}
                        {!p.reponses ? ` · ${t('sans extraits')}` : ''}{!p.concurrents ? ` · ${t('sans les marques nommées')}` : ''}
                      </p>
                      <p className="second">
                        {t('Créé le {date}', { date: jourLong(p.createdAt) })}{p.auteur ? ` ${t('par {qui}', { qui: p.auteur })}` : ''}
                        {' · '}
                        {p.vues ? t('ouvert {n} [n:fois|fois], la dernière le {date}', { n: p.vues, date: dateHeure(p.derniereVue ?? p.updatedAt) }) : t('pas encore ouvert')}
                        {p.expireLe ? ` · ${etat === 'expire' ? t('expiré le {date}', { date: jourLong(p.expireLe) }) : t('jusqu’au {date}', { date: jourLong(p.expireLe) })}` : ''}
                      </p>
                    </div>
                    <span className={`pastille ${etat === 'actif' ? 'cite' : etat === 'coupe' ? 'absent' : 'neutre'}`}>
                      <span className="signe" aria-hidden="true">{etat === 'actif' ? '●' : '○'}</span>
                      {etat === 'actif' ? t('Actif') : etat === 'coupe' ? t('Coupé') : t('Expiré')}
                    </span>
                  </div>
                  {etat === 'actif' && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input readOnly value={lien} className="champ !w-auto min-w-0 flex-1 font-mono text-[0.8125rem]" aria-label={t('Adresse de la page')} />
                      <CopierLien lien={lien} />
                      <a href={lien} target="_blank" rel="noopener" className="bouton bouton-creux bouton-petit">{t('Ouvrir la page')}</a>
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Link href={`/partages?modifier=${p.id}#formulaire`} className="bouton bouton-creux bouton-petit">{t('Modifier')}</Link>
                    {etat === 'coupe' ? (
                      <form action={rouvrirPartage}><input type="hidden" name="id" value={p.id} /><BoutonEnvoi className="bouton bouton-creux bouton-petit">{t('Rouvrir le lien')}</BoutonEnvoi></form>
                    ) : (
                      <form action={couperPartage}><input type="hidden" name="id" value={p.id} /><BoutonEnvoi className="bouton bouton-creux bouton-petit">{t('Couper le lien')}</BoutonEnvoi></form>
                    )}
                    <form action={changerAdresse}><input type="hidden" name="id" value={p.id} /><BoutonEnvoi className="bouton bouton-creux bouton-petit">{t('Changer l’adresse')}</BoutonEnvoi></form>
                    <SupprimerPartage id={p.id} titre={p.titre} action={supprimerPartage} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Feuille>
      ) : (
        !ouvert && <Vide titre={t('Aucun lien de partage')}>{t('Créez-en un pour montrer à un client où en est sa marque, sans lui ouvrir l’outil.')}</Vide>
      )}

      <CommentLire titre={t('Ce que voit la personne qui ouvre le lien')}>
        <p>{t('La marque, IA par IA : la part des réponses où elle est nommée ou citée, avec le nombre de réponses et la marge d’erreur ; l’évolution relevé après relevé ; puis chaque question, avec la dernière réponse de chaque IA, le bilan de toutes ses réponses et les pages citées, celles de la marque surlignées. Selon vos choix : un extrait des réponses et les marques nommées à la place.')}</p>
        <p>{t('Jamais : les autres questions, les autres projets, les coûts, le menu de l’outil. La page n’est pas proposée aux moteurs de recherche. Une ouverture n’est comptée que si la personne n’est pas connectée à l’outil.')}</p>
        <p>{t('Couper le lien le désactive tout de suite ; Changer l’adresse en fait un nouveau et rend l’ancien inutilisable.')}</p>
      </CommentLire>
    </div>
  )
}
