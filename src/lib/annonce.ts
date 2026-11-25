import { cookies } from 'next/headers'

/*
 * Message bref affiché en bas d'écran après une action (« État enregistré »,
 * « Relevé lancé : 40 envois, 0,05 $ »). L'action le dépose dans un cookie de
 * quelques secondes ; la mise en page le lit, l'affiche une fois et l'efface.
 */
export const COOKIE_ANNONCE = 'gt_annonce'

export type Annonce = { id: string; texte: string; genre: 'ok' | 'erreur' }

/** À appeler dans une action serveur, juste avant de rafraîchir l'écran. */
export async function annoncer(texte: string, genre: Annonce['genre'] = 'ok') {
  const annonce: Annonce = { id: Date.now().toString(36), texte: texte.slice(0, 240), genre }
  // Lisible par le navigateur : c'est lui qui l'efface une fois le message montré.
  ;(await cookies()).set(COOKIE_ANNONCE, encodeURIComponent(JSON.stringify(annonce)), { path: '/', maxAge: 30, sameSite: 'lax', httpOnly: false })
}

export async function lireAnnonce(): Promise<Annonce | null> {
  const brut = (await cookies()).get(COOKIE_ANNONCE)?.value
  if (!brut) return null
  try {
    const a = JSON.parse(decodeURIComponent(brut)) as Annonce
    return typeof a?.texte === 'string' && typeof a?.id === 'string' ? { id: a.id, texte: a.texte, genre: a.genre === 'erreur' ? 'erreur' : 'ok' } : null
  } catch {
    return null
  }
}
