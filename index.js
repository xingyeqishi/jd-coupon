var getTicket = require('./lib/getTicket');
var config = require('./config');

var timer;

config.forEach(function(item) {
  getTicket(item, item.csUrl);
});

timer = setInterval(function() {
  config.forEach(function(item) {
    if (new Date().getTime() + 5000 > new Date(item.beginTime).getTime()) {
      getTicket(item, item.csUrl);
    } else {
      console.log('time is not reached');
    }
  });
}, 1000);
