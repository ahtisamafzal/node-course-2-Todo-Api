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

MongoClient.connect('mongodb://localhost:27017/TodoApp', {
  useNewUrlParser: true
}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to Mongodb Server');
  }

  console.log('Connected to Mongodb Server');
  const db = client.db('TodoApp');


  //DeleteMany records from MongoDB Todos
  var deleteOptions = {
    text: "Something to do"
  };
  //DeleteManyDocs(db, 'Todos', deleteOptions);
  // deleteOptions = {
  //   text: "Sonething to do"
  // };
  // DeleteOneDoc(db, 'Todos', deleteOptions);
  deleteOptions = {
    _id: new ObjectID('5bad3313f6ccc5215b779fad')
  };
  FindOneDeleteDoc(db, 'Todos', deleteOptions);

  //DeleteMany records into MongoDB Users
  // deleteOptions = {
  //   name: "Ahtisam"
  // };
  //DeleteManyDocs(db, 'users', deleteOptions);
  // deleteOptions = {
  //   name: "Ahtisam"
  // };
  //DeleteOneDoc(db, 'Todos', deleteOptions);

  deleteOptions = {
    complete: false
  };
  FindOneDeleteDoc(db, 'users', deleteOptions);

  client.close();
});

//Delete Many
var DeleteManyDocs = (db, collectionObj, deleteObj) => {
  db.collection(collectionObj).deleteMany(deleteObj).then((result) => {
    return console.log(JSON.stringify(result, undefined, 2));
  }, (err) => {
    return console.log(`Unable to find any ${collectionObj}`, err);
  });
};

//Delete One
var DeleteOneDoc = (db, collectionObj, deleteObj) => {
  db.collection(collectionObj).deleteOne(deleteObj).then((result) => {
    return console.log(JSON.stringify(result, undefined, 2));
  }, (err) => {
    return console.log(`Unable to find any ${collectionObj}`, err);
  });
};

//FindOne and Delete
var FindOneDeleteDoc = (db, collectionObj, deleteObj) => {
  db.collection(collectionObj).findOneAndDelete(deleteObj).then((doc) => {
    return console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    return console.log(`Unable to find any ${collectionObj}`, err);
  });
};
