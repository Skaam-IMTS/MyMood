const { AppError } = require('../middlewares/error');
const Group = require('../models/Group');

class GroupController {
    static async getSupervisorGroups(req, res, next) {
        try {
            if (req.user.role !== 'superviseur') {
                throw new AppError(403, 'Accès non autorisé');
            }
            const groups = await Group.findBySupervisorId(req.user.userId);
            res.json(groups);
        } catch (err) {
            next(err);
        }
    }

    static async getGroupStudents(req, res, next) {
        try {
            if (req.user.role !== 'superviseur') {
                throw new AppError(403, 'Accès non autorisé');
            }
            const students = await Group.getGroupStudentsWithMood(req.params.groupId);
            res.json(students);
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

module.exports = GroupController;