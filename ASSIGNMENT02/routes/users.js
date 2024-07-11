//routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { ensureAuthenticated, ensureAdmin } = require('../utilities/auth.js');

/* GET users listing. */
// Route to display all favourite restaurants for the logged-in user
router.get('/', ensureAdmin, async (req, res, next) => {
  try {
    let users = await User.find().sort([["username", "ascending"]]);
    res.render("users/index", {
      title: "All users",
      dataset: users,
      user: req.user,
      isAdmin: req.user && req.user.role === 'admin'
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/details/:id', ensureAdmin, async (req, res, next) => {
  const renderedUserId = req.params.id;
  const user = await User.findById(req.user._id);

  try {
    let renderedUser = await User.findById(renderedUserId).populate('favourites').exec();
    if (!renderedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.render("users/details", {
      title: `${renderedUser.username}'s Account Details`,
      renderedUser: renderedUser,
      lastSignIn: renderedUser.lastSignIn,
      apiCalls: renderedUser.apiCalls,
      favourites: renderedUser.favourites.length,
      role: renderedUser.role,
      status: renderedUser.status,
      verifiedAccount: renderedUser.isVerified,
      user: user,
      isAdmin: req.user && req.user.role === 'admin',
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a user
router.get('/delete/:_id', ensureAdmin, async (req, res, next) => {
  try {
    const userId = req.params._id; // Get the user ID from the URL parameter
    await User.deleteOne({ _id: userId });
    res.redirect("/users");
  } catch (error) {
    console.error('Error deleting favourite:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to demote a user (remove admin role)
router.get('/demote/:_id', ensureAdmin, async (req, res, next) => {
  try {
    const userId = req.params._id;
    await User.findByIdAndUpdate(userId, { role: 'user' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error demoting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to promote a user (make admin)
router.get('/promote/:_id', ensureAdmin, async (req, res, next) => {
  try {
    const userId = req.params._id;
    await User.findByIdAndUpdate(userId, { role: 'admin' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to ban a user
router.get('/ban/:_id', ensureAdmin, async (req, res, next) => {
  try {
    const userId = req.params._id;
    await User.findByIdAndUpdate(userId, { status: 'banned' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to suspend a user
router.get('/suspend/:_id', ensureAdmin, async (req, res, next) => {
  try {
    const userId = req.params._id;
    await User.findByIdAndUpdate(userId, { status: 'suspended' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to reinstate a user
router.get('/reinstate/:_id', ensureAdmin, async (req, res, next) => {
  try {
    const userId = req.params._id;
    await User.findByIdAndUpdate(userId, { status: 'good' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
