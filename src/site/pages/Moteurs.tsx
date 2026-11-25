import { AppelFinal, Entete, Tampon } from '../composants/Blocs'
import { Cadre, Chapitre } from '../composants/Cadre'
import { moteurs } from '../contenu/moteurs'
import type { Lang } from '../i18n'

const CLASSE = { oui: 'oui', non: 'non', lu: 'oui lu' } as const

export function PageMoteurs({ lang }: { lang: Lang }) {
  const t = moteurs[lang]
  return (
    <Cadre lang={lang} page="moteurs">
      <Entete lang={lang} fil={[{ nom: t.fil }]} titre={t.titre} chapo={t.chapo} marge={t.marge} />

      {/* ── Une fiche par IA ──────────────────────────────────────────────── */}
      <section className="cadre" aria-labelledby="titre-fiches">
        <Chapitre numero="01" titre={t.fiches.chapitre} />
        <h2 id="titre-fiches" className="sr-only">{t.fiches.chapitre}</h2>
        <div className="mt-10">
          {t.fiches.liste.map((m, i) => (
            <article key={m.nom} className={`grid gap-x-12 gap-y-6 py-10 md:py-14 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,20rem)] ${m.api ? 'border-t border-dashed border-[var(--encre)]' : 'border-t border-[var(--encre)]'}`}>
              <div>
                <p className="chiffre-site text-sm text-[var(--encre-pale)]">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="titre mt-2 text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.04]">{m.nom}</h3>
                <p className="machine mt-2 text-[var(--encre-douce)]">{m.editeur}</p>
                <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <Tampon methode={m.api ? 'api' : 'interface'} lang={lang} />
                  <span className="machine">{m.api ? t.fiches.quinzaine : t.fiches.semaine}</span>
                </p>
                {m.api && <p className="machine mt-2 text-[var(--encre-douce)]">{t.fiches.aPart}</p>}
              </div>
              <div>
                <p className="text-lg">{m.texte}</p>
                <p className="decision doux mt-6 text-[0.95rem]">{m.note}</p>
              </div>
              <div>
                <p className="machine text-[var(--encre-pale)]">{t.fiches.contient}</p>
                <ul className="mt-2 border-b border-[var(--filet)] text-[0.95rem]">
                  {m.contient.map((x) => <li key={x} className="trait py-2">{x}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── La matrice : ce que chaque relevé contient ────────────────────── */}
      <section className="teinte py-20 md:py-24" aria-labelledby="titre-matrice">
        <div className="cadre">
          <Chapitre numero="02" titre={t.matrice.chapitre} />
          <div className="mt-10 grid gap-x-14 gap-y-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
            <h2 id="titre-matrice" className="titre max-w-[18ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.matrice.titre}</h2>
            <p className="doux">{t.matrice.texte}</p>
          </div>
          <div className="defile mt-10" tabIndex={0} role="region" aria-labelledby="titre-matrice">
            <table className="matrice text-[0.95rem]" style={{ minWidth: '46rem' }}>
              <thead>
                <tr>
                  <th scope="col" className="machine !font-normal text-[var(--encre-douce)]">{t.matrice.donnee}</th>
                  {t.matrice.colonnes.map((col, j) => (
                    <th key={col} scope="col" className={j === 4 ? 'a-part' : ''}>
                      {col}
                      <span className="mt-1 block"><Tampon methode={j === 4 ? 'api' : 'interface'} lang={lang} /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.matrice.lignes.map((ligne, i) => (
                  <tr key={ligne}>
                    <th scope="row">{ligne}</th>
                    {moteurs.MATRICE[i].map((c, j) => (
                      <td key={j} className={j === 4 ? 'a-part' : ''}><span className={CLASSE[c]}>{t.matrice.cases[c]}</span></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="doux mt-5 max-w-[46rem] text-sm">{t.matrice.legende}</p>
        </div>
      </section>

      {/* ── Pays et langue ────────────────────────────────────────────────── */}
      <section className="cadre pt-16 md:pt-24" aria-labelledby="titre-pays">
        <Chapitre numero="03" titre={t.pays.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <h2 id="titre-pays" className="titre max-w-[17ch] text-[clamp(1.9rem,3.4vw,2.8rem)]">{t.pays.titre}</h2>
          <p className="text-lg">{t.pays.texte}</p>
        </div>
      </section>

      {/* ── À venir ───────────────────────────────────────────────────────── */}
      <section className="cadre pt-16 md:pt-24" aria-labelledby="titre-avenir">
        <Chapitre numero="04" titre={t.avenir.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 id="titre-avenir" className="titre text-[clamp(1.9rem,3.4vw,2.8rem)]">{t.avenir.titre}</h2>
            <p className="doux mt-5 max-w-[34rem]">{t.avenir.texte}</p>
            <ul className="mt-7 max-w-[34rem] border-b border-[var(--filet)]">
              {t.avenir.liste.map(([nom, etat]) => (
                <li key={nom} className="trait flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
                  <span className="titre text-2xl">{nom}</span>
                  <span className="machine etat-chantier text-[var(--encre-douce)]">{etat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="decision self-start">
            <h3 className="machine text-[var(--encre-douce)]">{t.avenir.pourquoi}</h3>
            <p className="mt-2 text-lg">{t.avenir.pourquoiTexte}</p>
          </div>
        </div>
      </section>

      <AppelFinal lang={lang} second={{ page: 'methode', nom: t.appel.nom }} />
    </Cadre>
  )
}
