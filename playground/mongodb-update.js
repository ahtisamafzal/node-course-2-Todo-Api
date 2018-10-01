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

MongoClient.connect(Process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
  useNewUrlParser: true
}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to Mongodb Server');
  }

  console.log('Connected to Mongodb Server');
  const db = client.db('TodoApp');

  //FindOne and Update records from MongoDB Todos
  var updateOption = {
    returnOriginal: false
  };

  var updateFilter = {
    _id: new ObjectID('5ba7d40a7d7eab997ecfdfb5')
  };

  var updateObject = {
    $set: {
      complete: true,
      text: "Hellooo World"
    }
  };

  FindOneUpdateDoc(db, 'Todos', updateFilter, updateObject, updateOption);

  //FindOne and Update records from MongoDB users
  updateFilter = {
    _id: new ObjectID('5ba7d17a04ed9d992119e7cf')
  };

  updateObject = {
    $set: {
      name: "Ahtisam"
    },
    $inc: {
      age: 1
    }
  };

  FindOneUpdateDoc(db, 'users', updateFilter, updateObject, updateOption);

  client.close();
});

//FindOne and Update
var FindOneUpdateDoc = (db, collectionObj, updateFilter, updateObj, updateOption) => {

  db.collection(collectionObj).findOneAndUpdate(updateFilter, updateObj, updateOption).then((doc) => {
    return console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    return console.log(`Unable to find any ${collectionObj}`, err);
  });
};
