const express = require('express');
const router = express.Router();
const cc = require('../controllers/caretakerController');
const auth = require('../middleware/auth');

router.get('/assignment', auth, cc.getAssignment);
router.get('/medications', auth, cc.getElderMedications);
router.get('/activities', auth, cc.getElderActivities);
router.get('/appointments', auth, cc.getElderAppointments);
router.post('/care-log', auth, cc.submitCareLog);
router.post('/vitals', auth, cc.recordVitals);
router.get('/past-assignments', auth, cc.getPastAssignments);
router.post('/complete-assignment', auth, cc.completeAssignment);

module.exports = router;
