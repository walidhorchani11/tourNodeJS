const mongoose = require('mongoose');

// creation du schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price !'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  duration: {
    type: Number,
  },
  maxGroupSize: {
    type: Number,
  },
  difficulty: {
    type: String,
  },
  ratingsAverage: {
    type: Number,
  },
  ratingsQuantity: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: {
    type: [String],
  },
  startDates: {
    type: [Date],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  priceDiscount: {
    type: Number,
  },
});

// creation du model autour de ce schema
// Tour doit etre en majuscule
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
