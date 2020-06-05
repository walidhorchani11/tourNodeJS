// const fs = require('fs');
const TourModel = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliaTopCheaps = async (req, res, next) => {
  req.query.limit = '5'; //en string , car c'est ce qu on va avoir
  //d'une application cliente, et le next middleware le getTours va les manipuler
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,duration';
  next();
};

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
// );

// exports.checkID = (req, res, next, value) => {
//   if (value >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID walid',
//     });
//   }
//   next();
// };

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await TourModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // const newId = tours[tours.length - 1].id + 1;
  // permet de creer un nouveau object on mergeant 2 aure object : object.assign()
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     if (err) console.log('erreur ecritture new tours in file...');
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );

  // console.log('our body .......:::', req.body);
  //creation instance of model Tour
  // const testTour = new TourModel(req.body);
  // testTour
  //   .save()
  //   .then((doc) => {
  //     console.log('le doc Tour cree est :', doc);
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: testTour,
  //       },
  //     });
  //   })
  // .catch((err) => {
  //   console.log('erreur lors de creation du doc :', err);
  //   res.status(500).json({
  //     status: 'fail',
  //     message: 'echec create Tour !',
  //   });
  // });
});

exports.getTours = catchAsync(async (req, res, next) => {
  // const readable = fs.createReadStream(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   'utf-8'
  // );
  // readable.on('error', err => {
  //   console.log('erruuururu::', err);
  //   res.status(500).send('file not found');
  // });
  // readable.on('data', chunk => {
  //   console.log('chunkkk::', chunk);
  //   res.write(chunk);
  // });
  // readable.on('end', () => {
  //   res.status(200);
  //   res.end();
  // });

  // res.status(200);
  // readable.pipe(res);
  // console.log('our data tours :::', dataTours);

  // 2eme methode :
  // const t = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  const features = new APIFeatures(req.query, TourModel.find())
    .filter()
    .sort()
    .paginate()
    .select();

  const tours = await features.queryMongoose;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // puisque le req.params.id est de type string et l id de lobject est de type integer alors il faut changer le type du id du params
  // const id = req.params.id * 1;
  // const tour = tours.find((tour) => tour.id === id);

  // console.log(req.params.id);
  // const tour = await TourModel.find({ _id: req.params.id });
  const tour = await TourModel.findById(req.params.id).populate('reviews');
  // raccourci pour findById -- const tour = TourModel.findOne({ _id: req.params.id });
  if (!tour) {
    return next(new AppError('tour not found with that ID!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await TourModel.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    message: 'deleted with success',
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  //const tour = await TourModel.findById(req.params.id);
  const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('tour not found with that ID!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
