const express = require('express');
const router = express.Router();
const MoodController = require('../controllers/MoodController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *  name: Stagiaire
 *  description: Gestion de l'humeur par les stagiaires
 */

/**
 * @swagger
 * /mood/status:
 *   get:
 *     summary: Récupérer le score d'humeur et l'état d'alerte
 *     tags: [Stagiaire]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Le score d'humeur et l'état d'alerte ont été récupérés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mood:
 *                   type: number
 *                   description: Score d'humeur
 *                 alert:
 *                   type: boolean
 *                   description: Etat d'alerte
 *                 date: 
 *                   type: string
 *                   description: Date de la dernière mise à jour
 *       401:
 *         description: Vous n'avez pas les droits
 */
router.get('/status', auth, MoodController.getStatus);


/**
 * @swagger
 * /mood/update:
 *   post:
 *     summary: Modifier son score d'humeur et état d'alerte
 *     tags: [Stagiaire]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newMood:
 *                 type: number
 *                 description: Score d'humeur
 *               enAlert:
 *                 type: boolean
 *                 description: Etat d'alerte
 *     responses:
 *       200:
 *         description: Humeur mise à jour
 *       401:
 *         description: Vous n'avez pas les droits
 */

// Modifier son score d'humeur et état d'alerte
router.post('/update', auth, MoodController.updateMood);

module.exports = router;