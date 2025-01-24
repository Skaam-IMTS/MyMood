
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
        nom VARCHAR(100) UNIQUE
    );
  `);
  
  // Créer la table `groupe`
  db.run(`
    CREATE TABLE IF NOT EXISTS groupe(
      id_groupe INTEGER PRIMARY KEY AUTOINCREMENT,
      nom VARCHAR(100) NOT NULL
    );
  `);

  // Créer la table `users`
  db.run(`
    CREATE TABLE IF NOT EXISTS users(
        id_users INTEGER PRIMARY KEY AUTOINCREMENT,
        nom VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) UNIQUE NOT NULL,
        id_role INTEGER NOT NULL,
        FOREIGN KEY(id_role) REFERENCES role(id_role)
    );
  `);

  // Créer la table `admin` avec une relation vers `users`
  db.run(`
    CREATE TABLE IF NOT EXISTS admin(
      id_admin INTEGER PRIMARY KEY,
      FOREIGN KEY (id_admin) REFERENCES users(id_users) ON DELETE CASCADE
    );
  `);

  // Créer la table `etudiant` avec une relation vers `users'
  db.run(`
    CREATE TABLE IF NOT EXISTS etudiant(
      id_etudiant INTEGER PRIMARY KEY,
      FOREIGN KEY (id_etudiant) REFERENCES users(id_users) ON DELETE CASCADE
    );
  `);

  // Créer la table 'superviseur' avec une relation vers `users'
  db.run(`
  CREATE TABLE IF NOT EXISTS superviseur (
    id_superviseur INTEGER PRIMARY KEY,
    FOREIGN KEY (id_superviseur) REFERENCES users(id_users) ON DELETE CASCADE
  );
  `);

  // créer la table 'mood' avec une relation vers 'etudiant'
  db.run(`
    CREATE TABLE IF NOT EXISTS mood(
      id_mood INTEGER PRIMARY KEY AUTOINCREMENT,
      id_user INTEGER NOT NULL,
      date DATE NOT NULL,
      score INTEGER CHECK (score BETWEEN 0 AND 100) DEFAULT 0,
      FOREIGN KEY (id_user) REFERENCES etudiant(id_user)
    );
  `);

  // Créer la table 'responsable' avec une relation vers 'groupe' et 'superviseur'
  db.run(`
    CREATE TABLE IF NOT EXISTS responsable(
      id_superviseur INTEGER,
      id_groupe INTEGER,
      PRIMARY KEY(id_superviseur, id_groupe),
      FOREIGN KEY(id_superviseur) REFERENCES superviseur(id_superviseur),
      FOREIGN KEY(id_groupe) REFERENCES groupe(id_groupe)
    );
  `);

  // Créer la table 'inscription' avec une relation vers 'groupe' et 'etudiant'
  db.run(`
    CREATE TABLE IF NOT EXISTS inscription(
      id_etudiant INTEGER,
      id_groupe INTEGER NOT NULL,
      PRIMARY KEY(id_etudiant),
      FOREIGN KEY(id_etudiant) REFERENCES etudiant(id_etudiant),
      FOREIGN KEY(id_groupe) REFERENCES groupe(id_groupe)
    );
  `);

  // créer la table 'blacklist' avec une relation vers 'superviseur' et 'is_blacklisted'
  db.run(`
    CREATE TABLE IF NOT EXISTS blacklist(
      id_blacklist INTEGER,
      nom TEXT,
      id_superviseur INTEGER NOT NULL,
      PRIMARY KEY(id_blacklist),
      UNIQUE(id_superviseur),
      FOREIGN KEY(id_superviseur) REFERENCES superviseur(id_superviseur)
  );
  `);

  // créer la table 'is_blacklisted' avec une relation vers 'blacklist' et 'etudiant'
  db.run(`
    CREATE TABLE IF NOT EXISTS is_blacklisted(
      id_blacklist INTEGER,
      id_etudiant INTEGER NOT NULL,
      PRIMARY KEY(id_blacklist, id_etudiant),
      FOREIGN KEY(id_blacklist) REFERENCES blacklist(id_blacklist),
      FOREIGN KEY(id_etudiant) REFERENCES etudiant(id_etudiant)
    );
  `);
 
  // Insérer les rôles par défaut (admin, superviseur, étudiant)
  db.run(`INSERT OR IGNORE INTO role (nom) 
    VALUES ('admin'), ('superviseur'), ('etudiant')
  `);

  // Insérer un utilisateur admin par défaut si la table `users` est vide
  const defaultEmail = 'test';
  const defaultPassword = '$2a$10$u0neBLXT221r2Un2VxM24.mTuQXYWVAzhQctxqv9if8KCbmh7FO.i';
  const adminRoleId = 1; // id du rôle admin

  db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO users (email, password, id_role) VALUES (?, ?, ?)`, [defaultEmail, defaultPassword, adminRoleId], function(err) {
        if (!err) {
          const userId = this.lastID;
        }
      });
    }
  });
});

module.exports = db;
