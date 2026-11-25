import Link from 'next/link'
import { Gloock, Hanken_Grotesk } from 'next/font/google'
import { resoudreLien } from '../docs/registre'
import { chemin, FAMILLES, type Lang, type Page } from '../i18n'
import { GITHUB, LICENCE, LICENCE_URL } from '../liens'
import { ChoixLangue, Drapeau } from './ChoixLangue'
import { IconeGithub } from './IconeGithub'
import { LogoSite } from './LogoSite'
import '../../app/vitrine.css'

const titre = Gloock({ subsets: ['latin'], weight: '400', variable: '--font-titre' })
const corps = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-corps' })

const T = {
  fr: {
    menu: { fonctions: 'Fonctionnalités', cas: 'Cas d’usage', methode: 'Méthode', moteurs: 'IA suivies', budget: 'Budget', documentation: 'Documentation', apropos: 'À propos' },
    familles: { mesurer: 'Mesurer', comprendre: 'Comprendre', agir: 'Agir', piloter: 'Piloter' },
    connexion: 'Se connecter',
    contenu: 'Aller au contenu',
    autreLangue: 'English',
    produit: 'Produit',
    enSavoirPlus: 'En savoir plus',
    signature: 'GeoTrends relève ce que les IA répondent vraiment sur votre marque, et dit quoi corriger. Logiciel libre et gratuit, à installer chez vous.',
    mention: 'Logiciel libre, fait par Digitiz. Licence',
    installer: 'Installer GeoTrends',
    code: 'Code source',
    exemple: 'Les écrans présentés sur ce site montrent des données d’exemple.',
  },
  en: {
    menu: { fonctions: 'Features', cas: 'Use cases', methode: 'Method', moteurs: 'AI engines', budget: 'Budget', documentation: 'Docs', apropos: 'About' },
    familles: { mesurer: 'Measure', comprendre: 'Understand', agir: 'Act', piloter: 'Steer' },
    connexion: 'Sign in',
    contenu: 'Skip to content',
    autreLangue: 'Français',
    produit: 'Product',
    enSavoirPlus: 'Learn more',
    signature: 'GeoTrends records what AI assistants really answer about your brand, and tells you what to fix. Free, open-source software you install yourself.',
    mention: 'Open-source software, made by Digitiz. Licence',
    installer: 'Install GeoTrends',
    code: 'Source code',
    exemple: 'The screens shown on this site display sample data.',
  },
} as const

const MENU: Page[] = ['fonctions', 'cas', 'methode', 'moteurs', 'budget', 'documentation']

/**
 * Enveloppe commune à toutes les pages du site public : polices, en-tête, pied de page.
 * `autreLien` : adresse de la même page dans l'autre langue, quand elle n'est pas
 * celle de `page` (pages de la documentation et des cas d'usage).
 */
