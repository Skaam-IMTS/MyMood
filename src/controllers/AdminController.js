const { AppError } = require('../middlewares/error');
const User = require('../models/User');
const Group = require('../models/Group');
const passGenerator = require('generate-password');
const mailService = require('../services/MailService');

class AdminController {
    static async getAllUsers(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            const users = await User.getAllUsers();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    static async createUser(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            const plainPassword = passGenerator.generate({
                length: 8,
                numbers: true,
                uppercase: true,
                lowercase: true,
                symbols: true,
                excludeSimilarCharacters: true,
            });
            req.body.password = plainPassword;
            
            const userId = await User.createUser(req.body);
            await mailService.sendNewUserCredentials(req.body.email, plainPassword);
            res.status(201).json({ id: userId });
        } catch (err) {
            next(err);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            await User.deleteUser(req.params.userId);
            res.json({ message: 'Utilisateur supprimé' });
        } catch (err) {
            next(err);
        }
    }

    static async getAllGroups(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            const groups = await Group.getAllGroups();
            res.json(groups);
        } catch (err) {
            next(err);
        }
    }

    static async createGroup(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            const groupId = await Group.createGroup(req.body);
            res.status(201).json({ id: groupId });
        } catch (err) {
            next(err);
        }
    }

    static async updateInscription(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            await Group.updateInscription(req.params.groupId, req.params.userId);
            res.json({ message: 'Inscription mise à jour' });
        } catch (err) {
            next(err);
        }
    }

    static async deleteGroup(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            await Group.deleteGroup(req.params.groupId);
            res.json({ message: 'Groupe supprimé' });
        } catch (err) {
            next(err);
        }
    }

    // Autres méthodes admin...
}

module.exports = AdminController;