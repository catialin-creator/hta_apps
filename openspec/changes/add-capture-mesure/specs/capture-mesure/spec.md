## ADDED Requirements

### Requirement: Lecture en direct de l'écran du tensiomètre
Le système SHALL analyser le flux de la caméra en continu, sans enregistrer d'image, et extraire la systolique, la diastolique et le pouls.

#### Scenario: Mesure lue correctement
- **WHEN** l'écran du tensiomètre est visible et les trois valeurs restent identiques sur plusieurs images
- **THEN** le système enregistre la mesure avec la date, l'heure, la session et le rang
- **AND** confirme par un signal visuel et sonore

#### Scenario: Même mesure encore à l'écran
- **WHEN** les valeurs lues sont identiques à la dernière mesure enregistrée
- **THEN** le système n'enregistre pas de doublon

#### Scenario: Valeur illisible ou incohérente
- **WHEN** une valeur est illisible ou hors des bornes plausibles
- **THEN** le système demande de refaire la lecture ou de saisir la valeur à la main

### Requirement: Rappel de la mesure suivante
Le système SHALL émettre un bip après le délai réglé (5 minutes par défaut) suivant chaque mesure, jusqu'à la dernière mesure de la session.

#### Scenario: Mesure intermédiaire
- **WHEN** une mesure qui n'est pas la dernière de la session est enregistrée
- **THEN** un bip et une notification sont programmés après le délai réglé

#### Scenario: Dernière mesure faite
- **WHEN** la dernière mesure de la session est enregistrée
- **THEN** aucun rappel n'est programmé et la moyenne de la session s'affiche

### Requirement: Écran Mesure
Le système SHALL ouvrir l'application sur l'écran Mesure, qui affiche la caméra en plein écran après avoir demandé l'autorisation d'y accéder, et donne un accès secondaire à l'écran Paramètres.

#### Scenario: Ouverture de l'application
- **WHEN** l'utilisateur ouvre l'application et a autorisé la caméra
- **THEN** l'écran Mesure affiche l'image de la caméra en plein écran, sans prendre ni enregistrer de photo

#### Scenario: Caméra refusée
- **WHEN** l'utilisateur refuse l'accès à la caméra
- **THEN** l'écran explique que la caméra est nécessaire pour lire le tensiomètre et propose d'ouvrir les réglages du téléphone

#### Scenario: Accès aux paramètres
- **WHEN** l'utilisateur touche le bouton Paramètres
- **THEN** l'écran Paramètres s'ouvre, et un bouton Retour ramène à l'écran Mesure
