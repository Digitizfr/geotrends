'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { recupererReponses } from './actions'

/**
 * Tant que des réponses sont attendues, relit les réponses prêtes toutes les
 * vingt secondes et rafraîchit la page, sans clic. S'arrête au bout de dix
 * minutes : au-delà, le bouton « Récupérer les réponses » reste disponible.
 */
export function Actualisation({ actif }: { actif: boolean }) {
  const router = useRouter()
  useEffect(() => {
    if (!actif) return
    let passages = 0
    const minuteur = setInterval(async () => {
      passages += 1
      if (passages > 30) return clearInterval(minuteur)
      await recupererReponses().catch(() => undefined)
      router.refresh()
    }, 20_000)
    return () => clearInterval(minuteur)
  }, [actif, router])
  return null
}
