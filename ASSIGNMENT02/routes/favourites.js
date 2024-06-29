const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant'); // Import the Restaurant model

// Route to handle saving a favourite restaurant
router.post('/', async (req, res) => {
  try {
    const { name, address, status } = req.body;
    const restaurant = new Restaurant({ name, address, status });
    await restaurant.save();
    res.json({ message: 'Favourite saved successfully' });
  } catch (error) {
    console.error('Error saving favourite:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to display all favourite restaurants
router.get('/', async (req, res) => {
    try {
      const favourites = await Restaurant.find();
      res.render('favourites/index', { favourites });
    } catch (error) {
      console.error('Error fetching favourites:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//get /favourites/delete/id - delete a proj
//: indicates a route parameter named _id is expected
router.get("/delete/:_id", async (req, res, next) => {
    let restaurantID = req.params._id;
    await Restaurant.deleteOne({_id: restaurantID});
    res.redirect("/favourites");
});  

module.exports = router;
