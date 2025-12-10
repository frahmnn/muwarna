const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Use an absolute callback URL from env when provided. This must match
      // the "Authorized redirect URIs" in your Google Cloud OAuth client.
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || `http://localhost:${process.env.PORT || 5000}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth callback received');
        console.log('Profile ID:', profile.id);
        console.log('Email:', profile.emails?.[0]?.value);
        
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log('Existing user found:', user._id);
          return done(null, user);
        }

        // Create new user
        console.log('Creating new user...');
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0]?.value
        });

        console.log('New user created:', user._id);
        done(null, user);
      } catch (error) {
        console.error('Passport strategy error:', error);
        done(error, null);
      }
    }
  )
);

module.exports = passport;
