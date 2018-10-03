// var mongoose = require('mongoose');
// var {mongoose} = require('../db/mongoose');
require('mongoose-type-email');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
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
      type: Date
    }
  });
  // declare users document schema here
  var userSchema = new mongoose.Schema({
    fullname: {
      type: String
    },
    firstname: {
      type: String,
      required: [true, 'firstname is required field']
    },
    lastname: {
      type: String,
      required: [true, 'lastname is required field']
    },
    middlename: {
      type: String
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      allowBlank: false,
      required: [true, 'Email is required field'],
      minLength: 1,
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email.'
      }
    },
    password: {
      type: String,
      required: [true, 'Name is required field'],
      minLength: 6
    },
    dob: {
      type: Date,
      required: [true, 'DOB is required field']
    },
    address: {
      type: String,
      required: [true, 'Address is required field']
    },
    tokens: [{
      access: {
        type: String,
        required: [true, 'access is required field']
      },
      token: {
        type: String,
        required: [true, 'token is required field']
      },
    }],
    createdat: {
      type: Date,
      default: Date.now
    },
    updatedat: {
      type: Date,
      default: Date.now
    }
  });

  userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);

  };

  userSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
      id: user._id.toHexString(),
      access
    }, '123abc').toString();

    user.tokens = user.tokens.concat([{
      access,
      token
    }]);

    return user.save().then(() => {
      return token;
    });
  };
  var models = {
    Todo: mongoose.model('Todo', todoSchema),
    Users: mongoose.model('Users', userSchema)
  };
  return models;
}
