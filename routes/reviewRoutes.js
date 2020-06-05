const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

//route pour getAll & create
router
  .route('/')
  .get(reviewController.getReviews)
  .post(reviewController.createReview);

module.exports = router;
