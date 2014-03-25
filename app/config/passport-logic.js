'use strict';

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
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
    //done(err, user);
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
