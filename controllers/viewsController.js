const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (request, response, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render template using tour data from 1)
  response.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });

  next();
});

exports.getTour = catchAsync(async (request, response, next) => {
  // 1) Get tour data from collection
  const tour = await Tour.findOne({
    slug: request.params.slug,
  }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  //   console.log('tour: ', JSON.parse(JSON.stringify(tour)));
  // 2) Build template
  // 3) Render template using tour data from 1)
  response.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour: tour,
  });

  next();
});
