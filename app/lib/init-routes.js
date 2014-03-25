/* jshint camelcase:false */

'use strict';

var d           = require('../lib/request-debug');
var initialized = false;
var check       = require('../config/check');
var passport    = require('passport');
var configAuth  = require('../config/auth');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy   = require('passport-facebook').Strategy;
var TwitterStrategy    = require('passport-twitter').Strategy;
var InstagramStrategy  = require('passport-instagram').Strategy;
var FoursquareStrategy = require('passport-foursquare').Strategy;
var GoogleStrategy     = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var User = require('../models/user');

  passport.serializeUser(function(user, done){
    console.log('------------- SERIALIZE ---------------');
    console.log(user._id);
    done(null, user._id);
  });

  passport.deserializeUser(function(_id, done){
    console.log('----------- DESERIALIZE ---------------');
    console.log(_id);
    User.findById(_id, function(err, user){
      console.log(user);
      if(!err){
        done(err, user);
      }else{
        done(err, null);
      }
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){
    process.nextTick(function(){
      User.findByEmail(email, function(err, user){
        if(err){
          return done(err);
        }else if(user){
          return done(null, false, {message: 'Selected email is already registered'});
        }else{
          var newUser = new User();
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.save(function(err){
            if(err){
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){
    User.findByEmailAndPassword(email, password, function(user){
      if(user){
        return done(null, user);
      }else{
        return done(null, false);
      }
    });
  }));

  passport.use(new FacebookStrategy({
    clientID       : configAuth.facebookAuth.clientID,
    clientSecret   : configAuth.facebookAuth.clientSecret,
    callbackURL    : configAuth.facebookAuth.callbackURL,
    profileFields: ['photos', 'id', 'username', 'displayName', 'name', 'gender', 'profileUrl', 'emails'],
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done){
    process.nextTick(function(){
      if(req.user){
        if(!req.user.facebook.token){
          User.findByEmail(req.user.email, function(foundUser){
            console.log('================= FACEBOOK DATA ================');
            console.log(profile);
            foundUser.facebook.id           = profile.id;
            foundUser.facebook.token        = token;
            foundUser.facebook.name         = profile.name.givenName + ' ' + profile.name.familyName;
            foundUser.facebook.email        = profile.emails[0].value;
            foundUser.facebook.profilePhoto = profile.photos[0].value;
            foundUser.facebook.gender       = profile.gender;
            foundUser.facebook.profile      = profile;

            foundUser.update(function(err, count){
              if(err){
                throw err;
              }
              return done(null, foundUser);
            });
          });
        }
      }
    });
  }));

  passport.use(new TwitterStrategy({
    consumerKey             : configAuth.twitterAuth.consumerKey,
    consumerSecret          : configAuth.twitterAuth.consumerSecret,
    callbackURL             : configAuth.twitterAuth.callbackURL,
    passReqToCallback       : true
  },
  function(req, token, tokenSecret, profile, done){
    process.nextTick(function(){
      if(req.user){
        if(!req.user.twitter.token){
          User.findByEmail(req.user.email, function(foundUser){
            console.log('================= TWITTER DATA ================');
            console.log(profile);
            foundUser.twitter.id           = profile.id;
            foundUser.twitter.token        = token;
            foundUser.twitter.username     = profile.username;
            foundUser.twitter.displayName  = profile.displayName;
            foundUser.twitter.profilePhoto = profile.photos[0].value;
            foundUser.twitter.profile      = profile;

            foundUser.update(function(err, count){
              if(err){
                throw err;
              }
              return done(null, foundUser);
            });
          });
        }
      }
    });
  }));

  passport.use(new GoogleStrategy({
    clientID     : configAuth.googleAuth.clientID,
    clientSecret : configAuth.googleAuth.clientSecret,
    callbackURL  : configAuth.googleAuth.callbackURL,
    passReqToCallback  : true
  },
  function(req, token, refreshToken, profile, done){
    process.nextTick(function(){
      if(req.user){
        if(!req.user.google.token){
          User.findByEmail(req.user.email, function(foundUser){
            console.log('==================== GOOGLE DATA ==================');
            console.log(profile);
            foundUser.google.id    = profile.id;
            foundUser.google.token = token;
            foundUser.google.name  = profile.displayName;
            foundUser.google.email = profile.emails[0].value;
            foundUser.google.profile = profile;

            foundUser.update(function(err, count){
              if(err){
                throw err;
              }
              return done(null, foundUser);
            });
          });
        }
      }
    });
  }));

  passport.use(new InstagramStrategy({
    clientID     : configAuth.instagramAuth.clientID,
    clientSecret : configAuth.instagramAuth.clientSecret,
    callbackURL  : configAuth.instagramAuth.callbackURL,
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done){
    process.nextTick(function(){
      if(req.user){
        if(!req.user.instagram.token){
          User.findByEmail(req.user.email, function(foundUser){
            console.log('==================== INSTAGRAM DATA ==================');
            console.log(profile);
            foundUser.instagram.id    = profile.id;
            foundUser.instagram.token = token;
            foundUser.instagram.displayName = profile.displayName;
            foundUser.instagram.username = profile.username;
            foundUser.instagram.profilePhoto = profile._json.data.profile_picture;
            foundUser.instagram.counts = profile._json.data.counts;
            foundUser.instagram.profile = profile;

            foundUser.update(function(err, count){
              if(err){
                throw err;
              }
              return done(null, foundUser);
            });
          });
        }
      }
    });
  }));

  passport.use(new FoursquareStrategy({
    clientID     : configAuth.foursquareAuth.clientID,
    clientSecret : configAuth.foursquareAuth.clientSecret,
    callbackURL  : configAuth.foursquareAuth.callbackURL,
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done){
    process.nextTick(function(){
      if(req.user){
        if(!req.user.foursquare.token){
          User.findByEmail(req.user.email, function(foundUser){
            console.log('==================== FOURSQUARE DATA ==================');
            console.log(profile);
            foundUser.foursquare.id    = profile.id;
            foundUser.foursquare.token = token;
            foundUser.foursquare.displayName = profile.name.givenName + ' ' + profile.name.familyName;
            foundUser.foursquare.email = profile.emails[0].value;
            foundUser.foursquare.profilePhoto = profile._json.response.user.photo.prefix +'original'+ profile._json.response.user.photo.suffix;
            foundUser.foursquare.profile = profile;

            console.log('---------------------- FOURSQUARE BREAKDOWN -------------------');
            console.log(profile._json.response.user);
            console.log(profile._json.response.user.friends.groups[1].items);
            console.log(profile._json.response.user.checkins.items);
            console.log(profile._json.response.user.photos);

            foundUser.update(function(err, count){
              if(err){
                throw err;
              }
              return done(null, foundUser);
            });
          });
        }
      }
    });
  }));

  var home = require('../routes/home');
  var users = require('../routes/users');

  // Basic Pages
  app.get('/', d, home.index);

  // Social Authenticating and Authorizing
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'user_photos', 'user_friends', 'read_stream']}));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect:'/profile', failureRedirect:'/'}));
  app.get('/unlink/facebook', d, check.ensureAuthenticated, users.unlinkFacebook);
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect:'/profile', failureRedirect:'/'}));
  app.get('/unlink/twitter', d, check.ensureAuthenticated, users.unlinkTwitter);
  app.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
  app.get('/auth/google/callback', passport.authenticate('google', {successRedirect:'/profile', failureRedirect:'/'}));
  app.get('/unlink/google', d, check.ensureAuthenticated, users.unlinkGoogle);
  app.get('/auth/instagram', passport.authenticate('instagram'));
  app.get('/auth/instagram/callback', passport.authenticate('instagram', {successRedirect:'/profile', failureRedirect:'/'}));
  app.get('/unlink/instagram', d, check.ensureAuthenticated, users.unlinkInstagram);
  app.get('/auth/foursquare', passport.authenticate('foursquare'));
  app.get('/auth/foursquare/callback', passport.authenticate('foursquare', {successRedirect:'/profile', failureRedirect:'/'}));
  app.get('/unlink/foursquare', d, check.ensureAuthenticated, users.unlinkFoursquare);

  // User Pages
  app.get('/register', d, users.fresh);
  app.post('/register', d, passport.authenticate('local-signup', {failureRedirect: '/register', successRedirect: '/profile'}), function(req, res){
    res.redirect('/login');
  });
  app.get('/login', d, users.login);
  app.post('/login', d, passport.authenticate('local-login', {failureRedirect: '/login'}), function(req, res){
    res.redirect('/profile');
  });
  app.get('/profile', d, check.ensureAuthenticated, users.show);
  app.get('/logout', d, users.logout);
  console.log('Routes Loaded');
  fn();
}
