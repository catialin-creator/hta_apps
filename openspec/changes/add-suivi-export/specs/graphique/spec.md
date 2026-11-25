## ADDED Requirements

### Requirement: Graphique d'évolution
Le système SHALL afficher la systolique et la diastolique dans le temps, un point par session (moyenne des mesures) avec l'écart entre la plus basse et la plus haute.

#### Scenario: Lecture des zones
- **WHEN** l'utilisateur ouvre le graphique
- **THEN** les zones normale, limite et élevée s'affichent en couleur selon les seuils paramétrés
- **AND** les sessions du matin et du soir sont distinguées visuellement

#### Scenario: Changement de période
- **WHEN** l'utilisateur choisit la semaine ou le mois
- **THEN** le graphique se recalcule sur cette période

#### Scenario: Pouls
- **WHEN** l'utilisateur active l'affichage du pouls
- **THEN** le pouls apparaît en courbe secondaire

### Requirement: Seuils paramétrables
Le système SHALL utiliser par défaut les seuils standards et permettre de les modifier puis de les rétablir.

#### Scenario: Seuils personnalisés
- **WHEN** l'utilisateur modifie un seuil
- **THEN** le graphique et les exports utilisent la nouvelle valeur

#### Scenario: Retour aux standards
- **WHEN** l'utilisateur choisit de rétablir les seuils
- **THEN** les valeurs standards remplacent les seuils personnalisés
