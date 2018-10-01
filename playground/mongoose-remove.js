const {
  MongoClient,
  ObjectID
} = require('mongodb');

const {
  app,
  mongoose,
  models
} = require('../server/server');

var id = '5bb273427fbc999850c14326'; // Todo doc id

if (!ObjectID.isValid(id)) {
  return console.log('ID is invalid');
}

// return console.log(mongoose.connections[0].client);

MongoClient.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/${mongoose.connections[0].name}`, {
  useNewUrlParser: true
}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to Mongodb Server');
  }

  const db = client.db(mongoose.connections[0].name);

  // return console.log(mongoose.connections[0].client);
  // return console.log(mongoose.connections[0].name);
  // return console.log(models.Todo.collection.NativeCollection.name);


  // // remove by condition where completed condition is set to true
  // RemoveDocsByCondition(db, 'todos', {
  //   completed: true
  // })
  //
  //
  // // remove all the docs with out passing any condition at all.(Dangares cammand )
  // RemoveAllDocs(db, 'todos');

  // FindByIdAndRemove doesn't work in MongoCleint
  // For this we are using Model.Todo.findByIdAndRemove
  models.Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return hanldeError('No record found!');
    }
    console.log('Find todo By Id', todo);
  }).catch((e) => console.log(e));

  // id = '5bae58f61f312b373696affe11'; // Users doc id
  //
  // if (!ObjectID.isValid(id)) {
  //   return hanldeError('ID is invalid');
  // }
  //
  // RemoveAllDocs(db, 'users');
  //
  // FindOneDocs(db, 'users', {
  //   _id: new ObjectID(id)
  // });
  //
  // // FindById doesn't work in MongoCleint
  // // For this we are using Model.Todo.findById
  // models.Users.findById(id).then((user) => {
  //   if (!user) {
  //     return hanldeError('No record found!');
  //   }
  //   hanldeError('Find user By Id', user);
  // }).catch((e) => console.log(e));

  client.close();
});

var hanldeError = function(eMsg, err) {
  if (!err) {
    console.log(eMsg);
  } else {
    console.log(eMsg, err);
  }
}

var RemoveAllDocs = (db, collectionObj) => {
  db.collection(collectionObj).remove({}).then((docs) => {
    // console.log(collectionObj);
    return console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    return hanldeError(`Unable to find any ${collectionObj}`, err);
  });
};

var RemoveDocsByCondition = (db, collectionObj, findObj) => {
  db.collection(collectionObj).remove(findObj).then((doc) => {
    // console.log(collectionObj);
    return console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    return hanldeError(`Unable to find any ${collectionObj}`, err);
  });
};
