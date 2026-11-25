import Link from 'next/link'
import { debutDe } from '@/lib/courbes'
import { tr } from '@/lib/i18n/courante'
import { jourCourt, nomCourt } from '@/lib/libelles'
import type { ReleveLu } from '@/lib/mesures'
import { EtatLu, Tampon } from './Blocs'
import { TableauTriable } from './TableauTriable'

/** Adresse d'une réponse précise : la question, l'IA et le jour du relevé. */
export const lienReponse = (r: ReleveLu) => `/questions/${r.question.id}?releve=${r.jour}&ia=${r.moteur}#reponses`

const ORDRE_ETAT: Record<string, number> = { citee: 0, nommee: 1, lue: 2, absente: 3, vide: 4, attente: 5, echec: 6 }

/**
 * Liste de réponses, la preuve derrière chaque chiffre : la question, le début
 * de la réponse (jamais traduit : c'est la donnée relevée), l'IA en toutes
 * lettres, les marques nommées, notre présence, la date. Triable ; avec
 * `recherche`, on cherche dedans. Un clic ouvre la réponse : sur sa page de
 * question, ou dans un panneau si `ouvrir` donne une adresse sur place.
 */
export function ListeReponses({ releves, vide, recherche = false, ouvrir }: { releves: ReleveLu[]; vide?: string; recherche?: boolean; /** Adresse qui ouvre la réponse dans un panneau, sur le même écran. */ ouvrir?: (r: ReleveLu) => string }) {
  if (releves.length === 0) return <p className="second px-4 py-4">{vide ?? tr('Aucune réponse à montrer.')}</p>
  return (
    <TableauTriable
      libelle={tr('Réponses')}
      recherche={recherche ? tr('Chercher dans les questions, les réponses, les marques') : undefined}
      colonnes={[
        { libelle: tr('Question et début de la réponse') },
        { libelle: tr('IA') },
        { libelle: tr('Marques nommées'), triable: false },
        { libelle: tr('Notre présence') },
        { libelle: tr('Sources'), num: true },
        { libelle: tr('Date'), num: true },
      ]}
      lignes={releves.map((r) => {
        const citees = r.sources.filter((s) => s.role === 'citee').length
        const debut = r.statut === 'recu' ? debutDe(r.texte) : r.statut === 'vide' ? tr('Aucune réponse affichée pour cette question ce jour-là.') : r.statut === 'en_attente' ? tr('Réponse pas encore revenue.') : `${tr('Échec')} : ${r.erreur ?? tr('raison inconnue')}`
        return {
          cle: r.id,
          href: ouvrir ? ouvrir(r) : lienReponse(r),
          surPlace: !!ouvrir,
          recherche: `${r.question.texte} ${nomCourt(r.moteur)} ${r.marques.map((x) => x.nom).join(' ')} ${r.texte ?? ''}`.slice(0, 6000),
          tri: [r.question.texte, nomCourt(r.moteur), null, ORDRE_ETAT[r.etat] ?? 9, r.statut === 'recu' ? citees : null, r.createdAt.getTime()],
          cellules: [
            <span key="q" className="block min-w-[16rem] max-w-[34rem]">
              <Link href={ouvrir ? ouvrir(r) : lienReponse(r)} scroll={!ouvrir} className="ligne-lien font-semibold">{r.question.texte}</Link>
              <span className="second mt-0.5 block font-normal">{debut}</span>
            </span>,
            <span key="ia" className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 whitespace-nowrap"><span className="font-semibold">{nomCourt(r.moteur)}</span><Tampon methode={r.methode} /></span>,
            r.statut !== 'recu' ? '' : !r.marquesLues ? <span key="m" className="second discret">{tr('pas encore lues')}</span> : r.marques.length === 0 ? <span key="m" className="second discret">{tr('aucune')}</span> : (
              <span key="m" className="second block max-w-[16rem]">
                {r.marques.slice(0, 4).map((x) => x.nom).join(', ')}
                {r.marques.length > 4 && <span className="discret"> {tr('et {n} de plus', { n: r.marques.length - 4 })}</span>}
              </span>
            ),
            <EtatLu key="e" r={r} />,
            r.statut === 'recu' ? citees : '',
            <span key="d" className="whitespace-nowrap">{jourCourt(r.createdAt)}</span>,
          ],
        }
      })}
    />
  )
}
