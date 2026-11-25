/*
 * Recopie la documentation du site en Markdown, pour qu'elle se lise aussi sur
 * GitHub :  npx tsx scripts/exporter-docs.ts        (écrit docs/fr et docs/en)
 *           npx tsx scripts/exporter-docs.ts --verifier   (n'écrit rien : échoue si un fichier n'est plus à jour)
 *
 * Une seule source : les fichiers de contenu de src/site/docs (documentation et
 * cas d'usage, en français et en anglais). Les fichiers de docs/fr et docs/en
 * sont donc générés : on ne les modifie jamais à la main. `npm run verifier-docs`
 * lance ce script après ses contrôles, et le dépôt refuse (contrôle automatique
 * de GitHub) un envoi où les deux ne se répondent plus.
 */

import fs from 'node:fs'
import path from 'node:path'
import { manifeste } from '../src/site/docs/captures'
import { accroches } from '../src/site/docs/documentation'
import { ARBRES, pagesDeRubrique, pagesEnOrdre, trouverParId, urlDe, type NomArbre } from '../src/site/docs/registre'
import type { Bloc, PageDoc } from '../src/site/docs/types'

type Lang = 'fr' | 'en'

const RACINE = path.resolve(__dirname, '..')
const DOCS = path.join(RACINE, 'docs')
const SITE = 'https://geotrends.io'
const VERIFIER = process.argv.includes('--verifier')

const T = {
  fr: {
    genere: 'Page générée depuis la documentation du site (src/site/docs) par scripts/exporter-docs.ts : ne pas la modifier ici.',
    maj: 'Mise à jour',
    surLeSite: 'Lire cette page sur le site',
    sommaire: 'Sommaire',
    documentation: 'Documentation',
    cas: 'Cas d’usage',
    casIntro: 'Chaque cas d’usage part d’une question qu’on se pose, dit quelles données regarder et dans quel écran, puis ce que la mesure permet de décider.',
    retour: 'Sommaire de la documentation',
    etape: 'Étape',
    voirAussi: 'Voir aussi',
    encadre: { savoir: 'NOTE', conseil: 'TIP', limite: 'WARNING' },
    autre: 'Read this page in English',
  },
  en: {
    genere: 'Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here.',
    maj: 'Updated',
    surLeSite: 'Read this page on the website',
    sommaire: 'Contents',
    documentation: 'Documentation',
    cas: 'Use cases',
    casIntro: 'Each use case starts from a question you are asking, says which data to look at and on which screen, then what the measurement lets you decide.',
    retour: 'Documentation contents',
    etape: 'Step',
    voirAussi: 'See also',
    encadre: { savoir: 'NOTE', conseil: 'TIP', limite: 'WARNING' },
    autre: 'Lire cette page en français',
  },
} as const

const DOSSIER_CAS: Record<Lang, string> = { fr: 'cas-usage', en: 'use-cases' }

/** Chemin du fichier Markdown d'une page, depuis docs/. L'accueil de la documentation est le README de la langue. */
function fichierDe(arbre: NomArbre, page: PageDoc, lang: Lang): string {
  const slug = (page.slug[lang] ?? '').replace(/^\/+|\/+$/g, '')
  if (arbre === 'cas') return path.join(lang, DOSSIER_CAS[lang], `${slug}.md`)
  return slug ? path.join(lang, `${slug}.md`) : path.join(lang, 'README.md')
}

/** Lien relatif d'un fichier vers un autre (ou vers une image du dépôt), toujours avec des « / ». */
const relatif = (depuis: string, vers: string) => {
  const r = path.relative(path.dirname(path.join(DOCS, depuis)), vers).split(path.sep).join('/')
  return r.startsWith('.') ? r : `./${r}`
}

/** Texte d'un bloc → Markdown : [[surligné]] devient du gras, les liens « doc: » des liens entre fichiers. */
function md(texte: string, depuis: string, lang: Lang): string {
  return texte
    .replace(/\[\[(.+?)\]\]/g, '**$1**')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (tout, libelle: string, cible: string) => {
      if (cible.startsWith('doc:')) {
        const [id, ancre] = cible.slice(4).split('#')
        const e = trouverParId(id)
        if (!e) return libelle
        return `[${libelle}](${relatif(depuis, path.join(DOCS, fichierDe(e.arbre, e.page, lang)))}${ancre ? `#${ancre}` : ''})`
      }
      if (cible.startsWith('/')) return `[${libelle}](${SITE}${cible})`
      return tout
    })
}

