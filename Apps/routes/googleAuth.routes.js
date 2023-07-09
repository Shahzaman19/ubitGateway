//GOOGLE OAUTH
const express = require("express");
const router = express.Router();
require("../middleware/googleOauth");
const passport = require("passport");
const {User} = require('../model/user')

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/protected",
    failureRedirect: "/api/auth/failure",
  })
);

router.get("/failure", (req, res) => {
  res.json("something went wrong..");
});

router.get("/protected", [isLoggedIn], async (req, res) => {
  const user = await User.find()
  res.json(user)
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.json("Goodbye");
    });
  });
});

module.exports = router;
