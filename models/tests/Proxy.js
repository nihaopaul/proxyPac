
var config = require('../../config');
var http = require('http');

var Proxy = function(json) {

  this.data = json;
  this.state = false;
  this.options = {
    proxy: {
      ipaddress: this.data.address, // Random public proxy
      port: this.data.port
    },
    target: {
      host: config.test.url, // can be an ip address or domain (4a and 5 only)
      port: config.test.port
    },
    command: 'connect',  // This defaults to connect, so it's optional if you're not using BIND or Associate.
    timeout: config.timeout //max open time
  };


};
Proxy.prototype = {
  get: function(callback) {
    var self = this;

    require('proxy-out')('http://'+this.options.proxy.ipaddress+':'+this.options.proxy.port);

    http.get("http://"+this.options.target.host+":"+this.options.target.port+"/", function(response){

      response.on('data', function(d) {
        self.state = true;
        switch (response.statusCode) {
          case 400:
            callback(false);
            break;
          default:
            callback(true);
        }

      });
      response.on('end', function() {
        if (!self.state) {
          callback(false);
        }
      });

    }).on('error', function(e) {
      callback(false);
    });

  }
};

module.exports = Proxy;

