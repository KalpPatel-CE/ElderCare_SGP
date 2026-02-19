const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  addEvent,
  getEventsByElder,
  getTodayEvents,
  getMissedEvents
} = require('../controllers/eventsController');

router.post('/', authMiddleware, addEvent);

router.get('/elder/:elder_code', authMiddleware, getEventsByElder);
router.get('/today/:elder_code', authMiddleware, getTodayEvents);
router.get('/missed/:elder_code', authMiddleware, getMissedEvents);

module.exports = router;
