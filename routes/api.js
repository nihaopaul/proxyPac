var express = require('express');
var router = express.Router();

var db = require("../models/db");


/* GET users listing. */
router.get('/', db.index);


router.post('/servers/save', function(req,res) {

  if (req.body.$loki >=0) {

    var resp = db.ProxyServers.update(req.body);
    res.json(resp);

  } else {
    var resp = db.ProxyServers.create(req.body);
    res.json(resp);
  }


});

router.get('/servers/get/:id', function(req,res) {
  // res.json(db.ProxyServers.fetchAll());
  var resp = db.ProxyServers.read(req.params.id);
  res.json(resp);
});

router.get('/servers/all', function(req,res) {
  // res.json(db.ProxyServers.fetchAll());
  var resp = db.ProxyServers.fetchAll();
  res.json(resp);
});

router.delete('/servers/delete/:id', function(req,res) {
  // res.json(db.ProxyServers.fetchAll());
  var resp = false;
  if (req.params.id) {
    var $item = db.ProxyServers.read(req.params.id);
    if ($item) {
      resp = db.ProxyServers.delete($item);
    }

  }
  res.json(resp);


});


module.exports = router;