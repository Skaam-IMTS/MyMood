const express = require('express');
const router = express.Router();
const { groupes, 
    groupeAjout, 
    groupeSuppression, 
    inscription, 
    inscriptionAjout, 
    inscriptionUserSuppression,
    inscriptionUserAjout
 } = require('../controllers/groupesController');

// Define routes
router.get('/', groupes);
router.post('/ajout', groupeAjout);
router.delete('/suppression', groupeSuppression);
router.get('/inscription', inscription);
router.post('/inscription/ajout', inscriptionAjout);
router.delete('/inscription/user/suppression', inscriptionUserSuppression);
router.post('/inscription/user/ajout', inscriptionUserAjout);



module.exports = router;