import { BarreHaut } from '@/components/outil/BarreHaut'
import { CommentLire, EnTete, Feuille, Tuile, Vide } from '@/components/outil/Blocs'
import { titreOnglet } from '@/lib/contexte'
import { traducteur } from '@/lib/i18n/serveur'
import { entreGuillemets } from '@/lib/i18n/courante'
import { nombre } from '@/lib/libelles'
import { auditer, type Etat } from '@/lib/audit'
import { projetCourant } from '@/lib/projets'

export const generateMetadata = () => titreOnglet('Audit d’une page')
export const dynamic = 'force-dynamic'

const ETATS: Record<Etat, { libelle: string; signe: string; classe: string }> = {
  bloquant: { libelle: 'Bloquant', signe: '!', classe: 'absent' },
  attention: { libelle: 'À revoir', signe: '◐', classe: 'neutre' },
  ok: { libelle: 'Bon', signe: '●', classe: 'nomme' },
  info: { libelle: 'Pour information', signe: '·', classe: 'sans' },
}
const FAMILLES = ['Accès des robots', 'Lecture de la page', 'Contenu', 'Repères pour les IA'] as const

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ url?: string }> }) {
  const t = await traducteur()
  const [{ url }, projet] = await Promise.all([searchParams, projetCourant()])
  const audit = url ? await auditer(url) : null
  const sites = projet?.proprietes.filter((p) => p.type === 'site').map((p) => p.valeur) ?? []

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Agir') }, { libelle: t('Audit d’une page') }]} />
      <EnTete
        titre={t('Audit d’une page')}
        verdict={!audit ? t('Une IA peut-elle lire cette page, et y trouve-t-elle une réponse ? Donnez une adresse : la lecture est directe et gratuite.') : audit.resume.bloquants > 0 ? t('{n} [n:point bloque|points bloquent] la lecture de cette page par les IA, et {m} [m:autre est|autres sont] à revoir.', { n: audit.resume.bloquants, m: audit.resume.attentions }) : audit.resume.attentions > 0 ? t('Rien ne bloque la lecture de cette page par les IA ; {n} [n:point est|points sont] à revoir.', { n: audit.resume.attentions }) : t('Rien n’empêche les IA de lire cette page.')}
      />

      <form className="ecran flex flex-wrap items-end gap-3 p-4">
        <label className="libelle min-w-0 flex-1">
          {t('Adresse de la page')}
          <input name="url" type="text" required defaultValue={url ?? ''} placeholder={sites[0] ? `https://${sites[0]}/votre-page/` : 'https://exemple.fr/votre-page/'} className="champ mt-1" />
        </label>
        <button type="submit" className="bouton">{t('Auditer la page')}</button>
      </form>

      {url && !audit && <p className="bandeau erreur" role="alert">{t('Cette adresse n’est pas lisible. Saisissez l’adresse complète d’une page publique.')}</p>}

      {audit && (
        <>
          <section className="ecran" aria-label={t('Résumé de l’audit')}>
            <div className="tuiles">
              <Tuile titre={t('Points bloquants')} aide={t('Ce qui empêche une IA de lire ou de reprendre la page : à corriger en premier.')}>{audit.resume.bloquants}</Tuile>
              <Tuile titre={t('Points à revoir')} aide={t('Ce qui n’empêche pas la lecture mais rend la page moins facile à citer.')}>{audit.resume.attentions}</Tuile>
              <Tuile titre={t('Mots sans JavaScript')} aide={t('Nombre de mots dans la page telle que le serveur l’envoie. Les robots des IA n’exécutent pas le JavaScript.')}>{nombre(audit.resume.mots)}</Tuile>
              <Tuile titre={t('Robots d’IA autorisés')} aide={t('Robots des IA que le fichier robots.txt du site laisse passer.')} note={t('sur {n}', { n: audit.robots.length })}>{audit.robots.filter((r) => r.regle === 'autorisé').length}</Tuile>
            </div>
            <p className="second border-t border-[var(--filet)] px-4 py-2.5">
              {t('Page auditée :')} <a href={audit.url} target="_blank" rel="noopener noreferrer nofollow" className="lien break-all">{audit.url}</a>
              {audit.resume.titre && <> · {entreGuillemets(audit.resume.titre.slice(0, 120))}</>}
            </p>
          </section>

          {FAMILLES.map((f) => {
            const lignes = audit.controles.filter((c) => c.famille === f)
            if (lignes.length === 0) return null
            return (
              <Feuille key={f} titre={t(f)} droite={t('{n} [n:contrôle|contrôles]', { n: lignes.length })}>
                <ul>
                  {lignes.map((c, i) => (
                    <li key={c.libelle} className={`grid gap-2 px-4 py-3 md:grid-cols-[15rem_minmax(0,1fr)_auto] md:items-baseline ${i ? 'ligne-t' : ''}`}>
                      <span className="font-semibold">{t(c.libelle)}</span>
                      <span className="text-[var(--encre-douce)]">{c.detail}</span>
                      <span className={`pastille justify-self-start ${ETATS[c.etat].classe}`}><span className="signe" aria-hidden="true">{ETATS[c.etat].signe}</span>{t(ETATS[c.etat].libelle)}</span>
                    </li>
                  ))}
                </ul>
              </Feuille>
            )
          })}

          <Feuille titre={t('Robot par robot')} aide={t('La règle vient du fichier robots.txt du site. La réponse du serveur est testée pour les robots de recherche, en se présentant sous leur nom.')}>
            <div className="defile">
              <table className="tableau">
                <thead>
                  <tr>
                    <th scope="col" className="fixe">{t('Robot')}</th>
                    <th scope="col">{t('À quoi il sert')}</th>
                    <th scope="col">{t('Règle du site')}</th>
                    <th scope="col" className="num">{t('Réponse du serveur')}</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.robots.map((r) => (
                    <tr key={r.robot}>
                      <th scope="row" className="fixe chiffre">{r.robot}</th>
                      <td className="text-[var(--encre-douce)]">{t(r.role)}</td>
                      <td><span className={`pastille ${r.regle === 'autorisé' ? 'nomme' : 'absent'}`}><span className="signe" aria-hidden="true">{r.regle === 'autorisé' ? '●' : '○'}</span>{r.regle === 'autorisé' ? t('Autorisé') : t('Bloqué')}</span></td>
                      <td className="num">{r.reponse === null ? <span className="discret">{t('non testé')}</span> : r.reponse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Feuille>
        </>
      )}
      {!audit && (
        <Vide titre={t('Choisissez une page à auditer')}>
          <p>{t('L’audit lit la page comme le font les robots des IA : accès, texte lisible sans JavaScript, titres, données structurées, date, auteur.')}</p>
        </Vide>
      )}
      <CommentLire>
        <ul>
          <li>{t('L’audit ne dit pas si la page sera citée : il dit si quelque chose l’en empêche.')}</li>
          <li>{t('Lecture directe de la page, sans frais : aucun appel payant.')}</li>
          <li>{t('Le fichier llms.txt est noté pour information : rien ne prouve que les IA s’en servent.')}</li>
        </ul>
      </CommentLire>
    </div>
  )
}
