const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const loginRateLimiter = require('../middleware/rateLimiter');

// Auth routes mapped to Auth controller functions
router.post('/login', loginRateLimiter, authController.login);
router.get('/verify', authMiddleware, authController.verifyToken);

module.exports = router;
