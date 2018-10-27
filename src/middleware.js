// Requirements
const auth = require('basic-auth');
const User = require('./models.js').User;

// This function is custom middleware, so it is separated from the routes file.
// It is used in conjunction with the authenticate static method written on the
// User Schema to read the user credentials passed in the Authorization Header
// and compare them to user documents in the database. If one matches, it gets
// saved to the request object under req.user.
function collectLogin (req, res, next) {
  const user = auth(req);
  if (user === undefined) {
    next();
  }
  User.authenticate(user.name, user.pass, function(err, searchUser) {
    if (err || !searchUser) {
      const err = new Error('Incorrect email or password');
      err.status = 401;
      next(err);
    }
    req.user = searchUser;
    next();
  });
}

module.exports.collectLogin = collectLogin;
