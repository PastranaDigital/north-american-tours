const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

//? SCHEMA Setup
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //? built in validation ("required" in the schema)
      required: [true, 'A tour must have a name'], //? optional error message
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour name must have no more or equal than 40 characters',
      ],
      minLength: [10, 'A tour name must have more or equal than 10 characters'],
      //   validate: [validator.isAlpha, 'A tour name must only have characters'], // this will fail if spaces are present
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      //? limit the input options
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //? custom validation - False triggers a validation error
      validate: {
        message: 'Discount price ({VALUE}) should be less than the price.',
        validator: function (value) {
          // this will not work on the update because we are using the "this" keyword
          return value < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true, // remove all white space at beginning and end,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //? this will exclude this from ever showing outside of the DB
    },
    startDates: [Date], //ex:  ["2021-03-21", "2024-05-11, 11:50"] //? MongoDB will try to parse these into dates and will throw an error if it fails
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  // we use a normal function because we want access to the "this" property
  return this.duration / 7;
});

//? DOCUMENT MIDDLEWARE: runs before .save() & .create() but NOT .insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// //? runs after .save() & .create()
// tourSchema.post('save', function (document, next) {
//   console.log(document);
//   next();
// });

//? QUERY MIDDLEWARE: ex: to isolate a specific property
//? this intersects before the query is executed
//? this - points to the query object
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  //? we now have access to the docs returned
  //   console.log(docs);
  next();
});

//? AGGREGATION MIDDLEWARE; let's us keep specific property out of the aggregation in the stats
//? this - points to the current aggregation object
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline()); // this is the pipeline we created
  next();
});

const Tour = mongoose.model('Tour', tourSchema); //? Captial name since it is Model and like a Class, should be easily identified

module.exports = Tour;

/* used for testing in the server.js


const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((error) => {
    console.log('ERROR: ', error);
  });



  */
