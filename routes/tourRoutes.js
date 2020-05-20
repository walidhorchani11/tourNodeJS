const express = require('express');
const toursController = require('../controllers/tourController');

const router = express.Router();
// router.param('id', toursController.checkID);
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
