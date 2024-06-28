// routes/results.js
const express = require('express');
const router = express.Router();
const https = require('https');

router.get('/results', (req, res) => {
    res.render('results', {title: "RESTAURANTS NEAR YOU", restaurants: req.body.restaurants || []});
  });

router.post('/results', (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  const options = {
    method: 'GET',
    hostname: 'map-places.p.rapidapi.com',
    port: null,
    path: `/nearbysearch/json?location=${latitude},${longitude}&radius=1500&keyword=restaurant&type=restaurant`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'map-places.p.rapidapi.com'
    }
  };

  const request = https.request(options, function (response) {
    const chunks = [];

    response.on('data', function (chunk) {
      chunks.push(chunk);
    });

    response.on('end', function () {
      const body = Buffer.concat(chunks);
      const data = JSON.parse(body.toString());

      // Render the results.hbs page with the data
      res.render('results', { restaurants: data.results });
    });
  });

  request.on('error', (error) => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

module.exports = router;
