const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/GroupController');
const auth = require('../middlewares/auth');

router.get('/supervisor', auth, GroupController.getSupervisorGroups);
router.get('/:groupId/students', auth, GroupController.getGroupStudents);

module.exports = router;