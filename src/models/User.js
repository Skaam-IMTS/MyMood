const db = require('../../database/database');
const bcrypt = require('bcryptjs');
const Mood = require('./Mood');
const PasswordHandler = require('../utils/password');


class User {
    constructor(userData) {
        this.id_user = userData.id_user;
        this.email = userData.email;
        this.password = userData.password;
        this.role = userData.role;
        this.nom = userData.nom;
        this.prenom = userData.prenom;
        this.groupes = userData.groupes || [];
    }

    static async getAllUsers() {
        return new Promise((resolve, reject) => {
            const sql = `
              SELECT u.*, GROUP_CONCAT(g.nom_groupe) as groupes
              FROM user u
              LEFT JOIN inscription i ON u.id_user = i.id_user
              LEFT JOIN groupe g ON i.id_groupe = g.id_groupe
              GROUP BY u.id_user
              ORDER BY u.role DESC , u.nom ASC
          `;
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve([
                    rows.map(row => ({
                        id: row.id_user,
                        email: row.email,
                        nom: row.nom,
                        prenom: row.prenom,
                        role: row.role,
                        groupe: row.groupes ? row.groupes.split(',') : []
                    }))
                ]);
            });
        });
    }

    async createUser() {
        return new Promise(async (resolve, reject) => {
            const params = [this.email, this.password, this.role, this.nom, this.prenom];

            try {
                await this.runQuery('BEGIN TRANSACTION');

                const userId = await this.runQuery(
                    'INSERT INTO user (email, password, role, nom, prenom) VALUES (?, ?, ?, ?, ?)',
                    params,
                    true // On veut récupérer lastID
                );
                
                if (this.role === 'stagiaire') {
                    const mood = new Mood({ id_user: userId });
                    await mood.save();
                }

                await this.runQuery('COMMIT');
                resolve(userId);
            } catch (err) {
                await this.runQuery('ROLLBACK');
                reject(err);
            }
        });
    }

    runQuery(sql, params = [], getLastID = false) {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                resolve(getLastID ? this.lastID : true);
            });
        });
    };
    

    static async deleteUser(userId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM user WHERE id_user = ?', [userId], function (err) {
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
                return resolve(new User(row));
            });
        });
    }
    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM user WHERE id_user = ?', [id], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                return resolve(new User(row));
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
            values.push(await PasswordHandler.hashPassword(newPassword));
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

        values.push(this.id_user);
        const sql = `UPDATE user SET ${updates.join(', ')} WHERE id_user = ?`;

        return new Promise((resolve, reject) => {
            db.run(sql, values, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    static async getUserRole(userId) {
        return new Promise((resolve, reject) => {
            db.get('SELECT role FROM user WHERE id_user = ?', [userId], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                return resolve(row.role);
            });
        });
    }
}

module.exports = User;