var express = require('express');
var router = express.Router();
var config = require('../config');
var db = require("../models/db");


/* GET home page. */
router.get('/', function(req, res) {
  var servers = db.ProxyServers.fetchAll();
  var groups = {};
  res.render('index', { title: 'ProxyPac', version: config.version, page: 'servers', servers: servers, groups: groups });
});
router.get('/servers', function(req, res) {
  var servers = db.ProxyServers.fetchAll();
  var groups = {};
  res.render('index', { title: 'ProxyPac', version: config.version, page: 'servers',  servers: servers, groups: groups });
});
router.get('/groups', function(req, res) {
  var servers = db.ProxyServers.fetchAll();
  var groups = {};
  res.render('index', { title: 'ProxyPac', version: config.version, page: 'groups',  servers: servers, groups: groups });
});



module.exports = router;
