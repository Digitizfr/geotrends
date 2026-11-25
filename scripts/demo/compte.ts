// Compte de démonstration, créé par semer.ts dans la base geotrends_demo seulement.
// Ce mot de passe est volontairement public et sans valeur : il n'ouvre que la
// base de démonstration locale, remplie de données fictives. Il n'existe pas en ligne.
export const COMPTE_DEMO = {
  email: 'demo@geotrends.exemple',
  nom: 'Demo Admin',
  motDePasse: 'demo-facturo-2026',
}

// Second compte, membre (sans accès aux coûts), pour que la liste des comptes ne soit pas vide.
export const COMPTE_MEMBRE = {
  email: 'equipe@geotrends.exemple',
  nom: 'Demo Team',
  motDePasse: 'demo-equipe-2026',
}

// Troisième personne, invitée mais pas encore entrée : montre l'invitation en cours
// dans Réglages › Comptes et la page où l'on choisit son mot de passe. Jeton fixe,
// sans valeur hors de la base de démonstration locale.
export const INVITATION_DEMO = {
  email: 'invite@geotrends.exemple',
  nom: 'Camille Demo',
  jeton: 'demo-invitation-facturo-2026',
}

// Pages de partage de démonstration (une par langue), à jeton fixe : la capture
// « partage-page » montre ce que voit un client. Sans valeur hors de la base locale.
export const PARTAGES_DEMO = {
  fr: 'demo-partage-facturo-2026',
  en: 'demo-share-facturo-uk-2026',
}
