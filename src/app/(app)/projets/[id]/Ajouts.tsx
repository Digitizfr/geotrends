'use client'

import { useActionState, useState } from 'react'
import { useT } from '@/lib/i18n/client'
import { ajouterProprietesAvecBilan, ajouterQuestions, type BilanProprietes } from '../actions'
import { Detection } from '../Detection'


/** Ajout de questions, avec l'effet sur le prix d'un relevé écrit avant d'ajouter. */
export function AjoutQuestions({ projetId, prixParQuestion, etiquetage = null }: { projetId: string; prixParQuestion: number; etiquetage?: number | null }) {
  const { t, f } = useT()
  const [texte, setTexte] = useState('')
  const n = new Set(texte.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)).size
  return (
    <form action={async (d) => { await ajouterQuestions(d); setTexte('') }} className="space-y-2">
      <input type="hidden" name="projetId" value={projetId} />
      <label className="libelle">
        {t('Ajouter des questions')}
        <span className="aide">{t('Une question par ligne, comme un client la poserait à une IA.')}</span>
        <textarea name="questions" rows={4} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder={t('Quel logiciel choisir pour… ?')} className="champ mt-1" />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={n === 0} className="bouton bouton-creux">{n > 0 ? t('Ajouter {n} [n:question|questions]', { n }) : t('Ajouter')}</button>
        <p className="second" aria-live="polite">
          {n === 0 ? t('Ajouter une question ne coûte rien. La dépense commence au prochain relevé.') : t('+{n} [n:question|questions] : +{prix} par relevé d’interface.', { n, prix: f.usdFin(n * prixParQuestion) })}
          {etiquetage !== null ? ` ${n === 0 ? t('Les questions ajoutées sont étiquetées toutes seules (thème et intention) : environ {prix} par question. Cela se coupe sur l’écran Questions.', { prix: f.usdFin(etiquetage) }) : t('Les questions ajoutées sont étiquetées toutes seules (thème et intention) : environ {prix}. Cela se coupe sur l’écran Questions.', { prix: f.usdFin(n * etiquetage) })}` : n > 0 ? ` ${t('Rien n’est dépensé maintenant.')}` : ''}
        </p>
      </div>
    </form>
  )
}

const TYPES: Record<string, string> = { site: 'Site', youtube: 'Chaîne YouTube', profil: 'Réseau social', nom: 'Écriture du nom' }

/** Ajout de propriétés à la marque. Après l'envoi, l'outil dit ce qu'il a reconnu. */
export function AjoutProprietes({ projetId, sitesDeclares = [] }: { projetId: string; /** Sites déjà déclarés : la détection les lit si le champ est vide. */ sitesDeclares?: string[] }) {
  const { t } = useT()
  const [bilan, envoyer, enCours] = useActionState<BilanProprietes, FormData>(ajouterProprietesAvecBilan, null)
  const [champs, setChamps] = useState({ sites: '', chaines: '', profils: '' })
  // Après un ajout, les champs se vident (le bilan dit ce qui a été pris).
  const [bilanVu, setBilanVu] = useState(bilan)
  if (bilan !== bilanVu) {
    setBilanVu(bilan)
    setChamps({ sites: '', chaines: '', profils: '' })
  }
  const lignes = (x: string) => [...new Set(x.split(/\r?\n/).map((l) => l.trim()).filter(Boolean))]
  const saisie = (cle: 'sites' | 'chaines' | 'profils') => ({ name: cle, value: champs[cle], rows: Math.min(8, Math.max(2, champs[cle].split('\n').length)), onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setChamps((c) => ({ ...c, [cle]: e.target.value })) })
  return (
    <form action={envoyer} className="space-y-3">
      <input type="hidden" name="projetId" value={projetId} />
      <div className="grid gap-4 md:grid-cols-4">
        <label className="libelle">
          {t('Sites de la marque')}
          <span className="aide">{t('Un par ligne. Une adresse complète convient : seul le domaine est gardé.')}</span>
          <textarea {...saisie('sites')} placeholder={t('exemple.fr')} className="champ mt-1" />
        </label>
        <label className="libelle">
          {t('Chaînes YouTube')}
          <span className="aide">{t('Une par ligne : l’adresse de la chaîne, ou son nom précédé de @.')}</span>
          <textarea {...saisie('chaines')} placeholder={t('@MaChaine')} className="champ mt-1" />
        </label>
        <label className="libelle">
          {t('Réseaux sociaux')}
          <span className="aide">{t('Une adresse de profil par ligne : LinkedIn, Instagram, Facebook, X, TikTok…')}</span>
          <textarea {...saisie('profils')} placeholder={'https://www.linkedin.com/company/exemple'} className="champ mt-1" />
        </label>
        <label className="libelle">
          {t('Autres écritures du nom')}
          <span className="aide">{t('Une par ligne : sigle, nom sans espace, ancienne marque.')}</span>
          <textarea name="noms" rows={2} placeholder={t('Exemple SAS')} className="champ mt-1" />
        </label>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <button type="submit" disabled={enCours} className="bouton bouton-creux">{enCours ? t('Vérification…') : t('Ajouter')}</button>
        <Detection
          projetId={projetId}
          sites={lignes(champs.sites).length ? lignes(champs.sites) : sitesDeclares}
          onTrouve={(x) => setChamps((c) => ({ ...c, profils: lignes(`${c.profils}\n${x.profils.join('\n')}`).join('\n'), chaines: lignes(`${c.chaines}\n${x.chaines.join('\n')}`).join('\n') }))}
        />
      </div>
      {bilan && (
        <div className="bandeau" role="status">
          {bilan.ajoutees.length > 0 && (
            <>
              <p className="font-semibold">{t('Reconnu et ajouté :')}</p>
              <ul className="mt-1">
                {bilan.ajoutees.map((p) => <li key={`${p.type}:${p.valeur}`}><span className="etiquette">{TYPES[p.type] ? t(TYPES[p.type]) : p.type}</span> <span className="font-semibold">{p.libelle ?? p.valeur}</span>{p.libelle && <span className="second discret chiffre"> · {p.valeur}</span>}</li>)}
              </ul>
            </>
          )}
          {bilan.doublons.length > 0 && <p className="mt-1">{t('Déjà déclaré, écarté :')} {bilan.doublons.join(', ')}.</p>}
          {bilan.illisibles.length > 0 && <p className="mt-1 text-[var(--absent-texte)]">{t('Non reconnu : {liste}. Vérifiez l’adresse du site ou de la chaîne.', { liste: bilan.illisibles.join(', ') })}</p>}
          {bilan.ajoutees.length + bilan.doublons.length + bilan.illisibles.length === 0 && <p>{t('Rien à ajouter : les champs étaient vides.')}</p>}
        </div>
      )}
    </form>
  )
}
