const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name!'],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valide email!'],
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
  },
});

module.exports = mongoose.model('User', userSchema);
