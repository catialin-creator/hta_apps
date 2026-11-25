## Why
Les mesures n'ont de valeur que si le patient et son médecin peuvent les lire facilement :
un graphique parlant et un rapport à transmettre.

## What Changes
- Graphique d'évolution par session, avec zones de couleur selon des seuils paramétrables.
- Seuils standards par défaut, modifiables et rétablissables.
- Export PDF et CSV sur 7, 30 ou 90 jours, partage par e-mail ou par le téléphone.

## Impact
- Specs touchées : `graphique`, `export-medecin`.
- Paquets : une bibliothèque de graphiques React Native (à choisir), `expo-print`, `expo-sharing`.
- Dépend de `add-stockage-parametres`.
