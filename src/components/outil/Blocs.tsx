import Link from 'next/link'
import { NomLogo, Signe } from '@/site/composants/LogoSite'
import type { Moteur } from '@/lib/fournisseurs/types'
import { tr } from '@/lib/i18n/courante'
import { nomCourt, ordinal, pct, pluriel } from '@/lib/libelles'
import { METHODE, VERDICTS, type Ecart, type Etat, type ReleveLu, type Verdict } from '@/lib/mesures'
import { Aide } from './Aide'
import { IcoChevronDroite } from './Icones'
import { Initiale } from './Initiale'

export { Aide, Initiale }

/*
 * Briques d'affichage de l'outil. Elles reprennent les classes du site public
 * (écran, pastille, jauge, tampon, règle graduée) : l'outil est la version
 * complète des écrans montrés sur le site.
 */

/** Logo de l'outil : le signe du site et le nom, dans la même police. */
export function LogoOutil({ taille = 24 }: { taille?: number }) {
  return (
    <span className="logo-site inline-flex items-center gap-2">
      <Signe taille={taille} />
      <NomLogo taille={taille * 0.8} />
    </span>
  )
}

/**
 * Tête d'écran : un titre court en Gloock, puis une seule phrase de verdict (ce
 * que l'écran dit aujourd'hui), puis la règle graduée du site. La rubrique est
 * dans le fil d'Ariane de la barre du haut. Les explications de méthode vont
 * dans <CommentLire> ou dans des bulles d'aide, pas ici.
 */
