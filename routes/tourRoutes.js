const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router(); //? this is essentially a mini-application to help consolidate routing for the tours

// //? Middleware that will only run on this parameter
// router.param('id', tourController.checkID); // now being handled by MongoDB

//? Tours
//? in order to preset the request.query values before running this, we will have to build a middleware method that will run on this route
//! this needs to go above the base route
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createNewTour);
router
  .route('/:id')
  .get(tourController.getSpecificTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
