const db = require('../../database/database');

class Group {

    static async getAllGroups() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM groupe', [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
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

    static async createGroup(nomGroupe) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO groupe (nom_groupe) VALUES (?)',
                [nomGroupe],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    static async updateInscription(groupId, userId) {
        // Vérifier si l'utilisateur est déjà inscrit
        const inscription = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM inscription WHERE id_groupe = ? AND id_user = ?',
                [groupId, userId],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                }
            );
        });

        // Vérifier si l'utilisateur est un superviseur
        const estResponsable = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM inscription WHERE id_groupe = ? AND id_user = ? AND est_responsable = 1',
                [groupId, userId],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row ? 1 : 0);
                }
            );
        }); 

        return new Promise((resolve, reject) => {
            db.run(
                'INSERT OR REPLACE INTO inscription (id_groupe, id_user, est_responsable) VALUES (?, ?, ?)',
                [groupId, userId, estResponsable],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    static async deleteGroup(groupId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM groupe WHERE id_groupe = ?', [groupId], function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }

    static async findBySupervisorId(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT g.* 
                FROM groupe g
                INNER JOIN inscription i ON g.id_groupe = i.id_groupe
                WHERE i.id_user = ? AND i.est_responsable = 1
            `;
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getGroupStudentsWithMood(groupId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT u.id_user, u.nom, u.prenom, u.email,
                       m.score, m.en_alerte, m.update_date
                FROM user u
                INNER JOIN inscription i ON u.id_user = i.id_user
                LEFT JOIN (
                    SELECT id_user, score, en_alerte, update_date
                    FROM mood m1
                    WHERE update_date = (
                        SELECT MAX(update_date)
                        FROM mood m2
                        WHERE m2.id_user = m1.id_user
                    )
                ) m ON u.id_user = m.id_user
                WHERE i.id_groupe = ? AND u.role = 'stagiaire'
            `;
            db.all(sql, [groupId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async supervisorHasAccessToStudent(supervisorId, studentId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT COUNT(*) as count
                FROM inscription i1
                JOIN inscription i2 ON i1.id_groupe = i2.id_groupe
                WHERE i1.id_user = ? 
                AND i2.id_user = ?
                AND i1.est_responsable = 1
            `;
            db.get(sql, [supervisorId, studentId], (err, row) => {
                if (err) return reject(err);
                resolve(row.count > 0);
            });
        });
    }
    
    static async getSupervisorsForStudent(studentId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT DISTINCT u.* 
                FROM user u
                JOIN inscription i1 ON u.id_user = i1.id_user
                JOIN inscription i2 ON i1.id_groupe = i2.id_groupe
                WHERE i2.id_user = ?
                AND i1.est_responsable = 1
                AND u.role = 'superviseur'
            `;
            db.all(sql, [studentId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
}

module.exports = Group;