const db = require('../../database/database');
const { AppError } = require('../middlewares/error');
const Group = require('../models/Group');
const User = require('../models/User');
const mailService = require('../services/MailService');

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
            const {newMood, enAlerte} = req.body;
            if (newMood < 0 || newMood > 100) {
                throw new AppError(400, 'Le newMood doit être entre 0 et 100');
            }
            const mood = new Mood(req.user.userId, newMood, enAlerte);
            await mood.save();
            if (enAlerte) {
                // Récupérer les informations de l'étudiant
                const student = await User.findById(req.user.userId);

                // Récupérer tous les superviseurs des groupes de l'étudiant
                const supervisors = await Group.getSupervisorsForStudent(req.user.userId);

                // Envoyer l'email d'alerte aux superviseurs
                await mailService.sendAlertNotification(
                    {
                        nom: student.nom,
                        prenom: student.prenom,
                        mood: mood.score
                    },
                    supervisors
                );
            }
            res.json({message: "Humeur mise à jour"});
        } catch (err) {
            next(err);
        }
    }

    static async resetStudentAlert(req, res, next) {
        try {
            if (req.user.role !== 'superviseur') {
                throw new AppError(403, 'Accès non autorisé');
            }

            const studentId = req.params.studentId;
            
            // Vérifie si le superviseur a accès à cet étudiant
            const hasAccess = await Group.supervisorHasAccessToStudent(req.user.userId, studentId);
            if (!hasAccess) {
                throw new AppError(403, 'Vous n\'avez pas accès à cet étudiant');
            }

            // Réinitialise l'alerte
            await Mood.resetAlert(studentId);
            
            res.json({ message: 'Alerte réinitialisée avec succès' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = MoodController;
