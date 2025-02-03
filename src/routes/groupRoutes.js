const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/GroupController');
const auth = require('../middlewares/auth');


/**
 * @swagger
 * tags:
 *  name: Superviseur
 *  description: Gestion des groupes par les superviseurs
 */

/**
 * @swagger
 * /groups/supervisor:
 *     get:
 *      summary: Récupérer les groupes d'un superviseur
 *      tags: [Superviseur]
 *      security:
 *         - bearerAuth: []
 *      responses:
 *         200:
 *           description: Les groupes ont été récupérés
 *           content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Group'
 *         403:
 *           description: Vous n'avez pas les droits
 * 
 */
router.get('/supervisor', auth, GroupController.getSupervisorGroups);

/**
 * @swagger
 * /groups/{groupId}/students:
 *  get:
 *      summary: Récupérer les étudiants d'un groupe
 *      tags: [Superviseur]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *         - in: path
 *           name: groupId
 *           required: true
 *           description: L'identifiant du groupe
 *           schema:
 *              type: string
 *      responses:
 *         200:
 *           description: Les étudiants du groupe ont été récupérés
 *           content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          students:
 *                              type: array
 *                              description: Les étudiants du groupe
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: integer
 *                                          description: L'identifiant de l'étudiant
 *                                      nom:
 *                                          type: string
 *                                          description: Le nom de l'étudiant
 *                                      prenom:
 *                                          type: string
 *                                          description: Le prénom de l'étudiant 
 *                                      mood:
 *                                          type: integer
 *                                          description: Le score d'humeur de l'étudiant
 *                                      en_alerte:
 *                                          type: boolean
 *                                          description: Indique si l'étudiant est en alerte
 *         403:
 *           description: Vous n'avez pas les droits
 * 
 */
router.get('/:groupId/students', auth, GroupController.getGroupStudents);

module.exports = router;