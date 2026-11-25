## ADDED Requirements

### Requirement: Paramètres des sessions
Le système SHALL permettre de régler les plages horaires du matin (6 h – 10 h par défaut) et du soir (18 h – 22 h par défaut), le délai entre deux mesures (5 minutes par défaut) et le nombre de mesures par session (3 par défaut).

#### Scenario: Premier lancement
- **WHEN** l'utilisateur n'a encore modifié aucun paramètre
- **THEN** les valeurs par défaut s'appliquent

#### Scenario: Paramètre modifié conservé
- **WHEN** l'utilisateur modifie un paramètre puis relance l'application
- **THEN** la valeur modifiée est conservée

#### Scenario: Attribution de la session
- **WHEN** une mesure est prise dans la plage du matin
- **THEN** elle est rattachée à la session du matin du jour

#### Scenario: Mesure hors des plages
- **WHEN** une mesure est prise en dehors des plages du matin et du soir
- **THEN** elle est enregistrée « hors session », sans session ni rang

#### Scenario: Délai modifié
- **WHEN** l'utilisateur règle le délai sur une autre valeur
- **THEN** le bip suivant respecte ce nouveau délai

### Requirement: Rappels quotidiens
Le système SHALL pouvoir notifier l'utilisateur à l'heure choisie pour démarrer la session du matin (7 h 30 par défaut) et du soir (20 h 30 par défaut). Les rappels sont activés par défaut.

#### Scenario: Rappel activé
- **WHEN** l'heure de rappel d'une session arrive
- **THEN** une notification invite l'utilisateur à prendre sa tension

#### Scenario: Rappel désactivé
- **WHEN** l'utilisateur désactive les rappels
- **THEN** aucune notification quotidienne n'est envoyée
