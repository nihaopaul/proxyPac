/***
 * Group represents a readonly object returning the latest details
 ***/
"use strict";

var Group = (function() {

  const DEFAULTS = {
    name: 'DIRECT', // HTTP,HTTPS,SOCKS4,SOCKS5,DIRECT
    _ID: 1,
    _servers: [],
    _urls: []
  };
  //constructor
  function Group(obj) {
    this.name     = obj.name      || DEFAULTS.name;
    this._ID      = obj._ID       || DEFAULTS._ID;
    this._servers = obj._servers  || DEFAULTS._servers;
    this._urls    = obj._urls     || DEFAULTS._urls;
  };

  Group.prototype = {

  };

  return Group;

})();


module.exports = Group;
