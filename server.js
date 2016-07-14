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
// var scraper         = require('./scraper')
var passport        = require("passport");
var expose          = require('express-expose');
// var TwitchTokenStrategy = require('passport-twitch-token');
var SteamStrategy = require('passport-steam').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('./user-model');
var config = require('./config.js');

var session = require('express-session')
app.sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
})
app.use(app.sessionMiddleware)

mongoose.connect('mongodb://localhost/gg', function(error) {
    if (error) {
        console.error(error);
    } else {
        console.log('Mongoose connected successfully')
    }
})

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(user, done) {
  User.find({'_id' : user._id}, function (err, user) {
    done(err, user);
  });
});

///// STEAM / PASSPORT Middleware
passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3000/auth/steam/return',
  realm: 'http://localhost:3000/',
  apiKey: config.sKey
  },
  function(identifier, profile, done) {
    console.log(profile)
    profile.accessLevel = 5;
    profile.imageUrl = profile._json.avatarfull;
    User.findOneAndUpdate({ openId: profile.id }, profile , {upsert: true, new: true} , function (err, user) {
      console.log('strategy user: ', user)
      return done(err, user);
    });
  }
));

app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res) {
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
  });

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/shittycock' }),
  function(req, res) {
    console.log('req user in callback: ', req.user)
    req.logIn(req.user, function(err) { if (err) { return next(err); } });
    // console.log('res in callback: ', res.isAuthenticated())
    // req.session.user = req.user
    res.redirect('/#/dashboard');
  });

/////// GOOGLE / PASSPORT Middleware
passport.use(new GoogleStrategy({
    clientID: config.gClientID,
    clientSecret: config.gSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile)
    if(profile._json.cover !== undefined) {
      // console.log('photo: ', profile._json.cover)
      profile.imageUrl = profile._json.cover.coverPhoto.url;
    }
    profile.accessLevel = 5;
    User.findOneAndUpdate({ googleId: profile.id }, profile , {upsert: true, new: true} , function (err, user) {
      console.log('strategy user: ', user)
      return cb(err, user);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/shittycock' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('req user in callback: ', req.user)
    req.logIn(req.user, function(err) { if (err) { return next(err); } });
    // console.log('res in callback: ', res.isAuthenticated())
    // req.session.user = req.user
    res.redirect('/#/dashboard');
  });

app.get('/api/me', function(req, res) {
  // console.log('user in da apis: ', req._passport.session.user);
  User.findOne({'_id':req._passport.session.user}, function(err, user) {
    // console.log('THE USER: ', user)
    res.send(user)
  })
})

app.post('/api/me', function(req, res) {
  console.log('POSTING')
  User.findOneAndUpdate({ _id : req.body._id }, req.body, {upsert: true, new: true} , function(err, user) {
    if(err) {console.log('ERROR: ', err)}
    // console.log('SAVED USER: ', user)
    res.send(user)
  })
  // res.send('ayyy')
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// passport.use(new TwitchTokenStrategy({
//     clientID: '9pqovxuw6ao9y2uac91byz0tncspfvz',
//     clientSecret: 's0nzv1mz6zdmaqinym3e2f19q7zhqsu',
//     passReqToCallback: true
// }, function(req, accessToken, refreshToken, profile, next) {
//     User.findOrCreate({'twitchId': profile.id}, function(error, user) {
//         console.log(error, user)
//         return next(error, user);
//     });
// }));
//
// app.get('/auth/twitch/', passport.authenticate('twitch-token'));


app.use('/api/v1', apiRouter);
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, './www')))

app.get('/', function (req, res) {
  res.sendFile('index.html', {root : './www'})
});

// app.get('/api/news/:query', function(req, res) {
//   console.log(req.params.query)
//   var newQuery = req.params.query.split(' ').join('%20')
//   console.log(newQuery)
//   var fullUrl = 'https://steamdb.info/instantsearch/?q=' + newQuery + '&hPP=20&idx=steamdb&p=0&dFR[appType][0]=Game&is_v=1';
//   console.log(fullUrl)
//   request(fullUrl , function (error, response, html) {
//     if (error) {console.log('Error retrieving news')}
//
//     res.send(html)
//
//     // // console.log(html)
//     // var retHtml = html.split('/search/')[1].split('"')[0]
//     // retHtml = retHtml.split('amp;')[0] + retHtml.split('amp;')[1] + retHtml.split('amp;')[2];
//     // var newUrl = 'https://steamdb.info/search/?a=app&q=' + req.params.query;
//     // console.log(retHtml)
//     //
//     // request(fullUrl , function (error, response, html) {
//     //   if (error) {console.log('Error retrieving news')}
//     //   res.send(html)
//     // })
//   })
// })

app.listen(3000, function () {
    console.log('Server started at http://localhost:3000')
})

//// Used to scrape data when needed
// scraper.scrape();
