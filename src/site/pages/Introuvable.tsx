import Link from 'next/link'
import { Cadre } from '../composants/Cadre'
import { chemin, type Lang, type Page } from '../i18n'

// Page 404. Elle ne connaît pas la langue de l'adresse demandée : elle répond
// donc dans les deux, et renvoie vers les pages qui existent.
const T = {
  fr: { titre: 'Cette page n’existe pas.', texte: 'L’adresse est fausse, ou la page a été déplacée. Voici celles qui existent.', pages: [['accueil', 'Accueil'], ['fonctions', 'Fonctionnalités'], ['methode', 'Méthode'], ['moteurs', 'IA suivies'], ['budget', 'Budget'], ['apropos', 'À propos']] },
  en: { titre: 'This page does not exist.', texte: 'The address is wrong, or the page has moved. Here are the ones that exist.', pages: [['accueil', 'Home'], ['fonctions', 'Features'], ['methode', 'Method'], ['moteurs', 'AI engines'], ['budget', 'Budget'], ['apropos', 'About']] },
} as const

export function PageIntrouvable() {
  return (
    <Cadre lang="fr" page="accueil">
      <section className="cadre pb-10 pt-12 md:pt-20">
        <p className="machine text-[var(--encre-douce)]">404</p>
        <div className="mt-6 grid gap-x-14 gap-y-14 md:grid-cols-2">
          {(['fr', 'en'] as Lang[]).map((lang) => (
            <div key={lang} lang={lang} className={lang === 'en' ? 'md:border-l md:border-[var(--filet)] md:pl-14' : ''}>
              {lang === 'fr'
                ? <h1 className="titre text-[clamp(2.2rem,5vw,3.8rem)]"><span className="raye">{T.fr.titre}</span></h1>
                : <p className="titre text-[clamp(2.2rem,5vw,3.8rem)]"><span className="raye">{T.en.titre}</span></p>}
              <p className="chapo mt-5">{T[lang].texte}</p>
              <ul className="mt-7 border-b border-[var(--filet)]">
                {T[lang].pages.map(([page, nom]) => (
                  <li key={page} className="trait py-2.5"><Link href={chemin(page as Page, lang)} className="font-semibold hover:underline">{nom} <span aria-hidden="true">→</span></Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </Cadre>
  )
}
