'use strict';


// Declare app level module which depends on filters, and services
angular.module('ProxyPAC', [
  'ngRoute',
  'ProxyPAC.filters',
  'ProxyPAC.services',
  'lbServices',
  'ProxyPAC.directives',
  'ProxyPAC.controllers',
  'ui.sortable',
  'xeditable'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/groups.html', controller: 'Groups'});
  $routeProvider.when('/group/:id', {templateUrl: 'partials/group.html', controller: 'Group'});
  $routeProvider.when('/group/:id', {templateUrl: 'partials/group.html', controller: 'Group'});
  $routeProvider.otherwise({redirectTo: '/'});
}]).run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});