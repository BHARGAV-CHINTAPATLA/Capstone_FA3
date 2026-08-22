const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth');
const { validateSignup, validateLogin } = require('../middleware/validateRequest');

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

module.exports = router;
