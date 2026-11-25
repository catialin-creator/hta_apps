import type { Session } from './mesures';
import type { MinutesDuJour, Parametres, Plage } from './parametres';

function dansPlage(minutes: MinutesDuJour, plage: Plage): boolean {
  return minutes >= plage.debut && minutes < plage.fin;
}

/**
 * Session à laquelle rattacher une mesure, selon l'heure locale du téléphone
 * et les plages des paramètres. Renvoie null si la mesure est hors des plages.
 * Le jour de la session est celui de l'horodatage (les plages ne passent pas minuit).
 */
export function sessionPour(
  horodatage: number,
  parametres: Pick<Parametres, 'plageMatin' | 'plageSoir'>,
): Session | null {
  const date = new Date(horodatage);
  const minutes = date.getHours() * 60 + date.getMinutes();
  if (dansPlage(minutes, parametres.plageMatin)) return 'matin';
  if (dansPlage(minutes, parametres.plageSoir)) return 'soir';
  return null;
}
