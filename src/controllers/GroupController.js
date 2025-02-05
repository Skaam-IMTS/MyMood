const { AppError } = require('../middlewares/error');
const Group = require('../models/Group');
const Mood = require('../models/Mood');

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
            res.json(
                {students: students.map(student => ({
                    id: student.id_user,
                    nom: student.nom,
                    prenom: student.prenom,
                    mood: student.score,
                    en_alerte: student.en_alerte
                }))});
        } catch (err) {
            next(err);
        }
    }

}

module.exports = GroupController;