/** Le même texte sans aucune marque : texte de remplacement d'une image. */
const brut = (texte: string) => texte.replace(/\[\[(.+?)\]\]/g, '$1').replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1').replace(/[[\]]/g, '')

function image(nom: string, legende: string, depuis: string, lang: Lang, retrait = ''): string[] {
  const c = manifeste.captures?.[lang]?.[nom]
  if (!c?.fichier) return []
  const fichier = path.join(RACINE, 'public', c.fichier.replace(/^\/+/, ''))
  return [`${retrait}![${brut(legende)}](${relatif(depuis, fichier)})`, '']
}

function bloc(b: Bloc, depuis: string, lang: Lang): string[] {
  const t = T[lang]
  const x = (s: string) => md(s, depuis, lang)
  switch (b.type) {
    case 'p':
      return [x(b.texte), '']
    case 'h2':
      return [`<a id="${b.id}"></a>`, '', `## ${b.texte}`, '']
    case 'h3':
      return [...(b.id ? [`<a id="${b.id}"></a>`, ''] : []), `### ${b.texte}`, '']
    case 'liste':
      return [...b.items.map((i, n) => `${b.ordonnee ? `${n + 1}.` : '-'} ${x(i)}`), '']
    case 'capture':
      return [...image(b.nom, b.legende, depuis, lang), `*${x(b.legende)}*`, '']
    case 'tableau': {
      const cellule = (s: string) => x(s).replace(/\|/g, '\\|').replace(/\n/g, ' ')
      return [`| ${b.colonnes.map(cellule).join(' | ')} |`, `| ${b.colonnes.map(() => '---').join(' | ')} |`, ...b.lignes.map((l) => `| ${l.map(cellule).join(' | ')} |`), '']
    }
    case 'encadre':
      return [`> [!${t.encadre[b.ton]}]`, ...(b.titre ? [`> **${b.titre}**`, '>'] : []), `> ${x(b.texte)}`, '']
    case 'etapes':
      return b.items.flatMap((e, n) => [`${n + 1}. **${e.titre}.** ${x(e.texte)}`, '', ...(e.capture ? image(e.capture, e.titre, depuis, lang, '   ') : [])])
    case 'liens':
      return [
        `**${b.titre ?? t.voirAussi}**`,
        '',
        ...b.items.map((i) => {
          const e = trouverParId(i.page)
          if (!e) return `- ${i.page}`
          const lien = `[${e.page.titre[lang]}](${relatif(depuis, path.join(DOCS, fichierDe(e.arbre, e.page, lang)))})`
          return i.texte ? `- ${lien}${lang === 'fr' ? ' : ' : ': '}${x(i.texte)}` : `- ${lien}`
        }),
        '',
      ]
  }
}

/** Le sommaire d'un arbre : une rubrique, puis ses pages. */
function sommaire(arbre: NomArbre, depuis: string, lang: Lang): string[] {
  const lignes: string[] = []
  for (const r of ARBRES[arbre].rubriques) {
    const pages = pagesDeRubrique(arbre, r.id)
    if (pages.length === 0) continue
    lignes.push(`### ${r.titre[lang]}`, '')
    if (arbre === 'documentation' && accroches[r.id]) lignes.push(accroches[r.id][lang], '')
    for (const p of pages) lignes.push(`- [${p.titre[lang]}](${relatif(depuis, path.join(DOCS, fichierDe(arbre, p, lang)))})${lang === 'fr' ? ' : ' : ': '}${p.resume[lang]}`)
    lignes.push('')
  }
  return lignes
}

