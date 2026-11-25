import Link from 'next/link'
import { PERIODE_DEFAUT, PERIODES } from '@/lib/filtres'
import { traducteur } from '@/lib/i18n/serveur'
import { jourLong, nomCourt, pluriel } from '@/lib/libelles'
import { compter, deMethode, METHODE, type Mesures } from '@/lib/mesures'
import { BarreFiltres } from './BarreFiltres'
import { BoutonMenu, BoutonRecherche } from './BoutonsBarre'
import { IcoChevronDroite, IcoTelecharger } from './Icones'
import { Initiale } from './Initiale'

export type Miette = { libelle: string; href?: string }

/**
 * La barre du haut, la même sur tous les écrans, toujours visible : le fil
 * d'Ariane à gauche, les filtres au milieu (sur les écrans de mesure), les
 * actions de l'écran à droite. Dessous, en petit, le rappel de ce qu'on
 * regarde : questions, réponses d'interface et réponses d'API, toujours
 * comptées à part.
 *
 * - `fil` : du groupe du menu jusqu'à l'écran (« Suivre », « Questions », le texte de la question).
 * - `m` : les mesures, sur un écran de mesure ; sans elles, pas de filtres.
 * - `exportCsv` : adresse de l'export de l'écran. `lancer` : montre « Lancer un relevé » (qui ouvre la fiche du projet : rien ne part d'ici).
 */
export async function BarreHaut({ fil, m, exportCsv, lancer = false, actions, filtres = true }: { fil: Miette[]; m?: Mesures | null; exportCsv?: string; lancer?: boolean; actions?: React.ReactNode; filtres?: boolean }) {
  const t = await traducteur()
  const ui = m ? compter(deMethode(m.releves, 'interface')) : null
  const api = m ? compter(deMethode(m.releves, 'api')) : null
  const dernier = m?.tous.at(-1)?.createdAt
  const avecApi = !!m && m.moteurs.some((x) => METHODE[x] === 'api')
  return (
    <div className="barre-haut">
      <div className="barre-ligne">
        <BoutonMenu />
        <nav aria-label={t('Fil d’Ariane')} className="fil">
          {m && <span className="fil-projet"><Initiale nom={m.projet.nom} nous taille="p" /><span className="truncate font-semibold">{m.projet.nom}</span></span>}
          <ol>
            {fil.map((x, i) => (
              <li key={`${i}:${x.libelle}`} aria-current={i === fil.length - 1 ? 'page' : undefined}>
                {i > 0 && <IcoChevronDroite taille={12} className="text-[var(--encre-pale)]" />}
                {x.href && i < fil.length - 1 ? <Link href={x.href} className="fil-lien">{x.libelle}</Link> : <span className="truncate">{x.libelle}</span>}
              </li>
            ))}
          </ol>
        </nav>
        {m && filtres && (
          <BarreFiltres
            periodes={PERIODES.map((p) => ({ cle: p.cle, libelle: t(p.libelle), court: t(p.court) }))}
            periode={m.filtres.periode}
            defaut={PERIODE_DEFAUT}
            interfaces={m.moteursProjet.filter((x) => METHODE[x] === 'interface').map((x) => ({ cle: x, libelle: nomCourt(x) }))}
            api={m.moteursProjet.filter((x) => METHODE[x] === 'api').map((x) => ({ cle: x, libelle: nomCourt(x) }))}
            masquees={m.filtres.masquees}
            actif={m.filtres.periode !== PERIODE_DEFAUT || m.filtres.masquees.length > 0 || !!m.face}
            concurrents={m.concurrents.map((c) => ({ cle: c.id, libelle: c.nom }))}
            concurrent={m.face?.id ?? ''}
          />
        )}
        <div className="barre-actions">
          {actions}
          {exportCsv && (
            <a href={exportCsv} className="bouton bouton-creux bouton-petit" download title={t('Exporter les données de cet écran en CSV')}>
              <IcoTelecharger taille={14} />
              <span className="barre-texte">{t('Exporter')}</span>
            </a>
          )}
          {lancer && m && (
            <Link href={`/projets/${m.projet.id}?onglet=releves`} className="bouton bouton-petit barre-lancer" title={t('Préparer un relevé : le prix s’affiche avant tout envoi')}>
              <span className="barre-texte-long">{t('Lancer un relevé')}</span>
              <span className="barre-texte-court">{t('Relevé')}</span>
            </Link>
          )}
          <BoutonRecherche />
        </div>
      </div>
      {m && ui && api && (
        <p className="barre-rappel">
          <span>{pluriel(m.questions.length, 'question')}</span>
          <span>{pluriel(ui.n, 'réponse')} {t('d’interface')}{ui.envoyes !== ui.n ? ` ${t('sur')} ${pluriel(ui.envoyes, 'relevé')}` : ''}</span>
          {avecApi && <span>{pluriel(api.n, 'réponse')} {t('d’API, comptées à part')}</span>}
          {m.enAttente > 0 && <span>{pluriel(m.enAttente, 'réponse')} {t('en attente')}</span>}
          <span>{dernier ? t('dernier relevé : {date}', { date: jourLong(dernier) }) : t('aucun relevé')}</span>
        </p>
      )}
      {m?.face && (
        <p className="barre-face">
          <strong className="font-semibold">{t('Filtre : seules les réponses qui nomment {nom} sont comptées.', { nom: m.face.nom })}</strong>{' '}
          <span className="text-[var(--encre-douce)]">{t('Les réponses dont les marques ne sont pas encore lues sont écartées.')}</span>
        </p>
      )}
    </div>
  )
}
