'use strict';

/* jshint -W098 */
/*angular.module('mean.groups').controller('GroupsController', ['$scope', 'Global', 'Groups',
  function($scope, Global, Groups) {
    $scope.global = Global;
    $scope.package = {
      name: 'groups'
    };
  }
]);


*/

angular.module('mean.groups').controller('GroupsController', ['$scope', '$stateParams', '$location', 'Global', 'Groups','MeanUser','Circles',
  function($scope, $stateParams, $location, Global, Groups, MeanUser,Circles) {
      

    $scope.global = Global;
    $scope.groups = {};

    $scope.hasAuthorization = function(group) {
      if (!group || !group.user) return false;
      return MeanUser.isAdmin || group.user._id === MeanUser.user._id;
    };


    $scope.availableCircles = [];

    Circles.mine(function(acl) {
        $scope.availableCircles = acl.allowed;
        $scope.allDescendants = acl.descendants;
    });

    $scope.showDescendants = function(permission) {
        var temp = $('.ui-select-container .btn-primary').text().split(' ');
        temp.shift(); //remove close icon
        var selected = temp.join(' ');  
        $scope.descendants = $scope.allDescendants[selected];
    };

    $scope.selectPermission = function() {
        $scope.descendants = [];
    };

    $scope.create = function(isValid) {
      if (isValid) {
        // $scope.article.permissions.push('test test');
        var group = new Groups($scope.groups);

        group.$save(function(response) {
          $location.path('groups/' + response._id);
        });

        $scope.groups = {};

      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(group) {
      if (group) {
        group.$remove(function(response) {
          for (var i in $scope.groups) {
            if ($scope.groups[i] === group) {
              $scope.groups.splice(i, 1);
            }
          }
          $location.path('groups');
        });
      } else {
        $scope.groups.$remove(function(response) {
          $location.path('groups');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var group = $scope.group;
        if (!group.updated) {
          group.updated = [];
        }
        group.updated.push(new Date().getTime());

        group.$update(function() {
          $location.path('groups/' + group._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Groups.query(function(groups) {
        $scope.groups = groups;
      });
    };

    $scope.findOne = function() {
      Groups.get({
        groupId: $stateParams.groupId
      }, function(group) {
        $scope.groups = group;
      });
    };
  }
]);