'use strict';

/* jshint -W098 */
angular.module('mean.rulesprocessor').controller('rulesprocessorController', ['$scope', 'Global', 'rulesprocessor','$http','$window',
  function($scope, Global, rulesprocessor,$http,$window) {
    $scope.global = Global;

    $scope.logcurrentpage=1;
    $scope.logtotalitems=0;
    $scope.pages=0;
    
    $scope.package = {
      name: 'rulesprocessor'
    };
    
    $scope.logentries = [];
   
    $scope.findentries = function() {
        $scope.logentries = [];
            
        $http({
                method: 'GET',
                url: '/api/rulesprocessor/logs/entries/' + $scope.logcurrentpage})
            .then(function successCallback(response) {
                $scope.logentries = response.data;
                $scope.logtotalitems= response.data.totalitems;
                $scope.pages= response.data.pages;
                console.log('executed query');
            });
  }
  
   $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.logcurrentpage);
    $scope.findentries();
  };
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
