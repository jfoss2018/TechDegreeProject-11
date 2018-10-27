'use strict'

// Requirements
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

// This is suggested when using mongoose-unique-validator.
mongoose.set('useCreateIndex', true);

// Declaration
const ObjectId = Schema.Types.ObjectId;

// This user schema sets up the structure for the user data that we pass into
// mongoDB.
const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true,
    validate: {
      validator: function(string) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(string);
      },
      message: props => `${props.value} is not a valid email address!`
    },
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Requirement to make the "unique" key a validator.
UserSchema.plugin(uniqueValidator);

// This hook allows us to collect and hash the "password" just before saving
// a user document. This ensures that no passwords can viewed in the database.
UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// This static method authenticates a user by finding the corresponding document
// to the email supplied (emails must be unique), then hashes the supplied
// password and compares that to the document's password property. If it matches,
// the user document is returned.
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({emailAddress: email})
      .exec(function(err, user) {
        if (err) {
          return callback(err);
        } else if (!user) {
          const err = new Error('User not found');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function(err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        });
    });
};

// This review schema sets up the structure for the review data that we pass into
// mongoDB.
const ReviewSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'user'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: String
});

// This course schema sets up the structure for the course data that we pass into
// mongoDB.
const CourseSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  estimatedTime: String,
  materialsNeeded: String,
  steps: [{
    stepNumber: Number,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  reviews: [{
    type: ObjectId,
    ref: 'review'
  }]
});

// Here the models for each schema are created.
const User = mongoose.model('user', UserSchema);
const Course = mongoose.model('course', CourseSchema);
const Review = mongoose.model('review', ReviewSchema);

// And then the models are exported.
module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;
