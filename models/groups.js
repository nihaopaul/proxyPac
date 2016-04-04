"use strict";

var Group = require('../models/group');


var Groups = (function() {

  //constructor - expose only what you need to stringify..
  function Groups(group_config) {
    this._constructor(group_config);
  };

  Groups.prototype = {
    _constructor: function(group_config) {
      this.groups = [];

      //groups
      for( let i in group_config ){
        this.groups.push(new Group(group_config[i]));
      }
      if (this.groups.length === 0) {
        let group = new Group({"name": "Default", "_id": 1, "_servers": ['Default'], "_urls": []});
        this.groups.push(group);
      }
    },
    get: function() {
      return this.groups;
    },
    findGroupByName: function(name) {
      for (let i in this.groups) {
        if (this.groups[i].name === name) {
          return this.groups[i];
        }
      }
      return {};
    },
    findGroupByID: function(id) {

      for (let i in this.groups) {
        if (this.groups[i]._id == id) {
          return this.groups[i];
        }
      }
      return {};
    }

  };


  return Groups;

})();





module.exports = Groups;