const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Utiliser la variable d'environnement pour le chemin de la base de données
const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'data/mymood.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
      console.error('Erreur de connexion à la base de données:', err);
  } else {
      console.log('Base de données connectée');
  }
});

db.serialize(() => {
      // Créer la table `role`
      db.run(`
        CREATE TABLE IF NOT EXISTS role(
            role VARCHAR(100) PRIMARY KEY
        );
      `);
      
      // Créer la table `groupe`
      db.run(`
        CREATE TABLE IF NOT EXISTS groupe(
          id_groupe INTEGER PRIMARY KEY AUTOINCREMENT,
          nom_groupe VARCHAR(100) NOT NULL
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
          role VARCHAR(100) NOT NULL,
          FOREIGN KEY(role) REFERENCES role(role)
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
      db.run(`INSERT OR IGNORE INTO role (role) 
        VALUES ('admin'), ('superviseur'), ('stagiaire')
      `);
      
      // Insérer un groupe par défaut si la table `groupe` est vide
      const groupe1 = "Formation Front";
      const groupe2 = "Formation Back";


      db.get('SELECT COUNT(*) AS count FROM groupe', (err, row) => {
        if (row.count === 0) {
          db.run(`INSERT or IGNORE INTO groupe (nom_groupe) VALUES (?), (?)`, [groupe1,groupe2] , function(err) {
            if (!err) {
              const groupId = this.lastID;
            }
          });
        }
      });

      const admin = {
        email : 'admin@mymood.fr',
        password : '$2a$10$AfOl0DK/9/tJlQgsNBkYh.X5QKKTSmoUVXpFJOsb9BkgShCjkmNpO',//'adminpass'
        role: 'admin',
        nom: 'Min',
        prenom: 'Ad'
      }
      const superviseur = {
        email : 'j.seigne@mymood.fr',
        password : '$2a$10$l7UNc6MYdb1FBliej5fKw.9TqN2Ni3ZnKZW.Hv.E5EXmKKpSVsA76', //'superpass'
        role: 'superviseur',
        nom: 'Seigne',
        prenom: 'Jean'
      }
      const etudiant = {
        email : 'j.Doe@mymood.fr',
        password : '$2a$10$6WTI7.8GfkehX1t9d1MrtuEPUOmn8gLMI/ImKEF03.y0JalKwNV7q', // 'etudpass'
        role: 'stagiaire',
        nom: 'Doe',
        prenom: 'John'
      }

      // Insérer les utilisateurs par défaut si la table `user` est vide
      db.get('SELECT COUNT(*) AS count FROM user', (err, row) => {
        if (row.count === 0) {
          db.run(`INSERT or IGNORE INTO user (email, password, role, nom, prenom) VALUES (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?)`, [admin.email, admin.password, admin.role, admin.nom, admin.prenom, superviseur.email, superviseur.password, superviseur.role, superviseur.nom, superviseur.prenom, etudiant.email, etudiant.password, etudiant.role, etudiant.nom, etudiant.prenom], function(err) {
            if (!err) {
              const userId = this.lastID;
            }
          });
          // inserer un mood au stagiaire par défaut
          db.run(`INSERT or IGNORE INTO mood (id_user, update_date, score, en_alerte) VALUES (?, ?, ?, ?)`, [3, new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }), 20, 0], function(err) {
            if (!err) {
              const moodId = this.lastID;
            }
          });
          // insérer les inscriptions par défaut
          db.run(`INSERT or IGNORE INTO inscription (id_user, id_groupe, est_responsable) VALUES (?,?,?), (?,?,?)`, [2, 1, 1, 3, 1, 0], function(err) {
            if (!err) {
              const inscriptionId = this.lastID;
            }
          });
        }
      });
});

module.exports = db;
