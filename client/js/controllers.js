'use strict';

/* Controllers */

angular.module('ProxyPAC.controllers', [])
  .controller('Groups', ['$scope', 'Group', '$routeParams', function($scope, Group, $routeParams) {
    $scope.groups = Group.find();


    $scope.sortableOptions = {
      update: function(e, ui) { 
        $scope.groups.forEach(function(e, i) {
           e.order = i;
           e.$save();
        });

      },
      axis: 'y'
    };


  }])
  .controller('Servers', ['$scope', 'Group', '$routeParams', function($scope, Group, $routeParams) {

    $scope.servers = Group.Servers({id: $routeParams.id});

    $scope.sortableOptions = {
      update: function(e, ui) { 
        $scope.servers.forEach(function(item, i) {
            item.order = i;
            item.$save();
        });

      },
      axis: 'y'
    };

  }])
  .controller('Addresses', ['$scope', 'Group', '$routeParams', function($scope, Group, $routeParams) {
    $scope.addresses = Group.Address({id: $routeParams.id});

  }])
  .controller('Group', ['$scope', 'Group', '$routeParams', function($scope, Group, $routeParams) {
    $scope.group = Group.get({id: $routeParams.id});
    $scope.unedit = true;
    $scope.changeToInput = function() {
      $scope.unedit = !$scope.unedit;
    };
    $scope.$watch('group.name', function(i) {
      if (typeof(i) != "undefined") {
        $scope.group.$save();
      }
      
    }, true);

  }]);
