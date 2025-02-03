const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const auth = require('../middlewares/auth');

router.get('/users', auth, AdminController.getAllUsers);
router.post('/users', auth, AdminController.createUser);
router.delete('/users/:id', auth, AdminController.deleteUser);

router.get('/groups', auth, AdminController.getAllGroups);
router.post('/groups', auth, AdminController.createGroup);
router.put('/groups/:groupId/users/:userId', auth, AdminController.updateInscription);
router.delete('/groups/:id', auth, AdminController.deleteGroup);

module.exports = router;