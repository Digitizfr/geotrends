import Link from 'next/link'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { EnTete } from '@/components/outil/Blocs'
import { titreOnglet } from '@/lib/contexte'
import { traducteur } from '@/lib/i18n/serveur'
import { PRIX_INTERFACE_USD } from '@/lib/estimation'
import { LANGUES, nomLangue, nomPays, PAYS } from '@/lib/marches'
import { Creation } from './Creation'

export const generateMetadata = () => titreOnglet('Nouveau projet')
export const dynamic = 'force-dynamic'

const ERREURS: Record<string, string> = {
  marque: 'Indiquez le nom de la marque.',
  existe: 'Un projet porte déjà ce nom.',
}

export default async function NouveauProjet({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const t = await traducteur()
  const { erreur } = await searchParams
  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Régler') }, { libelle: t('Projets'), href: '/projets' }, { libelle: t('Nouveau projet') }]} actions={<Link href="/projets" className="bouton bouton-creux bouton-petit">{t('Annuler')}</Link>} />
      <EnTete titre={t('Nouveau projet')} verdict={t('Cinq étapes courtes. Seul le nom de la marque est obligatoire, et créer un projet ne coûte rien : la dépense commence au premier relevé.')} />
      <Creation
        pays={PAYS.map((code) => ({ code, nom: nomPays(code) }))}
        langues={LANGUES.map((code) => ({ code, nom: nomLangue(code) }))}
        prixInterface={PRIX_INTERFACE_USD}
        erreur={erreur && ERREURS[erreur] ? t(ERREURS[erreur]) : undefined}
      />
    </div>
  )
}
