//? this file holds all application (express) specific information
const path = require('path');
const express = require('express');
const morgan = require('morgan'); //? middleware to help with logging
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const pug = require('pug');
const { title } = require('process');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//? sets this folder as a place to locate any requests that aren't defined routes
//? use http://127.0.0.1:3000/overview.html instead of the public path
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//? our middleware that we will use to interpret the requests
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //? logging middleware only in dev
}
app.use(express.json());

//? Middleware that applies to all routes below it
app.use((request, response, next) => {
  console.log('in the middleware');
  next(); //? is needed for the program to flow
});
app.use((request, response, next) => {
  //? adds this to the request object for later use in response delivery
  request.requestTime = new Date().toISOString();
  next();
});

//? Middleware for specified contexts
//? Mounting routers
//? render the base template

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //? app uses this for all tour routing
app.use('/api/v1/users', userRouter); //? app uses this for all user routing

module.exports = app;
