require('dotenv').config();
const expressSession = require('express-session');
const passport = require('passport');
const { OIDCStrategy } = require('passport-azure-ad');
const bodyParser = require('body-parser');
const graph = require('../utils/graph');

module.exports = (app) => {
  const users = {};
  app.use(expressSession({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  }));

  app.use(bodyParser.urlencoded({ extended: true }));

  passport.serializeUser((user, done) => {
    // Use the OID property of the user as a key
    users[user.id] = user;
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(null, users[id]);
  });

  const signInComplete = async (iss, suv, profile, jwtClaims, accessToken, refreshToken, params, done) => {
    if (!profile.oid) {
      return done(new Error('No OID found in user profile.'), null);
    }
    // Save the profile and tokens in user storage
    users[profile.oid] = {
      displayName: profile.displayName,
      name: jwtClaims.name,
      id: jwtClaims.oid,
      accessToken,
      refreshToken,
      username: jwtClaims.preferred_username,
    };
    return done(null, users[profile.oid]);
  };

  // Configure OIDC strategy
  passport.use('azure-connect', new OIDCStrategy(
    {
      identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
      clientID: process.env.OAUTH_APP_ID,
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: process.env.OAUTH_REDIRECT_URI,
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.OAUTH_APP_PASSWORD,
      validateIssuer: false,
      passReqToCallback: false,
      scope: process.env.OAUTH_SCOPES.split(' '),
    },
    signInComplete,
  ));

  app.use(passport.initialize());
  app.use(passport.session());
};