export function Cadre({ lang, page, autreLien, children }: { lang: Lang; page: Page; autreLien?: string; children: React.ReactNode }) {
  const t = T[lang]
  const autre: Lang = lang === 'fr' ? 'en' : 'fr'
  const versAutre = autreLien ?? chemin(page, autre)
  const ici = (p: Page) => p === page || (p === 'fonctions' && (FAMILLES as readonly string[]).includes(page))
  const guide = resoudreLien('demarrer/installer', lang) ?? chemin('documentation', lang)
  return (
    <div className={`site ${titre.variable} ${corps.variable}`} lang={lang}>
      <a href="#contenu" className="evitement">{t.contenu}</a>
      <header className="cadre flex items-center justify-between gap-4 py-5">
        <Link href={chemin('accueil', lang)} aria-label="GeoTrends">
          <LogoSite taille={32} />
        </Link>
        <nav className="hidden items-center gap-5 whitespace-nowrap text-[0.92rem] lg:flex" aria-label={t.produit}>
          {MENU.map((p) => (
            <Link key={p} href={chemin(p, lang)} className={`lien-menu ${ici(p) ? 'actif' : ''}`} aria-current={ici(p) ? 'page' : undefined}>
              {t.menu[p as keyof typeof t.menu]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 xl:gap-4">
          <ChoixLangue lang={lang} autreLien={versAutre} className="hidden sm:inline-flex" />
          <Link href="/connexion" className="lien-menu hidden whitespace-nowrap text-[0.92rem] md:inline lg:hidden xl:inline">{t.connexion}</Link>
          <a href={GITHUB} className="bouton !py-2"><IconeGithub /> GitHub</a>
        </div>
      </header>
      <nav className="cadre flex gap-5 overflow-x-auto pb-3 text-sm lg:hidden" aria-label={t.produit}>
        {MENU.map((p) => (
          <Link key={p} href={chemin(p, lang)} className={`lien-menu whitespace-nowrap ${ici(p) ? 'actif' : ''}`}>
            {t.menu[p as keyof typeof t.menu]}
          </Link>
        ))}
        <ChoixLangue lang={lang} autreLien={versAutre} className="inline-flex shrink-0 sm:hidden" />
      </nav>
      <div className="cadre"><div className="regle" /></div>

      <main id="contenu">{children}</main>

      <footer className="mt-24 border-t-2 border-[var(--encre)]">
        <div className="cadre grid gap-10 py-14 md:grid-cols-[minmax(0,1.4fr)_1fr_1fr]">
          <div>
            <LogoSite taille={34} />
            <p className="mt-4 max-w-sm text-[var(--encre-douce)]">{t.signature}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={GITHUB} className="bouton"><IconeGithub /> {t.installer} <span aria-hidden="true">→</span></a>
              <Link href="/connexion" className="hover:underline">{t.connexion}</Link>
            </div>
          </div>
          <div>
            <p className="machine text-[var(--encre-pale)]">{t.menu.fonctions}</p>
            <ul className="mt-4 space-y-2">
              {FAMILLES.map((f) => (
                <li key={f}><Link href={chemin(f, lang)} className="hover:underline">{t.familles[f]}</Link></li>
              ))}
              <li><Link href={chemin('fonctions', lang)} className="hover:underline">{lang === 'fr' ? 'Toutes les fonctions' : 'All features'}</Link></li>
            </ul>
          </div>
          <div>
            <p className="machine text-[var(--encre-pale)]">{t.enSavoirPlus}</p>
            <ul className="mt-4 space-y-2">
              {(['cas', 'documentation', 'methode', 'moteurs', 'budget', 'apropos'] as Page[]).map((p) => (
                <li key={p}><Link href={chemin(p, lang)} className="hover:underline">{t.menu[p as keyof typeof t.menu]}</Link></li>
              ))}
              <li><Link href={guide} className="hover:underline">{t.installer}</Link></li>
              <li><a href={GITHUB} className="hover:underline">{t.code}</a></li>
              <li><Link href={versAutre} hrefLang={autre} className="inline-flex items-center gap-2 hover:underline"><Drapeau lang={autre} /> {t.autreLangue}</Link></li>
            </ul>
          </div>
        </div>
        <div className="cadre flex flex-wrap justify-between gap-x-8 gap-y-1 pb-4 text-sm text-[var(--encre-pale)]">
          <p>{t.mention} <a href={LICENCE_URL} className="underline underline-offset-4">{LICENCE}</a>.</p>
          <p>{t.exemple}</p>
        </div>
        <div className="cadre pb-6"><div className="regle" /></div>
      </footer>
    </div>
  )
}

/** Étiquette numérotée qui ouvre chaque section. */
export function Chapitre({ numero, titre: t, inverse = false }: { numero: string; titre: string; inverse?: boolean }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className={`machine ${inverse ? 'opacity-60' : 'text-[var(--encre-pale)]'}`}>{numero}</span>
      <span className="machine">{t}</span>
      <span className={`flex-1 self-center border-t ${inverse ? 'border-[rgba(242,238,227,0.25)]' : 'border-[var(--filet)]'}`} />
    </div>
  )
}
