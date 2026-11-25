## ADDED Requirements

### Requirement: Export pour le médecin
Le système SHALL générer un PDF et un CSV sur une période de 7, 30 ou 90 jours.

#### Scenario: Rapport PDF
- **WHEN** l'utilisateur demande un export PDF sur une période
- **THEN** le PDF contient le tableau des mesures, les moyennes matin, soir et globale, le nombre de mesures et le graphique avec les seuils utilisés

#### Scenario: Export CSV
- **WHEN** l'utilisateur demande un export CSV
- **THEN** le fichier contient une ligne par mesure avec toutes ses données

#### Scenario: Partage
- **WHEN** l'export est généré
- **THEN** l'utilisateur peut l'envoyer par e-mail ou par le partage du téléphone

#### Scenario: Aucune donnée
- **WHEN** la période choisie ne contient aucune mesure
- **THEN** le système l'indique et ne génère pas de fichier
