'use strict';

process.env.DBNAME = 'addcontxt-test';
var expect = require('chai').expect;
var Birthday;

describe('Birthday', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Birthday = require('../../app/models/birthday');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      done();
    });
  });

  describe('new', function(){
    it('should create a new Birthday object', function(done){
      var birthday = new Birthday({birthday:'1979-02-28', DropDownTimezone:'-5'});
      expect(birthday.birthday).to.be.instanceof(Date);
      expect(birthday.timezoneOffset).to.equal(-5);
      done();
    });
  });

  describe('#convertPerTimezone', function(){
    it('should adjust the birthday to properly account for timezone offset', function(done){
      var birthday = new Birthday({birthday:'1979-02-28', DropDownTimezone:'-5'});
      birthday.convertPerTimezone();
      expect(birthday.formattedBirthday).to.be.instanceof(Date);
      done();
    });
  });
});
