module.exports = (fn) => {
  //deleteTour par exp doit contenir une fct qui sera appeler par express 
  // whene request come et pas le resultat d execution alors on passe par une autre function
  //et on definit ic les params
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
    // on peut directement appeler next dans le catch sans err
  };
};
