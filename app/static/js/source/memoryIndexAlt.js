/* jshint camelcase:false */
/* global google:true */

(function(){

  'use strict';

  $(document).ready(initialize);

  var memoriesMap;
  var coordinates;
  var markers = [];
  var query = {limit:5, page:1, direction:1};

  function initialize(){
    prepareMap();
    $('#sortable').on('click', '.sort', sortMemories);
    $('#memorydisplay').on('click', '.filter', filterMemories);
    $('#prev').click(clickPrev);
    $('#next').click(clickNext);
    $('#clearFilters').click(clearFilter);
    getAllMemories();
  }

// ---------------------------------------- MAP STUFF --------------------------------------- //

  function prepareMap(){
    coordinates = $('#coordinates').text();
    coordinates = coordinates.split(',|,');
    var item;
    var newCoordinates = [];
    for(var i = 0; i < coordinates.length; i++){
      item = coordinates[i].split(',');
      newCoordinates.push(item);
    }
    console.log(newCoordinates);
    populateMap(newCoordinates);
  }

  function populateMap(coordinates){
    var position;
    var marker;
    var zoom = 10;
    var mapOptions = {center: new google.maps.LatLng(coordinates[0][0], coordinates[0][1]), zoom:zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
    memoriesMap = new google.maps.Map(document.getElementById('memoriesMap'), mapOptions);
    var infowindow = new google.maps.InfoWindow();
    for(var i = 0; i < coordinates.length; i++){
      position = new google.maps.LatLng(coordinates[i][0], coordinates[i][1]);
      marker = new google.maps.Marker({map:memoriesMap, position:position, title:coordinates[i][2]});
      google.maps.event.addListener(marker, 'mouseover', (function(marker, i){
        return function(){
          infowindow.setContent(coordinates[i][2]);
          infowindow.open(memoriesMap, marker);
        };
      })(marker, i));
      google.maps.event.addListener(marker, 'mouseout', function(){
        infowindow.close();
      });
      markers.push(marker);
    }
  }

// ---------------------------------------- POPULATING MEMORIES TO THE PAGE --------------------------------------- //

  function clearFilter(){
    query = {limit:5, page:1, direction:1};
    generateQuery();
  }

  function sortMemories(){
    if($(this).hasClass('memoryindextitle')){
      query.sort = 'title';
    }else{
      query.sort = 'whenDateCreated';
    }
    query.limit = $('#limit').val() * 1 || query.limit;
    query.direction *= -1;
    generateQuery();
  }

  function filterMemories(event){
    if($(this).hasClass('individualindex')){
      query.filterName = 'who';
      query.filterValue = $(this).text();
    }else if($(this).hasClass('tags')){
      query.filterName = 'whatTags';
      query.filterValue = $(this).text();
    }
    query.limit = $('#limit').val() * 1 || query.limit;
    generateQuery();
    console.log(query);
    event.preventDefault();
  }

  function clickPrev(){
    if(query.page > 1){
      query.page--;
    }
    query.limit = $('#limit').val() * 1 || query.limit;
    generateQuery();
  }

  function clickNext(){
    if($('#memorydisplay > div').length < $('#limit').val()){
      return;
    }else{
      query.page++;
      query.limit = $('#limit').val() * 1 || query.limit;
      generateQuery();
    }
  }

  function generateQuery(){
    var url = '/find';
    var data = query;
    var type = 'GET';
    var success = addMemoriesToDom;

    $.ajax({data:data, url:url, type:type, success:success});
  }

  function getAllMemories(){
    var url = '/find';
    var type = 'GET';
    var success = addMemoriesToDom;

    $.ajax({url:url, type:type, success:success});
  }

  function addMemoriesToDom(payload){
    $('#memorydisplay').empty();

    for(var i = 0; i < payload.memories.length; i++){
      addMemoryToDom(payload.memories[i]);
    }
  }

  function addMemoryToDom(memory){
    var $1div = $('<div>').addClass('row');
    var $2div = $('<div>').addClass('small-12').addClass('columns').addClass('containerindex');

    var $3div = $('<div>').addClass('row').addClass('displaybreakindex');

    var $4a = $('<a class="small-6 columns" href="/memory/' + memory._id.toString() + '"/>');
    var $5h4 = $('<h4>').addClass('memoryindextitle').addClass('sort');
    if(memory.title.length > 30){
      $5h4.text(memory.title.slice(0,30).toUpperCase()+'...');
    }else{
      $5h4.text(memory.title.toUpperCase());
    }
    $4a.append($5h4);

    var $6div = $('<div>').addClass('small-6').addClass('columns');
    var $7h4 = $('<h4>').addClass('indextime');
    if(memory.whenDateModified){
      $7h4.text(moment(memory.whenDateModified).format('ddd MMM Do, YYYY, h:mm a'));
    }else{
      $7h4.text(moment(memory.whenDateCreated).format('ddd MMM Do, YYYY, h:mm a'));
    }
    $6div.append($7h4);

    $3div.append($4a, $6div);

    var $8div = $('<div>').addClass('displaybreak').addClass('row');
    var $9div = $('<div>').addClass('small-4').addClass('columns').addClass('memorywhyindex');
    var $10div = $('<div>');
    if(memory.selfie){
      $10div.css('background-image', 'url('+memory.selfie+')').addClass('memoryselfieindex');
    }
    var $11h4 = $('<h4>').text('why');
    var $12div = $('<div>').text(memory.why.slice(0,300)+'...');
    $9div.append($10div, $11h4, $12div);

    var $13div = $('<div>').addClass('small-4').addClass('columns');
    var $14h4 = $('<h4>').text('who');
    $13div.append($14h4);

    for(var i = 0; i < memory.who.length; i++){
      var who = memory.who[i];
      $13div.append('<button class="tiny radius individualindex filter">'+who+'</button>');
    }

    var $15h4 = $('<h4>').text('what');
    $13div.append($15h4);

    for (var j = 0; j < memory.whatTags.length; j++){
      var tag = memory.whatTags[j];
      $13div.append('<span class="tags filter">'+tag+'</span>');
    }

    var $135br = $('<label>').html('&nbsp;');
    $13div.append($135br);

    var $18div = $('<div>').addClass('small-4').addClass('columns');
    if(memory.where){
      var $185br = $('<br>');
      var $19img = $('<img>').addClass('memorymap').attr('src', 'http://maps.googleapis.com/maps/api/staticmap?center='+memory.where.lat+','+memory.where.lng+'&zoom=15&size=400x200&markers=color:blue%7C'+memory.where.lat+','+memory.where.lng+'&sensor=false&key=AIzaSyD7SHoaSpx_SkDf3Qr3MSza5U3qtnEhATw');
      var $20ul = $('<ul>').addClass('activitydata').addClass('activityoverlay');
      var $21li = $('<li>').addClass('venuename').attr('id', 'venuename').text(memory.where.venuename);
      var $22li = $('<li>').text(memory.where.venueaddress);
      var $23li = $('<li>').text(memory.where.venuecitystate);
      $20ul.append($21li, $22li, $23li);
      $18div.append($185br, $19img, $20ul);
    }
    if(memory.historicweather){
      var $24span = $('<span>').addClass('activitydata').text('Mean temp: '+memory.historicweather.meantemp);
      var $25span = $('<span>').addClass('activitydata').text(', Max temp: '+memory.historicweather.maxtemp);
      var $26span = $('<span>').addClass('activitydata').text(', Min temp: '+memory.historicweather.mintemp);
      var $27span = $('<span>').addClass('activitydata').text(', Total Precipitation: '+memory.historicweather.precip);
      $18div.append($24span, $25span, $26span, $27span);
    }else if(memory.currentweather){
      var $28div = $('<div>');
      var $29img = $('<img>').addClass('weathericon').attr('src', memory.currentweather.icon);
      var $30span = $('<span>').addClass('activitydata').text(memory.currentweather.description+', felt like ');
      var $31span = $('<span>').addClass('activitydata').text(memory.currentweather.feelslike);
      $18div.append($28div, $29img, $30span, $31span);
    }

    $8div.append($9div, $13div, $18div);

    $2div.append($3div, $8div);


    var $32div = $('<div>').addClass('row');
    var $33br = $('<label>').html('&nbsp;');
    var $34div = $('<div>').addClass('small-12').addClass('columns');
    if(memory.photos){
      if(memory.photos.length > 4){
        for(var k = 0; k < 4; k++){
          var photo1 = memory.photos[k];
          $34div.append('<img class="memoryphotosindex" src="'+photo1+'">');
        }
      }else if(memory.photos.length > 0){
        for(var z = 0; z < memory.photos.length; z++){
          var photo2 = memory.photos[z];
          $34div.append('<img class="memoryphotosindex" src="'+photo2+'">');
        }
      }
    }
    $32div.append($33br, $34div);
    $2div.append($32div);

    $1div.append($2div);

    $('#memorydisplay').append($1div);
  }

})();
