const expect = require('expect');
const request = require('supertest');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const {
  app,
  mongoose,
  models
} = require('../server/server');

const {
  ObjectID
} = require('mongodb');

const {
  todos,
  users,
  populateTodos,
  populateUsers,
  newUser,
  invalidUser
} = require('./seed/seed')(models);

beforeEach(populateUsers);
beforeEach(populateTodos);

// beforeEach((done) => {
//   models.Todo.deleteMany({}).then(() => {
//     return models.Todo.insertMany(todos);
//   }).then(() => {
//     models.Users.deleteMany({}).then(() => {
//       return models.Users.insertMany(users);
//     }).then(() => done());
//   });
// });




describe('POST /todo', () => {
  it('Should create a new Todo', (done) => {

    var todoModel = new models.Todo({
      text: 'testing todo by valid passing model test',
      completed: false,
      completedAt: 0
    });

    request(app)
      .post('/todo')
      .send(todoModel)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(todoModel.text);
      }).end((err, res) => {
        if (err) {
          return done(err);
        }
        models.Todo.find({
          text: todoModel.text
        }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(todoModel.text);
          expect(todos[0].completed).toBe(todoModel.completed);
          // expect(todos[0].completedAt).toBe(todoModel.completedAt);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todo')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      });

    models.Todo.find().then((todos) => {
      expect(todos.length).toBe(3);
      done();
    }).catch((e) => done(e));
  });

});

describe('GET /todo', () => {
  it('Should load all Todos', (done) => {
    request(app)
      .get('/todo')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  });
});

describe('GET /todo/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todo/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return 404 if todo doc not found', (done) => {
    var hexId = new ObjectID();
    request(app)
      .get(`/todo/${hexId}`)
      .expect(404)
      .expect((res) => {
        expect(res.text.length).toBe(0)
      })
      .end(done);
  });

  it('Should return 404 for none object ids', (done) => {
    request(app)
      .get(`/todo/${123}`)
      .expect(404)
      .expect((res) => {
        expect(res.text).toBe('ID is invalid')
      })
      .end(done);
  });
});

describe('DELETE /todo/:id', () => {
  it('Should delete todo doc', (done) => {
    request(app)
      .delete(`/todo/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return 404 if todo doc not found', (done) => {
    var hexId = new ObjectID();
    // console.log(hexId);
    request(app)
      .delete(`/todo/${hexId}`)
      .expect(404)
      .expect((res) => {
        expect(res.text.length).toBe(0)
      })
      .end(done);
  });

  it('Should return 404 for none object ids', (done) => {
    request(app)
      .delete(`/todo/${123}`)
      .expect(404)
      .expect((res) => {
        expect(res.text).toBe('ID is invalid')
      })
      .end(done);
  });
});


describe('PATCH /todo/:id', () => {
  it('Should update todo doc completed status to TRUE & set completedAt equals to currecnt DATE', (done) => {
    // _.pick(req.body, ['text', 'completed']);
    var reqBody = todos[0];
    reqBody.text = "updated by patch call with status true";
    reqBody.completed = true;

    request(app)
      .patch(`/todo/${reqBody._id.toHexString()}`)
      .send(reqBody)
      .expect(200)
      .expect((res) => {
        var resBody = _.pick(res.body.todo, ['text', 'completed', 'completedAt']);
        // console.log(resBody);
        expect(resBody.text).toBe(reqBody.text);
        expect(typeof resBody.completed).toBe('boolean');
        expect(resBody.completed).toBe(true);
        expect(typeof resBody.completedAt).toBe('string');
      })
      .end(done);
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    var reqBody = todos[1];
    reqBody.text = "updated by patch call with status false";
    reqBody.completed = false;
    request(app)
      .patch(`/todo/${reqBody._id.toHexString()}`)
      .send(reqBody)
      .expect(200)
      .expect((res) => {
        var resBody = _.pick(res.body.todo, ['text', 'completed', 'completedAt']);
        // console.log(resBody);
        expect(resBody.text).toBe(reqBody.text);
        expect(typeof resBody.completed).toBe('boolean');
        expect(resBody.completed).toBe(false);
        expect(resBody.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

//5bb6552ff74e98fa7acb00e8

describe('GET /user/me', () => {
  // console.log(JSON.stringify(users, undefined, 2));
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/user/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/user/me')
      //.set('x-auth', users[0].tokens[0].token + 111)
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});


describe('POST /user', () => {
  it('Should create a user', (done) => {
    request(app)
      .post('/user')
      .send(newUser)
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toEqual(newUser.email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        var email = newUser.email;
        models.Users.findOne({
          email
        }).then((user) => {
          expect(user).toBeTruthy();
          // expect(user.password.length).toBe(>6);
          done();
        });
      });
  });

  it('Should return validation error if request is invalid ', (done) => {
    request(app)
      .post('/user')
      .send(invalidUser)
      .expect(400)
      .expect((res) => {
        expect(res.body._message).toEqual("Users validation failed");
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('Should not create user if email is in use', (done) => {
    request(app)
      .post('/user')
      .send(users[0])
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toEqual('MongoError');
        expect(res.body.code).toEqual(11000);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

});
