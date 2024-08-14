const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');

router.post('/:productId/reviews', addReview);

module.exports = router;
