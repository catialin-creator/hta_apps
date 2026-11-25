import { StatusBar } from 'expo-status-bar';

import { EcranParametres } from './src/ecrans/EcranParametres';

// Provisoire : l'écran Paramètres est affiché directement, en attendant la navigation.
export default function App() {
  return (
    <>
      <EcranParametres />
      <StatusBar style="dark" />
    </>
  );
}
