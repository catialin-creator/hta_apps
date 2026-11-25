import { obtenirBase } from './connexion';

/** Heure de la journée, en minutes depuis minuit (ex. 7 h 30 → 450). */
export type MinutesDuJour = number;

/** Plage horaire d'une session : `debut` inclus, `fin` exclue. */
export interface Plage {
  debut: MinutesDuJour;
  fin: MinutesDuJour;
}

export interface Parametres {
  plageMatin: Plage;
  plageSoir: Plage;
  /** Délai entre deux mesures d'une même session, en minutes. */
  delaiMinutes: number;
  mesuresParSession: number;
  rappelsActives: boolean;
  heureRappelMatin: MinutesDuJour;
  heureRappelSoir: MinutesDuJour;
}

const heure = (h: number, m = 0): MinutesDuJour => h * 60 + m;

/** Valeurs par défaut (spec « parametres »). */
export const PARAMETRES_PAR_DEFAUT: Readonly<Parametres> = Object.freeze({
  plageMatin: { debut: heure(6), fin: heure(10) },
  plageSoir: { debut: heure(18), fin: heure(22) },
  delaiMinutes: 5,
  mesuresParSession: 3,
  rappelsActives: true,
  heureRappelMatin: heure(7, 30),
  heureRappelSoir: heure(20, 30),
});

type Cle = keyof Parametres;

function estCle(cle: string): cle is Cle {
  return Object.prototype.hasOwnProperty.call(PARAMETRES_PAR_DEFAUT, cle);
}

/** Lit les paramètres : valeurs enregistrées, complétées par les valeurs par défaut. */
export async function lireParametres(): Promise<Parametres> {
  const base = await obtenirBase();
  const lignes = await base.getAllAsync<{ cle: string; valeur: string }>(
    'SELECT cle, valeur FROM parametre;',
  );
  const parametres: Parametres = JSON.parse(JSON.stringify(PARAMETRES_PAR_DEFAUT));
  for (const { cle, valeur } of lignes) {
    if (estCle(cle)) {
      // Une clé inconnue (ancienne version) est ignorée.
      (parametres as unknown as Record<Cle, unknown>)[cle] = JSON.parse(valeur);
    }
  }
  return parametres;
}

/** Enregistre les paramètres modifiés, en une seule transaction. */
export async function enregistrerParametres(modifications: Partial<Parametres>): Promise<void> {
  const base = await obtenirBase();
  await base.withExclusiveTransactionAsync(async (transaction) => {
    for (const [cle, valeur] of Object.entries(modifications)) {
      if (!estCle(cle) || valeur === undefined) {
        continue;
      }
      await transaction.runAsync(
        `INSERT INTO parametre (cle, valeur) VALUES (?, ?)
         ON CONFLICT (cle) DO UPDATE SET valeur = excluded.valeur;`,
        cle,
        JSON.stringify(valeur),
      );
    }
  });
}
