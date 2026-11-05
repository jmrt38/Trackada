# Trackada

Trackada est un outil en ligne de commande développé avec Node.js. Il permet de vérifier automatiquement l'organisation et l'état des projets réalisés durant la formation Ada Tech School.

## Fonctionnalités

Trackada vérifie automatiquement :

- L'existence du dossier parent contenant les projets.
- La présence de chaque dossier projet et la conformité de son nom.
- L'initialisation d'un dépôt Git pour chaque projet.
- La présence de tous les fichiers requis définis dans `track.json`.

Un rapport est ensuite affiché dans le terminal pour présenter les résultats de chaque vérification.

Les projets sont identifiés par :
- ✅ Une coche verte lorsque le projet est correctement initialisé.
- ❌ Une croix rouge lorsque des éléments sont manquants ou incorrects.

En cas d'erreur, Trackada précise les éléments à corriger : dossier absent, dépôt Git non initialisé ou fichiers manquants.

À la fin du rapport, un pourcentage indique la proportion de projets correctement initialisés.

## Technologies utilisées

- JavaScript
- Node.js
- Modules natifs : `fs`, `path`, `os` et `readline`

## Lancement du projet

1. Cloner le dépôt GitHub.
2. Installer Node.js si nécessaire.
3. Ouvrir un terminal dans le dossier du projet.
4. Lancer le programme avec la commande :


node checktrack.js


5. Confirmer le lancement en saisissant `o` ou `oui`.

## Configuration

Le fichier track.json contient la liste des projets à vérifier ainsi que les fichiers requis pour chacun d'entre eux.

Les projets doivent être présents dans le dossier :


~/Dev/ada-tech/bloc1/projets

Le fichier track.json permet de définir les éléments à contrôler sans avoir à modifier le code source de Trackada.