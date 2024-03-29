# Xtrem - ECF Studi
Créé avec Symfony & React
<br/>
<br/>

![Cover](https://github.com/Mat-Boo/xtrem/blob/main/assets/img/logo_horizontal.png)

<br/>

### Description

Il s'agit du dépôt Github du projet d'ECF Studi pour la session de décembre 2022.  
Ce projet a pour but de créer une application permettant la gestion de partenaires de la marque Xtrem et leurs clubs avec la possibilité de gérer l'accès à des permissions.

Dans le dossier Annexes de ce dépot se trouvent :
- [01 - Personas - ECF - Xtrem.pdf](https://github.com/Mat-Boo/xtrem/blob/main/Annexes/01%20-%20Personas%20-%20ECF%20-%20Xtrem.pdf)
- [02 - User Stories - ECF - Xtrem.pdf](https://github.com/Mat-Boo/xtrem/blob/main/Annexes/02%20-%20User%20Stories%20-%20ECF%20-%20Xtrem.pdf)
- [03 - Wireframes (desktop & mobile) - ECF - Xtrem.pdf](https://github.com/Mat-Boo/xtrem/blob/main/Annexes/03%20-%20Wireframes%20(desktop%20%26%20mobile)%20-%20ECF%20-%20Xtrem.pdf)
- [04 - Charte graphique - ECF - Xtrem.pdf](https://github.com/Mat-Boo/xtrem/blob/main/Annexes/04%20-%20Charte%20graphique%20-%20ECF%20-%20Xtrem.pdf)
- [05 - Mockups (desktop & mobile) - ECF - Xtrem.pdf](https://github.com/Mat-Boo/xtrem/blob/main/Annexes/05%20-%20Mockups%20(desktop%20%26%20mobile)%20-%20ECF%20-%20Xtrem.pdf)
- [06 - Schémas de conception (Merise, Use case, Sequence) - ECF - Xtrem.pdf](https://github.com/Mat-Boo/xtrem/blob/main/Annexes/06%20-%20Sch%C3%A9mas%20de%20conception%20(Merise%2C%20Use%20case%2C%20Sequence)%20-%20ECF%20-%20Xtrem.pdf)
- [07 - Manuel d’utilisation - ECF - Xtrem.pdf](https://github.com/Mat-Boo/xtrem/blob/main/Annexes/07%20-%20Manuel%20d'utilisation%20-%20ECF%20-%20Xtrem.pdf)
- [08 - sql-xtrem-insert-testValues.sql](https://github.com/Mat-Boo/xtrem/blob/main/Annexes/08%20-%20Sql%20-%20Insert%20testValues%20-%20ECF%20-%20Xtrem.sql)

---

## Spécifications techniques
### Backend :
- Symfony 6.1.6
- PHP 8.1.4
- Orm Doctrine 2.13
- Base de données : MySQL

### Frontend :
- node 16.3.2
- React 18.2.0
- Sass 13.0.2

---

## Choix techniques
- Pour la création de cette application, j’ai choisi pour le backend d’utiliser le framework Symfony qui m’a permis facilement de mettre en place une API, associé à Doctrine pour gérer la base de données.

- Pour une meilleure expérience utilisateur, je voulais impérativement mettre en place une SPA, je me suis donc tourné vers la librairie REACT pour la partie frontend avec les styles gérés avec le pré-processeur SASS.

- Pour la sécurité, les mots de passe sont cryptés, les requêtes effectuées via doctrine sont préparées et les formulaires sont contrôlés à la validation avec untoken CSRF.  
De plus, j'utilise un token JWT pour l'authentification mis en place avec le package Lexik qui nécessite qu'OpenSSL soit présent sur votre machine. Installation possible avec la commande : `choco install openssl`

---

## Déploiement du projet en local
### Clonage dépôt Git:
- Rendez-vous sur le dépot GIT fourni

- Copiez le lien https dans le bouton vert "Code"

- Sur votre terminal, dirigez-vous vers votre dossier de travail

- Utilisez la commande git clone et collez le lien

- Sur VSC, ouvrez le dossier de travail et accédez au code

<br/>

### Variables d'environnement:
- Créez un fichier .env.local à la racine de votre projet et y ajouter les variables d'environnement suivantes :
  - APP_ENV=dev
  - Configurez la DATABASE_URL avec vos informations de base de données: Exemple avec mySql : `DATABASE_URL="mysql://identiant:mot-de-passe@url:port/database`

- Création compte MailJet  
Chaque action sur le site (Activation ou désactivation d'un partenaire, club ou permission, Ajout, mise à jour, suppression de partenaire, club ou permission) génère automatiquement l'envoi d'un email au contact du partenaire et/ou au manager du club.  
Cette fonctionnalité d'envoi est basée sur [MailJet](https://www.mailjet.com/fr/), il est donc impératif de créer un compte au préalable chez [MailJet](https://www.mailjet.com/fr/) est d'indiquer vos clés de la façon suivante dans le fichier .env.local :
  - MJ_APIKEY_PUBLIC='votre clé Mailjet publique'
  - MJ_APIKEY_PRIVATE='votre clé MailJet privée'  
Il sera ensuite nécessaire de créer 2 modèles d'email transactionnel et de modifier les TemplateID dans la class Mail.

<br/>

### Installation dépendances:
- Installez les dépendances PHP via la commande : `composer install`
- Installez les dépendances NPM via la commande : `npm install`

<br/>

### Création de la base de données:

- Si la base de données est configurée mais pas créée, executez la commande suivante : `php bin/console doctrine:database:create`

- Puis lancez les migrations via la commande suivante : `php bin/console doctrine:migrations:migrate`

<br/>

### Compte d'un utilisateur de l'équipe technique:

- D'abord, hashez le mot de passe avec la commande suivante : `php bin/console security:hash-password`

- Créez un uuid grâce au site : https://www.uuidgenerator.net/version4

- Ensuite sur votre gestionnaire de base de données, executez la requête suivante en remplaçant l'email, le mot de passe avec celui hashé précédemment, le prénom, le nom, et l'uuid généré précédemment :

  `INSERT INTO user (email, roles, password, firstname, lastname, is_active, has_created_pwd, uuid) VALUES ('email', '["ROLE_TECHNICAL"]', 'mot_de_passe', 'prenom', 'nom', 1, 1, 'uuid');`
  
<br/>

### Ajout de valeurs de test dans la base de données
Si vous le souhaitez, un  fichier SQL est disponible dans le dossier Annexes à la racine du projet, nommé [08 - sql-xtrem-insert-testValues.sql](https://github.com/Mat-Boo/xtrem/blob/main/Annexes/08%20-%20Sql%20-%20Insert%20testValues%20-%20ECF%20-%20Xtrem.sql).  
Ce fichier reprend les commandes SQL d'insertion de valeurs dans toutes les tables de l'application.

<br/>

### Génération des clés SSL pour Lexik
Le package Lexik est utilisé pour générer le token JWT à l'authentification utilisateur.  
Pour la mise en place du projet, il est nécéssaire de générer la paire de clés SSL avec la commande suivante : `php bin/console lexik:jwt:generate-keypair`  
(Rappel : Comme vu plus haut, OpenSSL est nécessaire)

<br/>

### Lancement du projet:
- Lancez d'abord la commande suivante : `npm run build`
- Lancez le projet avec la commande : `php -S 127.0.0.1:8000 -t public/`

---


## Déploiement du projet en ligne

Le site est actuellement en ligne ici : https://xtrem-studi.fly.dev/  
Le déploiement a été effectué sur Heroku et récupéré sur Fly.io car Heroku est devenu payant.

### Deploiement sur Heroku

- Crééz un compte sur heroku.com

- Crééz ensuite une app

- Liez votre dépôt GitHub (créé au préalable)

- Ajouter la dépendance suivante afin de créer automatiqument les fichiers necessaires au déploiement d'un projet symfony sur Heroku : `composer install nat/deploy`

- Executez la commande : `php bin/console nat:heroku`

- Répondez aux questions avec votre identifiant Heroku, votre clé API Heroku, votre nom d'app sur Heroku et ajoutez clearDb.  
Les fichiers Procfil, htaccess et .env.php seront créé automatiquement.
Les variables d'environnement seront créés automatiquement sur Heroku et l'addon clearDB sera ajouté sur Heroku.

- Supprimez ensuite cette dépendance via la commande : `composer remove nat/deploy`

- Exportez votre base de données vers clearDb (Vous pouvez retrouver les identifiants directement dans l'onglet Settings sur Heroku au niveau des Config Vars : CLEAR_DB_NAT_URL)

- Il ne reste plus qu'à executer les commandes GIT habituelles (add, commit et push)

---

## Connexion à l'interface
Il existe 3 accès différents :
- L'équipe technique (assimilée à l'administrateur) qui a un accès total pour visualiser, créer, modifier et supprimer les partenaires, clubs et permissions.
- Les contacts des partenaires qui ont juste un accès en lecture sur le partenaire concerné et leurs clubs.
- Les managers des clubs qui ont un juste un accès en lecture sur leur club.

Vous retrouvez les identifiants dans le modèle de copie transmis chez Studi.