const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const UserController = require('../controllers/UserController');

/**
 * @swagger
 * tags: 
 *  name: Utilisateur
 *  description: Gestion des profils utilisateurs
 */

/**
 * @swagger
 * /user/profile:
 *  get:
 *      summary: Récupérer le profil de l'utilisateur
 *      tags: [Utilisateur]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Le profil a été récupéré
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              nom:
 *                                  type: string
 *                              prenom:
 *                                  type: string
 *          403:
 *              description: Vous n'avez pas les droits
 */
router.get('/profile', auth, UserController.getProfile);

/**
 * @swagger
 * /user/profile:
 *  put:
 *     summary: Mettre à jour le profil de l'utilisateur
 *     tags: [Utilisateur]
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                nom:
 *                 type: string
 *                prenom: 
 *                  type: string
 *                email:
 *                 type: string
 *                newPassword:
 *                 type: string
 *     responses:
 *        200:
 *          description: Le profil a été mis à jour 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Message de confirmation
 *        403:
 *          description: Vous n'avez pas les droits
 */
router.put('/profile', auth, UserController.updateProfile);

module.exports = router;