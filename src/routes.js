'use strict'

const express = require('express');
const router = express.Router();
const Course = require('../models.js').Course;
const User = require('../models.js').User;
const Review = require('../models.js').Review;

router.get('/users', (req, res, next) => {
  User.find({}, function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

router.get('/courses', (req, res, next) => {
  Course.find({}, null, {sort: {title: 1}}, function(err, courses) {
    if (err) return next(err);
    res.json(courses);
  });
});

router.post('/courses', (req, res, next) => {
  res.json({
    "course": "Create Course"
  });
});

router.get('/courses/:cID', (req, res, next) => {
  Course.findById(req.params.cID, function(err, course) {
    if (err) return next(err);
    res.json(course);
  });
});

router.put('/courses/:cID', (req, res, next) => {
  res.json({
    "course": "Update course",
    "id": req.params.cID
  });
});

router.post('/users', (req, res, next) => {
  res.json({
    "user": "Create user"
  });
});

router.post('/courses/:cID/reviews', (req, res, next) => {
  res.json({
    "review": "Create review"
  });
});

module.exports = router;
