const { application } = require('express');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post(
  '/register',
  catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    //   res.send(registeredUser);
    res.redirect('/school');
  })
);

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    //     failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/school');
  }
);

module.exports = router;
