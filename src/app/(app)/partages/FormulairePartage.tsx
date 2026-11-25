'use client'

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useT } from '@/lib/i18n/client'
import { enregistrerPartage } from './actions'

export type QuestionAPartager = { id: string; texte: string; theme: string | null; reponses: number }
export type IAAPartager = { cle: string; nom: string; api: boolean }
export type Valeurs = {
  id?: string
  titre: string
  destinataire: string
  questions: string[]
  moteurs: string[]
  langue: 'fr' | 'en'
  reponses: boolean
  concurrents: boolean
  expireLe: string
}

function Envoyer({ modification }: { modification: boolean }) {
  const { t } = useT()
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="bouton">
      {pending ? t('Enregistrement…') : modification ? t('Enregistrer les changements') : t('Créer le lien de partage')}
    </button>
  )
}

/** Le formulaire d'un partage : les questions, les IA, la langue et ce qui est montré. Aucun appel payant. */
export function FormulairePartage({ questions, ias, valeurs, annuler }: { questions: QuestionAPartager[]; ias: IAAPartager[]; valeurs: Valeurs; annuler?: string }) {
  const { t } = useT()
  const racine = useRef<HTMLFormElement>(null)
  const [n, setN] = useState(() => valeurs.questions.filter((id) => questions.some((q) => q.id === id)).length)
  const themes = [...new Set(questions.map((q) => q.theme).filter((x): x is string => !!x))].sort((a, b) => a.localeCompare(b))
  const cases = () => [...(racine.current?.querySelectorAll<HTMLInputElement>('input[name="q"]') ?? [])]
  const recompter = () => setN(cases().filter((c) => c.checked).length)
  const cocher = (filtre: (c: HTMLInputElement) => boolean, valeur: boolean) => {
    for (const c of cases()) if (filtre(c)) c.checked = valeur
    recompter()
  }

  return (
    <form ref={racine} action={enregistrerPartage} onChange={recompter} className="grid gap-5 p-4">
      {valeurs.id && <input type="hidden" name="id" value={valeurs.id} />}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="libelle">
          {t('Titre de la page')}
          <input name="titre" defaultValue={valeurs.titre} maxLength={140} required className="champ mt-1" />
        </label>
        <label className="libelle">
          {t('Pour qui (facultatif)')}
          <input name="destinataire" defaultValue={valeurs.destinataire} maxLength={140} placeholder={t('Équipe marketing de la marque')} className="champ mt-1" />
        </label>
      </div>

      <fieldset>
        <legend className="libelle">{t('Questions montrées')} <span className="second font-normal">· {t('{n} [n:cochée|cochées] sur {total}', { n, total: questions.length })}</span></legend>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8125rem]">
          <button type="button" className="lien" onClick={() => cocher(() => true, true)}>{t('Tout cocher')}</button>
          <button type="button" className="lien" onClick={() => cocher(() => true, false)}>{t('Tout décocher')}</button>
          {themes.length > 1 && <span className="second">{t('Par thème :')}</span>}
          {themes.length > 1 && themes.map((th) => (
            <button key={th} type="button" className="lien" onClick={() => cocher((c) => c.dataset.theme === th, true)}>{th}</button>
          ))}
        </div>
        <ul className="liste-cases mt-2">
          {questions.map((q) => (
            <li key={q.id}>
              <label className="flex items-start gap-2.5 py-1.5">
                <input type="checkbox" name="q" value={q.id} defaultChecked={valeurs.questions.includes(q.id)} data-theme={q.theme ?? ''} className="mt-1" />
                <span className="min-w-0">
                  <span className="block">{q.texte}</span>
                  <span className="second block">{q.theme ? `${q.theme} · ` : ''}{q.reponses ? t('{n} [n:réponse relevée|réponses relevées]', { n: q.reponses }) : t('pas encore relevée')}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="grid gap-5 md:grid-cols-2">
        <fieldset>
          <legend className="libelle">{t('IA montrées')}</legend>
          <p className="second">{t('Aucune cochée : toutes celles du projet.')}</p>
          <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1.5">
            {ias.map((ia) => (
              <label key={ia.cle} className="flex items-center gap-2">
                <input type="checkbox" name="ia" value={ia.cle} defaultChecked={valeurs.moteurs.includes(ia.cle)} />
                <span>{ia.nom}{ia.api ? ' (API)' : ''}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="libelle">{t('Ce que voit la personne')}</legend>
          <label className="mt-1.5 flex items-start gap-2">
            <input type="checkbox" name="reponses" defaultChecked={valeurs.reponses} className="mt-1" />
            <span>{t('Un extrait de chaque réponse')}</span>
          </label>
          <label className="mt-1 flex items-start gap-2">
            <input type="checkbox" name="concurrents" defaultChecked={valeurs.concurrents} className="mt-1" />
            <span>{t('Les marques nommées dans les réponses (concurrents compris)')}</span>
          </label>
          <p className="second mt-1">{t('Toujours montrés : la présence de la marque IA par IA, le bilan de chaque question et les pages citées.')}</p>
        </fieldset>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,14rem)_minmax(0,14rem)_1fr] md:items-end">
        <label className="libelle">
          {t('Langue de la page')}
          <select name="langue" defaultValue={valeurs.langue} className="champ mt-1">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="libelle">
          {t('Date de fin (facultative)')}
          <input type="date" name="expireLe" defaultValue={valeurs.expireLe} className="champ mt-1" />
        </label>
        <p className="second">{t('Après cette date, la page ne s’ouvre plus. Sans date, le lien marche jusqu’à ce que vous le coupiez.')}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Envoyer modification={!!valeurs.id} />
        {annuler && <a href={annuler} className="bouton bouton-creux">{t('Annuler')}</a>}
        <span className="second">{t('Gratuit : la page lit les relevés déjà faits, elle ne lance rien.')}</span>
      </div>
    </form>
  )
}
