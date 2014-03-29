'use strict';

var User = require('../models/user');
var moment = require('moment');

exports.fresh = function(req, res){
  res.render('users/fresh', {title: 'Register New User'});
};

exports.show = function(req, res){
  var user = req.user;
  res.render('users/profile', {title: 'Profile', user:user, moment:moment});
};

exports.socialprofiles = function(req, res){
  var user = req.user;
  res.render('users/socialprofiles', {title: 'Social Connections', user:user});
};

exports.homeAddress = function(req, res){
  User.findById(req.params.id, function(err, user){
    user.homeAddress = [(req.body.lat * 1), (req.body.lng * 1), req.body.homeAddress];
    console.log('-------------------- HOME ADDRESS ------------------');
    console.log(user.homeAddress);
    user.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/profile', {title: 'Profile', user:user});
    });
  });
};

exports.updateUsername = function(req, res){
  User.findById(req.params.id, function(err, user){
    user.username = req.body.username;
    user.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/profile', {title: 'Profile', user:user});
    });
  });
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
  User.findByEmail(req.user.email, function(err, foundUser){
    foundUser.facebook.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/socialprofiles', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};

exports.unlinkTwitter = function(req, res){
  User.findByEmail(req.user.email, function(err, foundUser){
    foundUser.twitter.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/socialprofiles', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};

exports.unlinkGoogle = function(req, res){
  User.findByEmail(req.user.email, function(err, foundUser){
    foundUser.google.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/socialprofiles', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};

exports.unlinkInstagram = function(req, res){
  User.findByEmail(req.user.email, function(err, foundUser){
    foundUser.instagram.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/socialprofiles', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};

exports.unlinkFoursquare = function(req, res){
  User.findByEmail(req.user.email, function(err, foundUser){
    foundUser.foursquare.token = undefined;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/socialprofiles', {title: 'Welcome to addcontxt!', user:foundUser});
    });
  });
};
