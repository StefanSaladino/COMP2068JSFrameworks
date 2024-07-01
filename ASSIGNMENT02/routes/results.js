const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/results', (req, res) => {
  res.render('results', { title: "RESTAURANTS NEAR YOU", restaurants: req.body.restaurants || [] });
});

router.post('/results', async (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const searchTerm = req.body.searchTerm;

  try {
    const response = await axios.post('http://localhost:3000/api/search', {
      latitude,
      longitude,
      searchTerm
    });
    const restaurants = response.data;

    // Render the results.hbs page with the data
    res.render('results', { title: "RESTAURANTS NEAR YOU", restaurants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
