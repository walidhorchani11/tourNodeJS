const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

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
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

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
