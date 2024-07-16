var express = require("express");
var router = express.Router();
var passport = require("passport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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

// Route to render forgot password page
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { title: "Forgot Password" });
});

// Route to handle forgot password form submission
router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });

  console.log(user);

  if (!user) {
    return res.status(400).send('User with this email does not exist');
  }

  // Generate a random reset token
  const token = crypto.randomBytes(20).toString('hex');
  
  // Set reset token and its expiration on the user object
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Set up email data
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: username,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
Please click on the following link, or paste this into your browser to complete the process:
http://${req.headers.host}/reset-password/${token}
If you did not request this, please ignore this email and your password will remain unchanged.`,
  };

  // Send email with the reset token
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    }
    res.send('An e-mail has been sent to ' + username + ' with further instructions.');
  });
});

// Route to render reset password page
router.get('/reset-password/:token', async (req, res) => {
  // Find user with the matching reset token and check if the token has not expired
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send('Password reset token is invalid or has expired.');
  }

  res.render('reset-password', { token: req.params.token });
});

// Route to handle reset password form submission
router.post('/reset-password/:token', async (req, res) => {
  try {
    // Find user with the matching reset token and check if the token has not expired
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    // Check if the new password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send('Passwords do not match.');
    }

    // Update user's password and hash it
    await user.setPassword(req.body.password);
    
    // Invalidate the reset token and clear its expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Automatically log the user in after password reset
    req.login(user, (err) => {
      if (err) {
        return res.status(500).send('Error logging in after password reset');
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('An error occurred while resetting the password.');
  }
});

module.exports = router;
