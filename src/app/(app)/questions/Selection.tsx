'use client'

import { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useT } from '@/lib/i18n/client'

function Bouton({ children, className = 'bouton bouton-creux bouton-petit', disabled = false, onClick, type = 'submit', nom, valeur }: { children: React.ReactNode; className?: string; disabled?: boolean; onClick?: () => void; type?: 'submit' | 'button'; nom?: string; valeur?: string }) {
  const { pending } = useFormStatus()
  return <button type={type} name={nom} value={valeur} disabled={pending || disabled} onClick={onClick} className={className}>{children}</button>
}

/**
 * Actions sur les questions cochées dans le tableau : archiver, changer le
 * thème (gratuits), lancer un relevé pour elles seules (payant : le prix exact
 * est écrit sur le bouton, et une fenêtre demande confirmation au-dessus du
 * seuil réglable). À placer dans le formulaire qui entoure le tableau.
 */
export function Selection({ prix, moteurs, seuil, themes, plafondAtteint }: { prix: number; moteurs: string[]; seuil: number; themes: string[]; plafondAtteint: boolean }) {
  const { t, f } = useT()
  const usd = f.usdFin
  const racine = useRef<HTMLDivElement>(null)
  const dialogue = useRef<HTMLDialogElement>(null)
  const archivage = useRef<HTMLDialogElement>(null)
  const champFaire = useRef<HTMLInputElement>(null)
  const [n, setN] = useState(0)
  const formulaire = () => racine.current?.closest('form') ?? null
  const cases = () => [...(formulaire()?.querySelectorAll<HTMLInputElement>('input[name="q"]') ?? [])]

  useEffect(() => {
    const f = racine.current?.closest('form')
    if (!f) return
    const compter = () => setN(f.querySelectorAll('input[name="q"]:checked').length)
    compter()
    f.addEventListener('change', compter)
    return () => f.removeEventListener('change', compter)
  }, [])

  const cocher = (tout: boolean) => {
    for (const c of cases()) c.checked = tout
    setN(tout ? cases().length : 0)
  }
  const envoyer = (action: string) => {
    if (champFaire.current) champFaire.current.value = action
    formulaire()?.requestSubmit()
  }
  const total = n * moteurs.length * prix

  return (
    <div ref={racine} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--filet)] bg-[var(--papier)] px-4 py-2.5">
      <input ref={champFaire} type="hidden" name="faire" defaultValue="" />
      <p className="text-[0.875rem]" aria-live="polite">
        {n === 0 ? <span className="second">{t('Cochez des questions pour les archiver, changer leur thème, les partager, ou lancer un relevé pour elles seules.')}</span> : <strong className="font-semibold">{t('{n} [n:question cochée|questions cochées]', { n })}</strong>}
      </p>
      <button type="button" className="lien text-[0.8125rem]" onClick={() => cocher(n === 0)}>{n === 0 ? t('Tout cocher') : t('Tout décocher')}</button>
      {n > 0 && (
        <>
          <Bouton type="button" onClick={() => archivage.current?.showModal()}>{t('Archiver')}</Bouton>
          <Bouton type="button" onClick={() => envoyer('partager')}>{t('Partager')}</Bouton>
          <span className="flex items-center gap-1.5">
            <label className="invisible-lecteur" htmlFor="theme-selection">{t('Thème à donner aux questions cochées')}</label>
            <input id="theme-selection" name="theme" list="themes-connus" placeholder={t('Thème')} className="champ !w-40 !py-1 !text-[0.8125rem]" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); envoyer('theme') } }} />
            <datalist id="themes-connus">{themes.map((t) => <option key={t} value={t} />)}</datalist>
            <Bouton type="button" onClick={() => envoyer('theme')}>{t('Changer le thème')}</Bouton>
          </span>
          <Bouton
            type="button"
            className="bouton bouton-petit"
            disabled={plafondAtteint || moteurs.length === 0}
            onClick={() => (total > seuil ? dialogue.current?.showModal() : envoyer('lancer'))}
          >
            {t('Lancer un relevé pour la sélection : {prix}', { prix: usd(total) })}
          </Bouton>
          {plafondAtteint && <span className="second text-[var(--absent-texte)]">{t('Plafond du mois atteint : aucun envoi possible.')}</span>}
        </>
      )}
      <dialog ref={archivage} className="dialogue" aria-label={t('Archiver les questions cochées')}>
        <p className="titre text-[1.375rem]">{t('Archiver {n} [n:question|questions] ?', { n })}</p>
        <p className="mt-2 text-[var(--encre-douce)]">{t('[n:Elle ne sera plus relevée et ne comptera plus dans les chiffres. Son historique reste, et elle peut être reprise.|Elles ne seront plus relevées et ne compteront plus dans les chiffres. Leur historique reste, et elles peuvent être reprises.] Une question jamais relevée est simplement retirée.', { n })}</p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" className="bouton bouton-creux" onClick={() => archivage.current?.close()}>{t('Annuler')}</button>
          <button type="button" className="bouton" onClick={() => { archivage.current?.close(); envoyer('archiver') }}>{t('Archiver')}</button>
        </div>
      </dialog>
      <dialog ref={dialogue} className="dialogue" aria-label={t('Confirmer l’envoi')}>
        <p className="titre text-[1.375rem]">{t('Envoyer pour {prix} ?', { prix: usd(total) })}</p>
        <p className="mt-2 text-[var(--encre-douce)]">
          {t('{n} [n:question|questions] × {ia} IA relevées par l’interface ({noms}) = {envois} envois à {prix}. Cet envoi dépasse le seuil de confirmation ({seuil}). Claude, mesuré par son API, n’est pas compris.', { n, ia: moteurs.length, noms: moteurs.join(', '), envois: n * moteurs.length, prix: usd(prix), seuil: usd(seuil) })}
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" className="bouton bouton-creux" onClick={() => dialogue.current?.close()}>{t('Annuler')}</button>
          <button type="button" className="bouton" onClick={() => { dialogue.current?.close(); envoyer('lancer') }}>{t('Confirmer l’envoi : {prix}', { prix: usd(total) })}</button>
        </div>
      </dialog>
    </div>
  )
}
