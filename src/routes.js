'use strict'

const express = require('express');
const router = express.Router();
const Course = require('./models.js').Course;
const User = require('./models.js').User;
const Review = require('./models.js').Review;

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

router.get('/users', (req, res, next) => {
  User.find({}, function(err, users) {
    if (err) return next(err);
    res.status(200);
    res.json(users);
  });
});

router.get('/courses', (req, res, next) => {
  Course.find({}, 'id title', {sort: {title: 1}}, function(err, courses) {
    if (err) return next(err);
    res.status(200);
    res.json(courses);
  });
});

router.post('/courses', (req, res, next) => {
  const course = new Course(req.body);
  course.save(function(err, newCourse) {
    if (err) return next(err);
    res.location('/');
    res.status(201);
    res.json();
  });
});

router.get('/courses/:cID', (req, res, next) => {
  Course.findById(req.params.cID).populate('user')
    .populate('reviews')
    .exec(function(err, course) {
      console.log(course);
      res.status(200);
      res.json(course);
    });
});

router.put('/courses/:cID', (req, res, next) => {
  req.course.update(req.body, function(err, result) {
    if (err) return next(err);
    res.status(204);
    res.json();
  });
});

router.post('/users', (req, res, next) => {
  const user = new User(req.body);
  user.save(function(err, newUser) {
    if (err) return next(err);
    res.location('/');
    res.status(201);
    res.json();
  });
});

router.post('/courses/:cID/reviews', (req, res, next) => {
  const review = new Review(req.body);
  review.save(function(err, newReview) {
    if (err) return next(err);
    req.course.reviews.push(newReview.id);
    req.course.save(function(err, course) {
      if (err) return next(err);
      res.location(`/courses/${req.params.cID}`)
      res.status(201);
      res.json();
    });
  });
});

module.exports = router;
