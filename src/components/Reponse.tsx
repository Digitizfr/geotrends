import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { tr } from '@/lib/i18n/courante'

type Noeud = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: Noeud[] }

const echappe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Repère des noms dans le texte d'une réponse : notre marque est surlignée
 * (« c'est nous »), les concurrents suivis sont soulignés. Le texte lui-même
 * n'est jamais modifié.
 */
function reperer(nous: string[], concurrents: string[]) {
  const noms = [...nous.map((n) => ({ n, classe: 'nous' })), ...concurrents.map((n) => ({ n, classe: 'concurrent' }))].filter((x) => x.n.trim().length >= 2)
  if (noms.length === 0) return () => undefined
  // Les noms longs d'abord : « Sellsy CRM » avant « Sellsy ».
  noms.sort((a, b) => b.n.length - a.n.length)
  const motif = new RegExp(`(?<![\\p{L}\\p{N}])(${noms.map((x) => echappe(x.n)).join('|')})(?![\\p{L}\\p{N}])`, 'giu')
  const classeDe = (t: string) => noms.find((x) => x.n.toLowerCase() === t.toLowerCase())?.classe ?? 'concurrent'
  const parcourir = (noeud: Noeud) => {
    if (!noeud.children || noeud.tagName === 'code' || noeud.tagName === 'pre') return
    const suite: Noeud[] = []
    for (const enfant of noeud.children) {
      if (enfant.type !== 'text' || !enfant.value) {
        parcourir(enfant)
        suite.push(enfant)
        continue
      }
      let fin = 0
      for (const trouve of enfant.value.matchAll(motif)) {
        const debut = trouve.index ?? 0
        if (debut > fin) suite.push({ type: 'text', value: enfant.value.slice(fin, debut) })
        const classe = classeDe(trouve[0])
        suite.push({ type: 'element', tagName: classe === 'nous' ? 'mark' : 'span', properties: { className: [classe] }, children: [{ type: 'text', value: trouve[0] }] })
        fin = debut + trouve[0].length
      }
      if (fin === 0) suite.push(enfant)
      else if (fin < enfant.value.length) suite.push({ type: 'text', value: enfant.value.slice(fin) })
    }
    noeud.children = suite
  }
  return () => (arbre: Noeud) => parcourir(arbre)
}

const nette = (url: string) => url.replace(/[?#].*$/, '').replace(/\/$/, '').replace(/^https?:\/\/(www\.)?/, '').toLowerCase()

/**
 * Texte d'une réponse d'IA, tel que relevé (Markdown). Les images sont
 * retirées : elles feraient charger des fichiers depuis des sites tiers.
 * Un lien vers une source citée porte le numéro de cette source.
 */
export function Reponse({ texte, nous = [], concurrents = [], sources = [] }: { texte: string; nous?: string[]; concurrents?: string[]; sources?: { url: string; numero: number; aNous: boolean }[] }) {
  const numeros = new Map(sources.map((s) => [nette(s.url), s]))
  return (
    <div className="reponse">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[reperer(nous, concurrents) as never]}
        disallowedElements={['img']}
        components={{
          a: ({ href, children }) => {
            const source = href ? numeros.get(nette(href)) : undefined
            return (
              <a href={href} target="_blank" rel="noopener noreferrer nofollow">
                {children}
                {source && <span className={`pastille-source ${source.aNous ? 'nous' : ''}`} title={tr('Source citée n° {n}', { n: source.numero })}>{source.numero}</span>}
              </a>
            )
          },
        }}
      >
        {texte}
      </Markdown>
    </div>
  )
}
