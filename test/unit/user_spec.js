/* jshint expr:true */

'use strict';

process.env.DBNAME = 'addcontxt-test';
var expect = require('chai').expect;
var User;
var Birthday;
var fs = require('fs');
var exec = require('child_process').exec;
var Mongo = require('mongodb');
var u1;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      Birthday = require('../../app/models/birthday');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/users/test*';
    var cmd = 'rm ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/testfile.jpg';
      var copyfile = __dirname + '/../fixtures/testfile-copy.jpg';
      var copyfile2 = __dirname + '/../fixtures/testfile2-copy.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile2));
      global.nss.db.dropDatabase(function(err, result){
        u1 = new User();
        u1.email = 'adam@nomail.com';
        u1.password = '1234';
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new User object in the db', function(done){
      expect(u1.email).to.equal('adam@nomail.com');
      expect(u1.password).to.equal('1234');
      done();
    });
  });

// ----------------- INSTANCE METHODS ---------------- //

  describe('#generateHash', function(){
    it('should hash the user password', function(done){
      u1.generateHash();
      expect(u1.password).not.equal('1234');
      expect(u1.password).to.have.length(60);
      done();
    });
  });

  describe('#save', function(){
    it('should save the user in the db', function(done){
      u1.save(function(){
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('#update', function(){
    it('should update a user in the db', function(done){
      u1.save(function(){
        u1.username = 'Adam Thede';
        u1.update(function(){
          expect(u1.username).to.equal('Adam Thede');
          done();
        });
      });
    });
  });

// ----------------- CLASS METHODS ------------------- //
// ----------------- FIND METHODS -------------------- //

  describe('.findById', function(){
    it('should find a user by user id', function(done){
      var u2 = new User();
      u2.email = 'laura@nomail.com';
      u2.password = '5678';
      u2.username = 'Laura Veltz';
      u2.generateHash();
      u1.username = 'Adam Thede';
      u1.save(function(){
        u2.save(function(){
          User.findById(u2._id.toString(), function(err, user){
            expect(user.username).to.equal('Laura Veltz');
            expect(user.password).to.not.equal('5678');
            done();
          });
        });
      });
    });
  });

  describe('.findByEmail', function(){
    it('should find a user by email', function(done){
      var u2 = new User();
      u2.email = 'laura@nomail.com';
      u2.password = '5678';
      u2.username = 'Laura Veltz';
      u2.generateHash();
      u1.username = 'Adam Thede';
      u1.generateHash();
      u1.save(function(){
        u2.save(function(){
          User.findByEmail('adam@nomail.com', function(err, user){
            expect(user.username).to.equal('Adam Thede');
            expect(user._id.toString()).to.have.length(24);
            expect(user._id).to.be.instanceof(Mongo.ObjectID);
            done();
          });
        });
      });
    });
  });

  describe('.findByEmailAndPassword', function(){
    it('should find a user and verify their password', function(done){
      u1.generateHash();
      u1.save(function(){
        User.findByEmailAndPassword('adam@nomail.com', '1234', function(user){
          expect(user).to.be.ok;
          done();
        });
      });
    });

    it('should not verify a false email', function(done){
      u1.generateHash();
      u1.save(function(){
        User.findByEmailAndPassword('samuel@nomail.com', '1234', function(user){
          expect(user).to.be.null;
          done();
        });
      });
    });

    it('should not allow an incorrect password', function(done){
      u1.generateHash();
      u1.save(function(){
        User.findByEmailAndPassword('adam@nomail.com', '5678', function(user){
          expect(user).to.be.null;
          done();
        });
      });
    });
  });

// ----------------- DELETE METHOD -------------------- //

  describe('.deleteById', function(){
    it('should delete a user by the user id', function(done){
      u1.generateHash();
      u1.save(function(){
        User.deleteById(u1._id.toString(), function(count){
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });

});
