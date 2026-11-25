import { analyserEnAttente } from './analyse'
import { envoyerRapportsDus } from './courriel'
import { budgetDisponible } from './couts'
import type { Moteur } from './fournisseurs/types'
import { prisma } from './prisma'
import { collecterReleves, lancerReleves } from './releves'
import { classementAuto, classerSites, sitesAClasser } from './sites'

/*
 * Tâches de fond, lancées toutes les demi-heures (`npm run taches`, que le
 * service « taches » de docker-compose.yml répète tout seul) :
 *  1. lire les réponses prêtes des relevés en attente (gratuit) ;
 *  2. lancer les relevés automatiques des projets qui les ont activés :
 *     chaque semaine pour les IA relevées par l'interface, toutes les deux
 *     semaines pour Claude ;
 *  3. faire lire par le petit modèle les réponses récentes ;
 *  4. classer les nouveaux sites cités, pour les projets où l'utilisateur a
 *     lancé le classement au moins une fois (et ne l'a pas coupé depuis).
 *  5. envoyer le rapport du lundi aux projets qui l'ont demandé (gratuit).
 * Aucun appel payant ne part si le plafond mensuel est atteint.
 */

const JOUR = 86_400_000
const INTERFACES: Moteur[] = ['chatgpt', 'gemini', 'google_ai_mode', 'google_ai_overview']
// Une heure de marge : un relevé hebdomadaire ne glisse pas d'une demi-heure chaque semaine.
const du = (dernier: Date | null, jours: number) => !dernier || Date.now() - dernier.getTime() >= jours * JOUR - 3_600_000

export async function executerTaches() {
  const journal: string[] = []
  const c = await collecterReleves()
  if (c.recus + c.vides + c.echecs + c.enAttente > 0) journal.push(`Collecte : ${c.recus} reçues, ${c.vides} sans réponse d'IA, ${c.echecs} en échec, ${c.enAttente} encore en attente.`)

  const projets = await prisma.projet.findMany({
    where: { archive: false, OR: [{ releveAuto: true }, { claudeAuto: true }] },
    include: { questions: { where: { archive: false }, select: { id: true } } },
  })
  for (const p of projets) {
    const ids = p.questions.map((q) => q.id)
    if (ids.length === 0) continue
    if (p.releveAuto && du(p.dernierAutoInterface, 7)) {
      if (!(await budgetDisponible())) {
        journal.push(`${p.nom} : plafond mensuel atteint, relevé hebdomadaire suspendu.`)
        continue
      }
      const b = await lancerReleves(ids, INTERFACES)
      await prisma.projet.update({ where: { id: p.id }, data: { dernierAutoInterface: new Date() } })
      journal.push(`${p.nom} : relevé hebdomadaire envoyé (${b.lances} envois, ${b.coutUsd.toFixed(4)} $).`)
    }
    if (p.claudeAuto && du(p.dernierAutoClaude, 14)) {
      if (!(await budgetDisponible())) {
        journal.push(`${p.nom} : plafond mensuel atteint, relevé de Claude suspendu.`)
        continue
      }
      // On note la date avant l'appel : Claude met plusieurs minutes, la tâche suivante ne doit pas le relancer.
      await prisma.projet.update({ where: { id: p.id }, data: { dernierAutoClaude: new Date() } })
      const b = await lancerReleves(ids, ['claude'])
      journal.push(`${p.nom} : relevé de Claude fait (${b.lances} réponses, ${b.coutUsd.toFixed(4)} $).`)
    }
  }

  // Lecture automatique : seulement les réponses arrivées après la mise en
  // service de cette tâche (et de moins de trois jours). Les réponses plus
  // anciennes ne se lisent qu'à la demande, depuis la page Visibilité : aucune
  // dépense ne part sur l'existant sans un clic.
  const CLE = 'analyse_auto_depuis'
  const repere = await prisma.reglage.findUnique({ where: { cle: CLE } })
  if (!repere) await prisma.reglage.create({ data: { cle: CLE, valeur: new Date().toISOString() } })
  else if (await budgetDisponible()) {
    const depuis = new Date(Math.max(new Date(repere.valeur).getTime(), Date.now() - 3 * JOUR))
    const a = await analyserEnAttente(undefined, depuis)
    if (a.lues + a.echecs > 0) journal.push(`Lecture automatique : ${a.lues} réponses lues, ${a.echecs} en échec, ${a.coutUsd.toFixed(4)} $.`)
  }

  // Types des nouveaux sites : seulement pour les projets où le classement a
  // déjà été lancé à la main (le premier clic vaut accord pour la suite).
  for (const p of await prisma.projet.findMany({ where: { archive: false }, select: { id: true, nom: true } })) {
    if (!(await classementAuto(p.id)) || (await sitesAClasser(p.id)).length === 0) continue
    if (!(await budgetDisponible())) {
      journal.push(`${p.nom} : plafond mensuel atteint, classement des nouveaux sites suspendu.`)
      continue
    }
    const b = await classerSites(p.id)
    journal.push(`${p.nom} : ${b.classes} nouveaux sites classés, ${b.echecs} en échec, ${b.coutUsd.toFixed(4)} $.`)
  }

  // Rapport du lundi, pour les projets où l'envoi est activé. Une panne d'envoi ne bloque pas le reste.
  journal.push(...(await envoyerRapportsDus().catch((e) => [`Rapport par e-mail en échec : ${e instanceof Error ? e.message : String(e)}`])))
  return journal
}
