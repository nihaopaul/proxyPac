
var loki = require("lokijs");

var config = require("../config");
var proxyservers = require("./proxyservers");
var proxyurls = require('./proxyurls');

var DataStore = function() {

  var self = this;
  this.ProxyServers = {};
  this.ProxyURLS = {};
  this.options = config.options;
  this.options.autoloadCallback = function() { self.init(self); }


  this.db = new loki(config.database, this.options);

};

DataStore.prototype = {

  init: function(self) {
    // var self = this;
    console.log("loaded database", this.db.filename);
    this.ProxyServers = new proxyservers(self);
    this.ProxyURLS = new proxyurls(self);
  }

};

DataStore.prototype.index = function(req,res) {
  res.render('api', { title: 'proxyPac' });
};




module.exports = new DataStore();