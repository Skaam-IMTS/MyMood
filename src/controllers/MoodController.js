const db = require('../../database/database');

exports.mood = (req, res) => {
    db.all(`SELECT * FROM mood`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

exports.moodAjout = (req, res) => {
    const { score, en_alerte, email } = req.body;
    const update_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `
    INSERT INTO mood (id_user, update_date, score, en_alerte)
    SELECT id_user , ?, ?, ?
    FROM user
    WHERE email = ?;
            `;
    db.run(sql, [update_date, score, en_alerte, email], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Mood ajouté avec succès' });
    });
};
