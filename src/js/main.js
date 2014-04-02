var request = require('reqwest');
var domready = require('domready');
var attachFastClick = require('fastclick');
var Vue = require('vue');
var vueTouch = require('vue-touch');

Vue.use(vueTouch);
var vm = new Vue({

    el: '#main',

    data: {
      key: 'wait',
      reverse: false,
      location: false,
      offline: Offline.state,
      apiURL: 'http://www.kimonolabs.com/api/cutenv2y?apikey=4082701fda5e9ac55d10add137718ea6&callback=kimonoCallback',
      localURL: 'js/data.json'
    },

    created: function() {
      console.log(this.offline);
      attachFastClick(document.body);
      if(this.offline === 'up') {
        this.fetchData(this.apiURL);
      } else {
        this.fetchData(this.localURL)
      }
    },

    methods: {
      fetchData: function(url) {
        var self = this;
        request({
          url: url,
          type: 'jsonp',
          jsonpCallback: 'callback',
          jsonpCallbackName: 'kimonoCallback',
          success: function(resp) {
            self.items = resp.results.data;
            self.items.forEach(function(h, i) {
              h.name = h.hTitle.text.replace('\'', '’');
              h.id = h.hTitle.href.split('rid=')[1];
              h.hours = h.hTimeOne.alt.toString() + h.hTimeTwo.alt.toString();
              h.minutes = h.hTimeThree.alt.toString() + h.hTimeFour.alt.toString();
              h.wait = h.hours + ':' + h.minutes;
              if(h.hDetails) {
                h.details = h.hDetails;
              }
              if(h.details && h.details.indexOf('This location is in ') !== -1) {
                h.address = h.name + ', ' + h.details.split('This location is in ')[1] + ', AB, Canada';
              } else if(h.name.split(' Community')[0] === 'Leduc') {
                h.address = h.name + ', Leduc, AB, Canada';
                h.details = 'This location is in Leduc';
              } else if(h.name.split(' Community')[0] === 'Fork Sask') {
                h.address = h.name + ', Fort Saskatchewan, AB, Canada';
                h.details = 'This location is in Fort Saskatchewan';
              } else {
                h.address = h.name + ', Edmonton, AB, Canada';
              }
            });
          }
        })
      },

      rank: function(msg, e) {
        e.targetVM.key = msg;
      },

      locate: function(e) {
        findMyLocation(e.targetVM.location, e.targetVM.$data.items, function(e) {
          alert(e);
        });
        // Should wait until findMyLocation is done
        e.targetVM.rank('distance', e);
      }

    }

});

function findMyLocation(location, items) {

  var edmonton = new google.maps.LatLng(53.544389, -113.490927);
  var browserSupportFlag = new Boolean();

  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      // map.setCenter(location);
      findMyDistanceList(location, items);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert('Geolocation service failed. Sorting by distance from downtown Edmonton instead.');
      location = edmonton;
    } else {
      alert('Sorry, your device does not support geolocation. Sorting by distance from downtown Edmonton instead.');
      location = edmonton;
    }
    map.setCenter(initialLocation);
  }

}

function findMyDistanceList(from, items) {
  var geocoder = new google.maps.Geocoder();
  var service = new google.maps.DistanceMatrixService();
  var myOptions = {
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

  items.forEach(function(h, i) {
    service.getDistanceMatrix({
      origins: [from],
      destinations: [h.address],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function (response, status) {
      if (status != google.maps.DistanceMatrixStatus.OK) {
        alert('Error was: ' + status);
      } else {
        h.distance = response.rows[0].elements[0].duration.value;
        h.duration = response.rows[0].elements[0].duration.text;
      }
    });

  });

}
