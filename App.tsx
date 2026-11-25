import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { lireParametres } from './src/db/parametres';
import { EcranParametres } from './src/ecrans/EcranParametres';
import { demanderAutorisationNotifications } from './src/rappels/notifications';

// Provisoire : l'écran Paramètres est affiché directement, en attendant la navigation.
export default function App() {
  useEffect(() => {
    // Les rappels sont activés par défaut : on demande l'autorisation dès le lancement,
    // sauf si l'utilisateur les a désactivés.
    lireParametres()
      .then(({ rappelsActives }) => (rappelsActives ? demanderAutorisationNotifications() : false))
      .catch(() => {
        // Sans autorisation ni paramètres lisibles, l'application reste utilisable sans rappels.
      });
  }, []);

  return (
    <>
      <EcranParametres />
      <StatusBar style="dark" />
    </>
  );
}
