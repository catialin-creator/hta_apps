import { Pressable, StyleSheet, Text, View } from 'react-native';

import { couleurs, tailles } from './theme';

interface Props {
  libelle: string;
  /** Valeur affichée, déjà formatée (ex. « 6 h 30 »). */
  valeurAffichee: string;
  peutDiminuer: boolean;
  peutAugmenter: boolean;
  onDiminuer: () => void;
  onAugmenter: () => void;
}

/** Réglage d'une valeur avec deux gros boutons − et +, sans clavier. */
export function Reglage({
  libelle,
  valeurAffichee,
  peutDiminuer,
  peutAugmenter,
  onDiminuer,
  onAugmenter,
}: Props) {
  return (
    <View
      style={styles.conteneur}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={libelle}
      accessibilityValue={{ text: valeurAffichee }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(evenement) => {
        if (evenement.nativeEvent.actionName === 'increment' && peutAugmenter) onAugmenter();
        if (evenement.nativeEvent.actionName === 'decrement' && peutDiminuer) onDiminuer();
      }}
    >
      <Text style={styles.libelle}>{libelle}</Text>
      <View style={styles.ligne}>
        <Bouton symbole="−" actif={peutDiminuer} onPress={onDiminuer} />
        <Text style={styles.valeur}>{valeurAffichee}</Text>
        <Bouton symbole="+" actif={peutAugmenter} onPress={onAugmenter} />
      </View>
    </View>
  );
}

function Bouton({ symbole, actif, onPress }: { symbole: string; actif: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!actif}
      importantForAccessibility="no"
      style={({ pressed }) => [
        styles.bouton,
        !actif && styles.boutonDesactive,
        pressed && styles.boutonPresse,
      ]}
    >
      <Text style={[styles.symbole, !actif && styles.symboleDesactive]}>{symbole}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    paddingVertical: 12,
  },
  libelle: {
    fontSize: tailles.texte,
    color: couleurs.texte,
    marginBottom: 8,
  },
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valeur: {
    flex: 1,
    textAlign: 'center',
    fontSize: tailles.valeur,
    fontWeight: '700',
    color: couleurs.texte,
  },
  bouton: {
    width: tailles.zoneTactile,
    height: tailles.zoneTactile,
    borderRadius: tailles.zoneTactile / 2,
    borderWidth: 3,
    borderColor: couleurs.principal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonDesactive: {
    borderColor: couleurs.desactive,
  },
  boutonPresse: {
    backgroundColor: '#E3ECF7',
  },
  symbole: {
    fontSize: 36,
    fontWeight: '700',
    color: couleurs.principal,
    lineHeight: 40,
  },
  symboleDesactive: {
    color: couleurs.desactive,
  },
});
