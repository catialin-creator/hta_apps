## 1. Caméra
- [x] 1.1 Installer expo-dev-client et react-native-vision-camera, construire le development build
- [x] 1.2 Installer la reconnaissance de texte ML Kit pour les frame processors
- [x] 1.3 Écran Mesure : caméra plein écran, demande d'autorisation, aucune image enregistrée

## 2. Lecture
- [x] 2.1 Frame processor : extraire les nombres visibles
- [ ] 2.2 Repérer systolique, diastolique et pouls (position et ordre de grandeur)
- [ ] 2.3 Valider une mesure stable sur plusieurs images consécutives
- [ ] 2.4 Ignorer une mesure identique à la dernière enregistrée
- [ ] 2.5 Contrôle de plausibilité et saisie manuelle en cas d'échec

## 3. Session
- [ ] 3.1 Signal visuel et sonore de confirmation
- [ ] 3.2 Bip et notification après le délai réglé
- [ ] 3.3 Arrêt après la dernière mesure et affichage de la moyenne

## 4. Vérification
- [ ] 4.1 Tester avec plusieurs tensiomètres, éclairages et angles
- [ ] 4.2 `openspec validate --all`
