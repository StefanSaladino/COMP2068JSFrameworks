const express = require('express');
const router = express.Router();

router.get('/banned', (req, res, next) => {
    res.render('banned', { title: "BANNED PAGE"});
  });
  
module.exports = router;