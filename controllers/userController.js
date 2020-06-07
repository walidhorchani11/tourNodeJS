const multer = require('multer');
const AppError = require('../utils/appError');
const User = require('../models/userModel.js');

//config multer storage
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../public/img/walid`);
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    //user-userId-timestamp.ext
    // user-51v51r5135-516516115131.jpeg
    // injection du id pas encore faite
    //cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `user-${Date.now()}.${ext}`);
  },
});

//config multer filter
const multerFiler = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('not an image! please upoad image!', 400));
  }
};

// const upload = multer({ storage: multerStorage, fileFilter: multerFiler });
const upload = multer({ storage: multerStorage, fileFilter: multerFiler });
exports.uploadUserPhoto = upload.single('photo');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        user: null,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.file) req.body.photo = req.file.filename;
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
