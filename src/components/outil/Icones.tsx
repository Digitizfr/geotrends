/*
 * Petites icônes de l'interface, dessinées ici (trait de 1,75, bouts carrés
 * arrondis comme celles du menu). Elles ne dépendent d'aucun fichier extérieur.
 */
type Props = { taille?: number; className?: string }

function Svg({ taille = 16, className = '', children }: Props & { children: React.ReactNode }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

export const IcoChevronBas = (p: Props) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>
export const IcoChevronDroite = (p: Props) => <Svg {...p}><path d="m9 6 6 6-6 6" /></Svg>
export const IcoHautBas = (p: Props) => <Svg {...p}><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></Svg>
export const IcoMenu = (p: Props) => <Svg {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Svg>
export const IcoFermer = (p: Props) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>
export const IcoRecherche = (p: Props) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
export const IcoPlus = (p: Props) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
export const IcoAide = (p: Props) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.8" /><path d="M12 17.2h.01" /></Svg>
export const IcoTelecharger = (p: Props) => <Svg {...p}><path d="M12 4v11" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" /></Svg>
export const IcoFiltres = (p: Props) => <Svg {...p}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></Svg>
export const IcoSortie = (p: Props) => <Svg {...p}><path d="M10 4H5v16h5" /><path d="M15 8l4 4-4 4" /><path d="M19 12H9" /></Svg>
export const IcoReduire = (p: Props) => <Svg {...p}><rect x="3.5" y="4.5" width="17" height="15" /><path d="M9.5 4.5v15" /><path d="m16 10-2 2 2 2" /></Svg>
export const IcoOuvrir = (p: Props) => <Svg {...p}><rect x="3.5" y="4.5" width="17" height="15" /><path d="M9.5 4.5v15" /><path d="m14 10 2 2-2 2" /></Svg>
export const IcoTriHaut = (p: Props) => <Svg {...p}><path d="M12 19V6" /><path d="m6.5 11.5 5.5-5.5 5.5 5.5" /></Svg>
export const IcoTriBas = (p: Props) => <Svg {...p}><path d="M12 5v13" /><path d="m6.5 12.5 5.5 5.5 5.5-5.5" /></Svg>
export const IcoCalendrier = (p: Props) => <Svg {...p}><rect x="4" y="5.5" width="16" height="14.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></Svg>
export const IcoOeil = (p: Props) => <Svg {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.6" /></Svg>
export const IcoExterne = (p: Props) => <Svg {...p}><path d="M14 5h5v5" /><path d="M19 5 10.5 13.5" /><path d="M18 14v5H5V6h5" /></Svg>
export const IcoCoche = (p: Props) => <Svg {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>
export const IcoFleche = (p: Props) => <Svg {...p}><path d="M5 12h14" /><path d="m13.5 6.5 5.5 5.5-5.5 5.5" /></Svg>
export const IcoLangue = (p: Props) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.6 2.5 3.8 5.5 3.8 9S14.6 18.5 12 21c-2.6-2.5-3.8-5.500-3.800-9S9.400 5.500 12 3Z" /></Svg>
