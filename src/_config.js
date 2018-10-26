const config = {};

config.mongoURI = {
  development: 'mongodb://localhost:27017/course-api',
  test: 'mongodb://localhost:27017/test-api'
};

module.exports = config;
