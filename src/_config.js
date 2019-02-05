const databaseKey = require('./.config.js');

// I use this config file to set up the environment for the MongoDB connection.
const config = {};

config.mongoURI = {
  development: 'mongodb://localhost:27017/course-api',
  test: 'mongodb://localhost:27017/test-api',
  production: `mongodb://${databaseKey.user}:${databaseKey.password}@ds221155.mlab.com:21155/heroku_834d4kpp`
};

module.exports = config;
