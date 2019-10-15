const express = require('express');
const passport = require('passport');

const router = express.Router();

const authenticate = (req, res, next) => {
  passport.authenticate('azuread-openidconnect', {

    response: res,
    prompt: 'login',
    failureRedirect: '/',
    failureFlash: true,
  })(req, res, next);
};

router.get('/signin', (req, res, next) => {
  passport.authenticate('azuread-openidconnect', {

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
  passport.authenticate('azuread-openidconnect', {
    response: res,
    failureRedirect: '/error',
    failureFlash: true,
  })(req, res, next);
}, (req, res) => {
  res.redirect('/');
});

router.get('/signout', (req, res) => {
  req.session.destroy(() => {
    req.logout();
    res.redirect('/');
  });
});

module.exports = router;
