import Link from 'next/link'
import { Gloock, Hanken_Grotesk } from 'next/font/google'
import { FournisseurLangue } from '@/lib/i18n/client'
import { traducteur } from '@/lib/i18n/serveur'
import { lireInvitation } from '@/lib/invitations'
import { LogoSite } from '@/site/composants/LogoSite'
import { FormulaireInvitation } from './FormulaireInvitation'
// La même feuille que la page de connexion, dont elle est la sœur.
import '../../vitrine.css'
import '../../(app)/outil.css'
import '../../(app)/interface.css'

const titre = Gloock({ subsets: ['latin'], weight: '400', variable: '--font-titre' })
const corps = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-corps' })

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const t = await traducteur()
  return { title: `${t('Choisir votre mot de passe')} · GeoTrends`, robots: { index: false, follow: false }, referrer: 'no-referrer' as const }
}

/**
 * Lien personnel envoyé par l'administrateur (Réglages › Comptes) : la personne
 * choisit son mot de passe et entre dans l'outil. Le lien vaut sept jours, une fois.
 */
export default async function Invitation({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params
  const [t, invitation] = await Promise.all([traducteur(), lireInvitation(jeton)])
  return (
    <div className={`site outil ${titre.variable} ${corps.variable}`} lang={t.langue}>
      <FournisseurLangue langue={t.langue}>
        <main className="connexion">
          <div className="connexion-feuille">
            <LogoSite taille={30} />
            <div className="regle mt-6" aria-hidden="true" />
            {invitation ? (
              <>
                <h1 className="titre-page mt-6">{invitation.premiereFois ? t('Bienvenue, {nom}', { nom: invitation.name.split(/\s+/)[0] }) : t('Nouveau mot de passe')}</h1>
                <p className="mt-2 text-[var(--encre-douce)]">
                  {invitation.premiereFois
                    ? t('Choisissez votre mot de passe pour entrer dans GeoTrends.')
                    : t('Choisissez un nouveau mot de passe : l’ancien ne marchera plus.')}
                </p>
                <FormulaireInvitation jeton={jeton} email={invitation.email} />
                <p className="second mt-6 border-t border-[var(--filet)] pt-4">
                  {t('Ce lien est personnel et ne sert qu’une fois. Il reste valable jusqu’au {date}.', {
                    date: invitation.expire.toLocaleDateString(t.langue === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }),
                  })}
                </p>
              </>
            ) : (
              <>
                <h1 className="titre-page mt-6">{t('Ce lien ne marche plus')}</h1>
                <p className="mt-2 text-[var(--encre-douce)]">{t('Il a déjà servi, il a expiré, ou un lien plus récent l’a remplacé. Demandez-en un nouveau à l’administrateur de l’outil.')}</p>
                <p className="mt-6"><Link href="/connexion" className="lien">{t('Aller à la connexion')}</Link></p>
              </>
            )}
          </div>
        </main>
      </FournisseurLangue>
    </div>
  )
}
