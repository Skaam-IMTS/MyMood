const db = require('../../database/database');
const bcrypt = require('bcryptjs');
const mailService = require('../services/MailService');

class User {
    constructor(id, email, password, role, nom, prenom) {
      this.id = id;
      this.email = email; 
      this.password = password;
      this.role = role;
      this.nom = nom;
      this.prenom = prenom;
    }
  
    static async getAllUsers() {
      return new Promise((resolve, reject) => {
          const sql = `
              SELECT u.*, GROUP_CONCAT(g.nom_groupe) as groupes
              FROM user u
              LEFT JOIN inscription i ON u.id_user = i.id_user
              LEFT JOIN groupe g ON i.id_groupe = g.id_groupe
              GROUP BY u.id_user
          `;
          db.all(sql, [], (err, rows) => {
              if (err) return reject(err);
              resolve(rows);
          });
      });
    }

    static async createUser(userData) {
      const { email, password, role, nom, prenom } = userData;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      return new Promise((resolve, reject) => {
          db.run(
              'INSERT INTO user (email, password, role, nom, prenom) VALUES (?, ?, ?, ?, ?)',
              [email, hashedPassword, role, nom, prenom],
              function(err) {
                  if (err) return reject(err);
                  resolve(this.lastID);
              }
          );
      });
  }

  static async deleteUser(userId) {
      return new Promise((resolve, reject) => {
          db.run('DELETE FROM user WHERE id_user = ?', [userId], function(err) {
              if (err) return reject(err);
              resolve(this.changes);
          });
      });
  }

    static async findByEmail(email) {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM user WHERE email = ?', [email], (err, row) => {
          if (err) return reject(err);
          if (!row) return resolve(null);
          return resolve(new User(
            row.id_user, 
            row.email, 
            row.password, 
            row.role,
            row.nom, 
            row.prenom
          ));
        });
      });
    }
  
    async updateProfile(data) {
      const { email, nom, prenom, newPassword } = data;
      const updates = [];
      const values = [];

      if (email) {
          updates.push('email = ?');
          values.push(email);
      }
      if (newPassword) {
          updates.push('password = ?');
          values.push(await bcrypt.hash(newPassword, 10));
      }
      if (nom) {
          updates.push('nom = ?');
          values.push(nom);
      }
      if (prenom) {
          updates.push('prenom = ?');
          values.push(prenom);
      }

      if (updates.length === 0) return;

      values.push(this.id);
      const sql = `UPDATE user SET ${updates.join(', ')} WHERE id_user = ?`;

      return new Promise((resolve, reject) => {
          db.run(sql, values, (err) => {
              if (err) return reject(err);
              resolve();
          });
      });
  }
}

module.exports = User;