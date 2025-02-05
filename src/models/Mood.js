const db = require('../../database/database');
const config = require('../config/config');

class Mood {
    constructor({ id_user, score, en_alerte, date }) {
        this.id_user = id_user ;
        this.score = score || 0;
        this.en_alerte = en_alerte || 0;
        this.date = date || new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    }
  
    async save() {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO mood (id_user, update_date, score, en_alerte) 
                        VALUES (?, ?, ?, ?)`;
            db.run(sql, [
                this.id_user,
                this.date,
                this.score,
                this.en_alerte ? 1 : 0
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
                    return resolve(new Mood(row));
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