import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { lireParametres } from './src/db/parametres';
import { EcranParametres } from './src/ecrans/EcranParametres';
import { mettreAJourRappels } from './src/rappels/rappels';

// Provisoire : l'écran Paramètres est affiché directement, en attendant la navigation.
export default function App() {
  useEffect(() => {
    // Les rappels sont activés par défaut : au lancement, on demande l'autorisation
    // et on (re)programme les rappels, sauf si l'utilisateur les a désactivés.
    lireParametres()
      .then(mettreAJourRappels)
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
