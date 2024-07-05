const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user');
const Restaurant = require('../models/restaurant'); // Import the Restaurant model
const { ensureAuthenticated } = require('../middleware/auth.js');

router.get('/results', (req, res) => {
  res.render('results', { title: "RESTAURANTS NEAR YOU", restaurants: req.body.restaurants || [] });
});

router.post('/results', ensureAuthenticated, async (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const searchTerm = req.body.searchTerm;
  const userId = req.user._id;

  try {
    const response = await axios.post('http://localhost:3000/api/search', {
      latitude,
      longitude,
      searchTerm
    });
    const apiResults = response.data;

    // Get the logged in user's favourite restaurants
    const user = await User.findById(userId).populate('favourites');
    const favouriteAddresses = user.favourites.map(fav => fav.address);

    // Map over the API results to add isFavourited property
    const restaurants = apiResults.map(restaurant => ({
      ...restaurant,
      isFavourited: favouriteAddresses.includes(restaurant.vicinity)
    }));

    res.render('results', { title: "RESTAURANTS NEAR YOU", restaurants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
