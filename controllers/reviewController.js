const Review = require('../models/reviewModel');

exports.createReview = async (req, res, next) => {
  try {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    //partie manquant req.user.id; section security
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);
    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
};
