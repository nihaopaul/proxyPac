/***
 * Server represents a readonly object returning the latest details
 ***/
"use strict";

var proxyType = [];
proxyType['SOCKS4'] = require("./test.socks4");
proxyType['SOCKS5'] = require("./test.socks5");
proxyType['HTTP'] = require("./test.http");
proxyType['HTTPS'] = require("./test.https");
proxyType['DIRECT'] = require("./test.direct");
// proxyType['HTTPS'] = require("./test.socks5");


var Server = (function() {

  const OFFLINE = false;
  const ONLINE = true;
  const DEFAULTS = {
    type: 'DIRECT', // HTTP,HTTPS,SOCKS4,SOCKS5,DIRECT
    name: 'default',
    port: 8080,
    server: '127.0.0.1'
  };

  //constructor
  function Server(name, type, server, port) {

    this.type = type || DEFAULTS.type;
    this.name = name || DEFAULTS.name;
    this.port = port || DEFAULTS.port;
    this.server = server || DEFAULTS.server;
    this.status = OFFLINE;
    //run the proxy test
    setInterval(
      () => this._test()
    , 5000);

  };

  Server.prototype = {
    _test: function() {
      var type = new proxyType[this.type](this.server, this.port, (err, value)  => {
        if (err) {
          this.status = OFFLINE;
        } else {
          this.status = ONLINE;
        }
      });
    }
  };

  return Server;

})();


module.exports = Server;
