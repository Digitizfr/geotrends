// ── Registre de la documentation et des cas d'usage ─────────────────────────
// Une seule source pour les adresses : les routes, le plan du site, les liens
// « doc: » écrits dans le contenu et le script de vérification passent tous par
// ici. Ajouter une page, c'est ajouter un fichier de contenu et sa ligne dans
// l'index de son arbre : l'adresse, le sommaire, les pages précédente et
// suivante et le plan du site suivent tout seuls.

import { chemin, LANGUES, type Lang } from '../i18n'
import { cas } from './cas'
import { documentation } from './documentation'
import type { Arbre, Bloc, PageDoc, Rubrique } from './types'

export type NomArbre = 'documentation' | 'cas'

export const ARBRES: Record<NomArbre, Arbre> = { documentation, cas }

/** Une page de l'un des deux arbres, avec son adresse dans chaque langue. */
export type Entree = {
  arbre: NomArbre
  page: PageDoc
  rubrique: Rubrique | undefined
  url: Record<Lang, string>
  /** Vrai pour la page d'accueil de l'arbre (adresse nue : /documentation, /en/use-cases…). */
  accueil: boolean
}

/** Préfixe d'un arbre dans une langue : /documentation, /en/docs, /cas-usage, /en/use-cases. */
export const prefixe = (arbre: NomArbre, lang: Lang) => chemin(arbre, lang)

const nettoyer = (slug: string) => slug.replace(/^\/+|\/+$/g, '')

/** Adresse d'une page dans une langue. Un slug vide désigne l'accueil de l'arbre. */
export function urlDe(arbre: NomArbre, page: PageDoc, lang: Lang): string {
  const s = nettoyer(page.slug[lang] ?? '')
  return s ? `${prefixe(arbre, lang)}/${s}` : prefixe(arbre, lang)
}

/** Pages d'un arbre dans l'ordre de lecture : rubrique après rubrique, puis l'ordre de l'index. */
export function pagesEnOrdre(arbre: NomArbre): PageDoc[] {
  const a = ARBRES[arbre]
  const rang = new Map(a.rubriques.map((r, i) => [r.id, i]))
  const position = new Map(a.pages.map((p, i) => [p.id, i]))
  // L'accueil passe toujours en tête, puis les rubriques dans leur ordre.
  return [...a.pages].sort((x, y) => {
    const ax = nettoyer(x.slug.fr) === '' ? -1 : (rang.get(x.rubrique) ?? 999)
    const ay = nettoyer(y.slug.fr) === '' ? -1 : (rang.get(y.rubrique) ?? 999)
    return ax - ay || position.get(x.id)! - position.get(y.id)!
  })
}

const entreeDe = (arbre: NomArbre, page: PageDoc): Entree => ({
  arbre,
  page,
  rubrique: ARBRES[arbre].rubriques.find((r) => r.id === page.rubrique),
  url: { fr: urlDe(arbre, page, 'fr'), en: urlDe(arbre, page, 'en') },
  accueil: nettoyer(page.slug.fr) === '',
})

/** Toutes les pages des deux arbres, avec leurs adresses : sert au plan du site et à la vérification. */
export function toutesLesPages(): (Entree & { maj: string; titre: Record<Lang, string> })[] {
  return (['documentation', 'cas'] as NomArbre[]).flatMap((arbre) => pagesEnOrdre(arbre).map((p) => ({ ...entreeDe(arbre, p), maj: p.maj, titre: p.titre })))
}

/** Pages d'une rubrique, dans l'ordre de l'index. */
export const pagesDeRubrique = (arbre: NomArbre, rubrique: string): PageDoc[] => pagesEnOrdre(arbre).filter((p) => p.rubrique === rubrique && nettoyer(p.slug.fr) !== '')

/** Retrouve une page par son identifiant, dans l'un ou l'autre arbre. */
export function trouverParId(id: string): Entree | undefined {
  for (const arbre of ['documentation', 'cas'] as NomArbre[]) {
    const page = ARBRES[arbre].pages.find((p) => p.id === id)
    if (page) return entreeDe(arbre, page)
  }
  return undefined
}

