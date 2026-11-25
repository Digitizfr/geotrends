import type { Lang } from '../i18n'
import { insecables } from '../typo'
import { Signe } from './LogoSite'

/*
 * Écrans du produit montrés sur le site public. Ce sont des reproductions en
 * code (nettes à toutes les tailles), remplies de DONNÉES D'EXEMPLE : jamais
 * les résultats réels d'une marque. La marque suivie s'appelle
 * « Votre marque », ses rivales « Concurrent A, B, C ».
 */

const BRUT = {
  fr: {
    exemple: 'Données d’exemple', ecran: 'Écran du produit', vous: 'Votre marque', projet: 'Projet', pays: 'France · français', questions: 'questions',
    nav: ['Vue d’ensemble', 'Questions', 'Sources', 'Concurrents', 'Vidéos', 'Actions', 'Coûts'],
    visibilite: 'Visibilité', rang: 'Rang moyen', voix: 'Part de voix', sourcesAVous: 'Sources à vous', releves: 'relevés', marge: 'marge',
    tendance: 'Visibilité par IA, 8 dernières semaines', action: 'Page comparatif mise à jour', semaine: 'S',
    parQuestion: 'Par question et par IA', cite: 'Cité', nomme: 'Nommé', absent: 'Absent', pasApercu: 'Pas d’aperçu',
    q: ['Quel logiciel de facturation choisir ?', 'Meilleur CRM pour une TPE ?', 'Quel outil d’emailing pour débuter ?', 'Comment choisir son hébergeur web ?'],
    interface: 'interface', api: 'API', reponse: 'Réponse relevée', sources: 'Sources citées', lues: 'pages lues sans être citées',
    extrait: ['Pour une petite entreprise, trois solutions reviennent le plus souvent.', 'se distingue par sa simplicité et son offre gratuite.', 'convient mieux aux structures qui ont déjà un comptable.'],
    recherches: 'Recherches lancées par l’IA', rech: ['meilleur logiciel facturation TPE 2026', 'comparatif facturation électronique'],
    marques: 'Marques nommées', reponses: 'réponses', premier: 'en premier',
    sites: 'Sites les plus cités', type: 'Type', aQui: 'À qui', types: ['Comparatif', 'Média', 'Vidéo', 'Forum', 'Site de marque'], proprietaires: ['Tiers', 'Tiers', 'À vous', 'Tiers', 'Concurrent A'],
    proprietes: 'Votre présence, par propriété', site: 'Votre site', chaine: 'Votre chaîne YouTube', reseaux: 'Réseaux sociaux', nomSeul: 'Nom seul', profils: 'Vos profils, détectés depuis le site', videos: 'Vos vidéos citées', vues: 'vues', moment: 'passage cité',
    vid: ['Top 10 des logiciels de facturation', 'Tutoriel : créer sa première facture'],
    apercus: 'Aperçus IA et résultats Google', apercu: 'Aperçu IA', dansTop: 'Sources dans le top 10', votreRang: 'Votre rang Google', citeApercu: 'Cité',
    affiche: 'Affiché', horsTop: 'hors top 10', oui: 'Oui', non: 'Non', conseil: 'À reformuler', conseil2: 'Référencement d’abord',
    actions: 'Liste de travail', gain: 'Poids', etat: 'État', aFaire: 'À faire', enCours: 'En cours', fait: 'Fait',
    act: ['Obtenir une place dans le comparatif cité par 4 IA', 'Reformuler la page « tarifs », lue 6 fois sans être citée', 'Tourner une vidéo sur le sujet « facturation électronique »', 'Corriger un prix faux repris par 2 réponses'],
    preuve: 'preuve', couts: 'Coûts des appels', depense: 'Dépense du mois', plafond: 'sur', parIA: 'Par IA', derniers: 'Derniers appels', releve: 'Relevé',
  },
  en: {
    exemple: 'Sample data', ecran: 'Product screen', vous: 'Your brand', projet: 'Project', pays: 'France · French', questions: 'questions',
    nav: ['Overview', 'Questions', 'Sources', 'Competitors', 'Videos', 'Actions', 'Costs'],
    visibilite: 'Visibility', rang: 'Average rank', voix: 'Share of voice', sourcesAVous: 'Your sources', releves: 'readings', marge: 'margin',
    tendance: 'Visibility by AI engine, last 8 weeks', action: 'Comparison page updated', semaine: 'W',
    parQuestion: 'By question and by AI engine', cite: 'Cited', nomme: 'Named', absent: 'Absent', pasApercu: 'No overview',
    q: ['Which invoicing software to choose?', 'Best CRM for a small business?', 'Which email tool to start with?', 'How to pick a web host?'],
    interface: 'interface', api: 'API', reponse: 'Recorded answer', sources: 'Cited sources', lues: 'pages read but not cited',
    extrait: ['For a small business, three options come up most often.', 'stands out for its simplicity and free plan.', 'is a better fit for companies that already have an accountant.'],
    recherches: 'Searches run by the AI', rech: ['best invoicing software small business 2026', 'e-invoicing comparison'],
    marques: 'Brands named', reponses: 'answers', premier: 'named first',
    sites: 'Most cited sites', type: 'Type', aQui: 'Owner', types: ['Comparison', 'Media', 'Video', 'Forum', 'Brand site'], proprietaires: ['Third party', 'Third party', 'Yours', 'Third party', 'Competitor A'],
    proprietes: 'Your presence, by property', site: 'Your website', chaine: 'Your YouTube channel', reseaux: 'Social profiles', nomSeul: 'Name only', profils: 'Your profiles, detected from the website', videos: 'Your cited videos', vues: 'views', moment: 'cited passage',
    vid: ['Top 10 invoicing tools', 'Tutorial: create your first invoice'],
    apercus: 'AI Overviews and Google results', apercu: 'AI Overview', dansTop: 'Sources in the top 10', votreRang: 'Your Google rank', citeApercu: 'Cited',
    affiche: 'Shown', horsTop: 'outside top 10', oui: 'Yes', non: 'No', conseil: 'Rewrite the page', conseil2: 'SEO first',
    actions: 'Work list', gain: 'Weight', etat: 'Status', aFaire: 'To do', enCours: 'In progress', fait: 'Done',
    act: ['Get listed in the comparison cited by 4 AI engines', 'Rewrite the pricing page, read 6 times but never cited', 'Record a video on “e-invoicing”', 'Fix a wrong price repeated in 2 answers'],
    preuve: 'evidence', couts: 'API costs', depense: 'Spend this month', plafond: 'of', parIA: 'By AI engine', derniers: 'Latest calls', releve: 'Reading',
  },
} as const

const L = { fr: insecables(BRUT.fr), en: BRUT.en }

