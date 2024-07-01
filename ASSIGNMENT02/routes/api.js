// routes/api.js
const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/search', (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const searchTerm = req.body.searchTerm;

  const options = {
    method: 'GET',
    hostname: 'map-places.p.rapidapi.com',
    port: null,
    path: `/nearbysearch/json?location=${latitude},${longitude}&radius=1500&keyword=${searchTerm}&type=${searchTerm}`,
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
      res.json(data.results); // Send the results as JSON
    });
  });

  request.on('error', (error) => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

module.exports = router;
