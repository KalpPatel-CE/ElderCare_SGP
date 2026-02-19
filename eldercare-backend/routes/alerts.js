const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAlertsByUser } = require('../controllers/alertsController');

router.get('/:user_code', authMiddleware, getAlertsByUser);

module.exports = router;
