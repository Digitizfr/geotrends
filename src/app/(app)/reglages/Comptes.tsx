'use client'

import { useActionState, useState } from 'react'
import { Initiale } from '@/components/outil/Initiale'
import { useT } from '@/lib/i18n/client'
import { changerMotDePasse, inviter, nouveauLien, retirer, type ResultatLien, type ResultatMotDePasse } from './actions'

export type Compte = {
  id: string
  name: string
  email: string
  role: string
  motDePasse: boolean
  lienJusquau: string | null
  derniereConnexion: string | null
}

/** Copie un texte dans le presse-papiers, et le dit pendant deux secondes. */
function BoutonCopier({ texte, libelle }: { texte: string; libelle: string }) {
  const { t } = useT()
  const [fait, setFait] = useState(false)
  return (
    <button
      type="button"
      className="bouton bouton-creux bouton-petit"
      onClick={async () => {
        await navigator.clipboard.writeText(texte)
        setFait(true)
        setTimeout(() => setFait(false), 2000)
      }}
    >
      {fait ? t('Copié') : libelle}
    </button>
  )
}

/** Le lien qui vient d'être créé : à envoyer maintenant, il ne se réaffiche pas. */
function LienCree({ r }: { r: Extract<ResultatLien, { ok: true }> }) {
  const { t } = useT()
  const ecrire = `mailto:${encodeURIComponent(r.email)}?subject=${encodeURIComponent(r.sujet)}&body=${encodeURIComponent(r.texte)}`
  return (
    <div className="lien-invitation" role="status">
      <p className="font-semibold">
        {r.nouveau ? t('Compte créé pour {nom}.', { nom: r.nom }) : r.premiereFois ? t('Nouveau lien d’invitation pour {nom}.', { nom: r.nom }) : t('Lien de nouveau mot de passe pour {nom}.', { nom: r.nom })}{' '}
        {t('Envoyez-le maintenant : il vaut sept jours, une seule fois, et ne se réaffiche pas.')}
      </p>
      <input readOnly value={r.lien} className="champ mt-2 font-mono text-[0.8125rem]" onFocus={(e) => e.currentTarget.select()} aria-label={t('Lien personnel')} />
      <div className="mt-2 flex flex-wrap gap-2">
        <a href={ecrire} className="bouton bouton-petit">{t('Écrire l’e-mail')}</a>
        <BoutonCopier texte={r.lien} libelle={t('Copier le lien')} />
        <BoutonCopier texte={`${r.sujet}\n\n${r.texte}`} libelle={t('Copier le texte de l’e-mail')} />
      </div>
      <p className="second mt-2">{t('« Écrire l’e-mail » ouvre votre messagerie avec le message tout prêt, adressé à {email}.', { email: r.email })}</p>
    </div>
  )
}

function Erreur({ r }: { r: ResultatLien | null }) {
  return r && !r.ok ? <p role="alert" className="bandeau erreur mt-2 text-[0.875rem]">{r.erreur}</p> : null
}

function Ligne({ c, moi, premiere }: { c: Compte; moi: string; premiere: boolean }) {
  const { t, f } = useT()
  const [resultat, demanderLien, enCours] = useActionState(nouveauLien, null)
  const [confirmer, setConfirmer] = useState(false)
  const etat = c.lienJusquau
    ? c.motDePasse
      ? t('Lien de nouveau mot de passe en cours, jusqu’au {date}', { date: f.jourLong(new Date(c.lienJusquau)) })
      : t('Invitation en cours, mot de passe pas encore choisi · lien valable jusqu’au {date}', { date: f.jourLong(new Date(c.lienJusquau)) })
    : !c.motDePasse
      ? t('Mot de passe pas encore choisi, lien expiré : refaites un lien')
      : c.derniereConnexion
        ? t('Dernière connexion : {date}', { date: f.dateHeure(new Date(c.derniereConnexion)) })
        : t('Aucune connexion pour l’instant')
  return (
    <li className={`px-4 py-3 ${premiere ? '' : 'ligne-t'}`}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <Initiale nom={c.name} />
        <span className="min-w-0">
          <span className="block truncate font-semibold">{c.name}{c.id === moi ? ` · ${t('vous')}` : ''}</span>
          <span className="second block truncate">{c.email} · {etat}</span>
        </span>
        <span className={`pastille ${c.role === 'admin' ? 'cite' : 'neutre'}`}>{c.role === 'admin' ? t('Administrateur') : t('Membre')}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 pl-11">
        <form action={demanderLien}>
          <input type="hidden" name="email" value={c.email} />
          <button type="submit" disabled={enCours} className="bouton bouton-creux bouton-petit">
            {enCours ? t('Création…') : c.motDePasse ? t('Lien de nouveau mot de passe') : t('Nouveau lien d’invitation')}
          </button>
        </form>
        {c.id !== moi &&
          (confirmer ? (
            <form action={retirer} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="userId" value={c.id} />
              <span className="second">{t('Retirer l’accès de {nom} ?', { nom: c.name })}</span>
              <button type="submit" className="bouton bouton-petit bouton-danger">{t('Oui, retirer')}</button>
              <button type="button" className="bouton bouton-creux bouton-petit" onClick={() => setConfirmer(false)}>{t('Annuler')}</button>
            </form>
          ) : (
            <button type="button" className="bouton bouton-creux bouton-petit" onClick={() => setConfirmer(true)}>{t('Retirer l’accès')}</button>
          ))}
      </div>
      {resultat?.ok && <div className="mt-3 pl-11"><LienCree r={resultat} /></div>}
      <div className="pl-11"><Erreur r={resultat} /></div>
    </li>
  )
}

