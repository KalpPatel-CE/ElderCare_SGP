const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAllUsers, addUser, assignElderToUser } = require('../controllers/usersController');

router.get('/', authMiddleware, getAllUsers);
router.post('/', authMiddleware, addUser);
router.post('/assign-elder', authMiddleware, assignElderToUser);

module.exports = router;
