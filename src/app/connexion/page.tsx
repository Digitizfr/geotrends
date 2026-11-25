import { redirect } from 'next/navigation'
import { Gloock, Hanken_Grotesk } from 'next/font/google'
import { FournisseurLangue } from '@/lib/i18n/client'
import { traducteur } from '@/lib/i18n/serveur'
import { aucunCompte } from '@/lib/premier-compte'
import { lireSession } from '@/lib/session'
import { LogoSite } from '@/site/composants/LogoSite'
import { FormulaireConnexion } from './FormulaireConnexion'
import { PremierCompte } from './PremierCompte'
// La même feuille que le site public, puis celles de l'outil : la page de connexion en est la porte.
import '../vitrine.css'
import '../(app)/outil.css'
import '../(app)/interface.css'

const titre = Gloock({ subsets: ['latin'], weight: '400', variable: '--font-titre' })
const corps = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-corps' })

// La page dépend de la base (y a-t-il déjà un compte ?) : jamais figée à la construction.
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const t = await traducteur()
  return { title: `${t('Connexion')} · GeoTrends`, robots: { index: false, follow: true } }
}

/**
 * Page de connexion. Tant que personne n'est connecté, elle suit la langue du navigateur.
 * Au premier lancement (aucun compte), elle fait créer le compte administrateur.
 */
export default async function Connexion() {
  if (await lireSession()) redirect('/vue')
  const [t, premier] = await Promise.all([traducteur(), aucunCompte()])
  return (
    <div className={`site outil ${titre.variable} ${corps.variable}`} lang={t.langue}>
      <FournisseurLangue langue={t.langue}>
        <main className="connexion">
          <div className="connexion-feuille">
            <LogoSite taille={30} />
            <div className="regle mt-6" aria-hidden="true" />
            {premier ? (
              <>
                <h1 className="titre-page mt-6">{t('Bienvenue dans GeoTrends')}</h1>
                <p className="mt-2 text-[var(--encre-douce)]">{t('L’outil vient d’être installé. Créez le compte administrateur : c’est lui qui règle l’outil et invite les autres personnes.')}</p>
                <PremierCompte />
                <p className="second mt-6 border-t border-[var(--filet)] pt-4">{t('Ce formulaire ne s’affiche qu’une fois. Ensuite, on entre par invitation, depuis Réglages › Comptes.')}</p>
              </>
            ) : (
              <>
                <h1 className="titre-page mt-6">{t('Connexion')}</h1>
                <p className="mt-2 text-[var(--encre-douce)]">{t('La visibilité de vos marques dans les réponses des IA.')}</p>
                <FormulaireConnexion />
                <p className="second mt-6 border-t border-[var(--filet)] pt-4">{t('Pas de compte ? L’administrateur de l’outil vous envoie une invitation.')}</p>
              </>
            )}
          </div>
        </main>
      </FournisseurLangue>
    </div>
  )
}
