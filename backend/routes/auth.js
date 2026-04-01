const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.put('/change-password', authMiddleware, authController.changePassword);
router.get('/testimonials', authController.getTestimonials);

module.exports = router;
