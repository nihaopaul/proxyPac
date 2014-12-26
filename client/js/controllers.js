'use strict';

/* Controllers */

angular.module('ProxyPAC.controllers', [])
  .controller('Groups', ['$scope', 'Group', '$routeParams', '$location', function($scope, Group, $routeParams, $location) {
    $scope.groups = Group.find();
    $scope.sortableOptions = {
      stop: function(e, ui) { 


        ui.item.scope().groups.forEach(function(item, i){
          item.order = i;
          item.$save();
        })
       

      },
      axis: 'y'
    };
    $scope.viewGroup = function() {

      $location.path('/group/' + this.group.id);

    };
    $scope.addNewGroup = function() {
      var group = new Group({name: this.newGroup.name, order: ($scope.groups.length)});
      group.$save();
      $scope.groups.push(group);
      this.newGroup.name = null;
    };
    $scope.remove = function() {
      var id = this.$index;
      this.group.$remove(function() {
        $scope.groups = Group.find();
      });
    };

  }])
  .controller('Servers', ['$scope', 'Group', 'Server', '$routeParams', function($scope, Group, Server, $routeParams) {

    $scope.servers = [];

    function getServers() {
      Group
      .Servers({id: $routeParams.id})
      .$promise
      .then(function(results) {
        $scope.servers = results;
      });
    }
    getServers();
    
    $scope.editing = null;
    $scope.sortableOptions = {
      stop: function(e, ui) { 

        ui.item.scope().servers.forEach(function(item, i){
          item.order = i;
          item.$save();
        })
        $scope.editing = null;
      },
      axis: 'y'
    };
    $scope.save = function() {

      switch(this.server.type) {
        case 'DELETE':
          Server
          .deleteById(this.server)
          .$promise
          .then(function() {
            $scope.editing  = null;
            getServers();
          });
        break;
        case 'DIRECT':
          console.log(this.server);
          this.server.address = null;
          this.server.port = null;
          this.server.$save(function() {
            $scope.editing  = null;
          });

        break;
        default:
          this.server.$save(function() {
            $scope.editing  = null;
          });
      }


       
    };
    $scope.editable = function() {
      var idx = this.server.id;
      $scope.editing = idx;
    };

    $scope.newServer = { };

    $scope.new = function() {
      $scope.newServer.order =  $scope.servers.length;
      $scope.newServer.groupId = $routeParams.id;

      Server
      .create($scope.newServer)
      .$promise
      .then(function(address) {
        $scope.newServer = {};
        getServers();
      });




    };

  }])
  .controller('Addresses', ['$scope', 'Group', 'Address', '$routeParams', function($scope, Group, Address, $routeParams) {
    $scope.addresses = [];

    function getAddresses() {
      Group
      .Address({id: $routeParams.id})
      .$promise
      .then(function(results) {
        $scope.addresses = results;
      });
    }
    getAddresses();

    $scope.remove = function() {
      // this.address.$remove()
      Address
      .deleteById(this.address)
      .$promise
      .then(function() {
        getAddresses();
      });
    };

    $scope.$watch('addresses', function(newVal, oldVal) {
      //keep it clean, check for empties
      $scope.addresses.forEach(function(item, i) {  

        if (!item.url) {
          Address
          .deleteById(item)
          .$promise
          .then(function() {
            getAddresses();
          });
        }
      });
      
    }, true);

    $scope.newAddress = { };
    $scope.addNewAddress = function() {
      if ($scope.newAddress.url) {
        Address
        .create({"url" :$scope.newAddress.url, "groupId": $routeParams.id})
        .$promise
        .then(function(address) {
          $scope.newAddress = {};
          getAddresses();
        });
      }
    }
  }])
  .controller('Group', ['$scope', 'Group', '$routeParams', function($scope, Group, $routeParams) {
    $scope.group = Group.get({id: $routeParams.id});

    $scope.$watch('group.name', function(newVal, oldVal) {
      if (newVal !== oldVal && oldVal != undefined ) {
        $scope.group.$save();
      }
    });

  }]);