const IA = ['ChatGPT', 'Gemini', 'Mode IA', 'Aperçus IA', 'Claude']
const IA_EN = ['ChatGPT', 'Gemini', 'AI Mode', 'AI Overviews', 'Claude']
const ia = (lang: Lang) => (lang === 'fr' ? IA : IA_EN)
/** « 42 % » en français, « 42% » en anglais. */
const pc = (lang: Lang, n: number | string) => (lang === 'fr' ? `${n} %` : `${String(n).replace(',', '.')}%`)
/** « 1 240 » en français, « 1,240 » en anglais. */
const mil = (lang: Lang, n: string) => (lang === 'fr' ? n : n.replace(/(\d) (\d{3})/g, '$1,$2'))
/** Deux-points : avec une espace avant en français, sans en anglais. */
const dp = (lang: Lang) => (lang === 'fr' ? ' : ' : ': ')
type EtatP = 'cite' | 'nomme' | 'absent' | 'neutre'

/** Ce que reçoit chaque écran : la langue, et une précision éventuelle sous l'écran. */
export type PropsEcran = {
  lang: Lang
  className?: string
  /** Précision écrite sous l'écran, à côté de « Données d'exemple ». */
  note?: string
}

function Ecran({ titre, lang, droite, children, className = '', note, large }: PropsEcran & { titre: string; droite?: React.ReactNode; children: React.ReactNode; large?: number }) {
  const t = L[lang]
  return (
    <figure className={className} aria-label={`${t.ecran}${dp(lang)}${titre}`}>
      <div className="ecran">
        <div className="ecran-barre">
          <span className="flex min-w-0 items-center gap-2"><Signe taille={16} /><p className="t4 truncate">{titre}</p></span>
          {droite ?? <span className="etiquette text-right">{t.vous} · {t.pays}</span>}
        </div>
        <div className="ecran-corps"><div style={large ? { minWidth: `${large}rem` } : undefined}>{children}</div></div>
      </div>
      <figcaption className="note-exemple">
        <span>{t.exemple}</span>
        {note && <span className="note-libre">{note}</span>}
      </figcaption>
    </figure>
  )
}

function Pastille({ e, lang }: { e: 'cite' | 'nomme' | 'absent' | 'neutre'; lang: Lang }) {
  const t = L[lang]
  return <span className={`pastille ${e}`}>{{ cite: t.cite, nomme: t.nomme, absent: t.absent, neutre: t.pasApercu }[e]}</span>
}

// ── Vue d'ensemble : l'écran d'accueil de l'outil ───────────────────────────
const SERIES = [
  { nom: 0, couleur: '#14201b', pts: [28, 30, 29, 33, 36, 38, 41, 44] },
  { nom: 3, couleur: '#0b7f5d', pts: [35, 36, 34, 38, 41, 40, 45, 47] },
  { nom: 1, couleur: '#b98a00', pts: [22, 21, 24, 26, 25, 29, 31, 34] },
]
const GRILLE: ('cite' | 'nomme' | 'absent' | 'neutre')[][] = [
  ['cite', 'nomme', 'absent', 'cite', 'nomme'],
  ['absent', 'absent', 'nomme', 'neutre', 'absent'],
  ['nomme', 'cite', 'cite', 'cite', 'absent'],
  ['absent', 'nomme', 'absent', 'absent', 'cite'],
]

