const express = require('express');
const router = express.Router();
const MoodController = require('../controllers/MoodController');
const auth = require('../middlewares/auth');

// Récupérer son statut d'humeur
router.get('/status', auth, MoodController.getStatus);

// Modifier son score d'humeur et état d'alerte
router.post('/update', auth, MoodController.updateMood);

module.exports = router;