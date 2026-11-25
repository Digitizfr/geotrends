// ── Typographie française ───────────────────────────────────────────────────
// Les textes s'écrivent avec une espace ordinaire avant « : ; ? ! » et à
// l'intérieur des guillemets. À l'affichage, elle devient insécable : un « ? »
// ne se retrouve jamais seul en début de ligne. Sans effet sur l'anglais.

const regle = (s: string) => s.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ')

/** Rend insécables les espaces de la ponctuation française, dans une chaîne ou un objet de contenu entier. */
export function insecables<T>(v: T): T {
  if (typeof v === 'string') return regle(v) as T
  if (typeof v === 'function') return ((...a: unknown[]) => insecables((v as (...a: unknown[]) => unknown)(...a))) as T
  if (Array.isArray(v)) return v.map((x) => insecables(x)) as T
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, insecables(x)])) as T
  return v
}
