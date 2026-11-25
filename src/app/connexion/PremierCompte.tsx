'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useT } from '@/lib/i18n/client'
import { creerAdministrateur } from './actions'

const LONGUEUR_MIN = 8

/** Premier lancement : le formulaire qui crée le compte administrateur, puis ouvre la session. */
export function PremierCompte() {
  const router = useRouter()
  const { t } = useT()
  const [erreur, setErreur] = useState<string | null>(null)
  const [envoi, setEnvoi] = useState(false)

  async function creer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErreur(null)
    const donnees = new FormData(e.currentTarget)
    const motDePasse = String(donnees.get('motdepasse'))
    if (motDePasse.length < LONGUEUR_MIN) return setErreur(t('Au moins {n} caractères.', { n: LONGUEUR_MIN }))
    if (motDePasse !== String(donnees.get('confirmation'))) return setErreur(t('Les deux mots de passe ne sont pas identiques.'))
    setEnvoi(true)
    const resultat = await creerAdministrateur(donnees).catch(() => 'echec' as const)
    if (resultat === 'deja') {
      // Quelqu'un a créé le compte entre-temps : la page redevient la connexion ordinaire.
      router.refresh()
      return
    }
    if (resultat !== 'cree') {
      setEnvoi(false)
      setErreur(
        resultat === 'nom' ? t('Indiquez votre nom.')
        : resultat === 'email' ? t('Cette adresse e-mail n’est pas valable.')
        : resultat === 'court' ? t('Au moins {n} caractères.', { n: LONGUEUR_MIN })
        : resultat === 'differents' ? t('Les deux mots de passe ne sont pas identiques.')
        : t('Le compte n’a pas pu être créé. Vérifiez que la base de données répond, puis réessayez.'),
      )
      return
    }
    // Le compte existe : on ouvre la session, puis on passe à la création du premier projet.
    const connexion = await authClient.signIn.email({ email: String(donnees.get('email')).trim().toLowerCase(), password: motDePasse })
    if (connexion.error) {
      router.refresh()
      return
    }
    router.push('/projets/nouveau')
    router.refresh()
  }

  return (
    <form onSubmit={creer} className="mt-6 space-y-4">
      <label className="libelle">
        {t('Votre nom')}
        <input name="nom" type="text" required maxLength={80} autoComplete="name" autoFocus className="champ mt-1" />
      </label>
      <label className="libelle">
        {t('Adresse e-mail')}
        <input name="email" type="email" required autoComplete="username" className="champ mt-1" />
      </label>
      <label className="libelle">
        {t('Mot de passe')}
        <input name="motdepasse" type="password" required minLength={LONGUEUR_MIN} autoComplete="new-password" className="champ mt-1" />
        <span className="second mt-1 block font-normal">{t('Au moins {n} caractères.', { n: LONGUEUR_MIN })}</span>
      </label>
      <label className="libelle">
        {t('Le même, une seconde fois')}
        <input name="confirmation" type="password" required minLength={LONGUEUR_MIN} autoComplete="new-password" className="champ mt-1" />
      </label>
      {erreur && <p role="alert" className="bandeau erreur text-[0.875rem]">{erreur}</p>}
      <button type="submit" disabled={envoi} className="bouton w-[calc(100%-5px)]">
        {envoi ? t('Création…') : t('Créer le compte et entrer')}
      </button>
    </form>
  )
}
