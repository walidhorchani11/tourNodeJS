const mongoose = require('mongoose');
const slugify = require('slugify');

// creation du schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
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

  secretTour: {
    type: Boolean,
    default: false,
  }
}, {
    // ce 2eme arg est un objet
  // on va dire au mongoose de returne les virtuals, 
// lorsqu on return du json avec toJSON on a ausi toObject 
  toJSON: {
    virtuals: true
  }
});

tourSchema.virtual('durationWeeks').get(function(){
    // this cest le tourSchema,on a besoin et c'est pour ca 
  //qu on a utilise regular function not arrow
  return this.duration / 7;
});

//*****document middleware******
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
// next();
// });

// ******** query middleware
// sera executer pour les find, findOne, findByIdAndDelete tous ce qui commence par find
// use case : on va eliminer les tours secrets -- 1: ajout du champ 2 -- filter le query

tourSchema.pre(/^find/, function(next){
  //use $ne pcq le champs est new alors les anciens tours n ont pas ce champ
  // alors si on fait equal = false alors on aura rien
  this.find({secretTour: {$ne: true}})
  next();
});

//pour post on aura access au docs recus apres l execution du qyery
tourSchema.post(/^find/, function(docs, next){
console.log('our docs are :::', docs);
next();
});




// creation du model autour de ce schema
// Tour doit etre en majuscule
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
