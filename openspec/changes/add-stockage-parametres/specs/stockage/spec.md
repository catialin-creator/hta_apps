## ADDED Requirements

### Requirement: Stockage local chiffré
Le système SHALL enregistrer chaque mesure dans une base SQLite locale chiffrée avec SQLCipher, sans aucun envoi vers un serveur.

#### Scenario: Enregistrement d'une mesure
- **WHEN** une mesure est validée
- **THEN** la base contient l'horodatage, la systolique, la diastolique, le pouls, la session, le rang, la source (auto ou manuel) et l'indice de confiance

#### Scenario: Utilisation hors connexion
- **WHEN** le téléphone n'a pas de réseau
- **THEN** toutes les fonctions restent disponibles

#### Scenario: Correction d'une mesure
- **WHEN** l'utilisateur corrige une valeur
- **THEN** la mesure est mise à jour et sa source passe à manuel

#### Scenario: Suppression d'une mesure
- **WHEN** l'utilisateur supprime une mesure et confirme
- **THEN** elle disparaît de l'historique, du graphique et des exports
