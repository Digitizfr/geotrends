import Link from 'next/link'
import { AppelFinal, Entete, Etat, LienFleche } from '../composants/Blocs'
import { Cadre } from '../composants/Cadre'
import { ECRANS } from '../composants/Maquettes'
import { commun } from '../contenu/commun'
import { compte, familles, fonctionsDe, hub, numero, pageFamille, textes } from '../contenu/fonctions'
import { chemin, FAMILLES, type Famille, type Lang } from '../i18n'

/** Page d'une famille : une vraie section par fonction, avec son état et, pour les principales, son écran. */
export function PageFamille({ lang, famille }: { lang: Lang; famille: Famille }) {
  const c = commun[lang]
  const t = familles[lang][famille]
  const tx = textes[lang]
  const pf = pageFamille[lang]
  const liste = fonctionsDe(famille)
  const n = compte(liste)
  const marge = [c.nFonctions(n.total), ...(n.prets ? [c.nEnService(n.prets)] : []), ...(n.total - n.prets ? [c.nEnConstruction(n.total - n.prets)] : []), ...t.marge]
  return (
    <Cadre lang={lang} page={famille}>
      <Entete lang={lang} fil={[{ page: 'fonctions', nom: hub[lang].fil }, { nom: c.familles[famille] }]} titre={t.titre} chapo={t.chapo} marge={marge} />

      {/* ── Sommaire de la famille ────────────────────────────────────────── */}
      <nav className="cadre" aria-label={pf.sommaire}>
        <p className="machine text-[var(--encre-pale)]">{pf.sommaire}</p>
        <ol className="trait-fort mt-3 grid gap-x-12 sm:grid-cols-2">
          {liste.map((x) => (
            <li key={x.id} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-[var(--filet)] py-2.5">
              <span className="chiffre-site text-sm text-[var(--encre-pale)]">{numero(x.id)}</span>
              <a href={`#${x.id}`} className="font-semibold hover:underline">{tx[x.id].nom}</a>
              <Etat pret={x.pret} lang={lang} />
            </li>
          ))}
        </ol>
      </nav>

      {/* ── Une section par fonction ──────────────────────────────────────── */}
      <div className="cadre mt-16 md:mt-20">
        {liste.map((x) => {
          const f = tx[x.id]
          const Vue = x.ecran ? ECRANS[x.ecran] : null
          return (
            <section key={x.id} id={x.id} aria-labelledby={`titre-${x.id}`} className="grid scroll-mt-6 gap-x-14 gap-y-6 border-t border-[var(--encre)] py-12 md:py-16 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-8 lg:self-start">
                <p className="chiffre-site text-sm text-[var(--encre-pale)]">{numero(x.id)}</p>
                <h2 id={`titre-${x.id}`} className="titre mt-2 text-[clamp(1.75rem,2.8vw,2.35rem)] leading-[1.06]">{f.nom}</h2>
                <p className="mt-4"><Etat pret={x.pret} lang={lang} /></p>
              </div>
              <div className="min-w-0">
                <p className="machine text-[var(--encre-pale)]">{c.ceQueCaFait}</p>
                <p className="mt-2 max-w-[43rem] text-lg">{f.detail}</p>
                <div className="decision mt-8 max-w-[43rem]">
                  <p className="machine text-[var(--encre-douce)]">{c.decision}</p>
                  <p className="mt-1.5 font-semibold">{f.decision}</p>
                </div>
                {f.limite && (
                  <p className="doux mt-7 max-w-[43rem] text-[0.95rem]"><span className="machine mr-2 text-[var(--encre)]">{c.aSavoir}</span>{f.limite}</p>
                )}
                {Vue && x.pret && (
                  <div className="mt-10">
                    <Vue lang={lang} note={f.noteEcran} />
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* ── Les autres familles ───────────────────────────────────────────── */}
      <section className="cadre pt-10 md:pt-16" aria-labelledby="titre-autres">
        <h2 id="titre-autres" className="machine text-[var(--encre-pale)]">{pf.autres}</h2>
        <ul className="mt-3 border-b-2 border-[var(--encre)]">
          {FAMILLES.filter((f) => f !== famille).map((f) => {
            const m = compte(fonctionsDe(f))
            return (
              <li key={f} className="porte">
                <Link href={chemin(f, lang)} className="grid items-baseline gap-x-10 gap-y-2 py-7 md:grid-cols-[13rem_minmax(0,1fr)_auto]">
                  <span className="titre text-4xl"><span className="porte-titre">{c.familles[f]}</span></span>
                  <span>
                    <span className="block text-lg">{familles[lang][f].question}</span>
                    <span className="machine mt-1 block text-[var(--encre-douce)]">{c.nFonctions(m.total)} · {c.nEnService(m.prets)}</span>
                  </span>
                  <span className="lien-fleche !border-0" aria-hidden="true"><span>→</span></span>
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="mt-8"><LienFleche href={chemin('fonctions', lang)}>{hub[lang].registre.titre}</LienFleche></p>
      </section>

      <AppelFinal lang={lang} second={{ page: 'methode', nom: hub[lang].appel.nom }} />
    </Cadre>
  )
}
