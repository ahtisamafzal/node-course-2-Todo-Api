const expect = require('expect');
const request = require('supertest');

const {
  app,
  mongoose,
  models
} = require('../server/server');

const {
  ObjectID
} = require('mongodb');

const todos = [{
  _id: new ObjectID(),
  text: 'First Test',
  completed: false,
  completedAt: 0
}, {
  _id: new ObjectID(),
  text: 'Second Test',
  completed: true,
  completedAt: 1
}, {
  _id: new ObjectID(),
  text: 'Third Test',
  completed: false,
  completedAt: 0
}]

beforeEach((done) => {
  models.Todo.deleteMany({}).then(() => {
    return models.Todo.insertMany(todos);
  }).then(() => done());
});

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
          expect(todos[0].completedAt).toBe(todoModel.completedAt);
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
    console.log(hexId);
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
