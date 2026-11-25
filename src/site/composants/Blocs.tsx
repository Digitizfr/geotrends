import Link from 'next/link'
import { Fragment } from 'react'
import { commun } from '../contenu/commun'
import { chemin, type Lang, type Page } from '../i18n'
import { GITHUB } from '../liens'
import { IconeGithub } from './IconeGithub'
import { grapheFil, JsonLd } from './Seo'

/*
 * Briques communes aux pages du site public. Elles ne portent aucun texte en
 * dur : tout vient des fichiers de contenu (src/site/contenu).
 */

/** Texte de contenu avec deux marques : [[surligné]] et **gras**. */
export function riche(texte: string): React.ReactNode {
  return texte.split(/(\[\[.+?\]\]|\*\*.+?\*\*)/g).map((bout, i) => {
    if (bout.startsWith('[[')) return <span key={i} className="surligne">{bout.slice(2, -2)}</span>
    if (bout.startsWith('**')) return <strong key={i}>{bout.slice(2, -2)}</strong>
    return <Fragment key={i}>{bout}</Fragment>
  })
}

/** Ouverture d'une page intérieure : fil, grand titre, chapô, et notes de marge. */
export function Entete({ lang, fil, titre, chapo, marge, children }: { lang: Lang; fil: { page?: Page; nom: string }[]; titre: string; chapo: string; marge?: readonly string[]; children?: React.ReactNode }) {
  return (
    <section className="cadre pb-14 pt-10 md:pb-20 md:pt-16">
      <JsonLd donnees={grapheFil(lang, fil.map((f) => ({ nom: f.nom, href: f.page ? chemin(f.page, lang) : undefined })))} />
      <nav aria-label={commun[lang].fil} className="machine monte text-[var(--encre-douce)]">
        <ol className="flex flex-wrap gap-x-2 gap-y-1">
          <li><Link href={chemin('accueil', lang)} className="hover:underline">GeoTrends</Link></li>
          {fil.map((f, i) => (
            <li key={f.nom} className="flex gap-2">
              <span aria-hidden="true">/</span>
              {f.page && i < fil.length - 1 ? <Link href={chemin(f.page, lang)} className="hover:underline">{f.nom}</Link> : <span aria-current="page" className="text-[var(--encre)]">{f.nom}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-7 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
        <div>
          <h1 className="titre monte max-w-[19ch] text-[clamp(2.4rem,6.2vw,4.9rem)]" style={{ ['--rang' as string]: 1 }}>{riche(titre)}</h1>
          <p className="chapo monte mt-7 max-w-[40rem]" style={{ ['--rang' as string]: 2 }}>{chapo}</p>
          {children && <div className="monte mt-8" style={{ ['--rang' as string]: 3 }}>{children}</div>}
        </div>
        {marge && <NotesMarge notes={marge} className="monte" rang={3} />}
      </div>
    </section>
  )
}

/** Petites notes de méthode posées dans la marge, en caractères de machine. */
export function NotesMarge({ notes, className = '', rang = 0 }: { notes: readonly string[]; className?: string; rang?: number }) {
  return (
    <ul className={`notes-marge machine text-[var(--encre-douce)] ${className}`} style={{ ['--rang' as string]: rang }}>
      {notes.map((n) => <li key={n}>{n}</li>)}
    </ul>
  )
}

/** État d'une fonction : « en service » ou « en construction », toujours écrit. */
export function Etat({ pret, lang, className = '' }: { pret: boolean; lang: Lang; className?: string }) {
  const t = commun[lang]
  return <span className={`machine ${pret ? 'etat-service' : 'etat-chantier text-[var(--encre-douce)]'} ${className}`}>{pret ? t.enService : t.enConstruction}</span>
}

/** Tampon de méthode : relevé de l'interface, ou réponse de l'API. */
export function Tampon({ methode, lang }: { methode: 'interface' | 'api'; lang: Lang }) {
  return <span className={`tampon ${methode}`}>{commun[lang][methode]}</span>
}

export function LienFleche({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`lien-fleche ${className}`}>
      {children} <span aria-hidden="true">→</span>
    </Link>
  )
}

/** Dernier bloc de chaque page : le seul appel à l'action du site. */
export function AppelFinal({ lang, titre, texte, second }: { lang: Lang; titre?: string; texte?: string; second?: { page: Page; nom: string } }) {
  const t = commun[lang]
  return (
    <section className="cadre pt-20 md:pt-28" aria-labelledby="appel-final">
      <div className="trait-fort grid gap-8 pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <h2 id="appel-final" className="titre max-w-[20ch] text-[clamp(2rem,4.6vw,3.6rem)]">{riche(titre ?? t.appel.titre)}</h2>
          <p className="doux mt-5 max-w-xl">{texte ?? t.appel.texte}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={GITHUB} className="bouton"><IconeGithub /> {t.appel.github} <span aria-hidden="true">→</span></a>
          {second && <Link href={chemin(second.page, lang)} className="bouton bouton-creux">{second.nom}</Link>}
        </div>
      </div>
    </section>
  )
}
