var express = require('express');
var bodyparser = require('body-parser');

var {
  mongoose
} = require('../db/mongoose');
// console.log(mongoose);
var models = require('../models/models')(mongoose);

var app = express();

app.use(bodyparser.json());

app.post('/todo', (req, res) => {
  console.log(req.body);

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
});

app.listen(3000, () => {
  console.log('Start on port localhost:3000');
});

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
