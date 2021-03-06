var request = require('request');
var util = require('util');
var inspect = util.inspect;
var ejs = require('ejs');
var fs = require('fs');




var Servers = function(json) {
  this.type = json.type;
  this.address = json.address || null;
  this.port = json.port || null;
  this.order = json.order || 0;
};

var Addresses = function(json) {
  this.url = json.url;
};



var Groups = function(json) {

  var self = this;
  this.name = json.name;
  this.order = json.order;
  this.id = json.id;



  this.hostList(function(value) {
    self.hosts = value;
  });

  this.serverList(function(value) {
    self.servers = value;

  });

};

Groups.prototype = {
  serverList: function(cb) {
    var self = this;
    var uri = 'http://127.0.0.1:3000/api/Groups/'+this.id+'/Servers';
    request({url: uri}, function (error, response, body) {
      var servers = [];
      JSON.parse(body).forEach(function(item, i) {
        servers.push(new Servers(item));
      });

      servers.sort(function(a,b) {
        return a.order - b.order;
      });

      cb(servers);
    });


  },

  hostList: function(cb) {
    var self = this;
    var uri = 'http://127.0.0.1:3000/api/Groups/'+this.id+'/Address';
    request({url: uri}, function (error, response, body) {
      var addresses = [];
      JSON.parse(body).forEach(function(item, i) {

        addresses.push(new Addresses(item));

      });
      cb(addresses);
    });

  },
};







var requestor = function() {

  this.proxyPac = {
    groups: [],
    filename: './server/template/FindProxyForURL.ejs'
  };
  
  this.dbfile = './persistentDB/database.json';

  this.ProxyPacFile = '';
  this.timeOutWatch = '';
  this.templateWatch = '';

  this.template();
  this.build();

};

requestor.prototype = {
  build: function() {

    var self = this;
    request({url: 'http://127.0.0.1:3000/api/Groups'}, 
      function (err, response, body) {

        if (err) {
          console.log('could not connect');
          self.rebuild();
          return false;
        }

        self.proxyPac.groups = [];

        JSON.parse(body).forEach(function(item, i) {
          self.proxyPac.groups.push(new Groups(item));
        });
        //sort based on the preconfigured order
        self.proxyPac.groups.sort(function(a,b) {
          return a.order - b.order;
        });

      }
    );
    self.watchDBFile();

  }, 
  watchDBFile: function() {
    var self = this;

    fs.exists(this.dbfile, function (exists) {
      if (exists) {
        fs.watch(self.dbfile, function (event, filename) {
          clearTimeout(self.timeOutWatch); 
          self.timeOutWatch = setTimeout(function() { self.build(); }, 500);
        });
      } else {
        console.log('did not setup watch on the database file, ' + 
          'configure first via the web interface and then restart node');
      }
    });

  },
  rebuild: function() {
    console.log('rebuilding');
    var self = this;
    setTimeout(function() {
      self.build();
    }, 5000);
  },
  watchTemplate: function() {
    var self = this;
    fs.watch(this.proxyPac.filename, function (event, filename) {

      clearTimeout(self.templateWatch); 
      self.templateWatch = setTimeout(function() { self.template(); }, 500);
    });
  },
  template: function() {
    var self = this;
    fs.readFile(this.proxyPac.filename, function (err, data) {
      if (err) throw err;
      console.log('Loading Template.');
      self.ProxyPacFile = data.toString();
    });
    self.watchTemplate();
  }
};

var ProxyFiles = [
  '/proxy.pac',
  '/wpad.dat',
  '/wpad.pac',
];
var r = new requestor();


module.exports = function() {

  return function(req, res, next) {
    if (ProxyFiles.indexOf(req.url) > -1) {
      res.header('Content-Type', 'application/x-ns-proxy-autoconfig');
      res.send(ejs.render(r.ProxyPacFile, r.proxyPac));
    } else {
      next();
    }
  };
    
};

