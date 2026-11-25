/*
 * Vérifie que la documentation colle à l'outil. À lancer après chaque
 * changement d'écran ou de page :  npx tsx scripts/verifier-docs.ts
 *
 * Erreurs (le script s'arrête avec le code 1) :
 *  - un écran de l'outil (chaque page.tsx sous src/app/(app)) qu'aucune page de
 *    la documentation ne décrit dans son champ `ecrans` ;
 *  - une page qui décrit un écran qui n'existe plus ;
 *  - un lien « doc: » ou un renvoi qui ne mène à aucune page ;
 *  - des blocs français et anglais qui ne se répondent pas (nombre, types, captures) ;
 *  - une page sans date de mise à jour, une rubrique inconnue, un identifiant ou
 *    une adresse en double ;
 *  - une capture citée qui manque au manifeste (simple avertissement tant que le
 *    manifeste n'a pas encore été écrit par le script des captures).
 * Les écrans qui ne font que rediriger (anciennes adresses) sont mis de côté,
 * après avoir vérifié qu'ils ne font bien que cela.
 */

import fs from 'node:fs'
import path from 'node:path'
import { ARBRES, liensDoc, textesDe, titresDe, toutesLesPages, trouverParId, type NomArbre } from '../src/site/docs/registre'
import { manifeste } from '../src/site/docs/captures'
import type { Bloc, PageDoc } from '../src/site/docs/types'

const RACINE = path.resolve(__dirname, '..')
const OUTIL = path.join(RACINE, 'src', 'app', '(app)')
/** Anciennes adresses : elles doivent seulement rediriger. */
const REDIRECTIONS_ATTENDUES = ['/visibilite', '/releves', '/releves/[id]', '/admin']

const erreurs: string[] = []
const avertissements: string[] = []
const erreur = (m: string) => erreurs.push(m)
const avertir = (m: string) => avertissements.push(m)

// ── 1. Les écrans de l'outil ────────────────────────────────────────────────
function pagesDe(dossier: string): string[] {
  const trouvees: string[] = []
  for (const nom of fs.readdirSync(dossier, { withFileTypes: true })) {
    const complet = path.join(dossier, nom.name)
    if (nom.isDirectory()) trouvees.push(...pagesDe(complet))
    else if (nom.name === 'page.tsx' || nom.name === 'page.ts') trouvees.push(complet)
  }
  return trouvees
}

/** « src/app/(app)/questions/[id]/page.tsx » → « /questions/[id] ». Les groupes « (x) » ne comptent pas dans l'adresse. */
const routeDe = (fichier: string) =>
  '/' +
  path
    .relative(OUTIL, path.dirname(fichier))
    .split(path.sep)
    .filter((s) => s && !/^\(.*\)$/.test(s))
    .join('/')

