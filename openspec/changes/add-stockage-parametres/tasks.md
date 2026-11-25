## 1. Base de données
- [x] 1.1 Installer expo-sqlite et activer le chiffrement SQLCipher
- [x] 1.2 Créer la table Mesure et le système de migrations
- [x] 1.3 Écrire les fonctions ajouter, corriger, supprimer, lister par période

## 2. Paramètres
- [x] 2.1 Stocker les paramètres avec leurs valeurs par défaut (délai 5 min, 3 mesures)
- [ ] 2.2 Écran Paramètres : plages matin et soir, délai, nombre de mesures
- [ ] 2.3 Rattacher chaque mesure à la bonne session selon les plages horaires

## 3. Rappels
- [ ] 3.1 Installer expo-notifications et demander l'autorisation
- [ ] 3.2 Programmer les rappels quotidiens du matin et du soir, désactivables

## 4. Vérification
- [ ] 4.1 Tester hors connexion, correction, suppression et changement de délai
- [ ] 4.2 `openspec validate --all`
