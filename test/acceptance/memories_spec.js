/* jshint expr:true */
'use strict';

process.env.DBNAME = 'addcontxt-test';
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var app = require('../../app/app');
var expect = require('chai').expect;
var User, Birthday, Memory;
var u1, memory;
var cookie;

describe('memories', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Birthday = require('../../app/models/birthday');
      Memory = require('../../app/models/memory');
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
      var copyfile2 = __dirname + '/../fixtures/testfiles-copy2.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile1));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile2));
      global.nss.db.dropDatabase(function(err, result){
        u1 = new User();
        u1.email = 'adam@nomail.com';
        u1.password = '1234';
        u1.generateHash();
        u1.save(function(){
          memory = new Memory({
            userId : u1._id.toString(),
            provider : 'addcontxt',
            title : 'Memory 1',
            who : 'Adam Thede, Nat Webb, Robert Fryman',
            whatTags : 'coding, sitting, app',
            whenDateModified : '2014-02-12',
            where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
            why : 'Tests are great.',
            currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
            historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
          });
          memory.insert(function(){
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
  });

  describe('GET /capture', function(){
    it('should display the memory capture page', function(done){
      request(app)
      .get('/capture')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('capture');
        done();
      });
    });
  });

  describe('POST /capture/:id', function(){
    it('should save a memory in the db via user id', function(done){
      var id = u1._id.toString();
      request(app)
      .post('/capture/'+id)
      .set('cookie', cookie)
      .field('title', 'Testing My App')
      .field('provider', 'addcontxt')
      .field('who', 'Adam Thede, Nat Webb')
      .field('whatTags', 'testing, app')
      .field('whenDateModified', '2014-03-03')
      .field('why', 'All good apps have tests')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should save a memory with selfie in the db via user id', function(done){
      var id = u1._id.toString();
      var sampleDataURL = 'data:image/gif;base64,R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7';
      request(app)
      .post('/capture/'+id)
      .set('cookie', cookie)
      .field('title', 'Testing My App')
      .field('provider', 'addcontxt')
      .field('who', 'Adam Thede, Nat Webb')
      .field('whatTags', 'testing, app')
      .field('whenDateModified', '2014-03-03')
      .field('why', 'All good apps have tests, and this one has a selfie')
      .field('selfie', sampleDataURL)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should save a memory with selfie and pics in the db via user id', function(done){
      var id = u1._id.toString();
      var sampleDataURL = 'data:image/gif;base64,R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7';
      var oldpath1 = __dirname + '/../fixtures/testfiles-copy1.jpg';
      var oldpath2 = __dirname + '/../fixtures/testfiles-copy2.jpg';
      var photosArray = [{path:oldpath1, originalFilename:'test1'}, {path:oldpath2, originalFilename:'test2'}];
      request(app)
      .post('/capture/'+id)
      .set('cookie', cookie)
      .field('title', 'Testing My App')
      .field('provider', 'addcontxt')
      .field('who', 'Adam Thede, Nat Webb')
      .field('whatTags', 'testing, app')
      .field('whenDateModified', '2014-03-03')
      .field('why', 'All good apps have tests, this one has a selfie and pics')
      .field('selfie', sampleDataURL)
      .field('photos', photosArray)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should save a memory with pics in the db via user id', function(done){
      var id = u1._id.toString();
      var oldpath1 = __dirname + '/../fixtures/testfiles-copy1.jpg';
      var oldpath2 = __dirname + '/../fixtures/testfiles-copy2.jpg';
      var photosArray = [{path:oldpath1, originalFilename:'test1'}, {path:oldpath2, originalFilename:'test2'}];
      request(app)
      .post('/capture/'+id)
      .set('cookie', cookie)
      .field('title', 'Testing My App')
      .field('provider', 'addcontxt')
      .field('who', 'Adam Thede, Nat Webb')
      .field('whatTags', 'testing, app')
      .field('whenDateModified', '2014-03-03')
      .field('why', 'All good apps have tests, this one has pics')
      .field('photos', photosArray)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('GET /memory/:id', function(){
    it('should show a specific memory via id', function(done){
      var memoryId = memory._id.toString();
      request(app)
      .get('/memory/'+memoryId)
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('GET /memories', function(){
    it('should show the memory index page', function(done){
      request(app)
      .get('/memories')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

});
