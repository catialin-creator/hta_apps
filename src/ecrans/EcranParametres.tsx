import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  enregistrerParametres,
  lireParametres,
  type MinutesDuJour,
  type Parametres,
} from '../db/parametres';
import { mettreAJourRappels } from '../rappels/rappels';
import { Interrupteur } from '../ui/Interrupteur';
import { Reglage } from '../ui/Reglage';
import { couleurs, tailles } from '../ui/theme';

/** Pas de réglage des plages horaires, en minutes. */
const PAS_HORAIRE = 30;
const MINUIT: MinutesDuJour = 24 * 60;
const DELAI_MIN = 1;
const DELAI_MAX = 30;
const MESURES_MIN = 1;
const MESURES_MAX = 6;

type Etat =
  | 'chargement'
  | 'pret'
  | 'enregistrement'
  | 'enregistre'
  | 'rappelsNonAutorises'
  | 'erreur';

export function formaterHeure(minutes: MinutesDuJour): string {
  if (minutes === MINUIT) return 'minuit';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`;
}

/**
 * Écran Paramètres : plages du matin et du soir, délai entre mesures, nombre de mesures.
 * Les bornes des réglages empêchent toute plage incohérente (début après la fin,
 * ou matin qui chevauche le soir).
 */
function BoutonRetour({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Retour à l'écran Mesure"
      style={({ pressed }) => [styles.boutonRetour, pressed && styles.boutonPresse]}
    >
      <Text style={styles.texteRetour}>‹ Retour</Text>
    </Pressable>
  );
}

export function EcranParametres({ onRetour }: { onRetour: () => void }) {
  const [parametres, setParametres] = useState<Parametres | null>(null);
  const [etat, setEtat] = useState<Etat>('chargement');

  useEffect(() => {
    lireParametres()
      .then((lus) => {
        setParametres(lus);
        setEtat('pret');
      })
      .catch((erreur) => {
        console.error('Lecture des paramètres impossible :', erreur);
        setEtat('erreur');
      });
  }, []);

  if (!parametres) {
    return (
      <View style={[styles.ecran, styles.centre]}>
        {etat === 'erreur' ? (
          <>
            <Text style={styles.messageErreur}>Impossible de lire les paramètres.</Text>
            <BoutonRetour onPress={onRetour} />
          </>
        ) : (
          <ActivityIndicator size="large" color={couleurs.principal} />
        )}
      </View>
    );
  }

  const modifier = (modification: Partial<Parametres>) => {
    setParametres({ ...parametres, ...modification });
    setEtat('pret');
  };

  const enregistrer = async () => {
    setEtat('enregistrement');
    try {
      await enregistrerParametres(parametres);
      const rappels = await mettreAJourRappels(parametres);
      setEtat(rappels === 'non-autorises' ? 'rappelsNonAutorises' : 'enregistre');
    } catch (erreur) {
      console.error('Enregistrement des paramètres impossible :', erreur);
      setEtat('erreur');
    }
  };

  const {
    plageMatin,
    plageSoir,
    delaiMinutes,
    mesuresParSession,
    rappelsActives,
    heureRappelMatin,
    heureRappelSoir,
  } = parametres;

  const reglerHeureRappel = (
    cle: 'heureRappelMatin' | 'heureRappelSoir',
    libelle: string,
    valeur: MinutesDuJour,
  ) => (
    <Reglage
      libelle={libelle}
      valeurAffichee={formaterHeure(valeur)}
      peutDiminuer={valeur - PAS_HORAIRE >= 0}
      peutAugmenter={valeur + PAS_HORAIRE < MINUIT}
      onDiminuer={() => modifier({ [cle]: valeur - PAS_HORAIRE })}
      onAugmenter={() => modifier({ [cle]: valeur + PAS_HORAIRE })}
    />
  );

  return (
    <View style={styles.ecran}>
      <ScrollView contentContainerStyle={styles.contenu}>
        <BoutonRetour onPress={onRetour} />
        <Text style={styles.titre} accessibilityRole="header">
          Paramètres
        </Text>

        <Text style={styles.section} accessibilityRole="header">
          Matin
        </Text>
        <Reglage
          libelle="Début de la plage du matin"
          valeurAffichee={formaterHeure(plageMatin.debut)}
          peutDiminuer={plageMatin.debut - PAS_HORAIRE >= 0}
          peutAugmenter={plageMatin.debut + PAS_HORAIRE < plageMatin.fin}
          onDiminuer={() => modifier({ plageMatin: { ...plageMatin, debut: plageMatin.debut - PAS_HORAIRE } })}
          onAugmenter={() => modifier({ plageMatin: { ...plageMatin, debut: plageMatin.debut + PAS_HORAIRE } })}
        />
        <Reglage
          libelle="Fin de la plage du matin"
          valeurAffichee={formaterHeure(plageMatin.fin)}
          peutDiminuer={plageMatin.fin - PAS_HORAIRE > plageMatin.debut}
          peutAugmenter={plageMatin.fin + PAS_HORAIRE <= plageSoir.debut}
          onDiminuer={() => modifier({ plageMatin: { ...plageMatin, fin: plageMatin.fin - PAS_HORAIRE } })}
          onAugmenter={() => modifier({ plageMatin: { ...plageMatin, fin: plageMatin.fin + PAS_HORAIRE } })}
        />

        <Text style={styles.section} accessibilityRole="header">
          Soir
        </Text>
        <Reglage
          libelle="Début de la plage du soir"
          valeurAffichee={formaterHeure(plageSoir.debut)}
          peutDiminuer={plageSoir.debut - PAS_HORAIRE >= plageMatin.fin}
          peutAugmenter={plageSoir.debut + PAS_HORAIRE < plageSoir.fin}
          onDiminuer={() => modifier({ plageSoir: { ...plageSoir, debut: plageSoir.debut - PAS_HORAIRE } })}
          onAugmenter={() => modifier({ plageSoir: { ...plageSoir, debut: plageSoir.debut + PAS_HORAIRE } })}
        />
        <Reglage
          libelle="Fin de la plage du soir"
          valeurAffichee={formaterHeure(plageSoir.fin)}
          peutDiminuer={plageSoir.fin - PAS_HORAIRE > plageSoir.debut}
          peutAugmenter={plageSoir.fin + PAS_HORAIRE <= MINUIT}
          onDiminuer={() => modifier({ plageSoir: { ...plageSoir, fin: plageSoir.fin - PAS_HORAIRE } })}
          onAugmenter={() => modifier({ plageSoir: { ...plageSoir, fin: plageSoir.fin + PAS_HORAIRE } })}
        />

        <Text style={styles.section} accessibilityRole="header">
          Mesures
        </Text>
        <Reglage
          libelle="Délai entre deux mesures"
          valeurAffichee={`${delaiMinutes} min`}
          peutDiminuer={delaiMinutes > DELAI_MIN}
          peutAugmenter={delaiMinutes < DELAI_MAX}
          onDiminuer={() => modifier({ delaiMinutes: delaiMinutes - 1 })}
          onAugmenter={() => modifier({ delaiMinutes: delaiMinutes + 1 })}
        />
        <Reglage
          libelle="Nombre de mesures par session"
          valeurAffichee={String(mesuresParSession)}
          peutDiminuer={mesuresParSession > MESURES_MIN}
          peutAugmenter={mesuresParSession < MESURES_MAX}
          onDiminuer={() => modifier({ mesuresParSession: mesuresParSession - 1 })}
          onAugmenter={() => modifier({ mesuresParSession: mesuresParSession + 1 })}
        />

        <Text style={styles.section} accessibilityRole="header">
          Rappels
        </Text>
        <Interrupteur
          libelle="Rappels quotidiens"
          active={rappelsActives}
          onChange={(active) => modifier({ rappelsActives: active })}
        />
        {rappelsActives && (
          <>
            {reglerHeureRappel('heureRappelMatin', 'Rappel du matin', heureRappelMatin)}
            {reglerHeureRappel('heureRappelSoir', 'Rappel du soir', heureRappelSoir)}
          </>
        )}
      </ScrollView>

      <View style={styles.pied}>
        <Text
          style={etat === 'enregistre' ? styles.messageSucces : styles.messageErreur}
          accessibilityLiveRegion="polite"
        >
          {etat === 'enregistre' && 'Paramètres enregistrés.'}
          {etat === 'rappelsNonAutorises' &&
            'Paramètres enregistrés, mais les rappels ne sont pas autorisés. Autorisez les notifications dans les réglages du téléphone.'}
          {etat === 'erreur' && "L'enregistrement a échoué. Réessayez."}
        </Text>
        <Pressable
          onPress={enregistrer}
          disabled={etat === 'enregistrement'}
          accessibilityRole="button"
          style={({ pressed }) => [styles.boutonPrincipal, pressed && styles.boutonPresse]}
        >
          <Text style={styles.texteBoutonPrincipal}>Enregistrer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: couleurs.fond,
  },
  centre: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tailles.marge,
  },
  contenu: {
    padding: tailles.marge,
    paddingTop: 56,
  },
  boutonRetour: {
    alignSelf: 'flex-start',
    minHeight: tailles.zoneTactile - 8,
    justifyContent: 'center',
    paddingRight: 16,
    marginBottom: 8,
  },
  texteRetour: {
    fontSize: tailles.texte,
    fontWeight: '700',
    color: couleurs.principal,
  },
  titre: {
    fontSize: tailles.titre,
    fontWeight: '700',
    color: couleurs.texte,
    marginBottom: 8,
  },
  section: {
    fontSize: tailles.texte,
    fontWeight: '700',
    color: couleurs.principal,
    marginTop: 24,
    borderBottomWidth: 2,
    borderBottomColor: couleurs.bordure,
    paddingBottom: 4,
  },
  pied: {
    padding: tailles.marge,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: couleurs.bordure,
  },
  boutonPrincipal: {
    minHeight: tailles.zoneTactile + 8,
    borderRadius: 12,
    backgroundColor: couleurs.principal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonPresse: {
    opacity: 0.8,
  },
  texteBoutonPrincipal: {
    fontSize: tailles.texte + 4,
    fontWeight: '700',
    color: couleurs.surPrincipal,
  },
  messageSucces: {
    fontSize: tailles.texte - 2,
    color: couleurs.succes,
    textAlign: 'center',
    marginBottom: 8,
  },
  messageErreur: {
    fontSize: tailles.texte - 2,
    color: couleurs.erreur,
    textAlign: 'center',
    marginBottom: 8,
  },
});
