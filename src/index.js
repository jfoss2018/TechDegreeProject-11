'use strict';

// Requirements
const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./_config.js');

// Database connection string is provided by the config file, which is "development"
// by default.
mongoose.connect(config.mongoURI[process.env.NODE_ENV], { useNewUrlParser: true });
// Declaration for the mongoose connection.
const db = mongoose.connection;

// If there is an error when connected to the mongoDB database, the error will
// be logged to the console.
db.on('error', function(err) {
  console.error('connection error:', err);
});

// When the database connection is successful, a success message will be logged
// to the console.
db.once('open', function() {
  console.log('db connnection successful.')
});

// Declaration of the express function.
const app = express();

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// Use bodyParser
app.use(bodyParser.json());

// Routes are handled by the routes.js file.
app.use('/api/v1', routes);

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports = server;
