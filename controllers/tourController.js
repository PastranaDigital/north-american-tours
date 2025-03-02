// ---------- REFACTORED SECTION ---------- //
const { response } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (request, response) => {
  //   console.log('request.query: ', request.query); //? pulls in if the route contains any query key value pairs
  try {
    //? Build the query
    //! this API would need clear documentation for the users to understand what and how they can filter by
    const features = new APIFeatures(Tour.find(), request.query);
    features.filter().sort().limitFields().paginate();

    //? Execute query
    const tours = await features.query;

    response.status(200).json({
      status: 'success',
      requestedAt: request.requestTime,
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createNewTour = async (request, response) => {
  // const newTour = new Tour({ <data> })
  // newTour.save().then()
  try {
    const newTour = await Tour.create(request.body);
    response.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (error) {
    // possible errors would be if the request didn't have the required fields
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getSpecificTour = async (request, response) => {
  try {
    const selectedTour = await Tour.findById(request.params.id); // same as Tour.findOne({_id: request.params.id})
    response.status(200).json({
      status: 'success',
      data: {
        tour: selectedTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateTour = async (request, response) => {
  try {
    const selectedTour = await Tour.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true, // returns the new version
        runValidators: true,
      }
    );
    Tour.findOneAndUpdate;
    response.status(200).json({
      status: 'success',
      data: {
        tour: selectedTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id); //? no need to save anything here
    response.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTourStats = async (request, response) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: null, // null = no grouping | define the property to group by those values (ex: '$difficulty')
          numRatings: { $sum: '$ratingsQuantity' },
          numTours: { $sum: 1 }, // this just increases the count by 1 for each result
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);

    response.status(200).json({
      status: 'success',
      data: {
        count: stats.length,
        stats: stats,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (request, response) => {
  try {
    const year = request.params.year * 1;
    console.log('year: ', year);
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      //   { $limit: 6 }, //? how to limit if needed
    ]);

    response.status(200).json({
      status: 'success',
      data: {
        count: plan.length,
        plan: plan,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

// ---------- OLD WAY WE DID THIS ---------- //
/*
const fs = require('fs');

//? where we imported the data via JSON file
const toursSimple = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//? handles validation for us and is called by the Middleware in the Routes file
exports.checkID = (request, response, next, value) => {
  console.log(`Checking id: ${value}`);
  if (value * 1 > toursSimple.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'Id not found',
    });
  }
  next();
};

exports.checkBodyForRequiredProperties = (request, response, next) => {
  //   console.log(request.body);
  if (!request.body.name || !request.body.price) {
    return response.status(400).json({
      status: 'fail',
      message: 'Missing properties: (name, price)',
    });
  }
  next();
};

//? route handlers
exports.getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    results: toursSimple.length,
    data: {
      tours: toursSimple,
    },
  });
};

exports.createNewTour = (request, response) => {
  //   console.log(request.body);
  const newId = toursSimple[toursSimple.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body); //? creating a new object from these two
  toursSimple.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(toursSimple),
    (error) => {
      //? 201 = we added a new file successfully
      response.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

exports.getSpecificTour = (request, response) => {
  //   console.log(request.params);
  const id = request.params.id * 1; //? convert the string to a number
  const selectedTour = toursSimple.find((element) => element.id === id);

  response.status(200).json({
    status: 'success',
    // results: toursSimple.length,
    data: {
      tour: selectedTour,
    },
  });
};

exports.updateTour = (request, response) => {
  const id = request.params.id * 1; //? convert the string to a number
  const selectedTour = toursSimple.find((element) => element.id === id);

  response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTour = (request, response) => {
  const id = request.params.id * 1; //? convert the string to a number
  const selectedTour = toursSimple.find((element) => element.id === id);

  //? deletion successful
  response.status(204).json({
    status: 'success',
    data: null,
  });
};

*/
