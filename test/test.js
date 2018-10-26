process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index.js');
const should = chai.should();
const User = require('../src/models.js').User;

chai.use(chaiHttp);

describe('users', function() {

  User.collection.drop();

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

  afterEach(function(done){
    User.collection.drop();
    done();
  });

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

  it('should return a 401 error given no credentials on /users GET', function(done) {
    chai.request(server)
      .get('/api/v1/users')
      .end(function(err, res) {
        res.should.have.status(401);
        done();
      });
  });
});
