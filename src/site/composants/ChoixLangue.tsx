import Link from 'next/link'
import type { Lang } from '../i18n'

/*
 * Choix de la langue du site, avec les drapeaux :
 * « FR | EN », la langue affichée en surbrillance, l'autre en lien vers la
 * même page dans cette langue. Les drapeaux sont dessinés (pas d'émoji : sous
 * Windows, un émoji de drapeau s'affiche en deux lettres).
 */

export function Drapeau({ lang, taille = 18 }: { lang: Lang; taille?: number }) {
  const h = Math.round((taille * 2) / 3)
  if (lang === 'fr') {
    return (
      <svg width={taille} height={h} viewBox="0 0 3 2" aria-hidden="true" className="drapeau">
        <rect width="1" height="2" fill="#002654" />
        <rect x="1" width="1" height="2" fill="#ffffff" />
        <rect x="2" width="1" height="2" fill="#ce1126" />
      </svg>
    )
  }
  return (
    <svg width={taille} height={h} viewBox="0 0 60 40" aria-hidden="true" className="drapeau" preserveAspectRatio="xMidYMid slice">
      <clipPath id="gt-uk-coins"><path d="M30 20h30v20zv20H0zH0V0zV0h30z" /></clipPath>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#ffffff" strokeWidth="8" />
      <path d="M0 0l60 40M60 0L0 40" clipPath="url(#gt-uk-coins)" stroke="#c8102e" strokeWidth="5" />
      <path d="M30 0v40M0 20h60" stroke="#ffffff" strokeWidth="12" />
      <path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="7" />
    </svg>
  )
}

const NOM: Record<Lang, string> = { fr: 'Français', en: 'English' }

/** Les deux langues côte à côte. `autreLien` : la même page dans l'autre langue. */
export function ChoixLangue({ lang, autreLien, className = '' }: { lang: Lang; autreLien: string; className?: string }) {
  const autre: Lang = lang === 'fr' ? 'en' : 'fr'
  const ordre: Lang[] = ['fr', 'en']
  return (
    <span className={`choix-langue ${className}`} role="group" aria-label={lang === 'fr' ? 'Langue du site' : 'Site language'}>
      {ordre.map((l) =>
        l === lang ? (
          <span key={l} className="langue actif" aria-current="true" title={NOM[l]}>
            <Drapeau lang={l} /> {l.toUpperCase()}
          </span>
        ) : (
          <Link key={l} href={autreLien} hrefLang={autre} lang={autre} className="langue" title={NOM[l]}>
            <Drapeau lang={l} /> {l.toUpperCase()}
          </Link>
        ),
      )}
    </span>
  )
}
