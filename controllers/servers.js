/* required */
var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.all('/',passport.authenticate('basic', { session: false }));

router.get('/',
  function(req, res, next) {
    var proxyPac = req.app.get('ProxyPac');
    res.json(proxyPac.servers.get());
  });
router.post('/',
  function(req, res, next) {
    var proxyPac = req.app.get('ProxyPac');
    // @type:  HTTP,HTTPS,SOCKS4,SOCKS5,DIRECT
    // @name: 'random name'
    // @port: 8080
    // @server: 'idealy an ip address'
    var proxy = {
      type: req.headers.type || undefined,
      name: req.headers.name || undefined,
      port: req.headers.port || undefined,
      server: req.headers.server || undefined
    };
    proxyPac.servers.create(proxy);
    // console.log(req.headers.key);
    res.sendStatus(200);
  });



module.exports = router;
