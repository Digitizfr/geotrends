'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useT } from '@/lib/i18n/client'

export function FormulaireConnexion() {
  const router = useRouter()
  const { t } = useT()
  const [erreur, setErreur] = useState<string | null>(null)
  const [envoi, setEnvoi] = useState(false)

  async function connecter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErreur(null)
    setEnvoi(true)
    const donnees = new FormData(e.currentTarget)
    const { error } = await authClient.signIn.email({
      email: String(donnees.get('email')),
      password: String(donnees.get('motdepasse')),
    })
    setEnvoi(false)
    if (error) {
      setErreur(error.status === 429 ? t('Trop de tentatives. Réessayez dans une minute.') : t('Adresse ou mot de passe incorrect.'))
      return
    }
    router.push('/vue')
    router.refresh()
  }

  return (
    <form onSubmit={connecter} className="mt-6 space-y-4">
      <label className="libelle">
        {t('Adresse e-mail')}
        <input name="email" type="email" required autoComplete="email" autoFocus className="champ mt-1" />
      </label>
      <label className="libelle">
        {t('Mot de passe')}
        <input name="motdepasse" type="password" required autoComplete="current-password" className="champ mt-1" />
      </label>
      {erreur && <p role="alert" className="bandeau erreur text-[0.875rem]">{erreur}</p>}
      <button type="submit" disabled={envoi} className="bouton w-[calc(100%-5px)]">
        {envoi ? t('Connexion…') : t('Se connecter')}
      </button>
    </form>
  )
}
