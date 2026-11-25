import Link from 'next/link'
import { BarreHaut } from '@/components/outil/BarreHaut'
import { CommentLire, EnTete, Feuille, Tampon } from '@/components/outil/Blocs'
import { BoutonEnvoi } from '@/components/outil/BoutonEnvoi'
import { Initiale } from '@/components/outil/Initiale'
import { PRIX_ANALYSE_USD } from '@/lib/analyse'
import { clePresente, fournisseurAnalyse } from '@/lib/cles'
import { titreOnglet } from '@/lib/contexte'
import { derniersAppelsReussis, lirePlafond, lireSeuilConfirmation } from '@/lib/couts'
import { prixParQuestion } from '@/lib/estimation'
import { LANGUES, NOMS_LANGUES } from '@/lib/i18n/langues'
import { traducteur } from '@/lib/i18n/serveur'
import { dateHeure, jourLong, langueEtPays, maintenant, pluriel, usd } from '@/lib/libelles'
import { etatDesComptes } from '@/lib/invitations'
import { listerProjets } from '@/lib/projets'
import { estAdmin, exigerSession } from '@/lib/session'
import { EXPEDITEUR } from '@/lib/courriel'
import { resoudreLien } from '@/site/docs/registre'
import { choisirLangue } from '../_actions/interface'
import { reglerAuto } from '../projets/actions'
import { reglerSeuil } from './actions'
import { Comptes, MotDePasse } from './Comptes'

export const generateMetadata = () => titreOnglet('Réglages')
export const dynamic = 'force-dynamic'

const JOUR = 86_400_000

