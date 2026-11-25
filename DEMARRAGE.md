# Démarrage du projet

Ce kit contient les fichiers pour VS Code, Claude Code et OpenSpec. Il ne contient pas
le code de l'application : celui-ci est créé par Expo à l'étape 2.

Toutes les commandes se tapent dans le terminal de VS Code (Terminal > Nouveau terminal),
à la racine de ton dossier.

## Contenu du kit
| Fichier | Rôle |
|---|---|
| `CLAUDE.md` | Contexte du projet lu automatiquement par Claude Code |
| `.claude/settings.json` | Commandes que Claude Code peut lancer sans te demander |
| `.claude/commands/prochaine-tache.md` | Commande `/prochaine-tache` dans Claude Code |
| `.vscode/` | Réglages et extensions recommandées pour VS Code |
| `.prettierrc`, `.editorconfig` | Mise en forme du code |
| `.gitignore-ajouts.txt` | Lignes à ajouter au `.gitignore` d'Expo |
| `docs/PRD.md` | Le cahier des charges |
| `openspec/changes/` | Les trois changements OpenSpec avec specs et tâches |

## 1. Vérifier les outils
```bash
node -v        # 20 ou plus
git --version
```
Réglage Git, une seule fois :
```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.fr"
```

## 2. Créer le projet Expo (dossier encore vide)
Important : fais cette étape AVANT de copier le kit, car Expo exige un dossier vide.
```bash
npx create-expo-app@latest . --template blank-typescript
```

## 3. Copier le kit
Décompresse l'archive et copie tout son contenu à la racine du dossier, fichiers cachés
compris (`.claude`, `.vscode`, `.prettierrc`, `.editorconfig`).
Puis colle le contenu de `.gitignore-ajouts.txt` à la fin du `.gitignore` et supprime
`.gitignore-ajouts.txt`.

Rouvre le dossier dans VS Code : une notification propose d'installer les extensions
recommandées, accepte.

## 4. Tester avec Expo Go
```bash
npx expo start
```
Scanne le QR code avec Expo Go. Ctrl+C pour arrêter.

## 5. Git et GitHub
```bash
git status                 # si « not a git repository » : git init -b main
git add .
git commit -m "Initialise le projet Expo et le kit de démarrage"
```
Crée un dépôt privé vide sur github.com (sans README ni .gitignore), puis :
```bash
git remote add origin https://github.com/TON-COMPTE/tension-app.git
git push -u origin main
```
Ou, avec GitHub CLI : `gh repo create tension-app --private --source=. --push`.

## 6. OpenSpec
```bash
npm install -g @fission-ai/openspec@latest
openspec init
```
Choisis Claude Code comme assistant. Les changements du kit sont déjà dans
`openspec/changes/` : s'il te propose d'écraser un fichier existant, refuse.
Si `openspec init` ajoute un bloc dans `CLAUDE.md`, garde-le.
```bash
openspec list
openspec validate --all
git add . && git commit -m "Initialise OpenSpec" && git push
```

## 7. Claude Code
Installe Claude Code puis lance-le à la racine du dossier :
```bash
claude
```
Il lit `CLAUDE.md` tout seul. Pour avancer, tape :
```
/prochaine-tache
```
Il te propose la première tâche de `add-stockage-parametres`, attend ton accord, la réalise
et propose un message de commit.

## 8. Development build (avant d'attaquer la caméra)
```bash
npm install -g eas-cli
eas login
npx expo install expo-dev-client
eas build:configure
eas build --profile development --platform android
npx expo start --dev-client
```
Pour iPhone, un compte Apple Developer payant est nécessaire.

## Habitude Git
- Une branche par changement : `git checkout -b add-stockage-parametres`
- Un commit par tâche cochée, `git push` régulier.
- Changement fini : fusion dans `main`, puis `openspec archive add-stockage-parametres`.
