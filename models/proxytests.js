var Proxy = require('./tests/Proxy'),
    Socks = require('./tests/Socks'),
    Socks5= require('./tests/Socks5');


var Test = function() {
  this.DB = require('./db');
  this.testFrequency = 1000 * 6 * 1; //10 minutes
  this.proxyServersJSON = [];
  var self = this;
  this.timer = setInterval(function() {
    self.run();
  }, this.testFrequency);

};

Test.prototype = {
  run: function() {
    var self = this;
    this.proxyServersJSON = this.DB.ProxyServers.fetchAllTestable();
    this.proxyServersJSON.forEach(function(item, index) {
      self.tester(item);
    });
    // console.log(this.proxyServers);
  },
  tester: function(json) {
    var self = this;
    var state;

    switch (json.type) {
      case 'PROXY':
        state = new Proxy(json);
        break;
      case 'SOCKS5':
        state = new Socks5(json);
        break;
      case 'SOCKS':
        state = new Socks(json);
        break;
    }
    state.get(function(response) {

      if (response) {
        if (!json.status || json.status == "offline") {
          self.DB.ProxyServers.setStatus(json.$loki, "online");
        }
      } else {
        if (!json.status || json.status == "online") {
          self.DB.ProxyServers.setStatus(json.$loki, "offline");
        }
      }
    });
  }
};

module.exports = new Test;