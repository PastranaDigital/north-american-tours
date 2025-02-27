const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

//? handles validation for us and is called by the Middleware in the Routes file
exports.checkID = (request, response, next, value) => {
  console.log(`Checking id: ${value}`);
  const selectedUser = users.find((element) => element._id === value);

  //! handle error where Id is outside of list
  if (!selectedUser)
    return response.status(404).json({
      status: 'fail',
      message: 'Id not found',
    });
  next();
};

exports.checkBodyForRequiredProperties = (request, response, next) => {
  //   console.log(request.body);
  if (!request.body.name || !request.body.email) {
    return response.status(400).json({
      status: 'fail',
      message: 'Missing properties: (name, email)',
    });
  }
  next();
};

//? route handlers
exports.getAllUsers = (request, response) => {
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    results: users.length,
    data: {
      users: users,
    },
  });
};

exports.createUser = (request, response) => {
  //   console.log(request.body);
  const newId = users[users.length - 1]._id + 1;
  const newUser = Object.assign({ _id: newId }, request.body); //? creating a new object from these two
  users.push(newUser);
  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    (error) => {
      //? 201 = we added a new file successfully
      response.status(201).json({
        status: 'success',
        data: {
          users: newUser,
        },
      });
    }
  );
};

exports.getSpecificUser = (request, response) => {
  const id = request.params.id;
  const selectedUser = users.find((element) => element._id === id);

  response.status(200).json({
    status: 'success',
    // results: users.length,
    data: {
      user: selectedUser,
    },
  });
};

exports.updateUser = (request, response) => {
  const id = request.params.id;
  const selectedUser = users.find((element) => element._id === id);

  response.status(200).json({
    status: 'success',
    data: {
      user: '<Updated user here>',
    },
  });
};

exports.deleteUser = (request, response) => {
  const id = request.params.id;
  const selectedUser = users.find((element) => element._id === id);

  //? deletion successful
  response.status(204).json({
    status: 'success',
    data: null,
  });
};
