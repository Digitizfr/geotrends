'use client'

import { useState, useTransition } from 'react'
import { useT } from '@/lib/i18n/client'
import { detecterProfils } from './actions'

type Trouve = { profils: string[]; chaines: string[] }

/**
 * Bouton « Détecter depuis le site » : lit la page d'accueil des sites saisis
 * (gratuit) et remet dans les champs les réseaux sociaux et les chaînes YouTube
 * trouvés. Rien n'est enregistré : on relit, on retire ce qui ne va pas.
 */
export function Detection({ sites, onTrouve, projetId }: { sites: string[]; onTrouve: (t: Trouve) => void; /** Sur la fiche d'un projet : ce qui est déjà déclaré n'est pas reproposé. */ projetId?: string }) {
  const { t } = useT()
  const [enCours, lancer] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [erreurs, setErreurs] = useState<string[]>([])
  return (
    <div className="space-y-1">
      <button
        type="button"
        disabled={enCours || sites.length === 0}
        className="bouton bouton-creux"
        onClick={() =>
          lancer(async () => {
            setMessage(null)
            const r = await detecterProfils(sites, projetId)
            onTrouve({ profils: r.profils.map((p) => `https://${p.valeur}`), chaines: r.chaines })
            setErreurs(r.illisibles)
            setMessage(
              r.lus.length === 0
                ? t('Aucun site n’a pu être lu.')
                : r.profils.length + r.chaines.length === 0
                  ? (r.dejaDeclares > 0 ? t('Rien de nouveau sur la page d’accueil.') : t('Aucun réseau social trouvé sur la page d’accueil. Vous pouvez les saisir à la main.'))
                  : r.chaines.length === 0
                    ? t('{n} [n:profil trouvé|profils trouvés]. Relisez avant d’ajouter.', { n: r.profils.length })
                    : t('{n} [n:profil|profils] et {c} [c:chaîne|chaînes] YouTube trouvés. Relisez avant d’ajouter.', { n: r.profils.length, c: r.chaines.length }),
            )
            if (r.dejaDeclares > 0) setMessage((x) => `${x} ${t('{n} déjà [n:déclaré, écarté|déclarés, écartés].', { n: r.dejaDeclares })}`)
          })
        }
      >
        {enCours ? t('Lecture du site…') : t('Détecter depuis le site')}
      </button>
      <p className="second" aria-live="polite">
        {message ?? (sites.length ? t('Lit la page d’accueil de {sites} et propose les réseaux sociaux et chaînes YouTube trouvés. Gratuit.', { sites: sites.join(', ') }) : t('Saisissez un site pour lire sa page d’accueil et trouver ses réseaux sociaux. Gratuit.'))}
        {erreurs.length > 0 && <span className="text-[var(--absent-texte)]"> {t('Illisible : {liste}.', { liste: erreurs.join(', ') })}</span>}
      </p>
    </div>
  )
}
