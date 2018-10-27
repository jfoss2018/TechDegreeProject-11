// Test file sets the environment to "test."
process.env.NODE_ENV = 'test';

// Requirements.
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index.js');
const should = chai.should();
const User = require('../src/models.js').User;

chai.use(chaiHttp);

// Test function for users.
describe('users', function() {
  // Makes sure that there is no User data in the collection in the test database.
  User.collection.drop();
  // Before each test below, a user will be persisted to the test database.
  beforeEach(function(done){
    const newUser = new User({
      fullName: 'Test Name',
      emailAddress: 'test@test.com',
      password: 'password'
    });
    newUser.save(function(err) {
      done();
    });
  });
  // After each test below, the user will be deleted from the test database.
  afterEach(function(done){
    User.collection.drop();
    done();
  });
  // First unit test tests that the proper user was returned when sending a GET
  // request to /api/v1/users with proper credentials in the Authorization
  // Header with an http status code of 200.
  it('should return the correct User given credentials on /users GET', function(done) {
    chai.request(server)
      .get('/api/v1/users')
      .set('Authorization', 'Basic dGVzdEB0ZXN0LmNvbTpwYXNzd29yZA==')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('fullName');
        res.body.should.have.property('emailAddress');
        res.body.should.have.property('password');
        res.body.fullName.should.equal('Test Name');
        res.body.emailAddress.should.equal('test@test.com');
        done();
      });
  });
  // Second unit test tests that the http status code returned from a GET request
  // to /api/v1/users with no credentials is 401.
  it('should return a 401 error given no credentials on /users GET', function(done) {
    chai.request(server)
      .get('/api/v1/users')
      .end(function(err, res) {
        res.should.have.status(401);
        done();
      });
  });
});
