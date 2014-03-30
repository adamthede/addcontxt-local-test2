/* jshint expr:true */

'use strict';

process.env.DBNAME = 'addcontxt-test';
var expect = require('chai').expect;
var User;
var Birthday;
var Memory;
var fs = require('fs');
var exec = require('child_process').exec;
var Mongo = require('mongodb');
var u1, u2, u3, m1;

describe('Memory', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      Birthday = require('../../app/models/birthday');
      Memory = require('../../app/models/memory');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/users/test*';
    var cmd = 'rm ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/testfile.jpg';
      var copyfile = __dirname + '/../fixtures/testfile-copy.jpg';
      var copyfile1 = __dirname + '/../fixtures/testfile1-copy.jpg';
      var copyfile2 = __dirname + '/../fixtures/testfile2-copy.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile1));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile2));
      global.nss.db.dropDatabase(function(err, result){
        u1 = new User();
        u1.email = 'adam@nomail.com';
        u1.password = '1234';
        u1.generateHash();
        u1.save(function(){
          var userId = u1._id.toString();
          var provider = 'addcontxt';
          var title = 'Seeding The Database';
          var who = 'Adam Thede, Nat Webb, Robert Fryman';
          var whatTags = 'seed, coding, app, sitting, software school';
          var whenDateModified = '2014-03-24';
          var where = '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}';
          var why = 'Because every good app has good tests associated with it.';
          var currentweather = '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}';
          var historicweather = '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}';
          m1 = new Memory({
            userId:userId,
            provider:provider,
            title:title,
            who:who,
            whatTags:whatTags,
            whenDateModified:whenDateModified,
            where:where,
            why:why,
            currentweather:currentweather,
            historicweather:historicweather
          });
          m1.insert(function(){
            u2 = new User();
            u2.email = 'laura@nomail.com';
            u2.password = '5678';
            u2.generateHash();
            u2.save(function(){
              u3 = new User();
              u3.email = 'chyld@nomail.com';
              u3.password = 'abcd';
              u3.generateHash();
              u3.save(function(){
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('new', function(){
    it('should create a new Memory object', function(done){
      var userId = u1._id.toString();
      var provider = 'addcontxt';
      var title = 'This Is My First Memory';
      var who = 'Adam Thede, Nat Webb, Robert Fryman';
      var whatTags = 'coding, app, sitting, software school';
      var whenDateModified = '2014-03-24';
      var where = '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}';
      var why = 'Because every good app has good tests associated with it.';
      var currentweather = '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}';
      var historicweather = '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}';
      var memory = new Memory({
        userId:userId,
        provider:provider,
        title:title,
        who:who,
        whatTags:whatTags,
        whenDateModified:whenDateModified,
        where:where,
        why:why,
        currentweather:currentweather,
        historicweather:historicweather
      });
      expect(memory.userId).to.deep.equal(u1._id);
      expect(memory.provider).to.equal('addcontxt');
      expect(memory.whenDateModified).to.be.instanceof(Date);
      expect(memory.whenDateCreated).to.be.instanceof(Date);
      expect(memory.whatTags).to.deep.equal(['coding','app','sitting','software school']);
      expect(memory.who).to.deep.equal(['Adam Thede','Nat Webb','Robert Fryman']);
      expect(memory.where).to.be.instanceof(Object);
      expect(memory.currentweather).to.be.instanceof(Object);
      expect(memory.historicweather).to.be.instanceof(Object);
      done();
    });
  });

// ----------------- INSTANCE METHODS ---------------- //

  describe('#insert', function(){
    it('should insert a memory in the db', function(done){
      var userId = u1._id.toString();
      var provider = 'addcontxt';
      var title = 'This Is My First Memory';
      var who = 'Adam Thede, Nat Webb, Robert Fryman';
      var whatTags = 'coding, app, sitting, software school';
      var whenDateModified = '2014-03-24';
      var where = '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}';
      var why = 'Because every good app has good tests associated with it.';
      var currentweather = '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}';
      var historicweather = '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}';
      var memory = new Memory({
        userId:userId,
        provider:provider,
        title:title,
        who:who,
        whatTags:whatTags,
        whenDateModified:whenDateModified,
        where:where,
        why:why,
        currentweather:currentweather,
        historicweather:historicweather
      });
      memory.insert(function(){
        expect(memory.title).to.equal('This Is My First Memory');
        expect(memory._id).to.be.instanceof(Mongo.ObjectID);
        expect(memory._id.toString()).to.have.length(24);
        done();
      });
    });
  });

  describe('#update', function(){
    it('should update a memory in the db', function(done){
      m1.title = 'Making a Change To My Seeded Memory';
      m1.update(function(count){
        expect(m1.title).to.equal('Making a Change To My Seeded Memory');
        expect(count).to.equal(1);
        expect(m1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('#mkDir', function(){
    it('should create a memory directory for photos', function(done){
      m1.mkDir(function(){
        expect(m1.photoPath).to.be.ok;
        expect(m1.photoPath).to.equal('/img/memories/'+m1._id.toString());
        done();
      });
    });
  });

  describe('#useSelfie', function(){
    var sampleDataURL = 'data:image/gif;base64,R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7';
    it('should create a file from the webcam', function(done){
      m1.useSelfie(sampleDataURL, function(selfiepic){
        expect(selfiepic).to.be.ok;
        expect(selfiepic.slice(selfiepic.length - 3, selfiepic.length)).to.equal('gif');
        done();
      });
    });
  });

  describe('#addSelfie', function(){
    it('should add the imagepath for the Selfie to the memory', function(done){
      var oldpath = __dirname + '/../fixtures/testfile-copy.jpg';
      m1.mkDir(function(){
        m1.addSelfie(oldpath, function(){
          expect(m1.selfie).to.be.ok;
          expect(m1.selfie.length).to.not.equal(0);
          done();
        });
      });
    });
  });

  describe('#addPhotos', function(){
    it('should add photos to the memory', function(done){
      var oldpath1 = __dirname + '/../fixtures/testfile1-copy.jpg';
      var oldpath2 = __dirname + '/../fixtures/testfile2-copy.jpg';
      var photosArray = [{path:oldpath1, originalFilename:'testing1'}, {path:oldpath2, originalFilename:'testing2'}];
      m1.mkDir(function(){
        m1.addPhotos(photosArray, function(){
          expect(m1.photos.length).to.equal(2);
          done();
        });
      });
    });
  });





// ----------------- CLASS METHODS ------------------- //

  describe('.deleteById', function(){
    it('should delete a memory by id', function(done){
      Memory.deleteById(m1._id.toString(), function(count){
        expect(count).to.equal(1);
        done();
      });
    });
  });

// ----------------- FIND METHODS -------------------- //

  describe('.findById', function(){
    it('should find a memory by memory id', function(done){
      Memory.findById(m1._id.toString(), function(memory){
        expect(memory.title).to.equal('Seeding The Database');
        expect(memory.whenDateCreated).to.be.instanceof(Date);
        expect(m1._id.toString()).to.equal(memory._id.toString());
        done();
      });
    });
  });

  describe('.findByUserId', function(){
    it('should find all memories associated with a user id', function(done){
      var m2 = new Memory({
        userId : u2._id.toString(),
        provider : 'addcontxt',
        title : 'Another Memory',
        who : 'Adam Thede, Nat Webb',
        whatTags : 'coding, sitting',
        whenDateModified : '2014-03-01',
        where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
        why : 'Tests are a good thing.',
        currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
        historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
      });
      m2.insert(function(){
        Memory.findByUserId(u1._id.toString(), function(memories){
          expect(memories).to.have.length(1);
          expect(memories[0].userId).to.deep.equal(u1._id);
          expect(memories[0].whenDateCreated).to.be.instanceof(Date);
          done();
        });
      });
    });
  });

  describe('.findAll', function(){
    it('should find all memories in the db', function(done){
      var m2 = new Memory({
        userId : u2._id.toString(),
        provider : 'addcontxt',
        title : 'Another Memory',
        who : 'Adam Thede, Nat Webb',
        whatTags : 'coding, sitting',
        whenDateModified : '2014-03-01',
        where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
        why : 'Tests are a good thing.',
        currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
        historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
      });
      m2.insert(function(){
        Memory.findAll(function(memories){
          expect(memories).to.have.length(2);
          done();
        });
      });
    });
  });

  describe('.findByUserAndWhatTag', function(){
    it('should find all memories for a specific user via a selected tag', function(done){
      var m2 = new Memory({
        userId : u2._id.toString(),
        provider : 'addcontxt',
        title : 'Another Memory',
        who : 'Adam Thede, Nat Webb',
        whatTags : 'coding, sitting',
        whenDateModified : '2014-03-01',
        where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
        why : 'Tests are a good thing.',
        currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
        historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
      });
      m2.insert(function(){
        Memory.findByUserAndWhatTag(u1._id.toString(), 'coding', function(memories){
          expect(memories).to.have.length(1);
          done();
        });
      });
    });

    it('should find all memories via a selected tag', function(done){
      var m2 = new Memory({
        userId : u2._id.toString(),
        provider : 'addcontxt',
        title : 'Another Memory',
        who : 'Adam Thede, Nat Webb',
        whatTags : 'coding, sitting',
        whenDateModified : '2014-03-01',
        where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
        why : 'Tests are a good thing.',
        currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
        historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
      });
      m2.insert(function(){
        Memory.findByUserAndWhatTag(u2._id.toString(), 'seed', function(memories){
          expect(memories).to.have.length(0);
          done();
        });
      });
    });
  });

  describe('.find', function(){
    beforeEach(function(done){
      global.nss.db.dropDatabase(function(err, result){
        var memory1 = new Memory({
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
        var memory2 = new Memory({
          userId : u2._id.toString(),
          provider : 'addcontxt',
          title : 'Memory 2',
          who : 'Adam Thede, Nat Webb, Chyld Medford',
          whatTags : 'coding, sitting',
          whenDateModified : '2014-03-01',
          where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
          why : 'Still testing.',
          currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
          historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
        });
        var memory3 = new Memory({
          userId : u3._id.toString(),
          provider : 'addcontxt',
          title : 'Memory 3',
          who : 'Adam Thede, Nat Webb, John Wark',
          whatTags : 'coding, sitting, talking',
          whenDateModified : '2014-03-04',
          where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
          why : 'Wish I was done with testing.',
          currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
          historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
        });
        var memory4 = new Memory({
          userId : u1._id.toString(),
          provider : 'addcontxt',
          title : 'Memory 4',
          who : 'Adam Thede',
          whatTags : 'coding, sitting, philosophizing',
          whenDateModified : '2014-01-01',
          where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
          why : 'All done.',
          currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
          historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
        });
        var memory5 = new Memory({
          userId : u3._id.toString(),
          provider : 'addcontxt',
          title : 'Memory 5',
          who : 'Chyld Medford',
          whatTags : 'talking',
          whenDateModified : '2014-02-10',
          where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
          why : 'Time for a lecture on Node',
          currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
          historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
        });
        var memory6 = new Memory({
          userId : u3._id.toString(),
          provider : 'addcontxt',
          title : 'Memory 6',
          who : 'Chyld Medford',
          whatTags : 'coding, eating',
          whenDateModified : '2014-03-07',
          where : '{"icon":"https://ss1.4sqi.net/img/categories_v2/education/tradeschool_bg_32.png","venuename":"Nashville Software School","venueaddress":"283 Plus Park Blvd","venuecitystate":"Nashville, TN 37217","lat":"36.12472629509965","lng":"-86.72586295481683"}',
          why : 'Subway is delicious',
          currentweather : '{"icon":"http://icons-ak.wxug.com/i/c/k/cloudy.gif","description":"Overcast","feelslike":"63.5 F (17.5 C)"}',
          historicweather : '{"meantemp":"38","maxtemp":"55","mintemp":"21","precip":"T"}'
        });
        memory1.insert(function(){
          memory2.insert(function(){
            memory3.insert(function(){
              memory4.insert(function(){
                memory5.insert(function(){
                  memory6.insert(function(){
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

    it('should find all memories associated with a particular user - page 1, 3 activities per page', function(done){
      var query = {userId:u1._id.toString()};
      Memory.find(query, function(memories){
        expect(memories).to.have.length(2);
        done();
      });
    });

    it('should find all memories tagged coding by u1', function(done){
      var query = {userId:u1._id.toString(), whatTags:'coding'};
      Memory.find(query, function(memories){
        expect(memories).to.have.length(2);
        done();
      });
    });

    it('should find all memories with who by u2', function(done){
      var query = {userId:u2._id.toString(), who:'Nat Webb'};
      Memory.find(query, function(memories){
        expect(memories).to.have.length(1);
        done();
      });
    });

    it('should find all memories via title by u3', function(done){
      var query = {userId:u3._id.toString(), filterName:'title', filterValue:'6'};
      Memory.find(query, function(memories){
        expect(memories).to.have.length(1);
        done();
      });
    });

    it('should find all memories for u3 and limit to 1', function(done){
      var query = {userId:u3._id.toString(), limit:'1'};
      Memory.find(query, function(memories){
        expect(memories).to.have.length(1);
        done();
      });
    });

    it('should find all memories for u3 and limit to 1, page 3', function(done){
      var query = {userId:u3._id.toString(), limit:'1', page:'3'};
      Memory.find(query, function(memories){
        expect(memories).to.have.length(1);
        done();
      });
    });
  });
});
