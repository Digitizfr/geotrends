import { AppelFinal, Entete } from '../composants/Blocs'
import { Cadre, Chapitre } from '../composants/Cadre'
import { EcranCouts, EcranLancer } from '../composants/Maquettes'
import { budget } from '../contenu/budget'
import type { Lang } from '../i18n'

export function PageBudget({ lang }: { lang: Lang }) {
  const t = budget[lang]
  return (
    <Cadre lang={lang} page="budget">
      <Entete lang={lang} fil={[{ nom: t.fil }]} titre={t.titre} chapo={t.chapo} marge={t.marge} />

      {/* ── 01 Le prix d'un relevé ────────────────────────────────────────── */}
      <section className="cadre" aria-labelledby="titre-unite">
        <Chapitre numero="01" titre={t.unite.chapitre} />
        <h2 id="titre-unite" className="titre mt-10 max-w-[20ch] text-[clamp(1.9rem,3.4vw,2.8rem)]">{t.unite.titre}</h2>
        <dl className="mt-10 grid gap-x-14 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {t.unite.prix.map((p, i) => (
            <div key={p.nom} className={i ? 'border-t border-dashed border-[var(--encre)] pt-5' : 'trait-fort pt-5'}>
              <dt>
                <span className="machine text-[var(--encre-douce)]">{p.nom}</span>
                <span className="titre mt-3 block text-[clamp(2.6rem,6vw,4.4rem)]">{p.montant}</span>
              </dt>
              <dd className="doux mt-4 max-w-[34rem]">{p.texte}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 02 Un exemple chiffré ─────────────────────────────────────────── */}
      <section className="teinte mt-20 py-20 md:mt-24 md:py-24" aria-labelledby="titre-exemple">
        <div className="cadre">
          <Chapitre numero="02" titre={t.exemple.chapitre} />
          <div className="mt-10 grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
            <div>
              <h2 id="titre-exemple" className="titre max-w-[17ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.exemple.titre}</h2>
              <div className="mt-6 max-w-[40rem] space-y-4">
                {t.exemple.textes.map((x, i) => <p key={x} className={i ? 'doux' : 'text-lg'}>{x}</p>)}
              </div>
              <div className="defile mt-10">
                <table className="matrice chiffre-site text-sm" style={{ minWidth: '30rem' }}>
                  <caption className="machine pb-3 text-left text-[var(--encre-douce)]">{t.exemple.tableau.titre}</caption>
                  <thead>
                    <tr>
                      {t.exemple.tableau.colonnes.map((col, j) => <th key={col} scope="col" className={`machine !font-normal ${j ? 'text-right' : ''}`}>{col}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {t.exemple.tableau.lignes.map((ligne, i) => (
                      <tr key={ligne[0]} className={i === 1 ? 'font-semibold' : ''}>
                        <th scope="row">{i === 1 ? <span className="surligne">{ligne[0]}</span> : ligne[0]}</th>
                        {ligne.slice(1).map((v, j) => <td key={j} className="!text-right">{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="ticket mx-auto w-full max-w-sm" role="group" aria-label={t.exemple.chapitre}>
              <p className="text-center font-bold tracking-widest">GEOTRENDS</p>
              <p className="text-center text-[var(--encre-pale)]">{t.exemple.ticket.entete}</p>
              <p className="my-3 border-t border-dashed border-[var(--encre-pale)]" />
              {t.exemple.ticket.lignes.map((l) => (
                <div key={l.nom} className="mb-3">
                  <p className="font-bold">{l.nom}</p>
                  <p className="text-[var(--encre-douce)]">{l.detail}</p>
                  <p className="ligne text-[var(--encre-douce)]">
                    <span>{l.calcul}</span>
                    <span className="points" />
                    <span className="text-[var(--encre)]">{l.montant}</span>
                  </p>
                </div>
              ))}
              <p className="my-3 border-t border-dashed border-[var(--encre-pale)]" />
              <p className="ligne text-base font-bold">
                <span>TOTAL</span>
                <span className="points" />
                <span>{t.exemple.ticket.total}</span>
              </p>
              <p className="mt-3 text-center text-[var(--encre-pale)]">{t.exemple.ticket.pied}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 Le rythme fait le prix ─────────────────────────────────────── */}
      <section className="cadre pt-16 md:pt-24" aria-labelledby="titre-rythme">
        <Chapitre numero="03" titre={t.rythme.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
          <h2 id="titre-rythme" className="titre text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.05]">{t.rythme.titre}</h2>
          <div>
            <p className="max-w-[40rem] text-lg">{t.rythme.texte}</p>
            <ul className="mt-8 border-b border-[var(--filet)]">
              {t.rythme.lignes.map((l) => (
                <li key={l.nom} className="trait py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p><span className={`font-semibold ${l.retenu ? 'surligne' : ''}`}>{l.nom}</span> <span className="doux ml-2 text-[0.95rem]">{l.detail}</span></p>
                    <p className="chiffre-site text-lg">{l.montant}</p>
                  </div>
                  <div className="mt-2 h-[9px] bg-[var(--papier-fonce)]" aria-hidden="true">
                    <span className={`block h-full ${l.retenu ? 'bg-[var(--surligneur)] shadow-[inset_0_0_0_1px_var(--encre)]' : 'bg-[var(--encre)]'}`} style={{ width: `${l.part}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="decision mt-8 max-w-[40rem] font-semibold">{t.rythme.fin}</p>
          </div>
        </div>
      </section>

      {/* ── 04 Le plafond ─────────────────────────────────────────────────── */}
      <section className="cadre pt-16 md:pt-24" aria-labelledby="titre-plafond">
        <Chapitre numero="04" titre={t.plafond.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
          <h2 id="titre-plafond" className="titre text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.05]">{t.plafond.titre}</h2>
          <div className="max-w-[43rem] space-y-4">
            {t.plafond.textes.map((x, i) => <p key={x} className={i ? 'doux' : 'text-lg'}>{x}</p>)}
          </div>
        </div>
        <div className="mt-12 grid gap-x-10 gap-y-12 lg:grid-cols-2 lg:items-start">
          <EcranLancer lang={lang} />
          <EcranCouts lang={lang} />
        </div>
      </section>

      {/* ── 05 Ce qui ne coûte rien ───────────────────────────────────────── */}
      <section className="cadre pt-16 md:pt-24" aria-labelledby="titre-gratuit">
        <Chapitre numero="05" titre={t.gratuit.chapitre} />
        <div className="mt-10 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
          <h2 id="titre-gratuit" className="titre text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.05]">{t.gratuit.titre}</h2>
          <div className="max-w-[43rem]">
            <ul className="puces border-b border-[var(--filet)]">
              {t.gratuit.liste.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <p className="mt-7">{t.gratuit.aVenir}</p>
            <p className="doux mt-4 text-sm">{t.gratuit.note}</p>
          </div>
        </div>
      </section>

      <AppelFinal lang={lang} second={{ page: 'piloter', nom: t.appel.nom }} />
    </Cadre>
  )
}
