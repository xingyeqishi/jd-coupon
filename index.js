var getTicket = require('./lib/getTicket');
var config = require('./config');

var timer;

config.forEach(function(item) {
  getTicket(item, item.url);
});

timer = setInterval(function() {
  config.forEach(function(item) {
    if (new Date().getTime() + 5000 > new Date(item.beginTime).getTime()) {
      getTicket(item, item.url);
    } else {
      console.log('time is not reached');
    }
  });
}, 1000);
