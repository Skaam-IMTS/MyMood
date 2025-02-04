const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const auth = require('../middlewares/auth');


/**
 * @swagger
 * tags:
 *  name: Administrateur
 *  description: Gestion des utilisateurs et des groupes par les administrateurs
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Administrateur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_user:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   nom:
 *                     type: string
 *                   prenom:
 *                     type: string
 *                   role:
 *                     type: string
 *                   groupes:
 *                     type: string
 *       403:
 *         description: Accès non autorisé
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Administrateur]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *               - nom
 *               - prenom
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, superviseur, stagiaire]
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       403:
 *         description: Accès non autorisé
 */
router.get('/users', auth, AdminController.getAllUsers);
router.post('/users', auth, AdminController.createUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Administrateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/users/:id', auth, AdminController.deleteUser);

/**
 * @swagger
 * /admin/groups:
 *   get:
 *     summary: Récupérer tous les groupes
 *     tags: [Administrateur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des groupes récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_groupe:
 *                     type: integer
 *                   nom_groupe:
 *                     type: string
 *       403:
 *         description: Accès non autorisé
 *   post:
 *     summary: Créer un nouveau groupe
 *     tags: [Administrateur]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_groupe
 *             properties:
 *               nom_groupe:
 *                 type: string
 *     responses:
 *       201:
 *         description: Groupe créé avec succès
 *       403:
 *         description: Accès non autorisé
 */
router.get('/groups', auth, AdminController.getAllGroups);
router.post('/groups', auth, AdminController.createGroup);

router.get('/groups/:id', auth, AdminController.getAllInscriptionsBygroup);
/**
 * @swagger
 * /admin/groups/{groupId}/users/{userId}:
 *   put:
 *     summary: Mettre à jour l'inscription d'un utilisateur à un groupe
 *     tags: [Administrateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du groupe
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Inscription mise à jour
 *       403:
 *         description: Accès non autorisé
 */
router.put('/groups/:groupId/users/:userId', auth, AdminController.updateInscription);

/**
 * @swagger
 * /admin/groups/{id}:
 *   delete:
 *     summary: Supprimer un groupe
 *     tags: [Administrateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du groupe
 *     responses:
 *       200:
 *         description: Groupe supprimé
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Groupe non trouvé
 */
router.delete('/groups/:id', auth, AdminController.deleteGroup);

module.exports = router;