'use client'

import { useState, useTransition } from 'react'
import { useT } from '@/lib/i18n/client'
import { creerProjet, verifierProprietes } from '../actions'
import { Detection } from '../Detection'

type Option = { code: string; nom: string }
type Reconnu = Awaited<ReturnType<typeof verifierProprietes>>

const lignes = (texte: string) => [...new Set(texte.split(/\r?\n/).map((l) => l.trim()).filter(Boolean))]
const ETAPES = ['La marque', 'Ses propriétés', 'Le marché', 'Les concurrents', 'Les questions', 'Récapitulatif']

/**
 * Création d'un projet en cinq étapes courtes, puis un récapitulatif avec le
 * prix d'un premier relevé. Tous les champs restent dans un seul formulaire :
 * rien n'est enregistré avant le dernier bouton.
 */
export function Creation({ pays, langues, prixInterface, erreur }: { pays: Option[]; langues: Option[]; prixInterface: number; erreur?: string }) {
  const { t, f } = useT()
  const [etape, setEtape] = useState(0)
  const [v, setV] = useState({ marque: '', sites: '', chaines: '', profils: '', pays: 'FR', langue: 'fr', concurrents: '', questions: '' })
  const [reconnu, setReconnu] = useState<Reconnu | null>(null)
  const [verification, verifier] = useTransition()
  const champ = (cle: keyof typeof v) => ({ name: cle, value: v[cle], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV((x) => ({ ...x, [cle]: e.target.value })) })
  const nbQuestions = lignes(v.questions).length
  const suivant = () => {
    if (etape === 0 && !v.marque.trim()) return
    // En quittant l'étape des propriétés, on montre ce que l'outil a compris.
    if (etape === 1) verifier(async () => setReconnu(await verifierProprietes(lignes(v.sites), lignes(v.chaines), lignes(v.profils))))
    setEtape((e) => Math.min(e + 1, ETAPES.length - 1))
  }
  const cache = (i: number) => (etape === i ? '' : 'hidden')

  return (
    <form
      action={creerProjet}
      className="ecran"
      onSubmit={(e) => {
        // La touche Entrée dans un champ ne crée pas le projet : elle passe à l'étape suivante.
        if (etape < ETAPES.length - 1) {
          e.preventDefault()
          suivant()
        }
      }}
    >
      <ol className="flex flex-wrap border-b border-[var(--encre)]" aria-label={t('Étapes de la création')}>
        {ETAPES.map((nom, i) => (
          <li key={nom} className="flex-1 border-r border-[var(--filet)] last:border-r-0">
            <button type="button" onClick={() => (i <= etape || v.marque.trim() ? setEtape(i) : undefined)} aria-current={i === etape ? 'step' : undefined} className={`block w-full whitespace-nowrap px-3 py-2 text-left text-[0.8125rem] ${i === etape ? 'bg-[var(--encre)] font-semibold text-[var(--papier)]' : i < etape ? 'text-[var(--encre)]' : 'text-[var(--encre-pale)]'}`}>
              <span className="chiffre mr-1.5">{i + 1}</span>{t(nom)}
            </button>
          </li>
        ))}
      </ol>
      {erreur && <p className="bandeau erreur m-4" role="alert">{erreur}</p>}

      <div className="p-4 md:p-6">
        <fieldset className={cache(0)}>
          <legend className="titre text-[1.5rem]">{t('Quelle marque suivre ?')}</legend>
          <label className="libelle mt-4 max-w-xl">
            {t('Nom de la marque')}
            <span className="aide">{t('C’est ce nom qui est cherché dans le texte des réponses. Ses autres écritures s’ajoutent ensuite, dans la fiche du projet.')}</span>
            <input {...champ('marque')} required placeholder={t('Ex. Facturo')} className="champ mt-1" autoFocus />
          </label>
        </fieldset>

        <fieldset className={cache(1)}>
          <legend className="titre text-[1.5rem]">{t('Ce qui appartient à la marque')}</legend>
          <p className="mt-1 max-w-2xl text-[var(--encre-douce)]">{t('Une page de ces sites, une vidéo de ces chaînes ou une publication de ces profils, citée par une IA, compte pour la marque. Facultatif : tout se complète ensuite.')}</p>
          <div className="mt-4 grid max-w-5xl gap-4 md:grid-cols-3">
            <label className="libelle">
              {t('Sites')}
              <span className="aide">{t('Un par ligne.')}</span>
              <textarea {...champ('sites')} rows={3} placeholder={'exemple.fr\nblog.exemple.fr'} className="champ mt-1" />
            </label>
            <label className="libelle">
              {t('Chaînes YouTube')}
              <span className="aide">{t('Une par ligne : l’adresse de la chaîne, ou son nom précédé de @.')}</span>
              <textarea {...champ('chaines')} rows={Math.min(8, Math.max(3, v.chaines.split('\n').length))} placeholder={t('https://www.youtube.com/@MaChaine')} className="champ mt-1" />
            </label>
            <label className="libelle">
              {t('Réseaux sociaux')}
              <span className="aide">{t('Une adresse de profil par ligne : LinkedIn, Instagram, Facebook, X, TikTok…')}</span>
              <textarea {...champ('profils')} rows={Math.min(8, Math.max(3, v.profils.split('\n').length))} placeholder={'https://www.linkedin.com/company/exemple'} className="champ mt-1" />
            </label>
          </div>
          <div className="mt-3 max-w-3xl">
            <Detection
              sites={lignes(v.sites)}
              onTrouve={(x) => setV((a) => ({ ...a, profils: lignes(`${a.profils}\n${x.profils.join('\n')}`).join('\n'), chaines: lignes(`${a.chaines}\n${x.chaines.join('\n')}`).join('\n') }))}
            />
          </div>
        </fieldset>

        <fieldset className={cache(2)}>
          <legend className="titre text-[1.5rem]">{t('D’où et dans quelle langue les questions sont posées')}</legend>
          <p className="mt-1 max-w-2xl text-[var(--encre-douce)]">{t('Le pays et la langue ne se changent plus après le premier relevé : les courbes doivent rester comparables.')}</p>
          <div className="mt-4 grid max-w-xl gap-4 sm:grid-cols-2">
            <label className="libelle">
              {t('Pays')}
              <select {...champ('pays')} className="champ mt-1">{pays.map((p) => <option key={p.code} value={p.code}>{p.nom}</option>)}</select>
            </label>
            <label className="libelle">
              {t('Langue')}
              <select {...champ('langue')} className="champ mt-1">{langues.map((l) => <option key={l.code} value={l.code}>{l.nom}</option>)}</select>
            </label>
          </div>
        </fieldset>

        <fieldset className={cache(3)}>
          <legend className="titre text-[1.5rem]">{t('Les concurrents à comparer')}</legend>
          <label className="libelle mt-4 max-w-xl">
            {t('Concurrents')}
            <span className="aide">{t('Un nom de marque par ligne. Facultatif : après le premier relevé, l’outil propose les marques que les IA nomment le plus.')}</span>
            <textarea {...champ('concurrents')} rows={5} placeholder={t('Un nom de marque par ligne')} className="champ mt-1" />
          </label>
        </fieldset>

        <fieldset className={cache(4)}>
          <legend className="titre text-[1.5rem]">{t('Les questions de vos clients')}</legend>
          <label className="libelle mt-4 max-w-2xl">
            {t('Questions à suivre')}
            <span className="aide">{t('Une question par ligne, comme un client la poserait à une IA. Dix suffisent pour commencer.')}</span>
            <textarea {...champ('questions')} rows={8} placeholder={t('Quel logiciel choisir pour… ?')} className="champ mt-1" />
          </label>
          <p className="second mt-2" aria-live="polite">{t('{n} [n:question|questions] · un relevé d’interface (4 IA) coûtera environ {prix}.', { n: nbQuestions, prix: f.usdFin(nbQuestions * 4 * prixInterface) })}</p>
        </fieldset>

        <div className={cache(5)}>
          <p className="titre text-[1.5rem]">{t('Récapitulatif')}</p>
          <dl className="mt-4 grid max-w-3xl gap-x-8 gap-y-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <dt className="etiquette pt-0.5">{t('Marque')}</dt>
            <dd className="font-semibold">{v.marque || <span className="text-[var(--absent-texte)]">{t('à saisir à l’étape 1')}</span>}</dd>
            <dt className="etiquette pt-0.5">{t('Marché')}</dt>
            <dd>{pays.find((p) => p.code === v.pays)?.nom} · {langues.find((l) => l.code === v.langue)?.nom}</dd>
            <dt className="etiquette pt-0.5">{t('Sites reconnus')}</dt>
            <dd>
              {verification ? t('Vérification…') : !reconnu || reconnu.sites.length === 0 ? <span className="second">{t('aucun')}</span> : reconnu.sites.map((s) => <span key={s.saisie} className="block">{s.domaine ? <><span className="font-semibold">{s.domaine}</span>{s.domaine !== s.saisie && <span className="second discret"> {t('(saisi :')} {s.saisie})</span>}</> : <span className="text-[var(--absent-texte)]">{t('Non reconnu :')} {s.saisie}</span>}</span>)}
            </dd>
            <dt className="etiquette pt-0.5">{t('Chaînes reconnues')}</dt>
            <dd>
              {verification ? t('Vérification…') : !reconnu || reconnu.chaines.length === 0 ? <span className="second">{t('aucune')}</span> : reconnu.chaines.map((c) => <span key={c.saisie} className="block">{c.id ? <><span className="font-semibold">{c.nom}</span><span className="second discret chiffre"> · {c.id}</span></> : <span className="text-[var(--absent-texte)]">{t('Non reconnue :')} {c.saisie}</span>}</span>)}
            </dd>
            <dt className="etiquette pt-0.5">{t('Réseaux reconnus')}</dt>
            <dd>
              {verification ? t('Vérification…') : !reconnu || reconnu.profils.length === 0 ? <span className="second">{t('aucun')}</span> : reconnu.profils.map((p) => <span key={p.saisie} className="block">{p.valeur ? <><span className="font-semibold">{p.reseau}</span><span className="second discret chiffre"> · {p.valeur}</span></> : <span className="text-[var(--absent-texte)]">{t('Non reconnu :')} {p.saisie}</span>}</span>)}
            </dd>
            <dt className="etiquette pt-0.5">{t('Concurrents')}</dt>
            <dd>{lignes(v.concurrents).length ? lignes(v.concurrents).join(', ') : <span className="second">{t('aucun pour l’instant')}</span>}</dd>
            <dt className="etiquette pt-0.5">{t('Questions')}</dt>
            <dd>{nbQuestions ? <>{t('{n} [n:question|questions]', { n: nbQuestions })}<span className="second block">{lignes(v.questions).slice(0, 3).join(' · ')}{nbQuestions > 3 ? ' …' : ''}</span></> : <span className="second">{t('aucune pour l’instant')}</span>}</dd>
            <dt className="etiquette pt-0.5">{t('Prix d’un premier relevé')}</dt>
            <dd><span className="chiffre font-semibold">{f.usdFin(nbQuestions * 4 * prixInterface)}</span> {t('environ, pour 4 IA relevées par l’interface.')}<span className="second block">{t('Créer le projet ne coûte rien : la dépense commence quand vous lancez un relevé, et son prix s’affiche avant.')}</span></dd>
          </dl>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--encre)] px-4 py-3 md:px-6">
        <button type="button" onClick={() => setEtape((e) => Math.max(0, e - 1))} disabled={etape === 0} className="bouton bouton-creux">{t('← Précédent')}</button>
        {etape < ETAPES.length - 1 ? (
          <button type="button" onClick={suivant} disabled={etape === 0 && !v.marque.trim()} className="bouton">{t('Suivant →')}</button>
        ) : (
          <button type="submit" disabled={!v.marque.trim()} className="bouton">{t('Créer le projet')}</button>
        )}
      </div>
    </form>
  )
}
