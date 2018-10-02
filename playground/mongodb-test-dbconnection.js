#!/usr/bin/env node

'use strict';

const {
  MongoClient,
  ObjectID,
  Logger
} = require('mongodb');

const uri = (process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
const opts = {
  useNewUrlParser: true
};

async function run() {
  const client = new MongoClient(uri, opts);
  await client.connect();
  const db = client.db('gh-6881');
  await db.dropDatabase().catch(handleError);

  Logger.setLevel('debug');
  let res = await db
    .collection('Todos')
    .findOneAndUpdate({
      _id: new ObjectID('5ba89eab2482c0a688949d94')
    }, {
      $set: {
        text: 'michael',
        complete: true
      }
    }, {
      returnOriginal: false
    })
    .catch(handleError);
  Logger.setLevel('error');
  console.log('res RESPONSE: ', res);
  let doc = await db
    .collection('Todos')
    .findOne({_id: new ObjectID('5ba89eab2482c0a688949d94')})
    .catch(handleError);

  console.log('doc RESPONSE: ', doc);
  process.exit(0);
}

run();

function handleError(e) {
  return console.error('ERROR--: ', e.message);
}
