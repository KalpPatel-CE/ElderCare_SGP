const express = require('express');
const router = express.Router();
const ac = require('../controllers/adminController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/stats', auth, ac.getStats);
router.get('/requests/pending', auth, ac.getPendingRequests);
router.get('/requests', auth, ac.getAllRequests);
router.post('/requests/:id/reject', auth, ac.rejectRequest);
router.get('/report/:elder_code', auth, ac.getElderReport);
router.post('/assign', auth, ac.assignCaretaker);
router.get('/caretakers', auth, ac.getAllCaretakers);
router.get('/caretakers/available', auth, ac.getAvailableCaretakers);
router.post('/caretakers', auth, ac.addCaretaker);
router.post('/caretakers/:id/photo', auth, upload.single('photo'), ac.uploadCaretakerPhoto);
router.put('/caretakers/:id/background-check', auth, ac.updateBackgroundCheck);
router.get('/families', auth, ac.getAllFamilies);

module.exports = router;
