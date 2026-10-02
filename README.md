# Suivi des évaluations — version 5.0.3

Application Electron locale pour saisir les résultats d'une classe, calculer les niveaux de maîtrise et préparer les groupes de remédiation et de consolidation.

## Référentiel et banque d'exercices

- architecture prévue pour les niveaux de la 4ème à la 6ème année ;
- 4ème et 5ème année laissées volontairement en attente de leurs guides officiels ;
- référentiel complet de 6ème année organisé par unité, module et activité ;
- critères adaptés automatiquement à l'oral, la lecture, la grammaire, la conjugaison, l'orthographe ou la production écrite ;
- 840 exercices de remédiation, consolidation et approfondissement ;
- 8 séries originales de lecture par unité, avec un texte commun et des questions C1 à C6 en trois niveaux ;
- devoirs individualisés stables, avec bouton « Nouvelle version » ;
- générateur pour toute la classe en mode personnalisé ou devoir commun ;
- aperçu A4 avant export, en-tête enseignant/élève/classe/date, durée, critères de maîtrise et appréciation ;
- modification directe dans l’aperçu du titre, de l’école, de l’enseignant, de l’élève, de la date, des supports, consignes et corrections avant export ;
- brouillons manuels conservés après fermeture et bouton de réinitialisation ;
- trois mises en page (compacte, confortable, grande écriture) avec espace de réponse adaptatif ;
- validation avant export, historique des devoirs et rotation des questions déjà distribuées ;
- export Word groupé, ZIP de Word individuels et PDF groupé ;
- favoris et exclusion des exercices dans la banque ;
- sauvegarde/restauration complète au format `.suivi` ;
- en-tête du tableau et synthèse fixés pendant le défilement des élèves ;
- illustrations et tableaux originaux activables ou désactivables ;
- recherche, filtres, création, modification, duplication et suppression ;
- import/export Word de toute la banque avec un modèle réimportable ;
- propositions d'exercices dans les groupes pédagogiques selon la base active.
- devoir individuel prêt à distribuer, exportable en Word ou en PDF, avec corrigé enseignant optionnel ;
- génération PDF A4 stable sans ouvrir le pilote d'impression système.

## Prérequis

- Node.js 24 ou version LTS compatible
- Windows pour générer l'installateur NSIS

## Installation et lancement

```powershell
npm install
npm start
```

## Vérifications

```powershell
npm run check
npm test
npm run build:renderer
```

## Création de l'installateur

```powershell
npm run build
```

Le résultat est créé dans le dossier `release`.

## Données

Les données restent sur l'ordinateur dans le stockage local Electron. Au premier lancement de la version 5, les sauvegardes précédentes sont migrées automatiquement.

## Règles de maîtrise

- `+++` : toutes les réponses sont correctes.
- `++` : au moins deux tiers des réponses sont correctes.
- `+` : au moins un tiers des réponses est correct.
- `-` : moins d'un tiers des réponses est correct.

Les critères verrouillés sont exclus des statistiques et des groupes. Le verrouillage conserve toujours les scores déjà saisis.
