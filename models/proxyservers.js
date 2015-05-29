var sha1 = require('sha1');

var ProxyServers = function(self) {
  this.db = self.db;
  this.table = 'ProxyServers';
  this.handle = this.db.getCollection(this.table);
  this.init();
};

ProxyServers.prototype = {

  createHash: function(data) {
    return sha1(data.type +''+ data.address +''+ data.port);
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
  fetchAllTestable: function() {
    return this.handle.find({'test':{ '$eq' : 'true' }});
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

    if (!data) {
      return false;
    }

    var payload = {
      hash: data.hash
    };

    //the assumption is there should only ever be one match possible
    var record = this.handle.findOne(payload);

    /*
      if we have a loki ID, we should defintly try and match it,
      problem is we need to check for conflicts first before reassigning it
    */
    if (data.$loki && record) {
      if (record.$loki == data.$loki) {
        return true;
      }
    }

    if (record == null) {
      return true;
    } else {
      return false;
    }


  },
  update: function(payload) {

    var data = payload;

    if (data.$loki) {
      data.$loki = Number(data.$loki);
    }

    if (!data.port) {
      data.port = null;
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
      delete payload.status;
      this.handle.update(payload);

      return payload;
    } else {
      console.log('was not unique');
      return false;
    }
  },
  setStatus: function($loki, status) {
    var server = this.read($loki);
    server.status = status;
    this.handle.update(server);
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