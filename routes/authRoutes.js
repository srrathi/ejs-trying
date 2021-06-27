const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");

//TO GET THE SIGNUP FORM
router.get("/register", (req, res) => {
  res.render("auth/signup", { message: req.flash("error") });
});

//REGISTERING THE USER
router.post("/register", async (req, res) => {
  try {
    const user = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
    };

    const newUser = await User.register(user, req.body.password);
    console.log(newUser);
    res.status(200).send(newUser);
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.render("home");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
