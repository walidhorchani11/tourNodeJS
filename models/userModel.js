const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'username required !'] },
  password: { type: String, required: true, select: false },
  email: {
    type: String,
    required: true,
    unique: [true, 'mail already exist !'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
