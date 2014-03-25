var domready = require('domready');
var attachFastClick = require('fastclick');

dug({
  endpoint: 'http://www.kimonolabs.com/api/cutenv2y?apikey=4082701fda5e9ac55d10add137718ea6',
  target: 'main',
  error: function(e){
    console.log(e);
  },
  beforeRender: function(pre){
    console.log(name);
  },
  template: '<div>{{lastsuccess}}</div>\
            <ul class="hList">\
              {{#data}}\
              <li class="hItem" data-heat="{{hTimeTwo.alt}}">\
                <a class="hLink" href="{{hTitle.href}}">\
                  <time class="hTime">{{value.hTimeOne.alt}}{{hTimeTwo.alt}}:{{hTimeThree.alt}}{{hTimeFour.alt}}</time>\
                  <div class="hContent"><h2 class="hTitle">{{hTitle.text}}</h2>\
                    <h3>{{data.login}}</h3>\
                    <span class="hDetails">{{hDetails}}</span>\
                  </div>\
                </a>\
              </li>\
              {{/data}}\
            </ul>'
});

domready(function () {
  attachFastClick(document.body);
});
