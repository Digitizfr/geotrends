'use client'

import { createContext, useContext, useMemo } from 'react'
import { formats, type Formats } from './formats'
import { LANGUE_DEFAUT, type Langue } from './langues'
import { creerTraducteur, type Traducteur } from './traduire'

const Contexte = createContext<Langue>(LANGUE_DEFAUT)

/** Donne la langue de l'interface à tous les composants client d'un écran. */
export function FournisseurLangue({ langue, children }: { langue: Langue; children: React.ReactNode }) {
  return <Contexte.Provider value={langue}>{children}</Contexte.Provider>
}

/** Dans un composant client : `const { t, f } = useT()`. */
export function useT(): { t: Traducteur; f: Formats; langue: Langue } {
  const langue = useContext(Contexte)
  return useMemo(() => ({ t: creerTraducteur(langue), f: formats(langue), langue }), [langue])
}
