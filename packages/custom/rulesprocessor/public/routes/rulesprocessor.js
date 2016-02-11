'use strict';

angular.module('mean.rulesprocessor').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('rulesprocessor list', {
      url: '/rulesprocessor/list',
      templateUrl: 'rulesprocessor/views/list.html'
    });
  }
]);
