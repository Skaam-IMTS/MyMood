const db = require('../../database/database');
const config = require('../config/config');

class Mood {
    constructor(userId, score, enAlerte) {
        this.userId = userId;
        this.score = score;
        this.enAlerte = enAlerte;
        this.date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    }
  
    async save() {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO mood (id_user, update_date, score, en_alerte) 
                        VALUES (?, ?, ?, ?)`;
            db.run(sql, [
                this.userId,
                this.date,
                this.score,
                this.enAlerte ? 1 : 0
            ], function(err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });
    }

    static async findLatestByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM mood WHERE id_user = ? ORDER BY update_date DESC LIMIT 1',
                [userId],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);
                    return resolve({
                        score: row.score,
                        enAlerte: row.en_alerte,
                        date: row.update_date
                    });
                }
            );
        });
    }

    static async resetAlert(studentId) {
        return new Promise((resolve, reject) => {
            const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
            const sql = `
                INSERT INTO mood (id_user, update_date, score, en_alerte)
                SELECT ?, ?, score, 0
                FROM mood
                WHERE id_user = ?
                ORDER BY update_date DESC
                LIMIT 1
            `;
            db.run(sql, [studentId, date, studentId], function(err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });
    }
}

module.exports = Mood;