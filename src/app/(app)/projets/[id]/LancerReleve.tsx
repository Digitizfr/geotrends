'use client'

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useT } from '@/lib/i18n/client'
import { lancerReleve } from '../actions'

export type LigneLancement = {
  moteur: string
  nom: string
  api: boolean
  /** Prix d'une question pour cette IA, en dollars. */
  prix: number
  /** Dernier relevé de cette IA, déjà écrit en français, ou null. */
  dernier: string | null
  /** Jours écoulés depuis ce relevé. */
  joursDepuis: number | null
  /** Rythme conseillé, en jours : 7 pour l'interface, 14 pour Claude. */
  rythme: number
}


function Envoyer({ total, bloque }: { total: string; bloque: boolean }) {
  const { pending } = useFormStatus()
  const { t } = useT()
  return (
    <button type="submit" disabled={pending || bloque} className="bouton">
      {pending ? t('Envoi en cours…') : t('Lancer le relevé : {prix}', { prix: total })}
    </button>
  )
}

/**
 * Le bloc « Lancer un relevé » : une ligne par IA avec son prix, un total qui
 * se recalcule à chaque case cochée, et ce que deviendra la dépense du mois.
 * Rien ne part sans le clic sur le bouton, dont le libellé porte le prix.
 */
export function LancerReleve({ projetId, questions, lignes, depense, plafond, seuil, prixLecture, action = lancerReleve, champs }: {
  projetId: string; questions: number; lignes: LigneLancement[]; depense: number; plafond: number; seuil: number; prixLecture: number
  /** Une autre action d'envoi (les questions d'une page suivie, par exemple), avec ses champs cachés. */
  action?: (donnees: FormData) => Promise<void>; champs?: Record<string, string>
}) {
  const { t, f } = useT()
  // Prix d'un envoi : quatre décimales sous dix centimes ; totaux du mois : deux.
  const usd = (n: number, fin = false) => (fin ? f.usdFin(n) : f.usd(n))
  // Claude coûte bien plus cher : décoché par défaut, à relever toutes les deux semaines.
  const [coches, setCoches] = useState<string[]>(lignes.filter((l) => !l.api).map((l) => l.moteur))
  const dialogue = useRef<HTMLDialogElement>(null)
  const formulaire = useRef<HTMLFormElement>(null)
  const confirme = useRef(false)
  const choisies = lignes.filter((l) => coches.includes(l.moteur))
  const total = choisies.reduce((n, l) => n + l.prix * questions, 0)
  const lecture = choisies.length * questions * prixLecture
  const apres = depense + total
  const depasse = apres > plafond
  const trop = total > seuil
  const basculer = (moteur: string) => setCoches((c) => (c.includes(moteur) ? c.filter((x) => x !== moteur) : [...c, moteur]))

  return (
    <form
      ref={formulaire}
      action={action}
      onSubmit={(e) => {
        // Au-dessus du seuil réglable, on demande une confirmation avant d'envoyer.
        if (trop && !confirme.current) {
          e.preventDefault()
          dialogue.current?.showModal()
        }
        confirme.current = false
      }}
    >
      <input type="hidden" name="projetId" value={projetId} />
      {Object.entries(champs ?? {}).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <div className="defile">
        <table className="tableau">
          <thead>
            <tr>
              <th scope="col" className="fixe">{t('IA')}</th>
              <th scope="col">{t('Méthode')}</th>
              <th scope="col">{t('Dernier relevé')}</th>
              <th scope="col" className="num">{t('Prix par question')}</th>
              <th scope="col" className="num">{t('Pour {n} [n:question|questions]', { n: questions })}</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => {
              const tot = l.joursDepuis !== null && l.joursDepuis < l.rythme
              return (
                <tr key={l.moteur} className={l.api ? 'a-part' : ''}>
                  <th scope="row" className="fixe">
                    <label className="flex cursor-pointer items-center gap-2 font-semibold">
                      <input type="checkbox" name={`moteur_${l.moteur}`} checked={coches.includes(l.moteur)} onChange={() => basculer(l.moteur)} />
                      {l.nom}
                    </label>
                  </th>
                  <td><span className={`tampon ${l.api ? 'api' : 'interface'}`}>{l.api ? 'API' : t('interface')}</span><span className="second ml-2">{l.api ? t('réponse du modèle seul') : t('ce que voit l’internaute')}</span></td>
                  <td>
                    {l.dernier ?? <span className="second discret">{t('jamais relevée')}</span>}
                    {tot && <span className="second block text-[var(--absent-texte)]">{t('Rythme conseillé : dans {n} [n:jour|jours]', { n: l.rythme - l.joursDepuis! })}</span>}
                  </td>
                  <td className="num">{usd(l.prix, true)}</td>
                  <td className="num font-semibold">{coches.includes(l.moteur) ? usd(l.prix * questions, true) : <span className="discret font-normal">{t('non cochée')}</span>}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="fixe" colSpan={4}>
                <span className="font-bold">{t('Total de cet envoi')}</span>
                <span className="second block font-normal">{t('{ia} IA × {n} [n:question|questions] = {envois} [envois:envoi|envois]', { ia: choisies.length, n: questions, envois: choisies.length * questions })}</span>
              </th>
              <td className="num text-[1.125rem] font-bold" aria-live="polite">{usd(total, true)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="grid gap-x-8 gap-y-4 border-t border-[var(--filet)] px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="text-[0.875rem]">{t('Après cet envoi :')} <strong className="chiffre font-semibold">{usd(apres)}</strong> {t('sur')} <span className="chiffre">{usd(plafond)}</span> {t('de plafond ce mois-ci.')}</p>
          <div className={`jauge mt-2 max-w-xl ${depasse ? 'depasse' : ''}`} role="img" aria-label={t('Dépense du mois après l’envoi : {apres} sur {plafond}', { apres: usd(apres), plafond: usd(plafond) })}>
            <span className="prevu" style={{ width: `${Math.min(100, plafond ? (apres / plafond) * 100 : 100)}%`, height: '100%' }} />
            <span style={{ width: `${Math.min(100, plafond ? (depense / plafond) * 100 : 100)}%`, position: 'relative' }} />
          </div>
          <p className="second mt-2">{t('Déjà dépensé :')} <span className="chiffre">{usd(depense)}</span> {t('(trait plein). Cet envoi : hachures. La lecture automatique des réponses ajoutera ensuite environ')} <span className="chiffre">{usd(lecture, true)}</span>{t('. Rythme conseillé : chaque semaine, et toutes les deux semaines pour Claude.')}</p>
          {depasse && <p className="mt-2 font-semibold text-[var(--absent-texte)]">{t('Cet envoi dépasserait le plafond du mois.')}</p>}
        </div>
        <Envoyer total={usd(total, true)} bloque={questions === 0 || choisies.length === 0} />
      </div>
      <dialog ref={dialogue} className="dialogue" aria-label={t('Confirmer l’envoi')}>
        <p className="titre text-[1.375rem]">{t('Envoyer pour {prix} ?', { prix: usd(total) })}</p>
        <p className="mt-2 text-[var(--encre-douce)]">{t('Cet envoi dépasse le seuil de confirmation ({seuil}). {n} questions partiront vers {noms}.', { seuil: usd(seuil), n: choisies.length * questions, noms: choisies.map((l) => l.nom).join(', ') })}</p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" className="bouton bouton-creux" onClick={() => dialogue.current?.close()}>{t('Annuler')}</button>
          <button
            type="button"
            className="bouton"
            onClick={() => {
              confirme.current = true
              dialogue.current?.close()
              formulaire.current?.requestSubmit()
            }}
          >
            {t('Confirmer l’envoi : {prix}', { prix: usd(total) })}
          </button>
        </div>
      </dialog>
    </form>
  )
}
