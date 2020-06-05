const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//si la requete n est pas catcher par ces 2 anciens middleware tourRouter ou userRouter pour terminer et envoyer une response, alors il passe au middleware suivant avec all
app.all('*', (req, res, next) => {
  // on fait appel au next mais avec error comme argument, le fait que nous passe n importe quelle arg au next(arg), expresse ignore tous les middleware suivant dans le stack et execute le middleware de handling Error
  next(new AppError(`canot find ${req.originalUrl} in this server!`, 404));
});

// tous middleware ont 4 args est un Error middleware handler
// 1ere etape est de creer le middleware est
// 2eme etape creration d error whene on aura une error, on le fait dans app.all (handler of inexistant route)
app.use(errorHandler);

module.exports = app;
