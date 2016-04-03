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
    findServerByID: function(ID) {
      for (let i in this.servers) {
        if (this.servers[i]._id == ID) {
          return this.servers[i];
        }
      }
      return {};
    },
    get: function() {
      return this.servers;
    },
    create: function(obj) {
      // @type:  HTTP,HTTPS,SOCKS4,SOCKS5,DIRECT
      // @name: 'random name'
      // @port: 8080
      // @server: 'idealy an ip address'
      let server = new Server(obj);
      this.servers.push(server);
    },

  };


  return Servers;

})();


module.exports = Servers;