export function EcranVueDEnsemble({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const x = (i: number) => 34 + i * 70
  const y = (v: number) => 150 - v * 2.4
  return (
    <Ecran titre={t.nav[0]} lang={lang} {...p} droite={<span className="etiquette">{t.projet}{dp(lang)}{t.vous} · {t.pays} · 50 {t.questions}</span>}>
      <div className="grid md:grid-cols-[9.5rem_minmax(0,1fr)]">
        <ul className="hidden border-r border-[var(--filet)] py-3 md:block">
          {t.nav.map((n, i) => (
            <li key={n} className={`px-4 py-1.5 ${i === 0 ? 'bg-[var(--surligneur)] font-semibold' : 'text-[var(--encre-douce)]'}`}>{n}</li>
          ))}
        </ul>
        <div className="min-w-0">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              [t.visibilite, '42 %', `±3 · ${mil(lang, '1 240')} ${t.releves}`],
              [t.rang, '2,4', `${t.interface} · 520 ${t.releves}`],
              [t.voix, '18 %', lang === 'fr' ? '4 concurrents' : '4 competitors'],
              [t.sourcesAVous, '31', `${t.site} 22 · YouTube 9`],
            ].map(([a, b, c]) => (
              <div key={a} className="border-b border-r border-[var(--filet)] p-3.5">
                <p className="etiquette">{a}</p>
                <p className="nb mt-1 text-2xl">{lang === 'en' ? b.replace(',', '.').replace(' %', '%') : b}</p>
                <p className="mt-0.5 text-[0.6875rem] text-[var(--encre-douce)]">{c}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div className="border-b border-[var(--filet)] p-3.5 lg:border-b-0 lg:border-r">
              <p className="t4">{t.tendance}</p>
              <svg viewBox="0 0 606 176" className="mt-2 w-full" role="img" aria-label={t.tendance}>
                {[20, 30, 40, 50].map((v) => (
                  <g key={v}>
                    <line x1="34" x2="540" y1={y(v)} y2={y(v)} stroke="#14201b" strokeOpacity=".1" />
                    <text x="6" y={y(v) + 3} fontSize="9" fill="#7f8a83" fontFamily="var(--font-mono)">{pc(lang, v)}</text>
                  </g>
                ))}
                <line x1={x(4)} x2={x(4)} y1="14" y2="150" stroke="#cf431c" strokeDasharray="3 3" />
                <text x={x(4) + 5} y="22" fontSize="9" fill="#cf431c" fontFamily="var(--font-mono)">{t.action}</text>
                {SERIES.map((s) => (
                  <g key={s.nom}>
                    <polyline fill="none" stroke={s.couleur} strokeWidth="2" points={s.pts.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
                    {s.pts.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.6" fill="#fffdf8" stroke={s.couleur} strokeWidth="1.6" />)}
                    <text x={x(7) + 8} y={y(s.pts[7]) + 3} fontSize="9" fill={s.couleur} fontFamily="var(--font-mono)">{ia(lang)[s.nom]}</text>
                  </g>
                ))}
                {SERIES[0].pts.map((_, i) => <text key={i} x={x(i) - 6} y="168" fontSize="9" fill="#7f8a83" fontFamily="var(--font-mono)">{t.semaine}{i + 1}</text>)}
              </svg>
            </div>
            <div className="p-3.5">
              <p className="t4">{t.parQuestion}</p>
              <table className="mt-2 w-full">
                <thead>
                  <tr>
                    <th />
                    {ia(lang).map((n) => <th key={n} className="etiquette pb-1 text-left font-normal">{n.replace('Aperçus IA', 'Aperçus').replace('AI Overviews', 'Overviews')}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {GRILLE.map((ligne, i) => (
                    <tr key={i} className="ligne-t">
                      <td className="max-w-[7.5rem] truncate py-1.5 pr-2 text-[0.6875rem]">{t.q[i]}</td>
                      {ligne.map((e, j) => (
                        <td key={j} className="py-1.5 pr-1">
                          <span className={`inline-block h-3 w-6 ${e === 'cite' ? 'bg-[var(--surligneur)] shadow-[inset_0_0_0_1px_var(--encre)]' : e === 'nomme' ? 'bg-[var(--vert)]' : e === 'absent' ? 'bg-[#e9c9bd]' : 'border border-dashed border-[var(--encre-pale)]'}`} title={{ cite: t.cite, nomme: t.nomme, absent: t.absent, neutre: t.pasApercu }[e]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.6875rem] text-[var(--encre-douce)]">
                <span><span className="mr-1 inline-block h-2 w-3 bg-[var(--surligneur)] shadow-[inset_0_0_0_1px_var(--encre)]" />{t.cite}</span>
                <span><span className="mr-1 inline-block h-2 w-3 bg-[var(--vert)]" />{t.nomme}</span>
                <span><span className="mr-1 inline-block h-2 w-3 bg-[#e9c9bd]" />{t.absent}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Ecran>
  )
}

// ── Détail d'une question : les réponses côte à côte ────────────────────────
export function EcranQuestion({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const etats = ['cite', 'nomme', 'absent', 'cite', 'absent'] as const
  return (
    <Ecran titre={`« ${t.q[0]} »`} lang={lang} {...p} large={36}>
      <div className="grid grid-cols-5 border-b border-[var(--filet)]">
        {ia(lang).map((n, i) => (
          <div key={n} className={`p-2.5 ${i ? 'border-l border-[var(--filet)]' : 'bg-[var(--papier)]'}`}>
            <p className="truncate font-semibold">{n}</p>
            <p className="etiquette">{i === 4 ? t.api : t.interface}</p>
            <p className="mt-1.5"><Pastille e={etats[i]} lang={lang} /></p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="p-3.5 md:border-r md:border-[var(--filet)]">
          <p className="etiquette">{t.reponse} · ChatGPT · 12/11 · gpt-6</p>
          <p className="mt-2">{t.extrait[0]}</p>
          <p className="mt-1.5"><strong className="bg-[var(--surligneur)] px-0.5">{t.vous}</strong> {t.extrait[1]}</p>
          <p className="mt-1.5"><strong>Concurrent A</strong> {t.extrait[2]}</p>
          <p className="etiquette mt-3">{t.marques}</p>
          <p className="mt-1 flex flex-wrap gap-1">
            {[t.vous, 'Concurrent A', 'Concurrent B', 'Concurrent C'].map((m, i) => (
              <span key={m} className={`pastille ${i ? 'neutre' : 'cite'}`}><span className="nb opacity-60">{i + 1}</span> {m}</span>
            ))}
          </p>
          <p className="etiquette mt-3">{t.recherches}</p>
          {t.rech.map((r) => <p key={r} className="mt-0.5 text-[var(--encre-douce)]">« {r} »</p>)}
        </div>
        <div className="p-3.5">
          <p className="etiquette">{t.sources} (6)</p>
          <ol className="mt-1.5">
            {[['comparatif.exemple', 0], ['votre-site.fr', 1], ['media.exemple', 0], ['youtube.com · ' + t.vous, 1], ['forum.exemple', 0], ['concurrent-a.exemple', 0]].map(([d, nous], i) => (
              <li key={d as string} className="ligne-t flex gap-2 py-1.5">
                <span className="nb text-[var(--encre-pale)]">{i + 1}</span>
                <span className={nous ? 'bg-[var(--surligneur)] px-0.5 font-semibold' : 'font-semibold'}>{d}</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[var(--encre-douce)]">+ 11 {t.lues}</p>
        </div>
      </div>
    </Ecran>
  )
}

// ── Concurrents et sources ──────────────────────────────────────────────────
export function EcranConcurrents({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const lignes: [string, number, number, string][] = [['Concurrent A', 31, 14, '1,6'], ['Concurrent B', 24, 9, '2,1'], [t.vous, 18, 6, '2,4'], ['Concurrent C', 15, 3, '3,0'], ['Concurrent D', 12, 2, '3,4']]
  return (
    <Ecran titre={t.nav[3]} lang={lang} {...p} large={27} droite={<span className="etiquette">ChatGPT · {t.interface} · 260 {t.releves}</span>}>
      <table className="w-full">
        <thead>
          <tr className="etiquette text-left">
            <th className="px-3.5 py-2 font-normal">{t.marques}</th>
            <th className="py-2 font-normal">{t.voix}</th>
            <th className="py-2 font-normal">{t.premier}</th>
            <th className="px-3.5 py-2 text-right font-normal">{t.rang}</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map(([nom, part, premier, rang]) => (
            <tr key={nom} className={`ligne-t ${nom === t.vous ? 'bg-[var(--papier)]' : ''}`}>
              <td className="px-3.5 py-2 font-semibold">{nom === t.vous ? <span className="bg-[var(--surligneur)] px-0.5">{nom}</span> : nom}</td>
              <td className="w-[42%] py-2 pr-4">
                <div className="flex items-center gap-2">
                  <div className={`jauge flex-1 ${nom === t.vous ? 'jaune' : ''}`}><span style={{ width: `${part * 3}%` }} /></div>
                  <span className="nb w-9 text-right">{pc(lang, part)}</span>
                </div>
              </td>
              <td className="nb py-2">{premier}</td>
              <td className="nb px-3.5 py-2 text-right">{lang === 'en' ? rang.replace(',', '.') : rang}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Ecran>
  )
}

export function EcranSources({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const sites = ['comparatif.exemple', 'media.exemple', 'youtube.com', 'forum.exemple', 'concurrent-a.exemple']
  const n = [38, 27, 21, 14, 12]
  return (
    <Ecran titre={t.sites} lang={lang} {...p} large={33} droite={<span className="etiquette">{t.interface} · {mil(lang, '1 240')} {t.releves}</span>}>
      <table className="w-full">
        <thead>
          <tr className="etiquette text-left">
            <th className="px-3.5 py-2 font-normal">Site</th>
            <th className="py-2 font-normal">{t.type}</th>
            <th className="py-2 font-normal">{t.aQui}</th>
            <th className="px-3.5 py-2 text-right font-normal">{t.reponses}</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s, i) => (
            <tr key={s} className="ligne-t">
              <td className="px-3.5 py-2 font-semibold">{s}</td>
              <td className="py-2 text-[var(--encre-douce)]">{t.types[i]}</td>
              <td className="py-2"><span className={`pastille ${i === 2 ? 'cite' : i === 4 ? 'absent' : 'neutre'}`}>{t.proprietaires[i]}</span></td>
              <td className="px-3.5 py-2">
                <div className="flex items-center justify-end gap-2">
                  <div className="jauge w-16"><span style={{ width: `${(n[i] / 38) * 100}%` }} /></div>
                  <span className="nb w-6 text-right">{n[i]}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Ecran>
  )
}

// ── Propriétés de la marque : site et chaîne YouTube ────────────────────────
export function EcranProprietes({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  return (
    <Ecran titre={t.proprietes} lang={lang} {...p} droite={<span className="etiquette">{t.interface} · {mil(lang, '1 240')} {t.releves}</span>}>
      <div className="p-3.5">
        <div className="flex h-7 w-full border border-[var(--encre)]">
          <span className="flex items-center bg-[var(--encre)] px-2 text-[0.6875rem] font-semibold text-[var(--papier)]" style={{ width: '41%' }}>{t.site} {pc(lang, 41)}</span>
          <span className="flex items-center bg-[var(--surligneur)] px-2 text-[0.6875rem] font-semibold" style={{ width: '30%' }}>YouTube {pc(lang, 30)}</span>
          <span className="flex items-center border-l border-[var(--encre)] bg-[repeating-linear-gradient(135deg,var(--surligneur)_0_3px,transparent_3px_6px)] px-1.5 text-[0.6875rem] font-semibold" style={{ width: '11%' }} title={t.reseaux}>{pc(lang, 11)}</span>
          <span className="flex items-center px-2 text-[0.6875rem] text-[var(--encre-douce)]" style={{ width: '18%' }}>{t.nomSeul} {pc(lang, 18)}</span>
        </div>
        <p className="etiquette mt-4">{t.profils}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['LinkedIn', 'Instagram', 'X'].map((r) => (
            <span key={r} className="border border-[var(--encre)] bg-[repeating-linear-gradient(135deg,var(--surligneur)_0_3px,transparent_3px_6px)] px-2 py-0.5 text-[0.6875rem] font-semibold">{r}</span>
          ))}
          <span className="px-1 py-0.5 text-[0.6875rem] text-[var(--encre-douce)]">{t.reseaux} {pc(lang, 11)}</span>
        </div>
        <p className="etiquette mt-4">{t.videos}</p>
        {t.vid.map((v, i) => (
          <div key={v} className="ligne-t mt-2 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 pt-2">
            <span className="flex h-9 items-center justify-center bg-[var(--encre)] text-[var(--surligneur)]">▶</span>
            <span>
              <span className="font-semibold">{v}</span>
              <span className="block text-[var(--encre-douce)]">
                <span className="nb">{mil(lang, i ? '8 400' : '21 300')}</span> {t.vues} · {i ? 2 : 5} {t.reponses} · {t.moment} <span className="nb">{i ? '1:12' : '4:27'}</span>
              </span>
            </span>
          </div>
        ))}
      </div>
    </Ecran>
  )
}

// ── Aperçus IA comparés aux résultats de Google ─────────────────────────────
export function EcranApercus({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const lignes: [number, boolean, string, string, boolean, string][] = [[0, true, '5 / 7', '3', false, t.conseil], [1, false, '', '8', false, ''], [2, true, '4 / 6', t.horsTop, false, t.conseil2], [3, true, '6 / 8', '2', true, '']]
  return (
    <Ecran titre={t.apercus} lang={lang} {...p} large={35}>
      <table className="w-full">
        <thead>
          <tr className="etiquette text-left">
            <th className="px-3.5 py-2 font-normal">Question</th>
            <th className="py-2 font-normal">{t.apercu}</th>
            <th className="py-2 font-normal">{t.dansTop}</th>
            <th className="py-2 font-normal">{t.votreRang}</th>
            <th className="px-3.5 py-2 font-normal">{t.citeApercu}</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map(([q, affiche, top, rang, cite, conseil]) => (
            <tr key={q} className="ligne-t align-top">
              <td className="max-w-[11rem] px-3.5 py-2 font-semibold">{t.q[q]}</td>
              <td className="py-2">{affiche ? t.affiche : <span className="text-[var(--encre-pale)]">{t.pasApercu}</span>}</td>
              <td className="nb py-2">{top}</td>
              <td className="nb py-2">{rang}</td>
              <td className="px-3.5 py-2">
                {affiche && <span className={`pastille ${cite ? 'cite' : 'absent'}`}>{cite ? t.oui : t.non}</span>}
                {conseil && <span className="mt-1 block text-[0.6875rem] text-[var(--encre-douce)]">→ {conseil}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Ecran>
  )
}

// ── Liste de travail ────────────────────────────────────────────────────────
export function EcranActions({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const etats = [t.enCours, t.aFaire, t.aFaire, t.fait]
  const gains = [5, 4, 3, 2]
  return (
    <Ecran titre={t.actions} lang={lang} {...p} droite={<span className="etiquette">4 / 17</span>}>
      <ul>
        {t.act.map((a, i) => (
          <li key={a} className={`grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-start gap-3 px-3.5 py-2.5 ${i ? 'ligne-t' : ''}`}>
            <span className="nb text-[var(--encre-pale)]">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className={`font-semibold ${i === 3 ? 'text-[var(--encre-pale)] line-through' : ''}`}>{a}</span>
              <span className="mt-1 flex items-center gap-2 text-[0.6875rem] text-[var(--encre-douce)]">
                {t.gain}
                <span className="flex gap-0.5">{[1, 2, 3, 4, 5].map((k) => <span key={k} className={`h-2 w-2 ${k <= gains[i] ? 'bg-[var(--encre)]' : 'bg-[var(--papier-fonce)]'}`} />)}</span>
                <span className="underline">{t.preuve}</span>
              </span>
            </span>
            <span className={`pastille ${i === 0 ? 'cite' : i === 3 ? 'nomme' : 'neutre'}`}>{etats[i]}</span>
          </li>
        ))}
      </ul>
    </Ecran>
  )
}

// ── Coûts ───────────────────────────────────────────────────────────────────
export function EcranCouts({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const nb = (s: string) => (lang === 'en' ? '$' + s.replace(',', '.') : s + ' $')
  return (
    <Ecran titre={t.couts} lang={lang} {...p} droite={<span className="etiquette">{lang === 'fr' ? 'novembre 2026' : 'November 2026'}</span>}>
      <div className="grid sm:grid-cols-2">
        <div className="p-3.5 sm:border-r sm:border-[var(--filet)]">
          <p className="etiquette">{t.depense}</p>
          <p className="nb mt-1 text-2xl">{nb('7,42')} <span className="text-sm text-[var(--encre-pale)]">{t.plafond} {nb('20,00')}</span></p>
          <div className="jauge vert mt-2"><span style={{ width: '37%' }} /></div>
          <p className="etiquette mt-4">{t.parIA}</p>
          {[['Claude', '6,31', 85], ['ChatGPT', '0,29', 9], ['Gemini', '0,28', 9], [lang === 'fr' ? 'Google (Mode IA, Aperçus)' : 'Google (AI Mode, Overviews)', '0,54', 14]].map(([n, v, w]) => (
            <div key={n as string} className="mt-1.5 grid grid-cols-[minmax(0,1fr)_4rem_3.5rem] items-center gap-2">
              <span className="truncate">{n}</span>
              <div className="jauge"><span style={{ width: `${w}%` }} /></div>
              <span className="nb text-right">{nb(v as string)}</span>
            </div>
          ))}
        </div>
        <div className="p-3.5">
          <p className="etiquette">{t.derniers}</p>
          {[['12/11 07:17', 'ChatGPT', '0,0012'], ['12/11 07:17', 'Gemini', '0,0012'], ['12/11 07:17', ia(lang)[3], '0,0012'], ['12/11 07:15', 'Claude', '0,0591'], ['12/11 07:15', ia(lang)[2], '0,0012']].map(([d, m, p], i) => (
            <div key={i} className="ligne-t mt-1.5 flex justify-between gap-2 pt-1.5">
              <span className="nb text-[var(--encre-pale)]">{d}</span>
              <span className="flex-1 truncate">{t.releve} · {m}</span>
              <span className="nb">{nb(p)}</span>
            </div>
          ))}
        </div>
      </div>
    </Ecran>
  )
}

// ══ Écrans ajoutés pour le site à plusieurs pages ═══════════════════════════
const M = {
  fr: {
    dernier: 'dernier relevé', themes: ['Facturation', 'CRM', 'E-mailing', 'Hébergement', 'Facturation', 'Devis'],
    q2: ['Facturation électronique : quel outil ?', 'Alternative gratuite à Excel pour les devis ?'],
    rech: ['meilleur logiciel facturation TPE 2026', 'comparatif facturation électronique', 'logiciel devis factures gratuit avis', 'CRM simple petite entreprise', 'prix logiciel facturation auto-entrepreneur'], pour: 'pour',
    chaines: 'Chaînes YouTube citées', noms: ['Chaîne tierce A', 'Votre chaîne', 'Chaîne tierce B', 'Chaîne tierce C'], abonnes: 'vues des vidéos citées', videosCitees: 'vidéos citées', chaine: 'Chaîne',
    tiers: 'Tiers', aVous: 'À vous',
    faits: 'Faits vérifiés', fait: 'Fait vérifié', dit: 'Ce que disent les réponses', enCause: 'Source en cause', juste: 'Juste', faux: 'Faux',
    listeFaits: ['Prix de départ : 12 € par mois', 'Offre gratuite, sans limite de durée', 'Siège à Lyon, France'],
    listeDits: ['« à partir de 9 € par mois »', '« essai gratuit de 14 jours »', '« entreprise française installée à Lyon »'],
    perdues: 'Questions perdues', absentSur: 'Absent sur', aVotrePlace: 'Cité à votre place', grace: 'Grâce à', iaSur: 'IA sur 5', ia: 'IA',
    audit: 'Audit d’une page', ok: 'Bon', corriger: 'À corriger', partiel: 'Partiel',
    points: [
      ['Règles du robots.txt', 'Aucun robot d’IA bloqué'],
      ['Réponse du serveur à chaque robot', '6 robots testés, 6 réponses normales'],
      ['Texte présent sans JavaScript', 'Le tableau des prix est chargé par un script : les robots ne le lisent pas'],
      ['Données structurées', 'Organisation présente, produit et prix absents'],
      ['Date et auteur visibles', 'Aucune date de mise à jour sur la page'],
    ],
    apres: 'Mesure après action', avant: 'Avant', apresMot: 'Après', faite: 'faite le', ecart: 'Écart', points2: 'points',
    reel: 'Au-dessus de la marge', bruit: 'Dans le bruit', actions2: ['Page comparatif mise à jour', 'Titre de la page « tarifs » réécrit'],
    fiabilite: 'Fiabilité par question', ensemble: 'Visibilité d’ensemble', seule: 'Une question seule', solide: 'Solide', occasionnelle: 'Occasionnelle', absente: 'Absente', sur20: 'sur 20', un: 'Un trait par relevé',
    rapport: 'Rapport du lundi', de: 'De', objet: 'Objet', objetTexte: 'Votre marque dans les IA, semaine 46', bouge: 'Ce qui a bougé',
    mouvements: ['ChatGPT : visibilité de 38 à 44 %, au-dessus de la marge d’erreur', 'Concurrent B s’installe sur 3 questions de facturation', 'Gemini : 31 à 33 %, dans le bruit, rien à faire'],
    trois: 'Trois actions pour la semaine', depenseSemaine: 'Dépense de la semaine',
    marque: 'Marque', proprietesMarque: 'Ce qui appartient à la marque',
    props: [['Site', 'votre-site.fr'], ['Site', 'blog.votre-site.fr'], ['YouTube', '@votremarque']],
    compte: 'Une page de ces sites ou une vidéo de cette chaîne, citée par une IA, compte pour la marque.',
    suivies: 'Questions suivies', figee: 'Une question déjà relevée ne se modifie plus : on l’archive, son historique reste.', ajouterQuestion: 'Ajouter des questions, une par ligne',
    lancer: 'Lancer un relevé', methode: 'Méthode', parQuestion: 'Prix par question', pour50: 'Pour 50 questions',
    interfaceReelle: 'Interface réelle', apiSeul: 'API (modèle seul)', lancerBouton: 'Lancer le relevé',
  },
  en: {
    dernier: 'last reading', themes: ['Invoicing', 'CRM', 'Email', 'Hosting', 'Invoicing', 'Quotes'],
    q2: ['E-invoicing: which tool?', 'Free alternative to Excel for quotes?'],
    rech: ['best invoicing software small business 2026', 'e-invoicing comparison', 'free quote and invoice software reviews', 'simple CRM small business', 'invoicing software price freelancer'], pour: 'for',
    chaines: 'YouTube channels cited', noms: ['Third-party channel A', 'Your channel', 'Third-party channel B', 'Third-party channel C'], abonnes: 'views of cited videos', videosCitees: 'videos cited', chaine: 'Channel',
    tiers: 'Third party', aVous: 'Yours',
    faits: 'Verified facts', fait: 'Verified fact', dit: 'What the answers say', enCause: 'Source at fault', juste: 'Right', faux: 'Wrong',
    listeFaits: ['Starting price: €12 a month', 'Free plan with no time limit', 'Headquarters in Lyon, France'],
    listeDits: ['“from €9 a month”', '“14-day free trial”', '“a French company based in Lyon”'],
    perdues: 'Lost questions', absentSur: 'Absent on', aVotrePlace: 'Cited instead of you', grace: 'Thanks to', iaSur: 'of 5 engines', ia: 'engines',
    audit: 'Page audit', ok: 'Good', corriger: 'To fix', partiel: 'Partial',
    points: [
      ['robots.txt rules', 'No AI crawler blocked'],
      ['Server response to each crawler', '6 crawlers tested, 6 normal responses'],
      ['Text present without JavaScript', 'The pricing table is loaded by a script: crawlers cannot read it'],
      ['Structured data', 'Organization present, product and price missing'],
      ['Visible date and author', 'No last-updated date on the page'],
    ],
    apres: 'Before and after an action', avant: 'Before', apresMot: 'After', faite: 'done on', ecart: 'Gap', points2: 'points',
    reel: 'Beyond the margin', bruit: 'Within the noise', actions2: ['Comparison page updated', 'Pricing page title rewritten'],
    fiabilite: 'Reliability by question', ensemble: 'Overall visibility', seule: 'A single question', solide: 'Solid', occasionnelle: 'Occasional', absente: 'Absent', sur20: 'of 20', un: 'One tick per reading',
    rapport: 'Monday report', de: 'From', objet: 'Subject', objetTexte: 'Your brand in AI answers, week 46', bouge: 'What moved',
    mouvements: ['ChatGPT: visibility from 38% to 44%, beyond the margin of error', 'Competitor B is settling in on 3 invoicing questions', 'Gemini: 31% to 33%, within the noise, nothing to do'],
    trois: 'Three actions for the week', depenseSemaine: 'Spend this week',
    marque: 'Brand', proprietesMarque: 'What belongs to the brand',
    props: [['Website', 'your-site.example'], ['Website', 'blog.your-site.example'], ['YouTube', '@yourbrand']],
    compte: 'A page from these sites or a video from this channel, cited by an AI engine, counts for the brand.',
    suivies: 'Tracked questions', figee: 'A question that has been read can no longer be edited: you archive it and its history stays.', ajouterQuestion: 'Add questions, one per line',
    lancer: 'Launch a reading', methode: 'Method', parQuestion: 'Price per question', pour50: 'For 50 questions',
    interfaceReelle: 'Real interface', apiSeul: 'API (model alone)', lancerBouton: 'Launch the reading',
  },
} as const

// ── Liste des questions : une ligne par question, une colonne par IA ────────
const ETATS_LISTE: EtatP[][] = [
  ['cite', 'nomme', 'absent', 'cite', 'nomme'],
  ['absent', 'absent', 'nomme', 'neutre', 'absent'],
  ['nomme', 'cite', 'cite', 'cite', 'absent'],
  ['absent', 'nomme', 'absent', 'absent', 'cite'],
  ['cite', 'cite', 'nomme', 'cite', 'nomme'],
  ['absent', 'absent', 'absent', 'neutre', 'absent'],
]
const A_PART = 'border-l border-dashed border-[var(--encre-pale)] pl-3'

export function EcranListeQuestions({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  const questions = [...t.q, ...m.q2]
  return (
    <Ecran titre={t.nav[1]} lang={lang} {...p} large={42} droite={<span className="etiquette text-right">50 {t.questions} · {m.dernier} 12/11</span>}>
      <table className="w-full">
        <thead>
          <tr className="etiquette text-left align-top">
            <th className="px-3.5 py-2 font-normal">Question</th>
            {ia(lang).map((n, i) => (
              <th key={n} className={`py-2 pr-2 font-normal ${i === 4 ? A_PART : ''}`}>
                <span className="text-[var(--encre)]">{n}</span>
                <span className="block">{i === 4 ? t.api : t.interface}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr key={q} className="ligne-t">
              <td className="px-3.5 py-2">
                <span className="font-semibold">{q}</span>
                <span className="block text-[0.6875rem] text-[var(--encre-douce)]">{m.themes[i]}</span>
              </td>
              {ETATS_LISTE[i].map((e, j) => (
                <td key={j} className={`py-2 pr-2 ${j === 4 ? A_PART : ''}`}><Pastille e={e} lang={lang} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Ecran>
  )
}

// ── Recherches lancées par les IA ───────────────────────────────────────────
export function EcranRecherches({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  const n = [9, 7, 5, 4, 3]
  const question = [0, 0, 0, 1, 0]
  return (
    <Ecran titre={t.recherches} lang={lang} {...p} droite={<span className="etiquette">ChatGPT · Claude</span>}>
      <ul>
        {m.rech.map((r, i) => (
          <li key={r} className={`grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2 ${i ? 'ligne-t' : ''}`}>
            <span className="nb text-[var(--encre-pale)]">{i + 1}</span>
            <div className="min-w-0">
              <p className="font-semibold">« {r} »</p>
              <p className="truncate text-[0.6875rem] text-[var(--encre-douce)]">{m.pour}{dp(lang)}{t.q[question[i]]}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="jauge hidden w-12 sm:block"><span style={{ width: `${(n[i] / 9) * 100}%` }} /></div>
              <span className="nb text-right">{n[i]} {t.reponses}</span>
            </div>
          </li>
        ))}
      </ul>
    </Ecran>
  )
}

// ── Chaînes YouTube citées ──────────────────────────────────────────────────
export function EcranChaines({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  const abonnes = ['212 000', '18 400', '64 000', '9 300']
  const videos = [4, 2, 2, 1]
  const reponses = [11, 7, 5, 2]
  const proprietaire: [EtatP, string][] = [['neutre', m.tiers], ['cite', m.aVous], ['absent', 'Concurrent A'], ['neutre', m.tiers]]
  return (
    <Ecran titre={m.chaines} lang={lang} {...p} large={33} droite={<span className="etiquette">{t.interface} · {mil(lang, '1 240')} {t.releves}</span>}>
      <table className="w-full">
        <thead>
          <tr className="etiquette text-left">
            <th className="px-3.5 py-2 font-normal">{m.chaine}</th>
            <th className="py-2 font-normal">{t.aQui}</th>
            <th className="py-2 font-normal">{m.videosCitees}</th>
            <th className="px-3.5 py-2 text-right font-normal">{t.reponses}</th>
          </tr>
        </thead>
        <tbody>
          {m.noms.map((nomChaine, i) => (
            <tr key={nomChaine} className={`ligne-t ${i === 1 ? 'bg-[var(--papier)]' : ''}`}>
              <td className="px-3.5 py-2">
                <span className="font-semibold">{nomChaine}</span>
                <span className="block text-[0.6875rem] text-[var(--encre-douce)]"><span className="nb">{mil(lang, abonnes[i])}</span> {m.abonnes}</span>
              </td>
              <td className="py-2"><span className={`pastille ${proprietaire[i][0]}`}>{proprietaire[i][1]}</span></td>
              <td className="nb py-2">{videos[i]}</td>
              <td className="px-3.5 py-2">
                <div className="flex items-center justify-end gap-2">
                  <div className="jauge w-16"><span style={{ width: `${(reponses[i] / 11) * 100}%` }} /></div>
                  <span className="nb w-6 text-right">{reponses[i]}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Ecran>
  )
}

// ── Faits vérifiés : ce que les réponses disent de faux ─────────────────────
export function EcranFaits({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  const reponses = [2, 3, 6]
  const source = ['comparatif.exemple', 'media.exemple', '']
  return (
    <Ecran titre={m.faits} lang={lang} {...p} large={37} droite={<span className="etiquette">3 / 12</span>}>
      <table className="w-full">
        <thead>
          <tr className="etiquette text-left">
            <th className="px-3.5 py-2 font-normal">{m.fait}</th>
            <th className="py-2 font-normal">{m.dit}</th>
            <th className="py-2 font-normal">{m.enCause}</th>
            <th className="px-3.5 py-2 font-normal" />
          </tr>
        </thead>
        <tbody>
          {m.listeFaits.map((f, i) => (
            <tr key={f} className="ligne-t align-top">
              <td className="px-3.5 py-2 font-semibold">{f}</td>
              <td className="py-2 pr-3">{m.listeDits[i]}<span className="block text-[0.6875rem] text-[var(--encre-douce)]"><span className="nb">{reponses[i]}</span> {t.reponses}</span></td>
              <td className="py-2 pr-3 text-[var(--encre-douce)]">{source[i]}</td>
              <td className="px-3.5 py-2 text-right"><span className={`pastille ${i === 2 ? 'nomme' : 'absent'}`}>{i === 2 ? m.juste : m.faux}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Ecran>
  )
}

// ── Questions perdues : qui est cité, et grâce à quelles pages ──────────────
export function EcranPerdues({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  const lignes: [string, number, string[], string, number][] = [
    [t.q[1], 4, ['Concurrent A', 'Concurrent B'], 'comparatif.exemple/crm-tpe', 4],
    [t.q[3], 3, ['Concurrent C'], 'media.exemple/hebergeurs', 3],
    [m.q2[1], 4, ['Concurrent A'], 'forum.exemple/devis-excel', 2],
  ]
  return (
    <Ecran titre={m.perdues} lang={lang} {...p} large={39} droite={<span className="etiquette">17 / 50 {t.questions}</span>}>
      <table className="w-full">
        <thead>
          <tr className="etiquette text-left">
            <th className="px-3.5 py-2 font-normal">Question</th>
            <th className="py-2 font-normal">{m.absentSur}</th>
            <th className="py-2 font-normal">{m.aVotrePlace}</th>
            <th className="px-3.5 py-2 font-normal">{m.grace}</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map(([q, n, marques, page, nIa]) => (
            <tr key={q} className="ligne-t align-top">
              <td className="max-w-[12rem] px-3.5 py-2 font-semibold">{q}</td>
              <td className="py-2 pr-3"><span className="pastille absent"><span className="nb">{n}</span> {m.iaSur}</span></td>
              <td className="py-2 pr-3">{marques.map((x) => <span key={x} className="block">{x}</span>)}</td>
              <td className="px-3.5 py-2"><span className="font-semibold">{page}</span><span className="block text-[0.6875rem] text-[var(--encre-douce)]"><span className="nb">{nIa}</span> {m.ia}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Ecran>
  )
}

// ── Audit d'une page : ce que voient les robots des IA ──────────────────────
export function EcranAudit({ lang, ...p }: PropsEcran) {
  const m = M[lang]
  const etats: [EtatP, string][] = [['nomme', m.ok], ['nomme', m.ok], ['absent', m.corriger], ['neutre', m.partiel], ['absent', m.corriger]]
  return (
    <Ecran titre={m.audit} lang={lang} {...p} droite={<span className="etiquette">{lang === 'fr' ? 'votre-site.fr/tarifs' : 'your-site.example/pricing'}</span>}>
      <ul>
        {m.points.map(([point, constat], i) => (
          <li key={point} className={`grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-3.5 py-2.5 ${i ? 'ligne-t' : ''}`}>
            <div>
              <p className="font-semibold">{point}</p>
              <p className="mt-0.5 text-[var(--encre-douce)]">{constat}</p>
            </div>
            <span className={`pastille ${etats[i][0]}`}>{etats[i][1]}</span>
          </li>
        ))}
      </ul>
    </Ecran>
  )
}

// ── Mesure après action : l'écart dépasse-t-il la marge d'erreur ? ──────────
function Plage({ valeur, marge, lang, libelle }: { valeur: number; marge: number; lang: Lang; libelle: string }) {
  // Échelle de 0 à 60 % : assez pour les valeurs d'exemple.
  const pos = (v: number) => `${(v / 60) * 100}%`
  return (
    <div className="grid grid-cols-[3rem_minmax(0,1fr)_4.5rem] items-center gap-2">
      <span className="etiquette">{libelle}</span>
      <div className="relative h-4 bg-[var(--papier)]">
        <span className="absolute top-1 h-2 bg-[var(--surligneur)] shadow-[inset_0_0_0_1px_var(--encre)]" style={{ left: pos(valeur - marge), width: pos(marge * 2) }} />
        <span className="absolute top-0 h-4 w-0.5 bg-[var(--encre)]" style={{ left: pos(valeur) }} />
      </div>
      <span className="nb text-right">{pc(lang, valeur)} ±{marge}</span>
    </div>
  )
}

export function EcranAvantApres({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  const cas: [number, number, number, number, string, boolean][] = [[31, 6, 45, 6, '14/10', true], [22, 5, 25, 5, '21/10', false]]
  return (
    <Ecran titre={m.apres} lang={lang} {...p} droite={<span className="etiquette">ChatGPT · {t.interface} · 240 {t.releves}</span>}>
      {cas.map(([avant, mAvant, apres, mApres, date, reel], i) => (
        <div key={i} className={`px-3.5 py-3 ${i ? 'ligne-t' : ''}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="font-semibold">{m.actions2[i]}</p>
            <p className="etiquette">{m.faite} {date}</p>
          </div>
          <div className="mt-2 space-y-1.5">
            <Plage valeur={avant} marge={mAvant} lang={lang} libelle={m.avant} />
            <Plage valeur={apres} marge={mApres} lang={lang} libelle={m.apresMot} />
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-2">
            <span className="nb">{m.ecart}{dp(lang)}+{apres - avant} {m.points2}</span>
            <span className={`pastille ${reel ? 'cite' : 'neutre'}`}>{reel ? m.reel : m.bruit}</span>
          </p>
        </div>
      ))}
    </Ecran>
  )
}

// ── Marge d'erreur : un mot plutôt qu'un pourcentage trompeur ───────────────
export function EcranMarge({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  // Vingt relevés par question : présent (1) ou non (0).
  const series = ['11101111011111101111', '00100001000100010010', '00000000000000000000']
  const verdicts: [EtatP, string][] = [['cite', m.solide], ['neutre', m.occasionnelle], ['absent', m.absente]]
  return (
    <Ecran titre={m.fiabilite} lang={lang} {...p} droite={<span className="etiquette">ChatGPT · {t.interface}</span>}>
      <div className="grid grid-cols-2 border-b border-[var(--filet)]">
        <div className="border-r border-[var(--filet)] p-3.5">
          <p className="etiquette">{m.ensemble}</p>
          <p className="nb mt-1 text-2xl">{pc(lang, 42)} <span className="text-sm text-[var(--encre-douce)]">±3</span></p>
          <p className="mt-0.5 text-[0.6875rem] text-[var(--encre-douce)]">{mil(lang, '1 000')} {t.releves}</p>
        </div>
        <div className="p-3.5">
          <p className="etiquette">{m.seule}</p>
          <p className="nb mt-1 text-2xl text-[var(--encre-pale)]">±20</p>
          <p className="mt-0.5 text-[0.6875rem] text-[var(--encre-douce)]">20 {t.releves}</p>
        </div>
      </div>
      {series.map((serie, i) => {
        const presents = serie.split('').filter((c) => c === '1').length
        return (
          <div key={i} className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-3.5 py-2.5 ${i ? 'ligne-t' : ''}`}>
            <p className="truncate font-semibold">{t.q[i]}</p>
            <span className={`pastille ${verdicts[i][0]}`}>{verdicts[i][1]}</span>
            <div className="coches" role="img" aria-label={`${presents} ${m.sur20}`}>
              {serie.split('').map((c, j) => <span key={j} className={c === '1' ? 'la' : ''} />)}
            </div>
            <span className="nb text-right text-[var(--encre-douce)]">{presents} {m.sur20}</span>
          </div>
        )
      })}
      <p className="ligne-t px-3.5 py-2 text-[0.6875rem] text-[var(--encre-douce)]">{m.un}. {t.cite}{dp(lang)}<span className="inline-block h-2 w-2 bg-[var(--surligneur)] shadow-[inset_0_0_0_1px_var(--encre)]" /></p>
    </Ecran>
  )
}

// ── Rapport du lundi : le courriel ──────────────────────────────────────────
export function EcranRapport({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  const montant = lang === 'fr' ? '1,72 $' : '$1.72'
  return (
    <Ecran titre={m.rapport} lang={lang} {...p} droite={<span className="etiquette">{lang === 'fr' ? 'lundi 08:00' : 'Monday 08:00'}</span>}>
      <div className="border-b border-[var(--filet)] bg-[var(--papier)] px-3.5 py-2.5">
        <p><span className="etiquette">{m.de}</span> GeoTrends</p>
        <p><span className="etiquette">{m.objet}</span> <span className="font-semibold">{m.objetTexte}</span></p>
      </div>
      <div className="px-3.5 py-3">
        <p className="etiquette">{m.bouge}</p>
        <ul className="mt-1">
          {m.mouvements.map((x, i) => (
            <li key={x} className={`flex gap-2 py-1.5 ${i ? 'ligne-t' : ''} ${i === 2 ? 'text-[var(--encre-douce)]' : ''}`}>
              <span className="nb" aria-hidden="true">{i === 0 ? '↑' : i === 1 ? '!' : '·'}</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <p className="etiquette mt-3">{m.trois}</p>
        <ol className="mt-1">
          {t.act.slice(0, 3).map((a, i) => (
            <li key={a} className={`flex gap-2 py-1.5 ${i ? 'ligne-t' : ''}`}>
              <span className="nb text-[var(--encre-pale)]">{i + 1}</span>
              <span className="font-semibold">{a}</span>
            </li>
          ))}
        </ol>
        <p className="ligne-t mt-2 flex justify-between pt-2">
          <span className="etiquette">{m.depenseSemaine}</span>
          <span className="nb">{montant}</span>
        </p>
      </div>
    </Ecran>
  )
}

// ── Un projet : la marque et tout ce qui lui appartient ─────────────────────
// Reprend l'écran « Projets » de l'outil : seuls les sites et les chaînes
// YouTube se déclarent aujourd'hui, les concurrents et les questions se saisissent.
export function EcranProjet({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  const champ = 'mt-1 border border-[var(--filet)] bg-[var(--papier)] px-2 py-1'
  const releves = [4, 4, 0]
  return (
    <Ecran titre={`${t.projet}${dp(lang)}${t.vous}`} lang={lang} {...p} droite={<span className="etiquette text-right">{t.pays}</span>}>
      <div className="grid sm:grid-cols-2">
        <div className="p-3.5 sm:border-r sm:border-[var(--filet)]">
          <p className="etiquette">{m.marque}</p>
          <p className={`${champ} font-semibold`}>{t.vous}</p>
          <p className="etiquette mt-3">{m.proprietesMarque}</p>
          {m.props.map(([type, valeur]) => (
            <p key={valeur} className="ligne-t mt-1.5 flex justify-between gap-3 pt-1.5">
              <span className="text-[var(--encre-douce)]">{type}</span>
              <span className="truncate font-semibold">{valeur}</span>
            </p>
          ))}
          <p className="mt-2 text-[0.6875rem] text-[var(--encre-douce)]">{m.compte}</p>
          <p className="etiquette mt-3">{t.nav[3]}</p>
          <p className="mt-1 flex flex-wrap gap-1">
            {['Concurrent A', 'Concurrent B', 'Concurrent C'].map((x) => <span key={x} className="pastille neutre">{x}</span>)}
          </p>
        </div>
        <div className="border-t border-[var(--filet)] p-3.5 sm:border-t-0">
          <p className="etiquette">{m.suivies} (50)</p>
          {[t.q[0], t.q[1], m.q2[0]].map((q, i) => (
            <p key={q} className="ligne-t mt-1.5 flex items-baseline justify-between gap-3 pt-1.5">
              <span className="font-semibold">{q}</span>
              <span className="nb shrink-0 text-[0.6875rem] text-[var(--encre-douce)]">{releves[i]} {t.releves}</span>
            </p>
          ))}
          <p className="mt-2 text-[0.6875rem] text-[var(--encre-douce)]">{m.figee}</p>
          <p className={`${champ} mt-3 text-[var(--encre-pale)]`}>{m.ajouterQuestion}</p>
        </div>
      </div>
    </Ecran>
  )
}

// ── Lancer un relevé : le prix de chaque IA, avant l'envoi ──────────────────
export function EcranLancer({ lang, ...p }: PropsEcran) {
  const t = L[lang]
  const m = M[lang]
  const usd = (v: string) => (lang === 'en' ? '$' + v.replace(',', '.') : v + ' $')
  const lignes: [string, string][] = [['0,0012', '0,06'], ['0,0012', '0,06'], ['0,0012', '0,06'], ['0,0012', '0,06'], ['0,06', '3,00']]
  return (
    <Ecran titre={m.lancer} lang={lang} {...p} large={31} droite={<span className="etiquette">50 {t.questions}</span>}>
      <table className="w-full">
        <thead>
          <tr className="etiquette text-left">
            <th className="px-3.5 py-2 font-normal">{m.ia}</th>
            <th className="py-2 font-normal">{m.methode}</th>
            <th className="py-2 text-right font-normal">{m.parQuestion}</th>
            <th className="px-3.5 py-2 text-right font-normal">{m.pour50}</th>
          </tr>
        </thead>
        <tbody>
          {ia(lang).map((n, i) => (
            <tr key={n} className="ligne-t">
              <td className="px-3.5 py-2">
                <span className="flex items-center gap-2 font-semibold">
                  <span className={`flex h-3.5 w-3.5 items-center justify-center border border-[var(--encre)] text-[0.625rem] leading-none ${i < 4 ? 'bg-[var(--surligneur)]' : ''}`} aria-hidden="true">{i < 4 ? '✓' : ''}</span>
                  {n}
                </span>
              </td>
              <td className="py-2 text-[var(--encre-douce)]">{i === 4 ? m.apiSeul : m.interfaceReelle}</td>
              <td className="nb py-2 text-right">{usd(lignes[i][0])}</td>
              <td className="nb px-3.5 py-2 text-right font-semibold">{usd(lignes[i][1])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ligne-t flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5">
        <p className="text-[var(--encre-douce)]">{t.depense}{dp(lang)}<span className="nb text-[var(--encre)]">{usd('7,42')}</span> {t.plafond} <span className="nb text-[var(--encre)]">{usd('20,00')}</span></p>
        <span className="bg-[var(--encre)] px-2.5 py-1 font-semibold text-[var(--papier)]">{m.lancerBouton} · {usd('0,24')}</span>
      </div>
    </Ecran>
  )
}

/** Les écrans par clé, pour les pages qui les choisissent depuis le contenu. */
export const ECRANS = {
  vue: EcranVueDEnsemble,
  liste: EcranListeQuestions,
  question: EcranQuestion,
  concurrents: EcranConcurrents,
  sources: EcranSources,
  proprietes: EcranProprietes,
  apercus: EcranApercus,
  recherches: EcranRecherches,
  chaines: EcranChaines,
  faits: EcranFaits,
  perdues: EcranPerdues,
  audit: EcranAudit,
  actions: EcranActions,
  apres: EcranAvantApres,
  couts: EcranCouts,
  marge: EcranMarge,
  rapport: EcranRapport,
  projet: EcranProjet,
  lancer: EcranLancer,
} as const
export type CleEcran = keyof typeof ECRANS
