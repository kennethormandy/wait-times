var domready = require('domready');
var fastClick = require('fastclick');
var dug = require('Dug.js');

domready(function () {
  fastClick.attach(document.body);
})
