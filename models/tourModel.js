const mongoose = require('mongoose');
const slugify = require('slugify');

//? SCHEMA Setup
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //? optional error message
      unique: true,
      trim: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 499,
    },
    priceDiscount: Number,
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
  },
  // options object
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
