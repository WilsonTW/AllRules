'use strict';

/* jshint -W098 */
angular.module('mean.rules').controller('RulesController', ['$scope', '$stateParams', '$location', '$http','Global', 'Rules', 'MeanUser','Circles','Groups',
  function($scope, $stateParams, $location, $http, Global, Rules, MeanUser,Circles,Groups) {
    $scope.global = Global;
    $scope.rules = {};
    $scope.rule = {};
    $scope.groups={};


    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchFish   = '';     // set the default search/filter term
        
    $scope.hasAuthorization = function(rule) {
      if (!rule || !rule.user) return false;
      return MeanUser.isAdmin || rule.user._id === MeanUser.user._id;
    };
    
    $scope.popup1 = {
        opened: false
    };
    $scope.testdataerror=false;
    
    $scope.popup2 = {
        opened: false
    };
    $scope.testdataresult='';
        
    $scope.openpicker1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.openpicker2 = function() {
        $scope.popup2.opened = true;
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
        var rule = new Rules($scope.rule);

        rule.$save(function(response) {
          $location.path('rules/' + response._id);
        });

        $scope.rules = {};

      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(rule) {
      if (rule) {
        rule.$remove(function(response) {
          for (var i in $scope.rules) {
            if ($scope.rules[i] === rule) {
              $scope.rules.splice(i, 1);
            }
          }
          $location.path('rules');
        });
      } else {
        $scope.rules.$remove(function(response) {
          $location.path('rules');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var rule = $scope.rule;
        if (!rule.updated) {
          rule.updated = [];
        }
        rule.updated.push(new Date().getTime());

        rule.$update(function() {
          $location.path('rules/' + rule._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.findGroups = function() {
      Groups.query(function(groups) {
        $scope.groups = groups;
      });
    };

    $scope.find = function() {
      Rules.query(function(rules) {
        $scope.rules = rules;
      });
    };

    $scope.findOne = function() {
      Rules.get({
        ruleId: $stateParams.ruleId
      }, function(rule) {
        $scope.rule = rule;
      });
    };
    
    $scope.documentupdate = function(testdata) {
        $scope.testdataerror=false;
        try{
            testdata = JSON.parse(testdata);
        } catch (ex) {
            $scope.testdataerror=true;
        }
    }
    
    $scope.cmdtestdata = function (testdata,execIf,execThen,execElse) {
        var td={};
        $scope.testdataerror=false;
        try{
            td = JSON.parse(testdata);
        } catch (ex) {
            $scope.testdataerror=true;
            return;
        }
        $scope.testdataresult = '';    
        $http({
            method: 'PUT',
            url: '/api/rulesprocessor/testdata' ,
            headers: {
                'Content-Type': 'application/json'
                },
            data: {
                "document": td,
                "execIf":execIf,
                "execThen":execThen,
                "execElse":execElse
                }
            }).then(function successCallback(response) {
                if (response.data === undefined) {
                    $scope.testdataresult = '';
                } else {
                    $scope.testdataresult = '' + 
                    'IF() evaluated to: ' + response.data.resExecIf.var0 + 
                    '\nThen() evaluated to: ' + JSON.stringify(response.data.resExecThen) +
                    '\nElse() evaluated to: ' + JSON.stringify(response.data.resExecElse);
                }
            }, function errorCallback(response) {
                $scope.testdataresult = 'Error: (HTTP ' + response.status + ') ' +  response.data.error;
            });
        }
    
    
    
  }
]);