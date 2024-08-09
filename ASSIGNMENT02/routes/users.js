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

// Route to handle admin actions
router.post('/action/:encryptedId', ensureAdmin, async (req, res) => {
  try {
    const userId = decrypt(req.params.encryptedId);
    const action = req.body.action; // 'promote', 'demote', 'ban', 'suspend', 'reinstate'

    switch (action) {
      case 'promote':
        await User.findByIdAndUpdate(userId, { role: 'admin' });
        res.json({ message: 'User promoted to admin' });
        break;
      case 'demote':
        await User.findByIdAndUpdate(userId, { role: 'user' });
        res.json({ message: 'Admin demoted to user' });
        break;
      case 'ban':
        await User.findByIdAndUpdate(userId, { status: 'banned' });
        res.json({ message: 'User banned' });
        break;
      case 'suspend':
        await User.findByIdAndUpdate(userId, { status: 'suspended' });
        res.json({ message: 'User suspended' });
        break;
      case 'reinstate':
        await User.findByIdAndUpdate(userId, { status: 'good' });
        res.json({ message: 'User reinstated' });
        break;
      default:
        res.status(400).json({ message: 'Invalid action' });
    }
  } catch (err) {
    console.error('Error performing admin action:', err);
    res.status(500).json({ message: 'Error performing admin action' });
  }
});

module.exports = router;
