# Xtrem - ECF Studi
Créé avec Symfony & React

### Description

Il s'agit du dépôt Github du projet d'ECF Studi pour la session de décembre 2022.

Dans le dossier Annexes de ce dépot se trouvent :

- Le manuel d’utilisation
- La documentation technique

---

## Déploiement du projet en local

Ce projet est réalisé avec Symfony 6.1.6, PHP 8.1.4 et React 18.2.0

- Au préalable, créez votre environnement Symfony en suivant la procédure suivante : https://symfony.com/doc/current/setup.html


### Clonage dépôt Git:
- Rendez-vous sur le dépot GIT fourni

- Copiez le lien https dans le bouton vert "Code"

- Sur votre terminal, dirigez-vous vers votre dossier de travail

- Utilisez la commande git clone et collez le lien

- Sur VSC, ouvrez le dossier de travail et accédez au code


### Installation dépendances:
- Installez les dépendances PHP via la commande : `composer install`


### Base de données:
- Dans le fichier .env, à la racine du projet, configurez la DATABASE_URL en ligne 31 pour qu'elle corresponde à vos informations de base de données.

- Si la base de données est configurée mais pas créée, executez la commande suivante : `php bin/console doctrine:database:create`

- Puis lancez les migrations via la commande suivante : `php bin/console doctrine:migrations:migrate`


### Compte admin:

- D'abord, hashez le mot de passe avec la commande suivante : `php bin/console security:hash-password`

- Ensuite sur votre gestionnaire de base de données, executez la requête suivante en remplaçant l'email de l'administrateur, le mot de passe hashé précédemment, son prénom et son nom :

  `INSERT INTO user (email, roles, password, firstname, lastname, is_approved) VALUES ('email', '["ROLE_ADMIN"]', 'mot_de_passe', 'prenom', 'nom', 1);`
  

- Lancez le projet avec la commande : `symfony serve`

---


## Déploiement du projet en ligne

- Le site est actuellement en ligne ici : https://trt-conseils-studi.herokuapp.com/


### Deploiement sur Heroku

- Crééz un compte sur heroku.com

- Crééz ensuite une app

- Liez votre dépôt GitHub (créé au préalable)

- Ajouter la dépendance suivante afin de créer automatiqument les fichiers necessaires au déploiement d'un projet symfony sur Heroku : `composer remove nat/deploy`

- Executez la commande : `php bin/console nat:heroku`

- Répondez aux questions avec votre identifiant Heroku, votre clé API Heroku, votre nom d'app sur Heroku et ajoutez clearDb.

- Supprimez ensuite cette dépendance via la commande : `composer remove nat/deploy`

- Exportez votre base de données vers clearDb (Vous pouvez retrouver les identifiants directement dans l'onglet Settings sur Heroku au niveau des Config Vars : CLEAR_DB_NAT_URL)

- Il ne reste plus qu'à executer les commande GIT habituelles (add, commit et push)