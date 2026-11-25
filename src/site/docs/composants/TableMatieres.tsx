'use client'

import { useEffect, useState } from 'react'

/**
 * « Sur cette page » : les titres de la page, avec celui que l'on lit marqué
 * d'un trait. Sans JavaScript, la liste reste une simple liste de liens.
 */
export function TableMatieres({ titres, libelle }: { titres: { niveau: 2 | 3; id: string; texte: string }[]; libelle: string }) {
  const [actif, setActif] = useState<string | null>(null)

  useEffect(() => {
    const cibles = titres.map((x) => document.getElementById(x.id)).filter((x): x is HTMLElement => !!x)
    if (cibles.length === 0) return
    const visibles = new Map<string, boolean>()
    const veille = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) visibles.set(e.target.id, e.isIntersecting)
        // Le premier titre visible ; à défaut, le dernier titre passé au-dessus de l'écran.
        const premier = cibles.find((c) => visibles.get(c.id))
        if (premier) return setActif(premier.id)
        const passes = cibles.filter((c) => c.getBoundingClientRect().top < 0)
        if (passes.length) setActif(passes[passes.length - 1].id)
      },
      { rootMargin: '0px 0px -65% 0px' },
    )
    cibles.forEach((c) => veille.observe(c))
    return () => veille.disconnect()
  }, [titres])

  if (titres.length === 0) return null
  return (
    <nav className="docs-toc-nav" aria-label={libelle}>
      <p className="machine docs-toc-titre">{libelle}</p>
      <ul>
        {titres.map((x) => (
          <li key={x.id} className={x.niveau === 3 ? 'niveau-3' : ''}>
            <a href={`#${x.id}`} aria-current={actif === x.id ? 'location' : undefined}>{x.texte}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
