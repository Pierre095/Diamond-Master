# Diamond Master (dernier commit à 23h59)

## Commandes

Voici les commandes pour pouvoir faire fonctionner mon jeu : 
- npm install nodejs
- npm install express mysql
- npm install mysql
- npm install bcrypt
- npm install express-session

et pour lancer le jeu il faudra faire :
 - node server.js

 et voici le code SQL afin de créer la base de donnée : 

```sql
CREATE TABLE Player (
    PlayerID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(191) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);


CREATE TABLE Niveau (
    NiveauID INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(255) NOT NULL,
    DebloqueApresNiveauID INT,
    FOREIGN KEY (DebloqueApresNiveauID) REFERENCES Niveau(NiveauID)
);


CREATE TABLE Score (
    ScoreID INT AUTO_INCREMENT PRIMARY KEY,
    PlayerID INT NOT NULL,
    NiveauID INT NOT NULL,
    MeilleurTemps DECIMAL(10,2),
    TempsTotal DECIMAL(10,2),
    FOREIGN KEY (PlayerID) REFERENCES Player(PlayerID),
    FOREIGN KEY (NiveauID) REFERENCES Niveau(NiveauID)
);
```

## Concept du jeu

Le jeu que j'ai créer s'inspire principalement du jeu déjà existant **HellTaker**

Dans le jeu vous êtes un petit **personnage** qui doit atteindre un **diamant**, qui une fois récupérer vous fait passer au **niveau suivant**.
Sur la route du diamant on pourra y retrouver quelques **bloc**, **mobs**, **pièges**, **clé** et **porte** qui ont tous un fonctionnalité particulière créant ainsi un **labyrinthe** dans lequel il faudra se frayer un chemin.

Le personnage a un nombre de **déplacement limité** par niveau et un **timer** pour calculer le temps passer dans le niveau.

## Fonctionnement du jeu 

Comme je l'ai, dit sur la route du diamant il y a plusieurs éléments :
 - le **bloc** : peut être pousser de une **case** par une **case**, s'il y a un autre **élément** (sauf clé et pièges) le bloc ne pourra pas être poussé.
 - le **mob** : tout comme le bloc peut être pousser dans une case **vide**, mais si il est pousser dans un **élément** (sauf clé) le mob sera **éliminé**, particularité si le mob est sur un **piège**, celui-ce est également **éliminé**.
 - la **clé** et la **porte** : la **clé** peut être récuperer afin d'ouvrir la **porte**, si celle-ci n'a pas été récupérer alors il sera impossible d'ouvrir la porte.
 - le piège : il y en a deux : 
    - le piège **actif** : lorsque vous passer sur le piège vous **perdez un déplacement en plus**.
    - le piège **désactivé** : celui ne fait rien et informe simplement qu'il y a un piège à cet endroit
    - les deux piège (selon le niveau) s'**alterne** lorsque le joueur fait un **déplacement**, c'est-à-dire que si un piège est **désactivé** lorsque le joueur va se **déplacer** celui-ci va s'**activer** et **inversement**, tout au long du niveau.
 - le **diamant** : symbolise l'arrivée et permet de passer au niveau suivant.

Le joueur à possibilité de s'inscrire et de se connecter pour ensuite avec accès a son compte, pour voir ses informations et ses performances, ainsi qu'à la possibilité de se déconnecter.

## Points de difficulté dans le code

Difficulté au niveau : 
 - gestion de l'etat actif/passif des pièges
 - gestion de l'inscription/connexion de l'utilisateur
 - récupération du timer une fois le niveau fini pour pouvoir l'afficher dans la BDD


## Déroulement des étapes

j'ai commencé par coder la casi totalité du jeu avant de faire la base de donnée pour être sur des valeurs que je souhaitai inclure dedans.

## Construction de la BDD

#### Player
- **PlayerID** INT AUTO_INCREMENT PRIMARY KEY
- **Username** VARCHAR(191) UNIQUE NOT NULL
- **Password** VARCHAR(255) NOT NULL

#### Niveau
- **NiveauID** INT AUTO_INCREMENT PRIMARY KEY
- **Nom** VARCHAR(255) NOT NULL
- **DebloqueApresNiveauID** INT, FOREIGN KEY REFERENCES Niveau(NiveauID)

#### Score
- **ScoreID** INT AUTO_INCREMENT PRIMARY KEY
- **PlayerID** INT NOT NULL, FOREIGN KEY REFERENCES Player(PlayerID)
- **NiveauID** INT NOT NULL, FOREIGN KEY REFERENCES Niveau(NiveauID)
- **MeilleurTemps** DECIMAL(10,2)
- **TempsTotal** DECIMAL(10,2)

### Relations

- **Player** 1----N **Score**
  - Un joueur peut avoir plusieurs scores enregistrés pour différents niveaux.

- **Niveau** 1----N **Score**
  - Un niveau peut être joué par plusieurs joueurs, générant ainsi de multiples scores.

- **Niveau** 1----1 **Niveau**
  - Un niveau peut débloquer l'accès à un autre niveau, formant une chaîne de progression de niveaux.
.

