//? this file holds all server specific information

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); //? need to read these before the app tries to use them

const app = require('./app');

const DB = process.env.DATABASE_EXAMPLE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    //? Local db usage
    //   .connect(DB, { //? if I used Atlas
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    // console.log(connection.connections);
    console.log('DB Connection Established');
  });

// console.log(process.env);

//? turns on the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.clear();
  console.log('|--------------------------------------|');
  console.log(`App running on port ${port}...`);
});
