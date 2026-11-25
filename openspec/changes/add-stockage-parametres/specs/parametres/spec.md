## ADDED Requirements

### Requirement: Paramètres des sessions
Le système SHALL permettre de régler les plages horaires du matin et du soir, le délai entre deux mesures (5 minutes par défaut) et le nombre de mesures par session (3 par défaut).

#### Scenario: Attribution de la session
- **WHEN** une mesure est prise dans la plage du matin
- **THEN** elle est rattachée à la session du matin du jour

#### Scenario: Délai modifié
- **WHEN** l'utilisateur règle le délai sur une autre valeur
- **THEN** le bip suivant respecte ce nouveau délai

### Requirement: Rappels quotidiens
Le système SHALL pouvoir notifier l'utilisateur à l'heure choisie pour démarrer la session du matin et du soir.

#### Scenario: Rappel activé
- **WHEN** l'heure de rappel d'une session arrive
- **THEN** une notification invite l'utilisateur à prendre sa tension

#### Scenario: Rappel désactivé
- **WHEN** l'utilisateur désactive les rappels
- **THEN** aucune notification quotidienne n'est envoyée
