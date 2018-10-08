var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.port = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/Mongoose-TodoApp';
} else if (env === 'test') {
  process.env.port = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/Mongoose-TodoAppTest';
}
console.log('env*********', env);
const _ = require('lodash');
const express = require('express');
const bodyparser = require('body-parser');
const {
  ObjectID
} = require('mongodb');
const jwt = require('jsonwebtoken');
var {
  mongoose
} = require('../db/mongoose');
// console.log(mongoose);
var models = require('../models/models')(mongoose);
var authenticate = require('./middleware/authenticate')(models);

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyparser.json());

////*************************** TODO SECTION ***************************

// POST request
app.post('/todo', (req, res) => {
  try {
    // console.log(`request coming in as JSON is : ${JSON.stringify(req.body,undefined,2)}`);
    var newTodo = new models.Todo({
      text: req.body.text,
      completed: req.body.completed,
      completedAt: req.body.completedAt,
    });
    //console.log(models.Todo);

    newTodo.save().then((doc) => {
      res.send(doc);
    }, (err) => {
      if (err)
        res.status(400).send(err);
    });
    //res.send();
  } catch (e) {
    if (e) {
      console.log(`Error in POST /todo, ${e}`);
    }
  }
});


// GET request
app.get('/todo', (req, res) => {
  try {
    models.Todo.find().then((todos) => {
      res.send({
        todos
      });
    }, (err) => {
      if (err)
        res.status(400).send(err);
    });
  } catch (e) {
    if (e) {
      console.log(`Error in GET /todo, ${e}`);
    }
  }
});


// GET request by Id
app.get('/todo/:id', (req, res) => {
  try {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      res.status(404).send('ID is invalid');
    }

    models.Todo.findById(id).then((todo) => {
      if (!todo) {
        res.status(404).send();
      }
      res.send({
        todo
      });
    }).catch((e) => {
      res.status(400).send();
    });

  } catch (e) {
    if (e) {
      console.log(`Error in GET /todo, ${e}`);
    }
  }

});


// DELETE request by Id
app.delete('/todo/:id', (req, res) => {
  try {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      res.status(404).send('ID is invalid');
    }

    models.Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) {
        res.status(404).send();
      }
      // console.log(removeTodo);
      res.send({
        todo
      });
    }).catch((e) => {
      res.status(400).send();
    });

  } catch (e) {
    if (e) {
      console.log(`Error in DELETE /todo, ${e}`);
    }
  }
});


// UPDATE request by
app.patch('/todo/:id', (req, res) => {
  try {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
      res.status(404).send('ID is invalid');
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    // console.log('body: ', body);

    models.Todo.findByIdAndUpdate(id, {
      $set: body
    }, {
      new: true
    }).then((todo) => {
      if (!todo) {
        res.status(404).send();
      }
      // console.log(removeTodo);
      res.send({
        todo
      });
    }).catch((e) => {
      res.status(400).send();
    });

  } catch (e) {
    if (e) {
      console.log(`Error in PATCH /todo, ${e}`);
    }
  }
});

////*************************** USERS SECTION ***************************

//POST User
app.post('/user', (req, res) => {
  try {
    // console.log(`request coming in as JSON is : ${JSON.stringify(req.body,undefined,2)}`);
    var _postedUser = _.pick(req.body, ['firstname', 'lastname',
      'middlename', 'email', 'password', 'dob', 'address', 'tokens'
    ]);

    _postedUser.dob = Date.parse(_postedUser.dob);

    var user = new models.Users(_postedUser);

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user)
    }).catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
    //res.send();
  } catch (e) {
    if (e) {
      console.log(`Error in POST /user, ${e}`);
    }
  }
});

// POST Login User
app.post('/user/login', (req, res) => {
  try {
    var body = _.pick(req.body, ['email', 'password']);

    models.Users.findByCredentials(body.email, body.password).then((_user) => {
      // res.send(user);

      return _user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(_user);
      });
    }).catch((err) => {
      console.log(err);
      res.status(400).send();
    });

  } catch (e) {
    if (e) {
      console.log(`Error in POST /user/login, ${e}`);
    }
  }
});

app.get('/user/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  try {
    console.log(`Start up at port ${port}`);
  } catch (e) {
    if (e) {
      console.log(`Error listening port ${port}, ${e}`);
    }
  }
});


module.exports = {
  app,
  mongoose,
  models
};


// var newUser = new models.Users({
//   name: 'Sabahat',
//   address: '',
//   email: 'sabi.afz@gmail.com',
//   age: 28
// });
//
// newUser.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
//   console.log('Unable to save User: ', err);
// });
