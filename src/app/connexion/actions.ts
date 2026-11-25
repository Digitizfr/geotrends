'use server'

import { creerPremierCompte, LONGUEUR_MIN_MOT_DE_PASSE } from '@/lib/premier-compte'

export type ResultatPremierCompte = 'cree' | 'deja' | 'nom' | 'email' | 'court' | 'differents' | 'echec'

/**
 * Premier lancement : crée le compte administrateur. Ne fait rien dès qu'un
 * compte existe (réponse « deja ») : l'inscription est alors fermée.
 */
export async function creerAdministrateur(donnees: FormData): Promise<ResultatPremierCompte> {
  const nom = String(donnees.get('nom') ?? '').trim().slice(0, 80)
  const email = String(donnees.get('email') ?? '').trim().toLowerCase()
  const motDePasse = String(donnees.get('motdepasse') ?? '')
  if (!nom) return 'nom'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) return 'email'
  if (motDePasse.length < LONGUEUR_MIN_MOT_DE_PASSE || motDePasse.length > 128) return 'court'
  if (motDePasse !== String(donnees.get('confirmation') ?? '')) return 'differents'
  try {
    return await creerPremierCompte({ nom, email, motDePasse })
  } catch (e) {
    console.error('Création du premier compte :', e instanceof Error ? e.message : e)
    return 'echec'
  }
}
