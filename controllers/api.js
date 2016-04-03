var express = require('express');
var router = express.Router();
var Servers = require('./servers');
var Server = require('./server');
var Groups = require('./groups');

/* GET home page. */
router.get('/', function(req, res, next) {
  var proxyPac = req.app.get('ProxyPac');

  res.render('api', {
    title: 'ProxyPac',
    serverid: proxyPac.servers.servers[0]._id
  });
});

router.use('/servers', Servers);
router.use('/server', Server);
router.use('/groups', Groups);

module.exports = router;
