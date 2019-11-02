const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/signin', (req, res, next) => {
  passport.authenticate('azure-connect', {

    response: res,
    prompt: 'login',
    failureRedirect: '/error',
    failureFlash: true,
  })(req, res, next);
}, (req, res) => {
  req.flash('error_msg', { message: 'Access token', debug: req.user.accessToken });
  res.redirect('/');
});

router.post('/callback', (req, res, next) => {
  passport.authenticate('azure-connect', {
    response: res,
    failureRedirect: '/error',

  })(req, res, next);
}, (req, res) => {
  res.redirect('/');
});

router.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    req.logout();
    res.redirect('/');
  });
});

module.exports = router;
