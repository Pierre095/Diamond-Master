const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de express-session
app.use(session({
  secret: 'secret très secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // `true` en production avec HTTPS
}));

const connection = mysql.createConnection({
  host: 'mysql-bouffies.alwaysdata.net',
  user: 'bouffies',
  password: 'Handball*95640',
  database: 'bouffies_diamond_master'
});

connection.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à MySQL');
});

app.use(express.static('public'));

app.post('/inscription', async (req, res) => {
  const { username, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).send('Les mots de passe ne correspondent pas.');
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = 'INSERT INTO Player (Username, Password) VALUES (?, ?)';
    connection.query(query, [username, hashedPassword], (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'insertion:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).send('Ce nom d\'utilisateur est déjà pris.');
        } else {
          return res.status(500).send('Erreur lors de l\'inscription.');
        }
      }
      req.session.userId = results.insertId;
      req.session.username = username; // Stocker le nom d'utilisateur dans la session
      req.session.isLoggedIn = true;
      res.redirect('/inscription-reussie.html'); // Assurez-vous que cette route existe et qu'elle est correctement gérée par votre serveur
    });
  } catch (error) {
    console.error('Erreur lors du hashage du mot de passe:', error);
    res.status(500).send('Erreur serveur.');
  }
});

app.post('/connexion', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT PlayerID, Password FROM Player WHERE Username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }

    if (results.length > 0) {
      const { PlayerID, Password: hashedPassword } = results[0];
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (isMatch) {
          req.session.userId = PlayerID;
          req.session.username = username; // Stocker le nom d'utilisateur dans la session
          req.session.isLoggedIn = true;
          res.redirect('/connexion-reussie.html'); // Assurez-vous que cette route existe et qu'elle est correctement gérée par votre serveur
        } else {
          res.status(401).json({ success: false, message: 'Nom d’utilisateur ou mot de passe incorrect' });
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Nom d’utilisateur ou mot de passe incorrect' });
    }
  });
});


app.get('/api/get-username', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: 'Utilisateur non connecté' });
  }
  const query = 'SELECT Username FROM Player WHERE PlayerID = ?';
  connection.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du username:', err);
      return res.status(500).send({ error: 'Erreur serveur' });
    }
    if (results.length > 0) {
      return res.json({ username: results[0].Username });
    } else {
      return res.status(404).send({ error: 'Utilisateur non trouvé' });
    }
  });
});

app.post('/api/enregistrer-temps', (req, res) => {
  console.log(`Réception du serveur - Niveau ID: ${req.body.niveauId}, MeilleurTemps: ${req.body.temps}, TempsTotal: ${req.body.total}`); // Ajoute cette ligne
  if (!req.session.userId) {
    return res.status(401).send({ message: 'Veuillez vous connecter pour enregistrer votre temps.' });
  }

  const { niveauId, temps, total } = req.body;

  const query = `
    INSERT INTO Score (PlayerID, NiveauID, MeilleurTemps, TempsTotal)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(query, [req.session.userId, niveauId, temps, total], (err) => {
    if (err) {
      console.error('Erreur lors de l\'enregistrement du temps:', err);
      return res.status(500).send({ message: 'Erreur lors de l\'enregistrement du temps.' });
    }
    res.send({ message: 'Temps enregistré avec succès.' });
  });
});

app.get('/api/dernier-temps', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ message: 'Veuillez vous connecter pour accéder à cette information.' });
  }

  const { niveauId } = req.query; // Récupère l'ID du niveau depuis les paramètres de requête

  const query = `
    SELECT MeilleurTemps, TempsTotal FROM Score
    WHERE PlayerID = ? AND NiveauID = ?
    ORDER BY ScoreID DESC
    LIMIT 1;
  `;

  connection.query(query, [req.session.userId, niveauId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du dernier temps:', err);
      return res.status(500).send({ message: 'Erreur lors de la récupération des données.' });
    }
    if (results.length > 0) {
      // Assure que les clés MeilleurTemps et TempsTotal sont présentes même si elles sont NULL
      const dernierTemps = {
        MeilleurTemps: results[0].MeilleurTemps != null ? results[0].MeilleurTemps : null,
        TempsTotal: results[0].TempsTotal != null ? results[0].TempsTotal : null,
      };
      res.json(dernierTemps); // Renvoie le dernier temps enregistré
    } else {
      res.status(404).send({ message: 'Aucun temps trouvé pour ce niveau.' });
    }
  });
});

app.get('/api/temps-total', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ message: 'Veuillez vous connecter pour accéder à cette information.' });
  }

  const query = `
    SELECT SUM(TempsTotal) AS TempsTotalGlobal FROM Score
    WHERE PlayerID = ?;
  `;

  connection.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du temps total:', err);
      return res.status(500).send({ message: 'Erreur lors de la récupération des données.' });
    }
    if (results.length > 0) {
      res.json({ TempsTotalGlobal: results[0].TempsTotalGlobal || 0 });
    } else {
      res.status(404).send({ message: 'Aucun temps trouvé.' });
    }
  });
});

app.get('/api/niveaux-debloques', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Utilisateur non connecté');
  }

  const query = `
  SELECT n.NiveauID, n.Nom,
        CASE 
            WHEN n.DebloqueApresNiveauID IS NULL THEN TRUE
            WHEN n.DebloqueApresNiveauID IN (
                SELECT NiveauID FROM Score WHERE PlayerID = ? AND MeilleurTemps < 99999999.99
            ) THEN TRUE
            ELSE FALSE
        END as Debloque
  FROM Niveau n
  ORDER BY n.NiveauID ASC;
  `;
  connection.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des niveaux débloqués:', err);
      return res.status(500).send('Erreur serveur');
    }
    res.json(results);
  });
});







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
