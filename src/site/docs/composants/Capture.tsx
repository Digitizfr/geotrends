import Image from 'next/image'
import type { Lang } from '../../i18n'
import { adresseCapture, captureDe } from '../captures'
import { ECRAN_DE_CAPTURE, libelles, MENU_OUTIL } from './libelles'
import { Loupe } from './Loupe'
import { Riche, texteBrut } from './TexteRiche'

/*
 * Capture réelle de l'outil, en données d'exemple. Tant qu'une capture manque
 * au manifeste, un cadre neutre tient sa place avec la légende : la page reste
 * lisible.
 */

const ONGLETS: Record<string, Record<Lang, string>> = {
  resultats: { fr: 'Résultats', en: 'Results' },
  questions: { fr: 'Questions', en: 'Prompts' },
  releves: { fr: 'Relevés', en: 'Runs' },
  marque: { fr: 'Marque et propriétés', en: 'Brand and properties' },
  concurrents: { fr: 'Concurrents', en: 'Competitors' },
  reglages: { fr: 'Réglages du projet', en: 'Project settings' },
}

/** Où se trouve l'écran d'une capture, écrit comme dans le menu de l'outil : « Suivre › Vue d'ensemble ». */
export function placeDansOutil(ecran: string, lang: Lang): string {
  const [route, requete] = ecran.split('?')
  const menu = MENU_OUTIL[route]?.[lang]
  if (!menu) return ecran
  const onglet = new URLSearchParams(requete ?? '').get('onglet')
  return [...menu, ...(onglet && ONGLETS[onglet] ? [ONGLETS[onglet][lang]] : [])].join(' › ')
}

/** Largeur de la colonne de texte, pour que le navigateur choisisse la bonne taille d'image. */
const TAILLES = '(min-width: 1280px) 760px, (min-width: 1024px) calc(100vw - 22rem), calc(100vw - 2.5rem)'

export function Capture({ nom, legende, lang, compacte = false, prioritaire = false }: { nom: string; legende: string; lang: Lang; compacte?: boolean; prioritaire?: boolean }) {
  const t = libelles(lang)
  const c = captureDe(nom, lang)
  const ecran = c?.ecran ?? ECRAN_DE_CAPTURE[nom] ?? nom
  const alt = texteBrut(legende)

  return (
    <figure className={`docs-capture ${compacte ? 'compacte' : ''}`}>
      {c ? (
        <div className="docs-capture-cadre">
          <Loupe src={adresseCapture(c.fichier)} largeur={c.largeur} hauteur={c.hauteur} alt={alt} libelle={t.agrandir} fermer={t.fermer}>
            <Image src={adresseCapture(c.fichier)} width={c.largeur} height={c.hauteur} alt={alt} sizes={TAILLES} loading={prioritaire ? 'eager' : 'lazy'} />
          </Loupe>
        </div>
      ) : (
        <div className="docs-capture-cadre docs-capture-vide" role="img" aria-label={alt}>
          <span className="docs-capture-vide-barre">
            <span className="docs-points" aria-hidden="true"><i /><i /><i /></span>
            <span className="machine">{placeDansOutil(ecran, lang)}</span>
          </span>
          <span className="docs-capture-vide-corps" aria-hidden="true">
            <span className="titre">GeoTrends</span>
            <span className="machine">{t.captureExemple}</span>
          </span>
        </div>
      )}
      <figcaption className="docs-legende">
        <span className="machine">{placeDansOutil(ecran, lang)}</span>
        <span><Riche texte={legende} lang={lang} /></span>
      </figcaption>
    </figure>
  )
}
