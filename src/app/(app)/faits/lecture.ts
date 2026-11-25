import type { Mesures, ReleveLu } from '@/lib/mesures'

/** Réponses reçues qui nomment la marque : les seules qui peuvent contredire un fait. */
export function reponsesQuiNomment(m: Mesures): ReleveLu[] {
  return [...m.questions, ...m.archivees].flatMap((q) => q.tous).filter((r) => r.statut === 'recu' && !!r.texte && (r.p?.mentionnee || r.rang !== null))
}

/** Parmi elles, celles qui n'ont pas été comparées aux faits depuis le dernier fait ajouté. */
export function reponsesAVerifier(m: Mesures, faits: { createdAt: Date }[]): ReleveLu[] {
  if (faits.length === 0) return []
  const dernier = Math.max(...faits.map((f) => f.createdAt.getTime()))
  return reponsesQuiNomment(m).filter((r) => !r.faitsLe || r.faitsLe.getTime() < dernier)
}
