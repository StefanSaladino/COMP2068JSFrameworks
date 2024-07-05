var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api'); // Import the API routes
var resultsRouter = require('./routes/results'); // Import the results routes
var favouritesRouter = require('./routes/favourites'); // Import the favourites routes

// db connectivity
var mongoose = require('mongoose');
var globals = require("./configs/globals"); // global vars
// import passport modules
var passport = require("passport");
var session = require("express-session");
var User = require("./models/user");

// Load environment variables
dotenv.config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure session object
// initialize passport

app.use(session({
  secret: "placeFinder", // value used to sign session id cookie
  resave: false, // save session even if not modified
  saveUninitialized: false // save session even if not used
}));

app.use(passport.initialize());
app.use(passport.session());

// initialize passport strategy
passport.use(User.createStrategy());
// configure passport to serialize and deserialize user data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user; // Assuming you use Passport and `req.user` is available
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter); // Use the API routes
app.use('/', resultsRouter); // Use the results routes
app.use('/favourites', favouritesRouter); // Use the favourites routes

// connect to mongodb
mongoose
.connect(globals.ConnectionString.MongoDB)
.then(() => {
  console.log("Successful connection to MongoDB");
})
.catch((err) => {
  console.log(err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(`404 Not Found: ${req.originalUrl}`); // Log the URL that caused the error
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
