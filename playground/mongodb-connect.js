//MongoDB module v3
const MongoClient = require('mongodb').MongoClient;
// const {MongoClient, ObjectID} = require('mongodb');
// var obj = new ObjectID();
// return console.log(obj);


// var user = {
//   name: 'Ahtisam',
//   age: 38
// };
// var {
//   name
// } = user
// console.log(name);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to Mongodb Server');
  }

  console.log('Connected to Mongodb Server');
  const db = client.db('TodoApp');

  var insertObj = {
    text: 'Something to do',
    complete: false
  };

  //Inserting record into MongoDB TodoApp
  InsertDoc(db, 'Todos', insertObj);

  insertObj = {
    name: 'Ahtisam',
    age: 38,
    location: 'Sutton Lane Hounslow, TW34LA',
    complete: false
  };

  //Inserting record into MongoDB TodoApp
  InsertDoc(db, 'users', insertObj);

  client.close();
});




var InsertDoc = (db, collectionObj, insertObj) => {
  db.collection(collectionObj).insertOne(insertObj, (err, result) => {
    if (err) {
      return console.log('Unable to insert Todo', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
    //Load DateTimeStamp when object is created.
    console.log(result.ops[0]._id.getTimestamp());
  });
};
