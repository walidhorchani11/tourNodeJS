const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 404,
    message: `cant find route ${req.originalUrl} on this server!`,
  });
});

//si la requete n est pas catcher par ces 2 anciens middleware tourRouter ou userRouter pour terminer et envoyer une response, alors il passe au middleware suivant avec all
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `canot find ${req.originalUrl} in this server!`,
  // });
  const error = new Error(`canot find ${req.originalUrl} in this server!`);
  error.status = 'fail';
  error.statusCode = 404;

  // on fait appel au next mais avec error comme argument, le fait que nous passe n importe quelle arg au next(arg), expresse ignore tous les middleware suivant dans le stack et execute le middleware de handling Error
  next(error);
});

// tous middleware ont 4 args est un Error middleware handler
// 1ere etape est de creer le middleware est
// 2eme etape creration d error whene on aura une error, on le fait dans app.all (handler of inexistant route)
app.use((err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