/** Adresse d'un lien « doc:identifiant » dans une langue, ou null s'il ne mène nulle part. */
export function resoudreLien(id: string, lang: Lang): string | null {
  const [ident, ancre] = id.split('#')
  const e = trouverParId(ident)
  if (!e) return null
  return ancre ? `${e.url[lang]}#${ancre}` : e.url[lang]
}

/** Retrouve la page d'une adresse (morceaux après le préfixe), ou undefined. */
export function trouverParChemin(arbre: NomArbre, lang: Lang, morceaux: string[] | undefined): Entree | undefined {
  const cible = (morceaux ?? []).map((m) => decodeURIComponent(m)).join('/')
  const page = ARBRES[arbre].pages.find((p) => nettoyer(p.slug[lang] ?? '') === cible)
  return page ? entreeDe(arbre, page) : undefined
}

/**
 * Adresses à produire au moment de la construction, pour une route
 * `[[...chemin]]`. L'accueil de l'arbre (chemin vide) est toujours produit,
 * même quand aucune page n'a un slug vide : la route affiche alors un sommaire.
 */
export function cheminsStatiques(arbre: NomArbre, lang: Lang): { chemin: string[] }[] {
  const chemins = ARBRES[arbre].pages.map((p) => nettoyer(p.slug[lang] ?? '')).filter(Boolean).map((s) => ({ chemin: s.split('/') }))
  return [{ chemin: [] }, ...chemins]
}

/** Page précédente et page suivante dans l'ordre de lecture de l'arbre. */
export function voisines(e: Entree): { precedente?: Entree; suivante?: Entree } {
  const liste = pagesEnOrdre(e.arbre)
  const i = liste.findIndex((p) => p.id === e.page.id)
  return {
    precedente: i > 0 ? entreeDe(e.arbre, liste[i - 1]) : undefined,
    suivante: i >= 0 && i < liste.length - 1 ? entreeDe(e.arbre, liste[i + 1]) : undefined,
  }
}

/** Adresse de la même page dans l'autre langue (pour le sélecteur de langue du cadre). */
export const autreLangue = (lang: Lang): Lang => (lang === 'fr' ? 'en' : 'fr')

// ── Lecture du contenu ──────────────────────────────────────────────────────

/** Ancre d'un titre sans identifiant : le texte en minuscules, sans accents ni ponctuation. */
export const ancreDe = (texte: string) =>
  texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

/** Les titres d'une page, pour la table des matières : h2 et h3, avec leur ancre. */
export function titresDe(blocs: Bloc[]): { niveau: 2 | 3; id: string; texte: string }[] {
  const vus = new Set<string>()
  const titres: { niveau: 2 | 3; id: string; texte: string }[] = []
  for (const b of blocs) {
    if (b.type !== 'h2' && b.type !== 'h3') continue
    let id = b.type === 'h2' ? b.id : (b.id ?? ancreDe(b.texte))
    if (vus.has(id)) id = `${id}-${titres.length + 1}`
    vus.add(id)
    titres.push({ niveau: b.type === 'h2' ? 2 : 3, id, texte: b.texte })
  }
  return titres
}

/** Tous les textes d'un bloc, pour chercher des liens ou compter des mots. */
export function textesDe(b: Bloc): string[] {
  switch (b.type) {
    case 'p': return [b.texte]
    case 'h2':
    case 'h3': return [b.texte]
    case 'liste': return b.items
    case 'capture': return [b.legende]
    case 'tableau': return [...b.colonnes, ...b.lignes.flat()]
    case 'encadre': return [b.titre ?? '', b.texte]
    case 'etapes': return b.items.flatMap((x) => [x.titre, x.texte])
    case 'liens': return [b.titre ?? '', ...b.items.map((x) => x.texte ?? '')]
  }
}

/** Identifiants cités par « [texte](doc:identifiant) » dans un texte. */
export const liensDoc = (texte: string): string[] => [...texte.matchAll(/\]\(doc:([^)\s]+)\)/g)].map((m) => m[1])

/** Toutes les langues servies. */
export { LANGUES }
