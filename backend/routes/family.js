const express = require('express');
const router = express.Router();
const fc = require('../controllers/familyController');
const auth = require('../middleware/auth');

router.get('/elder', auth, fc.getElder);
router.post('/elder', auth, fc.saveElder);
router.get('/medications', auth, fc.getMedications);
router.post('/medications', auth, fc.addMedication);
router.delete('/medications/:id', auth, fc.deleteMedication);
router.get('/activities', auth, fc.getActivities);
router.post('/activities', auth, fc.addActivity);
router.delete('/activities/:id', auth, fc.deleteActivity);
router.get('/baseline-vitals', auth, fc.getBaselineVitals);
router.post('/baseline-vitals', auth, fc.saveBaselineVitals);
router.get('/requests', auth, fc.getRequests);
router.post('/requests', auth, fc.createRequest);
router.post('/requests/:id/pay-advance', auth, fc.payAdvance);
router.post('/requests/:id/pay-final', auth, fc.payFinal);
router.get('/care-logs', auth, fc.getCareLogs);

module.exports = router;
