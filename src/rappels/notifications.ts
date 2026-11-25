import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/** Canal Android des rappels quotidiens. */
export const CANAL_RAPPELS = 'rappels';

/** Affiche les rappels même quand l'application est ouverte. */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function creerCanalAndroid(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL_RAPPELS, {
    name: 'Rappels de mesure',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

/**
 * Demande l'autorisation d'afficher des notifications, si elle n'a pas déjà été donnée.
 * Sur Android, le canal doit exister avant la demande (Android 13 et plus).
 * Renvoie true si les notifications sont autorisées. Aucun envoi réseau :
 * les rappels sont des notifications locales.
 */
export async function demanderAutorisationNotifications(): Promise<boolean> {
  await creerCanalAndroid();
  const actuelle = await Notifications.getPermissionsAsync();
  if (actuelle.granted) return true;
  if (!actuelle.canAskAgain) return false;
  const reponse = await Notifications.requestPermissionsAsync();
  return reponse.granted;
}
