/** Couleurs et tailles communes : gros caractères et contrastes forts (CLAUDE.md). */
export const couleurs = {
  fond: '#FFFFFF',
  texte: '#111111',
  texteSecondaire: '#3A3A3A',
  bordure: '#6B6B6B',
  principal: '#0B4F9C', // bleu foncé : contraste > 7:1 sur blanc
  surPrincipal: '#FFFFFF',
  desactive: '#9E9E9E',
  succes: '#1B5E20',
  erreur: '#B00020',
} as const;

export const tailles = {
  titre: 32,
  texte: 24,
  valeur: 30,
  /** Hauteur minimale d'une zone tactile. */
  zoneTactile: 64,
  marge: 20,
} as const;