function page(arbre: NomArbre, p: PageDoc, lang: Lang): { fichier: string; contenu: string } {
  const t = T[lang]
  const fichier = fichierDe(arbre, p, lang)
  const autre: Lang = lang === 'fr' ? 'en' : 'fr'
  const accueil = arbre === 'documentation' && path.basename(fichier) === 'README.md'
  const lignes: string[] = [
    `<!-- ${t.genere} -->`,
    '',
    `# ${p.titre[lang]}`,
    '',
    `> ${p.resume[lang]}`,
    '',
    ...(accueil ? [] : [`[← ${t.retour}](${relatif(fichier, path.join(DOCS, lang, 'README.md'))}) · [${t.autre}](${relatif(fichier, path.join(DOCS, fichierDe(arbre, p, autre)))})`, '']),
    ...(accueil ? [`[${t.autre}](${relatif(fichier, path.join(DOCS, fichierDe(arbre, p, autre)))})`, ''] : []),
    ...p.contenu[lang].flatMap((b) => bloc(b, fichier, lang)),
  ]
  if (accueil) {
    lignes.push(`## ${t.sommaire}`, '', ...sommaire('documentation', fichier, lang), `## ${t.cas}`, '', t.casIntro, '', ...sommaire('cas', fichier, lang))
  }
  lignes.push('---', '', `${t.maj}${lang === 'fr' ? ' : ' : ': '}${p.maj} · [${t.surLeSite}](${SITE}${urlDe(arbre, p, lang)})`, '')
  return { fichier, contenu: lignes.join('\n').replace(/\n{3,}/g, '\n\n') }
}

// ── Tous les fichiers attendus ──────────────────────────────────────────────
const attendus = new Map<string, string>()
for (const lang of ['fr', 'en'] as Lang[]) {
  for (const arbre of ['documentation', 'cas'] as NomArbre[]) {
    for (const p of pagesEnOrdre(arbre)) {
      const { fichier, contenu } = page(arbre, p, lang)
      if (attendus.has(fichier)) throw new Error(`Deux pages donnent le même fichier : ${fichier}`)
      attendus.set(fichier, contenu)
    }
  }
}
attendus.set(
  'README.md',
  [
    '<!-- Page générée par scripts/exporter-docs.ts : ne pas la modifier ici. -->',
    '',
    '# Documentation de GeoTrends',
    '',
    'La documentation complète de l’outil, écran par écran, et les cas d’usage. Elle est recopiée du site à chaque mise à jour : les deux disent toujours la même chose.',
    '',
    '- 🇫🇷 [Documentation en français](./fr/README.md) · [Installer GeoTrends](./fr/demarrer/installer.md)',
    '- 🇬🇧 [Documentation in English](./en/README.md) · [Install GeoTrends](./en/get-started/install.md)',
    '',
    `Sur le site : [geotrends.io/documentation](${SITE}/documentation) · [geotrends.io/en/docs](${SITE}/en/docs)`,
    '',
  ].join('\n'),
)

// ── Comparer, puis écrire ───────────────────────────────────────────────────
function existants(dossier: string): string[] {
  if (!fs.existsSync(dossier)) return []
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? existants(path.join(dossier, f.name)) : f.name.endsWith('.md') ? [path.join(dossier, f.name)] : []))
}
// Seuls docs/README.md, docs/fr et docs/en appartiennent à ce script : le reste de docs/ n'est pas touché.
const surDisque = [...existants(path.join(DOCS, 'fr')), ...existants(path.join(DOCS, 'en'))].map((f) => path.relative(DOCS, f))
const enTrop = surDisque.filter((f) => !attendus.has(f))
const aEcrire = [...attendus].filter(([f, contenu]) => !fs.existsSync(path.join(DOCS, f)) || fs.readFileSync(path.join(DOCS, f), 'utf8') !== contenu)

if (VERIFIER) {
  if (aEcrire.length || enTrop.length) {
    console.error(`La documentation de GitHub (docs/) n’est plus à jour : ${aEcrire.length} fichier(s) à récrire, ${enTrop.length} en trop.`)
    for (const [f] of aEcrire.slice(0, 20)) console.error(`  ✗ docs/${f}`)
    for (const f of enTrop.slice(0, 20)) console.error(`  ✗ docs/${f} (page retirée)`)
    console.error('Lancez : npm run verifier-docs, puis enregistrez les fichiers de docs/.')
    process.exit(1)
  }
  console.log(`Documentation de GitHub à jour : ${attendus.size} fichiers.`)
} else {
  for (const [f, contenu] of aEcrire) {
    fs.mkdirSync(path.dirname(path.join(DOCS, f)), { recursive: true })
    fs.writeFileSync(path.join(DOCS, f), contenu)
  }
  for (const f of enTrop) fs.rmSync(path.join(DOCS, f))
  console.log(`Documentation de GitHub : ${attendus.size} fichiers, ${aEcrire.length} écrit(s), ${enTrop.length} retiré(s).`)
}
