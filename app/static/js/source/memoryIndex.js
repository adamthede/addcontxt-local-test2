/* jshint camelcase:false */
/* global google:true */

(function(){

  'use strict';

  $(document).ready(initialize);

  var memoriesMap;
  var coordinates;
  var markers = [];

  function initialize(){
    prepareMap();
  }

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
    var zoom = 6;
    var mapOptions = {center: new google.maps.LatLng(coordinates[0][0], coordinates[0][1]), zoom:zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
    memoriesMap = new google.maps.Map(document.getElementById('memoriesMap'), mapOptions);
    for(var i = 0; i < coordinates.length; i++){
      position = new google.maps.LatLng(coordinates[i][0], coordinates[i][1]);
      marker = new google.maps.Marker({map:memoriesMap, position:position, title:coordinates[i][3]});
      markers.push(marker);
    }
  }
})();
