'use strict';

var Birthday = require('../models/birthday');
var User = require('../models/user');

exports.create = function(req, res){
  var birthday = new Birthday(req.body);
  birthday.convertPerTimezone();
  User.findByEmail(req.user.email, function(err, foundUser){
    foundUser.birthday = birthday;
    foundUser.update(function(err, count){
      if(err){
        throw err;
      }
      res.render('users/profile', {title: 'Profile', user:foundUser});
    });
  });
};
