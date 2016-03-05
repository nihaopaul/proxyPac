/***
 * Test
 ***/
"use strict";

var Socks = require('socks');

var Test = (function() {

  //constructor
  function Test(address, port, callback) {
    var options = {
      proxy: {
        ipaddress: address, // Random public proxy
        port: port,
        type: 4
      },
      target: {
        host: "google.com", // can be an ip address or domain (4a and 5 only)
        port: 80
      }
    };

    Socks.createConnection(options, function(err, socket, info) {
      if (err)
        return callback(true, err);
      else {
        // Connection has been established, we can start sending data now:
        socket.write(`GET / HTTP/1.1\nHost: ${options.target.host}\n\n`);
        socket.on('data', function(data) {
          return callback(false, data);
        });

        // PLEASE NOTE: sockets need to be resumed before any data will come in or out as they are paused right before this callback is fired
        socket.resume();
      }
    });

  };

  return Test;

})();

module.exports = Test;