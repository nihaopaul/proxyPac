"use strict";

var path = require('path');
var fs = require('fs');

var Server = require('../models/server');
var Group  = require('../models/group');
var Url   = require('../models/url');

var ProxyPac = (function() {

  const DATABASE = path.join(__dirname, '../db', 'config.json');
  const LAYOUT = {
    _version: 1,
    servers: [],
    groups: []
  };

  //constructor
  function ProxyPac() {
    this.config = LAYOUT;
    this._load();
  };

  ProxyPac.prototype = {
    _load: function() {
      try {
        this.config = require(DATABASE);
        this._construct();
        console.log('Config: \t', 'Loaded.');
      } catch(e) {
        console.log('Config: \t', e.code);
        this._create();
      }
    },
    _construct: function() {

      let save = false;

      //servers
      for( let i in this.config.servers ){
        this.config.servers[i] = new Server(this.config.servers[i]);
      }
      if (this.config.servers.length === 0) {
        let server = new Server({"type":"DIRECT","name":"Default"});
        this.config.servers.push(server);
        save = true;
      }

      //groups
      for( let i in this.config.groups ){
        this.config.groups[i] = new Group(this.config.groups[i]);
      }
      if (this.config.groups.length === 0) {
        let group = new Group({"name": "Default", "_ID": 1, "_servers": [], "_urls": []});
        this.config.groups.push(group);
        save = true;
      }

      //trigger as we were missing defaults
      if (save) {
        this._save();
      };

    },
    read: function() {
      return this.config;
    },
    update: function() {
      console.log("saving.. not really");
    },
    _create: function() {
      console.log('Config: \t', 'Attempting to save');
      this._construct();
    },
    _save: function() {
      fs.writeFile(DATABASE, JSON.stringify(this.config), (err) => {
        if (err) {
          console.log('Config: \t', 'Failed to save.');
        } else {
          console.log('Config: \t', 'Saved.')
        }

      });
    }
  };

  return ProxyPac;

})();


module.exports = new ProxyPac();