import Link from 'next/link'
import { AppelFinal, Entete, Etat, LienFleche } from '../composants/Blocs'
import { Cadre, Chapitre } from '../composants/Cadre'
import { ECRANS, type CleEcran } from '../composants/Maquettes'
import { commun } from '../contenu/commun'
import { compte, familles, fonctionsDe, FONCTIONS, hub, numero, textes } from '../contenu/fonctions'
import { chemin, FAMILLES, type Famille, type Lang } from '../i18n'

/** L'écran montré pour chaque famille, différent de celui de l'accueil. */
const VUES: Record<Famille, CleEcran> = {
  mesurer: 'liste',
  comprendre: 'sources',
  agir: 'perdues',
  piloter: 'lancer',
}

function Compteurs({ liste, lang }: { liste: readonly { pret: boolean }[]; lang: Lang }) {
  const c = commun[lang]
  const n = compte(liste)
  return (
    <span className="flex flex-wrap gap-x-5 gap-y-1">
      {n.prets > 0 && <span className="machine etat-service">{c.nEnService(n.prets)}</span>}
      {n.total - n.prets > 0 && <span className="machine etat-chantier text-[var(--encre-douce)]">{c.nEnConstruction(n.total - n.prets)}</span>}
    </span>
  )
}

export function PageFonctionnalites({ lang }: { lang: Lang }) {
  const t = hub[lang]
  const c = commun[lang]
  const tx = textes[lang]
  const fam = familles[lang]
  const total = compte(FONCTIONS)
  return (
    <Cadre lang={lang} page="fonctions">
      <Entete
        lang={lang}
        fil={[{ nom: t.fil }]}
        titre={t.titre}
        chapo={t.chapo}
        marge={[c.nFonctions(total.total), c.nEnService(total.prets), c.nEnConstruction(total.total - total.prets)]}
      />

      {/* ── Les quatre familles ───────────────────────────────────────────── */}
      <section className="cadre" aria-labelledby="titre-familles">
        <Chapitre numero="01" titre={t.familles.titre} />
        <h2 id="titre-familles" className="sr-only">{t.familles.titre}</h2>
        <div className="mt-10">
          {FAMILLES.map((f, i) => {
            const liste = fonctionsDe(f)
            const Vue = ECRANS[VUES[f]]
            return (
              <article key={f} className="porte grid gap-x-14 gap-y-10 py-12 md:py-16 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <p className="machine"><span className="text-[var(--encre-pale)]">{t.familles.numero} {String(i + 1).padStart(2, '0')}</span> <span className="ml-2">{c.familles[f]}</span></p>
                  <h3 className="titre mt-4 text-[clamp(1.9rem,3.6vw,3rem)]">
                    <Link href={chemin(f, lang)}><span className="porte-titre">{fam[f].question}</span></Link>
                  </h3>
                  <p className="doux mt-4 text-lg">{fam[f].resume}</p>
                  <ul className="mt-6 border-b border-[var(--filet)] text-[0.95rem]">
                    {liste.map((x) => (
                      <li key={x.id} className="trait flex items-baseline justify-between gap-4 py-2">
                        <Link href={`${chemin(f, lang)}#${x.id}`} className="hover:underline">{tx[x.id].nom}</Link>
                        <span className={`shrink-0 ${x.pret ? 'etat-service' : 'etat-chantier'}`} title={x.pret ? c.enService : c.enConstruction}><span className="sr-only">{x.pret ? c.enService : c.enConstruction}</span></span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                    <LienFleche href={chemin(f, lang)}>{t.familles.voir} {c.familles[f]}</LienFleche>
                    <Compteurs liste={liste} lang={lang} />
                  </div>
                </div>
                <div className="lg:col-span-7 lg:pt-2">
                  <Vue lang={lang} />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Le registre complet ───────────────────────────────────────────── */}
      <section className="cadre pt-16 md:pt-24" aria-labelledby="titre-registre">
        <Chapitre numero="02" titre={t.registre.titre} />
        <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <h2 id="titre-registre" className="titre max-w-[20ch] text-[clamp(2rem,4.6vw,3.6rem)]">{t.registre.phrase}</h2>
          <Compteurs liste={FONCTIONS} lang={lang} />
        </div>
        {FAMILLES.map((f) => (
          <div key={f} className="mt-14 grid gap-x-12 gap-y-4 lg:grid-cols-[13rem_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-8 lg:self-start">
              <h3 className="titre text-4xl"><Link href={chemin(f, lang)} className="hover:underline">{c.familles[f]}</Link></h3>
              <p className="doux mt-2 text-sm">{fam[f].resume}</p>
              <p className="mt-4 text-sm"><LienFleche href={chemin(f, lang)}>{t.registre.detail}</LienFleche></p>
            </div>
            <ul className="registre border-b border-[var(--filet)]">
              {fonctionsDe(f).map((x) => (
                <li key={x.id}>
                  <span className="chiffre-site text-sm text-[var(--encre-pale)]">{numero(x.id)}</span>
                  <span className="font-semibold"><Link href={`${chemin(f, lang)}#${x.id}`} className="nom-fonction">{tx[x.id].nom}</Link></span>
                  <span className="doux col-start-2 text-[0.95rem] lg:col-start-auto">{tx[x.id].quoi}</span>
                  <Etat pret={x.pret} lang={lang} className="col-start-2 lg:col-start-auto lg:text-right" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <AppelFinal lang={lang} second={{ page: 'methode', nom: t.appel.nom }} />
    </Cadre>
  )
}
