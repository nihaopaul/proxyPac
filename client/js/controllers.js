'use strict';

/* Controllers */

angular.module('ProxyPAC.controllers', [])
  .controller('Groups', ['$scope', 'Group', '$routeParams', function($scope, Group, $routeParams) {
    $scope.groups = Group.find();
  }])
  .controller('Servers', ['$scope', 'Group', '$routeParams', function($scope, Group, $routeParams) {
    $scope.group = $routeParams.gid;
    $scope.servers = Group.Servers({id: $routeParams.gid});
  }])
  .controller('Addresses', ['$scope', 'Group', 'Server', '$routeParams', function($scope, Group, Server, $routeParams) {
    $scope.group = $routeParams.gid;
    $scope.server = $routeParams.sid;
    $scope.addresses = Server.Addresses({id: $routeParams.sid});
  }]);
