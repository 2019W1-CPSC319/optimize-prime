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
  req.session.destroy(() => {
    req.logout();
    res.redirect(`https://login.windows.net/common/oauth2/logout?post_logout_redirect_uri=${window.location.host}`);
  });
});

module.exports = router;
