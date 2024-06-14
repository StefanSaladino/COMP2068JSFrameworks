var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: `Stefan Saladino's portfolio` });
});

router.get("/about", function(req, res, next){
  res.render("about", {title: "About me"})
});

router.get("/projects", function(req, res, next){
  res.render("projects", {title: "Projects"})
});

router.get("/contact", function(req, res, next){
  res.render("contact", {title: "Contact Me"})
});

module.exports = router;
