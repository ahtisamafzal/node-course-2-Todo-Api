// var mongoose = require('mongoose');
// var {mongoose} = require('../db/mongoose');
require('mongoose-type-email');
module.exports = function(mongoose) {
  // declare todo document schema here
  var todoSchema = new mongoose.Schema({
    text: {
      type: String,
      minLength: 5,
      maxLength: 255,
      required: [true, 'Text is required field'],
      trim: true
    },
    completed: {
      type: Boolean,
      required: [true, 'Completed is required field']
    },
    completedAt: {
      type: Number,
      required: [true, 'CompletedAt is required field']
    }
  });
  // declare users document schema here
  var userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Name is required field']
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      allowBlank: false,
      required: [true, 'Email is required field'],
      minLength: 1,
      trim: true
    },
    age: {
      type: Number,
      min: 18,
      max: 150,
      minLength: 2,
      maxLength: 3,
      required: [true, 'Age is required field']
    },
    address: {
      type: String,
      required: [true, 'Address is required field']
    }
  });
  var models = {
    Todo: mongoose.model('Todo', todoSchema),
    Users: mongoose.model('Users', userSchema)
  };
  return models;
}
