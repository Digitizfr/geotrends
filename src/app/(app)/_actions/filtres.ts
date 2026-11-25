'use server'

import { cookies } from 'next/headers'
import { refresh } from 'next/cache'
import { MOTEURS } from '@/lib/fournisseurs/types'
import { COOKIE_CONCURRENT, COOKIE_MASQUEES, COOKIE_PERIODE, estPeriode, PERIODE_DEFAUT } from '@/lib/filtres'
import { exigerSession } from '@/lib/session'

const UN_AN = 60 * 60 * 24 * 365

/** Retient la période et les IA cochées dans la barre du haut. Elles valent pour tous les écrans de mesure. */
export async function reglerFiltres(donnees: FormData) {
  await exigerSession()
  const c = await cookies()
  const options = { path: '/', maxAge: UN_AN, sameSite: 'lax' as const, httpOnly: true }
  if (donnees.get('reinitialiser') === '1') {
    c.delete(COOKIE_PERIODE)
    c.delete(COOKIE_MASQUEES)
    c.delete(COOKIE_CONCURRENT)
  } else {
    const periode = donnees.get('periode')
    c.set(COOKIE_PERIODE, estPeriode(periode) ? periode : PERIODE_DEFAUT, options)
    // Les IA proposées dans la barre arrivent dans « proposees » ; celles qui ne sont pas cochées sont masquées.
    const proposees = String(donnees.get('proposees') ?? '').split(',')
    const masquees = MOTEURS.filter((m) => proposees.includes(m) && donnees.get(`ia_${m}`) !== 'on')
    // Tout décocher n'aurait pas de sens : on revient alors à toutes les IA.
    c.set(COOKIE_MASQUEES, masquees.length < proposees.length ? masquees.join(',') : '', options)
    // « Réponses qui nomment » : un concurrent suivi, ou toutes les réponses.
    const concurrent = String(donnees.get('concurrent') ?? '')
    if (/^[a-z0-9]{8,40}$/i.test(concurrent)) c.set(COOKIE_CONCURRENT, concurrent, options)
    else c.delete(COOKIE_CONCURRENT)
  }
  refresh()
}
