const db = require('../../database/database');
const { AppError } = require('../middlewares/error');
const Group = require('../models/Group');
const User = require('../models/User');
const mailService = require('../services/MailService');

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

const Mood = require('../models/Mood');

class MoodController {
    static async getStatus(req, res, next) {
        try {
            const status = await Mood.findLatestByUserId(req.user.userId);
            if (!status) {
                throw new AppError(404, 'Aucun mood trouvé');
            }
            res.json(status);
        } catch (err) {
            next(err);
        }
    }

    static async updateMood(req, res, next) {
        try {
            const {score, enAlerte} = req.body;
            if (score < 0 || score > 100) {
                throw new AppError(400, 'Le score doit être entre 0 et 100');
            }
            const mood = new Mood(req.user.userId, score, enAlerte);
            await mood.save();
            res.json({message: "Humeur mise à jour"});
        } catch (err) {
            next(err);
        }
    }
}

module.exports = MoodController;
