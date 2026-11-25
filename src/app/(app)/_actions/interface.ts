'use server'

import { cookies } from 'next/headers'
import { refresh } from 'next/cache'
import { annoncer } from '@/lib/annonce'
import { COOKIE_LANGUE, estLangue } from '@/lib/i18n/langues'
import { creerTraducteur } from '@/lib/i18n/traduire'
import { prisma } from '@/lib/prisma'
import { exigerSession } from '@/lib/session'

const UN_AN = 60 * 60 * 24 * 365

/**
 * Langue de l'interface : enregistrée sur le compte (elle le suit d'un
 * appareil à l'autre) et dans un cookie de ce navigateur. S'applique tout de
 * suite à tous les écrans. Ne touche ni à la langue des questions d'un projet
 * ni au texte des réponses relevées.
 */
export async function choisirLangue(donnees: FormData) {
  const session = await exigerSession()
  const langue = donnees.get('langue')
  if (!estLangue(langue)) return
  await prisma.user.update({ where: { id: session.user.id }, data: { langue } })
  ;(await cookies()).set(COOKIE_LANGUE, langue, { path: '/', maxAge: UN_AN, sameSite: 'lax' })
  await annoncer(creerTraducteur(langue)('Langue de l’interface : français'))
  refresh()
}
