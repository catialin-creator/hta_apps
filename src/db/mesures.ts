import { obtenirBase } from './connexion';

export type Session = 'matin' | 'soir';
export type Source = 'auto' | 'manuel';

/** Une mesure telle qu'enregistrée dans la base (spec « stockage »). */
export interface Mesure {
  id: number;
  /** Millisecondes depuis 1970 (UTC). */
  horodatage: number;
  systolique: number;
  diastolique: number;
  pouls: number;
  /** null : mesure « hors session », prise en dehors des plages horaires. */
  session: Session | null;
  /** Position de la mesure dans la session : 1, 2, 3… ; null hors session. */
  rang: number | null;
  source: Source;
  /** Indice de confiance de la lecture caméra, entre 0 et 1 ; null pour une saisie manuelle. */
  confiance: number | null;
}

export type NouvelleMesure = Omit<Mesure, 'id'>;

/** Valeurs qu'une correction peut modifier. */
export type Correction = Partial<Pick<Mesure, 'systolique' | 'diastolique' | 'pouls'>>;

/** Enregistre une mesure validée et renvoie son identifiant. */
export async function ajouterMesure(mesure: NouvelleMesure): Promise<number> {
  const base = await obtenirBase();
  const resultat = await base.runAsync(
    `INSERT INTO mesure
       (horodatage, systolique, diastolique, pouls, session, rang, source, confiance)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    mesure.horodatage,
    mesure.systolique,
    mesure.diastolique,
    mesure.pouls,
    mesure.session,
    mesure.rang,
    mesure.source,
    mesure.confiance,
  );
  return resultat.lastInsertRowId;
}

/**
 * Corrige une ou plusieurs valeurs d'une mesure. Sa source passe à « manuel ».
 * Renvoie false si la mesure n'existe pas.
 */
export async function corrigerMesure(id: number, correction: Correction): Promise<boolean> {
  const base = await obtenirBase();
  const resultat = await base.runAsync(
    `UPDATE mesure SET
       systolique  = COALESCE(?, systolique),
       diastolique = COALESCE(?, diastolique),
       pouls       = COALESCE(?, pouls),
       source      = 'manuel'
     WHERE id = ?;`,
    correction.systolique ?? null,
    correction.diastolique ?? null,
    correction.pouls ?? null,
    id,
  );
  return resultat.changes > 0;
}

/**
 * Supprime définitivement une mesure. La demande de confirmation est faite par l'écran
 * avant l'appel. Renvoie false si la mesure n'existe pas.
 */
export async function supprimerMesure(id: number): Promise<boolean> {
  const base = await obtenirBase();
  const resultat = await base.runAsync('DELETE FROM mesure WHERE id = ?;', id);
  return resultat.changes > 0;
}

/**
 * Liste les mesures prises entre `debut` (inclus) et `fin` (exclu), en millisecondes,
 * de la plus ancienne à la plus récente.
 */
export async function listerMesures(debut: number, fin: number): Promise<Mesure[]> {
  const base = await obtenirBase();
  return base.getAllAsync<Mesure>(
    `SELECT id, horodatage, systolique, diastolique, pouls, session, rang, source, confiance
       FROM mesure
      WHERE horodatage >= ? AND horodatage < ?
      ORDER BY horodatage ASC;`,
    debut,
    fin,
  );
}
