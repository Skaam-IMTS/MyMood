const db = require('../../database/database');


class Role {
    constructor(role) {
        this.role = role;
    }

    static async getAllRoles() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM role', [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getRole(role) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM role WHERE role = ?', [role], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                return resolve(new Role(row.role));
            });
        });
    }

    async createRole() {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO role (role) VALUES (?)',
                [this.role],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async updateRole(id, role) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE role SET role = ? WHERE role = ?',
                [role],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.changes);
                }
            );
        });
    }

    async deleteRole() {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM role WHERE role = ?',
                [this.role],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.changes);
                }
            );
        });
    }
}

module.exports = Role;