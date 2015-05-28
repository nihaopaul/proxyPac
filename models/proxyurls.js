var proxyurls = function(self) {
  this.db = self.db;
  this.table = 'ProxyURLS';
  this.handle = this.db.getCollection(this.table);
  this.init();
};

proxyurls.prototype = {

  init: function() {
    if (this.handle == null) {
      this.handle = this.db.addCollection(this.table);
      console.log('no table setup for: \t', this.table, "\t\t [created]");
    }

  },

};


module.exports = proxyurls;