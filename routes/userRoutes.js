const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router(); //? this is essentially a mini-application to help consolidate routing for the users

//? Middleware that will only run on this parameter
router.param('id', userController.checkID);

//? Users
router
  .route('/')
  .get(userController.getAllUsers)
  .post(
    userController.checkBodyForRequiredProperties,
    userController.createUser
  );
router
  .route('/:id')
  .get(userController.getSpecificUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
