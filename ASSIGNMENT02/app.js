var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
const hbs = require('hbs');
const flash = require('connect-flash');
const cors = require('cors');
const bodyParser = require('body-parser');
const { format } = require('date-fns');
const { config } = require('dotenv');
var globals = require("./configs/globals");
var githubStrategy =  require('passport-github2').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api'); // Import the API routes
var resultsRouter = require('./routes/results'); // Import the results routes
var favouritesRouter = require('./routes/favourites'); // Import the favourites routes
var restrictedRouter = require('./routes/restricted');
var bannedRouter = require('./routes/banned');
var suspendedRouter = require('./routes/suspended');
var contactRouter = require('./routes/contact');

// Enabling cross origin resource sharing so the API can be called at the host origin
const corsOptions = {
  origin: ['https://placefinder.onrender.com/', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// DB connectivity
var mongoose = require('mongoose');
var globals = require("./configs/globals"); // Global vars
// Import passport modules
var passport = require("passport");
var session = require("express-session");
var User = require("./models/user");

// Load environment variables
dotenv.config();

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

// Configure session object
// Initialize passport
app.use(session({
  secret: "placeFinder", // Value used to sign session ID cookie
  resave: false, // Save session even if not modified
  saveUninitialized: false // Save session even if not used
}));

app.use(passport.initialize());
app.use(passport.session());
// Set up connect-flash
app.use(flash());

// Middleware to pass flash messages to views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Initialize passport strategy
passport.use(User.createStrategy());
// Configure passport to serialize and deserialize user data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//github oauth strategy
passport.use(new githubStrategy({
  clientID: globals.github.clientID,
  clientSecret: globals.github.clientSecret,
  callbackURL: globals.github.callbackUrl
},
  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ oauthId: profile.id });
    if(user) {
      return done(null, user);
    }
    else{
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: "Github",
        lastSignIn: "",
        isVerified: true,
        favourites: [],
      });
      const savedUser = await newUser.save();
      return done(null, savedUser);
    }
  }
))

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter); // Use the API routes
app.use('/', resultsRouter); // Use the results routes
app.use('/favourites', favouritesRouter); // Use the favourites routes
app.use('/', restrictedRouter);
app.use('/', bannedRouter);
app.use('/', suspendedRouter);
app.use('/contact', contactRouter);

// Connect to MongoDB
mongoose
.connect(globals.ConnectionString.MongoDB)
.then(() => {
  console.log("Successful connection to MongoDB");
})
.catch((err) => {
  console.log(err);
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(`404 Not Found: ${req.originalUrl}`); // Log the URL that caused the error
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Custom helper for comparison
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  // Debugging
  console.log(`Comparing ${arg1} and ${arg2}`);
  // Compare the two arguments
  if (arg1 == arg2) {
    // If true, render the block inside {{#ifEquals ...}}{{/ifEquals}}
    return options.fn(this);
  } else {
    // If false, render the block inside {{else}}{{/ifEquals}}
    return options.inverse(this);
  }
});

// Custom helper for date formatting in EST
hbs.registerHelper('formatDateEST', function(date) {
  let estDate = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }));
  let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return estDate.toLocaleString("en-US", options);
});

module.exports = app;
