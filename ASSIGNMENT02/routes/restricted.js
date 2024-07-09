const express = require('express');
const router = express.Router();

router.get('/restricted', (req, res, next) => {
    res.render('restricted', { title: "RESTRICTED PAGE"});
  });
  
module.exports = router;