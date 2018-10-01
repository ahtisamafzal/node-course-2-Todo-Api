//MongoDB module v3
//const MongoClient = require('mongodb').MongoClient;
const {
  MongoClient,
  ObjectID
} = require('mongodb');

// MongoClient.connect('mongodb://localhost:27017/TodoApp', {
//     // useCreateIndex: true,
//     useNewUrlParser: true
//   }).then((err, client) => {
//     console.log('connecting to database successful');
//     console.log('Connected to Mongodb Server');
//     const db = client.db('TodoApp');
//
//     //Find record into MongoDB TodoApp
//     var findOptions = {
//       completed: false
//     };
//     FindDocs(db, 'Todos', findOptions);
//
//     //Find record into MongoDB TodoApp
//     FindDocs(db, 'users', findOptions);
//
//     client.close();
//   })
//   .catch((err) => {
//     return console.error('could not connect to mongo DB', err)
//   });

MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
  useNewUrlParser: true
}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to Mongodb Server');
  }

  console.log('Connected to Mongodb Server');
  const db = client.db('TodoApp');
  CountDocs(db, 'Todos');

  //Find record into MongoDB TodoApp
  var findOptions = {
    complete: true
  };
  FindDocs(db, 'Todos', findOptions);

  CountDocs(db, 'users');
  //Find record into MongoDB TodoApp
  findOptions = {
    _id: new ObjectID('5ba76fe5e628fe8b6a60f22b')
  };
  FindDocs(db, 'users', findOptions);

  client.close();
});


var CountDocs = (db, collectionObj) => {

  db.collection(collectionObj).find().count().then((countDocs) => {
    return console.log(`${collectionObj} countDocs: ${countDocs}`);
  }, (err) => {
    return console.log(`Unable to find any ${collectionObj}`, err);
  });

};

var FindDocs = (db, collectionObj, findObj) => {
  if (findObj === null) { // Return all records as array
    db.collection(collectionObj).find().toArray().then((docs) => {
      console.log(collectionObj);
      return console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      return console.log(`Unable to find any ${collectionObj}`, err);
    });
  } else {
    db.collection(collectionObj).find(findObj).toArray().then((docs) => {
      console.log(collectionObj);
      return console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      return console.log(`Unable to find any ${collectionObj}`, err);
    });
  }
};
