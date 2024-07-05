//routes/favourites.js
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const { ensureAuthenticated } = require('../middleware/auth.js');

// Route to handle saving a favourite restaurant
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { name, address, status } = req.body;
    const userId = req.user._id;

    let restaurant = await Restaurant.findOne({ name, address });
    if (!restaurant) {
      restaurant = new Restaurant({ name, address, status });
      await restaurant.save();
    }

    await User.findByIdAndUpdate(userId, { $addToSet: { favourites: restaurant._id } });

    res.json({ message: 'Favourite saved successfully', success: true, name });
  } catch (error) {
    console.error('Error saving favourite:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to display all favourite restaurants for the logged-in user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('favourites');
    const favourites = user.favourites;
    res.render('favourites/index', { favourites });
  } catch (error) {
    console.error('Error fetching favourites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a favourite restaurant
router.get('/delete/:_id', ensureAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const restaurantID = req.params._id;

    await User.findByIdAndUpdate(userId, { $pull: { favourites: restaurantID } });

    res.redirect('/favourites');
  } catch (error) {
    console.error('Error deleting favourite:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
