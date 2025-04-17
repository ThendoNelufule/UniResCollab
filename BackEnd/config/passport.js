const passport = require('passport');

// These just execute and register the strategies:
require('../passport/googleStrategy');
require('../passport/githubStrategy');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
