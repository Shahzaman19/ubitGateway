/* eslint-disable no-undef */
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const { User } = require("../model/user");

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/linkedin/callback",
      passReqToCallback: true,
      scope: ["r_emailaddress", "r_liteprofile"],
    },

    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          console.log("existingUser", existingUser);
          done(null, existingUser);
        } else {
          const newUser = await User.create({
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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
