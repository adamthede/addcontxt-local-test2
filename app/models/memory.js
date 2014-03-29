'use strict';

module.exports = Memory;
var _ = require('lodash');
var memories = global.nss.db.collection('memories');
var Mongo = require('mongodb');

function Memory(memory){
  this.userId = new Mongo.ObjectID(memory.userId);
  this.provider = memory.provider;
  this.title = memory.title;
  this.who = memory.who.split(', ').map(function(who){return who.trim();});
  this.who = _.compact(this.who);
  this.whatTags = memory.whatTags.split(', ').map(function(whatTags){return whatTags.trim();});
  this.whatTags = _.compact(this.whatTags);
  this.whenDateModified = memory.whenDateModified ? new Date(memory.whenDateModified) : null;
  this.whenDateCreated = memory.whenDateCreated ? memory.whenDateCreated : new Date();
  this.where = memory.where ? JSON.parse(memory.where) : null;
  this.why = memory.why;
  this.currentweather = memory.currentweather ? JSON.parse(memory.currentweather) : null;
  this.historicweather = memory.historicweather ? JSON.parse(memory.historicweather) : null;
}

// ------------------- INSTANCE METHODS ------------------- //

Memory.prototype.insert = function(fn){
  memories.insert(this, function(err, record){
    fn(err);
  });
};

Memory.prototype.update = function(fn){
  memories.update({_id:this._id}, this, function(err, count){
    fn(count);
  });
};

// ------------------- CLASS METHODS ---------------------- //

Memory.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  memories.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

//------------------- FIND METHODS -------------------//

Memory.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  memories.findOne({_id:_id}, function(err, record){
    fn(_.extend(record, Memory.prototype));
  });
};

Memory.findByUserId = function(id, fn){
  var userId = Mongo.ObjectID(id);
  memories.find({userId:userId}).toArray(function(err, records){
    fn(records);
  });
};

Memory.findAll = function(fn){
  memories.find().toArray(function(err, records){
    fn(records);
  });
};

Memory.findByUserAndWhatTag = function(id, tag, fn){
  var _id = Mongo.ObjectID(id);
  memories.find({userId:_id, whatTags:tag}).toArray(function(err, memories){
    fn(memories);
  });
};

Memory.find = function(query, fn){
  var limit = query.limit*1 || 3;
  var skip = query.page ? (query.page - 1) * limit : 0;
  var filter = {};
  var sort = [];

  if(query.filterName === 'whatTags'){
    query.filterValue = query.filterValue;
  }else if(query.filterName === 'title'){
    query.filterValue = new RegExp(query.filterValue);
  }else if(query.filterName === 'why'){
    query.filterValue = new RegExp(query.filterValue);
  }else if(query.filterName === 'who'){
    query.filterValue = query.filterValue;
  }

  var userId = Mongo.ObjectID(query.userId);
  filter.userId = userId;
  filter[query.filterName] = query.filterValue;

  if(query.sort){
    var direction = query.direction ? query.direction * 1 : 1;
    sort.push([query.sort, direction]);
  }

  memories.find(filter, {sort:sort, skip:skip, limit:limit}).toArray(function(err, records){
    fn(records);
  });
};
