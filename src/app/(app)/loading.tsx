/**
 * Chargement : la silhouette de l'écran (barre du haut, titre, chiffres clés,
 * graphique, tableau), pas un écran vide. Sans texte : rien à traduire.
 */
export default function Chargement() {
  return (
    <div className="chargement space-y-6" role="status" aria-busy="true">
      <div className="barre-haut">
        <div className="barre-ligne">
          <div className="silhouette-bloc h-4 w-44" />
          <div className="silhouette-bloc ml-auto hidden h-7 w-[28rem] max-w-[50%] min-[900px]:block" />
          <div className="silhouette-bloc h-7 w-24" />
        </div>
      </div>
      <div>
        <div className="silhouette-bloc h-9 w-2/3 max-w-xl" />
        <div className="silhouette-bloc mt-3 h-4 w-1/2 max-w-md" />
        <div className="regle mt-4" aria-hidden="true" />
      </div>
      <div className="silhouette-feuille grid grid-cols-2 min-[900px]:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="border-r border-[var(--filet)] p-4 last:border-r-0">
            <div className="silhouette-bloc h-3 w-20" />
            <div className="silhouette-bloc mt-3 h-7 w-16" />
            <div className="silhouette-bloc mt-3 h-3 w-28 max-w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="silhouette-feuille p-4">
          <div className="silhouette-bloc h-4 w-56" />
          <div className="squelette mt-4 h-72" />
        </div>
        <div className="silhouette-feuille space-y-3 p-4">
          <div className="silhouette-bloc h-4 w-40" />
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="silhouette-bloc h-6" style={{ width: `${92 - i * 11}%` }} />)}
        </div>
      </div>
      <div className="silhouette-feuille p-4">
        <div className="silhouette-bloc h-4 w-48" />
        <div className="squelette mt-4 h-52" />
      </div>
      <span className="invisible-lecteur">…</span>
    </div>
  )
}
