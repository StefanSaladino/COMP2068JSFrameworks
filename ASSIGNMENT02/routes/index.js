var express = require("express");
var router = express.Router();
var passport = require("passport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { ensureAuthenticated, isBanned, ensureAdmin } = require('../utilities/auth.js');
const { sendVerificationEmail } = require('../utilities/tokensender');

// GET home page
router.get("/", isBanned, function (req, res, next) {
  res.render("index", { title: "Restaurant finder", isAdmin: req.user && req.user.role === "admin" });
});

// GET login
router.get("/login", (req, res, next) => {
  let messages = req.session.messages || []; 
  req.session.messages = [];
  res.render("login", {
    title: "Login to your account",
    messages: messages,
  });
});

// POST login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: "Invalid username/password",
  }),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      user.lastSignIn = new Date();
      await user.save();
      res.redirect("/");
    } catch (err) {
      console.error("Error updating last sign-in:", err);
      res.redirect("/login");
    }
  }
);


// GET register
router.get("/register", (req, res, next) => {
  res.render("register", { title: "Create a new account" });
});

// POST register
router.post("/register", (req, res, next) => {
  const { username, password } = req.body;

  const newUser = new User({ username, isVerified: false });

  User.register(newUser, password, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/register");
    }

    sendVerificationEmail(username, user._id);

    res.send("Registration successful! Please check your email to verify your account.");
  });
});


// GET verify email
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  
try {
  // Verify the JWT token
  const decoded = jwt.verify(token, 'ourSecretKey');
  console.log('Decoded token:', decoded);

  // Find the user by the ID encoded in the token
  const user = await User.findById(decoded.id);
  console.log('User found in database:', user);

  // Check if the user was found
  // This was added for debugging purposes, as email verification took some time to implement
  if (!user) {
    return res.status(404).send("User not found");
  }

  // Update the user's verification status
  user.isVerified = true;
  await user.save();
  
  // Redirect to the homepage after successful verification
  res.redirect("/");
} catch (err) {
  console.error('Error verifying token:', err);
  // Handle verification failure due to invalid or expired token
  res.status(400).send("Email verification failed, link is invalid or expired");
}
});

// GET logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    res.redirect("/");
  });
});

module.exports = router;
