
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'data/mymood.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
      console.error('Error opening database', err);
  } else {
      console.log('Database connected');
  }
});

// Initialiser la base de données et créer des tables
db.serialize(() => {
  // Créer la table `role`
  db.run(`
    CREATE TABLE IF NOT EXISTS role(
        id_role INTEGER PRIMARY KEY AUTOINCREMENT,
        nom_role VARCHAR(100) UNIQUE
    );
  `);
  
  // Créer la table `groupe`
  db.run(`
    CREATE TABLE IF NOT EXISTS groupe(
      id_groupe INTEGER PRIMARY KEY AUTOINCREMENT,
      nom_groupe VARCHAR(100) NOT NULL,
      blacklist BOOLEAN DEFAULT 0
    );
  `);

  // Créer la table `user`
  db.run(`
    CREATE TABLE IF NOT EXISTS user(
      id_user INTEGER PRIMARY KEY AUTOINCREMENT,
      nom VARCHAR(100),
      prenom VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      id_role INTEGER NOT NULL,
      FOREIGN KEY(id_role) REFERENCES role(id_role)
    );
  `);

  // créer la table 'mood' avec une relation vers 'user'
  db.run(`
    CREATE TABLE IF NOT EXISTS mood(
      id_mood INTEGER PRIMARY KEY AUTOINCREMENT,
      id_user INTEGER NOT NULL,
      update_date DATE NOT NULL,
      score INTEGER CHECK (score BETWEEN 0 AND 100) DEFAULT 0,
      en_alerte BOOLEAN DEFAULT 0,
      FOREIGN KEY (id_user) REFERENCES user(id_user)
    );
  `);

  // Créer la table 'inscription' avec une relation vers 'groupe' et 'user'
  db.run(`
    CREATE TABLE IF NOT EXISTS inscription(
      id_user INTEGER NOT NULL,
      id_groupe INTEGER NOT NULL,
      est_responsable BOOLEAN DEFAULT 0,
      PRIMARY KEY(id_user, id_groupe),
      FOREIGN KEY(id_user) REFERENCES user(id_user),
      FOREIGN KEY(id_groupe) REFERENCES groupe(id_groupe)
    );
  `);

  // Créer la table 'blacklist'
  db.run(`
    CREATE TABLE IF NOT EXISTS blacklist(
      id_user INTEGER NOT NULL,
      id_blacklist INTEGER NOT NULL,
      est_superviseur BOOLEAN DEFAULT 0,
      PRIMARY KEY(id_user, id_blacklist),
      FOREIGN KEY(id_blacklist) REFERENCES groupe(id_groupe),
      FOREIGN KEY(id_user) REFERENCES user(id_user)
    );
  `);
 
  // Insérer les rôles par défaut (admin, superviseur, étudiant)
  db.run(`INSERT OR IGNORE INTO role (nom) 
    VALUES ('admin'), ('superviseur'), ('étudiant')
  `);
  
  // Insérer un groupe par défaut si la table `groupe` est vide
  const groupe1 = "Formation 1";
  const groupe2 = "Formation 2";
  const blacklist1 = "blacklist superviseur 1";

  db.get('SELECT COUNT(*) AS count FROM groupe', (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT or IGNORE INTO groupe (nom) VALUES (?), (?), (?)`, [groupe1,groupe2, blacklist1] , function(err) {
        if (!err) {
          const groupId = this.lastID;
        }
      });
    }
  });

  // Insérer un utilisateur admin par défaut si la table `users` est vide
  const adminEmail = 'admin@test.com';
  const adminPassword = '$2a$10$uNxiwGTw8oqCeEWybp/DJen6GWrCseDxnu9m4uJluTfWSzR.4P6Uu';
  const adminRoleId = 1; // id du rôle admin
  const superviseurEmail = "super@test.com";
  const superviseurPassword = '$2a$10$uNxiwGTw8oqCeEWybp/DJen6GWrCseDxnu9m4uJluTfWSzR.4P6Uu';
  const superviseurRoleId = 2; // id du rôle superviseur
  const etudiantEmail = "etud@test.com";
  const etudiantPassword = '$2a$10$uNxiwGTw8oqCeEWybp/DJen6GWrCseDxnu9m4uJluTfWSzR.4P6Uu';
  const etudiantRoleId = 3; // id du rôle étudiant

  db.get('SELECT COUNT(*) AS count FROM user', (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT or IGNORE INTO user (email, password, id_role) VALUES (?, ?, ?),(?, ?, ?),(?, ?, ?)`, [adminEmail, adminPassword, adminRoleId, superviseurEmail, superviseurPassword, superviseurRoleId, etudiantEmail,etudiantPassword, etudiantRoleId], function(err) {
        if (!err) {
          const userId = this.lastID;
        }
      });
    }
  });
});

module.exports = db;
