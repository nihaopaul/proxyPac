/* required */
var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  var proxyPac = req.app.get('ProxyPac');
  res.json(proxyPac.config.servers);
});

module.exports = router;
