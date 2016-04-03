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


var Server = (function() {

  const OFFLINE = false;
  const ONLINE = true;
  const TESTINTERVAL = 5000;
  const DEFAULTS = {
    type: 'DIRECT', // HTTP,HTTPS,SOCKS4,SOCKS5,DIRECT
    name: 'default',
    port: undefined,
    server: undefined
  };

  //constructor - expose only what you need to stringify..
  function Server(obj) {
    this._id = Math.round(Math.random() * 1000000000);
    this.type = obj.type || DEFAULTS.type;
    this.name = obj.name || DEFAULTS.name;
    this.port = obj.port || DEFAULTS.port;
    this.server = obj.server || DEFAULTS.server;
    //test type is correct
    if (!proxyType[this.type]) {
      this.type = DEFAULTS.type;
    }
    //run the proxy test, does not expose to stringify
    setInterval(
      () => this._test()
    , TESTINTERVAL);

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
