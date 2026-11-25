import * as Notifications from 'expo-notifications';

import type { MinutesDuJour, Parametres } from '../db/parametres';
import { CANAL_RAPPELS, demanderAutorisationNotifications } from './notifications';

const ID_RAPPEL_MATIN = 'rappel-matin';
const ID_RAPPEL_SOIR = 'rappel-soir';

export type ResultatRappels = 'programmes' | 'desactives' | 'non-autorises';

async function programmer(identifiant: string, titre: string, heure: MinutesDuJour): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    identifier: identifiant,
    content: {
      title: titre,
      body: "C'est l'heure de prendre votre tension.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: Math.floor(heure / 60),
      minute: heure % 60,
      channelId: CANAL_RAPPELS,
    },
  });
}

/**
 * Met les rappels quotidiens en accord avec les paramètres : les anciens sont toujours
 * annulés, puis les rappels du matin et du soir sont reprogrammés s'ils sont activés
 * et autorisés. À appeler au lancement et après chaque enregistrement des paramètres.
 */
export async function mettreAJourRappels(
  parametres: Pick<Parametres, 'rappelsActives' | 'heureRappelMatin' | 'heureRappelSoir'>,
): Promise<ResultatRappels> {
  await Promise.all([
    Notifications.cancelScheduledNotificationAsync(ID_RAPPEL_MATIN),
    Notifications.cancelScheduledNotificationAsync(ID_RAPPEL_SOIR),
  ]);

  if (!parametres.rappelsActives) return 'desactives';
  if (!(await demanderAutorisationNotifications())) return 'non-autorises';

  await programmer(ID_RAPPEL_MATIN, 'Mesure du matin', parametres.heureRappelMatin);
  await programmer(ID_RAPPEL_SOIR, 'Mesure du soir', parametres.heureRappelSoir);
  return 'programmes';
}
