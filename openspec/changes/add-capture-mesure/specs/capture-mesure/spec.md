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
