'use strict';

angular.module('mean.groups').factory('Groups', ['$resource',
  function($resource) {
    return $resource('api/groups/:groupId', {
      groupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);