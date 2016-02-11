'use strict';

/* jshint -W098 */
angular.module('mean.rulesprocessor').controller('rulesprocessorController', ['$scope', 'Global', 'rulesprocessor','$http','$window',
  function($scope, Global, rulesprocessor,$http,$window) {
    $scope.global = Global;
    $scope.package = {
      name: 'rulesprocessor'
    };
    
    $scope.logentries = [];
   
    $scope.findentries = function() {
        $scope.logentries = [];
            
        $http({
                method: 'GET',
                url: '/api/rulesprocessor/logs/entries'})
            .then(function successCallback(response) {
                $scope.logentries = response.data;
            });
  }
  
    $scope.clearlogs = function () {

        if ($window.confirm('Are you sure you want to clear all the logs?')) {
            $http({
                    method: 'GET',
                    url: '/api/rulesprocessor/logs/clearentries'})
                .then(function successCallback(response) {
                        $scope.findentries();        
                });
            
        }        
    }
  
  
  
  }
]);
