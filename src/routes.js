'use strict'

// Requirements
const express = require('express');
const router = express.Router();
const Course = require('./models.js').Course;
const User = require('./models.js').User;
const Review = require('./models.js').Review;
const mid = require('./middleware.js');

// For each request that includes the "cID" param, this function finds the
// corresponding document for the course and saves it to the request object
// under req.course.
router.param('cID', function(req, res, next, id) {
  Course.findById(id, function(err, doc) {
    if (err) return next(err);
    if (!doc) {
      err = new Error('Not Found');
      err.status = 404;
      next(err);
    }
    req.course = doc;
    next();
  });
});

// This GET route returns the corresponding user whose email and password
// are passed into the Authorization Header with Basic Auth. If there is no
// valid Authorization Header, a 401 error is returned.
router.get('/users', mid.collectLogin, (req, res, next) => {
  if (!req.user) {
    const err = new Error('Authentication Header Required.')
    err.status = 401;
    next(err);
  }
    res.status(200);
    res.json(req.user);
});

// This GET route returns the "id" and "title" for all courses.
router.get('/courses', (req, res, next) => {
  Course.find({}, 'id title', {sort: {title: 1}}, function(err, courses) {
    if (err) return next(err);
    res.status(200);
    res.json(courses);
  });
});

// This POST route creates a new course given valid credentials are passed in
// the Authorization Header. Also, it will save the authenticated user's id as
// the user field on the course document.
router.post('/courses', mid.collectLogin, (req, res, next) => {
  if (!req.user) {
    const err = new Error('Authentication Header Required.')
    err.status = 401;
    next(err);
  }
  const course = new Course(req.body);
  course.user = req.user._id;
  course.reviews = [];
  course.save(function(err, newCourse) {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.location('/');
    res.status(201);
    res.json();
  });
});

// This GET route will return all information for the course whose "id" matches
// the "cID" param. Here, mongoose population is used to return document information
// regarding the associated user and reviews to the course. Only the "id" and
// "fullName" are returned for the user.
router.get('/courses/:cID', (req, res, next) => {
  Course.findById(req.params.cID).populate('user', 'fullName')
    .populate('reviews')
    .exec(function(err, course) {
      res.status(200);
      res.json(course);
    });
});

// This PUT route updates courses given valid credentials in the Authorization
// Header.
router.put('/courses/:cID', mid.collectLogin, (req, res, next) => {
  if (!req.user) {
    const err = new Error('Authentication Header Required.')
    err.status = 401;
    next(err);
  }
  req.course.update(req.body, {runValidators: true}, function(err, result) {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.status(204);
    res.json();
  });
});

// This POST route creates new users.
router.post('/users', (req, res, next) => {
  const user = new User(req.body);
  user.save(function(err, newUser) {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.location('/');
    res.status(201);
    res.json();
  });
});

// This POST route allows users to submit a review for the course corresponding
// the the "cID" param. If the given authenticated user is the user associated
// with creating the course, a 400 error is returned. 
router.post('/courses/:cID/reviews', mid.collectLogin, (req, res, next) => {
  if (toString(req.course.user) === toString(req.user._id)) {
    const err = new Error('Cannot review user\'s own course');
    err.status = 400;
    return next(err);
  }
  const review = new Review(req.body);
  review.user = req.user._id;
  review.save(function(err, newReview) {
    if (err) {
      err.status = 400;
      return next(err);
    }
    req.course.reviews.push(newReview.id);
    req.course.save(function(err, course) {
      if (err) {
        err.status = 400;
        return next(err);
      }
      res.location(`/api/v1/courses/${req.params.cID}`)
      res.status(201);
      res.json();
    });
  });
});

module.exports = router;
