var Socks = require('socks');
var config = require('../../config');


var Socks5 = function(json) {
  this.data = json;
  this.state = false;
  this.options = {
    proxy: {
      ipaddress: this.data.address, // Random public proxy
      port: this.data.port,
      type: 5 // type is REQUIRED. Valid types: [4, 5]  (note 4 also works for 4a)
    },
    target: {
      host: config.test.url, // can be an ip address or domain (4a and 5 only)
      port: config.test.port
    },
    command: 'connect',  // This defaults to connect, so it's optional if you're not using BIND or Associate.
    timeout: config.timeout //max open time
  };


};
Socks5.prototype = {
  get: function(callback) {
    var self = this;
    Socks.createConnection(this.options, function(err, socket, info) {

      if (err)
        return callback(false);
      else {
        // Connection has been established, we can start sending data now:
        socket.write("GET / HTTP/1.1\nHost: "+self.options.target.host+"\n\n");
        socket.on('data', function(data) {
          self.state = true;
          return callback(true);
        });
        socket.on('close', function(e) {
          if (!self.state) {
            return callback(false);
          }

        });
        socket.resume();

      }
    });

  }
};

module.exports = Socks5;