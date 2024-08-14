const express = require('express');
const { registerUser, authUser, updatePassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', updatePassword); 

module.exports = router;