/** Réglages › Comptes (administrateur) : inviter, refaire un lien, retirer un accès. */
export function Comptes({ comptes, moi }: { comptes: Compte[]; moi: string }) {
  const { t } = useT()
  const [resultat, envoyer, enCours] = useActionState(inviter, null)
  return (
    <>
      <form action={envoyer} className="grid gap-3 border-b border-[var(--encre)] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto_auto] sm:items-end">
        <label className="libelle">
          {t('Nom')}
          <input name="nom" required autoComplete="off" className="champ mt-1" placeholder={t('Prénom Nom')} />
        </label>
        <label className="libelle">
          {t('Adresse e-mail')}
          <input name="email" type="email" required autoComplete="off" className="champ mt-1" />
        </label>
        <label className="libelle">
          {t('Rôle')}
          <select name="role" defaultValue="membre" className="champ mt-1">
            <option value="membre">{t('Membre')}</option>
            <option value="admin">{t('Administrateur')}</option>
          </select>
        </label>
        <button type="submit" disabled={enCours} className="bouton">{enCours ? t('Création…') : t('Inviter')}</button>
        <p className="second sm:col-span-4">{t('Un membre voit tout l’outil sauf les coûts. L’invité reçoit un lien pour choisir son mot de passe : aucun mot de passe ne circule par e-mail.')}</p>
        {resultat?.ok && <div className="sm:col-span-4"><LienCree r={resultat} /></div>}
        <div className="sm:col-span-4"><Erreur r={resultat} /></div>
      </form>
      <ul>
        {comptes.map((c, i) => <Ligne key={c.id} c={c} moi={moi} premiere={i === 0} />)}
      </ul>
    </>
  )
}

/** Réglages › Mon mot de passe : pour chacun. */
export function MotDePasse() {
  const { t } = useT()
  const [resultat, envoyer, enCours] = useActionState<ResultatMotDePasse, FormData>(changerMotDePasse, null)
  return (
    <form action={envoyer} className="grid gap-3 p-4">
      <label className="libelle">
        {t('Mot de passe actuel')}
        <input name="actuel" type="password" required autoComplete="current-password" className="champ mt-1" />
      </label>
      <label className="libelle">
        {t('Nouveau mot de passe')}
        <input name="nouveau" type="password" required minLength={8} autoComplete="new-password" className="champ mt-1" />
      </label>
      <label className="libelle">
        {t('Le même, une seconde fois')}
        <input name="confirmation" type="password" required minLength={8} autoComplete="new-password" className="champ mt-1" />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={enCours} className="bouton bouton-creux">{enCours ? t('Enregistrement…') : t('Changer le mot de passe')}</button>
        <span className="second">{t('Au moins {n} caractères. Vos autres sessions seront fermées.', { n: 8 })}</span>
      </div>
      {resultat && <p role={resultat.ok ? 'status' : 'alert'} className={`bandeau ${resultat.ok ? 'ok' : 'erreur'} text-[0.875rem]`}>{resultat.message}</p>}
    </form>
  )
}