export function EnTete({ titre, verdict, children, actions, grand = false }: { titre: React.ReactNode; verdict?: React.ReactNode; children?: React.ReactNode; actions?: React.ReactNode; grand?: boolean; /** @deprecated la rubrique est dans la barre du haut */ rubrique?: string }) {
  return (
    <header className="tete-ecran">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h1 className={grand ? 'synthese max-w-5xl' : 'titre-page'}>{titre}</h1>
          {verdict && <p className="phrase">{verdict}</p>}
          {children && <div className="largeur-lecture mt-2 text-[var(--encre-douce)]">{children}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      <div className="regle mt-4" aria-hidden="true" />
    </header>
  )
}

/** Les explications de méthode d'un écran, repliées : « Comment lire cet écran ». */
export function CommentLire({ children, titre }: { children: React.ReactNode; titre?: string }) {
  return (
    <details className="comment-lire">
      <summary><IcoChevronDroite taille={13} className="chevron" />{titre ?? tr('Comment lire cet écran')}</summary>
      <div className="corps">{children}</div>
    </details>
  )
}

/** Une feuille : l'« écran » du site, avec sa barre de titre et son ombre dure. */
export function Feuille({ titre, aide, droite, children, className = '', id, note }: { titre: React.ReactNode; /** Bulle d'aide à côté du titre : comment lire ce bloc. */ aide?: React.ReactNode; droite?: React.ReactNode; children: React.ReactNode; className?: string; id?: string; /** À réserver à une information qui change la lecture ; l'explication de méthode va dans `aide`. */ note?: React.ReactNode }) {
  return (
    <section id={id} className={`ecran ${className}`}>
      <div className="ecran-barre">
        <span className="flex min-w-0 items-center gap-2">
          <Signe taille={16} />
          <h2 className="t4 truncate">{titre}</h2>
          {aide && <Aide libelle={tr('Comment lire ce bloc')}>{aide}</Aide>}
        </span>
        {droite && <span className="etiquette flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-right">{droite}</span>}
      </div>
      {note && <p className="second border-b border-[var(--filet)] px-4 py-2.5">{note}</p>}
      <div className="ecran-corps">{children}</div>
    </section>
  )
}

/** Tampon de méthode, comme sur le site : plein pour l'interface, en pointillés pour l'API. */
export function Tampon({ methode }: { methode: 'interface' | 'api' }) {
  return <span className={`tampon ${methode}`} title={methode === 'api' ? tr('Réponse du modèle seul, par son API : jamais additionnée aux relevés d’interface') : tr('Relevé dans l’interface : ce que voit un internaute')}>{methode === 'api' ? 'API' : tr('interface')}</span>
}

/**
 * La ligne de méthode, la même partout : MÉTHODE · N RELEVÉS · PÉRIODE.
 * Elle accompagne chaque chiffre clé et le pied de chaque tableau.
 */
export function LigneMethode({ methode, n, unite = 'relevé', periode, suite, className = '' }: { methode: 'interface' | 'api'; n: number; unite?: string; periode?: string; suite?: string; className?: string }) {
  return (
    <p className={`machine ${className}`}>
      <Tampon methode={methode} /> <span className="whitespace-nowrap">{pluriel(n, unite)}</span>
      {periode && <span> · {periode}</span>}
      {suite && <span> · {suite}</span>}
    </p>
  )
}

/** Un écart avec le relevé d'avant : coloré seulement s'il dépasse la marge d'erreur, gris sinon. */
export function EcartLu({ e, vide }: { e: Ecart | null; vide?: string }) {
  if (!e) return <span className="tuile-ecart marge">{vide ?? tr('1re mesure')}</span>
  const signe = e.points > 0 ? '+' : e.points < 0 ? '−' : '±'
  const points = `${signe}${Math.abs(e.points)}\u00a0${Math.abs(e.points) > 1 ? 'pts' : 'pt'}`
  if (e.sens === 'hausse') return <span className="tuile-ecart hausse" title={tr('Hausse réelle : l’écart dépasse la marge d’erreur')}>▲ {points}</span>
  if (e.sens === 'baisse') return <span className="tuile-ecart baisse" title={tr('Baisse réelle : l’écart dépasse la marge d’erreur')}>▼ {points}</span>
  return <span className="tuile-ecart marge" title={e.sens === 'tot' ? tr('Trop peu de relevés pour dire si l’écart est réel') : tr('L’écart ne dépasse pas la marge d’erreur : on ne peut pas parler de hausse ni de baisse')}>{points} · {e.sens === 'tot' ? tr('trop peu de relevés') : tr('dans la marge')}</span>
}

/**
 * Chiffre clé, en tuile compacte : le libellé et sa bulle d'aide (comment le
 * chiffre est calculé), la valeur et l'écart avec le relevé d'avant, puis une
 * seule ligne discrète : la méthode et le nombre de relevés. La petite
 * tendance, à droite, mène au graphique.
 *
 * - `ecart` : non fourni, rien ; `null`, « 1re mesure ».
 * - `base` : la taille de l'échantillon en clair (« 79 réponses · 3 sur 79 »).
 */
export function Tuile({ titre, aide, children, ecart, ecartVide, methode, base, tendance, href, api = false, note }: { titre: string; aide?: React.ReactNode; children: React.ReactNode; ecart?: Ecart | null; ecartVide?: string; methode?: 'interface' | 'api'; base?: React.ReactNode; tendance?: React.ReactNode; href?: string; api?: boolean; note?: React.ReactNode }) {
  return (
    <div className={`tuile ${api ? 'api' : ''}`}>
      {href && <Link href={href} className="tuile-lien" aria-label={`${titre} : ${tr('voir le détail')}`} />}
      <div className="tuile-tete">
        <p className="etiquette" title={titre}>{titre}</p>
        {aide && <Aide>{aide}</Aide>}
      </div>
      <div className="tuile-valeur">
        <div className="grand-chiffre">{children}</div>
        {note && <span className="second">{note}</span>}
        {ecart !== undefined && <EcartLu e={ecart} vide={ecartVide} />}
        {tendance && <div className="tuile-tendance">{tendance}</div>}
      </div>
      {(methode || base) && (
        <p className="tuile-pied">
          {methode && <Tampon methode={methode} />}
          {base && <span>{base}</span>}
        </p>
      )}
    </div>
  )
}

/** « À partir de 5 relevés », à la place d'un chiffre trop fragile. */
export function TropTot({ seuil }: { seuil: number }) {
  return <span className="block font-[family-name:var(--font-corps)] text-[0.8125rem] font-normal leading-snug tracking-normal text-[var(--encre-douce)]" title={tr('Avec moins de relevés, un pourcentage ne voudrait rien dire')}>{tr('À partir de {seuil} relevés', { seuil })}</span>
}

/** État vide : pourquoi c'est vide, quoi faire, un bouton. */
export function Vide({ titre, children, action }: { titre: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="vide">
      <p className="titre text-[1.5rem]">{titre}</p>
      {children && <div className="mt-2 max-w-2xl text-[var(--encre-douce)]">{children}</div>}
      {action && <div className="mt-5 flex flex-wrap items-center gap-3">{action}</div>}
    </div>
  )
}

export function Bandeau({ children, erreur = false, action }: { children: React.ReactNode; erreur?: boolean; action?: React.ReactNode }) {
  return (
    <div className={`bandeau flex flex-wrap items-center justify-between gap-x-6 gap-y-3 ${erreur ? 'erreur' : ''}`} role={erreur ? 'alert' : 'status'}>
      <div className="min-w-0 max-w-3xl">{children}</div>
      {action}
    </div>
  )
}

// ── États d'un relevé ───────────────────────────────────────────────────────

const ETATS: Record<Etat, { signe: string; mot: string; classe: string; long: string }> = {
  citee: { signe: '◆', mot: 'Citée', classe: 'cite', long: 'une page ou une vidéo de la marque figure parmi les sources' },
  nommee: { signe: '●', mot: 'Nommée', classe: 'nomme', long: 'le nom de la marque est dans la réponse' },
  lue: { signe: '◇', mot: 'Lue', classe: 'neutre', long: 'une page de la marque a été lue par l’IA, sans être citée' },
  absente: { signe: '○', mot: 'Absente', classe: 'absent', long: 'l’IA a répondu sans la marque' },
  vide: { signe: '·', mot: 'Pas d’aperçu', classe: 'sans', long: 'l’IA n’a rien affiché : ce n’est pas une absence' },
  attente: { signe: '…', mot: 'En attente', classe: 'sans', long: 'la réponse n’est pas encore revenue' },
  echec: { signe: '!', mot: 'Échec', classe: 'erreur', long: 'le relevé n’a pas abouti' },
}

export const libelleEtat = (e: Etat) => tr(ETATS[e].mot)
export const classeEtat = (e: Etat) => ETATS[e].classe

/** Un signe et un mot, jamais la couleur seule. Le rang s'affiche quand il est connu. */
export function EtatLu({ r, etat, rang }: { r?: ReleveLu; etat?: Etat; rang?: number | null }) {
  const e = r?.etat ?? etat ?? 'absente'
  const rg = r ? r.rang : rang
  const x = ETATS[e]
  const mot = e === 'vide' && r && r.moteur !== 'google_ai_overview' ? 'Sans réponse' : x.mot
  return (
    <span className={`pastille ${x.classe}`} title={tr(x.long)}>
      <span className="signe" aria-hidden="true">{x.signe}</span>
      {tr(mot)}
      {rg && (e === 'nommee' || e === 'citee') ? <span className="chiffre"> · {ordinal(rg)}</span> : null}
    </span>
  )
}

/** Petit carreau de la grille questions × IA, comme sur l'écran du site. */
export function Carreau({ etat }: { etat: Etat | null }) {
  const classe = !etat ? 'rien' : etat === 'citee' ? 'cite' : etat === 'nommee' ? 'nomme' : etat === 'absente' || etat === 'lue' ? 'absent' : 'neutre'
  return <span className={`carreau ${classe}`} role="img" aria-label={etat ? tr(ETATS[etat].mot) : tr('Pas encore relevée')} title={etat ? `${tr(ETATS[etat].mot)} : ${tr(ETATS[etat].long)}` : tr('Pas encore relevée')} />
}

export function LegendeEtats({ carreaux = false }: { carreaux?: boolean }) {
  const liste: Etat[] = ['citee', 'nommee', 'lue', 'absente', 'vide']
  return (
    <ul className="second flex flex-wrap gap-x-5 gap-y-1.5">
      {liste.filter((e) => !carreaux || e !== 'lue').map((e) => (
        <li key={e} className="flex items-center gap-2">
          {carreaux ? <Carreau etat={e} /> : <EtatLu etat={e} />}
          <span>{carreaux ? `${tr(ETATS[e].mot)} : ` : ''}{tr(ETATS[e].long)}</span>
        </li>
      ))}
    </ul>
  )
}

/** Un trait par relevé : jaune quand la marque est là. */
/** Au-delà de ce nombre (une mesure approfondie en ajoute 25), seuls les derniers relevés sont dessinés : la ligne ne déborde pas du tableau. */
const COCHES_MAX = 16

export function Coches({ releves }: { releves: ReleveLu[] }) {
  const presents = releves.filter((r) => r.present).length
  const vus = releves.slice(-COCHES_MAX)
  const caches = releves.length - vus.length
  return (
    <span className="coches inline-flex" role="img" aria-label={tr('{k} sur {n} relevés avec la marque', { k: presents, n: releves.length })}>
      {caches > 0 && <small className="coches-plus" aria-hidden="true">+{caches}</small>}
      {vus.map((r) => <span key={r.id} className={r.present ? 'la' : r.statut === 'recu' ? 'absente' : 'rien'} />)}
    </span>
  )
}

export function VerdictLu({ v }: { v: Verdict }) {
  const x = VERDICTS[v]
  const classe = x.classe === 'present' ? 'nomme' : x.classe === 'absent' ? 'absent' : 'sans'
  return (
    <span className={`pastille ${classe}`}>
      <span className="signe" aria-hidden="true">{x.signe}</span>
      {tr(x.libelle.charAt(0).toUpperCase() + x.libelle.slice(1))}
    </span>
  )
}

/** Tête de colonne d'une IA : le nom en toutes lettres, et la méthode. */
export function TeteMoteur({ moteur }: { moteur: Moteur }) {
  return (
    <>
      {nomCourt(moteur)}
      {METHODE[moteur] === 'api' && <span className="ml-1 normal-case tracking-normal">(API)</span>}
    </>
  )
}

// ── Onglets ─────────────────────────────────────────────────────────────────

export function Onglets({ onglets, actif, libelle }: { onglets: { cle: string; libelle: string; href: string; n?: number | null }[]; actif: string; libelle: string }) {
  return (
    <nav className="onglets" aria-label={libelle}>
      {onglets.map((o) => (
        <Link key={o.cle} href={o.href} scroll={false} className="onglet" aria-current={o.cle === actif ? 'page' : undefined}>
          {o.libelle}
          {o.n !== undefined && o.n !== null && <span className="chiffre ml-1.5 text-[0.75rem] opacity-70">{o.n}</span>}
        </Link>
      ))}
    </nav>
  )
}

/** Rangée de choix exclusifs (liens), pour une vue ou un tri. */
export function Choix({ libelle, options, actif }: { libelle: string; options: { cle: string; libelle: string; href: string }[]; actif: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={libelle}>
      <span className="etiquette">{libelle}</span>
      {options.map((o) => (
        <Link key={o.cle} href={o.href} scroll={false} className="choix" aria-current={o.cle === actif ? 'true' : undefined}>{o.libelle}</Link>
      ))}
    </div>
  )
}

// ── Barres ──────────────────────────────────────────────────────────────────

export type LigneBarre = { cle: string; libelle: React.ReactNode; valeur: number; texte: string; note?: React.ReactNode; nous?: boolean; href?: string; pointillee?: boolean }

/** Barres horizontales : le classement du site, avec sa jauge. Notre ligne est surlignée. */
export function Barres({ lignes, max, libelle, colonneNote = false }: { lignes: LigneBarre[]; max?: number; libelle: string; colonneNote?: boolean }) {
  const plafond = max ?? Math.max(...lignes.map((l) => l.valeur), 0)
  return (
    <ul aria-label={libelle}>
      {lignes.map((l, i) => {
        const nom = l.nous ? <span className="nous-plein font-semibold">{l.libelle}</span> : <span className="font-semibold">{l.libelle}</span>
        return (
          <li key={l.cle} className={`grid items-center gap-x-3 gap-y-1 px-4 py-2 ${colonneNote ? 'grid-cols-[minmax(0,1fr)_minmax(4rem,30%)_auto] sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto_minmax(0,11rem)]' : 'grid-cols-[minmax(0,11rem)_minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto]'} ${i ? 'ligne-t' : ''} ${l.nous ? 'bg-[var(--papier)]' : ''}`}>
            <span className="min-w-0 truncate">{l.href ? <Link href={l.href} className="hover:underline">{nom}</Link> : nom}</span>
            <div className={`jauge ${l.nous ? 'jaune' : ''} ${l.pointillee ? 'pointillee' : ''}`}><span style={{ width: `${plafond ? Math.max(l.valeur > 0 ? 1.5 : 0, (l.valeur / plafond) * 100) : 0}%` }} /></div>
            <span className="nb min-w-[3.5rem] text-right">{l.texte}</span>
            {colonneNote && <span className="second col-span-3 min-w-0 truncate sm:col-span-1">{l.note}</span>}
          </li>
        )
      })}
    </ul>
  )
}

/** Une marque ou un site : la pastille carrée à l'initiale, le nom, et l'étiquette « à nous » surlignée. */
export function NomMarque({ nom, nous = false, href, suite }: { nom: string; nous?: boolean; href?: string; suite?: React.ReactNode }) {
  const texte = <span className="min-w-0 truncate font-semibold">{nom}</span>
  return (
    <span className="nom-marque">
      <Initiale nom={nom} nous={nous} />
      {href ? <Link href={href} className="ligne-lien min-w-0 truncate hover:underline">{texte}</Link> : texte}
      {nous && <span className="etiquette-nous">{tr('à nous')}</span>}
      {suite}
    </span>
  )
}

export type LigneClassement = { cle: string; nom: string; valeur: number; texte: string; nous?: boolean; href?: string; ecart?: React.ReactNode; note?: React.ReactNode; pointillee?: boolean }

/**
 * Classement en barres horizontales, la grammaire commune à tous les écrans :
 * le rang, la pastille, le nom (« à nous » surligné), la valeur et son écart,
 * puis la barre. Notre ligne est teintée.
 */
export function Classement({ lignes, max, libelle }: { lignes: LigneClassement[]; max?: number; libelle: string }) {
  const plafond = max ?? Math.max(...lignes.map((l) => l.valeur), 0)
  return (
    <ol className="classement" aria-label={libelle}>
      {lignes.map((l, i) => (
        <li key={l.cle} className={l.nous ? 'nous' : ''}>
          <span className="rang">{i + 1}</span>
          <Initiale nom={l.nom} nous={l.nous} />
          <span className="flex min-w-0 items-center gap-2">
            {l.href ? <Link href={l.href} className="min-w-0 truncate font-semibold hover:underline">{l.nom}</Link> : <span className="min-w-0 truncate font-semibold">{l.nom}</span>}
            {l.nous && <span className="etiquette-nous">{tr('à nous')}</span>}
            {l.note && <span className="second min-w-0 truncate">{l.note}</span>}
          </span>
          <span className="valeur">{l.texte}{l.ecart && <span className="ml-2">{l.ecart}</span>}</span>
          <div className={`jauge fine ${l.nous ? 'jaune' : ''} ${l.pointillee ? 'pointillee' : ''}`}><span style={{ width: `${plafond ? Math.max(l.valeur > 0 ? 1.5 : 0, (l.valeur / plafond) * 100) : 0}%` }} /></div>
        </li>
      ))}
    </ol>
  )
}

export type Segment = { cle: string; libelle: string; n: number; teinte: string; href?: string }

/** Une seule barre découpée, avec sa légende chiffrée dessous. Jamais d'anneau ni de camembert. */
export function Decoupe({ segments, libelle, unite }: { segments: Segment[]; libelle: string; unite: string }) {
  const total = segments.reduce((n, s) => n + s.n, 0)
  const visibles = segments.filter((s) => s.n > 0)
  if (total === 0) return null
  return (
    <div>
      <div className="decoupe" role="img" aria-label={`${libelle} : ${visibles.map((s) => `${s.libelle} ${pct(s.n / total)}`).join(', ')}`}>
        {visibles.map((s) => (
          <span key={s.cle} className={s.teinte} style={{ width: `${(s.n / total) * 100}%` }} title={`${s.libelle} : ${s.n} ${unite}`}>
            {(s.n / total) >= 0.12 ? pct(s.n / total) : ''}
          </span>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.8125rem]">
        {segments.map((s) => {
          const texte = (
            <>
              <span className={`pave ${s.teinte}`} style={{ boxShadow: 'inset 0 0 0 1px var(--encre)' }} aria-hidden="true" />
              {s.libelle} <span className="nb text-[var(--encre-douce)]">{s.n} · {pct(s.n / total)}</span>
            </>
          )
          return <li key={s.cle} className={s.n === 0 ? 'discret' : ''}>{s.href ? <Link href={s.href} scroll={false} className="hover:underline">{texte}</Link> : texte}</li>
        })}
      </ul>
    </div>
  )
}

/** Lien de tri pour une tête de colonne. */
export function Tri({ cle, actif, href, children }: { cle: string; actif: string; href: string; children: React.ReactNode }) {
  return (
    <Link href={href} scroll={false} aria-current={actif === cle ? 'true' : undefined} title={tr('Trier sur cette colonne')}>
      {children}
      <span aria-hidden="true">{actif === cle ? ' ▾' : ''}</span>
    </Link>
  )
}

/** Champ de recherche d'un tableau : un formulaire simple, qui garde les autres réglages de l'adresse. */
export function Recherche({ valeur, garde = {}, libelle, placeholder }: { valeur: string; garde?: Record<string, string | undefined>; libelle: string; placeholder?: string }) {
  return (
    <form method="get" className="flex items-center gap-2" role="search">
      {Object.entries(garde).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <label className="invisible-lecteur" htmlFor="recherche-tableau">{libelle}</label>
      <input id="recherche-tableau" type="search" name="q" defaultValue={valeur} placeholder={placeholder ?? libelle} className="champ !w-56 !py-1.5 !text-[0.875rem]" />
      <button type="submit" className="bouton bouton-creux bouton-petit">{tr('Chercher')}</button>
    </form>
  )
}

/** Adresse de la page courante avec des paramètres changés : sert aux onglets, aux tris et aux filtres. */
export function adresse(base: string, params: Record<string, string | undefined | null>, change: Record<string, string | undefined | null> = {}) {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries({ ...params, ...change })) if (v) p.set(k, v)
  const q = p.toString()
  return q ? `${base}?${q}` : base
}
