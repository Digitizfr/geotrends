import Link from 'next/link'
import { AppelFinal, LienFleche, NotesMarge, Tampon, riche } from '../composants/Blocs'
import { Cadre, Chapitre } from '../composants/Cadre'
import { IconeGithub } from '../composants/IconeGithub'
import { ECRANS, EcranProprietes, EcranVueDEnsemble, type CleEcran } from '../composants/Maquettes'
import { grapheAccueil, JsonLd } from '../composants/Seo'
import { accueil } from '../contenu/accueil'
import { commun } from '../contenu/commun'
import { compte, fonctionsDe, FONCTIONS, textes } from '../contenu/fonctions'
import { cas } from '../docs/cas'
import { resoudreLien, urlDe } from '../docs/registre'
import { GITHUB } from '../liens'
import { insecables } from '../typo'
import { chemin, FAMILLES, type Famille, type Lang } from '../i18n'

/** L'écran montré pour chaque famille sur l'accueil. */
const VUES: Record<Famille, CleEcran> = {
  mesurer: 'question',
  comprendre: 'concurrents',
  agir: 'actions',
  piloter: 'couts',
}

/** Numéro de chapitre, dans l'ordre d'apparition sur la page. */
const n = (i: number) => String(i).padStart(2, '0')

export function PageAccueil({ lang }: { lang: Lang }) {
  const t = accueil[lang]
  const c = commun[lang]
  const tx = textes[lang]
  const total = compte(FONCTIONS)
  const enConstruction = FONCTIONS.filter((f) => !f.pret)
  const guide = resoudreLien('demarrer/installer', lang) ?? chemin('documentation', lang)
  return (
    <Cadre lang={lang} page="accueil">
      <JsonLd donnees={grapheAccueil(lang, t.faq.liste)} />

      {/* ── Accroche : la thèse, puis l'interface tout de suite ───────────── */}
      <section className="cadre pt-10 md:pt-14">
        <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
          <div>
            <h1 className="titre monte max-w-[20ch] text-[clamp(2.5rem,6.6vw,5rem)]">{riche(t.accroche.titre)}</h1>
            <p className="chapo monte mt-6 max-w-[39rem]" style={{ ['--rang' as string]: 1 }}>{t.accroche.chapo}</p>
            <div className="monte mt-8 flex flex-wrap gap-3" style={{ ['--rang' as string]: 2 }}>
              <a href={GITHUB} className="bouton"><IconeGithub /> {t.accroche.github} <span aria-hidden="true">→</span></a>
              <a href="#installer" className="bouton bouton-creux">{t.accroche.comment}</a>
            </div>
          </div>
          <NotesMarge notes={t.accroche.marge} className="monte hidden lg:block" rang={3} />
        </div>
        <div className="monte mt-12 md:mt-14" style={{ ['--rang' as string]: 3 }}>
          <EcranVueDEnsemble lang={lang} note={t.accroche.noteEcran} />
        </div>
      </section>

      {/* ── Le prix : un abonnement, ou vos propres clés ──────────────────── */}
      <section className="cadre pt-20 md:pt-28" aria-labelledby="titre-prix">
        <Chapitre numero={n(1)} titre={t.prix.chapitre} />
        <div className="mt-8 grid gap-x-14 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="titre-prix" className="titre text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.06]">{riche(t.prix.titre)}</h2>
            {t.prix.textes.map((x) => <p key={x} className="doux mt-5">{x}</p>)}
            <p className="mt-7"><LienFleche href={chemin('budget', lang)}>{t.prix.lien}</LienFleche></p>
          </div>
          <div className="lg:col-span-7">
            <div className="overflow-x-auto">
              <table className="comparatif">
                <thead>
                  <tr>{t.prix.colonnes.map((x, i) => <th key={x} scope="col" className={i === 2 ? 'nous' : ''}>{x}</th>)}</tr>
                </thead>
                <tbody>
                  {t.prix.lignes.map(([nom, eux, nous], i) => (
                    <tr key={nom}>
                      <th scope="row">{nom}</th>
                      <td className={i < 2 ? 'montant' : ''}>{eux}</td>
                      <td className={`nous ${i < 2 ? 'montant' : ''}`}>{nous}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-lg font-semibold"><span className="surligne">{t.prix.resultat}</span></p>
            <p className="doux mt-4 text-[0.95rem]">{t.prix.honnete}</p>
            <p className="mt-4 text-sm text-[var(--encre-pale)]">{t.prix.source}</p>
          </div>
        </div>
      </section>

      {/* ── L'installer : trois étapes ────────────────────────────────────── */}
      <section id="installer" className="teinte mt-20 scroll-mt-6 py-20 md:mt-28 md:py-24" aria-labelledby="titre-installer">
        <div className="cadre">
          <Chapitre numero={n(2)} titre={t.installer.chapitre} />
          <div className="mt-8 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 id="titre-installer" className="titre max-w-[22ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.installer.titre}</h2>
              <p className="doux mt-5 max-w-[42rem]">{t.installer.texte}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={GITHUB} className="bouton"><IconeGithub /> {t.installer.github}</a>
            </div>
          </div>
          <ol className="cycle trois mt-12">
            {t.installer.etapes.map((e, i) => (
              <li key={e.nom} className="cycle-etape">
                <span className="titre cycle-numero" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold leading-tight">{e.nom}</h3>
                <p className="doux mt-3">{e.texte}</p>
                <pre className="commande mt-5"><code>{e.commande}</code></pre>
              </li>
            ))}
          </ol>
          <p className="mt-10"><LienFleche href={guide}>{t.installer.guide}</LienFleche></p>
        </div>
      </section>

      {/* ── Les clés d'API : laquelle, pour quoi, à quel prix ─────────────── */}
      <section id="cles" className="cadre scroll-mt-6 pt-20 md:pt-28" aria-labelledby="titre-cles">
        <Chapitre numero={n(3)} titre={t.cles.chapitre} />
        <div className="mt-8 grid gap-x-14 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="titre-cles" className="titre text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.06]">{t.cles.titre}</h2>
            <p className="doux mt-5">{t.cles.texte}</p>
          </div>
          <div className="lg:col-span-8">
            <div className="overflow-x-auto">
              <table className="comparatif cles">
                <thead>
                  <tr>{t.cles.colonnes.map((x, i) => <th key={i} scope="col">{x}</th>)}</tr>
                </thead>
                <tbody>
                  {t.cles.lignes.map(([nom, role, prix, besoin], i) => (
                    <tr key={nom}>
                      <th scope="row">{nom}</th>
                      <td>{role}</td>
                      <td>{prix}</td>
                      <td><span className={`machine ${i === 0 ? 'surligne' : 'text-[var(--encre-douce)]'}`}>{besoin}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="doux mt-5">{t.cles.suite}</p>
            <p className="mt-6"><LienFleche href={`${guide}#${lang === 'fr' ? 'cles' : 'keys'}`}>{t.cles.lien}</LienFleche></p>
          </div>
        </div>
      </section>

      {/* ── Les cinq IA et leur méthode ───────────────────────────────────── */}
      <section className="cadre pt-20 md:pt-28" aria-labelledby="titre-moteurs">
        <Chapitre numero={n(4)} titre={t.moteurs.chapitre} />
        <div className="mt-8 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <h2 id="titre-moteurs" className="titre max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.6rem)]">{t.moteurs.titre}</h2>
          <LienFleche href={chemin('moteurs', lang)}>{t.moteurs.lien}</LienFleche>
        </div>
        <ul className="lectures trait-fort mt-9" style={{ ['--colonnes' as string]: t.moteurs.liste.length }}>
          {t.moteurs.liste.map((m) => (
            <li key={m.nom} className="lecture !border-t-0">
              <Tampon methode={m.methode === 'api' ? 'api' : 'interface'} lang={lang} />
              <p className="mt-3 text-lg font-semibold leading-tight">{m.nom}</p>
              <p className="machine mt-2 text-[var(--encre-douce)]">{m.quinzaine ? t.moteurs.quinzaine : t.moteurs.semaine}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Comment ça marche : le cycle en quatre étapes ─────────────────── */}
      <section className="cadre pt-20 md:pt-28" aria-labelledby="titre-etapes">
        <Chapitre numero={n(5)} titre={t.etapes.chapitre} />
        <div className="mt-8 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <h2 id="titre-etapes" className="titre max-w-[22ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.etapes.titre}</h2>
          <LienFleche href={resoudreLien('demarrer/prise-en-main', lang) ?? chemin('documentation', lang)}>{t.etapes.lien}</LienFleche>
        </div>
        <ol className="cycle mt-12">
          {t.etapes.liste.map((e, i) => (
            <li key={e.nom} className="cycle-etape">
              <span className="titre cycle-numero" aria-hidden="true">{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold leading-tight">{e.nom}</h3>
              <p className="doux mt-3">{e.texte}</p>
              <p className="machine mt-5 text-[var(--encre-douce)]">{e.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Les quatre familles : un texte, un écran, un lien ─────────────── */}
      <section className="cadre pt-20 md:pt-28" aria-labelledby="titre-familles">
        <Chapitre numero={n(6)} titre={t.familles.chapitre} />
        <h2 id="titre-familles" className="titre mt-8 max-w-[22ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.familles.titre}</h2>
        <div className="mt-12">
          {FAMILLES.map((f, i) => {
            const b = t.familles.blocs[f]
            const m = compte(fonctionsDe(f))
            const Vue = ECRANS[VUES[f]]
            return (
              <article key={f} className="grid gap-x-14 gap-y-10 border-t border-[var(--filet)] py-12 md:py-16 lg:grid-cols-12 lg:items-center">
                <div className={`lg:col-span-5 ${i % 2 ? 'lg:order-2' : ''}`}>
                  <p className="machine"><span className="text-[var(--encre-pale)]">{String(i + 1).padStart(2, '0')}</span> <span className="ml-2">{c.familles[f]}</span></p>
                  <h3 className="titre mt-4 text-[clamp(1.65rem,2.9vw,2.4rem)] leading-[1.08]">{b.accroche}</h3>
                  <p className="doux mt-5">{b.texte}</p>
                  <ul className="puces mt-6 border-b border-[var(--filet)] text-[0.95rem]">
                    {b.points.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                    <LienFleche href={chemin(f, lang)}>{c.familles[f]}{c.dp}{c.nFonctions(m.total)}</LienFleche>
                    <span className="flex flex-wrap gap-x-5 gap-y-1">
                      {m.prets > 0 && <span className="machine etat-service">{c.nEnService(m.prets)}</span>}
                      {m.total - m.prets > 0 && <span className="machine etat-chantier text-[var(--encre-douce)]">{c.nEnConstruction(m.total - m.prets)}</span>}
                    </span>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <Vue lang={lang} />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Le registre : toutes les fonctions, d'un coup d'œil ───────────── */}
      <section className="cadre pt-16 md:pt-20" aria-labelledby="titre-registre">
        <Chapitre numero={n(7)} titre={t.registre.chapitre} />
        <div className="mt-8 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h2 id="titre-registre" className="titre text-[clamp(2rem,4.6vw,3.6rem)]">{t.registre.titre}</h2>
            <p className="doux mt-4 max-w-[40rem]">{t.registre.texte(total.total, total.prets)}</p>
          </div>
          <LienFleche href={chemin('fonctions', lang)}>{t.registre.lien}</LienFleche>
        </div>
        <div className="trait-fort mt-10 grid gap-x-10 gap-y-10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILLES.map((f) => (
            <div key={f}>
              <p className="machine"><Link href={chemin(f, lang)} className="hover:underline">{c.familles[f]}</Link></p>
              <ul className="mt-3 border-b border-[var(--filet)] text-[0.95rem]">
                {fonctionsDe(f).map((x) => (
                  <li key={x.id} className="trait flex items-baseline justify-between gap-3 py-2">
                    <Link href={`${chemin(f, lang)}#${x.id}`} className="hover:underline">{tx[x.id].nom}</Link>
                    <span className={`shrink-0 ${x.pret ? 'etat-service' : 'etat-chantier'}`} title={x.pret ? c.enService : c.enConstruction}><span className="sr-only">{x.pret ? c.enService : c.enConstruction}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {enConstruction.length > 0 && (
          <p className="mt-6 text-[0.95rem] text-[var(--encre-douce)]">
            <span className="machine etat-chantier mr-3 text-[var(--encre)]">{t.registre.construction}</span>
            {enConstruction.map((f) => tx[f.id].nom).join(' · ')}
          </p>
        )}
      </section>

      {/* ── Une marque n'est pas que son site ─────────────────────────────── */}
      <section className="teinte mt-20 py-20 md:mt-28 md:py-24" aria-labelledby="titre-proprietes">
        <div className="cadre">
          <Chapitre numero={n(8)} titre={t.proprietes.chapitre} />
          <div className="mt-10 grid gap-x-14 gap-y-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <EcranProprietes lang={lang} />
            </div>
            <div className="lg:col-span-6">
              <h2 id="titre-proprietes" className="titre max-w-[14ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.proprietes.titre}</h2>
              <p className="mt-6 text-lg">{t.proprietes.texte}</p>
              <p className="doux mt-4">{t.proprietes.suite}</p>
              <ul className="puces mt-6 border-b border-[var(--filet)] text-[0.95rem]">
                {t.proprietes.points.map((x) => <li key={x}>{x}</li>)}
              </ul>
              <p className="mt-7"><LienFleche href={`${chemin('mesurer', lang)}#presence`}>{t.proprietes.lien}</LienFleche></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cas d'usage : partir de la question qu'on se pose ──────────────── */}
      <section className="cadre pt-20 md:pt-28" aria-labelledby="titre-cas">
        <Chapitre numero={n(9)} titre={t.cas.chapitre} />
        <div className="mt-8 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h2 id="titre-cas" className="titre max-w-[22ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.cas.titre}</h2>
            <p className="doux mt-5 max-w-[42rem]">{t.cas.texte}</p>
          </div>
          <LienFleche href={chemin('cas', lang)}>{t.cas.lien}</LienFleche>
        </div>
        <div className="trait-fort mt-10 grid gap-x-10 gap-y-10 pt-8 md:grid-cols-2 lg:grid-cols-3">
          {cas.rubriques.map((r) => {
            const pages = cas.pages.filter((p) => p.rubrique === r.id)
            if (pages.length === 0) return null
            return (
              <div key={r.id}>
                <p className="machine">{lang === 'fr' ? insecables(r.titre.fr) : r.titre.en}</p>
                <ul className="mt-3 border-b border-[var(--filet)]">
                  {pages.map((p) => (
                    <li key={p.id} className="trait">
                      <Link href={urlDe('cas', p, lang)} className="cas-lien flex items-baseline justify-between gap-4 py-3">
                        <span>{lang === 'fr' ? insecables(p.titre.fr) : p.titre.en}</span>
                        <span aria-hidden="true" className="shrink-0">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── La méthode en quatre règles ───────────────────────────────────── */}
      <section className="sombre mt-20 py-20 md:mt-28 md:py-28" aria-labelledby="titre-methode">
        <div className="cadre">
          <Chapitre numero={n(10)} titre={t.methode.chapitre} inverse />
          <h2 id="titre-methode" className="titre mt-10 max-w-[18ch] text-[clamp(2rem,4.6vw,3.8rem)]">{t.methode.titre}</h2>
          <ol className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {t.methode.regles.map(([nom, texte], i) => (
              <li key={nom} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-2">
                <span className="titre text-5xl text-[var(--surligneur)]" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold">{nom}</h3>
                  <p className="doux mt-2">{texte}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-14"><LienFleche href={chemin('methode', lang)}>{t.methode.lien}</LienFleche></p>
        </div>
      </section>

      {/* ── Ce que ça coûte ───────────────────────────────────────────────── */}
      <section className="cadre pt-20 md:pt-28" aria-labelledby="titre-budget">
        <Chapitre numero={n(11)} titre={t.budget.chapitre} />
        <div className="mt-8 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h2 id="titre-budget" className="titre max-w-[20ch] text-[clamp(2rem,4.6vw,3.6rem)]">{riche(t.budget.titre)}</h2>
            <p className="doux mt-5 max-w-[42rem]">{t.budget.texte}</p>
          </div>
          <LienFleche href={chemin('budget', lang)}>{t.budget.lien}</LienFleche>
        </div>
        <ul className="lectures trait-fort mt-10" style={{ ['--colonnes' as string]: t.budget.chiffres.length }}>
          {t.budget.chiffres.map((x, i) => (
            <li key={x.nom} className="lecture !border-t-0 first:!pl-0">
              <p className="machine text-[var(--encre-pale)]">{i > 0 ? t.budget.environ : ' '}</p>
              <p className="titre mt-1 text-[clamp(2.2rem,4vw,3.2rem)] leading-none">{x.montant}</p>
              <p className="mt-3 font-semibold">{x.nom}</p>
              <p className="machine mt-1 text-[var(--encre-douce)]">{x.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Ce que l'outil refuse de faire ────────────────────────────────── */}
      <section className="cadre pt-20 md:pt-28" aria-labelledby="titre-refus">
        <Chapitre numero={n(12)} titre={t.refus.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
          <h2 id="titre-refus" className="titre text-[clamp(1.9rem,3.6vw,2.9rem)]">{t.refus.titre}</h2>
          <ul className="grid gap-x-12 sm:grid-cols-2">
            {t.refus.liste.map(([nom, texte]) => (
              <li key={nom} className="trait pb-8 pt-5">
                <h3 className="titre text-2xl"><span className="raye">{nom}</span></h3>
                <p className="doux mt-2">{texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Questions fréquentes ──────────────────────────────────────────── */}
      <section className="cadre pt-20 md:pt-28" aria-labelledby="titre-faq">
        <Chapitre numero={n(13)} titre={t.faq.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
          <div>
            <h2 id="titre-faq" className="titre text-[clamp(1.9rem,3.6vw,2.9rem)]">{t.faq.titre}</h2>
            <p className="mt-6"><LienFleche href={resoudreLien('demarrer/questions-frequentes', lang) ?? chemin('documentation', lang)}>{t.faq.lien}</LienFleche></p>
          </div>
          <div className="faq border-b border-[var(--filet)]">
            {t.faq.liste.map(([q, r]) => (
              <details key={q} className="faq-question">
                <summary>{q}</summary>
                <p className="doux pb-6 pr-10">{r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <AppelFinal lang={lang} second={{ page: 'documentation', nom: t.appel.nom }} />
    </Cadre>
  )
}
