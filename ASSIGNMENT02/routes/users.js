const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { ensureAuthenticated, ensureAdmin } = require('../utilities/auth.js');
const { encrypt, decrypt } = require('../utilities/crypto');

/* GET users listing. */
// Route to display all favourite restaurants for the logged-in user
router.get('/', ensureAdmin, async (req, res, next) => {
  try {
    let users = await User.find().sort([["username", "ascending"]]);
    res.render("users/index", {
      title: "All users",
      dataset: users.map(user => ({
        ...user.toObject(),
        encryptedId: encrypt(user._id.toString())
      })),
      user: req.user,
      isAdmin: req.user && req.user.role === 'admin'
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/details/:encryptedId', ensureAdmin, async (req, res, next) => {
  const encryptedId = req.params.encryptedId;
  const user = await User.findById(req.user._id);

  try {
    const renderedUserId = decrypt(encryptedId);
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
router.get('/delete/:encryptedId', ensureAdmin, async (req, res, next) => {
  try {
    const userId = decrypt(req.params.encryptedId); // Decrypt the user ID
    await User.deleteOne({ _id: userId });
    res.redirect("/users");
  } catch (error) {
    console.error('Error deleting favourite:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to demote a user (remove admin role)
router.get('/demote/:encryptedId', ensureAdmin, async (req, res, next) => {
  try {
    const userId = decrypt(req.params.encryptedId);
    await User.findByIdAndUpdate(userId, { role: 'user' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error demoting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to promote a user (make admin)
router.get('/promote/:encryptedId', ensureAdmin, async (req, res, next) => {
  try {
    const userId = decrypt(req.params.encryptedId);
    await User.findByIdAndUpdate(userId, { role: 'admin' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to ban a user
router.get('/ban/:encryptedId', ensureAdmin, async (req, res, next) => {
  try {
    const userId = decrypt(req.params.encryptedId);
    await User.findByIdAndUpdate(userId, { status: 'banned' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to suspend a user
router.get('/suspend/:encryptedId', ensureAdmin, async (req, res, next) => {
  try {
    const userId = decrypt(req.params.encryptedId);
    await User.findByIdAndUpdate(userId, { status: 'suspended' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to reinstate a user
router.get('/reinstate/:encryptedId', ensureAdmin, async (req, res, next) => {
  try {
    const userId = decrypt(req.params.encryptedId);
    await User.findByIdAndUpdate(userId, { status: 'good' });
    res.redirect('/users');
  } catch (error) {
    console.error('Error reinstating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
