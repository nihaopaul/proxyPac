/* required */
var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.all('/',passport.authenticate('basic', { session: false }));

router.get('/id/:id',
  function(req, res) {
    var proxyPac = req.app.get('ProxyPac');
    res.json(proxyPac.servers.findServerByID(req.params.id));
  });

module.exports = router;
