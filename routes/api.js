var express = require('express');
var router = express.Router();

var db = require("../models/db");

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
