import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Migrations du schéma, dans l'ordre. La version courante de la base est gardée
 * dans `PRAGMA user_version` : la migration n° i (à partir de 1) porte la base
 * de la version i - 1 à la version i.
 *
 * Règle : ne jamais modifier une migration déjà livrée, toujours en ajouter une.
 */
const MIGRATIONS: readonly string[] = [
  // 1 : table Mesure (docs/PRD.md, spec « stockage »)
  `
  CREATE TABLE mesure (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    horodatage  INTEGER NOT NULL,                               -- millisecondes depuis 1970 (UTC)
    systolique  INTEGER NOT NULL CHECK (systolique > 0),        -- mmHg
    diastolique INTEGER NOT NULL CHECK (diastolique > 0),       -- mmHg
    pouls       INTEGER NOT NULL CHECK (pouls > 0),             -- battements par minute
    session     TEXT    NOT NULL CHECK (session IN ('matin', 'soir')),
    rang        INTEGER NOT NULL CHECK (rang >= 1),             -- 1re, 2e, 3e mesure de la session
    source      TEXT    NOT NULL CHECK (source IN ('auto', 'manuel')),
    confiance   REAL    CHECK (confiance IS NULL OR (confiance >= 0 AND confiance <= 1))
  );
  CREATE INDEX mesure_horodatage ON mesure (horodatage);
  `,
  // 2 : paramètres modifiés par l'utilisateur (spec « parametres »).
  // Seules les valeurs changées sont stockées ; les autres prennent leur valeur par défaut.
  `
  CREATE TABLE parametre (
    cle    TEXT PRIMARY KEY,
    valeur TEXT NOT NULL                                        -- valeur encodée en JSON
  );
  `,
];

/** Applique, dans une transaction chacune, les migrations pas encore passées. */
export async function migrer(base: SQLiteDatabase): Promise<void> {
  const ligne = await base.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const versionActuelle = ligne?.user_version ?? 0;

  for (let version = versionActuelle + 1; version <= MIGRATIONS.length; version++) {
    await base.withExclusiveTransactionAsync(async (transaction) => {
      await transaction.execAsync(MIGRATIONS[version - 1]);
      await transaction.execAsync(`PRAGMA user_version = ${version};`);
    });
  }
}
