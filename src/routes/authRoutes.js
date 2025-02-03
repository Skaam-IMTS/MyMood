const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');


/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de l'authentification
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connecte un utilisateur existant
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email de l'utilisateur pour la connexion
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                token:
 *                 type: string
 *                 description: Token JWT pour les requêtes authentifiées
 *               user:
 *                type: object
 *                properties:
 *                  email:
 *                      type: string
 *                  role:
 *                      type: string
 *     400:
 *       description: Veuillez renseigner tous les champs
 *     401:
 *      description: Identifiants incorrects
 */
router.post('/login', AuthController.login);

module.exports = router;