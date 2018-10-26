'use strict'

const express = require('express');
const router = express.Router();
const Course = require('./models.js').Course;
const User = require('./models.js').User;
const Review = require('./models.js').Review;
const mid = require('./middleware.js');

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

router.get('/users', mid.collectLogin, (req, res, next) => {
  if (!req.user) {
    const err = new Error('Authentication Header Required.')
    err.status = 401;
    next(err);
  }
    res.status(200);
    res.json(req.user);
});

router.get('/courses', (req, res, next) => {
  Course.find({}, 'id title', {sort: {title: 1}}, function(err, courses) {
    if (err) return next(err);
    res.status(200);
    res.json(courses);
  });
});

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

router.get('/courses/:cID', (req, res, next) => {
  Course.findById(req.params.cID).populate('user', 'fullName')
    .populate('reviews')
    .exec(function(err, course) {
      res.status(200);
      res.json(course);
    });
});




// PUT ROUTE NEEDS VALIDATION
router.put('/courses/:cID', mid.collectLogin, (req, res, next) => {
  if (!req.user) {
    const err = new Error('Authentication Header Required.')
    err.status = 401;
    next(err);
  }
  req.course.update(req.body, function(err, result) {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.status(204);
    res.json();
  });
});

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

router.post('/courses/:cID/reviews', mid.collectLogin, (req, res, next) => {
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
