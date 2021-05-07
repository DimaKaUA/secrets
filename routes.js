//jshint esversion:6

const passport = require("passport");
const User = require("./models/user");
const router = require("express").Router();

router.get("/", function(req, res) {
  
  res.render("home", {currentUser: req.user});
});

router.get("/auth/google", 
  passport.authenticate("google", { scope: ["profile", "email"]}));

router.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/secrets");
  }
);

router.get("/auth/facebook", 
  passport.authenticate("facebook"));

router.get("/auth/facebook/secrets",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/secrets");
  }
);

router.get("/login", function(req, res) {
  
  res.render("login", {currentUser: req.user, message: req.flash("error")});
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), function(req, res) {

  res.redirect("/secrets");
});

router.get("/register", function(req, res) {
  
  res.render("register", {currentUser: req.user});
});

router.post("/register", function(req, res) {

  User.register({username: req.body.username}, req.body.password, function(err, user) {

    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {

        res.redirect("/secrets");
      });
    }
  });
});

router.get("/logout" , function(req, res) {

  req.logout();
  res.redirect("/");
});

router.get("/secrets", function(req, res) {

  if(req.isAuthenticated()){
    User.find({"secret": {$ne: null}}, function(err, foundUsers) {

      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          res.render("secrets", {currentUser: req.user, usersWithSecrets: foundUsers});
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/submit", function(req, res) {
  
  if (req.isAuthenticated()) {
    res.render("submit", {currentUser: req.user});
  } else {
    res.redirect("/login");
  }
});

router.post("/submit", function(req, res) {
  
  const newSecret = req.body.secret;

  User.findById(req.user.id, function(err, foundUser) {

    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = newSecret;
        foundUser.save(function() {
          res.redirect("/secrets");
        })
      }
    }
  });
});

module.exports = router;