var loki = require("lokijs");


var config = require("../config");


var DataStore = function() {
  var self = this;


  this.db = new loki(config.database, {
    autosave: true,
    autosaveInterval: 60000,
    autoload: true,
    autoloadCallback : self.init()
  });


  // this.children = this.db.addCollection('children');
  // this.children.insert({name:'Sleipnir', legs: 8});
  // this.init();

};

DataStore.prototype = {

  init: function() {
    console.log(this.db);
    var self = this;
    // this.db.saveDatabase();
    try {
      var coll = self.db.getCollection('test');
      console.log(coll);
    } catch (e) {
      console.log(e);
      var test = self.db.addCollection('test');
      test.insert({name: 'paul', age: 32});
    }


  },
};



var i = new DataStore();
module.exports = i;