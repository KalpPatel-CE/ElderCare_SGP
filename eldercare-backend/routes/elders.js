const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAllElders, addElder, getEldersByUserCode } = require('../controllers/eldersController');

router.post('/', authMiddleware, addElder);
router.get('/', authMiddleware, getAllElders);
router.get('/user/:user_code', authMiddleware, getEldersByUserCode);

module.exports = router;
