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

var {
  mongoose
} = require('../db/mongoose');
// console.log(mongoose);
var models = require('../models/models')(mongoose);
const port = process.env.PORT || 3000;

var app = express();

app.use(bodyparser.json());


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
