const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user');
const Restaurant = require('../models/restaurant'); // Import the Restaurant model
const { ensureAuthenticated } = require('../utilities/auth.js');

router.get('/results', (req, res) => {
  res.render('results', { title: "RESTAURANTS NEAR YOU", restaurants: req.body.restaurants || [] });
});

router.post('/results', ensureAuthenticated, async (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const searchTerm = req.body.searchTerm;
  const userId = req.user._id;

  try {
    let response;
    try {
      // First try with the primary URL
      response = await axios.post('https://placefinder.onrender.com/api/search', {
        latitude,
        longitude,
        searchTerm
      });
    } catch (primaryError) {
      console.error('Primary URL failed:', primaryError.message);
  
      // Fallback to secondary URL
      response = await axios.post('http://localhost:3000/api/search', {
        latitude,
        longitude,
        searchTerm
      });
    }
  
    const apiResults = response.data;
  
    // Get the logged in user's favourite restaurants
    const user = await User.findById(userId).populate('favourites');
    const favouriteAddresses = user.favourites.map(fav => fav.address);
  
    // Map over the API results to add isFavourited property
    const restaurants = apiResults.map(restaurant => ({
      ...restaurant,
      isFavourited: favouriteAddresses.includes(restaurant.vicinity)
    }));
  
    res.render('results', { title: "RESTAURANTS NEAR YOU", restaurants, isAdmin: req.user && req.user.role === 'admin' });
  } catch (error) {
    console.error('Error fetching restaurant data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
