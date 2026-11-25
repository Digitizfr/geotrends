import { AppelFinal, Entete, Tampon } from '../composants/Blocs'
import { Cadre, Chapitre } from '../composants/Cadre'
import { EcranApercus, EcranMarge } from '../composants/Maquettes'
import { methode } from '../contenu/methode'
import type { Lang } from '../i18n'

/** Section à deux colonnes : le titre à gauche, la démonstration à droite. */
function Regle({ numero, chapitre, titre, id, children }: { numero: string; chapitre: string; titre: string; id: string; children: React.ReactNode }) {
  return (
    <section className="cadre pt-16 md:pt-24" aria-labelledby={id}>
      <Chapitre numero={numero} titre={chapitre} />
      <div className="mt-10 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
        <h2 id={id} className="titre text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.05] lg:sticky lg:top-8 lg:self-start">{titre}</h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}

const Paragraphes = ({ textes }: { textes: string[] }) => (
  <div className="max-w-[43rem] space-y-4">
    {textes.map((x, i) => <p key={x} className={i === 0 ? 'text-lg' : 'doux'}>{x}</p>)}
  </div>
)

export function PageMethode({ lang }: { lang: Lang }) {
  const t = methode[lang]
  const signe = lang === 'fr' ? ' %' : '%'
  return (
    <Cadre lang={lang} page="methode">
      <Entete lang={lang} fil={[{ nom: t.fil }]} titre={t.titre} chapo={t.chapo} marge={t.marge} />

      {/* ── 01 Interface ou API ───────────────────────────────────────────── */}
      <Regle numero="01" chapitre={t.interface.chapitre} titre={t.interface.titre} id="interface">
        <Paragraphes textes={t.interface.textes} />
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {t.interface.colonnes.map((col, i) => (
            <div key={col.nom} className={i ? 'border-t border-dashed border-[var(--encre)] pt-4' : 'trait-fort pt-4'}>
              <p className="flex flex-wrap items-center gap-3">
                <Tampon methode={i ? 'api' : 'interface'} lang={lang} />
                <span className="font-semibold">{col.nom}</span>
              </p>
              <ul className="puces mt-4 text-[0.95rem]">
                {col.points.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Regle>

      {/* ── 02 Échantillon et marge d'erreur ──────────────────────────────── */}
      <Regle numero="02" chapitre={t.echantillon.chapitre} titre={t.echantillon.titre} id="echantillon">
        <Paragraphes textes={t.echantillon.textes} />
        <figure className="mt-10">
          <figcaption className="machine">{t.echantillon.figure.titre}</figcaption>
          <div className="mt-4 space-y-7">
            {t.echantillon.figure.lignes.map((l) => (
              <div key={l.nom}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="font-semibold">{l.nom} <span className="machine ml-2 text-[var(--encre-douce)]">{l.releves}</span></p>
                  <p className="chiffre-site text-xl">±{l.marge} {t.echantillon.figure.points}</p>
                </div>
                <div className="echelle mt-2" role="img" aria-label={`50${signe} ±${l.marge} ${t.echantillon.figure.points}`}>
                  <span className="plage" style={{ left: `${50 - l.marge}%`, width: `${l.marge * 2}%` }} />
                  <span className="point" style={{ left: '50%' }} />
                </div>
                <div className="machine mt-1 flex justify-between text-[var(--encre-pale)]" aria-hidden="true">
                  <span>0{signe}</span><span>50{signe}</span><span>100{signe}</span>
                </div>
                <p className="doux mt-2 text-[0.95rem]">{l.verdict}</p>
              </div>
            ))}
          </div>
          <p className="doux mt-5 text-sm">{t.echantillon.figure.legende}</p>
        </figure>
        <p className="mt-10 max-w-[43rem] text-lg">{t.echantillon.suite}</p>
        <div className="mt-8 max-w-[40rem]">
          <EcranMarge lang={lang} note={t.echantillon.noteEcran} />
        </div>
      </Regle>

      {/* ── 03 Jamais d'addition ──────────────────────────────────────────── */}
      <Regle numero="03" chapitre={t.addition.chapitre} titre={t.addition.titre} id="addition">
        <Paragraphes textes={t.addition.textes} />
        <figure className="mt-10">
          <div className="grid grid-cols-[minmax(0,2fr)_auto_minmax(0,1fr)] items-stretch gap-x-4 sm:gap-x-8">
            {t.addition.groupes.map((groupe, i) => (
              <div key={i} className={`${i ? 'order-3 border-t border-dashed border-[var(--encre)]' : 'trait-fort'} pt-4`}>
                <Tampon methode={i ? 'api' : 'interface'} lang={lang} />
                <ul className="mt-3">
                  {groupe.map((x) => <li key={x} className="trait py-2 font-semibold">{x}</li>)}
                </ul>
              </div>
            ))}
            <p className="order-2 flex items-center" aria-hidden="true"><span className="titre raye text-5xl text-[var(--encre-pale)]">+</span></p>
          </div>
          <figcaption className="machine mt-5 text-[var(--encre-douce)]">{t.addition.legende}</figcaption>
        </figure>
      </Regle>

      {/* ── 04 Le rythme ──────────────────────────────────────────────────── */}
      <Regle numero="04" chapitre={t.rythme.chapitre} titre={t.rythme.titre} id="rythme">
        <Paragraphes textes={t.rythme.textes} />
        <figure className="mt-10">
          <div className="calendrier" role="table" aria-label={t.rythme.chapitre}>
            <div role="row" className="contents">
              <span role="columnheader" className="tete" />
              {[1, 2, 3, 4].map((s) => <span key={s} role="columnheader" className="tete machine"><span className="sm:hidden" aria-hidden="true">{t.rythme.semaineCourt}{s}</span><span className="sr-only sm:not-sr-only">{t.rythme.semaine} {s}</span></span>)}
            </div>
            {t.rythme.moteurs.map((m, i) => (
              <div key={m} role="row" className="contents">
                <span role="rowheader" className="font-semibold">{m}</span>
                {[1, 2, 3, 4].map((s) => {
                  const releve = i < 4 || s % 2 === 1
                  return (
                    <span key={s} role="cell" className="flex items-center">
                      {releve ? <span className={`passage ${i === 4 ? 'api' : ''}`}><span className="sr-only">{lang === 'fr' ? 'Relevé' : 'Reading'}</span></span> : <span className="text-[var(--encre-pale)]" aria-hidden="true">·</span>}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
          <figcaption className="doux mt-4 text-sm">{t.rythme.legende}</figcaption>
        </figure>
        <p className="decision mt-8 max-w-[43rem]">{t.rythme.etat}</p>
      </Regle>

      {/* ── 05 Les états d'un relevé ──────────────────────────────────────── */}
      <Regle numero="05" chapitre={t.etats.chapitre} titre={t.etats.titre} id="etats">
        <p className="max-w-[43rem] text-lg">{t.etats.texte}</p>
        <dl className="mt-8 border-b border-[var(--filet)]">
          {t.etats.liste.map((e, i) => (
            <div key={e.nom} className="trait grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)_9rem]">
              <dt className="titre text-2xl">{i === 1 ? <span className="surligne">{e.nom}</span> : e.nom}</dt>
              <dd className="doux">{e.texte}</dd>
              <dd className={`machine sm:text-right ${i === 0 ? 'etat-service' : 'text-[var(--encre-douce)]'}`}>{e.compte}</dd>
            </div>
          ))}
        </dl>
        <p className="decision mt-8 max-w-[43rem] font-semibold">{t.etats.exemple}</p>
        <div className="mt-10">
          <EcranApercus lang={lang} />
        </div>
      </Regle>

      {/* ── 06 Les limites ────────────────────────────────────────────────── */}
      <section className="sombre mt-20 py-20 md:mt-28 md:py-28" aria-labelledby="limites">
        <div className="cadre">
          <Chapitre numero="06" titre={t.limites.chapitre} inverse />
          <h2 id="limites" className="titre mt-10 max-w-[16ch] text-[clamp(2rem,4.6vw,3.8rem)]">{t.limites.titre}</h2>
          <ul className="mt-12 grid gap-x-14 md:grid-cols-2">
            {t.limites.liste.map(([nom, texte]) => (
              <li key={nom} className="border-t border-[rgba(242,238,227,0.25)] pb-8 pt-5">
                <h3 className="text-xl font-semibold">{nom}</h3>
                <p className="doux mt-2">{texte}</p>
              </li>
            ))}
          </ul>
          <p className="titre mt-8 max-w-[30ch] text-[clamp(1.5rem,2.6vw,2.1rem)] text-[var(--surligneur)]">{t.limites.fin}</p>
        </div>
      </section>

      <AppelFinal lang={lang} second={{ page: 'moteurs', nom: t.appel.nom }} />
    </Cadre>
  )
}
