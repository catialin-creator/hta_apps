# Tension – application d'automesure de tension artérielle

Application mobile (Android et iPhone) qui lit l'écran d'un tensiomètre avec la caméra
allumée en continu, enregistre systolique, diastolique et pouls, et rappelle la mesure
suivante 5 minutes plus tard (3 mesures le matin, 3 le soir).

Le cahier des charges complet est dans `docs/PRD.md`.

## Stack
- Expo (React Native) en TypeScript, un seul code pour Android et iOS.
- Caméra : `react-native-vision-camera` + frame processor + reconnaissance de texte ML Kit,
  traitée sur l'appareil. Nécessite un development build (`expo-dev-client`), pas Expo Go.
- Stockage : `expo-sqlite` chiffré avec SQLCipher, 100 % local, aucun serveur.
- Export : `expo-print` (PDF) et `expo-sharing`. Notifications : `expo-notifications`.

## Méthode : OpenSpec
- Les specs vivent dans `openspec/`. Avant de coder, lire le changement en cours dans
  `openspec/changes/<nom>/` : `proposal.md`, `tasks.md` et `specs/`.
- Ordre des changements : `add-stockage-parametres`, puis `add-capture-mesure`,
  puis `add-suivi-export`.
- Travailler une tâche de `tasks.md` à la fois, la cocher quand elle est finie et testée.
- Ne jamais coder un comportement absent des specs : proposer d'abord une mise à jour de la spec.
- Changement terminé : `openspec validate --all`, puis `openspec archive <nom>`.

## Règles du projet
- Ne jamais enregistrer ni envoyer d'image de la caméra : seules les valeurs lues sont gardées.
- Aucune donnée de santé ne quitte le téléphone, sauf export volontaire de l'utilisateur.
- Interface lisible pour un public peu technophile : gros caractères, contrastes forts,
  un seul geste principal par écran.
- Textes de l'interface en français.
- L'application ne donne aucun avis médical : elle enregistre et affiche, c'est tout.
- Seuils standards par défaut, modifiables dans les paramètres.

## Commandes utiles
- `npx expo start` : lancer avec Expo Go (sans caméra en direct).
- `npx expo start --dev-client` : lancer avec le development build.
- `eas build --profile development --platform android` : construire le development build.
- `npx expo install <paquet>` : installer un paquet compatible avec la version d'Expo.
- `npx tsc --noEmit` : vérifier les types.
- `openspec list` / `openspec validate --all` : état et validation des specs.

## Git
- Une branche par changement OpenSpec, un commit par tâche cochée.
- Messages de commit en français, à l'impératif : « Ajoute la table Mesure ».
- Ne jamais committer de clés, de fichier `.env` ou de base de données.
