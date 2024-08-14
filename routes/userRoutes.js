const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, resetPassword } = require('../controllers/userController');

router.get('/:email', getProfile);

router.put('/:email', updateProfile);

router.post('/:email/reset-password', resetPassword);

module.exports = router;
