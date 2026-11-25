'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useT } from '@/lib/i18n/client'
import { ajouterQuestionsPage, lirePageEtProposer, suivrePage, type ResultatLecture } from './actions'

type Ligne = { cle: number; texte: string; garder: boolean; main: boolean }
export type QuestionExistante = { id: string; texte: string; theme: string | null }

function Envoyer({ children, className = 'bouton', disabled = false }: { children: React.ReactNode; className?: string; disabled?: boolean }) {
  const { pending } = useFormStatus()
  const { t } = useT()
  return <button type="submit" disabled={pending || disabled} className={className}>{pending ? t('Un instant…') : children}</button>
}

/** Les questions proposées : à garder, retoucher, retirer, et d'autres à ajouter à la main. */
function Editeur({ r, existantes, pageId }: { r: Extract<NonNullable<ResultatLecture>, { ok: true }>; existantes: QuestionExistante[]; pageId?: string }) {
  const { t } = useT()
  const [lignes, setLignes] = useState<Ligne[]>(() => r.propositions.map((p, i) => ({ cle: i, texte: p.texte, garder: true, main: false })))
  const [nouvelle, setNouvelle] = useState('')
  const [cochees, setCochees] = useState<string[]>([])
  const gardees = lignes.filter((l) => l.garder && l.texte.trim().length >= 3)
  const total = gardees.length + cochees.length
  const changer = (cle: number, x: Partial<Ligne>) => setLignes((ls) => ls.map((l) => (l.cle === cle ? { ...l, ...x } : l)))
  const ajouter = () => {
    const texte = nouvelle.replace(/\s+/g, ' ').trim()
    if (texte.length < 3) return
    setLignes((ls) => [...ls, { cle: Date.now(), texte, garder: true, main: true }])
    setNouvelle('')
  }
  const versPage = !!pageId || !!r.dejaSuivie

  return (
    <form action={pageId ? ajouterQuestionsPage : suivrePage} className="lecture-page mt-4">
      <input type="hidden" name="url" value={r.url} />
      <input type="hidden" name="titre" value={r.titre ?? ''} />
      {(pageId ?? r.dejaSuivie) && <input type="hidden" name="pageId" value={pageId ?? r.dejaSuivie ?? ''} />}
      <div className="border-b border-[var(--filet)] pb-3">
        <p className="font-semibold">{r.titre ?? r.url}</p>
        <p className="second break-all">{r.url}</p>
        <p className="second mt-1">
          {r.sujet ? `${t('Sujet lu')} : ${r.sujet} · ` : ''}{t('{n} mots lus', { n: r.mots })}
          {r.dejaSuivie && !pageId ? ` · ${t('page déjà suivie : les questions gardées s’ajouteront à sa fiche')}` : ''}
        </p>
      </div>

      <p className="libelle mt-3">{t('Questions proposées')} <span className="second font-normal">· {t('décochez, retouchez ou retirez, puis ajoutez les vôtres')}</span></p>
      {lignes.length === 0 && <p className={`mt-1 ${r.echecModele ? 'bandeau erreur text-[0.875rem]' : 'second'}`}>{r.echecModele ? t('Le petit modèle n’a pas répondu : écrivez vos questions ci-dessous, ou relancez la lecture dans un instant.') : t('Aucune question proposée. Écrivez les vôtres ci-dessous.')}</p>}
      <ul className="mt-1.5 grid gap-1.5">
        {lignes.map((l) => (
          <li key={l.cle} className="flex items-center gap-2">
            <input type="checkbox" checked={l.garder} onChange={(e) => changer(l.cle, { garder: e.target.checked })} aria-label={t('Garder cette question')} />
            <input
              name="q"
              value={l.texte}
              disabled={!l.garder}
              onChange={(e) => changer(l.cle, { texte: e.target.value })}
              maxLength={300}
              className={`champ min-w-0 flex-1 ${l.garder ? '' : 'opacity-50'}`}
              aria-label={t('Texte de la question')}
            />
            {l.main && <span className="second hidden whitespace-nowrap sm:inline">{t('ajoutée à la main')}</span>}
            <button type="button" className="bouton bouton-creux bouton-petit" onClick={() => setLignes((ls) => ls.filter((x) => x.cle !== l.cle))}>{t('Retirer')}</button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          value={nouvelle}
          onChange={(e) => setNouvelle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); ajouter() } }}
          placeholder={t('Une autre question, écrite à la main')}
          maxLength={300}
          className="champ min-w-0 flex-1"
          aria-label={t('Ajouter une question à la main')}
        />
        <button type="button" className="bouton bouton-creux bouton-petit" onClick={ajouter}>{t('Ajouter')}</button>
      </div>

      {!versPage && existantes.length > 0 && (
        <details className="mt-3">
          <summary className="lien cursor-pointer text-[0.875rem]">{t('Rattacher aussi des questions déjà suivies ({n})', { n: existantes.length })}</summary>
          <ul className="liste-cases mt-2">
            {existantes.map((q) => (
              <li key={q.id}>
                <label className="flex items-start gap-2.5 py-1.5">
                  <input type="checkbox" name="existante" value={q.id} checked={cochees.includes(q.id)} onChange={(e) => setCochees((c) => (e.target.checked ? [...c, q.id] : c.filter((x) => x !== q.id)))} className="mt-1" />
                  <span className="min-w-0"><span className="block">{q.texte}</span>{q.theme && <span className="second block">{q.theme}</span>}</span>
                </label>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Envoyer disabled={!pageId && total === 0 && !r.dejaSuivie}>
          {pageId || r.dejaSuivie ? t('Ajouter {n} [n:question|questions] à la page', { n: total }) : t('Suivre la page avec {n} [n:question|questions]', { n: total })}
        </Envoyer>
        <span className="second">{t('Gratuit. Les questions rejoignent le projet ; le relevé se lance ensuite, prix affiché.')}</span>
      </div>
    </form>
  )
}

/** Suivre une page : l'adresse, puis les questions proposées à retoucher. Sur la fiche d'une page : en proposer d'autres. */
export function SuivreUnePage({ urlDepart = '', existantes, prix, pageId }: { urlDepart?: string; existantes: QuestionExistante[]; prix: string; pageId?: string }) {
  const { t } = useT()
  const [r, lire, enCours] = useActionState(lirePageEtProposer, null)
  return (
    <div>
      <form action={lire} className="flex flex-wrap items-end gap-3">
        {pageId ? (
          <input type="hidden" name="pageId" value={pageId} />
        ) : (
          <label className="libelle min-w-0 flex-1">
            {t('Adresse de la page')}
            <input name="url" type="url" required defaultValue={r?.ok ? r.url : urlDepart} placeholder="https://www.exemple.fr/blog/mon-article" className="champ mt-1" />
          </label>
        )}
        <button type="submit" disabled={enCours} className={pageId ? 'bouton bouton-creux' : 'bouton'}>
          {enCours ? t('Lecture de la page…') : pageId ? t('Proposer d’autres questions : moins de {prix}', { prix }) : t('Lire la page et proposer des questions : moins de {prix}', { prix })}
        </button>
      </form>
      {!pageId && <p className="second mt-2">{t('L’outil lit la page comme un robot d’IA (sans JavaScript), puis un petit modèle propose les questions qu’un internaute poserait et auxquelles elle répond. Vous choisissez avant que rien ne soit enregistré.')}</p>}
      {r && !r.ok && <p role="alert" className="bandeau erreur mt-3 text-[0.875rem]">{r.erreur}</p>}
      {r?.ok && <Editeur key={`${r.url}-${r.propositions.length}-${r.sujet}`} r={r} existantes={existantes} pageId={pageId} />}
    </div>
  )
}
