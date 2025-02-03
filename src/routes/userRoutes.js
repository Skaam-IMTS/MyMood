const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const UserController = require('../controllers/UserController');

router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, UserController.updateProfile);

module.exports = router;