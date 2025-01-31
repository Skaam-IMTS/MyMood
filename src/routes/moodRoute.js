const express = require('express');
const router = express.Router();
const { mood, moodAjout } = require('../controllers/MoodController');

router.get('/', mood);
router.post('/ajout', moodAjout);



module.exports = router;