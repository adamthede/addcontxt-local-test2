'use strict';

var moment = require('moment');
var Memory = require('../models/memory');

exports.fresh = function(req, res){
  res.render('memories/fresh', {title:'Capture a Memory', moment:moment});
};

exports.capture = function(req, res){
  req.body.userId = req.params.id;
  var memory = new Memory(req.body);
  memory.insert(function(){
    memory.mkDir(function(){
      if(req.files.photos && req.body.selfie.slice(0,4) === 'data'){
        memory.addPhotos(req.files.photos, function(){
          memory.useSelfie(req.body.selfie, function(selfiepic){
            memory.addSelfie(selfiepic, function(){
              memory.update(function(){
                res.render('memories/show', {title:memory.title, memory:memory, moment:moment});
              });
            });
          });
        });
      }else if(req.files.photos){
        memory.addPhotos(req.files.photos, function(){
          memory.update(function(){
            res.render('memories/show', {title:memory.title, memory:memory, moment:moment});
          });
        });
      }else if(req.body.selfie.slice(0,4) === 'data'){
        memory.useSelfie(req.body.selfie, function(selfiepic){
          memory.addSelfie(selfiepic, function(){
            memory.update(function(){
              res.render('memories/show', {title:memory.title, memory:memory, moment:moment});
            });
          });
        });
      }else{
        res.render('memories/show', {title:memory.title, memory:memory, moment:moment});
      }
    });
  });
};

exports.show = function(req, res){
  Memory.findById(req.params.id, function(memory){
    res.render('memories/show', {title:memory.title, memory:memory, moment:moment});
  });
};

exports.index = function(req, res){
  Memory.findByUserId(req.user._id.toString(), function(memories){
    var coordinates = [];
    for(var i = 0; i < memories.length; i++){
      if(memories[i].where){
        coordinates.push([memories[i].where.lat, memories[i].where.lng, memories[i].where.venuename]);
        coordinates.push('|');
      }
    }
    console.log(coordinates);
    res.render('memories/index', {title:req.user.username, memories:memories, moment:moment, coordinates:coordinates});
  });
};
