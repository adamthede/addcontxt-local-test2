'use strict';

module.exports = User;

var users = global.nss.db.collection('users');
var bcrypt = require('bcrypt');
var Mongo = require('mongodb');
var _ = require('lodash');

function User(user){
  this.username = '';
  this.email = '';
  this.password = '';
  this.facebook = {id:'', token:'', email:'', name:'', profilePhoto:'', gender:'', profile:''};
  this.twitter = {id:'', token:'', displayName:'', username:'', profilePhoto:'', profile:''};
  this.google = {id:'', token:'', email:'', name:'', profile:''};
  this.foursquare = {id:'', token:'', profile:'', displayName:'', email:'', profilePhoto:''};
  this.instagram = {id:'', token:'', profile:'', displayName:'', username:'', profilePhoto:'', counts:''};
}

User.prototype.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.prototype.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
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

User.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    if(record){
      fn(err, _.extend(record, User.prototype));
    }else{
      fn(err, null);
    }
    //fn(err, record);
  });
};
/*
    if(record){
      fn(record);
    }else{
      fn(err);
    }
  });
};
*/
User.findByEmail = function(email, fn){
  users.findOne({email:email}, function(err, record){
    if(record){
      fn(_.extend(record, User.prototype));
    }else{
      fn(err);
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

/*
function hashPassword(password, fn){
  bcrypt.hash(password, 8, function(err, hash){
    fn(hash);
  });
}

function insert(user, fn){
  users.findOne({email:user.email}, function(err, userFound){
    if(!userFound){
      users.findOne({name:user.username}, function(err, userFound){
        if(!userFound){
          users.insert(user, function(err, record){
            fn(err);
          });
        }else{
          fn();
        }
      });
    }else{
      fn();
    }
  });
}

User.prototype.comparePassword = function(password){
  bcrypt.compare(password, this.password, function(err, isMatch){
    if(err){
      return err;
    }else{
      return isMatch;
    }
  });
};

User.prototype.register = function(fn){
  var self = this;

  hashPassword(self.password, function(hashedPassword){
    self.password = hashedPassword;
    insert(self, function(err){
      fn();
    });
  });
};

User.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

User.findByUsername = function(username, fn){
  users.findOne({username:username}, function(err, record){
    fn(record);
  });
};

User.findByEmail = function(email, fn){
  users.findOne({email:email}, function(err, record){
    fn(record);
  });
};
*/
