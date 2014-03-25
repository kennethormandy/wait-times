var request = require('browser-request');
var domready = require('domready');
var attachFastClick = require('fastclick');
var Vue = require('vue');

// var apiURL = 'http://www.kimonolabs.com/api/cutenv2y?apikey=4082701fda5e9ac55d10add137718ea6&callback=kimonoCallback';
var apiURL = 'js/data.json';

var render = new Vue({

    el: '#main',

    data: {
      field: 'hTitle'
    }

    created: function () {
      this.ascending = {}
      this.$watch('sort', function () {
        this.fetchData()
      })
    },

    methods: {
      fetchData: function () {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.open('GET', apiURL)
        xhr.onload = function () {
          self.hospitals = JSON.parse(xhr.responseText).results.data;
        }
        xhr.send()
      }
    }

});

domready(function () {
  attachFastClick(document.body);
});
