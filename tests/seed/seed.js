const {
  ObjectID
} = require('mongodb');
const jwt = require('jsonwebtoken');

const todos = [{
  _id: new ObjectID(),
  text: 'First Test',
  completed: false
}, {
  _id: new ObjectID(),
  text: 'Second Test',
  completed: true
}, {
  _id: new ObjectID(),
  text: 'Third Test',
  completed: false
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const newUserId = new ObjectID();
const newUser = {
  _id: newUserId,
  firstname: "Ahtisam",
  lastname: "Afzal",
  middlename: "",
  email: "ahtisam+007@gmail.com",
  password: "UserOnePass",
  dob: "08/22/1979",
  address: "sutton lane, hounslow",
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: newUserId,
      access: 'auth'
    }, 'abc123').toString()
  }]
};
const invalidUser = {
  _id: userOneId,
  firstname: "",
  lastname: "Afzal",
  middlename: "",
  email: "ahtisam@gmail.com",
  password: "UserOnePass",
  dob: "08/22/1979",
  address: "sutton lane, hounslow",
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: userOneId,
      access: 'auth'
    }, 'abc123').toString()
  }]
};
const users = [{
  _id: userOneId,
  firstname: "Ahtisam",
  lastname: "Afzal",
  middlename: "",
  email: "ahtisam+@gmail.com",
  password: "UserOnePass",
  dob: "08/22/1979",
  address: "sutton lane, hounslow",
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: userOneId,
      access: 'auth'
    }, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  firstname: "Ahtisam",
  lastname: "Afzal",
  middlename: "",
  email: "ahtisam+1@gmail.com",
  password: "UserTwoPass",
  dob: "08/22/1979",
  address: "sutton lane, hounslow"
}, {
  _id: userTwoId,
  firstname: "Ahtisam",
  lastname: "Afzal",
  middlename: "",
  email: "ahtisam+2@gmail.com",
  password: "",
  dob: "08/22/1979",
  address: "sutton lane, hounslow"
}];

module.exports = function(models) {

  const populateTodos = (done) => {
    models.Todo.deleteMany({}).then(() => {
      return models.Todo.insertMany(todos);
    }).then(() => done());
  };

  const populateUsers = (done) => {
    models.Users.deleteMany({}).then(() => {
      //return models.Users.insertMany(todos);
      var userOne = new models.Users(users[0]).save();
      var userTwo = new models.Users(users[1]).save();

      return Promise.all([userOne, userTwo]);

    }).then(() => done());
  };


  return {
    todos,
    populateTodos,
    users,
    populateUsers,
    newUser,
    invalidUser
  }
};
