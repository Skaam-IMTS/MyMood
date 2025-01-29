const db = require('../../database/database');


exports.getUserByEmail = async (email) => {
    const query = `SELECT * FROM user WHERE email = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [email], (err, row) => err ? reject(err) : resolve(row));
    });
}