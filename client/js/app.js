'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'lbServices',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/groups', {templateUrl: 'partials/groups.html', controller: 'Groups'});
  $routeProvider.when('/group/:gid', {templateUrl: 'partials/servers.html', controller: 'Servers'});
  $routeProvider.when('/group/:gid/server/:sid', {templateUrl: 'partials/addresses.html', controller: 'Addresses'});
  $routeProvider.otherwise({redirectTo: '/groups'});
}]);
