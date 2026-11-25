'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useT } from '@/lib/i18n/client'

const LONGUEUR_MIN = 8

export function FormulaireInvitation({ jeton, email }: { jeton: string; email: string }) {
  const router = useRouter()
  const { t } = useT()
  const [erreur, setErreur] = useState<string | null>(null)
  const [envoi, setEnvoi] = useState(false)

  async function enregistrer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErreur(null)
    const donnees = new FormData(e.currentTarget)
    const motDePasse = String(donnees.get('motdepasse'))
    if (motDePasse.length < LONGUEUR_MIN) return setErreur(t('Au moins {n} caractères.', { n: LONGUEUR_MIN }))
    if (motDePasse !== String(donnees.get('confirmation'))) return setErreur(t('Les deux mots de passe ne sont pas identiques.'))
    setEnvoi(true)
    const { error } = await authClient.resetPassword({ newPassword: motDePasse, token: jeton })
    if (error) {
      setEnvoi(false)
      setErreur(error.status === 429 ? t('Trop de tentatives. Réessayez dans une minute.') : t('Ce lien ne marche plus. Demandez-en un nouveau à l’administrateur.'))
      return
    }
    // Le mot de passe est enregistré : on ouvre la session tout de suite.
    const connexion = await authClient.signIn.email({ email, password: motDePasse })
    if (connexion.error) {
      router.push('/connexion')
      return
    }
    router.push('/vue')
    router.refresh()
  }

  return (
    <form onSubmit={enregistrer} className="mt-6 space-y-4">
      <label className="libelle">
        {t('Adresse e-mail')}
        <input name="email" type="email" value={email} readOnly autoComplete="username" className="champ mt-1 opacity-80" />
      </label>
      <label className="libelle">
        {t('Mot de passe')}
        <input name="motdepasse" type="password" required minLength={LONGUEUR_MIN} autoComplete="new-password" autoFocus className="champ mt-1" />
        <span className="second mt-1 block font-normal">{t('Au moins {n} caractères.', { n: LONGUEUR_MIN })}</span>
      </label>
      <label className="libelle">
        {t('Le même, une seconde fois')}
        <input name="confirmation" type="password" required minLength={LONGUEUR_MIN} autoComplete="new-password" className="champ mt-1" />
      </label>
      {erreur && <p role="alert" className="bandeau erreur text-[0.875rem]">{erreur}</p>}
      <button type="submit" disabled={envoi} className="bouton w-[calc(100%-5px)]">
        {envoi ? t('Enregistrement…') : t('Enregistrer et entrer')}
      </button>
    </form>
  )
}
