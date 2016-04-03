/**
* - TODO: Integrate/rewrite this.
**/
var records = require('../db/auth.json') || [];

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      record.verifyPassword = function(password) {
        if (password === this.password) {
          return true;
        }
        return false;
      };
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}