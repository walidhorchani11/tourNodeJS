const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: `${__dirname}/../../config.env` });

// cnx au bdd
const bd = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
(async () => {
  try {
    await mongoose.connect(bd, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('cnx etablie avec success');
  } catch (error) {
    console.log(error);
  }
})();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`)
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully imported');
  } catch (error) {
    console.log(error);
  }
  // exit pour ne pas laisser la commande running
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);

// const readFilePro = (file) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, (err, data) => {
//       if (err) reject(err);
//       resolve(data);
//     });
//   });
// };

// //lire les donnees du fichier json
// exports.importData = async (file) => {
//   try {
//     const tours = JSON.parse(await readFilePro(file));
//     tours.map(async (tour) => {
//       const newTour = await Tour.create(tour);
//       console.log(
//         `tour with name : ${tour.name} was created on id : ${newTour._id}`
//       );
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.emptyTourCollection = async () => {
//   try {
//     const tours = await Tour.find();
//     tours.map(async (tour) => {
//       await Tour.findByIdAndDelete(tour._id);
//       console.log(`${tour._id} was deleted ...`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
