const expect = require('expect');
const request = require('supertest');

const {
  app,
  models
} = require('../server/server');

const todos = [{
  text: 'First Test',
  completed: false,
  completedAt: 0
}, {
  text: 'Second Test',
  completed: true,
  completedAt: 1
}, {
  text: 'Third Test',
  completed: false,
  completedAt: 0
}]

beforeEach((done) => {
  models.Todo.deleteMany({}).then(() => {
    return models.Todo.insertMany(todos);
  }).then(() => done());
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
    // .end((err, res) => {
    //   if(err){
    //     return done(err);
    //   }
    //
    //   models.Todo.find().then((todos) => {
    //     expect(todos.length).toBe(3)
    //     done();
    //   }).catch((e) => done(e));
    // });
  });
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
        models.Todo.find({text: todoModel.text}).then((todos) => {
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
