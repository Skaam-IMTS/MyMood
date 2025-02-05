const { AppError } = require('../middlewares/error');
const User = require('../models/User');
const Group = require('../models/Group');
const mailService = require('../services/MailService');
const Role = require('../models/Role');
const PasswordHandler = require('../utils/password');
const Validator = require('../utils/validator');
const Inscription = require('../models/Inscription');


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

            const { email, nom, prenom, role } = req.body;
            if (
                !email || 
                !nom || 
                !prenom || 
                !role || 
                !Role.getRole(role) ||
                !Validator.validateEmail(email)
            ) {
                throw new AppError(400, 'Attributs manquants ou invalides');
            }

            const plainPassword = PasswordHandler.generatePassword();
            const password = PasswordHandler.hashPassword(plainPassword);

            const user = new User({
                email: email,
                password: password,
                role: role,
                nom: nom,
                prenom: prenom
            });

            const userId = await user.createUser();
            await mailService.sendNewUserCredentials(req.body.email, plainPassword);

            res.status(201).json({ 
                message: 'Utilisateur créé avec succès'
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            if (req.user.id === req.params.id) throw new AppError(400, 'Vous ne pouvez pas supprimer votre propre compte');
            if (!await User.findById(req.params.id)) throw new AppError(404, 'Utilisateur introuvable');
            await User.deleteUser(req.params.id);
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

            const group = new Group({ nom_groupe: req.body.nom_groupe });
            await group.createGroup();
            res.status(201).json({ message: 'Groupe créé avec succès' });
        } catch (err) {
            next(err);
        }
    }

    static async updateInscription(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            const inscRole = await User.getUserRole(req.params.userId);
            const insc = new Inscription({
                id_groupe: req.params.groupId,
                id_user: req.params.userId,
                est_responsable: inscRole === 'superviseur' ? 1 : 0
            });

            if (await Inscription.getOneInscription(req.params.groupId, req.params.userId))    throw new AppError(400, 'Utilisateur déjà inscrit dans ce groupe');

            await insc.createInscription();
            res.json({ message: 'Inscription mise à jour' });
        } catch (err) {
            next(err);
        }
    }

    static async getAllInscriptionsBygroup(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');
            const inscriptions = await Group.getAllInscriptionsByGroup(req.params.id);
            res.json(inscriptions);
        } catch (err) {
            next(err);
        }
    }

    static async deleteGroup(req, res, next) {
        try {
            if (req.user.role !== 'admin') throw new AppError(403, 'Accès non autorisé');

            const group = await Group.getGroupById(req.params.id);

            if (!group) throw new AppError(404, 'Groupe introuvable');
            await group.deleteGroup();
            res.json({ message: 'Groupe supprimé' });
        } catch (err) {
            next(err);
        }
    }


}

module.exports = AdminController;