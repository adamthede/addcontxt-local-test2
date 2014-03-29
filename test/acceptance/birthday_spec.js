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

describe('birthday', function(){

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

  describe('POST /birthday/:id', function(){
    it('should update a users birthday', function(done){
      var id = u1._id.toString();
      request(app)
      .post('/birthday/'+id)
      .set('cookie', cookie)
      .field('birthday', '1979-02-28')
      .field('timezoneOffset', '-5')
      .field('formattedBirthday', '')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
});
