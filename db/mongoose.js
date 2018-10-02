var mongoose = require('mongoose');
// require('mongoose-type-email');

// var todoModel = require('../models/Todo');
// var userModel = require('../models/Users');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Mongoose-TodoApp', {
  useCreateIndex: true,
  useNewUrlParser: true
}, (err) => {
  if (err)
    console.log('Unable to connect to Mongodb Server');
});


module.exports = {mongoose};
