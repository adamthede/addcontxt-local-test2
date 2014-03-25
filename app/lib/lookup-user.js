'use strict';

module.exports = function(req, res, next){
  var User = require('../models/user');

  if(req.user){
    res.locals.user = req.user;
    next();
  }else{
    User.findById(req.session.userId, function(user){
      res.locals.user = user;
      next();
    });
  }
};
