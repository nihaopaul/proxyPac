var crypto = require('crypto');


var ProxyServers = function(self) {
  this.db = self.db;
  this.table = 'ProxyServers';
  this.handle = this.db.getCollection(this.table);
  this.init();
};

ProxyServers.prototype = {

  createHash: function(data) {
    var shasum = crypto.createHash('sha1', 'utf8');
    shasum.update(data.type + data.address + data.port);
    return shasum.digest('hex');


  },
  init: function() {
    if (this.handle == null) {
      this.handle = this.db.addCollection(this.table);
      console.log('no table setup for: \t', this.table, "\t\t [created]");
    }
  },
  fetchAll: function() {
    return this.db.getCollection(this.table).data;
  },
  validIp: function(address) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)) {
      return true;
    }
    return false;
  },
  validPort: function(portNumber) {
    var port = Number(portNumber);

    if (port > 0 && port <= 65535) {
      return true;
    }
    return false;
  },
  create: function(data) {
    console.log('create', data);

    var payload = {
      type: String(data.type) || '',
      address: String(data.address) || '',
      port: Number(data.port) || null,
      test: data.test || 'false'
    };



    if (payload.type == '') {
      return false;
    }
    if (payload.type != "DIRECT") {
      if (!this.validIp(payload.address)) {
        return false;
      }
      if (!this.validPort(payload.port)) {
        return false;
      }
    }

    //cpu cost saving done here.
    payload.hash = this.createHash(payload);


    if (this.isUnique(payload)){
      return this.handle.insert(payload);
    } else {
      return false;
    }

  },
  isUnique: function(data) {

    var payload = {
      hash: data.hash
    };

    var i = this.handle.findOne(payload);

    //little more logic needed if all we want to do is change the state.
    /*
      if we have a loki ID, we should defintly use it,
      problem is we need to check for conflicts first before reassigning it
    */

    if (i == null) {
      return true;
    } else {
      return false;
    }
  },
  update: function(data) {
    console.log('update:', data);
    if (data.$loki) {
      data.$loki = Number(data.$loki);
    }

    if (data.type == '') {
      console.log('no payload');
      return false;
    }

    data.hash = this.createHash(data);

    if (this.isUnique(data)){
      //here is a funky one, if you read it, and update a property, it saves it back to the database, before calling .update();
      var payload = this.read(data.$loki);
      payload.type = String(data.type) || '';
      payload.address =  String(data.address) || '';
      payload.port = Number(data.port) || null;
      payload.test = data.test || 'false';
      payload.hash = this.createHash(payload);

      return payload;
    } else {
      console.log('was not unique');
      return false;
    }
  },
  read: function(id) {

    var payload = {
      id: id || null
    };

    if (payload.id == null) {
      return false;
    }

    return this.handle.get(Number(payload.id));
  },

  delete: function(obj) {
    this.handle.remove(obj);
    return true;
  }

};




module.exports = ProxyServers;