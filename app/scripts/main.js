'use strict';

var uber = uber || {};

uber.vm = new Vue({
  el: 'body', // give Vue.js the <body> element for context
  data: {
    menuVisible: false,
    hint: '', //tab complete text
    term: '', //filter term
    chosen: '', // chosen movie to show locations
    chosenSet: [], // set of locations for 'chosen' movie
    masterList : [], // list of all movie locations
    titleList : [], // list of distinct movies
    locations: [] // the same a titleList, TODO: research deprecating 
  },
  computed: {
    showEmpty: function() {
      // show 'no results' messaging to user
      return this.locations.length === 0;
    },
  },
  methods: {
    init: function() {
      // get list of locations, pass it to lists for usage
      $.get('https://data.sfgov.org/resource/wwmu-gmzc.json', function(data) {
        uber.vm.masterList = data;
        uber.vm.buildLists();
      });
    },
    buildLists : function() {
      //title list: list for filtering, unique to 'title' field
      uber.vm.titleList = _.uniq(uber.vm.masterList, function(item) { 
        return item.title;
      });
      // can't remember why i did this? ¯\_(ツ)_/¯
      uber.vm.locations = uber.vm.titleList;
    },
    toggleMenu: function() {
      // this function is called from click event, classes are applied /
      // removed based on truthyness of this
      uber.vm.menuVisible = !uber.vm.menuVisible;
    },
    listFilter: function(e) {
      // filter the list of movies whilst user enters text
      var primaryResult; // topmost result
      var primaryResultLower; // lowercased for use in comparisons
      var term = e.target.value.toLowerCase(); //text from input

      // filter movie list
      uber.vm.locations = _.filter(uber.vm.titleList, function(loc) {
        return loc.title.toLowerCase().indexOf(term) > -1;
      });
     
      // logic to display 'hint' text 
      if(uber.vm.locations.length > 0) {
        primaryResult = uber.vm.locations[0].title;
        primaryResultLower = primaryResult.toLowerCase();
        uber.vm.hint = uber.vm.term.length > 0 && primaryResultLower.indexOf(term) === 0 ? primaryResult : '';     
      } else {
        uber.vm.hint = '';
      }
    },
    tabComplete: function() {
      // this is called when user enters 'tab' or right arrow key
      // from input field. The 'hint' becomes the 'term', and passes
      // it on
      if(uber.vm.term.length > 0) {
        uber.vm.term = uber.vm.hint;
        uber.vm.hint = '';
        uber.vm.getLocations(uber.vm.term);
      }
      return false;
    },
    getLocations: function(title) {
      // get all locations for movie
      var querylist;
      uber.markers.clearLayers(); // remove all markers from map
      uber.vm.term = title;
      uber.vm.chosen = title; // set text in input box
      title = title.toLowerCase();

      // filter master list to get all locations for movie
      querylist = _.filter(uber.vm.masterList, function(loc) {
        return loc.title.toLowerCase().indexOf(title) > -1;
      });
     
      // pass to next function to make markers
      uber.vm.fetchMarkers(querylist); 
    },
    fetchMarkers: function (list) {
      var iter;
      _.each(list, function(loc, i) {
        // iter is used to modify the setTimeout length. if loc.coords is present, we can skip the timeouts
        // because we don't have to make api calls.
        iter = loc.coords ? 0 : i;

        setTimeout(function () { // space each request 500ms to remain under max API allowed usage
          var marker;
          
          if(!loc.locations) { // some entries are missing 'location field, which means we can't geolocate it

            // let the user know that there is incomplete data
            alert('Sorry, incomplete data for ' + loc.title);
          } else {

            // keep 'undefined' from rendering in popup
            loc.locations = loc.locations || '';
            loc.fun_facts = loc.fun_facts || '';

            // 2 step async process, get lat longs if needed, then build / place marker.
            async.series([
              // step 1
              function(callback) {
                if(!loc.coords) {
                  // if item doesn't have lat/longs (loc.coords), get them and add it to the object so we dont
                  // need to make api call next time
                  $.get('http://maps.google.com/maps/api/geocode/json?sensor=false&address='+loc.locations+'san francisco ca').done(function(data){
                    loc.coords = data.results[0].geometry.location;
                    callback(null);
                  });
                } else {
                  // we already have lat/longs. move to step 2
                  callback(null);
                }
              },
              // step 2
              function(callback) {
                //create marker (pin) and add it to map
                marker = L.marker([ loc.coords.lat, loc.coords.lng ])
                         .bindPopup('<strong>' + loc.title + '</strong>' + '<br>' + loc.locations + '<br>' + loc.fun_facts);
                uber.markers.addLayer(marker);
              },
            ]);
          }  
        }, 500 * iter);
      });
    }
  }
});