export default async function Reglages() {
  const session = await exigerSession()
  const t = await traducteur()
  const admin = estAdmin(session)
  const [projets, prix, plafond, seuil, appels, comptes] = await Promise.all([
    listerProjets(), prixParQuestion(), lirePlafond(), lireSeuilConfirmation(), derniersAppelsReussis(),
    admin ? etatDesComptes() : Promise.resolve([]),
  ])
  const cout = (p: (typeof projets)[number]) => ({
    interface: p._count.questions * 4 * (prix.chatgpt + PRIX_ANALYSE_USD) * 4.33,
    claude: p._count.questions * (prix.claude + PRIX_ANALYSE_USD) * 2.17,
  })
  const instant = maintenant()
  const total = projets.reduce((n, p) => n + (p.releveAuto ? cout(p).interface : 0) + (p.claudeAuto ? cout(p).claude : 0), 0)
  const automatiques = projets.filter((p) => p.releveAuto || p.claudeAuto).length
  const prochain = (dernier: Date | null, jours: number) => (!dernier || dernier.getTime() + jours * JOUR <= instant ? t('dans la demi-heure') : t('le {date}', { date: jourLong(new Date(dernier.getTime() + jours * JOUR)) }))
  // Les clés vivent dans le fichier .env de l'installation : l'écran dit seulement si elles sont en place.
  const lecteur = fournisseurAnalyse()
  const petitModele = t('Petit modèle : lecture des réponses, étiquettes des questions, types de sites, faits vérifiés')
  const connexions = [
    { nom: 'DataForSEO', role: t('Relevés d’interface : ChatGPT, Gemini, Mode IA et Aperçus IA de Google'), variables: 'DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD', presente: clePresente('dataforseo'), dernier: appels.get('dataforseo'), payant: true, besoin: t('indispensable') },
    { nom: 'DeepSeek', role: petitModele, variables: 'DEEPSEEK_API_KEY', presente: clePresente('deepseek'), dernier: appels.get('deepseek'), payant: true, besoin: lecteur === 'deepseek' ? t('conseillée') : t('facultative') },
    { nom: 'Anthropic', role: lecteur === 'anthropic' ? `${t('Relevés de Claude par son API')} · ${petitModele}` : t('Relevés de Claude par son API'), variables: 'ANTHROPIC_API_KEY', presente: clePresente('anthropic'), dernier: appels.get('anthropic'), payant: true, besoin: lecteur === 'anthropic' ? t('conseillée') : t('facultative') },
    { nom: 'YouTube', role: t('Fiche des vidéos citées et reconnaissance des chaînes (gratuit)'), variables: 'YOUTUBE_API_KEY', presente: clePresente('youtube'), dernier: undefined, payant: false, besoin: t('facultative') },
    { nom: 'Resend', role: t('Envoi du rapport du lundi par e-mail (gratuit), à activer sur l’écran Rapport'), variables: 'RESEND_API_KEY, RAPPORT_EXPEDITEUR', presente: clePresente('resend') && !!EXPEDITEUR, dernier: undefined, payant: false, besoin: t('facultative') },
  ]
  const guideCles = resoudreLien(`demarrer/installer#${t.langue === 'fr' ? 'cles' : 'keys'}`, t.langue) ?? '/documentation'

  return (
    <div className="space-y-6">
      <BarreHaut fil={[{ libelle: t('Régler') }, { libelle: t('Réglages') }]} />
      <EnTete
        titre={t('Réglages')}
        verdict={<>
          {t('Interface en {langue}.', { langue: t.langue === 'fr' ? 'français' : 'English' })}{' '}
          {automatiques === 0 ? t('Aucun relevé automatique.') : t('{n} [n:projet relevé|projets relevés] automatiquement, pour environ {total} par mois.', { n: automatiques, total: usd(total) })}{' '}
          {t('Confirmation demandée au-dessus de {seuil}.', { seuil: usd(seuil) })}
        </>}
      />

      <div className="grid items-start gap-6 xl:grid-cols-2">
        {/* ── Langue de l'interface ─────────────────────────────────────────── */}
        <Feuille
          id="langue"
          titre={t('Langue de l’interface')}
          aide={t('Le choix est propre à votre compte et retenu d’une session à l’autre. Il ne change pas la langue des questions d’un projet, et le texte des réponses des IA n’est jamais traduit.')}
          droite={t('propre à votre compte')}
        >
          <form action={choisirLangue} className="p-4">
            <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label={t('Langue de l’interface')}>
              {LANGUES.map((l) => (
                <button key={l} type="submit" name="langue" value={l} aria-pressed={l === t.langue} className="choix-langue" lang={l}>
                  <span className="initiale g" aria-hidden="true">{l.toUpperCase()}</span>
                  <span className="min-w-0 text-left">
                    <span className="block font-semibold">{NOMS_LANGUES[l]}</span>
                    <span className="second block">{l === t.langue ? t('Langue affichée') : l === 'fr' ? 'Passer l’interface en français' : 'Switch the interface to English'}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="second mt-3">{t('S’applique tout de suite à tous les écrans, aux dates, aux montants et aux exports.')}</p>
          </form>
        </Feuille>

        {/* ── Confirmation avant un envoi ───────────────────────────────────── */}
        <Feuille titre={t('Confirmation avant un envoi')} aide={t('Le prix d’un relevé est toujours écrit sur son bouton. Au-dessus de ce montant, une fenêtre demande en plus de confirmer.')} droite={t('seuil actuel : {seuil}', { seuil: usd(seuil) })}>
          <form action={reglerSeuil} className="flex flex-wrap items-end gap-3 p-4">
            <label className="libelle">
              {t('Demander une confirmation au-dessus de (en dollars)')}
              <input name="seuil" type="number" min="0" max="1000" step="0.1" defaultValue={seuil} className="champ chiffre mt-1 !w-32" />
            </label>
            <BoutonEnvoi className="bouton bouton-creux">{t('Enregistrer')}</BoutonEnvoi>
          </form>
        </Feuille>
      </div>

      {/* ── Rythme des relevés ──────────────────────────────────────────────── */}
      <Feuille
        titre={t('Rythme des relevés')}
        aide={t('Chaque semaine pour les IA relevées par l’interface, toutes les deux semaines pour Claude. Rien n’est activé par défaut : c’est vous qui décidez, projet par projet. Les relevés automatiques se suspendent d’eux-mêmes quand le plafond du mois est atteint.')}
        droite={t('estimé : {total} par mois · plafond {plafond}', { total: usd(total), plafond: usd(plafond) })}
      >
        {projets.length === 0 ? (
          <p className="second p-4">{t('Aucun projet pour l’instant.')} <Link href="/projets/nouveau" className="lien">{t('Créer un projet')}</Link></p>
        ) : (
          <ul>
            {projets.map((p, i) => {
              const c = cout(p)
              return (
                <li key={p.id} className={i ? 'border-t border-[var(--encre)]' : ''}>
                  <form action={reglerAuto} className="grid gap-x-6 gap-y-3 px-4 py-3 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
                    <input type="hidden" name="projetId" value={p.id} />
                    <div className="flex items-center gap-2.5">
                      <Initiale nom={p.nom} nous />
                      <span className="min-w-0">
                        <Link href={`/projets/${p.id}`} className="font-bold hover:underline">{p.nom}</Link>
                        <span className="second block">{langueEtPays(p.langue, p.pays)} · {pluriel(p._count.questions, 'question')}</span>
                      </span>
                    </div>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" name="releveAuto" defaultChecked={p.releveAuto} className="mt-1" />
                      <span>
                        <span className="font-semibold">{t('Chaque semaine')}</span> <Tampon methode="interface" />
                        <span className="second block">{t('4 IA · environ {prix} par mois', { prix: usd(c.interface) })}{p.releveAuto ? ` · ${t('prochain envoi {quand}', { quand: prochain(p.dernierAutoInterface, 7) })}` : ''}</span>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 lg:border-l-[3px] lg:border-double lg:border-[var(--encre)] lg:pl-4">
                      <input type="checkbox" name="claudeAuto" defaultChecked={p.claudeAuto} className="mt-1" />
                      <span>
                        <span className="font-semibold">{t('Toutes les deux semaines')}</span> <Tampon methode="api" />
                        <span className="second block">{t('Claude · environ {prix} par mois', { prix: usd(c.claude) })}{p.claudeAuto ? ` · ${t('prochain envoi {quand}', { quand: prochain(p.dernierAutoClaude, 14) })}` : ''}</span>
                      </span>
                    </label>
                    <BoutonEnvoi className="bouton bouton-creux bouton-petit justify-self-start">{t('Enregistrer')}</BoutonEnvoi>
                  </form>
                </li>
              )
            })}
          </ul>
        )}
        <p className="second border-t border-[var(--filet)] px-4 py-2.5">
          {total === 0 ? t('Aucun relevé automatique pour l’instant.') : t('Total estimé : {total} par mois, pour un plafond de {plafond}.', { total: usd(total), plafond: usd(plafond) })}{' '}
          {admin && <Link href="/admin/couts" className="lien">{t('Changer le plafond')}</Link>}
        </p>
      </Feuille>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Feuille
          id="cles"
          titre={t('Clés des fournisseurs')}
          droite={t('les clés ne sont jamais affichées')}
          aide={t('L’outil appelle les fournisseurs avec vos propres clés. Elles s’écrivent dans le fichier .env de l’installation, jamais dans cet écran : après un changement, redémarrez l’outil. Seule celle de DataForSEO est indispensable.')}
        >
          <ul>
            {connexions.map((c, i) => (
              <li key={c.nom} className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-4 py-3 ${i ? 'ligne-t' : ''}`}>
                <Initiale nom={c.nom} />
                <span>
                  <span className="font-semibold">{c.nom}</span> <span className="second">· {c.besoin}</span>
                  <span className="second block">{c.role}</span>
                  <span className="second discret block">{c.payant ? (c.dernier ? t('Dernier appel réussi : {date}', { date: dateHeure(c.dernier) }) : t('Aucun appel réussi enregistré')) : t('Appels gratuits, non inscrits au journal des coûts')}</span>
                  {!c.presente && <span className="indice-cle second discret block">{t('Dans le fichier .env :')} <code className="chiffre">{c.variables}</code></span>}
                </span>
                <span className={`pastille ${c.presente ? 'nomme' : 'absent'}`}><span className="signe" aria-hidden="true">{c.presente ? '●' : '○'}</span>{c.presente ? t('Clé en place') : t('Clé absente')}</span>
              </li>
            ))}
          </ul>
          <p className="second border-t border-[var(--filet)] px-4 py-2.5">
            <Link href={guideCles} className="lien">{t('Où trouver chaque clé, ce qu’elle coûte et comment l’ajouter')}</Link>
          </p>
        </Feuille>

        <Feuille id="mot-de-passe" titre={t('Mon mot de passe')} aide={t('Pour changer le mot de passe de votre compte. En cas d’oubli, demandez un nouveau lien à l’administrateur.')} droite={t('propre à votre compte')}>
          <MotDePasse />
        </Feuille>
      </div>

      {admin && (
        <Feuille
          id="comptes"
          titre={t('Comptes')}
          aide={t('Personne ne s’inscrit seul : vous invitez chaque personne. Elle reçoit un lien personnel, valable sept jours, pour choisir son mot de passe. Le même bouton sert quand quelqu’un a oublié le sien.')}
          droite={`${pluriel(comptes.length, 'compte')} · ${t('inscription fermée')}`}
        >
          <Comptes
            moi={session.user.id}
            comptes={comptes.map((c) => ({
              id: c.id, name: c.name, email: c.email, role: c.role, motDePasse: c.motDePasse,
              lienJusquau: c.lienJusquau?.toISOString() ?? null, derniereConnexion: c.derniereConnexion?.toISOString() ?? null,
            }))}
          />
        </Feuille>
      )}

      <CommentLire titre={t('Où sont les autres réglages')}>
        <p>{t('Ce qui vaut pour tout l’outil se règle ici. Les réglages propres à un écran se font sur cet écran : le classement des sites sur Sources, les étiquettes sur Questions, les faits vérifiés et le rapport par e-mail sur leurs écrans.')}</p>
      </CommentLire>
    </div>
  )
}
