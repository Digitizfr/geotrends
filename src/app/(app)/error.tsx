'use client'

import { useT } from '@/lib/i18n/client'

/** Erreur d'un écran : un bandeau à filet vermillon, en langage courant, et ce qu'on peut faire. */
export default function Erreur({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useT()
  return (
    <div className="bandeau erreur mt-6" role="alert">
      <p className="titre text-[1.5rem]">{t('Cet écran n’a pas pu s’afficher.')}</p>
      <p className="mt-2 text-[var(--encre-douce)]">{t('La lecture des données a échoué. Rien n’a été envoyé ni dépensé. Réessayez ; si l’erreur revient, la base de données est peut-être arrêtée.')}</p>
      <p className="mt-4"><button type="button" onClick={reset} className="bouton bouton-creux">{t('Réessayer')}</button></p>
    </div>
  )
}