/** Une page qui ne fait que rediriger : elle appelle redirect() et n'affiche rien. */
const neFaitQueRediriger = (source: string) => /\bredirect\(/.test(source) && !/return\s*\(?\s*</.test(source) && !/<[A-Za-z]/.test(source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''))

const ecransOutil = new Set<string>()
const redirections = new Set<string>()
for (const f of pagesDe(OUTIL)) {
  const route = routeDe(f)
  if (neFaitQueRediriger(fs.readFileSync(f, 'utf8'))) redirections.add(route)
  else ecransOutil.add(route)
}
for (const r of REDIRECTIONS_ATTENDUES) {
  if (ecransOutil.has(r)) erreur(`L’ancienne adresse ${r} n’est plus une simple redirection : c’est devenu un écran, à documenter (champ « ecrans ») et à retirer de REDIRECTIONS_ATTENDUES.`)
}

const decrits = new Map<string, string[]>()
for (const p of ARBRES.documentation.pages) for (const e of p.ecrans ?? []) decrits.set(e, [...(decrits.get(e) ?? []), p.id])
for (const e of [...ecransOutil].sort()) {
  if (!decrits.has(e)) erreur(`Écran non documenté : ${e}. Ajoutez-le au champ « ecrans » de la page qui le décrit (ou écrivez cette page).`)
}
for (const arbre of ['documentation', 'cas'] as NomArbre[]) {
  for (const p of ARBRES[arbre].pages) {
    for (const e of p.ecrans ?? []) {
      if (!ecransOutil.has(e) && !redirections.has(e)) erreur(`${p.id} : l’écran ${e} n’existe pas dans l’outil (adresse changée ou écran retiré ?).`)
    }
  }
}

// ── 2. Les pages elles-mêmes ────────────────────────────────────────────────
const capturesConnues = (lang: 'fr' | 'en') => new Set(Object.keys(manifeste.captures?.[lang] ?? {}))
const manifesteEcrit = !!manifeste.genere
const capturesCitees = new Map<string, Set<string>>()

const nomsDeCaptures = (blocs: Bloc[]) => blocs.flatMap((b) => (b.type === 'capture' ? [b.nom] : b.type === 'etapes' ? b.items.flatMap((x) => (x.capture ? [x.capture] : [])) : []))

function verifierPage(arbre: NomArbre, p: PageDoc) {
  const ici = `${arbre} › ${p.id}`
  const rubriques = new Set(ARBRES[arbre].rubriques.map((r) => r.id))
  if (!rubriques.has(p.rubrique)) erreur(`${ici} : rubrique inconnue « ${p.rubrique} ».`)
  if (!p.maj) erreur(`${ici} : pas de date de mise à jour (champ « maj »).`)
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(p.maj) || Number.isNaN(new Date(p.maj).getTime())) erreur(`${ici} : date de mise à jour illisible « ${p.maj} » (attendu AAAA-MM-JJ).`)
  for (const lang of ['fr', 'en'] as const) {
    if (!p.titre?.[lang]?.trim()) erreur(`${ici} : pas de titre en ${lang}.`)
    if (!p.resume?.[lang]?.trim()) erreur(`${ici} : pas de résumé en ${lang}.`)
    else if (/^(À écrire|To be written)/.test(p.resume[lang])) erreur(`${ici} : page encore à l’état de brouillon (${lang}).`)
    else if (p.resume[lang].length < 90 || p.resume[lang].length > 200) avertir(`${ici} : résumé de ${p.resume[lang].length} signes en ${lang} (visé : 150 à 160).`)
    if (!Array.isArray(p.contenu?.[lang]) || p.contenu[lang].length === 0) erreur(`${ici} : aucun contenu en ${lang}.`)
  }
  const fr = p.contenu?.fr ?? []
  const en = p.contenu?.en ?? []
  if (fr.length !== en.length) erreur(`${ici} : ${fr.length} blocs en français, ${en.length} en anglais.`)
  for (let i = 0; i < Math.min(fr.length, en.length); i++) {
    const a = fr[i]
    const b = en[i]
    if (a.type !== b.type) {
      erreur(`${ici} : bloc ${i + 1} de type « ${a.type} » en français, « ${b.type} » en anglais.`)
      continue
    }
    if (a.type === 'capture' && b.type === 'capture' && a.nom !== b.nom) erreur(`${ici} : bloc ${i + 1}, capture « ${a.nom} » en français, « ${b.nom} » en anglais.`)
    if (a.type === 'liste' && b.type === 'liste' && a.items.length !== b.items.length) erreur(`${ici} : bloc ${i + 1}, liste de ${a.items.length} éléments en français, ${b.items.length} en anglais.`)
    if (a.type === 'etapes' && b.type === 'etapes') {
      if (a.items.length !== b.items.length) erreur(`${ici} : bloc ${i + 1}, ${a.items.length} étapes en français, ${b.items.length} en anglais.`)
      a.items.forEach((x, j) => { if ((x.capture ?? '') !== (b.items[j]?.capture ?? '')) erreur(`${ici} : bloc ${i + 1}, étape ${j + 1} : captures différentes.`) })
    }
    if (a.type === 'tableau' && b.type === 'tableau' && (a.colonnes.length !== b.colonnes.length || a.lignes.length !== b.lignes.length)) erreur(`${ici} : bloc ${i + 1}, tableau de forme différente entre les deux langues.`)
    if (a.type === 'tableau' && a.lignes.some((l) => l.length !== a.colonnes.length)) erreur(`${ici} : bloc ${i + 1}, une ligne du tableau n’a pas autant de cases que de colonnes.`)
    if (a.type === 'liens' && b.type === 'liens' && a.items.map((x) => x.page).join() !== b.items.map((x) => x.page).join()) erreur(`${ici} : bloc ${i + 1}, renvois différents entre les deux langues.`)
    if (a.type === 'encadre' && b.type === 'encadre' && a.ton !== b.ton) erreur(`${ici} : bloc ${i + 1}, encadré « ${a.ton} » en français, « ${b.ton} » en anglais.`)
  }
  for (const lang of ['fr', 'en'] as const) {
    const blocs = p.contenu?.[lang] ?? []
    const ids = blocs.flatMap((b) => (b.type === 'h2' ? [b.id] : []))
    const doublons = ids.filter((x, i) => ids.indexOf(x) !== i)
    if (doublons.length) erreur(`${ici} : ancre en double en ${lang} : ${[...new Set(doublons)].join(', ')}.`)
    if (titresDe(blocs).some((x) => !x.id)) erreur(`${ici} : un titre sans ancre en ${lang}.`)
    for (const b of blocs) {
      for (const id of textesDe(b).flatMap(liensDoc).concat(b.type === 'liens' ? b.items.map((x) => x.page) : [])) {
        if (!trouverParId(id.split('#')[0])) erreur(`${ici} (${lang}) : le lien « doc:${id} » ne mène à aucune page.`)
      }
      // Une marque de mise en forme mal fermée reste visible telle quelle dans la page.
      for (const t of textesDe(b)) {
        const ouvert = (t.match(/\*\*/g) ?? []).length % 2 !== 0 || (t.match(/\[\[/g) ?? []).length !== (t.match(/\]\]/g) ?? []).length || (t.match(/`/g) ?? []).length % 2 !== 0
        if (ouvert) erreur(`${ici} (${lang}) : marque **, [[ ]] ou \` mal fermée dans « ${t.slice(0, 60)}… ».`)
      }
    }
    for (const nom of nomsDeCaptures(blocs)) {
      capturesCitees.set(`${lang}:${nom}`, (capturesCitees.get(`${lang}:${nom}`) ?? new Set()).add(p.id))
    }
  }
}

for (const arbre of ['documentation', 'cas'] as NomArbre[]) {
  const a = ARBRES[arbre]
  const ids = a.pages.map((p) => p.id)
  for (const id of ids.filter((x, i) => ids.indexOf(x) !== i)) erreur(`${arbre} : identifiant en double « ${id} ».`)
  for (const lang of ['fr', 'en'] as const) {
    const slugs = a.pages.map((p) => (p.slug?.[lang] ?? '').replace(/^\/+|\/+$/g, ''))
    for (const s of slugs.filter((x, i) => slugs.indexOf(x) !== i)) erreur(`${arbre} : adresse en double en ${lang} : « ${s || '(accueil)'} ».`)
    for (const s of slugs) if (s && !/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(s)) erreur(`${arbre} : adresse mal formée en ${lang} : « ${s} » (minuscules, chiffres et tirets).`)
  }
  for (const p of a.pages) verifierPage(arbre, p)
}
// Un identifiant ne doit pas exister dans les deux arbres : un lien « doc: » serait ambigu.
const docIds = new Set(ARBRES.documentation.pages.map((p) => p.id))
for (const p of ARBRES.cas.pages) if (docIds.has(p.id)) erreur(`Identifiant présent dans les deux arbres : « ${p.id} ».`)

// ── 3. Les captures ─────────────────────────────────────────────────────────
for (const [cle, pages] of capturesCitees) {
  const [lang, nom] = cle.split(':') as ['fr' | 'en', string]
  if (!capturesConnues(lang).has(nom)) {
    const m = `Capture « ${nom} » (${lang}) absente du manifeste, citée par ${[...pages].join(', ')}.`
    if (manifesteEcrit) erreur(m)
    else avertir(m)
  }
}
if (!manifesteEcrit) avertir('Le manifeste des captures (public/docs/captures/manifeste.json) n’a pas encore été écrit : les captures manquantes sont signalées sans bloquer.')

// ── Bilan ───────────────────────────────────────────────────────────────────
const total = toutesLesPages()
console.log(`Documentation : ${ARBRES.documentation.pages.length} pages, cas d’usage : ${ARBRES.cas.pages.length} pages (${total.length * 2} adresses en français et en anglais).`)
console.log(`Écrans de l’outil : ${ecransOutil.size} documentés à vérifier, ${redirections.size} anciennes adresses qui redirigent (${[...redirections].sort().join(', ')}).`)
if (avertissements.length) {
  console.log(`\n${avertissements.length} avertissement${avertissements.length > 1 ? 's' : ''} :`)
  for (const a of avertissements) console.log(`  · ${a}`)
}
if (erreurs.length) {
  console.log(`\n${erreurs.length} erreur${erreurs.length > 1 ? 's' : ''} :`)
  for (const e of erreurs) console.log(`  ✗ ${e}`)
  process.exit(1)
}
console.log('\nTout est en ordre.')
