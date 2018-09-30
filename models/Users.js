var mongoose = require('mongoose');

// save model
var Users = mongoose.model('Users', {
  name: {
    type: String,
    require: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    allowBlank: false,
    require: true
  },
  age: {
    type: Number,
    require: true
  },
  address: {
    type: String,
    require: true
  }
});
