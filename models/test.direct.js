/***
 * Test
 ***/
"use strict";

var Test = (function() {

  //constructor
  function Test(address, port, callback) {
    return callback(false, 'direct connection');
  };

  return Test;

})();

module.exports = Test;