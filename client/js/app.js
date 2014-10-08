'use strict';


// Declare app level module which depends on filters, and services
angular.module('ProxyPAC', [
  'ngRoute',
  'ProxyPAC.filters',
  'ProxyPAC.services',
  'lbServices',
  'ProxyPAC.directives',
  'ProxyPAC.controllers',
  'ui.sortable'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/groups.html', controller: 'Groups'});
  $routeProvider.when('/group/:id', {templateUrl: 'partials/group.html', controller: 'Group'});
  $routeProvider.when('/group/:id', {templateUrl: 'partials/group.html', controller: 'Group'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
