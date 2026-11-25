'use server'

import { revalidatePath } from 'next/cache'
import { exigerSession } from '@/lib/session'
import { collecterReleves } from '@/lib/releves'

/** Lit les réponses prêtes des relevés en attente. Appels gratuits. */
export async function recupererReponses() {
  await exigerSession()
  await collecterReleves()
  revalidatePath('/releves', 'layout')
}
