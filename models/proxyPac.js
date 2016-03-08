"use strict";

var path = require('path');
var fs = require('fs');

var Servers = require('../models/servers');
var Groups  = require('../models/groups');

var Url   = require('../models/url');

var ProxyPac = (function() {

  const DATABASE = path.join(__dirname, '../db', 'config.json');
  const SAVEINTERVAL = 60000;
  const LAYOUT = {
    _version: 1,
    servers: [],
    groups: []
  };

  //constructor
  function ProxyPac() {
    this._config = LAYOUT;
    this._load();
    setInterval(
      () => this.save()
    , SAVEINTERVAL);
  };

  ProxyPac.prototype = {
    _load: function() {
      try {
        this._config = require(DATABASE);
        this._construct();
        console.log('Config: \t', 'Loaded.');
      } catch(e) {
        console.log('Config: \t', e.code);
        this._create();
      }
    },
    _construct: function() {
      this.servers = new Servers(this._config.servers);
      this.groups = new Groups(this._config.groups);
      this._save = true;
    },

    read: function() {
      return this._config;
    },
    update: function() {
      console.log("saving.. not really");
    },
    _create: function() {
      console.log('Config: \t', 'Attempting to save');
      this._construct();
    },
    save: function() {
      if (this._save) {
        this._save = false;
        this._config.servers = this.servers.get();
        this._config.groups = this.groups.get();

        fs.writeFile(DATABASE, JSON.stringify(this._config), (err) => {
          if (err) {
            console.log('Config: \t', 'Failed to save.');
          } else {
            console.log('Config: \t', 'Saved.')
          }

        });
      }

    }
  };

  return ProxyPac;

})();


module.exports = new ProxyPac();