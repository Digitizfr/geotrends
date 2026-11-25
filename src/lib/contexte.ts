import { cache } from 'react'
import { redirect } from 'next/navigation'
import { traducteur } from './i18n/serveur'
import { lireMesures, type Mesures } from './mesures'
import { projetCourant } from './projets'

/** Le projet affiché, lu une seule fois par page. */
export const projetAffiche = cache(async () => projetCourant())

/** Les mesures du projet affiché, ou null s'il n'existe aucun projet. */
export const mesuresAffichees = cache(async (): Promise<Mesures | null> => {
  // La langue de la requête est fixée avant toute écriture de date ou de nom.
  await traducteur()
  const projet = await projetAffiche()
  return projet ? lireMesures(projet.id) : null
})

/** Pour un écran de mesure : sans projet, on va en créer un. */
export async function exigerMesures(): Promise<Mesures> {
  const m = await mesuresAffichees()
  if (!m) redirect('/projets')
  return m
}

/** Titre de l'onglet du navigateur : l'écran, puis le projet affiché. */
export async function titreOnglet(ecran: string) {
  const [t, projet] = await Promise.all([traducteur(), projetAffiche()])
  return { title: projet ? `${t(ecran)} · ${projet.nom} · GeoTrends` : `${t(ecran)} · GeoTrends` }
}
