(function () {
  'use strict';

  describe('Renders a homepage', function () {
 // inject the HTML fixture for the tests

  beforeEach(function(){
    //map container
    var map;
    var movieList;

    map = $('<div id="container"></div>');
    $(document.body).append(map);


    movieList = $('<ul class="movies"><li class="no-match" v-if="showEmpty">0 matches found</li>' +
                 '<li v-for="location in locations">' +
                 '<a class="locations" href="#" v-on:click="getLocations(location.title)">{{ location.title}}</a>' +
                 '</li></ul>');
    $(document.body).append(movieList);
    
    
    // JS from index.js
    // This is the worst.
    uber.vm.init();
    uber.vm.locations = [{title:'Movie 1'}, {title:'Movie 2'}];
    uber.map = L.map('container', {'attributionControl': false, 'zoomControl': false}).setView([37.7833, -122.4166], 13);
    uber.markers = new L.FeatureGroup();
    uber.map.addLayer(uber.markers);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 18,
      id: 'tomwolber.olfpe5d9', 
      accessToken: 'pk.eyJ1IjoidG9td29sYmVyIiwiYSI6ImNpajU2anBqYjAwNHh1cmtyeXl0czhxNGIifQ.eqwWsJQ5F07qBP-0nMjvIA'
    }).addTo(uber.map);

    new L.Control.Zoom({ position: 'bottomright' }).addTo(uber.map);
  });

  afterEach(function(){
    uber.map.remove();
  });

  describe('it should render a few things', function () {
      it('should render a map', function () {
        var genMap = $('.leaflet-container'); 
        expect(genMap.length === 1).toBe(true);
      });
    });
  });

})();
