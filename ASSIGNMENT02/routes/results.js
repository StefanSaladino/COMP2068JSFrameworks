const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user');
const { ensureAuthenticated } = require('../utilities/auth.js');

// GET results page
router.get('/results', (req, res) => {
  res.render('results', { title: "RESTAURANTS NEAR YOU", restaurants: req.body.restaurants || [] });
});

// POST results
router.post('/results', ensureAuthenticated, async (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const searchTerm = req.body.searchTerm;
  const userId = req.user._id;

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Increment the apiCalls
    user.apiCalls += 1;
    await user.save();

    console.log('Request Parameters:', { latitude, longitude, searchTerm });

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

    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', response.headers);
    console.log('Full API Response:', response.data);

    const apiResults = response.data;
    console.log('API Results:', apiResults);

    // Ensure apiResults is an array
    if (!Array.isArray(apiResults)) {
      return res.status(500).json({ error: 'Invalid API response format', data: apiResults });
    }

    // Get the logged in user's favourite restaurants
    await user.populate('favourites');
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
