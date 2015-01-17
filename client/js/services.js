'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('ProxyPAC.services', ['lbServices']).
  value('version', '0.9');
