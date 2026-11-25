import { Pressable, StyleSheet, Text } from 'react-native';

import { couleurs, tailles } from './theme';

interface Props {
  libelle: string;
  active: boolean;
  onChange: (active: boolean) => void;
}

/** Gros interrupteur lisible : toute la ligne est tactile et l'état est écrit en toutes lettres. */
export function Interrupteur({ libelle, active, onChange }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!active)}
      accessibilityRole="switch"
      accessibilityLabel={libelle}
      accessibilityState={{ checked: active }}
      style={({ pressed }) => [styles.ligne, pressed && styles.presse]}
    >
      <Text style={styles.libelle}>{libelle}</Text>
      <Text style={[styles.etat, active ? styles.etatActive : styles.etatDesactive]}>
        {active ? 'Activés' : 'Désactivés'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ligne: {
    minHeight: tailles.zoneTactile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  presse: {
    opacity: 0.7,
  },
  libelle: {
    fontSize: tailles.texte,
    color: couleurs.texte,
    flex: 1,
  },
  etat: {
    fontSize: tailles.texte,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 3,
    overflow: 'hidden',
  },
  etatActive: {
    color: couleurs.surPrincipal,
    backgroundColor: couleurs.principal,
    borderColor: couleurs.principal,
  },
  etatDesactive: {
    color: couleurs.texte,
    backgroundColor: couleurs.fond,
    borderColor: couleurs.bordure,
  },
});
