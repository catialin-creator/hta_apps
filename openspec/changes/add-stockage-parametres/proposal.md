## Why
Les mesures doivent être conservées sur le téléphone de façon sûre, sans connexion, et le
rythme des sessions (plages horaires, délai, nombre de mesures) doit pouvoir s'adapter.
C'est le socle dont dépendent la capture et le suivi.

## What Changes
- Base SQLite locale chiffrée avec SQLCipher et table Mesure.
- Correction et suppression d'une mesure.
- Écran Paramètres : plages matin et soir, délai entre mesures, nombre de mesures par session.
- Rappels quotidiens pour démarrer les sessions, désactivables.

## Impact
- Specs touchées : `stockage`, `parametres`.
- Paquets : `expo-sqlite`, `expo-notifications`.
