/* eslint-disable no-undef */
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { User } = require("../model/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.email });

        if (existingUser) {
          console.log("existingUser", existingUser);
          done(null, existingUser);
        } else {
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: profile.role,
          });
          console.log("newUser", newUser);
          done(null, newUser);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

