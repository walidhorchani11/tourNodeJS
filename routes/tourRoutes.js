const express = require('express');
const toursController = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
// router.param('id', toursController.checkID);

// POST api/v1/tours/21541v8/reviews
// GET api/v1/tours/21541v8/reviews
// GET api/v1/tours/21541v8/reviews/514654fee
router.use('/:tourId/reviews', reviewRouter);
//prb: reviewRouter na pas acces au :tourId, on va utiliser alors le merge params dans reviewRouter

router
  .route('/top-5-cheaps')
  .get(toursController.aliaTopCheaps, toursController.getTours);
router
  .route('/')
  .get(toursController.getTours)
  .post(toursController.createTour);
// on a fait ceci pour comprendre le chainage du middlewares
// .post(toursController.checkBody, toursController.createTour);

router
  .route('/:id')
  .get(toursController.getTour)
  .delete(toursController.deleteTour)
  .patch(toursController.updateTour);

module.exports = router;
