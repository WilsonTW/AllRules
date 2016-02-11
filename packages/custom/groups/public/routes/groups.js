'use strict';

angular.module('mean.groups').config(['$stateProvider',
  function($stateProvider) {
  /*  $stateProvider.state('groups example page', {
      url: '/groups/example',
      templateUrl: 'groups/views/index.html'
    });
  }*/
  
    $stateProvider
      .state('all groups', {
        url: '/groups',
        templateUrl: '/groups/views/group-list.html',
        requiredCircles : {
          circles: ['authenticated'],
          denyState: 'auth.login'
        }
      })
      .state('create group', {
        url: '/groups/create',
        templateUrl: '/groups/views/group-create.html',
        requiredCircles : {
          circles: ['can create content']
        }
      })
      .state('edit group', {
        url: '/groups/:groupId/edit',
        templateUrl: '/groups/views/group-edit.html',
        requiredCircles : {
          circles: ['can edit content']
        }
      })
      .state('group by id', {
        url: '/groups/:groupId',
        templateUrl: '/groups/views/group-view.html',
        requiredCircles : {
          circles: ['authenticated'],
          denyState: 'auth.login'
        }
      });


  }
]);
