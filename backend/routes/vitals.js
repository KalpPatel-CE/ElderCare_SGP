const express = require('express');
const router = express.Router();
const vitalsController = require('../controllers/vitalsController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, vitalsController.addVitals);
router.get('/elder/:elder_code', authMiddleware, vitalsController.getVitalsByElder);
router.get('/elder/:elder_code/latest', authMiddleware, vitalsController.getLatestVitals);

module.exports = router;
