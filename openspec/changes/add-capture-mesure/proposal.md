## Why
Recopier à la main les valeurs du tensiomètre est fastidieux et source d'erreurs. La caméra
allumée en continu doit lire l'écran et enregistrer la mesure sans aucune manipulation.

## What Changes
- Lecture en direct de l'écran du tensiomètre, sans prise ni enregistrement de photo.
- Validation d'une mesure stable sur plusieurs images, sans doublon.
- Saisie manuelle si la lecture échoue ou paraît incohérente.
- Bip après le délai réglé, jusqu'à la dernière mesure de la session.
- Écran Mesure comme écran d'accueil, avec accès secondaire aux Paramètres.

## Impact
- Spec touchée : `capture-mesure`.
- Paquets : `react-native-vision-camera`, reconnaissance de texte ML Kit, `expo-dev-client`.
- Nécessite un development build : ne fonctionne pas dans Expo Go.
- Dépend de `add-stockage-parametres`.
