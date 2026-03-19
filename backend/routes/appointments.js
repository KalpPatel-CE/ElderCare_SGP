const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { addAppointment, getAppointmentsByElder } = require('../controllers/appointmentsController');

router.post('/', authMiddleware, addAppointment);
router.get('/elder/:elder_code', authMiddleware, getAppointmentsByElder);

module.exports = router;
