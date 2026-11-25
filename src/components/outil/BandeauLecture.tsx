import { BoutonLecture } from '@/app/(app)/visibilite/BoutonLecture'
import { lireLesReponses } from '@/app/(app)/visibilite/actions'
import { aAnalyser, PRIX_ANALYSE_USD } from '@/lib/analyse'
import { traducteur } from '@/lib/i18n/serveur'
import { prisma } from '@/lib/prisma'
import { usdFin } from '@/lib/libelles'
import { Aide, Bandeau } from './Blocs'

/**
 * Réponses pas encore lues par l'analyse automatique (marques, rang, ton).
 * La lecture est payante : elle ne part que d'un clic, avec son prix affiché.
 * Le nombre affiché est exactement celui que l'action lira.
 */
export async function BandeauLecture({ projetId }: { projetId: string }) {
  const t = await traducteur()
  const nonLues = await prisma.releve.count({ where: aAnalyser(projetId) })
  if (nonLues <= 0) return null
  return (
    <form action={lireLesReponses}>
      <Bandeau action={<BoutonLecture prix={t('environ {prix}', { prix: usdFin(nonLues * PRIX_ANALYSE_USD) })} />}>
        <p>
          <strong className="font-semibold">{t('{n} [n:réponse n’a pas encore été lue|réponses n’ont pas encore été lues] par l’analyse automatique.', { n: nonLues })}</strong>{' '}
          <Aide libelle={t('À quoi sert la lecture')}>{t('La lecture relève les marques nommées, leur rang et le ton employé, pour toutes les IA. Sans elle, seules les marques renvoyées pour ChatGPT sont connues.')}</Aide>
        </p>
        <p className="second mt-1">{t('Appel payant, inscrit au journal des coûts. Rien ne part sans votre clic.')}</p>
      </Bandeau>
    </form>
  )
}
