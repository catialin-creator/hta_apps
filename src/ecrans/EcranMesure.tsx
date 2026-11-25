import { useEffect, useState } from 'react';
import { AppState, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import { useLectureNombres } from '../lecture/useLectureNombres';
import { couleurs, tailles } from '../ui/theme';

interface Props {
  onOuvrirParametres: () => void;
}

/** Vrai tant que l'application est au premier plan : la caméra s'éteint sinon. */
function useAuPremierPlan(): boolean {
  const [actif, setActif] = useState(AppState.currentState === 'active');
  useEffect(() => {
    const abonnement = AppState.addEventListener('change', (etat) => setActif(etat === 'active'));
    return () => abonnement.remove();
  }, []);
  return actif;
}

/**
 * Écran Mesure : caméra arrière en plein écran (spec « capture-mesure »).
 * Seul l'aperçu est branché : aucune sortie photo ni vidéo, donc aucune image
 * n'est jamais enregistrée.
 */
export function EcranMesure({ onOuvrirParametres }: Props) {
  const { hasPermission, canRequestPermission, requestPermission } = useCameraPermission();
  const camera = useCameraDevice('back');
  const auPremierPlan = useAuPremierPlan();
  const lecture = useLectureNombres();

  useEffect(() => {
    if (canRequestPermission) {
      requestPermission();
    }
  }, [canRequestPermission, requestPermission]);

  let contenu: React.ReactNode;
  if (!hasPermission) {
    contenu = canRequestPermission ? null : (
      <View style={styles.message}>
        <Text style={styles.texteMessage}>
          La caméra est nécessaire pour lire les valeurs de votre tensiomètre. Aucune image
          n'est enregistrée.
        </Text>
        <Pressable
          onPress={() => Linking.openSettings()}
          accessibilityRole="button"
          style={({ pressed }) => [styles.boutonPrincipal, pressed && styles.presse]}
        >
          <Text style={styles.texteBoutonPrincipal}>Autoriser la caméra</Text>
        </Pressable>
      </View>
    );
  } else if (camera == null) {
    contenu = (
      <View style={styles.message}>
        <Text style={styles.texteMessage}>Aucune caméra arrière n'a été trouvée.</Text>
      </View>
    );
  } else {
    contenu = (
      <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={camera}
          isActive={auPremierPlan}
          outputs={[lecture.sortie]}
        />
        {__DEV__ && (
          // Aide au développement uniquement : nombres actuellement lus par la caméra.
          <View style={styles.debug} pointerEvents="none">
            <Text style={styles.texteDebug}>
              {lecture.nombres.length > 0
                ? lecture.nombres.map((n) => n.valeur).join('  ·  ')
                : 'Aucun nombre lu'}
            </Text>
          </View>
        )}
      </>
    );
  }

  return (
    <View style={styles.ecran}>
      {contenu}
      <Pressable
        onPress={onOuvrirParametres}
        accessibilityRole="button"
        style={({ pressed }) => [styles.boutonParametres, pressed && styles.presse]}
      >
        <Text style={styles.texteParametres}>Paramètres</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: '#000000',
  },
  message: {
    flex: 1,
    justifyContent: 'center',
    padding: tailles.marge,
    backgroundColor: couleurs.fond,
  },
  texteMessage: {
    fontSize: tailles.texte,
    color: couleurs.texte,
    textAlign: 'center',
    marginBottom: 32,
  },
  boutonPrincipal: {
    minHeight: tailles.zoneTactile + 8,
    borderRadius: 12,
    backgroundColor: couleurs.principal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  texteBoutonPrincipal: {
    fontSize: tailles.texte + 4,
    fontWeight: '700',
    color: couleurs.surPrincipal,
  },
  boutonParametres: {
    position: 'absolute',
    top: 48,
    right: tailles.marge,
    minHeight: tailles.zoneTactile - 8,
    paddingHorizontal: 18,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: couleurs.principal,
    backgroundColor: couleurs.fond,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texteParametres: {
    fontSize: tailles.texte - 2,
    fontWeight: '700',
    color: couleurs.principal,
  },
  presse: {
    opacity: 0.75,
  },
  debug: {
    position: 'absolute',
    left: tailles.marge,
    right: tailles.marge,
    bottom: 48,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  texteDebug: {
    fontSize: tailles.texte,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
