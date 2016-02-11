'use strict';

/*angular.module('mean.rules').factory('Rules', [
  function() {
    return {
      name: 'rules'
    };
  }
]);
'use strict';
*/
//Rules service used for articles REST endpoint
angular.module('mean.rules')
    .factory('Rules', ['$resource',
            function($resource) {
                return $resource('api/rules/:ruleId', {
                ruleId: '@_id'
                }, {
                update: {
                    method: 'PUT'
                }
                });
            }
            ])
    .factory('Groups', ['$resource',
            function($resource) {
                return $resource('api/groups/:groupId', {
                groupId: '@_id'
                }, {
                update: {
                    method: 'PUT'
                }
                });
            }
            ])
            ;


