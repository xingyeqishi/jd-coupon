var request = require('superagent');
var utf8 = require('utf8');
var fs = require('fs');
var cheerio = require('cheerio')
var colors = require('colors');

var config = require('./config');

var timer;
String.prototype.padEnd = function(len, fillStr) {
  var curStr = String(this);
  if (curStr.length < len) {
    return curStr + fillStr.repeat(len - curStr.length);
  }
  return curStr;
}

function getTicket(item, url) {
  request.get(url)
  .withCredentials()
  .set('Cookie', item.cookie)
  .set('Accept-Language', 'zh-CN,zh;q=0.8')
  .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36')
  .end(function(err, res) {
    if (err) {
      console.error(err);
      return;
    }
    if (res) {
    var $ = cheerio.load(res.text, {decodeEntities: false});

    try {
      let result = $('.content').text().trim();
      if (result.indexOf(100) !== -1) {
        console.log(colors.yellow('Congratulate for ' + item.user + ':' + result));
      } else {
        console.log(colors.gray(item.user.padEnd(10, '*') + ':' + result));
      }
    } catch(e) {
      console.error(colors.blue(e));
    }
  }
  });
}
config.forEach(function(item) {
  getTicket(item, item.csUrl);
  getTicket(item, item.syUrl);
});

timer = setInterval(function() {
      var leftUsers = config.filter(function(item) {
        return !item.goted;
      });
      if (leftUsers.length === 0) {
        console.log(colors.red('congratulations for everybody ^_^'));
        clearInterval(timer);
        return;
      }
      config.forEach(function(item) {
        if (!item.goted) {
          if (new Date().getTime() + 5000 > new Date(item.beginTime).getTime()) {
            getTicket(item, item.csUrl);
            getTicket(item, item.syUrl);
          } else {
            console.log('time is not reached');
          }
        }
      });
}, 1000);
