# PRD – Application d'automesure de tension artérielle

Version de référence pour le code. Le document vivant est dans Claude (PRD partagé) ;
les specs détaillées sont dans `openspec/changes/`.

## 1. Contexte et problème
Le protocole d'automesure recommande 3 mesures le matin et 3 le soir, espacées d'environ
5 minutes. Recopier les valeurs à la main est fastidieux et source d'erreurs.

## 2. Objectif
Application mobile (Android et iPhone) qui lit l'écran du tensiomètre avec la caméra,
extrait les valeurs et les enregistre automatiquement, avec un rappel sonore pour la
mesure suivante.

## 3. Utilisateurs cibles
Personnes hypertendues ou suivies, réalisant des automesures à domicile, souvent peu à
l'aise avec la technologie.

## 4. Parcours principal
1. L'utilisateur ouvre l'appli : la caméra est active.
2. Il pointe le téléphone vers l'écran du tensiomètre (ou le laisse posé).
3. L'appli lit systolique, diastolique et pouls.
4. Confirmation visuelle et sonore, enregistrement avec date et heure.
5. Bip 5 minutes plus tard, jusqu'à 3 mesures par session.

## 5. Fonctionnalités V1
- Caméra allumée en continu, sans prise de photo : analyse en direct sur le téléphone,
  valeur retenue quand elle reste stable sur plusieurs images.
- Reconnaissance des chiffres, y compris afficheurs 7 segments.
- Détection d'une nouvelle mesure, sans doublon.
- Minuteur avec bip et notification ; rappels quotidiens désactivables.
- Correction et suppression d'une mesure ; saisie manuelle si la lecture échoue.
- Historique et moyennes par session et par période.
- Graphique : systolique et diastolique par session avec écart min-max, zones de couleur
  normale, limite et élevée, matin et soir distingués, pouls en option.
- Seuils réglables, standards par défaut, retour aux standards possible.
- Export médecin : PDF (mesures, moyennes, graphique, seuils) et CSV sur 7, 30 ou 90 jours,
  partage par e-mail ou par le téléphone.

## 6. Données
Base SQLite locale chiffrée (SQLCipher), fonctionnant hors connexion.
Table Mesure : id, horodatage, systolique, diastolique, pouls, session, rang,
source (auto ou manuel), indice de confiance.

## 7. Exigences non fonctionnelles
- Aucune image enregistrée ni envoyée ; traitement sur l'appareil.
- Données de santé chiffrées, conformité RGPD.
- Lecture en moins de 2 secondes, interface très lisible.

## 8. Hors périmètre V1
Connexion Bluetooth aux tensiomètres, alertes en cas de valeurs élevées, diagnostic
médical. Plusieurs utilisateurs sur un même téléphone : prévu en V2.

## 9. Point ouvert
Source officielle des seuils standards à citer dans l'application.
