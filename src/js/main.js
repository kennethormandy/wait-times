var request = require('browser-request');
var domready = require('domready');
var attachFastClick = require('fastclick');
var Vue = require('vue');

// var apiURL = 'http://www.kimonolabs.com/api/cutenv2y?apikey=4082701fda5e9ac55d10add137718ea6&callback=kimonoCallback';
var apiURL = 'js/data.json';

var vm = new Vue({

    el: '#main',

    data: {
      key: 'wait',
      reverse: false
    },

    created: function () {
      this.fetchData()
    },

    methods: {
      fetchData: function () {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.open('GET', apiURL);
        xhr.onload = function () {
          self.items = JSON.parse(xhr.responseText).results.data;
          self.items.forEach(function(h, i) {
            h.title = h.hTitle.text;
            h.id = h.hTitle.href.split('rid=')[1];
            h.hours = h.hTimeOne.alt.toString() + h.hTimeTwo.alt.toString();
            h.minutes = h.hTimeThree.alt.toString() + h.hTimeFour.alt.toString();
            h.wait = h.hours + ':' + h.minutes;
            h.details = h.hDetails;
          });
        }
        xhr.send();
      },

      sort: function (msg, e) {
        e.targetVM.key = msg;
      },


    }

});

domready(function () {
  attachFastClick(document.body);
});
