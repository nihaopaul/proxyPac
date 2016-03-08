"use strict";

var Server = require('../models/server');


var Servers = (function() {


  //constructor - expose only what you need to stringify..
  function Servers(server_config) {
    this._constructor(server_config);
  };

  Servers.prototype = {
    _constructor: function(server_config) {
      this.servers = [];

      //servers
      for( let i in server_config ){
        this.servers.push(new Server(server_config[i]));
      };
      if (this.servers.length === 0) {
        let server = new Server({"type":"DIRECT","name":"Default"});
        this.servers.push(server);
      };
    },
    findServerByName: function(name) {
      for (let i in this.servers) {
        if (this.servers[i].name === name) {
          return this.servers[i];
        }
      }
      return {};
    },
    get: function() {
      return this.servers;
    },

  };


  return Servers;

})();





module.exports = Servers;