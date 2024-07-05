var express = require('express');
var router = express.Router();
var passport = require('passport');
const User = require("../models/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Restaurant finder' });
});

//Get handler for login
router.get('/login', (req, res, next) => {
  //retrieve messages from session object
  let messages = req.session.messages || []; //empty array if no messages
  //clear messages from session obj
  req.session.messages = [];
  //pass messages to view
  res.render('login', { title: 'Login to your account', messages: messages });
});

//post login > user clicks button
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureMessage: "Invalid username/password",
}));

//get register
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Create a new account' });
});

//post register
router.post("/register", (req, res, next) => {
  //create new user then redirect to projects
  User.register(
    //new user obj
    new User ({ username: req.body.username }),
    req.body.password, //password as string to be encrypted
    (err, newUser) => { //callback function for errors or redirection
      if (err) {
        console.log(err);
        return res.redirect("/register");
      }
      else {
        req.login(newUser, (err) => { //login after reg to init session
          res.redirect("/");
        });
      }
    }
  );
});


router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    res.redirect("/");
  });
});



module.exports = router;
