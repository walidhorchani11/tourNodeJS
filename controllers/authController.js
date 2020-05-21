const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    // take only necessary fields, taking all can content
    // indesirable fields like role: admin for exp or others
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    // after signup user, normalement il sera logger, so send JWT
    // a verifier , il peut causer un probleme car il est synchrone
    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // 1- check if email & password exist
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('please provide email and password!', 400));
    }

    // 2 - check if user exist by email and password correct
    const user = await User.findOne({ email }).select('password');
    // async fct return promise so il faut await pour avoir le resultat
    // const correcte = await user.correctPassword(password, user.password);
    // console.log('corecte MDP : ', correcte);
    // we can check user first after correcte
    // mais on facilite le piratage pour un hecker, so on vague c mieux
    if (!(await user.correctPassword(password, user.password)) || !user) {
      // 401 unauthorized
      return next(new AppError('incorrect email or password!', 401));
    }

    // 3 - create & send token
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      data: {
        token,
      },
    });
  } catch (err) {
    return next(err);
  }
};
