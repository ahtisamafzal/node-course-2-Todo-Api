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


  //FindOne and Update records from MongoDB Todos
  var updateOptions = new Object({
    _id: new ObjectID('5ba7d40a7d7eab997ecfdfb5')
  }, {
    $set: {
      complete: false
    }
  }, {
    returnOriginal: false
  });
  // ({
  //     _id: new ObjectID('5ba7d40a7d7eab997ecfdfb5')
  //   },
  //   {
  //     $set: {
  //       complete: true,
  //       text: "Something something"
  //     }
  //   }, {
  //     returnOriginal: false
  //   });
  //
  //
  //
  console.log(JSON.stringify(updateOptions, undefined, 2));
  console.log(updateOptions);
  FindOneUpdateDoc(db, 'Todos', updateOptions);



  //FindOne and Update records from MongoDB users
  updateOptions = {
    _id: new ObjectID('5ba7d17a04ed9d992119e7cf')
  }, {
    $set: {
      complete: true
    }
  }, {
    returnOriginal: false
  };

  console.log(JSON.stringify(updateOptions, undefined, 2));

  FindOneUpdateDoc(db, 'users', updateOptions);

  client.close();
});



//FindOne and Delete
var FindOneUpdateDoc = (db, collectionObj, updateObj) => {
  db.collection(collectionObj).findOneAndUpdate(updateObj).then((doc) => {
    return console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    return console.log(`Unable to find any ${collectionObj}`, err);
  });
};
