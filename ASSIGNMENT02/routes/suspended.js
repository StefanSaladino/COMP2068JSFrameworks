const express = require('express');
const router = express.Router();

router.get('/suspended', (req, res, next) => {
    res.render('suspended', { title: "SUSPENDED PAGE"});
  });
  
module.exports = router;