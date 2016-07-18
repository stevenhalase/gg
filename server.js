///// Require elements
var express         = require('express');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var path            = require('path');
var mongoose        = require('mongoose');
var app             = express();
var apiRouter       = require('./api-routes')
var userRouter      = require('./user-routes')
var csgoMatch       = require('./csgo-match-model')
var request         = require('request');
var passport        = require('passport');
var expose          = require('express-expose');
var SteamStrategy = require('passport-steam').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('./user-model');
var config = require('./config');
///// Used to create user session
var session = require('express-session')
var newsScraper = require('./news-scraper')

app.sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
})
app.use(app.sessionMiddleware)
///// Connecting to MONGODB
mongoose.connect('mongodb://localhost/gg', function(error) {
  ///// If error connecting to MongoDB
  if (error) {
      console.error(error);
  ///// If successfully connected to MongoDB
  } else {
      console.log('Mongoose connected successfully')
  }
})
///// Initializing Passport and Passport Session
app.use(passport.initialize());
app.use(passport.session());
///// Morgan request logging
app.use(logger('dev'));
///// Body-Parser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

///// Serialize user with passport to connect to DB
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
///// Deserialize user with passport from DB
passport.deserializeUser(function(user, done) {
  User.find({'_id' : user._id}, function (err, user) {
    done(err, user);
  });
});
///// Steam strategy for Passport authentication
passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3000/auth/steam/return',
  realm: 'http://localhost:3000/',
  apiKey: config.sKey
  },
  function(identifier, profile, done) {
    ///// Setting user access level
    profile.accessLevel = 5;
    ///// Setting user profile image from Steam profile
    profile.imageUrl = profile._json.avatarfull;
    ///// Try to either find existing user from DB or create new user if none is found
    User.findOneAndUpdate({ openId: profile.id }, profile , {upsert: true, new: true} , function (err, user) {
      ///// Return user to continue authentication
      if (user.newUser === undefined) {
        user.newUser = true;
      }
      return done(err, user);
    });
  }
));
///// Redirection to Steam login
app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res) {
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
  });
///// Callback function fired after successful Steam login
app.get('/auth/steam/return',
  ///// Use Steam passport strategy to authenticate user in DB after Steam login
  passport.authenticate('steam', { failureRedirect: '/shittycock' }),
  function(req, res) {
    ///// Login user after authentication
    req.logIn(req.user, function(err) { if (err) { return next(err); } });
    ///// Redirect user to dashboard
    if(req.user.newUser === true) {
      req.user.newUser = false;
      User.findOneAndUpdate({ _id : req.user._id }, req.user, {upsert: true, new: true} , function(err, user) {
        if(err) {console.log('ERROR: ', err)}
        ///// Send back updated user profile from DB
        res.redirect('/#/newProfile');
      })
    } else { res.redirect('/#/dashboard'); }
  });
/////// Google strategy for Passport authentication
passport.use(new GoogleStrategy({
    clientID: config.gClientID,
    clientSecret: config.gSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    ///// If user has cover photo in Google profile
    if(profile._json.cover !== undefined) {
      ///// Add cover photo to user profile when available
      profile.imageUrl = profile._json.cover.coverPhoto.url;
    }
    ///// Setting user access level
    profile.accessLevel = 5;
    ///// Try to either find existing user from DB or create new user if none is found
    User.findOneAndUpdate({ googleId: profile.id }, profile , {upsert: true, new: true} , function (err, user) {
      ///// Pass user to /auth/google/callback callback function
      if (user.newUser === undefined) {
        user.newUser = true;
      }
      return cb(err, user);
    });
  }
));
///// Redirect to Google login with scope request for the user profile
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));
///// Callback function after successful Google login
app.get('/auth/google/callback',
  ///// Use Google passport strategy to authenticate user in DB after Google login
  passport.authenticate('google', { failureRedirect: '/shittycock' }),
  function(req, res) {
    ///// Login user after authentication
    req.logIn(req.user, function(err) { if (err) { return next(err); } });
    ///// Redirect user to dashboard
    // console.log(req.user.newUser === undefined)
    if(req.user.newUser === true) {
      req.user.newUser = false;
      User.findOneAndUpdate({ _id : req.user._id }, req.user, {upsert: true, new: true} , function(err, user) {
        if(err) {console.log('ERROR: ', err)}
        ///// Send back updated user profile from DB
        res.redirect('/#/newProfile');
      })
    } else { res.redirect('/#/dashboard'); }
  });
///// API GET Route to pull User from DB
app.get('/api/me', function(req, res) {
  ///// Find User in DB
  User.findOne({'_id':req._passport.session.user}, function(err, user) {
    ///// Send user profile from DB
    res.send(user)
  })
})
///// API GET Route to pull User from DB
app.post('/api/users', function(req, res) {
  console.log('body: ', req.body.query)
  ///// Find User in DB
  User.find({ 'displayName': { $regex : new RegExp(req.body.query, "i") }}, function(err, user) {
    if(err) {console.log('Error finding user: ', err)}
    ///// Send user profile from DB
    console.log(user)
    res.send(user)
  })
})
///// API POST Rout to update User in DB
app.post('/api/me', function(req, res) {
  ///// Find user profile in DB and update with sent information
  User.findOneAndUpdate({ _id : req.body._id }, req.body, {upsert: true, new: true} , function(err, user) {
    if(err) {console.log('ERROR: ', err)}
    ///// Send back updated user profile from DB
    res.send(user)
  })
})
///// News Scraper API Route
app.get('/api/news/:game', function(req, res) {
  console.log(req.params.game)
  newsScraper.scrape(req.params.game, passNews)
  function passNews(articles) {
    console.log(articles)
    res.send(articles)
  }
})
///// Route to logout user
app.get('/logout', function(req, res){
  ///// Logout user
  req.logout();
  ///// Redirect back to homepage
  res.redirect('/');
});
///// Initial route for Matches API
app.use('/api/v1', apiRouter);
///// Initial route for Users API
app.use('/users', userRouter);
///// Serving static files from ./www
app.use(express.static(path.join(__dirname, './www')))

///// Route handler for homepage
app.get('/', function (req, res) {
  ///// Send homepage
  res.sendFile('index.html', {root : './www'})
});
///// Set up server listening port
app.listen(3000, function () {
    console.log('Server started at http://localhost:3000')
})

//// Used to scrape data when needed
// scraper.scrape();
