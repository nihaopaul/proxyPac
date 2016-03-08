/* required */
var express = require('express');
var router = express.Router();

var passport = require('passport');

/* GET home page. */
router.all('/',passport.authenticate('basic', { session: false }));

router.get('/',
  function(req, res, next) {
    var proxyPac = req.app.get('ProxyPac');
    res.json(proxyPac.groups.get());
  });

router.get('/name/:name',
  function(req, res) {
    var proxyPac = req.app.get('ProxyPac');
    res.json(proxyPac.groups.findGroupByName(req.params.name));
  });

router.get('/id/:id',
  function(req, res) {
    var proxyPac = req.app.get('ProxyPac');
    res.json(proxyPac.groups.findGroupByID(req.params.id));
  });

module.exports = router;
