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
  // 3 : mesures « hors session » (prises hors des plages) : session et rang deviennent
  // facultatifs, mais toujours ensemble. SQLite ne sait pas modifier une contrainte CHECK :
  // la table est recréée et les mesures recopiées.
  `
  CREATE TABLE mesure_nouvelle (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    horodatage  INTEGER NOT NULL,
    systolique  INTEGER NOT NULL CHECK (systolique > 0),
    diastolique INTEGER NOT NULL CHECK (diastolique > 0),
    pouls       INTEGER NOT NULL CHECK (pouls > 0),
    session     TEXT    CHECK (session IS NULL OR session IN ('matin', 'soir')), -- NULL : hors session
    rang        INTEGER CHECK (rang IS NULL OR rang >= 1),
    source      TEXT    NOT NULL CHECK (source IN ('auto', 'manuel')),
    confiance   REAL    CHECK (confiance IS NULL OR (confiance >= 0 AND confiance <= 1)),
    CHECK ((session IS NULL) = (rang IS NULL))
  );
  INSERT INTO mesure_nouvelle
    (id, horodatage, systolique, diastolique, pouls, session, rang, source, confiance)
    SELECT id, horodatage, systolique, diastolique, pouls, session, rang, source, confiance
      FROM mesure;
  DROP TABLE mesure;
  ALTER TABLE mesure_nouvelle RENAME TO mesure;
  CREATE INDEX mesure_horodatage ON mesure (horodatage);
  `,
];

/**
 * Applique, dans une transaction chacune, les migrations pas encore passées.
 * Appelée à l'ouverture, avant que la base soit disponible pour le reste de l'application :
 * aucune autre requête ne peut s'intercaler.
 */
export async function migrer(base: SQLiteDatabase): Promise<void> {
  const ligne = await base.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const versionActuelle = ligne?.user_version ?? 0;

  for (let version = versionActuelle + 1; version <= MIGRATIONS.length; version++) {
    // Pas de withExclusiveTransactionAsync : il ouvre une nouvelle connexion,
    // qui n'aurait pas la clé SQLCipher et ne pourrait pas lire la base.
    await base.withTransactionAsync(async () => {
      await base.execAsync(MIGRATIONS[version - 1]);
      await base.execAsync(`PRAGMA user_version = ${version};`);
    });
  }
}
