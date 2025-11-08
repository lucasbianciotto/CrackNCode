# 🏴‍☠️ Crack'N Code

**Apprends à coder en jouant !**

Crack'N Code est une plateforme d'apprentissage interactive qui te permet de maîtriser 8 langages de programmation à travers des défis captivants et des mini-jeux.

🌐 **Application en ligne** : [https://crackn-code.alwaysdata.net/](https://crackn-code.alwaysdata.net/)

---

## ✨ Fonctionnalités

- 🎮 **Apprentissage gamifié** : Progresse à travers différents niveaux de difficulté
- 💻 **8 langages de programmation** : HTML/CSS, JavaScript, Python, Java, C++, PHP, SQL, et plus
- 👤 **Authentification Google OAuth** : Connexion sécurisée avec ton compte Google
- 📊 **Système de progression** : Suis ton avancement et débloque de nouveaux niveaux
- 🎯 **Défis interactifs** : Résous des problèmes de code en temps réel
- 🤖 **Assistant Crack'n** : Un chatbot pirate pour t'aider dans ton aventure

---

## 🛠️ Stack Technique

### Frontend
- **React** avec Vite
- **TypeScript**
- **Tailwind CSS** pour le styling
- **Socket.io Client** pour la communication temps réel

### Backend
- **Node.js** avec Express
- **TypeScript**
- **Prisma ORM** pour la gestion de base de données
- **MySQL** comme base de données
- **Socket.io** pour le temps réel
- **Passport.js** avec Google OAuth 2.0

### Déploiement
- Hébergement : **AlwaysData**
- Base de données : **MySQL** (AlwaysData)

---

## 🚀 Installation et Lancement en Local

Ce guide vous explique comment installer et lancer l'application Crack'N Code sur votre machine locale.

### 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure) - [Télécharger Node.js](https://nodejs.org/)
- **npm** (inclus avec Node.js) ou **yarn**
- **MySQL** installé localement - [Télécharger MySQL](https://dev.mysql.com/downloads/mysql/)
- Un compte **Google** pour créer les identifiants OAuth (gratuit)

### Étape 1 : Cloner le repository

```bash
git clone https://github.com/lucasbianciotto/CrackNCode.git
cd CrackNCode
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

Cette commande installera toutes les dépendances nécessaires au projet (frontend et backend).

### Étape 3 : Créer une base de données MySQL locale

#### Option A : Utiliser MySQL en ligne de commande

1. **Connectez-vous à MySQL** :
```bash
mysql -u root -p
```

2. **Créez une base de données** :
```sql
CREATE DATABASE crackncode;
```

3. **Créez un utilisateur MySQL** (recommandé pour la sécurité) :
```sql
CREATE USER 'crackncode_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe_ici';
GRANT ALL PRIVILEGES ON crackncode.* TO 'crackncode_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Note :** Remplacez `votre_mot_de_passe_ici` par un mot de passe sécurisé de votre choix.

#### Option B : Utiliser phpMyAdmin ou un autre outil graphique

1. Ouvrez phpMyAdmin (ou votre outil de gestion MySQL)
2. Créez une nouvelle base de données nommée `crackncode`
3. Créez un nouvel utilisateur avec tous les droits sur cette base de données

### Étape 4 : Créer un projet Google OAuth

Pour permettre la connexion avec Google, vous devez créer un projet OAuth dans Google Cloud Console :

1. **Accédez à Google Cloud Console** :
   - Allez sur [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Connectez-vous avec votre compte Google

2. **Créez un nouveau projet** :
   - Cliquez sur le sélecteur de projet en haut
   - Cliquez sur "Nouveau projet"
   - Donnez un nom à votre projet (ex: "CrackNCode Local")
   - Cliquez sur "Créer"

3. **Configurez l'écran de consentement OAuth** :
   - Allez dans "APIs & Services" > "Écran de consentement OAuth"
   - Sélectionnez "Externe" (pour le développement local)
   - Remplissez les informations de base :
     - Nom de l'application : `CrackNCode`
     - Email de support utilisateur : votre email
     - Email du développeur : votre email
   - Cliquez sur "Enregistrer et continuer"
   - Ajoutez votre email dans "Scopes" (laissez par défaut)
   - Ajoutez votre email dans "Utilisateurs de test" (pour tester en local)
   - Cliquez sur "Enregistrer et continuer"

4. **Créez des identifiants OAuth 2.0** :
   - Allez dans "APIs & Services" > "Identifiants"
   - Cliquez sur "+ CRÉER DES IDENTIFIANTS" > "ID client OAuth 2.0"
   - Sélectionnez "Application Web"
   - Donnez un nom à votre client (ex: "CrackNCode Local Dev")
   - **Ajoutez les URI autorisées** :
     - **Origines JavaScript autorisées** :
       ```
       http://localhost:8080
       ```
     - **URI de redirection autorisés** :
       ```
       http://localhost:4000/auth/google/callback
       ```
   - Cliquez sur "Créer"

5. **Copiez vos identifiants** :
   - Vous verrez votre `CLIENT_ID` et `CLIENT_SECRET`
   - **Important :** Copiez-les immédiatement, vous ne pourrez plus voir le secret plus tard !

### Étape 5 : Configurer le fichier `.env`

1. **Créez un fichier `.env`** à la racine du projet :
```bash
# Sur Windows (PowerShell)
New-Item -Path .env -ItemType File

# Sur Linux/Mac
touch .env
```

2. **Ajoutez le contenu suivant dans le fichier `.env`** :

```env
# Base de données MySQL
# Format: mysql://utilisateur:mot_de_passe@localhost:3306/nom_de_la_base
DATABASE_URL="mysql://crackncode_user:votre_mot_de_passe_ici@localhost:3306/crackncode"

# Google OAuth
# Remplacez par les valeurs obtenues dans Google Cloud Console
GOOGLE_CLIENT_ID="votre_client_id_google_ici"
GOOGLE_CLIENT_SECRET="votre_client_secret_google_ici"
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"

# Secret de session (générez une chaîne aléatoire)
# Vous pouvez générer un secret avec : openssl rand -base64 32
# Ou utiliser un générateur de mot de passe aléatoire
SESSION_SECRET="générez_une_chaîne_aléatoire_très_longue_et_sécurisée_ici"

# URLs de l'application en local
CLIENT_ORIGIN="http://localhost:8080"
VITE_API_BASE_URL="http://localhost:4000"

# Environnement
NODE_ENV="development"
```

3. **Remplissez les valeurs** :
   - `DATABASE_URL` : Remplacez `crackncode_user` et `votre_mot_de_passe_ici` par les valeurs que vous avez créées à l'étape 3
   - `GOOGLE_CLIENT_ID` : Collez votre Client ID de Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` : Collez votre Client Secret de Google Cloud Console
   - `SESSION_SECRET` : Générez une chaîne aléatoire sécurisée (vous pouvez utiliser [ce générateur](https://randomkeygen.com/) ou exécuter `openssl rand -base64 32`)

**Exemple de fichier `.env` complété** :
```env
DATABASE_URL="mysql://crackncode_user:MonMotDePasse123@localhost:3306/crackncode"
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz"
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"
SESSION_SECRET="MaChaineAleatoireSuperSecrete123456789"
CLIENT_ORIGIN="http://localhost:8080"
VITE_API_BASE_URL="http://localhost:4000"
NODE_ENV="development"
```

### Étape 6 : Initialiser la base de données avec Prisma

1. **Générer le client Prisma** :
```bash
npm run prisma:generate
```
Cette commande génère le client Prisma basé sur le schéma de la base de données.

2. **Exécuter les migrations** (crée les tables dans la base de données) :
```bash
npm run prisma:migrate
```
Cette commande va :
- Créer toutes les tables nécessaires dans votre base de données MySQL
- Exécuter les migrations Prisma
- Générer automatiquement le client Prisma

**Note :** Si vous obtenez une erreur, vérifiez que :
- MySQL est bien démarré
- La base de données `crackncode` existe
- Les identifiants dans `DATABASE_URL` sont corrects

### Étape 7 : Lancer l'application

1. **Lancez l'application en mode développement** :
```bash
npm run dev
```

Cette commande va lancer :
- ✅ Le serveur backend sur `http://localhost:4000`
- ✅ Le frontend Vite sur `http://localhost:8080`

2. **Accédez à l'application** :
   - Ouvrez votre navigateur sur [http://localhost:8080](http://localhost:8080)
   - Vous devriez voir la page d'accueil de Crack'N Code

3. **Testez la connexion Google** :
   - Cliquez sur "Se connecter avec Google"
   - Vous serez redirigé vers Google pour vous authentifier
   - Après authentification, vous serez redirigé vers l'application

### 🎉 C'est tout !

Votre application Crack'N Code est maintenant installée et fonctionne en local ! 

**Prochaines étapes :**
- Explorez les différents langages de programmation
- Complétez les défis pour progresser
- Personnalisez votre avatar de pirate

---

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev                    # Lance le frontend et backend en mode développement
npm run dev:client             # Lance uniquement le frontend (port 8080)
npm run dev:server             # Lance uniquement le backend (port 4000)

# Production
npm run build                  # Build le frontend pour la production
npm run start                  # Lance le serveur en mode production

# Base de données
npm run prisma:generate        # Génère le client Prisma
npm run prisma:migrate         # Crée et exécute les migrations (développement)
npm run prisma:migrate:deploy  # Exécute les migrations existantes (production)
npm run prisma:push            # Push le schéma vers la base sans migration
npm run prisma:studio          # Ouvre Prisma Studio (interface graphique pour la BDD)

# Utilitaires
npm run lint                   # Vérifie le code avec ESLint
```

### 🔍 Outils utiles

**Prisma Studio** : Interface graphique pour visualiser et modifier votre base de données
```bash
npm run prisma:studio
```
Ouvre une interface web sur `http://localhost:5555` pour gérer vos données MySQL.

---

## 📁 Structure du Projet

```
CrackNCode/
├── client/              # Code source du frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Composants React réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── hooks/         # Hooks React personnalisés
│   │   └── utils/         # Fonctions utilitaires
│   └── public/          # Fichiers statiques
├── server/             # Code source du backend (Node.js + Express)
│   ├── routes/        # Routes de l'API
│   ├── controllers/   # Contrôleurs
│   ├── middleware/    # Middlewares Express
│   └── index.js       # Point d'entrée du serveur
├── prisma/             # Schéma et migrations Prisma
│   ├── schema.prisma    # Schéma de la base de données
│   └── migrations/     # Fichiers de migration
├── public/             # Assets publics
├── dist/               # Build du frontend (généré)
├── .env                # Variables d'environnement (NE PAS COMMITTER)
├── package.json        # Dépendances et scripts
└── README.md           # Ce fichier
```

---

## ⚠️ Notes Importantes

### 🔒 Sécurité
- **⚠️ Ne jamais committer le fichier `.env`** - Il contient des informations sensibles (mots de passe, clés API)
- Le fichier `.env` est déjà dans `.gitignore`, mais vérifiez qu'il n'est pas dans vos commits
- Utilisez des secrets forts pour `SESSION_SECRET` (minimum 32 caractères aléatoires)
- En production, HTTPS est obligatoire pour OAuth

### 🗄️ Base de données (Prisma)
- **Après chaque modification du schéma Prisma** (`prisma/schema.prisma`), exécutez :
  ```bash
  npm run prisma:generate
  npm run prisma:migrate
  ```
- Pour créer une nouvelle migration avec un nom spécifique : `npx prisma migrate dev --name nom_migration`
- Pour visualiser la BDD : `npm run prisma:studio`
- Pour réinitialiser la base de données (⚠️ supprime toutes les données) :
  ```bash
  npx prisma migrate reset
  ```

### 💻 Développement
- Le **hot-reload** est actif sur le frontend et le backend : vos modifications sont prises en compte automatiquement
- Les logs du serveur apparaissent dans le terminal où vous avez lancé `npm run dev`
- Le frontend est accessible sur `http://localhost:8080`
- Le backend API est accessible sur `http://localhost:4000`

### 🐛 Résolution de problèmes

#### L'application ne démarre pas
- Vérifiez que MySQL est bien démarré
- Vérifiez que le port 4000 et 8080 ne sont pas utilisés par d'autres applications
- Vérifiez que toutes les dépendances sont installées : `npm install`

#### Erreur de connexion à la base de données
- Vérifiez que MySQL est bien démarré
- Vérifiez que la base de données `crackncode` existe
- Vérifiez les identifiants dans `DATABASE_URL` (utilisateur, mot de passe, nom de la base)
- Testez la connexion MySQL : `mysql -u crackncode_user -p crackncode`

#### OAuth Google ne fonctionne pas
- Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont corrects
- Vérifiez que les URLs dans Google Cloud Console correspondent exactement :
  - Origines JavaScript : `http://localhost:8080`
  - URI de redirection : `http://localhost:4000/auth/google/callback`
- Vérifiez que votre compte Google est dans la liste des "Utilisateurs de test" (pour le développement)

#### Les migrations Prisma échouent
- Vérifiez que la base de données existe : `SHOW DATABASES;`
- Vérifiez que l'utilisateur MySQL a tous les droits sur la base
- Essayez de réinitialiser : `npx prisma migrate reset` (⚠️ supprime les données)

---

## 👥 Contributeurs

- **Lucas BIANCIOTTO** - [lucasbianciotto](https://github.com/lucasbianciotto)
- **Rayane BOUDAOUDI**
- **Amel BOUNNECHE**
- **Dorian DI DOMENICO**
- **Fabio VIO
- **Hugo BOGOSSIAN**
- **Killian ORSAL**
- **Fabio VOLIANI**

---


## 🚀 Déploiement en Production

L'application est actuellement déployée sur AlwaysData. 

**Note :** Pour déployer votre propre version en production, vous devrez :
- Configurer un serveur web (AlwaysData, Heroku, Vercel, etc.)
- Créer une base de données MySQL en production
- Configurer les variables d'environnement pour la production
- Mettre à jour les URLs OAuth dans Google Cloud Console
- Builder l'application et la déployer

Pour plus de détails sur le déploiement, consultez la documentation de votre hébergeur.

---

**Équipe Crack'N Code - Apprends à coder en naviguant sur les mers du code ! 🏴‍☠️**
