'use strict';

module.exports = User;

var users = global.nss.db.collection('users');
var bcrypt = require('bcrypt');
var Mongo = require('mongodb');
var _ = require('lodash');

function User(user){
  this.dateCreated = new Date();
  this.username    = 'Profile';
  this.birthday    = '';
  this.homeAddress = '';
  this.email       = '';
  this.password    = '';
  this.facebook    = {id:'', token:'', email:'', name:'', profilePhoto:'', gender:'', profile:''};
  this.twitter     = {id:'', token:'', displayName:'', username:'', profilePhoto:'', profile:''};
  this.google      = {id:'', token:'', email:'', name:'', profilePhoto:'', profile:''};
  this.foursquare  = {id:'', token:'', displayName:'', email:'', profilePhoto:'', profile:''};
  this.instagram   = {id:'', token:'', displayName:'', username:'', profilePhoto:'', counts:'', profile:''};
}

// ----------------------- INSTANCE METHODS --------------------- //

User.prototype.generateHash = function(){
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
};

User.prototype.save = function(fn){
  users.insert(this, function(err, records){
    fn(err);
  });
};

User.prototype.update = function(fn){
  users.update({_id:this._id}, this, function(err, count){
    fn(err, count);
  });
};

// ----------------------- CLASS METHODS ----------------------- //

User.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    if(record){
      fn(err, _.extend(record, User.prototype));
    }else{
      fn(err, null);
    }
  });
};

User.findByEmail = function(email, fn){
  users.findOne({email:email}, function(err, record){
    if(record){
      fn(err, _.extend(record, User.prototype));
    }else{
      fn(err, null);
    }
  });
};

User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, record){
    if(record){
      bcrypt.compare(password, record.password, function(err, result){
        if(result){
          fn(record);
        }else{
          fn(null);
        }
      });
    }else{
      fn(null);
    }
  });
};

User.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.remove({_id:_id}, function(err, count){
    fn(count);
  });
};
