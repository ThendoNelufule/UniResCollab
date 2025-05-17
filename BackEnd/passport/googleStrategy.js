// TODO
// I need to fix the issue of puting a user to the database even if their username and role is null...


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const OAuthUser = require('../Models/userModel');
require('dotenv').config({ path: path.join(__dirname, '..','..', '.env') });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://unirescollab-a0bgfbhzcfg6angs.southafricanorth-01.azurewebsites.net/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const newUser = {
      provider: 'google',
      providerId: profile.id,
    };
  
    try {
      let user = await OAuthUser.findOne({ provider: 'google', providerId: profile.id });

      if (!user) {
        user = await OAuthUser.create(newUser);
      }
      else{
        return done(null, user);
      }
      return done(null, user);

    } catch (err) {
      console.error(err);
      return done(err, null);
    }
  }
));