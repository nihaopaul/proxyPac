/***
 * Test
 ***/
"use strict";

var url = require('url');
var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');

var Test = (function() {

  //constructor
  function Test(address, port, callback) {
    var options = {
      proxy: {
        ipaddress: address, // Random public proxy
        port: port,
      },
      target: {
        host: "www.google.com", // can be an ip address or domain (4a and 5 only)
      }
    };

    // HTTP/HTTPS proxy to connect to
    var proxy = `http://${options.proxy.ipaddress}:${options.proxy.port}`;

    // HTTPS endpoint for the proxy to connect to
    var endpoint = `https://${options.target.host}`;

    var opts = url.parse(endpoint);

    // create an instance of the `HttpsProxyAgent` class with the proxy server information
    var agent = new HttpsProxyAgent(proxy);
    opts.agent = agent;

    https.get(opts, (res) => {

      res.on('data', (d) => {
        clearTimeout(timeout);
        return callback(false, d);
      });

    }).on('error', (e) => {
      clearTimeout(timeout);
      return callback(true, e);
    });
    var timeout = setTimeout(() => callback(true, 'timed out'), 5000);

  };

  return Test;

})();

module.exports = Test;