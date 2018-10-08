// var mongoose = require('mongoose');
// var {mongoose} = require('../db/mongoose');
require('mongoose-type-email');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

var loadTodoSchema = function(mongoose) {
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
  return todoSchema;
}

var loadUsersSchema = function(mongoose) {

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
  // overwrite Return method to return id and email only
  userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
  };

  // generate Authentication token using JWT
  userSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
      _id: user._id.toHexString(),
      access: 'auth'
    }, 'abc123').toString();

    //console.log('Gen-Token:', token);
    user.tokens = user.tokens.concat([{
      access,
      token
    }]);

    return user.save().then(() => {
      return token;
    });
  };

  // find user by loading passed in token adn checking database.
  userSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
      // console.log('token:', token);
      decoded = jwt.verify(token, 'abc123');
    } catch (e) {
      //console.log('Error DECODING TOKEN:-', e);
      return Promise.reject();
    }
    var findedUser = User.findById({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
    // console.log('findedUser: ', findedUser);
    return findedUser;
  };

  userSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    try {
      return User.findOne({
        email
      }).then((user) => {

        if (!user) {
          console.log('No User found!');
          return Promise.reject();
        }
        
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              resolve(user);
            } else {
              if (err) {
                console.log('compare password error: ', err);
              }
              console.log('got rejected');
              reject();
            }
          });
        });

      });
    } catch (e) {
      console.log(e);
    }
  };


  userSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          user.password = hash;
          next();
        });
      });

    } else {
      next();
    }
  });

  return userSchema;
}

module.exports = function(mongoose) {
  return models = {
    Todo: mongoose.model('Todo', loadTodoSchema(mongoose)),
    Users: mongoose.model('Users', loadUsersSchema(mongoose))
  };
}
