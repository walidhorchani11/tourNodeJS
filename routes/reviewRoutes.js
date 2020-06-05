const express = require('express');
const reviewController = require('../controllers/reviewController');

//use of merge params dans express.Router
const router = express.Router({ mergeParams: true });
// POST for exp reachable for these 2 routes
// POST /api/v1/reviews/
// POST /api/v1/tours/:tourId/reviews

router
  .route('/')
  .get(reviewController.getReviews)
  .post(reviewController.createReview);

module.exports = router;
