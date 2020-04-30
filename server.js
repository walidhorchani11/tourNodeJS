const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const PORT = 3000;
const app = require('./app');

// console.log('string de cnx is :::', db);
(async () => {
  try {
    const db = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
    await mongoose.connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('cnx etablie avec sucees on async await...');
    // await handleBdd.emptyTourCollection();
    // handleBdd.importData(`${__dirname}/dev-data/data/tours-simple.json`);
  } catch (error) {
    console.log(error);
  }
})();

// mongoose
//   .connect(db, {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
//   .then((con) => {
//     //console.log(con.connections);
//     console.log('connection etablie avec success ...');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.listen(PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
