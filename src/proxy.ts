import { NextResponse, type NextRequest } from 'next/server'
import { estVitrine } from '@/site/liens'

/*
 * Une installation chez soi n'a pas à montrer le site de présentation de
 * geotrends.io : sa racine ouvre l'outil (la vue d'ensemble, ou la connexion si
 * personne n'est connecté). Sur geotrends.io (SITE_VITRINE=1), rien ne change.
 * La documentation et les autres pages publiques restent lisibles partout.
 */
export function proxy(requete: NextRequest) {
  if (estVitrine()) return NextResponse.next()
  return NextResponse.redirect(new URL('/vue', requete.url))
}

export const config = { matcher: ['/', '/en'] }
