const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { addMedication, getMedicationsByElder } = require('../controllers/medicationsController');

router.post('/', authMiddleware, addMedication);
router.get('/elder/:elder_code', authMiddleware, getMedicationsByElder);

module.exports = router;
