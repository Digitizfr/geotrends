'use client'

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useT } from '@/lib/i18n/client'
import { lancerMesureApprofondie } from '../actions'

const FOIS = [5, 10, 25]

function Envoyer({ total, bloque }: { total: string; bloque: boolean }) {
  const { pending } = useFormStatus()
  const { t } = useT()
  return (
    <button type="submit" disabled={pending || bloque} className="bouton">
      {pending ? t('Envoi en cours…') : t('Lancer la mesure approfondie : {prix}', { prix: total })}
    </button>
  )
}

/**
 * Mesure approfondie d'une question : la poser 5, 10 ou 25 fois de suite aux IA
 * d'interface cochées. Le prix exact est écrit sur le bouton, et recalculé à
 * chaque choix. Au-dessus du seuil réglable, une fenêtre demande confirmation.
 */
export function MesureApprofondie({ questionId, moteurs, prix, depense, plafond, seuil, prixLecture }: { questionId: string; moteurs: { cle: string; nom: string; recus: number }[]; prix: number; depense: number; plafond: number; seuil: number; prixLecture: number }) {
  const { t, f } = useT()
  // Petits montants : quatre décimales sous dix centimes ; les totaux du mois : deux.
  const usd = (n: number, fin = true) => (fin ? f.usdFin(n) : f.usd(n))
  const [fois, setFois] = useState(10)
  const [coches, setCoches] = useState<string[]>(moteurs.map((x) => x.cle))
  const dialogue = useRef<HTMLDialogElement>(null)
  const formulaire = useRef<HTMLFormElement>(null)
  const confirme = useRef(false)
  const envois = fois * coches.length
  const total = envois * prix
  const apres = depense + total
  const depasse = apres > plafond
  const atteint = depense >= plafond

  return (
    <form
      ref={formulaire}
      action={lancerMesureApprofondie}
      className="space-y-4 p-4"
      onSubmit={(e) => {
        if (total > seuil && !confirme.current) {
          e.preventDefault()
          dialogue.current?.showModal()
        }
        confirme.current = false
      }}
    >
      <input type="hidden" name="questionId" value={questionId} />
      <div className="grid gap-x-10 gap-y-4 lg:grid-cols-[auto_minmax(0,1fr)]">
        <fieldset>
          <legend className="etiquette">{t('Nombre de fois')}</legend>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {FOIS.map((n) => (
              <label key={n} className="choix">
                <input type="radio" name="fois" value={n} checked={fois === n} onChange={() => setFois(n)} />
                {t('{n} fois', { n })}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="etiquette">{t('IA relevées par l’interface')}</legend>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {moteurs.map((x) => (
              <label key={x.cle} className="choix">
                <input type="checkbox" name={`moteur_${x.cle}`} checked={coches.includes(x.cle)} onChange={() => setCoches((c) => (c.includes(x.cle) ? c.filter((y) => y !== x.cle) : [...c, x.cle]))} />
                {x.nom}
                <span className="chiffre text-[var(--encre-pale)]">· {t('{n} déjà', { n: x.recus })}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="grid gap-x-8 gap-y-3 border-t border-[var(--filet)] pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p aria-live="polite">
            <span className="chiffre font-semibold">{t('{fois} fois × {ia} IA = {envois} [envois:envoi|envois]', { fois, ia: coches.length, envois })}</span>, {t('à {prix} l’envoi', { prix: usd(prix) })} : <strong className="chiffre font-semibold">{usd(total)}</strong>.
          </p>
          <p className="second mt-1">
            {t('Après cet envoi : {apres} sur {plafond} de plafond ce mois-ci. La lecture automatique des réponses ajoutera ensuite environ {lecture}. Les réponses reviennent en quelques minutes, par la collecte habituelle.', { apres: usd(apres, false), plafond: usd(plafond, false), lecture: usd(envois * prixLecture) })}
          </p>
          {atteint ? <p className="mt-1 font-semibold text-[var(--absent-texte)]">{t('Le plafond du mois est atteint : aucun envoi possible.')}</p> : depasse && <p className="mt-1 font-semibold text-[var(--absent-texte)]">{t('Cet envoi dépasserait le plafond du mois.')}</p>}
        </div>
        <Envoyer total={usd(total)} bloque={coches.length === 0 || atteint} />
      </div>
      <dialog ref={dialogue} className="dialogue" aria-label={t('Confirmer la mesure approfondie')}>
        <p className="titre text-[1.375rem]">{t('Envoyer pour {prix} ?', { prix: usd(total) })}</p>
        <p className="mt-2 text-[var(--encre-douce)]">
          {t('La question sera posée {fois} fois à {noms} : {envois} envois. Cet envoi dépasse le seuil de confirmation ({seuil}).', { fois, noms: moteurs.filter((x) => coches.includes(x.cle)).map((x) => x.nom).join(', '), envois, seuil: usd(seuil, false) })}
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" className="bouton bouton-creux" onClick={() => dialogue.current?.close()}>{t('Annuler')}</button>
          <button type="button" className="bouton" onClick={() => { confirme.current = true; dialogue.current?.close(); formulaire.current?.requestSubmit() }}>{t('Confirmer l’envoi : {prix}', { prix: usd(total) })}</button>
        </div>
      </dialog>
    </form>
  )
}
