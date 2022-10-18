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
- Installez les dépendances NPM via la commande : `npm install`


### Base de données:
- Dans le fichier .env.local, à la racine du projet, configurez la DATABASE_URL avec vos informations de base de données: Exemple avec mySql : `DATABASE_URL="mysql://identiant:mot-de-passe@url:port/database`

- Si la base de données est configurée mais pas créée, executez la commande suivante : `php bin/console doctrine:database:create`

- Puis lancez les migrations via la commande suivante : `php bin/console doctrine:migrations:migrate`


### Compte d'un utilisateur de l'équipe technique:

- D'abord, hashez le mot de passe avec la commande suivante : `php bin/console security:hash-password`

- Créez un uuid grâce au site : https://www.uuidgenerator.net/version4

- Ensuite sur votre gestionnaire de base de données, executez la requête suivante en remplaçant l'email, le mot de passe avec celui hashé précédemment, le prénom, le nom, et l'uuid généré précédemment :

  `INSERT INTO user (email, roles, password, firstname, lastname, is_active, has_created_pwd, uuid) VALUES ('email', '["ROLE_TECHNICAL"]', 'mot_de_passe', 'prenom', 'nom', 1, 1, 'uuid');`
  

- Lancez le projet avec la commande : `symfony serve`

---


## Déploiement du projet en ligne

- Le site est actuellement en ligne ici : https://xtrem-studi.fly.dev/
Le déploiement a été effectué sur Heroku et récupéré sur Fly.io car Heroku est devenu payant.

### Deploiement sur Heroku

- Crééz un compte sur heroku.com

- Crééz ensuite une app

- Liez votre dépôt GitHub (créé au préalable)

- Ajouter la dépendance suivante afin de créer automatiqument les fichiers necessaires au déploiement d'un projet symfony sur Heroku : `composer remove nat/deploy`

- Executez la commande : `php bin/console nat:heroku`

- Répondez aux questions avec votre identifiant Heroku, votre clé API Heroku, votre nom d'app sur Heroku et ajoutez clearDb.
Les fichiers Procfil, htaccess et .env.php seront créé automatiquement.
Les variables d'environnement seront créés automatiquement sur Heroku et l'addon clearDB sera ajouté sur Heroku.

- Supprimez ensuite cette dépendance via la commande : `composer remove nat/deploy`

- Exportez votre base de données vers clearDb (Vous pouvez retrouver les identifiants directement dans l'onglet Settings sur Heroku au niveau des Config Vars : CLEAR_DB_NAT_URL)

- Il ne reste plus qu'à executer les commandes GIT habituelles (add, commit et push)