'use strict';

angular.module('mean.rules').config(['$stateProvider',
  function($stateProvider) {


    // states for my app
    $stateProvider
      .state('all rules', {
        url: '/rules',
        templateUrl: '/rules/views/rule-list.html',
        requiredCircles : {
          circles: ['authenticated'],
          denyState: 'auth.login'
        }
      })
      .state('create rule', {
        url: '/rules/create',
        templateUrl: '/rules/views/rule-create.html',
        requiredCircles : {
          circles: ['can create content']
        }
      })
      .state('edit rule', {
        url: '/rules/:ruleId/edit',
        templateUrl: '/rules/views/rule-edit.html',
        requiredCircles : {
          circles: ['can edit content']
        }
      })
      .state('rule by id', {
        url: '/rules/:ruleId',
        templateUrl: '/rules/views/rule-view.html',
        requiredCircles : {
          circles: ['authenticated'],
          denyState: 'auth.login'
        }
      });


  }
]);
