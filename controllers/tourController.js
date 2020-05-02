const fs = require('fs');
const TourModel = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

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

exports.createTour = async (req, res) => {
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

  try {
    const newTour = await TourModel.create(req.body);
    // console.log('le doc Tour cree est :', newTour);
    res.status(201).json(newTour);
    //  {
    //   status: 'success',
    //   data: {
    //     tour: newTour,
    //   },
    // }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }

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
};

exports.aliaTopCheaps = async (req, res, next) => {
  req.query.limit = '5'; //en string , car c'est ce qu on va avoir de la part
  //d'une application cliente, et le next middleware le getTours va les manipuler
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,duration';
  next();
}

exports.getTours = async (req, res) => {
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

  try {
    // 2eme methode :
    // const t = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // // 1 - faire une copie et enlever les excludedFields ils seront encore disponible dans req.query pour autre besoin ulterieure
    // let queryObj = { ...req.query };
    // const excludedFields = ['page', 'limit', 'fields', 'sort'];
    // excludedFields.map((field) => delete queryObj[field]);

    // // 2 - advanced filter pour les operators, on veut ajouter le $ pour gt gte lt lte ,et tous autres, prc dans les applications clientes on ecrit comme ça: /api*/v1/tours?duration[gte]=5&difficulty=easy, et ça sera convertit par express vers un objet comme ça sans $ : {duration: {gte:5}, difficulty: easy}, so il manque le $ , on va convertit l objet to string , et ajouter le $ ensuite parser
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // let query = TourModel.find(JSON.parse(queryStr));

    // // 3 -  sorting by
    // if (req.query.sort) {
    //   const sortedBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortedBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // // 4 - pagination and limit
    // const limit = req.query.limit * 1 || 5;
    // const page = req.query.page * 1 || 1;
    // //page 1, 1-5/ page 2, 6-10/ page 3; 11-15
    // const skip = (page -1) * limit;
    
    // query = query.skip(skip).limit(limit);


    // // select - project
    // if(req.query.fields){
    //   //je peut recevoir fields like this = fields: "name,duration,-password" alors il faut le formater
    //   // le signe moin (-) pour exclure ce champs, il ne sera pas retourne
    //   //il exist aussi au niveau du schema mongoose une option pour exclure un champ
    //   // qui s'appel select: false
    //   const selectFields = req.query.fields.split(',').join(' ');
    //   query = query.select(selectFields);
    // }else {
    //   //on va exclure un champs de ne va pas retourne qui s'appel __v , ajoute automatiquement par mongoose
    //   query = query.select('-__v');
    // }

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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  // puisque le req.params.id est de type string et l id de lobject est de type integer alors il faut changer le type du id du params
  // const id = req.params.id * 1;
  // const tour = tours.find((tour) => tour.id === id);

  try {
    // console.log(req.params.id);
    // const tour = await TourModel.find({ _id: req.params.id });
    const tour = await TourModel.findById(req.params.id);
    // raccourci pour findById -- const tour = TourModel.findOne({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await TourModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'deleted with success',
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    //const tour = await TourModel.findById(req.params.id);
    const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
