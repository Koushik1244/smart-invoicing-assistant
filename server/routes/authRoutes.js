const express = require('express');
const { register, login, trackActivity, setBusyMode } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/activity',  protect, trackActivity);
router.patch('/busy-mode', protect, setBusyMode);

module.exports = router;
