import { actions } from './actions'
import { audit } from './audit'
import { commun } from './commun'
import { concurrents } from './concurrents'
import { connexion } from './connexion'
import { couts } from './couts'
import { exports } from './exports'
import { faits } from './faits'
import { google } from './google'
import { partage } from './partage'
import { pages } from './pages'
import { partages } from './partages'
import { projets } from './projets'
import { question } from './question'
import { questions } from './questions'
import { rapport } from './rapport'
import { reglages } from './reglages'
import { sources } from './sources'
import { videos } from './videos'
import { vue } from './vue'

/*
 * Dictionnaire anglais de l'outil. La clé est le texte français tel qu'il est
 * écrit dans le code ; la valeur est sa traduction. Un fichier par domaine ;
 * le cadre (commun) et les briques partagées (partage) passent en dernier et
 * font foi si une clé est écrite deux fois.
 * En développement, un texte sans traduction s'affiche entre ⟦ ⟧.
 */
export const EN: Record<string, string> = {
  ...actions, ...audit, ...concurrents, ...connexion, ...couts, ...exports, ...faits, ...google, ...pages, ...partages, ...projets,
  ...question, ...questions, ...rapport, ...reglages, ...sources, ...videos, ...vue,
  ...partage, ...commun,
}
