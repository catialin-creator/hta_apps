import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import { lireParametres } from './src/db/parametres';
import { EcranMesure } from './src/ecrans/EcranMesure';
import { EcranParametres } from './src/ecrans/EcranParametres';
import { mettreAJourRappels } from './src/rappels/rappels';

type Ecran = 'mesure' | 'parametres';

export default function App() {
  const [ecran, setEcran] = useState<Ecran>('mesure');

  useEffect(() => {
    // Les rappels sont activés par défaut : au lancement, on demande l'autorisation
    // et on (re)programme les rappels, sauf si l'utilisateur les a désactivés.
    lireParametres()
      .then(mettreAJourRappels)
      .catch((erreur) => {
        // Sans autorisation ni paramètres lisibles, l'application reste utilisable sans rappels.
        console.warn('Rappels non programmés :', erreur);
      });
  }, []);

  // Bouton retour d'Android : depuis les Paramètres, revient à l'écran Mesure.
  useEffect(() => {
    if (ecran !== 'parametres') return;
    const abonnement = BackHandler.addEventListener('hardwareBackPress', () => {
      setEcran('mesure');
      return true;
    });
    return () => abonnement.remove();
  }, [ecran]);

  return (
    <>
      {ecran === 'mesure' ? (
        <EcranMesure onOuvrirParametres={() => setEcran('parametres')} />
      ) : (
        <EcranParametres onRetour={() => setEcran('mesure')} />
      )}
      <StatusBar style={ecran === 'mesure' ? 'light' : 'dark'} />
    </>
  );
}
