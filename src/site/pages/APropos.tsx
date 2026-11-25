import { AppelFinal, Entete, LienFleche } from '../composants/Blocs'
import { Cadre, Chapitre } from '../composants/Cadre'
import { EcranProjet } from '../composants/Maquettes'
import { apropos } from '../contenu/apropos'
import { chemin, type Lang } from '../i18n'

export function PageAPropos({ lang }: { lang: Lang }) {
  const t = apropos[lang]
  return (
    <Cadre lang={lang} page="apropos">
      <Entete lang={lang} fil={[{ nom: t.fil }]} titre={t.titre} chapo={t.chapo} marge={t.marge} />

      {/* ── 01 D'où il vient ──────────────────────────────────────────────── */}
      <section className="cadre" aria-labelledby="titre-origine">
        <Chapitre numero="01" titre={t.origine.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 id="titre-origine" className="titre max-w-[15ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.origine.titre}</h2>
            <div className="mt-7 max-w-[36rem] space-y-4">
              {t.origine.textes.map((x, i) => <p key={x} className={i ? 'doux' : 'text-lg'}>{x}</p>)}
            </div>
          </div>
          <div>
            <dl>
              {t.origine.constats.map(([chiffre, texte], i) => (
                <div key={chiffre} className={`grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] items-baseline gap-x-6 py-5 ${i ? 'trait' : 'trait-fort'}`}>
                  <dt className="titre text-[clamp(2rem,3.6vw,2.9rem)]">{i === 2 ? <span className="surligne">{chiffre}</span> : chiffre}</dt>
                  <dd className="doux">{texte}</dd>
                </div>
              ))}
            </dl>
            <p className="doux mt-4 border-t border-[var(--filet)] pt-4 text-sm">{t.origine.source}</p>
          </div>
        </div>
      </section>

      {/* ── 02 Quatre principes ───────────────────────────────────────────── */}
      <section className="sombre mt-20 py-20 md:mt-28 md:py-28" aria-labelledby="titre-principes">
        <div className="cadre">
          <Chapitre numero="02" titre={t.principes.chapitre} inverse />
          <h2 id="titre-principes" className="titre mt-10 max-w-[16ch] text-[clamp(2rem,4.6vw,3.8rem)]">{t.principes.titre}</h2>
          <ol className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {t.principes.liste.map(([nom, texte], i) => (
              <li key={nom} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-2">
                <span className="titre text-5xl text-[var(--surligneur)]" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold">{nom}</h3>
                  <p className="doux mt-2">{texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 03 La feuille de route ────────────────────────────────────────── */}
      <section className="cadre pt-16 md:pt-24" aria-labelledby="titre-route">
        <Chapitre numero="03" titre={t.route.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="titre-route" className="titre text-[clamp(1.9rem,3.4vw,2.8rem)]">{t.route.titre}</h2>
            <ol className="mt-8 border-b border-[var(--filet)]">
              {t.route.etapes.map((e, i) => (
                <li key={e.nom} className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 py-6 ${i ? 'trait' : 'trait-fort'}`}>
                  <span className="chiffre-site text-sm text-[var(--encre-pale)]">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h3 className="titre text-2xl">{e.nom}</h3>
                      <span className={`machine ${e.fait ? 'etat-service' : 'etat-chantier text-[var(--encre-douce)]'}`}>{e.etat}</span>
                    </div>
                    <p className="doux mt-2">{e.texte}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8"><LienFleche href={chemin('fonctions', lang)}>{t.route.lien}</LienFleche></p>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <EcranProjet lang={lang} note={t.route.ecran} />
          </div>
        </div>
      </section>

      {/* ── 04 L'accès ────────────────────────────────────────────────────── */}
      <section className="cadre pt-16 md:pt-24" aria-labelledby="titre-acces">
        <Chapitre numero="04" titre={t.acces.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <h2 id="titre-acces" className="titre max-w-[14ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.acces.titre}</h2>
          <div className="max-w-[36rem] space-y-4">
            {t.acces.textes.map((x, i) => <p key={x} className={i ? 'doux' : 'text-lg'}>{x}</p>)}
          </div>
        </div>
      </section>

      <AppelFinal lang={lang} second={{ page: 'fonctions', nom: t.appel.nom }} />
    </Cadre>
  )
}
