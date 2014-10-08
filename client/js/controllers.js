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
    $scope.editing = null;
    $scope.sortableOptions = {
      update: function(e, ui) { 
        $scope.servers.forEach(function(item, i) {
            item.order = i;
            item.$save();
        });
      },
      axis: 'y'
    };
    $scope.save = function() {
      
       this.server.$save(function() {
         $scope.editing  = null;
       });
       
    };
    $scope.editable = function() {

      var idx = this.server.id;
      $scope.editing = idx;
      
    };

  }])
  .controller('Addresses', ['$scope', 'Group', '$routeParams', function($scope, Group, $routeParams) {
    $scope.addresses = Group.Address({id: $routeParams.id});
    $scope.$watch('addresses', function(newVal, oldVal) {
      if (newVal !== oldVal && oldVal != undefined ) {
        /* must be a better way to call the function */
        $scope.addresses.forEach(function(item, i) {
          item.$save();
        });
      }
    }, true);
  }])
  .controller('Group', ['$scope', 'Group', '$routeParams', function($scope, Group, $routeParams) {
    $scope.group = Group.get({id: $routeParams.id});

    $scope.$watch('group.name', function(newVal, oldVal) {
      if (newVal !== oldVal && oldVal != undefined ) {
        $scope.group.$save();
      }
    });

  }]);
