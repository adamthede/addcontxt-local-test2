/* jshint expr:true */
'use strict';

process.env.DBNAME = 'addcontxt-test';
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var app = require('../../app/app');
var expect = require('chai').expect;
var User, Birthday;
var u1;
var cookie;

describe('user', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Birthday = require('../../app/models/birthday');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/users/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/testfile.jpg';
      var copyfile = __dirname + '/../fixtures/testfile-copy.jpg';
      var copyfile1 = __dirname + '/../fixtures/testfiles-copy1.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile1));
      global.nss.db.dropDatabase(function(err, result){
        u1 = new User();
        u1.email = 'adam@nomail.com';
        u1.password = '1234';
        u1.generateHash();
        u1.save(function(){
          request(app)
          .post('/login')
          .field('email', 'adam@nomail.com')
          .field('password', '1234')
          .end(function(err, res){
            cookie = res.headers['set-cookie'];
            done();
          });
        });
      });
    });
  });

  describe('GET /', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('GET /register', function(){
    it('should display the register page', function(done){
      request(app)
      .get('/register')
      .expect(200, done);
    });
  });

  describe('POST /register', function(){
    it('should allow a user to register', function(done){
      //var filename = __dirname + '/../fixtures/testfile-copy.jpg';
      request(app)
      .post('/register')
      .field('email', 'sam@nomail.com')
      .field('password', '1235')
      //.attach('pic', filename)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });

    it('should not allow a duplicate email to register', function(done){
      //var filename = __dirname + '/../fixtures/testfile-copy.jpg';
      request(app)
      .post('/register')
      .field('email', 'adam@nomail.com')
      .field('password', '1234')
      //.attach('pic', filename)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('GET /login', function(){
    it('should display the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should login a new user', function(done){
      request(app)
      .post('/login')
      .field('email', 'nat@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.include('Moved Temporarily. Redirecting to /');
        done();
      });
    });

    it('should not login a non-existent user', function(done){
      request(app)
      .post('/login')
      .field('email', 'wrong@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        //expect(res.text).to.include('Login');
        done();
      });
    });

    it('should not login an incorrect password', function(done){
      request(app)
      .post('/login')
      .field('email', 'adam@nomail.com')
      .field('password', '12234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        //expect(res.text).to.include('Login');
        done();
      });
    });
  });

  describe('GET /profile', function(){
    it('should redirect to the show page', function(done){
      request(app)
      .get('/profile')
      .set('cookie', cookie)
      .expect(200, done);
    });
  });

  describe('GET /socialprofiles', function(){
    it('should redirect to the social profiles show page', function(done){
      request(app)
      .get('/socialprofiles')
      .set('cookie', cookie)
      .expect(200, done);
    });
  });

  describe('POST /homeAddress/:id', function(){
    it('should update home address and re-render the user profile page', function(done){
      var id = u1._id.toString();
      request(app)
      .post('/homeAddress/'+id)
      .set('cookie', cookie)
      .field('homeAddress', '283 Plus Park Blvd, Nashville, TN')
      .field('lat', '36.12')
      .field('lng', '-86.72')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST /username/:id', function(){
    it('should update username and re-render the user profile page', function(done){
      var id = u1._id.toString();
      request(app)
      .post('/homeAddress/'+id)
      .set('cookie', cookie)
      .field('username', 'Adam Thede')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('GET /logout', function(){
    it('should log a user out of the app', function(done){
      request(app)
      .get('/logout')
      .expect(302, done);
    });
  });

});
