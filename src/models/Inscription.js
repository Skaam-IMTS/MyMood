const db = require('../../database/database');

class Inscription {
    constructor(inscriptionData) {
        this.id_user = inscriptionData.id_user || null;
        this.id_groupe = inscriptionData.id_groupe || null;
        this.est_responsable = inscriptionData.est_responsable || 0;
    }

    async createInscription() {
        return new Promise((resolve, reject) => {
            console.log(this.id_user, this.id_groupe, this.est_responsable);
            db.run(
                'INSERT INTO inscription (id_user, id_groupe, est_responsable) VALUES (?, ?, ?)',
                [this.id_user, this.id_groupe, this.est_responsable],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async deleteInscription() {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM inscription WHERE id_user = ? AND id_groupe = ?',
                [this.id_user, this.id_groupe],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.changes);
                }
            );
        });
    }

    static async getAllInscriptionsByGroup(id_groupe) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT u.role, u.nom, u.prenom, u.email, g.nom_groupe
                    FROM inscription i
                    JOIN user u ON u.id_user = i.id_user 
                    JOIN groupe g ON g.id_groupe = i.id_groupe
                    WHERE id_groupe = ?
                    ORDER BY u.role DESC`, [id_groupe], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getOneInscription(groupId, userId) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM inscription WHERE id_groupe = ? AND id_user = ?', [groupId, userId], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
    
}

module.exports = Inscription;