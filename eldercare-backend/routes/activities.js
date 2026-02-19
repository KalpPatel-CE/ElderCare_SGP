const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { addActivity, getActivitiesByElder, getActivitiesMaster } = require('../controllers/activitiesController');

router.post('/', authMiddleware, addActivity);
router.get('/master', authMiddleware, getActivitiesMaster);
router.get('/elder/:elder_code', authMiddleware, getActivitiesByElder);

module.exports = router;
