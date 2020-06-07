const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
const upload = multer({ dest: 'public/img/walid' });

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/').get(userController.getUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(upload.single('photo'), userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
