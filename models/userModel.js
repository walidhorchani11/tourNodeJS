const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    select: false,
    // this only works on CREATE or SAVE !! verifier pour update si nn essaye d utiliser save on update handler instead of findByIdandUpdate
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: 'password confirm does not match password!',
    },
  },
  photo: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // si on va setter le champs password alors on passe au cryptage
  this.password = await bcrypt.hash(this.password, 12);
  // pas besoin d enrigistrer passwordConfirm au bdd
  this.passwordConfirm = undefined;
  next();
});

module.exports = mongoose.model('User', userSchema);
