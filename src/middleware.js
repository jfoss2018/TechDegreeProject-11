const auth = require('basic-auth');
const User = require('./models.js').User;

function collectLogin (req, res, next) {
  const user = auth(req);
  if (user === undefined) {
    // Do something here. Return nothing?
  }
  User.authenticate(user.name, user.pass, function(err, searchUser) {
    if (err || !searchUser) {
      const err = new Error('Incorrect email or password');
      err.status = 401;
      next(err);
    }
    req.user = searchUser;
    console.log(searchUser);
    next();
  });
}

module.exports.collectLogin = collectLogin;
