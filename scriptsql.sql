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


-- npm install nodejs
-- npm install express mysql
-- npm install mysql
-- npm install bcrypt
-- npm install express-session

