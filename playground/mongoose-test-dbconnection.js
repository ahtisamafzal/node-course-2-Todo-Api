#!/usr/bin/env node

'use strict';

const {
  MongoClient,
  ObjectID,
  Logger
} = require('mongodb');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const url = (process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
const opts = {
  useCreateIndex: true,
  useNewUrlParser: true
};

mongoose.connect(url, opts);
const conn = mongoose.connection;
const Schema = mongoose.Schema;

const schema = new Schema({
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
  }
});

const Todos = mongoose.model('Todos', schema);

async function run() {
  await conn.dropDatabase();
  let admin = conn.db.admin();
  let {
    version
  } = await admin.serverInfo();
  console.log(`mongodb: ${version}`);
  console.log(`mongoose: ${mongoose.version}`);

  let cond = {
    _id: new ObjectID('5ba89eab2482c0a688949d94')
  };
  let update = {
    text: 'DONE',
    complete: true
  };
  let opts = {
    upsert: true,
    new: true,
    returnOriginal: false
  };

  let sarah = await Todos.findOneAndUpdate(cond, update, opts);
  console.log(sarah);
  return conn.close();
}

run();
