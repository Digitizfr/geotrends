import { redirect } from 'next/navigation'

/** Ancienne adresse du détail d'une question : elle mène à la nouvelle. */
export default async function AncienDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/questions/${id}`)
}
