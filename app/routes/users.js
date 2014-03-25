'use strict';

var User = require('../models/user');

exports.fresh = function(req, res){
  res.render('users/fresh', {title: 'Register New User'});
};

exports.show = function(req, res){
  var user = req.user;
  res.render('users/profile', {title: 'Welcome to addcontxt!', user:user});
};

exports.create = function(req, res){
  var user = new User(req.body);
  user.register(function(){
    if(user._id){
      res.redirect('/');
    }else{
      res.render('users/fresh');
    }
  });
};

exports.login = function(req, res){
  res.render('users/login', {title:'Login'});
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.unlinkFacebook = function(req, res){
  User.findByEmail(req.user.email, function(foundUser){
    foundUser.facebook.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/profile', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};

exports.unlinkTwitter = function(req, res){
  User.findByEmail(req.user.email, function(foundUser){
    foundUser.twitter.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/profile', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};

exports.unlinkGoogle = function(req, res){
  User.findByEmail(req.user.email, function(foundUser){
    foundUser.google.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/profile', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};

exports.unlinkInstagram = function(req, res){
  User.findByEmail(req.user.email, function(foundUser){
    foundUser.instagram.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/profile', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};

exports.unlinkFoursquare = function(req, res){
  User.findByEmail(req.user.email, function(foundUser){
    foundUser.foursquare.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/profile', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};
