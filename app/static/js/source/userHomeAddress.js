/* jshint camelcase:false */
/* global google:true */

(function(){

  'use strict';

  $(document).ready(initialize);

  var lat;
  var lng;
  var currentLat;
  var currentLng;
  var homeMap;
  var currentMap;
  var markers = [];
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var distanceMap;

  function initialize(){
    if($('#homeMap').length > 0){
      prepareMap();
      getLocation();
    }
    $('#enterHomeAddress').click(enterHomeAddress);
  }

  function enterHomeAddress(event){
    var address = $('input[name="homeAddress"]').val();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:address}, function(results, status){
      var name = results[0].formatted_address;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();

      $('input[name="homeAddress"]').val(name);
      $('input[name="lat"]').val(lat);
      $('input[name="lng"]').val(lng);
      $('form').submit();
    });

    event.preventDefault();
  }

  function prepareMap(){
    lat = $('#lat').text() * 1;
    lng = $('#lng').text() * 1;
    initMap(lat, lng, 15, 'Home');
  }

  function initMap(lat, lng, zoom, venuename){
    var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
    homeMap = new google.maps.Map(document.getElementById('homeMap'), mapOptions);
    var loca = {lat:lat, lng:lng, title:venuename};
    addMarker(loca, homeMap);
  }

  function addMarker(loca, map){
    var position = new google.maps.LatLng(loca.lat, loca.lng);
    var marker = new google.maps.Marker({map:map, position:position, title:loca.venuename});
    markers.push(marker);
  }

  function getLocation(){
    var geoOptions = {enableHighAccuracy: true, maximumAge: 1000, timeout: 60000};
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  function geoError() {
    console.log('Sorry, no position available.');
  }

  function geoSuccess(location){
    currentLat = location.coords.latitude;
    currentLng = location.coords.longitude;
    initCurrentMap(currentLat, currentLng, 15, 'Current Location');
  }

  function initCurrentMap(currentLat, currentLng, zoom, venuename){
    var mapOptions = {center: new google.maps.LatLng(currentLat, currentLng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
    currentMap = new google.maps.Map(document.getElementById('currentMap'), mapOptions);
    var loca = {lat:currentLat, lng:currentLng, title:venuename};
    addMarker(loca, currentMap);
    getDirections(lat, lng, currentLat, currentLng);
  }

  function getDirections(lat, lng, currentLat, currentLng){
    var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom:7};
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    distanceMap = new google.maps.Map(document.getElementById('distanceMap'), mapOptions);
    directionsDisplay.setMap(distanceMap);
    var start = lat+','+lng;
    var end = currentLat+','+currentLng;
    var request = {origin:start, destination:end, travelMode: google.maps.TravelMode.DRIVING};
    directionsService.route(request, function(response, status){
      if(status === google.maps.DirectionsStatus.OK){
        directionsDisplay.setDirections(response);
      }
    });
  }

})();
