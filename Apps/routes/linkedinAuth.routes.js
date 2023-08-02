const express = require("express");
const router = express.Router();
require("../middleware/linkedinOauth");
const passport = require("passport");
const { User } = require("../model/user");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get("/linkedin", passport.authenticate("linkedin"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/api/auth/dashboard",
    failureRedirect: "/api/auth/failure",
  })
);

router.get("/failure", (req, res) => {
  return res.json({ error: "Something went wrong" });
});

router.get("/dashboard", [isLoggedIn], async (req, res,next) => {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (error) {
    return next(error);
  }
});

router.get("/logout", (req, res,next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      return res.json("Goodbye");
    });
  });
});

module.exports = router;
