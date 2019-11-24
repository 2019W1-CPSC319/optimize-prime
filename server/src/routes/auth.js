const express = require('express');
const passport = require('passport');
const connection = require('../init/setupMySql');

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
}, async (req, res) => {
  const query = 'SELECT email FROM adminusers WHERE email = ?';
  const sqlcmd = connection.format(query, [req.user.username]);
  connection.query(sqlcmd, async (err, result) => {
    if (result.length > 0) {
      return res.redirect('/');
    }
    await req.session.destroy(async (err) => {
      await req.logout();
      return res.redirect('/unauthorized');
    });
  });
});

router.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    req.logout();
    res.redirect('/');
  });
});

module.exports = router;
